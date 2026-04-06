"use client";

import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { authService } from "@/services/authService";
import { setAuthToken } from "@/lib/api";
import { useUserRole } from "@/contexts/UserRoleContext";

/**
 * A silent component that synchronizes the Clerk user with the backend database.
 * After sync, it stores the user's DB role in UserRoleContext so RoleRedirect can use it.
 */
export default function SyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { setRole } = useUserRole();
  const lastSyncedClerkId = useRef<string | null>(null);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (!isLoaded || !isSignedIn || !user || lastSyncedClerkId.current === user.id) return;

      try {
        const token = await getToken();
        setAuthToken(token);

        const email = user.primaryEmailAddress?.emailAddress || "";
        const fullName =
          user.fullName ||
          [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
          email.split("@")[0] ||
          "DTC User";

        const syncData = {
          clerkId: user.id,
          email,
          fullName,
          avatarUrl: user.imageUrl,
          phone: user.primaryPhoneNumber?.phoneNumber,
          // Note: publicMetadata.role is never set in Clerk for this project.
          // Role is managed in the DB. We send undefined here to not override DB role.
          role: undefined,
          centerId: user.publicMetadata?.centerId as string,
        };

        const response = await authService.syncUser(syncData);
        lastSyncedClerkId.current = user.id;

        // ← KEY FIX: role comes back from the DB via /Auth/sync response
        if (response?.role) {
          console.log(`[Auth] Role from DB: "${response.role}"`);
          setRole(response.role);
        }

        console.log(`DTC: [Auth] User synchronized successfully (ID: ${user.id})`);
      } catch (error: any) {
        console.warn(`DTC: [Auth] Failed to synchronize user ${user.id}:`, error.message || error);
      }
    };

    syncWithBackend();
  }, [isLoaded, isSignedIn, user, getToken, setRole]);

  useEffect(() => {
    if (!isSignedIn) {
      lastSyncedClerkId.current = null;
      setRole(""); // clear role on sign-out
    }
  }, [isSignedIn, setRole]);

  return null;
}
