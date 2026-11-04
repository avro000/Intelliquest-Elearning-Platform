import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { getLoggedInUser } from "./api/api";
import { jwtDecode } from "jwt-decode";

export interface UserProfile {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
  profilePictureUrl?: string;
  enabled?: boolean;
}

interface AuthContextType {
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  refreshUser: () => Promise<UserProfile | null>;
  loadingUser: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // Safe initialization of profileImage (never use dead blob: URLs from localStorage)
  const initialProfile = (() => {
    const saved = localStorage.getItem("profileImage");
    if (saved && !saved.startsWith("blob:")) {
      return saved;
    }
    localStorage.removeItem("profileImage");
    return null;
  })();

  const [profileImage, setProfileImageState] = useState<string | null>(initialProfile);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const setProfileImage = useCallback((url: string | null) => {
    if (url && !url.startsWith("blob:")) {
      localStorage.setItem("profileImage", url);
    } else if (!url) {
      localStorage.removeItem("profileImage");
    }
    setProfileImageState(url);
  }, []);

  const refreshUser = useCallback(async (): Promise<UserProfile | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserRole(null);
      setCurrentUser(null);
      setProfileImage(null);
      return null;
    }

    try {
      const user = await getLoggedInUser();
      if (user) {
        setCurrentUser(user);
        if (user.role) {
          setUserRole(user.role);
        }
        if (user.profilePictureUrl) {
          setProfileImage(user.profilePictureUrl);
        } else {
          // Check if Google OAuth JWT has a picture
          try {
            const decoded: any = jwtDecode(token);
            if (decoded?.picture) {
              setProfileImage(decoded.picture);
            } else {
              setProfileImage(null);
            }
          } catch {
            setProfileImage(null);
          }
        }
        return user;
      }
    } catch (error) {
      console.error("Error refreshing user in AuthProvider:", error);
    }
    return null;
  }, [setProfileImage]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setLoadingUser(true);
      await refreshUser();
      if (isMounted) {
        setLoadingUser(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("profileImage");
    setUserRole(null);
    setCurrentUser(null);
    setProfileImageState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userRole,
        setUserRole,
        profileImage,
        setProfileImage,
        currentUser,
        setCurrentUser,
        refreshUser,
        loadingUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
