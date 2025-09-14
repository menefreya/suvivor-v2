import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export interface AuthActions {
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signUp: (email: string, password: string, userData?: { name: string }) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
  sendPasswordReset: (email: string) => Promise<void>
  updateProfile: (updates: { name?: string; email?: string }) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

export const useAuth = (): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Session initialization error:', err)
        setError('Failed to initialize authentication')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string, rememberMe = false): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        throw error
      }

      // Handle remember me functionality by setting session persistence
      if (rememberMe) {
        await supabase.auth.setSession(session!)
      }
    } catch (err) {
      const authError = err as AuthError
      setError(authError.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData?: { name: string }): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name || '',
          }
        }
      })
      
      if (error) {
        throw error
      }

      // If user is created but needs email confirmation
      if (data.user && !data.session) {
        // User created successfully but needs email verification
        return
      }

      // Create user profile in database if auto-confirmed
      if (data.user && data.session && userData?.name) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: userData.name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Don't throw here as the user account is created successfully
        }
      }
    } catch (err) {
      const authError = err as AuthError
      setError(authError.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
    } catch (err) {
      const authError = err as AuthError
      setError(authError.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        throw error
      }
    } catch (err) {
      const authError = err as AuthError
      setError(authError.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: { name?: string; email?: string }): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      if (!user) {
        throw new Error('No authenticated user')
      }

      // Update auth user if email is being changed
      if (updates.email && updates.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email
        })
        
        if (authError) {
          throw authError
        }
      }

      // Update user profile in database
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.email && { email: updates.email }),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) {
        throw profileError
      }
    } catch (err) {
      const authError = err as AuthError
      setError(authError.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.email) {
        throw new Error('No authenticated user')
      }

      // Verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      })

      if (verifyError) {
        throw new Error('Current password is incorrect')
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (updateError) {
        throw updateError
      }
    } catch (err) {
      const authError = err as AuthError
      setError(authError.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
    sendPasswordReset,
    updateProfile,
    updatePassword
  }
}