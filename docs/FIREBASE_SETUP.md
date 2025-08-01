# Firebase Setup Guide for ENACT App

## Current Issue
You're getting the error: `No Firebase App '[DEFAULT]' has been created - call firebase.initializeApp()`

This happens because Firebase isn't properly initialized in your app.

## Quick Fix (Development Only)
The current setup includes a temporary Firebase configuration that will allow the app to run in development mode without crashing. However, for production, you need to set up Firebase properly.

## Complete Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard

### Step 2: Add Your App to Firebase

#### For iOS:
1. In Firebase Console, click the iOS icon (+ button)
2. Enter your Bundle ID (found in `ios/ENACT/Info.plist`)
3. Download `GoogleService-Info.plist`
4. Add it to your iOS project:
   ```bash
   # Copy the file to your iOS project
   cp GoogleService-Info.plist ios/ENACT/
   ```

#### For Android:
1. In Firebase Console, click the Android icon (+ button)
2. Enter your Package Name (found in `android/app/src/main/AndroidManifest.xml`)
3. Download `google-services.json`
4. Add it to your Android project:
   ```bash
   # Copy the file to your Android project
   cp google-services.json android/app/
   ```

### Step 3: Update Firebase Configuration

Replace the placeholder config in `config/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

You can find these values in:
- **iOS**: `GoogleService-Info.plist`
- **Android**: `google-services.json`
- **Web**: Firebase Console → Project Settings → General → Your Apps

### Step 4: Enable Cloud Messaging

1. In Firebase Console, go to **Project Settings**
2. Click **Cloud Messaging** tab
3. Generate a new Server Key (if needed)
4. Note the **Sender ID** (you'll need this for server-side notifications)

### Step 5: Configure iOS (if needed)

For iOS, you might need to:

1. Add capabilities in Xcode:
   - Open `ios/ENACT.xcworkspace` in Xcode
   - Select your target → Signing & Capabilities
   - Add "Push Notifications" capability
   - Add "Background Modes" and check "Remote notifications"

2. Update `ios/ENACT/Info.plist`:
   ```xml
   <key>UIBackgroundModes</key>
   <array>
     <string>remote-notification</string>
   </array>
   ```

### Step 6: Test the Setup

1. Run the app
2. Check the console for "Firebase initialized successfully"
3. The FCM status indicator should show "✓ Push notifications ready"

## Troubleshooting

### Common Issues:

1. **"No Firebase App '[DEFAULT]' has been created"**
   - Make sure `initializeFirebase()` is called in `app/_layout.tsx`
   - Check that Firebase config values are correct

2. **"Permission denied" on iOS**
   - Make sure you have the correct Bundle ID
   - Check that `GoogleService-Info.plist` is in the right location
   - Verify Push Notifications capability is enabled

3. **"Permission denied" on Android**
   - Make sure you have the correct Package Name
   - Check that `google-services.json` is in `android/app/`
   - Verify the file is properly formatted

### Development vs Production:

- **Development**: The current setup will work with placeholder values
- **Production**: You must use real Firebase configuration files

## Current Status

✅ Firebase initialization code added  
✅ Error handling for missing Firebase config  
✅ Graceful fallback in development mode  
⚠️ Need real Firebase configuration files for production  

## Next Steps

1. Create a Firebase project
2. Download configuration files
3. Replace placeholder config with real values
4. Test push notifications

The app will now run without crashing, but push notifications won't work until you complete the Firebase setup. 