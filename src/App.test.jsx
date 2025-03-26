import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { MockAlarmProvider } from './mocks/AlarmContextMock';
import { useAuthState } from 'react-firebase-hooks/auth';

// Mock the authentication hook
vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

// Mock the components to avoid rendering the full component tree
vi.mock('./pages/Landing', () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>,
}));

vi.mock('./pages/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('./pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

// Mock TensorFlow.js related utilities
vi.mock('./utils/sleepScorePredictor', () => ({
  initSleepScorePredictor: vi.fn(() => Promise.resolve()),
  predictSleepScore: vi.fn(() => Promise.resolve(85)),
}));

const renderWithProviders = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  
  return render(
    <ThemeProvider>
      <MockAlarmProvider>
        {ui}
      </MockAlarmProvider>
    </ThemeProvider>
  );
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to landing page when user is not authenticated', () => {
    useAuthState.mockReturnValue([null, false, null]);
    
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('shows home page when user is authenticated and navigating to root', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    useAuthState.mockReturnValue([mockUser, false, null]);
    
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('shows loading indicator when auth state is being determined', () => {
    useAuthState.mockReturnValue([null, true, null]);
    
    renderWithProviders(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
