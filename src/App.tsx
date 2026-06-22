import { useState } from 'react'
import './App.css'
import logo from './assets/logo.png'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you today? If you need information about an order or a product, please provide the order ID or product ID, respectively. If you have any other requests, let me know how I can help.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
        <button className="logout-btn">Logout</button>
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
          onKeyPress={handleKeyPress}
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

export default App
