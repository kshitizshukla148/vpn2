// helpers/captcha.service.js
import fetch from 'node-fetch';

const CLOUDFLARE_SECRET_KEY = process.env.CLOUDFLARE_SECRET_KEY;

if (!CLOUDFLARE_SECRET_KEY) {
  console.warn(
    '⚠️ CLOUDFLARE_SECRET_KEY is not set in environment variables. Turnstile verification will fail.'
  );
}

/**
 * Verify Cloudflare Turnstile captcha token
 * @param {string} token - token received from frontend (cf-turnstile-response)
 * @param {string} [remoteIp] - optional user's IP (req.headers['cf-connecting-ip'] or req.ip)
 * @returns {Promise<Object>} - Cloudflare response JSON (contains `success` boolean)
 */
export async function verifyCloudflareCaptcha(token, remoteIp) {
  if (!CLOUDFLARE_SECRET_KEY) {
    return { success: false, message: 'Server misconfiguration: secret missing' };
  }

  if (!token) {
    return { success: false, message: 'Captcha token is missing' };
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', CLOUDFLARE_SECRET_KEY);
    params.append('response', token);
    if (remoteIp) params.append('remoteip', remoteIp);

    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params,
      headers: {
        // note: fetch will set appropriate content-type for URLSearchParams
      }
    });

    if (!resp.ok) {
      // fetch succeeded but API returned non-200
      const text = await resp.text().catch(() => '');
      console.error('Cloudflare turnstile returned non-200:', resp.status, text);
      return { success: false, message: `Cloudflare error: ${resp.status}` };
    }

    const data = await resp.json();
    return data; // e.g. { success: true, challenge_ts, hostname, "error-codes": [...] }
  } catch (err) {
    console.error('verifyCloudflareCaptcha Error:', err);
    return { success: false, message: 'Captcha verification failed' };
  }
}
