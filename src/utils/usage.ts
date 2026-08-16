/**
 * Reports how long this dashboard is actually being looked at.
 *
 * A beat goes to the authenticator every 30 seconds, but ONLY while the tab is
 * visible — so a dashboard left open behind other windows overnight does not
 * report twelve hours of use. Hiding the tab sends a closing beat; showing it
 * again starts a fresh stretch.
 *
 * The closing beat uses fetch(keepalive) rather than sendBeacon because the
 * request needs an Authorization header, which sendBeacon cannot set. Either
 * way it is best-effort: the server closes silent sessions on its own, so a
 * dropped goodbye costs a little precision, never a lost session.
 */

import { getToken } from '@/utils/session';

const HEARTBEAT_MS = 30_000;
const SESSION_ID_KEY = 'searle_usage_session';

const AUTH_API_URL = (
  import.meta.env.VITE_AUTH_API_URL || 'http://208.110.83.26:4002/api'
).replace(/\/+$/, '');

/** One id per tab, so two tabs on the same dashboard are counted separately. */
function usageSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY);

  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }

  return id;
}

function send(event: 'ping' | 'end') {
  const token = getToken();
  if (!token) return;

  const body = JSON.stringify({
    session_id: usageSessionId(),
    dashboard: window.location.origin,
    event,
  });

  // keepalive lets the request outlive the page during an 'end' beat.
  void fetch(`${AUTH_API_URL}/usage/heartbeat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body,
    keepalive: true,
  }).catch(() => {
    // Usage tracking must never surface an error to the user.
  });
}

/**
 * Starts reporting. Returns a stop function for React cleanup.
 * Safe to call more than once; the second call replaces the first.
 */
export function startUsageTracking(): () => void {
  let timer: number | null = null;

  const beat = () => send('ping');

  const start = () => {
    if (timer !== null) return;
    beat();
    timer = window.setInterval(beat, HEARTBEAT_MS);
  };

  const stop = (sendEnd: boolean) => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
      if (sendEnd) send('end');
    }
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') start();
    else stop(true);
  };

  // pagehide covers closing, reloading and back/forward navigation, and unlike
  // beforeunload it also fires on mobile Safari.
  const onPageHide = () => stop(true);

  if (document.visibilityState === 'visible') start();

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);

  return () => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', onPageHide);
    stop(true);
  };
}
