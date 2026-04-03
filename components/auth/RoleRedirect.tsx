"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

// Map from role to their dashboard URL
const MANAGER_ROLE_REDIRECTS: Record<string, string> = {
  Admin: "/admin/dashboard",
  TrainingManager: "/training-manager/dashboard",
  EnrollmentManager: "/enrollment-manager/dashboard",
};

// Roles that stay in the user area (no manager redirect)
const USER_AREA_ROLES = ["Student", "Instructor", "Collaborator"];

/**
 * Handles post-login role-based redirection.
 * - Manager roles → their dashboard (only if not already in their dashboard area)
 * - Student / Instructor / Collaborator → /homepage (only if on landing page /)
 */
export default function RoleRedirect() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const role = (user.publicMetadata?.role as string) ?? "";

    // Manager roles: redirect to their dashboard if not already there
    if (MANAGER_ROLE_REDIRECTS[role]) {
      const targetPath = MANAGER_ROLE_REDIRECTS[role];
      const dashboardPrefix = targetPath.split("/dashboard")[0]; // e.g. "/admin"
      // Don't redirect if already in the correct manager area
      if (!pathname.startsWith(dashboardPrefix)) {
        router.replace(targetPath);
      }
      return;
    }

    // Student, Instructor, Collaborator: redirect to /homepage only from landing page
    if (USER_AREA_ROLES.includes(role) && pathname === "/") {
      router.replace("/homepage");
    }
  }, [isLoaded, isSignedIn, user, router, pathname]);

  return null;
}
