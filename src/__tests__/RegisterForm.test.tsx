import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '../RegisterForm'

describe('RegisterForm', () => {
  const mockOnRegister = jest.fn()
  const mockOnToggleMode = jest.fn()

  const defaultProps = {
    onRegister: mockOnRegister,
    onToggleMode: mockOnToggleMode,
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render registration form with all fields', () => {
      render(<RegisterForm {...defaultProps} />)

      expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password \*/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/i accept the terms/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
    })

    it('should render error message when error prop is provided', () => {
      render(<RegisterForm {...defaultProps} error="Registration failed" />)
      
      expect(screen.getByText('Registration failed')).toBeInTheDocument()
    })

    it('should disable form when loading', () => {
      render(<RegisterForm {...defaultProps} loading={true} />)
      
      expect(screen.getByLabelText(/email address/i)).toBeDisabled()
      expect(screen.getByLabelText(/full name/i)).toBeDisabled()
      expect(screen.getByLabelText(/^password \*/i)).toBeDisabled()
      expect(screen.getByLabelText(/confirm password/i)).toBeDisabled()
      expect(screen.getByLabelText(/i accept the terms/i)).toBeDisabled()
      expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    })
  })

  describe('form validation', () => {
    it('should show error when submitting with missing fields', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)

      expect(screen.getByText('All fields are required')).toBeInTheDocument()
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    it('should validate email format', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const nameInput = screen.getByLabelText(/full name/i)
      const passwordInput = screen.getByLabelText(/^password \*/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const termsInput = screen.getByLabelText(/i accept the terms/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(emailInput, 'invalid-email')
      await user.type(nameInput, 'John Doe')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(termsInput)
      await user.click(submitButton)

      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    it('should validate name length', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const nameInput = screen.getByLabelText(/full name/i)
      const passwordInput = screen.getByLabelText(/^password \*/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const termsInput = screen.getByLabelText(/i accept the terms/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(nameInput, 'A')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(termsInput)
      await user.click(submitButton)

      expect(screen.getByText('Name must be at least 2 characters long')).toBeInTheDocument()
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    it('should validate password strength', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const nameInput = screen.getByLabelText(/full name/i)
      const passwordInput = screen.getByLabelText(/^password \*/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const termsInput = screen.getByLabelText(/i accept the terms/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(nameInput, 'John Doe')
      await user.type(passwordInput, 'weak')
      await user.type(confirmPasswordInput, 'weak')
      await user.click(termsInput)
      await user.click(submitButton)

      expect(screen.getByText('Password must be at least 8 characters with at least one letter and one number')).toBeInTheDocument()
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    it('should validate password confirmation', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const nameInput = screen.getByLabelText(/full name/i)
      const passwordInput = screen.getByLabelText(/^password \*/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const termsInput = screen.getByLabelText(/i accept the terms/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(nameInput, 'John Doe')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'different456')
      await user.click(termsInput)
      await user.click(submitButton)

      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    it('should validate terms acceptance', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const nameInput = screen.getByLabelText(/full name/i)
      const passwordInput = screen.getByLabelText(/^password \*/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(nameInput, 'John Doe')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      // Don't click terms checkbox
      await user.click(submitButton)

      expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument()
      expect(mockOnRegister).not.toHaveBeenCalled()
    })

    it('should submit form with valid data', async () => {
      const user = userEvent.setup()
      
      // Mock successful registration
      mockOnRegister.mockResolvedValue(undefined)
      
      render(<RegisterForm {...defaultProps} />)

      const emailInput = screen.getByLabelText(/email address/i)
      const nameInput = screen.getByLabelText(/full name/i)
      const passwordInput = screen.getByLabelText(/^password \*/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const termsInput = screen.getByLabelText(/i accept the terms/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(nameInput, 'John Doe')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(termsInput)
      await user.click(submitButton)

      expect(mockOnRegister).toHaveBeenCalledWith('test@example.com', 'password123', { name: 'John Doe' })
      
      await waitFor(() => {
        expect(screen.getByText('Account created successfully! Please check your email for verification.')).toBeInTheDocument()
      })
    })
  })

  describe('password strength indicator', () => {
    it('should show password strength message for short password', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const passwordInput = screen.getByLabelText(/^password \*/i)
      await user.type(passwordInput, 'short')

      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })

    it('should show password strength message for password without letter', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const passwordInput = screen.getByLabelText(/^password \*/i)
      await user.type(passwordInput, '12345678')

      expect(screen.getByText('Password must contain at least one letter')).toBeInTheDocument()
    })

    it('should show password strength message for password without number', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const passwordInput = screen.getByLabelText(/^password \*/i)
      await user.type(passwordInput, 'passwordonly')

      expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument()
    })

    it('should not show password strength message for valid password', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const passwordInput = screen.getByLabelText(/^password \*/i)
      await user.type(passwordInput, 'password123')

      expect(screen.queryByText(/password must/i)).not.toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('should call onToggleMode when sign in link is clicked', async () => {
      const user = userEvent.setup()
      render(<RegisterForm {...defaultProps} />)

      const signInLink = screen.getByText(/already have an account/i)
      await user.click(signInLink)

      expect(mockOnToggleMode).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should have proper form labels', () => {
      render(<RegisterForm {...defaultProps} />)

      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('id', 'email')
      expect(screen.getByLabelText(/full name/i)).toHaveAttribute('id', 'name')
      expect(screen.getByLabelText(/^password \*/i)).toHaveAttribute('id', 'password')
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('id', 'confirmPassword')
      expect(screen.getByLabelText(/i accept the terms/i)).toHaveAttribute('id', 'acceptTerms')
    })

    it('should have proper autocomplete attributes', () => {
      render(<RegisterForm {...defaultProps} />)

      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('autoComplete', 'email')
      expect(screen.getByLabelText(/full name/i)).toHaveAttribute('autoComplete', 'name')
      expect(screen.getByLabelText(/^password \*/i)).toHaveAttribute('autoComplete', 'new-password')
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('autoComplete', 'new-password')
    })

    it('should have required fields marked as required', () => {
      render(<RegisterForm {...defaultProps} />)

      expect(screen.getByLabelText(/email address/i)).toBeRequired()
      expect(screen.getByLabelText(/full name/i)).toBeRequired()
      expect(screen.getByLabelText(/^password \*/i)).toBeRequired()
      expect(screen.getByLabelText(/confirm password/i)).toBeRequired()
      expect(screen.getByLabelText(/i accept the terms/i)).toBeRequired()
    })
  })
})