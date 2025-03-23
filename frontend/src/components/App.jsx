import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdicionarGasto from "./AdicionarGasto";
import ListaGastos from "./ListaGastos";
import GraficoGastos from "./GraficoGastos";
import "./styles.css"; // 🔥 Importação do CSS

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Adicionar Gasto</Link>
        <Link to="/lista">Lista de Gastos</Link>
        <Link to="/relatorios">Relatórios</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<AdicionarGasto />} />
          <Route path="/lista" element={<ListaGastos />} />
          <Route path="/relatorios" element={<GraficoGastos />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
