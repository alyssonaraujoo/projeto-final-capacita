import { useEffect, useState } from "react";
import api from "../api";

const ListaGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [gastosCompartilhadosComigo, setGastosCompartilhadosComigo] = useState(
    []
  );
  const [filtro, setFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nenhum");
  const [switchGastos, setSwitchGastos] = useState(true); // true = Meus Gastos, false = Compartilhados

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/gastos/gastos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGastos(response.data);
      } catch (error) {
        console.error("Erro ao buscar gastos: ", error);
      }
    };

    const fetchGastosCompartilhadosComigo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/gastos/compartilhados_comigo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Gastos Compartilhados:", response.data);
        setGastosCompartilhadosComigo(response.data);
      } catch (error) {
        console.error("Erro ao buscar gastos compartilhados: ", error);
      }
    };

    fetchGastos();
    fetchGastosCompartilhadosComigo();
  }, []);

  // Alternar entre "Meus Gastos" e "Compartilhados"
  const gastosFiltradosPorTipo = switchGastos
    ? gastos
    : gastosCompartilhadosComigo;

  // Filtro por categoria
  const gastosFiltrados =
    filtro === "todos"
      ? gastosFiltradosPorTipo
      : gastosFiltradosPorTipo.filter((gasto) => gasto.categoria === filtro);

  // Ordenação por valor
  const gastosOrdenados = [...gastosFiltrados].sort((a, b) => {
    if (ordenacao === "maior") return b.valor - a.valor;
    if (ordenacao === "menor") return a.valor - b.valor;
    return 0;
  });

  const somaGastos = `R$ ${gastosOrdenados
    .reduce((acc, gasto) => acc + gasto.valor, 0)
    .toFixed(2)}`;

  return (
    <div>
      <h2>Lista de Gastos</h2>
      <span>Soma dos gastos: {somaGastos}</span>
      <br />

      {/* Filtro por categoria */}
      <label>Filtrar por categoria:</label>
      <select onChange={(e) => setFiltro(e.target.value)} value={filtro}>
        <option value="todos">Todos</option>
        <option value="Alimentação">Alimentação</option>
        <option value="Transporte">Transporte</option>
        <option value="Lazer">Lazer</option>
        <option value="Outros">Outros</option>
      </select>

      {/* Ordenação por valor */}
      <label>Ordenar por valor:</label>
      <select onChange={(e) => setOrdenacao(e.target.value)} value={ordenacao}>
        <option value="nenhum">Nenhum</option>
        <option value="maior">Maior valor</option>
        <option value="menor">Menor valor</option>
      </select>

      {/* Alternar entre "Meus Gastos" e "Compartilhados" */}
      <label>Tipo de gasto:</label>
      <select
        onChange={(e) =>
          setSwitchGastos(e.target.value === "true" ? true : false)
        }
        value={switchGastos}
      >
        <option value="true">Meus Gastos</option>
        <option value="false">Compartilhados Comigo</option>
      </select>

      {/* Tabela de gastos */}
      <table
        border="1"
        cellPadding="12"
        style={{ marginTop: "18px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
            {!switchGastos && <th>Criado por</th>}{" "}
            {/* Mostra apenas para gastos compartilhados */}
          </tr>
        </thead>
        <tbody>
          {gastosOrdenados.length > 0 ? (
            switchGastos ? (
              gastosOrdenados.map((gasto) => (
                <tr key={gasto.id}>
                  <td>{gasto.descricao}</td>
                  <td>R$ {gasto.valor.toFixed(2)}</td>
                  <td>{gasto.categoria}</td>
                  <td>{new Date(gasto.criadoEm).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              gastosOrdenados.map((gasto) => (
                <tr key={gasto.gasto.id}>
                  <td>{gasto.gasto.descricao}</td>
                  <td>R$ {gasto.valor.toFixed(2)}</td>
                  <td>{gasto.gasto.categoria}</td>
                  <td>{new Date(gasto.gasto.criadoEm).toLocaleDateString()}</td>
                  <td>{gasto.gasto.payer?.email || "Desconhecido"}</td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan={switchGastos ? "4" : "5"}>
                Nenhum gasto registrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaGastos;
