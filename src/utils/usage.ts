/**
 * Reports how long this dashboard is actually being looked at.
 */

import { getToken, AUTH_API_URL } from '@/utils/session';

const HEARTBEAT_MS = 30_000;
const SESSION_ID_KEY = 'searle_usage_session_scorecard';

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
