"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useUserRole } from "@/contexts/UserRoleContext";

const MANAGER_ROLE_REDIRECTS: Record<string, string> = {
  Admin: "/admin/dashboard",
  TrainingManager: "/training-manager/dashboard",
  EnrollmentManager: "/enrollment-manager/dashboard",
};

const USER_AREA_ROLES = ["Student", "Instructor", "Collaborator"];
const MANAGER_AREA_PREFIXES = ["/admin", "/training-manager", "/enrollment-manager"];

/**
 * Role-based redirect after login.
 *
 * Root cause of previous failure: role was read from user.publicMetadata.role
 * which is NEVER set in this project. Role is stored ONLY in the backend DB.
 *
 * Fixed flow:
 *   1. SyncUser calls /Auth/sync → gets role back from DB in response
 *   2. SyncUser saves role to UserRoleContext
 *   3. RoleRedirect reads role from UserRoleContext → redirects accordingly
 */
export default function RoleRedirect() {
  const { isLoaded, isSignedIn } = useUser();
  const { role } = useUserRole();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  const redirectTo = (targetPath: string) => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === targetPath) return;
    window.location.replace(targetPath);
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      hasRedirected.current = false;
      return;
    }

    // Role not yet available — SyncUser hasn't finished yet, wait
    if (!role) return;

    // Prevent double redirect
    if (hasRedirected.current) return;

    // ── Manager roles → their dashboard ──────────────────────────────────────
    const targetManagerPath = MANAGER_ROLE_REDIRECTS[role];
    if (targetManagerPath) {
      const managerPrefix = "/" + targetManagerPath.split("/")[1];
      if (pathname.startsWith(managerPrefix)) return; // already home
      hasRedirected.current = true;
      redirectTo(targetManagerPath);
      return;
    }

    // ── User-area roles → /homepage (from landing or manager pages) ───────────
    if (USER_AREA_ROLES.includes(role)) {
      const isOnManagerPage = MANAGER_AREA_PREFIXES.some((p) => pathname.startsWith(p));
      const isOnLanding = pathname === "/";

      if (isOnLanding || isOnManagerPage) {
        hasRedirected.current = true;
        redirectTo("/homepage");
      }
    }
  }, [isLoaded, isSignedIn, role, pathname]);

  return null;
}
