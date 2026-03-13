# DEPLOYMENT GUIDE
## Seehra Transport Website - Vercel Deployment

---

## Prerequisites

Before deploying to Vercel, ensure you have:
- [x] Git repository initialized
- [x] GitHub/GitLab/Bitbucket account
- [x] Vercel account (sign up at https://vercel.com)
- [x] All files committed to repository

---

## Quick Deployment Steps

### Method 1: Vercel CLI (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy from Project Directory
```bash
cd /Users/navjotsinghhundal/Sheera/seehra-transport
vercel
```

#### 4. Follow Prompts
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? **seehra-transport** (or your preferred name)
- In which directory is your code located? **.**
- Want to override settings? **N**

#### 5. Deploy to Production
```bash
vercel --prod
```

---

### Method 2: GitHub + Vercel Dashboard

#### 1. Push Code to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Seehra Transport website with booking system and admin dashboard"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/seehra-transport.git

# Push to GitHub
git push -u origin main
```

#### 2. Import to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Choose "Import Git Repository"
4. Select your GitHub repository
5. Configure project settings:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** (leave empty for static site)
   - **Output Directory:** (leave empty)
6. Click "Deploy"

---

## Environment Variables (Optional)

If you plan to add environment-specific configurations later:

### For Frontend (Static Site)
Currently, the frontend is fully static with no build process, so environment variables are not needed for initial deployment.

### For Future Backend Integration
When you implement the backend API (see BACKEND-API-SPECIFICATION.md), you'll need to add:

```env
NEXT_PUBLIC_API_URL=https://api.seehratransport.co.uk
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaXXX
```

Add these in Vercel Dashboard → Project → Settings → Environment Variables

---

## Custom Domain Setup

### 1. Add Domain in Vercel
1. Go to Project Settings → Domains
2. Enter your domain: **seehratransport.com**
3. Add **www.seehratransport.com** as well

### 2. Configure DNS Records
Add these records at your domain registrar:

**For Apex Domain (seehratransport.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Wait for DNS Propagation
- Can take 24-48 hours
- Check status: https://www.whatsmydns.net/

### 4. Verify SSL Certificate
- Vercel automatically provisions SSL certificates
- Force HTTPS is enabled by default

---

## Post-Deployment Checklist

### ✅ Functionality Tests
- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Quote calculator functions properly
- [ ] Booking form:
  - [ ] Step 1 (Collection details) validation works
  - [ ] Step 2 (Delivery details) validation works
  - [ ] Step 3 (Confirmation & payment) displays correctly
  - [ ] Price calculation is accurate
  - [ ] Form submission creates booking
  - [ ] Redirect to confirmation page works
- [ ] Confirmation page:
  - [ ] Booking ID and tracking number display
  - [ ] Booking summary shows all details
  - [ ] "Track Delivery" button works
  - [ ] "Book Another" button works
- [ ] Tracking page:
  - [ ] Tracking number input works
  - [ ] Timeline displays correctly
- [ ] Customer portal:
  - [ ] Login form displays
  - [ ] Registration form displays
- [ ] Admin pages:
  - [ ] Admin login page loads (/admin/login.html)
  - [ ] Admin dashboard loads (/admin/dashboard.html)
  - [ ] Demo credentials work:
    - admin001 / admin123
    - disp001 / disp123
    - driver001 / driver123
  - [ ] Navigation between sections works
  - [ ] Dashboard stats display
  - [ ] Orders table loads
  - [ ] Driver status shows

### ✅ Performance Tests
- [ ] All pages load in < 3 seconds
- [ ] Images are optimized
- [ ] CSS/JS files are minified (done by Vercel automatically)
- [ ] Lighthouse score:
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90

### ✅ SEO Checks
- [ ] Meta tags present on all pages
- [ ] Open Graph tags for social sharing
- [ ] Sitemap.xml accessible at /sitemap.xml
- [ ] Robots.txt accessible at /robots.txt
- [ ] Canonical URLs set correctly
- [ ] All images have alt text

### ✅ Mobile Responsiveness
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad
- [ ] Hamburger menu works
- [ ] Forms are usable on mobile
- [ ] Touch targets are adequate (min 44x44px)

### ✅ Browser Compatibility
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari iOS (latest)
- [ ] Chrome Android (latest)

### ✅ Security Checks
- [ ] HTTPS enabled
- [ ] Security headers present (check vercel.json)
- [ ] No sensitive data exposed in frontend code
- [ ] Admin pages have noindex meta tag
- [ ] XSS protection enabled

---

## Monitoring & Analytics

### Google Analytics Setup
1. Create GA4 property at https://analytics.google.com
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to all HTML files before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Vercel Analytics
- Automatically enabled for all Vercel deployments
- View at: Vercel Dashboard → Project → Analytics
- Tracks:
  - Page views
  - Top pages
  - Top referrers
  - Unique visitors
  - Web Vitals (Core Web Vitals metrics)

### Error Monitoring (Optional)
For production, consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Hotjar** for user behavior analytics

---

## Continuous Deployment

Vercel automatically deploys:
- **Production:** When you push to `main` branch
- **Preview:** For all other branches and pull requests

### Workflow
1. Make changes locally
2. Commit to a feature branch
3. Push to GitHub
4. Vercel creates a preview deployment
5. Test preview at provided URL
6. Merge to `main` for production deployment

---

## Rollback Procedure

If something goes wrong after deployment:

### Method 1: Via Vercel Dashboard
1. Go to Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

### Method 2: Via Git
```bash
# Revert to previous commit
git revert HEAD

# Or reset to specific commit
git reset --hard <commit-hash>

# Force push (use with caution)
git push --force
```

---

## Backend Integration (Future)

When the backend API is ready (see BACKEND-API-SPECIFICATION.md):

### 1. Update API Endpoints
Replace placeholder localStorage calls with actual API calls:

**booking.js:**
```javascript
// Replace this:
localStorage.setItem('bookingData', JSON.stringify(bookingData));

// With this:
const response = await fetch('https://api.seehratransport.co.uk/v1/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify(bookingData)
});
const result = await response.json();
```

**admin-login.js:**
```javascript
// Replace demo credentials with:
const response = await fetch('https://api.seehratransport.co.uk/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const result = await response.json();
```

### 2. Enable Real-Time Features
Add WebSocket connection for live tracking:

```javascript
const ws = new WebSocket('wss://api.seehratransport.co.uk/ws');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'authenticate',
    token: userToken
  }));
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'order',
    orderId: currentOrderId
  }));
};
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'order_status') {
    updateOrderStatus(data);
  }
};
```

### 3. Add Payment Processing
Integrate Stripe Elements:

```javascript
// Load Stripe
const stripe = Stripe('pk_live_xxx');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Handle payment
const { clientSecret } = await fetch('/api/payments/create-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId, amount })
}).then(r => r.json());

