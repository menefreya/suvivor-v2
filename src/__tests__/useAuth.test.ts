import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { supabase } from '../supabase'

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      setSession: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn(),
      update: jest.fn(),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('useAuth', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' },
    created_at: '2023-01-01T00:00:00Z',
  }

  const mockSession = {
    user: mockUser,
    access_token: 'mock-token',
    refresh_token: 'mock-refresh',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementations
    mockSupabase.auth.getSession.mockResolvedValue({ 
      data: { session: null }, 
      error: null 
    })
    
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    } as any)
  })

  describe('initialization', () => {
    it('should initialize with loading state', async () => {
      const { result } = renderHook(() => useAuth())
      
      expect(result.current.loading).toBe(true)
      expect(result.current.user).toBe(null)
      expect(result.current.session).toBe(null)
      expect(result.current.error).toBe(null)
    })

    it('should load existing session on mount', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession as any },
        error: null,
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        // Wait for the effect to complete
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.session).toEqual(mockSession)
      expect(result.current.loading).toBe(false)
    })

    it('should handle session loading error', async () => {
      const error = new Error('Session load failed')
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: error as any,
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.error).toBe('Session load failed')
      expect(result.current.loading).toBe(false)
    })
  })

  describe('signIn', () => {
    it('should sign in successfully', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      } as any)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signIn('test@example.com', 'password123')
      })

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.current.error).toBe(null)
    })

    it('should handle sign in error', async () => {
      const error = new Error('Invalid credentials')
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: error as any,
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        try {
          await result.current.signIn('test@example.com', 'wrong-password')
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Invalid credentials')
    })

    it('should handle remember me option', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      } as any)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signIn('test@example.com', 'password123', true)
      })

      expect(mockSupabase.auth.setSession).toHaveBeenCalled()
    })
  })

  describe('signUp', () => {
    it('should sign up successfully without user data', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      } as any)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signUp('test@example.com', 'password123')
      })

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: '',
          },
        },
      })
      expect(result.current.error).toBe(null)
    })

    it('should sign up successfully with user data', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      } as any)

      const mockInsert = jest.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      } as any)

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signUp('test@example.com', 'password123', { name: 'John Doe' })
      })

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'John Doe',
          },
        },
      })

      expect(mockInsert).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        name: 'John Doe',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it('should handle sign up error', async () => {
      const error = new Error('Email already registered')
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: error as any,
      })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        try {
          await result.current.signUp('test@example.com', 'password123')
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Email already registered')
    })
  })

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
      expect(result.current.error).toBe(null)
    })

    it('should handle sign out error', async () => {
      const error = new Error('Sign out failed')
      mockSupabase.auth.signOut.mockResolvedValue({ error: error as any })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        try {
          await result.current.signOut()
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Sign out failed')
    })
  })

  describe('sendPasswordReset', () => {
    it('should send password reset email successfully', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        await result.current.sendPasswordReset('test@example.com')
      })

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        { redirectTo: `${window.location.origin}/reset-password` }
      )
      expect(result.current.error).toBe(null)
    })

    it('should handle password reset error', async () => {
      const error = new Error('Email not found')
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: error as any })

      const { result } = renderHook(() => useAuth())

      await act(async () => {
        try {
          await result.current.sendPasswordReset('test@example.com')
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Email not found')
    })
  })

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({ error: null })
      
      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null })
      })
      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      } as any)

      // Set up authenticated user
      const { result } = renderHook(() => useAuth())
      result.current.user = mockUser as any

      await act(async () => {
        await result.current.updateProfile({
          name: 'Updated Name',
          email: 'updated@example.com'
        })
      })

      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        email: 'updated@example.com'
      })
      expect(mockUpdate).toHaveBeenCalled()
    })

    it('should handle update profile error when no user', async () => {
      const { result } = renderHook(() => useAuth())

      await act(async () => {
        try {
          await result.current.updateProfile({ name: 'Test' })
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('No authenticated user')
    })
  })

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      mockSupabase.auth.signInWithPassword
        .mockResolvedValueOnce({
          data: { user: mockUser, session: mockSession },
          error: null,
        } as any)
        
      mockSupabase.auth.updateUser.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth())
      result.current.user = mockUser as any

      await act(async () => {
        await result.current.updatePassword('current-password', 'new-password123')
      })

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: mockUser.email,
        password: 'current-password'
      })
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'new-password123'
      })
    })

    it('should handle incorrect current password', async () => {
      const error = new Error('Invalid credentials')
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: error as any,
      })

      const { result } = renderHook(() => useAuth())
      result.current.user = mockUser as any

      await act(async () => {
        try {
          await result.current.updatePassword('wrong-password', 'new-password123')
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe('Current password is incorrect')
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useAuth())
      
      act(() => {
        result.current.error = 'Some error' as any
      })
      
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBe(null)
    })
  })
})