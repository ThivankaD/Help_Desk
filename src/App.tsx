import { useEffect, useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import './App.css'
import { initializeAuth, authIsConfigured } from './lib/auth'
import { LoginPage } from './pages/LoginPage'
import { ChatPage } from './pages/ChatPage'

initializeAuth()

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const restoreSession = async () => {
      if (!authIsConfigured) {
        setAuthReady(true)
        return
      }

      try {
        await getCurrentUser()
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setAuthReady(true)
      }
    }

    void restoreSession()
  }, [])

  if (!authReady) {
    return <div className="login-page login-loading">Loading…</div>
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return <ChatPage onLogout={() => setIsAuthenticated(false)} />
}

export default App