const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: { card: cardElement }
});
```

---

## Troubleshooting

### Issue: Pages Return 404
**Solution:** Check vercel.json configuration. Ensure cleanUrls is set to true.

### Issue: CSS/JS Not Loading
**Solution:** 
- Check file paths (should be relative: `./css/style.css`)
- Clear browser cache
- Check Vercel build logs

### Issue: Forms Not Submitting
**Solution:**
- Check browser console for JavaScript errors
- Ensure all form IDs match JavaScript selectors
- Verify event listeners are attached

### Issue: Slow Load Times
**Solution:**
- Enable Vercel Edge Network
- Optimize images (use WebP format)
- Minify CSS/JS
- Enable compression in vercel.json

### Issue: Deployment Fails
**Solution:**
- Check build logs in Vercel dashboard
- Ensure all files are committed to git
- Verify vercel.json syntax is correct
- Try `vercel --debug` for verbose logging

---

## Support & Resources

### Vercel Documentation
- Getting Started: https://vercel.com/docs
- CLI Reference: https://vercel.com/docs/cli
- Custom Domains: https://vercel.com/docs/custom-domains

### Project Documentation
- Backend API Spec: [BACKEND-API-SPECIFICATION.md](BACKEND-API-SPECIFICATION.md)
- System Workflow: [SYSTEM_WORKFLOW.md](SYSTEM_WORKFLOW.md)
- Project Analysis: [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)
- Deployment Checklist: [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)

### Contact
For deployment support:
- Email: dev@seehratransport.co.uk
- Vercel Support: https://vercel.com/support

---

## Production URLs

After deployment, your site will be available at:
- **Vercel URL:** https://sheera-tau.vercel.app
- **Custom Domain:** https://seehratransport.co.uk (after DNS setup)
- **WWW Subdomain:** https://www.seehratransport.co.uk

### Admin Access
- **Admin Login:** https://seehratransport.co.uk/admin/login.html
- **Admin Dashboard:** https://seehratransport.co.uk/admin/dashboard.html (after login)

**Demo Credentials:**
- Administrator: `admin001` / `admin123`
- Dispatcher: `disp001` / `disp123`
- Driver: `driver001` / `driver123`

---

## Deployment Timeline

1. **Immediate (5 minutes):**
   - Push code to GitHub
   - Import to Vercel
   - Automatic deployment begins

2. **Within 1 hour:**
   - Initial deployment complete
   - Site live on Vercel URL
   - SSL certificate provisioned

3. **Within 24 hours:**
   - Custom domain configured
   - DNS propagated globally
   - Production domain active

4. **Within 1 week:**
   - All functionality tested
   - Performance optimized
   - Analytics configured
   - SEO verified

---

**Ready to Deploy!**

Your Seehra Transport website is now ready for production deployment to Vercel. Follow the steps above and your site will be live in minutes! 🚀

---

**Last Updated:** December 2024  
**Version:** 1.0
