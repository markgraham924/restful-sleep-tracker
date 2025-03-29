# Known Issues and Limitations

This document tracks current known issues, limitations, and planned improvements for the Restful Sleep Tracker application.

## Current Issues

### Data Management Issues

#### Shared LocalStorage Keys
- **Issue**: User-specific data stored in localStorage uses shared keys
- **Impact**: Multiple users on the same device could experience data conflicts
- **Workaround**: Use private browsing or separate browsers for different users
- **Planned Fix**: Implement user-specific key prefixes in a future update

#### Static Data and Insights Storage
- **Issue**: The application uses static data and stores insights in localStorage with a single shared key
- **Impact**: Data may be overwritten with changes or reused inappropriately
- **Workaround**: Clear local storage if experiencing data inconsistencies
- **Planned Fix**: Move to Firestore for persistent, user-specific data storage

### Performance Issues

#### Initial Load Time
- **Issue**: The application has a noticeable initial load time on slower connections
- **Impact**: Poor first-time user experience
- **Planned Fix**: Implement code splitting to reduce initial bundle size

#### Chart Rendering on Mobile
- **Issue**: Chart components can be sluggish on older mobile devices
- **Impact**: Degraded user experience when viewing sleep statistics
- **Planned Fix**: Optimize chart rendering and implement progressive loading

### Authentication Limitations

#### Limited Login Options
- **Issue**: Only email/password authentication is currently supported
- **Impact**: Users may prefer social login options
- **Planned Fix**: Add Google, Apple, and Facebook authentication options

#### Password Reset Functionality
- **Issue**: Basic password reset flow with limited customization
- **Impact**: Not aligned with the rest of the application's UX
- **Planned Fix**: Implement improved password reset flow with better error handling

## Future Improvements

### Data Handling Enhancements
- Implement unique keys for each user or dataset
- Move more data storage to Firestore for persistence across devices
- Develop proper caching strategies to reduce API calls

### UI/UX Improvements
- Add animations for smoother transitions between screens
- Implement gesture controls for mobile users
- Enhance accessibility features

### Feature Additions
- Integrate with wearable devices for automatic sleep tracking
- Add export functionality for sleep data
- Implement social sharing of sleep achievements

## Reporting New Issues

If you encounter an issue not listed in this document, please report it by creating an issue in the GitHub repository with the following information:

1. Detailed description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment details (browser, device, etc.)
