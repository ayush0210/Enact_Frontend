# MVC Structure for Sign-In Functionality

This document explains the Model-View-Controller (MVC) architecture implemented for the sign-in functionality in the ENACT app.

## Overview

The sign-in functionality has been refactored from a single monolithic component into a clean MVC architecture with the following structure:

```
├── types/authTypes.ts              # Model - Data types and interfaces
├── controllers/authController.ts   # Controller - Business logic
├── hooks/useSignIn.ts             # State management hook
├── components/auth/
│   ├── SignInView.tsx             # View - UI component
│   └── FCMStatusIndicator.tsx     # View - Sub-component
└── app/(authentication)/signIn.tsx # Entry point
```

## Architecture Components

### 1. Model (`types/authTypes.ts`)

**Purpose**: Defines data structures and interfaces used throughout the authentication flow.

**Key Types**:
- `TokenData`: Interface for FCM token data
- `SignInFormData`: Interface for form data
- `FCMTokenStatus`: Union type for token status states
- `SignInState`: Interface for component state

### 2. Controller (`controllers/authController.ts`)

**Purpose**: Contains all business logic, API calls, and data manipulation.

**Key Responsibilities**:
- FCM token management (iOS-specific handling)
- Server communication for token updates
- Form validation
- Login flow orchestration
- Error handling

**Key Methods**:
- `getAndStoreToken()`: Handles FCM token retrieval with retry logic
- `updateServerToken()`: Sends token to server
- `setupTokenRefresh()`: Manages token refresh listeners
- `validateForm()`: Validates user input
- `handleLogin()`: Orchestrates the login process

### 3. View (`components/auth/SignInView.tsx`)

**Purpose**: Pure UI component focused on presentation and user interaction.

**Key Features**:
- Clean, focused on UI rendering
- Uses custom hook for state management
- Modular design with separate FCM status indicator
- No business logic - delegates to controller via hook

### 4. State Management (`hooks/useSignIn.ts`)

**Purpose**: Coordinates between the view and controller, manages local state.

**Key Responsibilities**:
- State management for form fields and UI state
- Integration with AuthContext
- Lifecycle management for FCM token initialization
- Error handling coordination

### 5. Sub-Components

#### FCMStatusIndicator (`components/auth/FCMStatusIndicator.tsx`)
- Displays FCM token status in development mode
- Pure presentation component
- Handles status color and text mapping

## Benefits of This Architecture

### 1. Separation of Concerns
- **Model**: Data structure definitions
- **View**: UI presentation only
- **Controller**: Business logic and data manipulation

### 2. Maintainability
- Each component has a single responsibility
- Easy to test individual components
- Clear dependencies between layers

### 3. Reusability
- Controller can be reused for other authentication flows
- View components can be easily modified without affecting logic
- Types can be shared across the application

### 4. Testability
- Business logic is isolated in the controller
- UI components can be tested independently
- State management is centralized in the hook

### 5. Scalability
- Easy to add new authentication features
- Clear pattern for other screens to follow
- Modular design supports team development

## Usage Example

```typescript
// Entry point remains simple
import { SignInView } from "@/components/auth/SignInView";

export default function SignInScreen() {
  return <SignInView />;
}
```

The view component automatically handles all the complexity through the custom hook, which coordinates with the controller for business logic.

## Migration Notes

The original `signIn.tsx` file has been simplified to just import and render the new `SignInView` component. All the original functionality has been preserved but is now properly separated into the MVC structure.

## Future Enhancements

This structure makes it easy to:
- Add unit tests for the controller
- Create different UI themes for the view
- Add new authentication methods
- Implement error boundaries
- Add analytics and logging 