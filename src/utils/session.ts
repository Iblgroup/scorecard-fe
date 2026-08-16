/**
 * Session handoff from the authenticator portal (port 4001).
 *
 * This app never logs anyone in. The portal sends the browser here with a
 * one-time ticket — ?t=<16 chars> — which we swap for the real access token over
 * a direct call to the authenticator API. The JWT itself never appears in a URL,
 * so it stays out of nginx logs, browser history and Referer headers, and a
 * copied link is worthless: the ticket is dead the moment it is redeemed, and
 * expires on its own after a minute.
 *
 * The token lives in sessionStorage, not localStorage: closing the tab ends the
 * session, which is the behaviour the portal promises. It is also per-origin,
 * so each dashboard keeps its own copy.
 */

const TOKEN_KEY = 'searle_token';
const TICKET_PARAM = 't';

const AUTH_PORTAL_URL = (
  import.meta.env.VITE_AUTH_PORTAL_URL || 'http://208.110.83.26:4001'
).replace(/\/+$/, '');

const AUTH_API_URL = (
  import.meta.env.VITE_AUTH_API_URL || 'http://208.110.83.26:4002/api'
).replace(/\/+$/, '');

interface TokenPayload {
  exp?: number;
}

function decodeTokenPayload(token: string): TokenPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * A token we cannot read is treated as expired. Better to bounce someone to the
 * portal than to let a malformed token through and fail on the first API call.
 */
function isExpired(token: string) {
  const exp = decodeTokenPayload(token)?.exp;
  if (!exp) return true;
  return Date.now() >= exp * 1000;
}

/** Takes the ticket out of the address bar without adding a history entry. */
function stripTicketFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(TICKET_PARAM)) return;

  url.searchParams.delete(TICKET_PARAM);
  window.history.replaceState({}, '', url.toString());
}

/**
 * Redeems a ?t= ticket if one is present. Always clears it from the URL, even
 * when redemption fails — a spent ticket is noise, and leaving it there would
 * retry on every refresh.
 *
 * Returns true when a session was established from the ticket.
 */
export async function redeemTicketFromUrl(): Promise<boolean> {
  const ticket = new URL(window.location.href).searchParams.get(TICKET_PARAM);
  if (!ticket) return false;

  stripTicketFromUrl();

  try {
    const response = await fetch(`${AUTH_API_URL}/auth/ticket/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (!data?.token) return false;

    sessionStorage.setItem(TOKEN_KEY, data.token);
    return true;
  } catch (error) {
    console.error('[session] ticket redemption failed', error);
    return false;
  }
}

export function getToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  if (isExpired(token)) {
    clearSession();
    return null;
  }

  return token;
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Hands the browser to the portal's login page, remembering where we were so it
 * can send the user straight back here afterwards.
 *
 * replace() rather than assign() so the back button does not land on a page we
 * are about to bounce out of again.
 */
export function redirectToPortal() {
  clearSession();
  const target = `${AUTH_PORTAL_URL}/login?redirect=${encodeURIComponent(
    window.location.href
  )}`;
  window.location.replace(target);
}

export function hasValidSession() {
  return getToken() !== null;
}
