# Restful Sleep Tracker - Project Handover Documentation

This document serves as a comprehensive handover guide for future development teams working on the Restful Sleep Tracker application. It contains essential information about the project structure, development workflow, deployment processes, and known issues.

## Table of Contents
- [Project Overview](#project-overview)
- [Technical Architecture](#technical-architecture)
- [Development Workflow](#development-workflow)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment Process](#deployment-process)
- [Known Issues and Future Improvements](#known-issues-and-future-improvements)
- [Support and Resources](#support-and-resources)

## Project Overview

Restful Sleep Tracker is a mobile-first application designed to help users monitor and improve their sleep quality through data-driven insights and personalized recommendations. The application provides:

- Interactive sleep dashboard with comprehensive metrics
- AI-powered sleep insights and recommendations
- Manual sleep logging and detailed analysis
- Smart sleep calculator and custom alarm system
- Visual data representation through charts and indicators
- User management with personalized sleep goals

For a complete feature list, please refer to the [README.md](./README.md) file.

## Technical Architecture

### Frontend
- **Framework**: React 19 with Vite build tool
- **State Management**: React Context API with Firebase hooks
- **Routing**: React Router v6
- **UI Components**: Custom components with responsive design
- **Charts and Visualization**: Recharts library
- **Styling**: CSS with variables for theming support

### Backend
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI Features**: Firebase GenAI

### File Structure
- `src/`
  - `components/`: Reusable UI components
  - `contexts/`: React context providers
  - `pages/`: Main application views
  - `styles/`: CSS stylesheets
  - `firebase-config.js`: Firebase configuration

## Development Workflow

We follow a trunk-based development workflow with the following branches:

1. `main`: Production-ready code
2. `dev`: Integration branch for new features
3. Feature branches: Short-lived branches for individual features

### Branch Management
- Create feature branches from `dev`
- Submit pull requests to merge into `dev`
- Periodically merge `dev` into `main` for releases

### Code Quality Standards
- ESLint and Prettier configurations are provided
- All code should follow the established patterns in the codebase
- New components should include appropriate styling and responsive design

## CI/CD Pipeline

We use GitHub Actions with a CI/CD pipeline to manage the development workflow:

### Continuous Integration
- **Linting and Code Checks**: Automatically run on pull requests to the `dev` branch
- **Test Verification**: Ensures all tests pass before merging

### Continuous Deployment
- **Automatic Release Creation**: When updates are merged to the `main` branch, GitHub Actions automatically creates a release package
- **Versioning**: Release versions are generated based on semantic versioning

### Workflow Configuration
All CI/CD configurations are stored in the `.github/workflows` directory and include:
- Pull request validation workflow
- Build and test workflow for the `dev` branch
- Release creation workflow for the `main` branch

## Deployment Process

The application is designed to be deployed as a static web application:

1. The CI/CD pipeline creates a production build when changes are merged to `main`
2. The build artifact is packaged into a release
3. The release can be deployed to any static hosting service (Firebase Hosting, Netlify, Vercel, etc.)

### Manual Deployment
If needed, you can manually deploy the application:
```
npm run build
```
This creates a production-ready build in the `dist/` directory.

## Known Issues and Future Improvements

### Current Limitations

1. **Sleep Data Handling**:
   - The application currently uses static data and stores insights in local Storage with a single shared key
   - This could lead to data being overwritten with changes or reused inappropriately

2. **Local Storage Limitations**:
   - User-specific data stored in localStorage uses shared keys
   - Multiple users on the same device could experience data conflicts

### Recommended Improvements

1. **Enhanced Data Management**:
   - Implement unique keys for each user or dataset
   - This will preserve data integrity and enhance user-specific insights for multiple users

2. **Data Storage Optimization**:
   - Move more data storage to Firestore for persistence across devices
   - Implement proper caching strategies to reduce API calls

3. **Authentication Enhancement**:
   - Add social login options
   - Implement password reset functionality improvements

4. **Performance Optimization**:
   - Implement code splitting to reduce initial load time
   - Optimize chart rendering for better mobile performance

## Support and Resources

### Documentation
- Project README: [README.md](./README.md)
- API Documentation: Available in code comments

### Repository Access
- All necessary resources, including the codebase and CI/CD configurations, are documented and available on our GitHub repository

### Development Environment Setup
Refer to the [Getting Started](./README.md#getting-started) section in the README for instructions on setting up the development environment.

### Contacts
- For questions about the codebase, please create an issue in the GitHub repository
