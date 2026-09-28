Write-Host "🚀 Deploying to Firebase Hosting Preview Channel (preview)..." -ForegroundColor Cyan
npx -y firebase-tools@latest hosting:channel:deploy preview --expires 7d
Write-Host "💡 Note: Preview channels automatically target 'state_dev' in Firestore to isolate testing data." -ForegroundColor Green
