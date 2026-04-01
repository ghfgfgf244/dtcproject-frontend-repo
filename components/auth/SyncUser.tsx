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
  const syncAttempted = useRef(false);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (!isLoaded || !isSignedIn || !user || syncAttempted.current) return;

      try {
        // 1. Get Clerk JWT Token
        const token = await getToken();
        
        // 2. Set token in common headers
        setAuthToken(token);

        // 3. Prepare sync data
        const syncData = {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          fullName: user.fullName || "",
          avatarUrl: user.imageUrl,
          phone: user.primaryPhoneNumber?.phoneNumber,
          // These can be provided via Clerk Public Metadata if needed
          role: user.publicMetadata?.role as string,
          centerId: user.publicMetadata?.centerId as string,
        };

        // 4. Call sync API
        await authService.syncUser(syncData);
        
        // Only attempt once per session/mount
        syncAttempted.current = true;
        console.log("DTC: User synchronized successfully.");
      } catch (error) {
        console.error("DTC: Failed to synchronize user:", error);
      }
    };

    syncWithBackend();
  }, [isLoaded, isSignedIn, user, getToken]);

  return null; // Silent component
}
