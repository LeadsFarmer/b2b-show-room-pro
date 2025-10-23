#!/bin/bash

echo "🚀 Railway B2B Synchronization Script"
echo "======================================"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it:"
    echo "   npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please login:"
    echo "   railway login"
    exit 1
fi

echo "✅ Railway CLI ready"
echo ""

# Step 1: Link project
echo "📍 Step 1: Linking to Railway project..."
echo "   Please select 'srpB2B' from the list"
echo ""
railway link

if [ $? -ne 0 ]; then
    echo "❌ Failed to link project"
    exit 1
fi

echo ""
echo "✅ Project linked successfully"
echo ""

# Step 2: Show current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📌 Current branch: $CURRENT_BRANCH"
echo ""

# Step 3: Merge railway-sync if not on it
if [ "$CURRENT_BRANCH" != "railway-sync" ]; then
    echo "🔄 Merging railway-sync template..."
    git checkout main
    git merge railway-sync --strategy-option theirs -m "Merge Railway template optimizations"
    
    if [ $? -ne 0 ]; then
        echo "❌ Merge failed. Please resolve conflicts manually"
        exit 1
    fi
    
    echo "✅ Merge completed"
    echo ""
fi

# Step 4: Push to Railway
echo "📤 Step 4: Pushing to Railway..."
read -p "Push to Railway now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push b2b main --force
    
    if [ $? -ne 0 ]; then
        echo "❌ Push failed"
        exit 1
    fi
    
    echo ""
    echo "✅ Code pushed to Railway!"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Monitor deployment: railway logs -f"
    echo "   2. Check status: railway status"
    echo "   3. View services: railway service list"
    echo ""
    echo "📊 URLs will be available after deployment completes (3-5 min)"
else
    echo "⏭️  Skipping push. You can push manually with:"
    echo "   git push b2b main --force"
fi

echo ""
echo "✅ Synchronization script completed!"
echo "📖 See RAILWAY_SYNC_GUIDE.md for detailed instructions"
