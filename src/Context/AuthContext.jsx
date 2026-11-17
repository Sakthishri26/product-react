import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem("token")));

  function login(newToken, newUser) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  
  const authFetch = useCallback(
    async (path, options = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 401) {
        let message = "Session expired. Please log in again.";
        try {
          const data = await response.clone().json();
          message = data.error || data.message || message;
        } catch {
          
        }
        toast.error(message, { id: "session" });
        logout();
      }
      return response;
    },
    [logout]
  );

  
  const hasPermission = useCallback(
    (permission) => Boolean(user?.permissions?.includes(permission)),
    [user]
  );

  
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setChecking(false);
      return;
    }

    async function loadUser() {
      try {
        const response = await authFetch("/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch {
        
      } finally {
        setChecking(false);
      }
    }

    loadUser();
  }, [authFetch]);

  return (
    <AuthContext.Provider
      value={{ token, user, setUser, checking, login, logout, authFetch, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}