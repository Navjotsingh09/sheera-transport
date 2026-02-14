# Seehra Transport Website - Deployment Checklist

## Pre-Launch Customization

### 1. Company Information
- [ ] Update company name (if different from "Seehra Transport")
- [ ] Replace email: info@seehratransport.co.uk with actual email
- [ ] Replace phone: +44 (0) 1234 567890 with actual phone
- [ ] Add full business address in footer and contact page
- [ ] Update service coverage area/region

### 2. Branding
- [ ] Add company logo (replace text logo in navigation)
- [ ] Verify brand colors match (currently Orange #FF6B35, Black #1A1A1A)
- [ ] Update favicon (add favicon.ico to root directory)

### 3. Content Updates
- [ ] Review and edit homepage hero text
- [ ] Update "About Us" company story
- [ ] Verify service descriptions are accurate
- [ ] Update stats/numbers (years in business, deliveries, fleet size)
- [ ] Customize recruitment benefits and requirements

### 4. Images
- [ ] Replace all SVG placeholders with real photos
- [ ] Add gallery images (minimum 6 photos):
  - Fleet vehicles
  - Operations/loading
  - Team/drivers
  - Warehouse/depot
- [ ] Add hero background image (optional)
- [ ] Add about page company photo
- [ ] Optimize all images (WebP format, <200KB each)

### 5. Forms
- [ ] Choose form service (Web3Forms, Formspree, or custom backend)
- [ ] Add form API keys/endpoints
- [ ] Test contact form submission
- [ ] Test recruitment form submission
- [ ] Set up form notification emails
- [ ] Add spam protection/reCAPTCHA (optional)

### 6. SEO
- [ ] Update meta descriptions for each page
- [ ] Add Google Analytics code
- [ ] Add Google Search Console verification
- [ ] Update sitemap.xml with actual domain
- [ ] Update robots.txt with actual domain
- [ ] Create and submit sitemap to Google
- [ ] Add structured data (Schema.org markup)

### 7. Integrations
- [ ] Add Google Maps embed to contact page
- [ ] Set up email service for form submissions
- [ ] Add social media links (if applicable)
- [ ] Set up Google Business Profile

## Technical Setup

### 8. Domain & Hosting
- [ ] Domain registered and configured
- [ ] DNS pointing to hosting server
- [ ] SSL certificate installed (HTTPS)
- [ ] Server configuration complete
- [ ] All files uploaded to server

### 9. File Structure
- [ ] Create /images directory
- [ ] Upload all HTML files
- [ ] Upload css/style.css
- [ ] Upload js/main.js
- [ ] Upload sitemap.xml
- [ ] Upload robots.txt
- [ ] Set proper file permissions

### 10. Performance
- [ ] Enable gzip compression
- [ ] Set up browser caching
- [ ] Minify CSS and JS (optional)
- [ ] Optimize images
- [ ] Test page load speed (aim for <3 seconds)
- [ ] Run Google PageSpeed Insights

## Pre-Launch Testing

### 11. Functionality Testing
- [ ] Test all navigation links
- [ ] Test mobile menu (hamburger)
- [ ] Test contact form submission
- [ ] Test recruitment form submission
- [ ] Test form validation
- [ ] Test file upload (CV upload on recruitment form)
- [ ] Verify all buttons work
- [ ] Test smooth scrolling to sections

### 12. Cross-Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Firefox
- [ ] Safari (desktop & mobile)
- [ ] Edge
- [ ] Test on actual mobile devices

### 13. Responsive Design Testing
- [ ] Desktop (1920px, 1440px, 1280px)
- [ ] Laptop (1024px)
- [ ] Tablet (768px)
- [ ] Mobile (414px, 375px, 320px)
- [ ] Test landscape and portrait orientations

### 14. Content Review
- [ ] Proofread all text for typos
- [ ] Check grammar and spelling
- [ ] Verify all phone numbers and emails
- [ ] Verify all addresses
- [ ] Check footer information
- [ ] Test all external links

### 15. Accessibility
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Color contrast is sufficient
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

## Launch

### 16. Go Live
- [ ] Final backup of all files
- [ ] Remove any test/placeholder content
- [ ] Update copyright year if needed
- [ ] Make site live
- [ ] Test live site thoroughly
- [ ] Monitor for any errors

### 17. Post-Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics reporting
- [ ] Set up uptime monitoring
- [ ] Create maintenance schedule
- [ ] Document login credentials (forms, analytics, etc.)

## Ongoing Maintenance

### 18. Regular Updates
- [ ] Update gallery with new photos (monthly)
- [ ] Review and update stats/numbers (quarterly)
- [ ] Update news/blog if applicable
- [ ] Check for broken links (monthly)
- [ ] Review form submissions regularly
- [ ] Monitor site performance
- [ ] Update content as services change

### 19. Security
- [ ] Keep SSL certificate up to date
- [ ] Regular backups
- [ ] Monitor for security issues
- [ ] Update any third-party services

### 20. Marketing
- [ ] Add to Google Business Profile
- [ ] Share on social media (if applicable)
- [ ] Add to business directories
- [ ] Print URL on vehicles/marketing materials
- [ ] Update business cards and letterhead

---

## Quick Customization Reference

### Email Addresses to Update
All HTML files contain: `info@seehratransport.co.uk` and `quotes@seehratransport.co.uk`

### Phone Numbers to Update
All HTML files contain: `+44 (0) 1234 567890`

### Addresses to Update
Look for `[Your Address Here]` in:
- Footer (all pages)
- Contact page
- About page

### Stats to Update (index.html, gallery.html)
```html
<h3 class="stat-number">10+</h3> <!-- Years Experience -->
<h3 class="stat-number">50K+</h3> <!-- Deliveries Completed -->
<h3 class="stat-number">100+</h3> <!-- Fleet Vehicles -->
<h3 class="stat-number">98%</h3> <!-- On-Time Rate -->
```

---

## Support Resources

- **Web3Forms**: https://web3forms.com/
- **Google Analytics**: https://analytics.google.com/
- **Google Search Console**: https://search.google.com/search-console
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **TinyPNG** (Image compression): https://tinypng.com/

---

**Estimated Timeline:**
- Customization: 2-3 days
- Content & Images: 3-5 days
- Testing: 2-3 days
- Launch: 1 day
- **Total: 8-12 days**
