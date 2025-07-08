# GitHub Pages Deployment Instructions

## Quick Setup for GitHub Pages Demo

1. **Push to GitHub**: Make sure your repository is on GitHub

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"

3. **Automatic Deployment**: 
   - The GitHub Action will automatically build and deploy your demo
   - Your demo will be available at: `https://yourusername.github.io/budget-planner`

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Navigate to frontend directory
cd frontend

# Install gh-pages if not already installed
yarn add --dev gh-pages

# Copy demo version
cp src/App.demo.js src/App.js

# Update package.json homepage field with your GitHub Pages URL
# "homepage": "https://yourusername.github.io/budget-planner"

# Build and deploy
yarn build
yarn deploy
```

## Demo Features

The GitHub Pages demo includes:
- ✅ Full frontend functionality with mock data
- ✅ Local storage persistence
- ✅ All UI interactions working
- ✅ Charts and analytics
- ✅ Responsive design
- ✅ Demo banner indicating it's a preview version

## Note

The demo version uses mock data and local storage instead of the backend API, since GitHub Pages only hosts static sites. Users can still experience the full UI and functionality!