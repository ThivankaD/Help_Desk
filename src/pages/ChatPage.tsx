import { signOut } from 'aws-amplify/auth'
import { useEffect, useRef, useState } from 'react'
import type { Message } from '../lib/messages'
import { createWelcomeMessage } from '../lib/messages'
import { streamAgentResponse } from '../lib/agentservice.ts'
import ReactMarkdown from 'react-markdown'

import logo from '../assets/logo.png'

interface ChatPageProps {
  onLogout: () => void
}

// One stable session ID per browser tab
const SESSION_ID = crypto.randomUUID()

export function ChatPage({ onLogout }: ChatPageProps) {
  const [messages, setMessages]     = useState<Message[]>([createWelcomeMessage()])
  const [input, setInput]           = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef                   = useRef<HTMLDivElement>(null)

  // Auto-scroll whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    // 1. Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }

    // 2. Add empty bot bubble we'll stream into
    const botId = `bot-${Date.now()}`
    const botMsg: Message = {
      id: botId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
    setIsStreaming(true)

    await streamAgentResponse(text, SESSION_ID, {
      onChunk: (chunk) => {
        setMessages(prev =>
          prev.map(m => m.id === botId ? { ...m, text: m.text + chunk } : m)
        )
      },
      onDone: () => {
        setIsStreaming(false)
      },
      onError: (err) => {
        setMessages(prev =>
          prev.map(m => m.id === botId ? { ...m, text: `⚠️ ${err}` } : m)
        )
        setIsStreaming(false)
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } finally {
      onLogout()
    }
  }

  // The last message (used to show blinking cursor)
  const lastMsg = messages[messages.length - 1]

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <img src={logo} alt="Bytes Commerce Logo" className="logo" />
          <div className="header-content">
            <h1>Help Desk</h1>
            
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-bubble">
              <div className="markdown-body">
                <ReactMarkdown>
                  {message.text || (isStreaming && message.id === lastMsg?.id ? '' : '…')}
                </ReactMarkdown>
                {isStreaming && message.id === lastMsg?.id && (
                  <span className="streaming-cursor">▪️▪️▪️</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? 'Agent is typing…' : 'Type your message here...'}
          rows={1}
          disabled={isStreaming}
        />
        <button
          onClick={() => void handleSend()}
          className="send-btn"
          disabled={isStreaming}
        >
          {isStreaming ? '…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
