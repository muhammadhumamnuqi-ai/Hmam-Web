# Discord Authentication Setup Guide

## Step 1: Create Discord Developer Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" 
3. Give it a name (e.g., "Krizzo Clone")
4. Agree to terms and click Create

## Step 2: Get OAuth2 Credentials

1. In your application, go to **OAuth2** > **General**
2. Copy your **Client ID** and **Client Secret**
3. You'll need these for the `.env.local` file

## Step 3: Add Redirect URLs

In the same OAuth2 > General page:

1. Click **Add Redirect** 
2. Add these URLs:
   - **Development**: `http://localhost:3000/api/auth/callback/discord`
   - **Production**: `https://yourdomain.com/api/auth/callback/discord` (when deploying)

3. Click Save

## Step 4: Configure Environment Variables

Open `.env.local` and fill in:

```
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_SECRET=generate_a_random_string_here
NEXTAUTH_URL=http://localhost:3000
```

### Generate NEXTAUTH_SECRET

Run this in your terminal:
```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

## Step 5: Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and click "Connect Discord" to link your Discord profile!

## Notes

- The redirect URI must EXACTLY match what's registered in Discord Developer Portal
- For production, update `NEXTAUTH_URL` to your actual domain
- Keep your `DISCORD_CLIENT_SECRET` secret - never commit `.env.local` to git
