# Restful Sleep Tracker Documentation

This document provides comprehensive documentation for developers working on the Restful Sleep Tracker application.

## Application Architecture

### Overview
Restful Sleep Tracker is a React-based single-page application (SPA) with Firebase backend services. The application follows a component-based architecture with context-based state management.

### Key Technologies
- **Frontend**: React 19 with Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI Features**: Firebase GenAI
- **Visualizations**: Recharts
- **ML Capabilities**: TensorFlow.js with KNN Classifier
- **UI Libraries**: React Icons
- **Notifications**: React Toastify

### Directory Structure
```
src/
├── components/         # Reusable UI components
│   ├── AIInsights.jsx  # AI-powered sleep analysis
│   ├── BottomNavigation.jsx
│   ├── ProtectedRoute.jsx
│   ├── SimpleCarousel.css
│   └── ThemeToggle.jsx
├── contexts/           # React context providers
│   ├── AlarmContext.jsx
│   └── ThemeContext.jsx
├── pages/              # Application pages
│   ├── Alarm.jsx
│   ├── Clock/
│   │   ├── IntegratedSleepClock.jsx
│   │   └── sleepClock.css
│   ├── ForgottenPasswordPage.jsx
│   ├── Home.css
│   ├── Home.jsx
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── SleepSession.jsx
│   ├── WeeklyRecords.jsx
│   └── sleepData.js    # Sleep data processing utilities
├── styles/             # Global styles
│   └── ThemeComponents.css
├── utils/              # Utility functions
│   └── sleepScorePredictor.js
├── App.css             # App-specific styles
├── App.jsx             # Main application component
├── firebase-config.js  # Firebase configuration
├── index.css           # Global styles
└── main.jsx            # Application entry point
```

## Core Features

### Sleep Tracking and Analysis
- **Sleep Session Logging**: Manual tracking of bedtime, wake time, and sleep quality
- **Sleep Score Calculation**: Analyzes sleep data using traditional calculations and AI-based predictions
- **Sleep Phases**: Tracks deep sleep, REM sleep, and light sleep phases
- **Sleep Consistency**: Measures the regularity of sleep patterns

### AI-Powered Insights
- Uses Firebase GenAI to analyze sleep patterns and provide personalized recommendations
- Falls back to rule-based insights when AI generation is unavailable
- Implements caching to reduce API calls while ensuring fresh insights

### Smart Sleep Calculator
- Analyzes user preferences and sleep habits to recommend optimal sleep times
- Calculates wake times based on sleep cycle science
- Integrates with an alarm system for seamless sleep tracking

### Dashboard Visualizations
- Interactive charts for sleep duration, quality, and composition
- Color-coded quality indicators
- Weekly and trending data analysis

## State Management

### Context API
The application uses React Context API for global state management:

1. **ThemeContext**: Manages light/dark theme preferences based on time of day or user selection
   - Automatically suggests theme based on time of day
   - Stores user preference in localStorage
   - Provides theme toggle functionality

2. **AlarmContext**: Manages alarm settings and sleep tracking
   - Stores alarm time and tracking status
   - Provides functions to start/stop sleep tracking
   - Stores sleep recommendations

## Authentication

The application uses Firebase Authentication for user management:

- Email/password authentication
- Password reset functionality
- Protected routes requiring authentication
- Auth state persistence

### Protected Routes
Routes requiring authentication are wrapped in a `ProtectedRoute` component that redirects unauthenticated users to the landing page.

## Data Models

### Sleep Entry
```javascript
{
  userId: string,           // Firebase user ID
  date: Timestamp,          // Date of sleep entry
  bedtime: string,          // Time user went to bed (HH:MM)
  wakeTime: string,         // Time user woke up (HH:MM)
  sleepDuration: number,    // Total sleep duration in hours
  quality: number,          // Sleep quality score (0-100)
  interruptions: number,    // Number of sleep interruptions
  deepSleep: number,        // Hours of deep sleep
  remSleep: number,         // Hours of REM sleep
  lightSleep: number,       // Hours of light sleep
  notes: string,            // User notes about sleep
  fromAlarmTracking: boolean // Whether entry came from alarm tracking
}
```

### Sleep Score Calculation
The application uses two methods to calculate sleep scores:

1. **Traditional Calculation**: Based on sleep duration, quality, and consistency
2. **KNN Prediction**: Using TensorFlow.js KNN Classifier for more accurate predictions based on historical data

The system automatically selects the appropriate method based on confidence levels and available data.

## Theming System

The application supports light and dark themes using CSS variables:

- Light theme: Warm colors suitable for daytime use
- Dark theme: Cool, darker colors for evening use
- Automatic theme switching based on time of day
- Manual theme toggle with preference storage

Theme variables are defined in `App.css` and applied throughout the application using the `ThemeProvider` context.

## Deployment

### Build Process
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Firebase Configuration
Create a `firebase-config.js` file with your Firebase project credentials:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Troubleshooting

### Common Issues

1. **Firebase Authentication Issues**
   - Check browser console for auth errors
   - Verify Firebase configuration
   - Ensure Firebase Auth service is enabled in Firebase Console

2. **AI Insights Not Loading**
   - Check Firebase GenAI configuration
   - Verify network connectivity
   - Check browser console for API errors

3. **Sleep Score Calculation Issues**
   - Ensure TensorFlow.js is properly loaded
   - Check for data consistency in sleep entries
   - Verify that enough historical data is available for KNN prediction

4. **Styling Issues**
   - Clear browser cache to ensure latest CSS is loaded
   - Check for console errors related to CSS parsing
   - Verify that theme variables are properly applied

## Contributing

### Development Workflow
1. Create feature branches from `dev`
2. Submit pull requests to merge into `dev`
3. Periodically merge `dev` into `main` for releases

### Code Style
- Follow ESLint and Prettier configurations
- Use functional components with React Hooks
- Follow established component patterns
- Write meaningful comments for complex logic
