// GastosContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../api";
import "./GastosContext.css";

export const GastosContext = createContext();

export const GastosProvider = ({ children }) => {
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await api.get("/gastos/gastos");
        setGastos(response.data);
      } catch (error) {
        console.error("Erro ao buscar gastos:", error);
      }
    };

    fetchGastos();
  }, []);

  const adicionarGasto = async (novoGasto) => {
    
    try {
      const response = await api.post("/gastos/new", novoGasto);
      setGastos((prevGastos) => [...prevGastos, response.data]);
    } catch (error) {
      console.error("Erro ao adicionar gasto:", error);
    }
  };

  return (
      <div className="gastos-context-provider"> {/* Adiciona um div com a classe CSS */}
        <GastosContext.Provider value={{ gastos, adicionarGasto }}>
          {children}
        </GastosContext.Provider>
      </div>
  );
};