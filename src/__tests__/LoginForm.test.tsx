import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'

describe('LoginForm', () => {
  const mockOnLogin = jest.fn()
  const mockOnToggleMode = jest.fn()
  const mockOnPasswordReset = jest.fn()

  const defaultProps = {
    onLogin: mockOnLogin,
    onToggleMode: mockOnToggleMode,
    onPasswordReset: mockOnPasswordReset,
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render login form with all fields', () => {
      render(<LoginForm {...defaultProps} />)

      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument()
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
    })

    it('should render error message when error prop is provided', () => {
      render(<LoginForm {...defaultProps} error="Invalid credentials" />)
      
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    it('should disable form when loading', () => {
      render(<LoginForm {...defaultProps} loading={true} />)
      
      expect(screen.getByLabelText(/email address/i)).toBeDisabled()
      expect(screen.getByLabelText(/password/i)).toBeDisabled()
      expect(screen.getByLabelText(/remember me/i)).toBeDisabled()
      expect(screen.getByRole('button', { name: /forgot password/i })).toBeDisabled()
      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    })
  })

  describe('form validation', () => {
    it('should show error when submitting without email', async () => {
      const user = userEvent.setup()
      render(<LoginForm {...defaultProps} />)

      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      expect(screen.getByText('Email and password are required')).toBeInTheDocument()
      expect(mockOnLogin).not.toHaveBeenCalled()
    })

    it('should show error when submitting without password', async () => {
      const user = userEvent.setup()
      render(<LoginForm {...defaultProps} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      expect(screen.getByText('Email and password are required')).toBeInTheDocument()
      expect(mockOnLogin).not.toHaveBeenCalled()
    })

    it('should submit form with valid data', async () => {
      const user = userEvent.setup()
      render(<LoginForm {...defaultProps} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const rememberMeInput = screen.getByLabelText(/remember me/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(rememberMeInput)
      await user.click(submitButton)

      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123', true)
    })

    it('should submit form without remember me when unchecked', async () => {
      const user = userEvent.setup()
      render(<LoginForm {...defaultProps} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123', false)
    })
  })

  describe('password reset flow', () => {
    it('should show password reset form when forgot password is clicked', async () => {
      const user = userEvent.setup()
      render(<LoginForm {...defaultProps} />)

      const forgotPasswordButton = screen.getByRole('button', { name: /forgot password/i })
      await user.click(forgotPasswordButton)

      expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send reset instructions/i })).toBeInTheDocument()
      expect(screen.getByText(/back to sign in/i)).toBeInTheDocument()
    })

    it('should validate email in password reset form', async () => {
      const user = userEvent.setup()
      render(<LoginForm {...defaultProps} />)

      // Go to password reset form
      await user.click(screen.getByRole('button', { name: /forgot password/i }))
      
      // Try to submit without email
      const submitButton = screen.getByRole('button', { name: /send reset instructions/i })
      await user.click(submitButton)

      expect(screen.getByText('Please enter your email address')).toBeInTheDocument()
      expect(mockOnPasswordReset).not.toHaveBeenCalled()
    })

    it('should submit password reset with valid email', async () => {
      const user = userEvent.setup()
      render(<LoginForm {...defaultProps} />)

      // Go to password reset form
      await user.click(screen.getByRole('button', { name: /forgot password/i }))
      
      // Fill and submit email
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /send reset instructions/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      expect(mockOnPasswordReset).toHaveBeenCalledWith('test@example.com')
    })

    it('should show success message after password reset sent', async () => {
      const user = userEvent.setup()
      
      // Mock successful password reset
      mockOnPasswordReset.mockResolvedValue(undefined)
      
      render(<LoginForm {...defaultProps} />)

      // Go to password reset form and submit
      await user.click(screen.getByRole('button', { name: /forgot password/i }))
      
      const emailInput = screen.getByLabelText(/email address/i)
      const submitButton = screen.getByRole('button', { name: /send reset instructions/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/password reset instructions have been sent/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /back to sign in/i })).toBeInTheDocument()
      })
    })

    it('should return to login form from password reset', async () => {
      const user = userEvent.setup()
      render(<LoginForm {...defaultProps} />)

      // Go to password reset form
      await user.click(screen.getByRole('button', { name: /forgot password/i }))
      
      // Go back to login
      const backButton = screen.getByText(/back to sign in/i)
      await user.click(backButton)

      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('should call onToggleMode when create account link is clicked', async () => {
      const user = userEvent.setup()
      render(<LoginForm {...defaultProps} />)

      const createAccountLink = screen.getByText(/don't have an account/i)
      await user.click(createAccountLink)

      expect(mockOnToggleMode).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should have proper form labels', () => {
      render(<LoginForm {...defaultProps} />)

      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('id', 'email')
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('id', 'password')
      expect(screen.getByLabelText(/remember me/i)).toHaveAttribute('id', 'rememberMe')
    })

    it('should have proper autocomplete attributes', () => {
      render(<LoginForm {...defaultProps} />)

      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('autoComplete', 'email')
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('autoComplete', 'current-password')
    })

    it('should have required fields marked as required', () => {
      render(<LoginForm {...defaultProps} />)

      expect(screen.getByLabelText(/email address/i)).toBeRequired()
      expect(screen.getByLabelText(/password/i)).toBeRequired()
    })
  })
})