"""
Bitrix24 status sync router.

Provides endpoints for:
  - Fetching deal status from Bitrix24 CRM for a single application
  - Bulk syncing all open applications' statuses from Bitrix24

Requires a valid admin JWT (get_current_admin dependency).
"""

import os
from typing import Dict, Optional

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Application, User
from routerss.auth import get_current_admin

load_dotenv()

router = APIRouter()

# Separate read-only webhook for fetching data from Bitrix (avoids write-permission conflicts)
BITRIX_WEBHOOK_URL_READ = os.getenv("BITRIX_WEBHOOK_URL_READ") or os.getenv("BITRIX_WEBHOOK_URL")

# ─── Bitrix24 status ID → human-readable label mapping ──────────────────────────
# These are the default deal pipeline stages in Bitrix24.
# Custom pipelines may have different IDs — the raw STAGE_ID is always
# preserved in `bitrix_stage_id` column for reference.
BITRIX_STATUS_MAP: Dict[str, str] = {
    "NEW":                  "new",          # Новый
    "PREPARATION":          "preparing",    # Подготовка
    "PREPAYMENT_INVOICING": "invoicing",    # Счёт на аванс
    "EXECUTING":            "processing",   # В работе
    "FINAL_INVOICING":      "final_invoice",# Финальный счёт
    "PREPAID":              "paid",         # Оплачено (аванс)
    "WON":                  "completed",    # Завершён (выигран)
    "CLOSED":               "closed",       # Закрыт (проигрыш / отмена)
}

# Friendly Russian labels for UI display
STATUS_LABELS_RU: Dict[str, str] = {
    "new":          "Новая",
    "preparing":    "Подготовка",
    "invoicing":    "Счёт отправлен",
    "processing":   "В работе",
    "final_invoice":"Финальный счёт",
    "paid":         "Оплачено",
    "completed":    "Завершена",
    "closed":       "Закрыта",
    "unknown":      "Неизвестно",
}


async def _bitrix_request(method: str, params: Optional[Dict] = None) -> Dict:
    """
    Generic Bitrix24 REST API caller using the read-only webhook.
    Raises HTTPException on network/permission errors.
    """
    if not BITRIX_WEBHOOK_URL_READ:
        raise HTTPException(status_code=503, detail="Bitrix24 webhook не настроен (BITRIX_WEBHOOK_URL_READ)")

    url = f"{BITRIX_WEBHOOK_URL_READ.rstrip('/')}/{method}"
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(url, json=params or {})
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Bitrix24 вернул ошибку {exc.response.status_code}: {exc.response.text[:200]}",
        )
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Не удалось подключиться к Bitrix24")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Ошибка Bitrix24: {str(exc)[:200]}")


def _map_bitrix_stage(stage_id: Optional[str]) -> str:
    """Convert a Bitrix24 STAGE_ID to our internal status string."""
    if not stage_id:
        return "unknown"
    # Bitrix stage IDs can be like "NEW" or "C5:NEW" for custom pipelines
    # Strip the pipeline prefix if present
    clean_stage = stage_id.split(":")[-1] if ":" in stage_id else stage_id
    return BITRIX_STATUS_MAP.get(clean_stage, "unknown")


# ─── GET /admin/applications/{app_id}/bitrix-status ─────────────────────────────

