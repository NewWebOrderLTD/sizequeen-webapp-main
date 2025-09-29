# Google OAuth Setup Guide for SizeQueen Webapp

## Problem
The Google OAuth authentication is redirecting to the Google authorization URL but failing because Google OAuth is not properly configured in Supabase.

## Solution Steps

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project (or select existing)**
   - Click "Select a project" → "New Project"
   - Name: "SizeQueen Webapp" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google OAuth2 API"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "SizeQueen Webapp OAuth"

5. **Configure Authorized Redirect URIs**
   - Add these URIs:
     - `http://localhost:3000/auth/callback` (for development)
     - `https://yourdomain.com/auth/callback` (for production)
   - Click "Create"

6. **Copy Credentials**
   - Copy the "Client ID" and "Client Secret"
   - Keep these safe - you'll need them for the next steps

### 2. Supabase Configuration

The Google OAuth configuration has been added to `supabase/config.toml`:

```toml
[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
redirect_uri = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_REDIRECT_URI)"
url = ""
```

### 3. Environment Variables

Add these environment variables to your `.env` file:

```bash
# Google OAuth Configuration
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your_google_client_id_here
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your_google_client_secret_here
SUPABASE_AUTH_EXTERNAL_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

**Replace the placeholder values with your actual Google OAuth credentials from step 1.**

### 4. Restart Supabase

After updating the configuration and environment variables:

```bash
# Stop Supabase
npm run supabase:stop

# Start Supabase with new configuration
npm run supabase:start
```

### 5. Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the sign-in page
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you should be redirected back to your app

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Ensure the redirect URI in Google Console exactly matches your environment variable
   - Check for trailing slashes and http vs https

2. **"invalid_client" error**
   - Verify your Client ID and Client Secret are correct
   - Ensure the OAuth consent screen is properly configured

3. **"access_denied" error**
   - Check if the OAuth consent screen is in testing mode
   - Add test users or publish the app

4. **Callback not working**
   - Ensure the callback route is accessible
   - Check browser console for errors
   - Verify Supabase is running with the new configuration

### Debug Steps:

1. Check Supabase logs:
   ```bash
   npm run supabase:status
   ```

2. Check browser network tab for failed requests

3. Verify environment variables are loaded:
   ```bash
   echo $SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID
   ```

## Production Deployment

For production:

1. Update the redirect URI in Google Console to your production domain
2. Update the environment variable:
   ```bash
   SUPABASE_AUTH_EXTERNAL_GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback
   ```
3. Redeploy your application

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive data
- Regularly rotate your OAuth credentials
- Monitor OAuth usage in Google Cloud Console
