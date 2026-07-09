import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase/config";
import { User } from "../types";
import { userService } from "../services/user.service";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  reloadProfile: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isTechnician: boolean;
  isClient: boolean;
  isGlobal: boolean; // SUPER_ADMIN, TECHNICIAN, or MANAGER
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  reloadProfile: async () => {},
  isSuperAdmin: false,
  isAdmin: false,
  isManager: false,
  isTechnician: false,
  isClient: false,
  isGlobal: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const isTechnician = user?.role === 'TECHNICIAN';
  const isClient = user?.role === 'CLIENT';
  const isGlobal = isSuperAdmin || isTechnician || isManager;

  const reloadProfile = async () => {
    if (auth.currentUser) {
      try {
        const profile = await userService.getProfile(auth.currentUser.uid);
        setUser(profile);
      } catch (error) {
        console.error("Error fetching user profile during reload:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      
      if (fUser) {
        try {
          const profile = await userService.getProfile(fUser.uid);
          setUser(profile);
          if (profile) {
            await userService.updateLastLogin(fUser.uid);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      loading, 
      reloadProfile,
      isSuperAdmin,
      isAdmin,
      isManager,
      isTechnician,
      isClient,
      isGlobal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
