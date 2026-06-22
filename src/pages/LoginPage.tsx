import { confirmSignIn, signIn } from 'aws-amplify/auth'
import { useState } from 'react'
import { authIsConfigured } from '../lib/auth'
import logo from '../assets/logo.png'

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!authIsConfigured) {
      setError('Cognito is not configured yet.')
      return
    }

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!username || !password) {
      setError('Enter both username and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await signIn({ username, password })

      if (result.isSignedIn) {
        setIsNewPasswordRequired(false)
        onLoginSuccess()
        event.currentTarget.reset()
        return
      }

      if (result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setIsNewPasswordRequired(true)
        setError('Set a new password to finish signing in.')
        event.currentTarget.reset()
        return
      }

      setError(`Additional sign-in step required: ${result.nextStep.signInStep}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const newPassword = String(formData.get('newPassword') ?? '')

    if (!newPassword.trim()) {
      setError('Enter a new password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await confirmSignIn({ challengeResponse: newPassword })

      if (result.isSignedIn) {
        setIsNewPasswordRequired(false)
        onLoginSuccess()
        event.currentTarget.reset()
        return
      }

      setError(`Additional sign-in step required: ${result.nextStep.signInStep}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password update failed.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = isNewPasswordRequired ? handleConfirmNewPassword : handleLogin

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-header">
          <h1>Help Desk</h1>
          <img src={logo} alt="Bytes Commerce Logo" className="logo" style={{ maxWidth: '80px' }} />
          <p>
            {isNewPasswordRequired
              ? 'Your account needs a new password before you can continue.'
              : 'Please sign in with your user account.'}
          </p>
        </div>

        {!authIsConfigured && (
          <div className="login-banner">
            Set `VITE_AWS_REGION`, `VITE_AWS_COGNITO_USER_POOL_ID`, and `VITE_AWS_COGNITO_USER_POOL_CLIENT_ID` first.
          </div>
        )}

        {error && <div className="login-banner login-banner-error">{error}</div>}

        {!isNewPasswordRequired && (
          <label className="login-field">
            <span>Username or email</span>
            <input name="username" type="text" autoComplete="username" placeholder="Enter your Cognito username" />
          </label>
        )}

        <label className="login-field">
          <span>{isNewPasswordRequired ? 'New password' : 'Password'}</span>
          <input
            name={isNewPasswordRequired ? 'newPassword' : 'password'}
            type="password"
            autoComplete={isNewPasswordRequired ? 'new-password' : 'current-password'}
            placeholder={isNewPasswordRequired ? 'Enter a new password' : 'Enter your password'}
          />
        </label>

        <button className="login-button" type="submit" disabled={loading || !authIsConfigured}>
          {loading ? (isNewPasswordRequired ? 'Updating…' : 'Signing in…') : isNewPasswordRequired ? 'Set new password' : 'Login'}
        </button>
      </form>
    </div>
  )
}