@router.get("/applications/{app_id}/bitrix-status")
async def get_bitrix_status_for_application(
    app_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    """
    Fetch the current Bitrix24 deal status for a single application.
    Updates the local DB row with the latest status + manager info.
    """
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    if not app.bitrix_id:
        return {
            "id": app.id,
            "status": app.status or "new",
            "bitrix_id": None,
            "bitrix_stage_id": None,
            "label_ru": STATUS_LABELS_RU.get(app.status or "new", "Новая"),
            "manager_name": app.manager_name,
            "message": "Заявка ещё не отправлена в Bitrix24 (нет bitrix_id)",
        }

    result = await _bitrix_request("crm.deal.get", {"id": app.bitrix_id})
    deal = result.get("result", {})

    if not deal:
        return {
            "id": app.id,
            "status": app.status or "new",
            "bitrix_id": app.bitrix_id,
            "bitrix_stage_id": None,
            "label_ru": STATUS_LABELS_RU.get(app.status or "new", "Новая"),
            "manager_name": app.manager_name,
            "message": f"Сделка #{app.bitrix_id} не найдена в Bitrix24",
        }

    stage_id = deal.get("STAGE_ID", "")
    new_status = _map_bitrix_stage(stage_id)

    # Extract assigned manager name (ASSIGNED_BY_NAME field)
    manager_name = (
        deal.get("ASSIGNED_BY_NAME")
        or deal.get("CREATED_BY_NAME")
        or app.manager_name
    )
    manager_id_raw = deal.get("ASSIGNED_BY_ID") or deal.get("CREATED_BY_ID")

    # Persist to local DB
    app.status = new_status
    app.bitrix_stage_id = stage_id
    app.manager_name = manager_name
    if manager_id_raw:
        try:
            app.manager_id = int(manager_id_raw)
        except (ValueError, TypeError):
            pass

    from datetime import datetime
    app.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db.commit()

    return {
        "id": app.id,
        "status": new_status,
        "bitrix_id": app.bitrix_id,
        "bitrix_stage_id": stage_id,
        "label_ru": STATUS_LABELS_RU.get(new_status, "Неизвестно"),
        "manager_name": manager_name,
    }


# ─── POST /admin/bitrix/sync ────────────────────────────────────────────────────

@router.post("/bitrix/sync")
async def sync_all_bitrix_statuses(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    """
    Bulk sync statuses for all applications that have a bitrix_id.
    Returns a summary of updated / skipped / errored records.
    """
    apps_with_bitrix = (
        db.query(Application)
        .filter(Application.bitrix_id.isnot(None))
        .all()
    )

    if not apps_with_bitrix:
        return {
            "synced": 0,
            "skipped": 0,
            "errors": 0,
            "message": "Нет заявок с bitrix_id для синхронизации",
        }

    synced = 0
    errors = 0
    results = []

    for app in apps_with_bitrix:
        try:
            result = await _bitrix_request("crm.deal.get", {"id": app.bitrix_id})
            deal = result.get("result", {})

            if not deal:
                errors += 1
                results.append({"id": app.id, "bitrix_id": app.bitrix_id, "error": "Сделка не найдена"})
                continue

            stage_id = deal.get("STAGE_ID", "")
            new_status = _map_bitrix_stage(stage_id)

            manager_name = (
                deal.get("ASSIGNED_BY_NAME")
                or deal.get("CREATED_BY_NAME")
                or app.manager_name
            )
            manager_id_raw = deal.get("ASSIGNED_BY_ID") or deal.get("CREATED_BY_ID")

            app.status = new_status
            app.bitrix_stage_id = stage_id
            app.manager_name = manager_name
            if manager_id_raw:
                try:
                    app.manager_id = int(manager_id_raw)
                except (ValueError, TypeError):
                    pass

            from datetime import datetime
            app.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            synced += 1
            results.append({
                "id": app.id,
                "bitrix_id": app.bitrix_id,
                "status": new_status,
                "label_ru": STATUS_LABELS_RU.get(new_status, "Неизвестно"),
            })

        except Exception as exc:
            errors += 1
            results.append({"id": app.id, "bitrix_id": app.bitrix_id, "error": str(exc)[:200]})

    db.commit()

    return {
        "synced": synced,
        "errors": errors,
        "total": len(apps_with_bitrix),
        "results": results,
    }


# ─── GET /admin/bitrix/statuses ─────────────────────────────────────────────────

@router.get("/bitrix/statuses")
async def list_status_labels(
    _admin: User = Depends(get_current_admin),
):
    """
    Return all known status codes and their Russian labels.
    Useful for the frontend status dropdown/filter.
    """
    return [
        {"code": code, "label_ru": label}
        for code, label in STATUS_LABELS_RU.items()
    ]
