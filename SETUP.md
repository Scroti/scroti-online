# Quick Setup Guide

## 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database** (start in test mode)
4. Enable **Storage** (start in test mode)
5. Go to Project Settings > General > Your apps > Web app
6. Copy your Firebase configuration

## 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 3. Firestore Rules (for development)

In Firebase Console > Firestore Database > Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{profileId} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING**: This allows anyone to read/write. Only use for development!

## 4. Storage Rules (for development)

In Firebase Console > Storage > Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profiles/{profileId}/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING**: This allows anyone to read/write. Only use for development!

## 5. Run the App

```bash
npm run dev
```

- Main page: http://localhost:3000
- Admin panel: http://localhost:3000/admin

## 6. Customize Your Page

1. Go to http://localhost:3000/admin
2. Use the tabs to:
   - **Profile Settings**: Set your name, bio, colors, and upload header image
   - **Links**: Add/edit/delete/reorder your links
   - **Social Links**: Add your social media accounts
3. View your page at http://localhost:3000

## Features

✅ Customizable dark theme  
✅ Header image upload  
✅ Link management with reordering  
✅ Social media integration  
✅ Spotify link detection  
✅ Responsive design  

Enjoy your Linktree clone! 🎉
