import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        count: jest.fn(),
        head: jest.fn().mockResolvedValue({ error: null }),
      })),
    })),
  },
  testConnection: jest.fn().mockResolvedValue(true),
}))

describe('App', () => {
  it('renders login form when not authenticated', async () => {
    render(<App />)
    
    // Should show login form initially
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    expect(screen.getByText(/sign in/i)).toBeInTheDocument()
  })
})