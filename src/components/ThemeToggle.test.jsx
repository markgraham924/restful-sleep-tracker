import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

// Use vi.mock with async function to properly preserve exports
vi.mock('../contexts/ThemeContext', async () => {
  const actual = await vi.importActual('../contexts/ThemeContext');
  return {
    ...actual,
    useTheme: vi.fn()
  };
});

// Import useTheme after mocking
import { useTheme } from '../contexts/ThemeContext';

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    cleanup(); // Clean up after each test
  });

  it('renders correctly and toggles theme on click', () => {
    const toggleThemeMock = vi.fn();
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: toggleThemeMock });
    
    render(<ThemeToggle />);
    
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass('theme-toggle');
    expect(toggleButton).toHaveClass('light-mode');
    
    fireEvent.click(toggleButton);
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });
  
  it('displays the correct light theme icon', () => {
    // Test light theme icon
    useTheme.mockReturnValue({ theme: 'light', toggleTheme: vi.fn() });
    
    render(<ThemeToggle />);
    const lightModeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(lightModeButton).toHaveClass('theme-toggle');
    expect(lightModeButton).toHaveClass('light-mode');
    expect(lightModeButton).toHaveTextContent('🌙');
  });
  
  it('displays the correct dark theme icon', () => {
    // Test dark theme icon
    useTheme.mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() });
    
    render(<ThemeToggle />);
    const darkModeButton = screen.getByRole('button', { name: /switch to light mode/i });
    expect(darkModeButton).toHaveClass('theme-toggle');
    expect(darkModeButton).toHaveClass('dark-mode');
    expect(darkModeButton).toHaveTextContent('☀️');
  });
});
