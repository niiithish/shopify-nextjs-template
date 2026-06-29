import { buildAdminPath } from "@/lib/admin-path";

export function getPresswallNavPaths(
  search = typeof window === "undefined" ? "" : window.location.search
) {
  return {
    home: buildAdminPath("/", search),
    editor: buildAdminPath("/editor", search),
  };
}
