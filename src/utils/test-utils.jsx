import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { vi } from 'vitest';
import { MockAlarmProvider } from '../mocks/AlarmContextMock';

// Mock Firebase auth
vi.mock('../firebase-config', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  },
}));

// Mock TensorFlow.js to avoid WebGL errors
vi.mock('@tensorflow/tfjs', () => ({
  tensor: vi.fn(() => ({
    arraySync: vi.fn(() => []),
    dispose: vi.fn(),
  })),
  sequential: vi.fn(() => ({
    add: vi.fn(),
    compile: vi.fn(),
    fit: vi.fn(() => Promise.resolve()),
    predict: vi.fn(() => ({
      dataSync: vi.fn(() => [0.5]),
      dispose: vi.fn(),
    })),
  })),
  layers: {
    dense: vi.fn(),
  },
  util: {
    shuffle: vi.fn(x => x),
  },
  train: {
    sgd: vi.fn(),
  },
}));

// Create wrapper with all providers
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <MockAlarmProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </MockAlarmProvider>
    </BrowserRouter>
  );
};

// Custom render method that includes providers
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };