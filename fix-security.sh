#!/bin/bash

echo "🔧 Fixing security vulnerabilities and updating dependencies..."

# Step 1: Backup current package.json
echo "📦 Backing up current package.json..."
cp package.json package.json.backup

# Step 2: Replace with fixed version
echo "🔄 Updating package.json with security fixes..."
cp package-fix.json package.json

# Step 3: Clean install
echo "🧹 Cleaning node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "📥 Installing updated dependencies..."
npm install

# Step 4: Update Draft component import
echo "🔧 Updating Draft component imports..."
if [ -f "src/components/Draft/Draft.js" ]; then
    sed -i.bak 's/react-beautiful-dnd/@hello-pangea\/dnd/g' src/components/Draft/Draft.js
    echo "✅ Updated Draft.js imports"
fi

# Step 5: Check results
echo "🔍 Checking for remaining vulnerabilities..."
npm audit

echo ""
echo "🎉 Security fix complete!"
echo ""
echo "📋 Summary of changes:"
echo "✅ Replaced react-beautiful-dnd with @hello-pangea/dnd"
echo "✅ Fixed react-scripts version"
echo "✅ Updated Tailwind CSS"
echo "✅ Added package overrides for security"
echo ""
echo "🚀 Start your app: npm start"
