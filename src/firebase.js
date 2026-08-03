import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const env = import.meta.env || {};

export const GOOGLE_CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';
export const FIREBASE_API_KEY = env.VITE_FIREBASE_API_KEY || 'AIzaSyRotaractSTV_OfficialAdminKey';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "rotaract-stv.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "rotaract-stv",
  storageBucket: "rotaract-stv.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:rotaractstv12345"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const OFFICIAL_ADMIN_EMAIL = 'rotaractclubofstv@gmail.com';

/**
 * Dynamically load official Google Identity Services SDK (https://accounts.google.com/gsi/client)
 */
export function loadGoogleIdentityServices() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      resolve(window.google.accounts);
      return;
    }
    const existingScript = document.getElementById('google-gsi-sdk');
    if (existingScript) {
      existingScript.onload = () => resolve(window.google?.accounts);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-sdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google?.accounts);
    script.onerror = (err) => reject(new Error('Failed to load Google Identity Services SDK script from accounts.google.com'));
    document.body.appendChild(script);
  });
}

/**
 * Authenticate via Google OAuth Popup
 */
export async function loginWithGoogleAuth() {
  console.log('====================================================');
  console.log('[Google OAuth Diagnostic Report]');
  console.log('Current Origin:', window.location.origin);
  console.log('Current Host:', window.location.host);
  console.log('Configured Google Client ID:', GOOGLE_CLIENT_ID);
  console.log('Configured Firebase API Key:', FIREBASE_API_KEY);
  console.log('====================================================');

  // 1. Try GIS OAuth 2.0 Token Client if Client ID is configured
  try {
    const gsiAccounts = await loadGoogleIdentityServices();
    if (gsiAccounts && gsiAccounts.oauth2 && GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('your-google-client-id')) {
      console.log('[Google OAuth Diagnostic] Launching GIS initTokenClient popup...');
      return new Promise((resolve) => {
        const client = gsiAccounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              console.error('[Google OAuth Diagnostic] GIS Token Client Error:', tokenResponse);
              resolve({
                success: false,
                code: tokenResponse.error,
                error: `[${tokenResponse.error}] ${tokenResponse.error_description || 'Google OAuth authentication failed.'}`,
                details: tokenResponse
              });
              return;
            }
            try {
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const userInfo = await userInfoRes.json();
              console.log('[Google OAuth Diagnostic] Authenticated User Profile via GIS:', userInfo);
              resolve({
                success: true,
                email: userInfo.email,
                name: userInfo.name,
                user: userInfo
              });
            } catch (fetchErr) {
              console.error('[Google OAuth Diagnostic] Userinfo fetch error:', fetchErr);
              resolve({ success: false, error: fetchErr.message, details: fetchErr });
            }
          }
        });
        client.requestAccessToken();
      });
    }
  } catch (gsiErr) {
    console.warn('[Google OAuth Diagnostic] GIS SDK initialization notice:', gsiErr);
  }

  // 2. Fallback to Firebase signInWithPopup
  try {
    console.log('[Google OAuth Diagnostic] Attempting Firebase signInWithPopup...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('[Google OAuth Diagnostic] Firebase Auth Success:', result.user);
    return { success: true, email: result.user.email, user: result.user };
  } catch (err) {
    console.error('[Google OAuth Diagnostic] Firebase Auth Error:', err);
    let detailedMsg = err.message || 'Authentication failed';
    let errCode = err.code || 'oauth_error';

    if (err.code === 'auth/invalid-api-key') {
      detailedMsg = `[auth/invalid-api-key] The Firebase/Google API key ("${FIREBASE_API_KEY}") is invalid. Replace VITE_FIREBASE_API_KEY in .env with your live API Key from Google Cloud Console.`;
    } else if (err.code === 'auth/unauthorized-domain') {
      detailedMsg = `[auth/unauthorized-domain] Origin "${window.location.origin}" is not authorized in Firebase/Google OAuth. Add "${window.location.host}" to Authorized Domains in Firebase Console.`;
    } else if (err.code === 'auth/popup-closed-by-user') {
      detailedMsg = `[auth/popup-closed-by-user] The Google sign-in popup window was closed before completing authentication.`;
    }

    return {
      success: false,
      code: errCode,
      error: detailedMsg,
      rawError: err
    };
  }
}
