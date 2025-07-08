#!/bin/bash

# Budget Planner - GitHub Pages Demo Setup Script

echo "🚀 Setting up Budget Planner for GitHub Pages deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Navigate to frontend directory if we're in project root
if [ -f "frontend/package.json" ]; then
    cd frontend
fi

echo "📦 Installing dependencies..."
yarn install

echo "🔧 Setting up demo configuration..."

# Copy demo files to replace main app for GitHub Pages
cp src/App.demo.js src/App.js
echo "✅ Demo version configured"

# Build the project
echo "🏗️  Building project for deployment..."
yarn build

echo "✅ Build complete! Your app is ready for GitHub Pages."
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to Settings → Pages in your GitHub repository"
echo "3. Select 'GitHub Actions' as the source"
echo "4. Update the homepage URL in package.json to match your repository"
echo "5. Push to main branch to trigger deployment"
echo ""
echo "🌐 Your demo will be available at: https://yourusername.github.io/budget-planner"
echo ""
echo "💡 Tip: The demo uses mock data and local storage. For the full backend experience, run the app locally!"