import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// these need to match the auth routes in the server folder
// if login doesn't work check these first
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const LOGIN_PATH = "/api/auth/login";
const LOGOUT_PATH = "/api/auth/logout";
const ME_PATH = "/api/auth/me";

const AuthContext = createContext(null);

// wrapper so we don't repeat the fetch settings everywhere
// credentials include = sends the session cookie along
async function request(path, options = {}) {
  return fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if we're already logged in when the page loads
  // so a refresh doesn't log you out
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await request(ME_PATH);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setUser(data.user || data);
        }
      } catch {
        // server's off or no route, just treat it as logged out
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // returns { ok: true } or { ok: false, error: "..." }
  const login = useCallback(async (username, password) => {
    let res;
    try {
      res = await request(LOGIN_PATH, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
    } catch {
      return { ok: false, error: "Can't reach the server. Is the backend running on port 5000?" };
    }

    let data = {};
    try {
      data = await res.json();
    } catch {
      // no body came back, that's fine
    }

    if (!res.ok) {
      return { ok: false, error: data.error || data.message || "Incorrect username or password." };
    }

    setUser(data.user || { username });
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    try {
      await request(LOGOUT_PATH, { method: "POST" });
    } catch {
      // clear the user anyway
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// use this in any page to get user / login / logout
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth has to be inside <AuthProvider>, check index.js");
  return ctx;
}
