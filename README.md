# Linktree Clone - scroti-online

A customizable Linktree clone built with Next.js, TypeScript, Tailwind CSS, and Firebase. This application allows you to create a personalized link-in-bio page with a dark theme design similar to Linktree.

## Features

- 🎨 **Customizable Design**: Dark theme with customizable accent and background colors
- 📸 **Image Uploads**: Upload header images via Firebase Storage
- 🔗 **Link Management**: Add, edit, delete, and reorder links
- 🌐 **Social Media Integration**: Add social media links with icons (Instagram, TikTok, YouTube, Spotify, Twitter, Facebook)
- 🎯 **Admin Panel**: Full admin interface at `/admin` to customize your page
- 🔥 **Firebase Integration**: Uses Firebase Firestore for data storage and Firebase Storage for images

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database (start in test mode for development)
3. Enable Storage (start in test mode for development)
4. Get your Firebase configuration from Project Settings > General > Your apps

### 3. Environment Variables

Create a `.env.local` file in the root directory with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules (for development)

For testing, use these rules in Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /profiles/{profileId} {
      allow read: if true;
      allow write: if true; // Change this in production!
    }
  }
}
```

### 5. Storage Security Rules (for development)

For testing, use these rules in Storage:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profiles/{profileId}/{allPaths=**} {
      allow read: if true;
      allow write: if true; // Change this in production!
    }
  }
}
```

⚠️ **Important**: These security rules allow anyone to read/write. In production, implement proper authentication and authorization!

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your profile page.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

## Usage

### Admin Panel (`/admin`)

The admin panel has three main sections:

1. **Profile Settings**: 
   - Change display name and bio
   - Customize accent and background colors
   - Upload header image

2. **Links**:
   - Add new links (title, URL, description, thumbnail)
   - Edit existing links
   - Reorder links using up/down buttons
   - Delete links

3. **Social Links**:
   - Add social media links (Instagram, TikTok, YouTube, Spotify, Twitter, Facebook, Custom)
   - Edit social links
   - Delete social links

### Profile Page (`/`)

The main profile page displays:
- Header image (if uploaded)
- Display name and bio
- Social media icons
- All your links
- A "Join" button
- Footer links

## Project Structure

```
├── app/
│   ├── admin/          # Admin panel page
│   ├── page.tsx        # Main profile page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/
│   ├── LinkButton.tsx      # Link button component
│   ├── ProfileHeader.tsx   # Profile header with image
│   └── SocialIcons.tsx     # Social media icons
├── lib/
│   ├── firebase.ts     # Firebase initialization
│   ├── firestore.ts    # Firestore operations
│   └── storage.ts      # Storage operations
└── types/
    └── index.ts        # TypeScript type definitions
```

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Firebase** - Backend (Firestore + Storage)
- **React Icons** - Icon library
- **React Dropzone** - Image upload component

## Customization

The design closely matches Linktree's dark theme with:
- Dark background (#000000 by default)
- Customizable accent color (#ff8a95 by default)
- Responsive design
- Smooth transitions and hover effects

All colors and content can be customized through the admin panel.

## Future Enhancements

- User authentication
- Multiple profile support
- Analytics tracking
- Custom domain support
- More link types (Spotify embeds, YouTube embeds, etc.)
- QR code generation
- Password protection for profiles

## License

MIT
