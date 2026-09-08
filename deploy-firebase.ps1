Write-Host "🚀 Deploying to Firebase Hosting (balsavimas-vaciukai)..."
npx -y firebase-tools@latest deploy --only hosting --non-interactive
Write-Host "✅ Done! Live at: https://balsavimas-vaciukai.web.app"
