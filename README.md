# Seehra Transport Website

A professional, responsive website for Seehra Transport - a logistics and delivery company specializing in multi-drop and last-mile services.

## 🚀 Features

- **Fully Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Clean Professional Design** - Orange, black, and white color scheme
- **SEO-Friendly Structure** - Optimized for search engines
- **Contact & Recruitment Forms** - With validation and spam protection
- **Fast Loading** - Optimized performance
- **Easy to Customize** - Well-organized code structure

## 📁 Project Structure

```
seehra-transport/
├── index.html          # Homepage
├── about.html          # About Us page
├── services.html       # Services page
├── contact.html        # Contact page
├── recruitment.html    # Recruitment/Driver opportunities page
├── gallery.html        # Fleet gallery page
├── css/
│   └── style.css      # Main stylesheet
└── js/
    └── main.js        # JavaScript functionality
```

## 🎨 Design

### Brand Colors
- **Primary Orange**: `#FF6B35` - Used for CTAs, buttons, highlights
- **Black**: `#1A1A1A` - Headers, navigation, footer
- **White**: `#FFFFFF` - Backgrounds, clean spacing

### Typography
- Font Family: Inter (or system fallback)
- Clean sans-serif design
- Responsive font sizing

## 🛠️ Customization Guide

### 1. Update Company Information

**Contact Details** (appears in footer and contact page):
```
Find and replace in ALL HTML files:
- Email: info@seehratransport.co.uk
- Phone: +44 (0) 1234 567890
- Address: [Your Address Here]
```

**Stats** (homepage and gallery):
```html
<!-- Update numbers in index.html and gallery.html -->
<h3 class="stat-number">10+</h3>
<p class="stat-label">Years Experience</p>
```

### 2. Add Your Logo

Replace the text logo with an image in the navigation (all HTML files):
```html
<!-- Find this in each HTML file: -->
<a href="index.html" class="nav-logo">
    <span class="logo-text">Seehra Transport</span>
</a>

<!-- Replace with: -->
<a href="index.html" class="nav-logo">
    <img src="images/logo.png" alt="Seehra Transport" style="height: 40px;">
</a>
```

### 3. Add Real Images

**Gallery Page** - Replace SVG placeholders:
```html
<!-- Replace SVG placeholders in gallery.html with: -->
<img src="images/van-1.jpg" alt="Delivery Van 1">
```

**About Page** - Add company photo:
```html
<!-- Replace the SVG in about.html with: -->
<img src="images/team.jpg" alt="Seehra Transport Team">
```

**Create an images folder:**
```
seehra-transport/
├── images/
│   ├── logo.png
│   ├── van-1.jpg
│   ├── van-2.jpg
│   ├── fleet.jpg
│   ├── team.jpg
│   └── etc.
```

### 4. Customize Colors

To change the brand colors, edit `css/style.css`:
```css
:root {
    --color-orange: #FF6B35;      /* Your primary color */
    --color-orange-dark: #E85A28; /* Darker shade for hover */
    --color-black: #1A1A1A;       /* Your dark color */
}
```

### 5. Update Service Coverage Area

In `contact.html` and footer sections:
```html
<p>Nationwide coverage across the UK</p>
<p>Specializing in [Your Region]</p>
```

## 📧 Form Setup

### Contact Form Integration

The forms currently use client-side validation. To make them functional:

**Option 1: Web3Forms (Recommended - Free)**
```html
<!-- Add to contact form in contact.html -->
<form action="https://api.web3forms.com/submit" method="POST" id="contact-form">
    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
    <!-- existing form fields -->
</form>
```

**Option 2: Formspree**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" id="contact-form">
    <!-- existing form fields -->
</form>
```

**Option 3: Custom Backend**
Update the form submission in `js/main.js` to send to your server endpoint.

## 🌐 Deployment

### 1. Local Server Hosting

For hosting on your local server:

1. Upload all files to your server's web directory (e.g., `/var/www/html/`)
2. Ensure proper file permissions:
   ```bash
   chmod 644 *.html
   chmod 644 css/style.css
   chmod 644 js/main.js
   ```
3. Configure your web server (Apache/Nginx)
4. Point your domain to the server

### 2. Apache Configuration

Create/edit `.htaccess` file:
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
</IfModule>

# Clean URLs (optional)
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^\.]+)$ $1.html [NC,L]
```

### 3. SEO Setup

**Update meta descriptions** in each HTML file:
- Homepage: Focus on main services
- About: Company overview
- Services: Specific services offered
- Contact: Location and contact info
- Recruitment: Driver opportunities

**Create sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://yourdomain.com/</loc>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://yourdomain.com/about.html</loc>
        <priority>0.8</priority>
    </url>
    <!-- Add all pages -->
</urlset>
```

**Create robots.txt:**
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

## 🔍 Google Integration

### Google Analytics
Add before closing `</head>` tag in all HTML files:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Google Maps
In `contact.html`, replace the placeholder with:
```html
<iframe 
    src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
    width="100%" 
    height="400" 
    style="border:0; border-radius: 8px;" 
    allowfullscreen="" 
    loading="lazy">
</iframe>
```

## ⚡ Performance Optimization

### Image Optimization
- Convert images to WebP format
- Compress images (max 200KB each)
- Use lazy loading for gallery images

### Minification (Optional)
For production, minify CSS and JS:
- CSS: Use [cssnano](https://cssnano.co/)
- JS: Use [UglifyJS](https://github.com/mishoo/UglifyJS)

## 📱 Testing Checklist

- [ ] Test all pages on mobile devices
- [ ] Test contact form submission
- [ ] Test recruitment form submission
- [ ] Test all navigation links
- [ ] Verify footer links work
- [ ] Check responsive design at all breakpoints
- [ ] Test form validation
- [ ] Verify all images load correctly
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Check page load speed (aim for <3 seconds)

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This website template is created for Seehra Transport. All rights reserved.

## 🤝 Support

For questions or support with this website:
- Review the customization guide above
- Check that all files are uploaded correctly
- Ensure file permissions are set properly
- Test forms with a form service integration

---

**Built with:** HTML5, CSS3, Vanilla JavaScript
**Timeline:** 3-4 weeks from design to launch
**Last Updated:** 2024
