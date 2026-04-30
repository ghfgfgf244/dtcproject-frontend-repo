"use client";

import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { authService } from "@/services/authService";
import { setAuthToken } from "@/lib/api";
import { useUserRole } from "@/contexts/UserRoleContext";

export default function SyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { setRole } = useUserRole();
  const lastSyncedClerkId = useRef<string | null>(null);
  const lastSyncAttemptAt = useRef<number>(0);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (!isLoaded || !isSignedIn || !user || lastSyncedClerkId.current === user.id) {
        return;
      }

      const now = Date.now();
      if (now - lastSyncAttemptAt.current < 3000) {
        return;
      }
      lastSyncAttemptAt.current = now;

      try {
        const token = await getToken();
        if (!token) {
          return;
        }

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
          role: undefined,
          centerId: undefined,
        };

        const response = await authService.syncUser(syncData);
        if (!response) {
          return;
        }

        lastSyncedClerkId.current = user.id;

        if (response.role) {
          setRole(response.role);
        }
      } catch {
      }
    };

    void syncWithBackend();
  }, [getToken, isLoaded, isSignedIn, setRole, user]);

  useEffect(() => {
    if (!isSignedIn) {
      lastSyncedClerkId.current = null;
      lastSyncAttemptAt.current = 0;
      setRole("");
    }
  }, [isSignedIn, setRole]);

  return null;
}
