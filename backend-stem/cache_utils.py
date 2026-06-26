"""
Redis caching utility for STEM Academia backend.
Provides simple get/set/delete operations with TTL support.
"""
import os
import json
import logging
from typing import Optional, Any
import redis

logger = logging.getLogger(__name__)

# Redis client singleton
redis_client: Optional[redis.Redis] = None


def get_redis_client() -> Optional[redis.Redis]:
    """Get or create Redis client connection."""
    global redis_client
    
    if redis_client is not None:
        return redis_client
    
    redis_url = os.getenv("REDIS_URL")
    if not redis_url:
        logger.warning("⚠️ REDIS_URL not set. Caching disabled.")
        return None
    
    try:
        redis_client = redis.from_url(
            redis_url,
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True,
            health_check_interval=30
        )
        # Test connection
        redis_client.ping()
        logger.info("✅ Redis connected successfully")
        return redis_client
    except Exception as e:
        logger.error(f"❌ Redis connection failed: {e}")
        redis_client = None
        return None


def cache_get(key: str) -> Optional[Any]:
    """Get value from cache. Returns None if not found or Redis unavailable."""
    client = get_redis_client()
    if not client:
        return None
    
    try:
        value = client.get(key)
        if value:
            logger.debug(f"📦 Cache HIT: {key}")
            return json.loads(value)
        logger.debug(f"❌ Cache MISS: {key}")
        return None
    except Exception as e:
        logger.error(f"❌ Redis GET error: {e}")
        return None


def cache_set(key: str, value: Any, ttl: int = 3600) -> bool:
    """
    Set value in cache with TTL.
    
    Args:
        key: Cache key
        value: Value to cache (will be JSON serialized)
        ttl: Time to live in seconds (default: 1 hour)
    
    Returns:
        True if successful, False otherwise
    """
    client = get_redis_client()
    if not client:
        return False
    
    try:
        client.setex(key, ttl, json.dumps(value, ensure_ascii=False))
        logger.debug(f"💾 Cache SET: {key} (TTL: {ttl}s)")
        return True
    except Exception as e:
        logger.error(f"❌ Redis SET error: {e}")
        return False


def cache_delete(key: str) -> bool:
    """Delete value from cache."""
    client = get_redis_client()
    if not client:
        return False
    
    try:
        client.delete(key)
        logger.debug(f"🗑️ Cache DELETE: {key}")
        return True
    except Exception as e:
        logger.error(f"❌ Redis DELETE error: {e}")
        return False


def cache_clear_pattern(pattern: str) -> bool:
    """Delete all keys matching pattern (e.g., 'products:*')."""
    client = get_redis_client()
    if not client:
        return False
    
    try:
        keys = client.keys(pattern)
        if keys:
            client.delete(*keys)
            logger.debug(f"🗑️ Cache CLEAR pattern: {pattern} ({len(keys)} keys)")
        return True
    except Exception as e:
        logger.error(f"❌ Redis CLEAR error: {e}")
        return False
