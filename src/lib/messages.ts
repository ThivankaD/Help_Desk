export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export function createWelcomeMessage(): Message {
  return {
    id: '1',
    text: 'Hello! How can I assist you today? If you need information about an order or a product, please provide the order ID or product ID, respectively. If you have any other requests, let me know how I can help.',
    sender: 'bot',
    timestamp: new Date(),
  }
}
