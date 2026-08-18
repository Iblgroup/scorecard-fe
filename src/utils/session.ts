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

export const AUTH_API_URL = (
  import.meta.env.VITE_AUTH_API_URL || 'http://208.110.83.26:4002/api'
).replace(/\/+$/, '');

interface TokenPayload {
  exp?: number;
  /** organization.user_login.user_login_id — who the token belongs to. */
  sub?: string;
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
/**
 * Shared so two callers cannot race each other.
 *
 * React.StrictMode mounts, unmounts and remounts in development, so AuthGate's
 * effect fires twice. The first call strips the ticket from the URL before its
 * fetch resolves, so the second call found no ticket, concluded there was no
 * session, and bounced to the portal — which minted another ticket and started
 * the whole thing again. Handing the second caller the SAME promise means it
 * waits for the real answer instead of redirecting past it.
 */
let pendingRedeem: Promise<boolean> | null = null;

export function redeemTicketFromUrl(): Promise<boolean> {
  if (!pendingRedeem) pendingRedeem = performRedeem();
  return pendingRedeem;
}

async function performRedeem(): Promise<boolean> {
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

/**
 * Who the portal says this browser is currently signed in as.
 *
 * sessionStorage is per origin AND per tab, so this app cannot see the portal's
 * session — which meant a dashboard opened by one user stayed fully usable
 * after somebody else signed in on the same browser. Cookies are scoped by HOST
 * and ignore the port, so the portal publishes the current user id there and
 * every dashboard can read it.
 *
 *   a user id  the portal is signed in as them
 *   ""         the portal signed out
 *   null       no cookie at all — cannot tell, so change nothing. Treating this
 *              as "signed out" would trap a cookie-less browser in a redirect
 *              loop between here and the portal.
 */
const SESSION_COOKIE = 'ot_session_user';

function portalUserId(): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/** The `sub` claim — organization.user_login.user_login_id. */
function tokenSubject(token: string): string | null {
  return decodeTokenPayload(token)?.sub ?? null;
}

export function getToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  if (isExpired(token)) {
    clearSession();
    return null;
  }

  // Still inside its lifetime, but belonging to a session this browser has
  // since left. Drop it, so the caller re-handshakes as whoever is signed in
  // now — or gets bounced to the portal.
  const current = portalUserId();
  if (current !== null && current !== tokenSubject(token)) {
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
