# Firebase Automated CD Setup Guide

This project includes an automated Continuous Deployment (CD) pipeline in [`.github/workflows/ci.yml`](file:///d:/Workplace/_FastSimple/tautos-bukiausias/.github/workflows/ci.yml).

Whenever code is pushed or merged into `master` or `main`:
1. The **Validate Code & Security** job checks ES module syntax, runs automated unit tests, validates JSON configs, and scans for secret leaks.
2. Once validation passes, the **Deploy to Firebase (CD)** job automatically deploys the latest version to Firebase Hosting (`https://balsavimas-vaciukai.web.app`) and synchronizes Firestore Security Rules (`firestore.rules`).

---

## Prerequisite: Adding Deployment Secret to GitHub

For GitHub Actions to deploy to your Firebase project (`balsavimas-vaciukai`), you need to provide credentials via GitHub Secrets. Choose one of the two options below:

### Option 1: Service Account Key (Recommended by Google)

1. Open the [Firebase Console](https://console.firebase.google.com/project/balsavimas-vaciukai/settings/serviceaccounts/adminsdk).
2. Click **Generate new private key** and download the `.json` key file.
   *(Make sure this file is kept secure and NEVER committed to Git!)*
3. Navigate to your GitHub repository in your browser:
   `https://github.com/tommardev/tautos-bukiausias-balsavimas/settings/secrets/actions`
4. Click **New repository secret**.
5. Name: `FIREBASE_SERVICE_ACCOUNT_BALSAVIMAS_VACIUAI`
6. Value: Paste the **entire contents** of the downloaded JSON key file.
7. Click **Add secret**.

---

### Option 2: Firebase CI Token (Fastest Setup)

If you prefer a 30-second token setup without downloading a service account JSON:

1. In your local terminal, run:
   ```bash
   npx -y firebase-tools@latest login:ci
   ```
2. Complete the browser login prompt.
3. The terminal will output a token string:
   ```text
   ✔  Success! Use this token to deploy on a CI server:
   1//04...
   ```
4. Navigate to your GitHub repository:
   `https://github.com/tommardev/tautos-bukiausias-balsavimas/settings/secrets/actions`
5. Click **New repository secret**.
6. Name: `FIREBASE_TOKEN`
7. Value: Paste the token string from step 3.
8. Click **Add secret**.

---

## Verifying Deployment

Once the secret is added:
- Any new commit pushed to `master` will trigger the workflow in GitHub Actions under the **Actions** tab.
- You can monitor the live deployment status directly from GitHub Actions.
