"use client";

import React from "react";
import UserClientView from "@/components/manager/UserManagement/UserClientView";

/**
 * User Management Page for Administrators.
 * This page uses the modular UserClientView component to handle:
 * - Real-time statistics via UserStats
 * - Search and Role filtering
 * - Paginated user listing via UserTable
 * - Actions: Edit roles, Toggle status, Soft-delete
 * - Toast notifications for active feedback
 */
export default function AdminUsersPage() {
  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <UserClientView />
      </div>
    </div>
  );
}
