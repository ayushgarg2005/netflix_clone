import { createContext, useContext, useEffect, useState } from "react";
import api from "./api.js"; // Ensure this path matches your structure

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Don't set loading true here if you want background updates, 
      // but strictly for login flow, it helps prevent premature redirects.
      const res = await api.get("/auth/me");
      setUser(res.data.user || res.data); // Adjust based on your API response structure
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // ✅ EXPOSE checkAuth and setUser so Signin can use them
  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);