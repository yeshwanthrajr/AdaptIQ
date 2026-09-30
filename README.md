<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2fc4c8a8-edad-4b7a-bd33-99eaa8970585

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and set `GEMINI_API_KEY` to your Gemini API key
3. Run the app:
   `npm run dev`

Email OTP registration also requires a Resend API key and a verified sender address. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env.local`; OTP requests return a configuration error until these are set.

For Google sign-in, enable the Google provider in Firebase Authentication and add `localhost` to its Authorized domains. Set `ADMIN_EMAILS` to a comma-separated list of verified Google accounts allowed to bootstrap an administrator profile. Student and faculty accounts are created through OTP registration and require administrator approval.
