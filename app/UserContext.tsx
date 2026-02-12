'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface CurrentUser {
  name: string;
  role: string;
}

interface UserContextType {
  currentUser?: CurrentUser;
}

const UserContext = createContext<UserContextType>({});

export function UserProvider({ children, currentUser }: { children: ReactNode; currentUser?: CurrentUser }) {
  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
