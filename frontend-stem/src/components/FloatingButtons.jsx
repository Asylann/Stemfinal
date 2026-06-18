import { useEffect, useRef, useState } from 'react'
import './FloatingButtons.css'
import { chatWithGrok } from '../api/api'
import Icon from './Icons'

export default function FloatingButtons() {
  const phoneNumber = '77770016786'
  const message = 'Здравствуйте! Интересует ваш товар'
  const telegramUsername = 'stemacademia'
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [chatInput, setChatInput] = useState('')
  const [chatOpen, setChatOpen] = useState(() => {
    return localStorage.getItem('stem_chat_open') === 'true'
  })
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState('')
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('stem_chat_messages')
      if (saved) return JSON.parse(saved)
    } catch {}
    return [{
      role: 'assistant',
      content: 'Здравствуйте. Я ИИ-помощник STEM Academia. Задайте вопрос о товарах, доставке, оплате или подборе решения.'
    }]
  })

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  const telegramLink = `https://t.me/${telegramUsername}`

  useEffect(() => {
    function handleOpenChat() {
      setChatOpen(true)
    }

    window.addEventListener('open-grok-chat', handleOpenChat)
    return () => window.removeEventListener('open-grok-chat', handleOpenChat)
  }, [])

  useEffect(() => {
    if (chatOpen) {
      inputRef.current?.focus()
    }
  }, [chatOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, chatOpen])

  // Persist chat messages
  useEffect(() => {
    try { localStorage.setItem('stem_chat_messages', JSON.stringify(chatMessages)) } catch {}
  }, [chatMessages])

  function openChat() {
    setChatOpen(true)
    setChatError('')
    localStorage.setItem('stem_chat_open', 'true')
  }

  function closeChat() {
    setChatOpen(false)
    localStorage.setItem('stem_chat_open', 'false')
  }

  async function handleSendMessage(event) {
    event.preventDefault()

    const text = chatInput.trim()
    if (!text || chatLoading) return

    setChatInput('')
    setChatError('')

    const nextMessages = [...chatMessages, { role: 'user', content: text }]
    setChatMessages(nextMessages)
    setChatLoading(true)

    try {
      const response = await chatWithGrok(text, nextMessages)
      const reply = response?.reply?.trim()

      setChatMessages(current => [
        ...current,
        {
          role: 'assistant',
          content: reply || 'Не удалось получить ответ. Попробуйте ещё раз.'
        }
      ])
    } catch {
      setChatError('Не удалось подключиться к ИИ. Попробуйте ещё раз.')
      setChatMessages(current => [
        ...current,
        {
          role: 'assistant',
          content: 'Не удалось подключиться к ИИ. Попробуйте ещё раз.'
        }
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="floating-buttons-container">
      <a
        href="#grok-chat"
        className="float-btn grok"
        title="Открыть чат с ИИ"
        aria-label="Открыть чат с ИИ"
        onClick={(event) => {
          event.preventDefault()
          openChat()
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2.5a9.5 9.5 0 1 0 6.4 16.5l2.3.9-.9-2.3A9.5 9.5 0 0 0 12 2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M8.2 10.2h7.6M8.2 13.8h4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M16.6 8.2l.4-1 .4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4Z" fill="currentColor"/>
        </svg>
      </a>
      
      {/*  Кнопка Telegram */}
      <a
        href={telegramLink}
        target="_blank"
        rel="noopener noreferrer"
        className="float-btn telegram"
        title="Написать в Telegram"
        aria-label="Написать в Telegram"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </a>

      {/*  Кнопка WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="float-btn whatsapp"
        title="Написать в WhatsApp"
        aria-label="Написать в WhatsApp"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      {/* Instagram */}
      

      {chatOpen && (
        <div className="grok-chat-overlay" role="dialog" aria-modal="true" aria-labelledby="grok-chat-title">
          <div className="grok-chat-panel">
            <div className="grok-chat-header">
              <div>
                <p className="grok-chat-kicker">STEM Academia</p>
                <h3 id="grok-chat-title">Чат с ИИ</h3>
              </div>
              <button type="button" className="grok-chat-close" onClick={closeChat} aria-label="Закрыть чат">
                <Icon.X width="14" height="14" />
              </button>
            </div>

            <div className="grok-chat-body">
              {chatMessages.map((item, index) => (
                <div key={`${item.role}-${index}`} className={`grok-chat-bubble grok-chat-bubble--${item.role}`}>
                  {item.content}
                </div>
              ))}
              {chatLoading && (
                <div className="grok-chat-bubble grok-chat-bubble--assistant grok-chat-bubble--loading">
                  ИИ печатает...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="grok-chat-composer" onSubmit={handleSendMessage}>
              <textarea
                ref={inputRef}
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Спросите про товар, доставку, цены или подбор решения"
                rows="3"
              />
              <div className="grok-chat-actions">
                <span className="grok-chat-status">{chatError || 'Ответы формируются через ИИ'}</span>
                <button type="submit" disabled={chatLoading || !chatInput.trim()}>
                  {chatLoading ? 'Отправка...' : 'Отправить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}