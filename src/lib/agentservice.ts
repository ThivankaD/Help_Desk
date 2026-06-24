import { fetchAuthSession } from 'aws-amplify/auth'

const API_URL = import.meta.env.VITE_API_URL

export interface StreamCallbacks {
  onChunk: (text: string) => void
  onDone: () => void
  onError: (err: string) => void
}

export async function streamAgentResponse(
  message: string,
  sessionId: string,
  callbacks: StreamCallbacks
) {
  const { onChunk, onDone, onError } = callbacks

  if (!API_URL) {
    onError('VITE_API_URL is not configured')
    return
  }

  try {
    const session = await fetchAuthSession()

    const jwt = session.tokens?.idToken?.toString()

    if (!jwt) {
      onError('Not authenticated')
      return
    }

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: message,
        sessionId,
      }),
    })

    const text = await response.text()

    if (!response.ok) {
      onError(`API Error ${response.status}: ${text}`)
      return
    }

    try {
    const parsed = JSON.parse(text)
    const raw = 
      parsed.result ??
      parsed.response ??
      JSON.stringify(parsed)

  // Clean \n escape sequences and trim
  const clean = raw
    .replace(/\\n/g, '\n')  // convert \n string to real newline
    .trim()

  onChunk(clean)
} catch {
  onChunk(text.trim())
}

    onDone()
  } catch (err) {
    console.error(err)

    onError(
      err instanceof Error
        ? err.message
        : String(err)
    )
  }
}