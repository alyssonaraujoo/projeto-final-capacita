/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import api from "../api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setUser(response.data))
        .catch(() => setUser(null));
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Enviando:", { email, password });

      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
