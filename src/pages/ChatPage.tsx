import { signOut } from 'aws-amplify/auth'
import { useState } from 'react'
import type { Message } from '../lib/messages'
import { createWelcomeMessage } from '../lib/messages'
import logo from '../assets/logo.png'

interface ChatPageProps {
  onLogout: () => void
}

export function ChatPage({ onLogout }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([createWelcomeMessage()])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: 'user',
        timestamp: new Date(),
      }
      setMessages([...messages, userMessage])
      setInput('')

      // Simulate bot response
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thank you for your message! I am processing your request.',
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }, 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } finally {
      onLogout()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <img src={logo} alt="Bytes Commerce Logo" className="logo" />
          <div className="header-content">
            <h1>Help Desk</h1>
            <p>Customer Service Agent</p>
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
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          rows={1}
        />
        <button onClick={handleSend} className="send-btn">
          Send
        </button>
      </div>
    </div>
  )
}
