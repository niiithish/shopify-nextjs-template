const ADMIN_PATH_PARAM_BLOCKLIST = new Set(["id_token"]);

export function getAdminSearchParams(
  search = typeof window === "undefined" ? "" : window.location.search
): URLSearchParams {
  const params = new URLSearchParams(search);

  for (const key of ADMIN_PATH_PARAM_BLOCKLIST) {
    params.delete(key);
  }

  return params;
}

export function buildAdminPath(
  pathname: string,
  search = typeof window === "undefined" ? "" : window.location.search
): string {
  const params = getAdminSearchParams(search);
  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}
