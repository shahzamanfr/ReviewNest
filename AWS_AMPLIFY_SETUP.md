# 🚀 AWS Amplify Supabase Setup Guide

If your reviews are "disappearing" or not loading after you deploy to AWS Amplify, it is because the environment variables in your local `.env` file are **not included** in the cloud build by default.

Follow these steps to fix it:

## 1. Add Environment Variables to AWS Amplify
1.  Log in to the **AWS Amplify Console**.
2.  Select your **App**.
3.  On the left sidebar, go to **App settings** > **Environment variables**.
4.  Click **Manage variables**.
5.  Add the following two variables (copy them exactly from your local `.env`):
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
6.  Click **Save**.

## 2. Redeploy Your App
AWS Amplify embeds these variables **at build time**. You must trigger a new build for the changes to take effect:
1.  Go to the **App Home** in Amplify.
2.  Select your branch (e.g., `main`).
3.  Click **Redeploy this version** or push a tiny change to your Git repository.

## 3. Why this happens
- Your local `.env` file is gitignored for security.
- Vite only includes variables starting with `VITE_` if they are present in the environment **during the build process**.
- Without these, the deployed app has no URL to connect to Supabase, making it look like the database is empty.

---
*Once these are added, your reviews will load correctly on your live site and will persist across all future redeploys!*
