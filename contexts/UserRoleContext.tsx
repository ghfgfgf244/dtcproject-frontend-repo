"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface UserRoleContextValue {
  role: string;           // e.g. "Student", "Instructor", "Admin"
  setRole: (r: string) => void;
}

const UserRoleContext = createContext<UserRoleContextValue>({
  role: "",
  setRole: () => {},
});

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<string>("");

  const setRole = useCallback((r: string) => {
    setRoleState(r);
  }, []);

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
