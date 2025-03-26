import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgottenPassword from '../pages/ForgottenPassword';

// Import the actual BrowserRouter component
import { BrowserRouter } from 'react-router-dom';

// Create mock functions for Firebase Auth
const mockSignInWithEmailAndPassword = vi.fn();
const mockCreateUserWithEmailAndPassword = vi.fn();
const mockSendPasswordResetEmail = vi.fn();
const mockSignOut = vi.fn();

// Mock Firebase auth with our mock functions
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  sendPasswordResetEmail: mockSendPasswordResetEmail,
  signOut: mockSignOut
}));

// Create mock functions for Firestore
const mockDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockCollection = vi.fn();
const mockAddDoc = vi.fn();

// Mock Firestore with our mock functions
vi.mock('firebase/firestore', () => ({
  doc: mockDoc,
  setDoc: mockSetDoc,
  collection: mockCollection,
  addDoc: mockAddDoc
}));

// Mock react-firebase-hooks
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(() => [null, false])
}));

// Mock firebase config
vi.mock('../firebase-config', () => ({
  auth: {},
  db: {}
}));

// Use proper partial mocking for react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: {} })
  };
});

// Mock sleep data functions
vi.mock('../pages/sleepData', () => ({
  generateDefaultSleepDataForUser: vi.fn().mockResolvedValue(undefined)
}));

describe('Authentication Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Component', () => {
    it('renders login form correctly', () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    it('handles login submission correctly', async () => {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      signInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: 'test123' } });
      
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Login/i }));
      
      await waitFor(() => {
        const { auth } = require('../firebase-config');
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          auth, 
          'test@example.com', 
          'password123'
        );
      });
    });

    it('displays error message when login fails', async () => {
      const { signInWithEmailAndPassword } = require('firebase/auth');
      // Mock failed login
      signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/wrong-password' });
      
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Login/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Incorrect password/i)).toBeInTheDocument();
      });
    });
  });

  describe('Register Component', () => {
    it('renders registration form correctly', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      expect(screen.getByText('Register')).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Sleep Goal/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    it('handles registration submission correctly', async () => {
      const { createUserWithEmailAndPassword } = require('firebase/auth');
      const { setDoc } = require('firebase/firestore');
      const { generateDefaultSleepDataForUser } = require('../pages/sleepData');
      
      createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: 'newuser123' } });
      setDoc.mockResolvedValueOnce();
      
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/Sleep Goal/i), { target: { value: '8' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'newuser@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      
      await waitFor(() => {
        const { auth } = require('../firebase-config');
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          auth,
          'newuser@example.com',
          'password123'
        );
        expect(setDoc).toHaveBeenCalled();
        expect(generateDefaultSleepDataForUser).toHaveBeenCalled();
      });
    });

    it('validates passwords match', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      // Fill out form with mismatched passwords
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: '30' } });
      fireEvent.change(screen.getByLabelText(/Sleep Goal/i), { target: { value: '8' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'different' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
      
      const { createUserWithEmailAndPassword } = require('firebase/auth');
      expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    });
  });

  describe('Forgotten Password Component', () => {
    it('renders forgotten password form correctly', () => {
      render(
        <BrowserRouter>
          <ForgottenPassword />
        </BrowserRouter>
      );
      
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
    });

    it('handles password reset submission correctly', async () => {
      const { sendPasswordResetEmail } = require('firebase/auth');
      sendPasswordResetEmail.mockResolvedValueOnce();
      
      render(
        <BrowserRouter>
          <ForgottenPassword />
        </BrowserRouter>
      );
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
      
      await waitFor(() => {
        const { auth } = require('../firebase-config');
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, 'test@example.com');
      });
    });
  });
});
