/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import api from "../api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };
    fetchUserData();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      return false;
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
      });
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error("Erro no cadastro:", error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}
