import { useContext } from "react";
import { GastosContext } from "./GastosContext";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const GraficoGastos = () => {
  const { gastos } = useContext(GastosContext);

  const categorias = [...new Set(gastos.map((g) => g.categoria))];
  const valoresPorCategoria = categorias.map(
    (categoria) => gastos.filter((g) => g.categoria === categoria).reduce((total, gasto) => total + gasto.valor, 0)
  );

  const data = {
    labels: categorias,
    datasets: [
      {
        label: "Gastos por Categoria",
        data: valoresPorCategoria,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div>
      <h2>Gráfico de Gastos</h2>
      <Bar data={data} />
    </div>
  );
};

export default GraficoGastos;

