# Firebase Backend Setup - 5 Minutes

## Step 1: Create Firebase Project
1. Go to https://firebase.google.com
2. Click "Get Started" → "Create a project"
3. Project name: `seehra-transport`
4. Accept terms and click "Create project"
5. Wait for setup to complete

## Step 2: Get Firebase Credentials
1. In Firebase Console, click "Project Settings" (⚙️)
2. Under "Your apps", click "Web" icon
3. Copy the config object
4. Paste it in `js/firebase-config.js` (file created automatically)

## Step 3: Enable Firestore
1. In Firebase Console, go to "Firestore Database"
2. Click "Create Database"
3. Select "Start in test mode" (for now)
4. Choose nearest region
5. Click "Create"

## Step 4: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Click "Email/Password"
4. Enable it
5. Done!

## Step 5: Create Admin User
1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Email: `admin@seehratransport.com`
4. Password: `Admin@12345` (CHANGE THIS!)
5. Click "Add user"

## Step 6: Deploy Updated Files
```bash
cd /Users/navjotsinghhundal/Sheera/seehra-transport
git add -A
git commit -m "Add Firebase backend integration"
git push
```

## Step 7: Test
1. Fill contact form at https://sheera-tau.vercel.app/contact.html
2. Go to https://sheera-tau.vercel.app/admin/ (or /admin/dashboard.html)
3. Login with: admin@seehratransport.com / Admin@12345
4. See your form submission!

---

## Firebase Credentials to Add
After creating Firebase project, get this config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "seehra-transport.firebaseapp.com",
  projectId: "seehra-transport",
  storageBucket: "seehra-transport.appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};
```

Save it in `js/firebase-config.js`

---

## Firestore Security Rules
In Firebase Console → Firestore → Rules, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /contact_submissions/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /recruitment_submissions/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /booking_submissions/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Then click "Publish"
