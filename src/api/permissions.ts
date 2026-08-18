import { useQuery } from '@tanstack/react-query';
import { AUTH_API_URL, getToken } from '@/utils/session';

/**
 * What the signed-in user is allowed to see in this dashboard.
 *
 * This app has no access model of its own — it holds a token the authenticator
 * issued, and asks that service what the token entitles the holder to. The
 * codes are read live rather than carried in the token, so revoking a role
 * takes effect on the next load instead of at the user's next sign-in.
 *
 * IMPORTANT: this hides UI, it is not access control. Anything that must
 * actually be protected has to be enforced by the API serving the data — a
 * hidden tab is still one fetch away for anyone who looks.
 */

/** This dashboard's coordinates in organization.permission. */
export const PROJECT_CODE = 'ONE_THU';
export const MODULE_CODE = 'DASHBOARD';
export const RESOURCE_CODE = 'SUPPLYCHAIN_PULSE';

/** PROJECT.MODULE.RESOURCE.SECTION.ACTION — built exactly as the backend does. */
export function permissionCode(sectionCode: string, actionCode = 'VIEW'): string {
  return [PROJECT_CODE, MODULE_CODE, RESOURCE_CODE, sectionCode, actionCode].join('.');
}

interface PermissionsResponse {
  success: boolean;
  data: {
    roles: { role_id: string; role_code: string; role_name: string }[];
    permissions: string[];
  };
}

async function fetchPermissions(): Promise<Set<string>> {
  const token = getToken();
  // AuthGate has already established a session by the time this runs, but a
  // token can expire between the two; an empty set fails closed.
  if (!token) return new Set();

  const response = await fetch(`${AUTH_API_URL}/me/permissions`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Could not read permissions (${response.status})`);
  }

  const body = (await response.json()) as PermissionsResponse;
  return new Set(body?.data?.permissions ?? []);
}

export function usePermissions() {
  const query = useQuery({
    queryKey: ['me', 'permissions'],
    queryFn: fetchPermissions,
    // Rarely changes within a session, and every screen asks for it.
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const codes = query.data;

  // Any permission at all inside this dashboard. Used to tell "not granted
  // this dashboard" (show the no-access screen) apart from "granted some of it"
  // (show only the sections they hold).
  const resourcePrefix = ''+PROJECT_CODE+'.'+MODULE_CODE+'.'+RESOURCE_CODE+'.';
  const hasAnyInResource = codes
    ? [...codes].some((code) => code.startsWith(resourcePrefix))
    : false;

  return {
    ...query,
    hasAnyInResource,
    /**
     * False until the codes have actually arrived. Callers should key off
     * `isReady` rather than showing everything while loading, otherwise
     * forbidden tabs flash on screen before disappearing.
     */
    isReady: codes !== undefined,
    has: (code: string) => codes?.has(code) ?? false,
  };
}
