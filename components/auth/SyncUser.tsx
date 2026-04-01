// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\components\auth\SyncUser.tsx

"use client";

import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { authService } from "@/services/authService";
import { setAuthToken } from "@/lib/api";

/**
 * A silent component that synchronizes the Clerk user with the backend database.
 */
export default function SyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
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
          role: user.publicMetadata?.role as string,
          centerId: user.publicMetadata?.centerId as string,
        };

        await authService.syncUser(syncData);
        lastSyncedClerkId.current = user.id;
        console.log("DTC: User synchronized successfully.");
      } catch (error) {
        console.error("DTC: Failed to synchronize user:", error);
      }
    };

    syncWithBackend();
  }, [isLoaded, isSignedIn, user, getToken]);

  useEffect(() => {
    if (!isSignedIn) {
      lastSyncedClerkId.current = null;
    }
  }, [isSignedIn]);

  return null; // Silent component
}
