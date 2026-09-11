Write-Host "🚀 Deploying to Firebase Hosting & Firestore Rules (balsavimas-vaciukai)..."
npx -y firebase-tools@latest deploy --only hosting,firestore:rules --non-interactive
Write-Host "✅ Done! Live at: https://balsavimas-vaciukai.web.app"
