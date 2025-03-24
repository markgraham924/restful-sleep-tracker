import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Create a mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};

// Replace the global localStorage with our mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Test component that uses the ThemeContext
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-status">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock current time to be 12:00 (noon) for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2023, 1, 1, 12, 0, 0));
    
    // Reset localStorage mock behavior to default
    localStorageMock.getItem.mockReturnValue(null);
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides default theme as light if no stored preference during day', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
  });

  it('uses stored theme preference from localStorage', () => {
    // Important: must mock localStorage BEFORE rendering
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
  });

  it('toggles theme when toggle function is called', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial state should be light (with our mocked noon time)
    expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    
    // Click the toggle button
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    // State should now be dark
    expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('lastManualThemeChange', expect.any(String));
  });
});
