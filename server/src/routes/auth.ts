import express from 'express';
import { supabaseAdmin } from '../supabase/client';


const router = express.Router();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';



/**
 *  OAuth login: redirects to provider login page and then back to /auth/callback
 */
router.post('/login', async (req, res) => {
    const provider = (req.query.provider as string) || 'google';
    try {
        const { data, error} = await supabaseAdmin.auth.signInWithOAuth({
            provider: provider as any,
            options: {
                redirectTo: `${SERVER_URL}/auth/callback`,
            }
        });
        if (error){
        console.error('Supabase OAuth error:', error);
        return res.status(500).json({ error: 'OAuth sign-in failed' });
        }
        const redirectUrl = data?.url;
        if (!redirectUrl) return res.status(500).json({ error: 'No redirect URL from Supabase' });
        return res.json({ url: redirectUrl });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * OAuth callback: handles redirect from provider and sets session cookie
 */
router.get('/callback', async (req, res) => {
    try {
        const authCode = req.query.code as string | undefined;
        // check token returned from supabase provider
        if (!authCode) {
            console.warn('Missing auth code', req.query);
            return res.redirect(`${FRONTEND_URL}/auth/error?auth=failed`); // TODO: improve error handling
        }
        const {data, error} = await supabaseAdmin.auth.exchangeCodeForSession(authCode);
        if (error || !data?.session) {
            console.error('Error exchanging code for session:', error);
            return res.redirect(`${FRONTEND_URL}/auth/error?auth=failed`); // TODO: improve error handling
        }

        const {access_token, refresh_token, expires_in} = data.session;

        // Set httpOnly cookie 'sb_access_token with access token
        res.cookie('sb_access_token', access_token, {
            httpOnly: true,                                          // cant be stolen by scripts :D
            secure: process.env.NODE_ENV === 'production',           // Use secure:true in production (requires HTTPS)
            sameSite: 'lax',
            maxAge: expires_in ? expires_in * 1000 : 60 * 60 * 1000, // default 1 hour
        });

        res.cookie('sb_refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            // refresh token usually long-lived; set a reasonable maxAge or store server-side
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days example
        });
        // TODO Optionally: store session server-side (DB) to support revocation or rotation.

        return res.redirect(`${FRONTEND_URL}/auth/success`); // TODO: Redirect to frontend success page
     } catch (err) {
        console.error('Auth callback error:', err);
        return res.redirect(`${FRONTEND_URL}/auth/error?auth=failed`); // TODO: improve error handling
        }
});

/**
 * Return session info - reads cookie and returns user info
 */
router.get('/session', async (req, res) => {
    try {
        const token = req.cookies?.sb_access_token;
        if (!token) return res.json({ user: null });

        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !data?.user) return res.status(401).json({ user: null });

        return res.json({user:data.user});
    } catch (err) {
        console.error('Session error:', err);
        return res.status(500).json({ user: null });
    }
});

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('sb_access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
        res.clearCookie('sb_refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
        return res.json({ success: true });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
    }
});

export default router;






