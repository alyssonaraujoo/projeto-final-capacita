import { useContext } from "react";
import { GastosContext } from "./GastosContext";

const ListaGastos = () => {
  const { gastos } = useContext(GastosContext);

  return (
    <div>
      <h2>Lista de Gastos</h2>
      <ul>
        {gastos.length > 0 ? (
          gastos.map((gasto, index) => (
            <li key={index}>
              {gasto.descricao} - R$ {gasto.valor.toFixed(2)} ({gasto.categoria}) em {gasto.data}
            </li>
          ))
        ) : (
          <li>Nenhum gasto registrado.</li>
        )}
      </ul>
    </div>
  );
};

export default ListaGastos;

