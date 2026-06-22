import { Amplify } from 'aws-amplify'

export const COGNITO_REGION = import.meta.env.VITE_AWS_REGION ?? ''
export const COGNITO_USER_POOL_ID = import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID ?? ''
export const COGNITO_USER_POOL_CLIENT_ID = import.meta.env.VITE_AWS_COGNITO_USER_POOL_CLIENT_ID ?? ''

export const authIsConfigured = Boolean(
  COGNITO_REGION && COGNITO_USER_POOL_ID && COGNITO_USER_POOL_CLIENT_ID
)

export function initializeAuth(): void {
  if (authIsConfigured) {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: COGNITO_USER_POOL_ID,
          userPoolClientId: COGNITO_USER_POOL_CLIENT_ID,
        },
      },
    })
  }
}
