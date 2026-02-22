# Admin Credentials & Access

## 🔐 Login Details

### Primary Admin Account
- **Email**: `admin@seehratransport.com`
- **Password**: `Admin@12345`
- **Dashboard URL**: `/admin/forms.html`

### Dashboard Access
After Firebase setup, you can login to view all form submissions:
- **Contact Forms** - See customer inquiries
- **Recruitment** - See job applications
- **Bookings** - See booking requests

---

## 📋 What Data Gets Collected

### Contact Forms
When someone fills contact.html, saved data includes:
- Name, Email, Phone
- Company, Service Interest
- Message
- Submission date/time
- Status: "new"

### Recruitment Forms  
When someone fills recruitment.html, saved data includes:
- Full Name, Email, Phone
- Address, License Type
- Years with License, Experience Level
- CV filename
- Additional info
- Submission date/time
- Status: "pending_review"

### Booking Forms
When someone fills booking.html, saved data includes:
- Collection point (name, address, date, time, phone)
- Delivery point (name, address, instructions, phone)
- Package details (contents, weight, dimensions, value, if fragile)
- Service type, Payment method
- Total price
- Submission date/time
- Status: "pending_confirmation"

---

## 🔑 Firebase Credentials Template

After creating your Firebase project, you'll get credentials like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "seehra-transport.firebaseapp.com",
  projectId: "seehra-transport",
  storageBucket: "seehra-transport.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Where to add it:**
1. `/js/firebase-config.js` - Replace the config object
2. `/admin/forms.html` - Replace the config object (around line 120)

---

## 🎯 Dashboard Features

### View Submissions
- Tabbed interface: Contact | Recruitment | Bookings
- Shows all submissions in sortable table
- Date, status, user info all visible
- Real-time updates (refresh to see new submissions)

### Filter & Search
- Can add filters (coming in next update)
- Sort by date, name, status

### Export Data  
- Data can be exported directly from Firebase Console
- Or use Firebase Admin SDK for automated exports

---

## 🔒 Security Best Practices

1. **Change the default password immediately**
   - Go to Firebase Console → Authentication → Users
   - Click user → Edit
   - Update password to something only you know

2. **Never share credentials**
   - Keep `firebaseConfig` values private
   - Never commit real credentials to git

3. **Enable 2FA** (optional but recommended)
   - Protects admin account from unauthorized access

4. **Review data regularly**
   - Check Firestore Database in Firebase Console
   - Monitor for any unusual submissions

5. **Backup data**
   - Export to JSON regularly
   - Firebase Console → Firestore → Manage

---

## 📞 Multi-User Access (Future)

To add more admin users:
1. Firebase Console → Authentication → Add user
2. Email: `new.admin@seehratransport.com`
3. Password: Set temporary password
4. Share credentials securely
5. They can login at `/admin/forms.html`

---

## 🛠️ Firebase Console Access

1. Go to: https://console.firebase.google.com
2. Select project: `seehra-transport`
3. Available sections:
   - **Firestore Database** - See raw data, export
   - **Authentication** - Manage users, passwords
   - **Rules** - Configure security
   - **Project Settings** - Get API keys

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Firebase project created
- [ ] Firestore Database enabled
- [ ] Authentication enabled + admin user created
- [ ] Security rules published
- [ ] Credentials added to `/js/firebase-config.js`
- [ ] Credentials added to `/admin/forms.html`
- [ ] Code deployed to Vercel
- [ ] Can login to dashboard
- [ ] Can submit contact form
- [ ] Data appears in dashboard
- [ ] Can see recruitment submissions
- [ ] Can see booking submissions

---

## 🚀 Next Steps

1. Complete Firebase setup following `FIREBASE-SETUP-GUIDE.md`
2. Test with sample submissions
3. Add more admin users as needed
4. Set up email notifications (optional)
5. Configure automated backups (optional)
