# Ellinglish Landing Page

A beautiful, responsive landing page for the Ellinglish app built with HTML, CSS (Tailwind), and vanilla JavaScript.

## Structure

```
landing/
├── index.html          # Root redirect page
├── en/
│   ├── index.html      # English homepage
│   ├── contact.html    # English contact page
│   ├── legal-notice.html    # English legal notice
│   └── privacy-policy.html  # English privacy policy
├── fr/
│   ├── index.html      # French homepage
│   ├── contact.html    # French contact page
│   ├── mentions-legales.html # French legal notice  
│   └── politique-confidentialite.html # French privacy policy
├── public/
│   ├── images/         # Landing page assets
│   └── screenshots/    # App screenshots
├── package.json
└── README.md
```

## Features

- **Multi-language support** (English/French)
- **Responsive design** with Tailwind CSS
- **Purple gradient theme** matching the app design
- **DynaPuff font** for playful headings
- **Inter font** for clean body text
- **Interactive contact form** with mailto functionality
- **App store buttons** (ready for real links)
- **Screenshots placeholders** for app showcase
- **Complete legal pages** (Privacy Policy & Legal Notice)
- **GDPR & App Store compliant** documentation

## Design Elements

- Purple gradient background (`from-purple-900 via-purple-800 to-purple-700`)
- Flower emojis (🌸🌼🌻) as brand elements
- Glass morphism effects with backdrop blur
- Hover animations and transitions
- Mobile-first responsive design

## Development

To run locally:
```bash
cd landing
npm run dev
# or
npm start
```

This will start a local server on port 3000 using the `serve` package.

Available scripts:
- `npm run dev` - Start development server on port 3000
- `npm start` - Same as dev (standard npm convention)  
- `npm run preview` - Start preview server on port 8080
- `npm run build` - Show build status (static site)

## Deployment

This is a static site ready for deployment on:
- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages

Simply upload the `landing/` folder contents to your hosting provider.

## Adding Screenshots

1. Add your app screenshots to `public/screenshots/`
2. Update the placeholder divs in the homepage files
3. Replace the mockup content with real images

Example:
```html
<img src="/public/screenshots/game-screen.png" alt="Game Screen" class="rounded-2xl w-full">
```

## Contact Form

The contact form uses `mailto:` links to open the user's email client. For production, you might want to integrate with:
- Formspree
- Netlify Forms
- EmailJS

## Customization

- Colors: Update the Tailwind config in each HTML file
- Fonts: Modify the Google Fonts imports
- Content: Edit the text in both language versions
- Images: Replace placeholders with real assets

## 🎯 Next Steps

1. **Add real screenshots** to `public/screenshots/` folder
2. **Replace app store buttons** with real download links when ready
3. **Complete company address** in legal pages
4. **Test the contact form** 
5. **Deploy to Cloudflare Pages**

## 📋 Legal Compliance

The landing page includes comprehensive legal pages that meet requirements for:

### **App Store Requirements:**
- ✅ **Privacy Policy URL** (required by Apple & Google)
- ✅ **Data collection disclosure** 
- ✅ **Third-party services documentation**
- ✅ **User rights information**

### **CNIL (French DPA) Compliance:**
- ✅ **GDPR Article 13/14** information requirements
- ✅ **Legal basis** for each processing purpose
- ✅ **Data retention periods**
- ✅ **User rights** (access, rectification, erasure, etc.)
- ✅ **Data transfer** safeguards documentation
- ✅ **No cookies** without consent
- ✅ **Minors protection** measures

### **Content:**
- **French pages:** `/fr/mentions-legales.html` & `/fr/politique-confidentialite.html`
- **English pages:** `/en/legal-notice.html` & `/en/privacy-policy.html`
- **Company:** NOVALYA (SIRET: 945 399 269 00012)
- **Data collected:** Only contact form email + technical data for app functioning
- **No tracking:** No advertising cookies or marketing trackers