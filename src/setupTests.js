import '@testing-library/jest-dom';
import { afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock TensorFlow.js modules
vi.mock('@tensorflow/tfjs', () => ({
  setBackend: vi.fn(),
  ready: vi.fn().mockResolvedValue(true),
  tensor: vi.fn(() => ({
    print: vi.fn(),
    arraySync: vi.fn(() => []),
  })),
  layers: {
    dense: vi.fn(() => ({
      apply: vi.fn(),
    })),
  },
  train: {
    sgd: vi.fn(),
  },
  browserLocalStorage: vi.fn(),
  io: {
    localStorage: vi.fn(),
    withSaveHandler: vi.fn(),
  },
}));

// Mock canvas functionality
beforeAll(() => {
  // Create more robust mock context that TensorFlow.js might use
  const mockContext = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray([0, 0, 0, 0]) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    translate: vi.fn(),
    transform: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    // WebGL specific methods
    getParameter: vi.fn(),
    getExtension: vi.fn(() => null),
    getShaderPrecisionFormat: vi.fn(() => ({ precision: 23, rangeMin: 127, rangeMax: 127 })),
    getContextAttributes: vi.fn(() => ({ alpha: true, antialias: true })),
    canvas: { width: 256, height: 256 },
  };
  
  // Mock both 2d and webgl contexts
  window.HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext);
});

// Use async approach to ensure proper mocking of sleepScorePredictor
vi.mock('../src/utils/sleepScorePredictor', async () => {
  return {
    default: {
      initialize: vi.fn().mockResolvedValue(undefined),
      predict: vi.fn().mockResolvedValue({
        score: 75, 
        confidence: 0.85,
        confidenceLevel: 'high',
        message: 'KNN prediction with high confidence'
      }),
      setDebugMode: vi.fn(),
      train: vi.fn().mockResolvedValue(undefined)
    }
  };
});

// Alias for the relative import pattern also using async
vi.mock('./utils/sleepScorePredictor', async () => {
  return {
    default: {
      initialize: vi.fn().mockResolvedValue(undefined),
      predict: vi.fn().mockResolvedValue({
        score: 75, 
        confidence: 0.85,
        confidenceLevel: 'high',
        message: 'KNN prediction with high confidence'
      }),
      setDebugMode: vi.fn(),
      train: vi.fn().mockResolvedValue(undefined)
    }
  };
});
