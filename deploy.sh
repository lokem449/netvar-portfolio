#!/bin/bash
# Deploy Script - Netvar Portfolio
# Execute this after vercel login is done

cd "$(dirname "$0")"

echo "🚀 Netvar Portfolio Deploy Script"
echo "=================================="
echo ""

# Vercel Deploy
echo "1️⃣  Deploying 3D Landing Page to Vercel..."
cd interactive-3d-landing
vercel --prod --yes
VERCEL_URL=$(vercel ls -json | jq -r '.[0].url')
cd ..

echo ""
echo "✅ 3D Landing deployed to: $VERCEL_URL"
echo ""

# GitHub Push
echo "2️⃣  Pushing to GitHub..."
git push -u origin master

echo ""
echo "✅ All pushed to GitHub: https://github.com/lokem449/netvar-portfolio"
echo ""

echo "📋 Next steps:"
echo "  1. Copy Vercel URL: $VERCEL_URL"
echo "  2. Post on LinkedIn with DEPLOY_GUIDE.md template"
echo "  3. Update LinkedIn with live link"
echo ""
echo "🎉 Portfolio is LIVE!"
