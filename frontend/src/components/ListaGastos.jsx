import { useEffect, useState } from "react";
import api from "../api";

const ListaGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nenhum");

  useEffect(() => {
    api
      .get("/gastos/gastos")
      .then((response) => setGastos(response.data))
      .catch((error) => console.error("Erro ao buscar despesas:", error));
  }, []);

  // const dados = [
  //   {
  //     descricao: "Almoço",
  //     valor: 20,
  //     categoria: "Alimentação",
  //     data: "2021-09-01",
  //   },
  //   {
  //     descricao: "Uber",
  //     valor: 15,
  //     categoria: "Transporte",
  //     data: "2021-09-02",
  //   },
  //   { descricao: "Cinema", valor: 30, categoria: "Lazer", data: "2021-09-03" },
  //   { descricao: "Livro", valor: 40, categoria: "Outros", data: "2021-09-04" },
  //   {
  //     descricao: "Jantar",
  //     valor: 30,
  //     categoria: "Alimentação",
  //     data: "2021-09-05",
  //   },
  //   {
  //     descricao: "Táxi",
  //     valor: 20,
  //     categoria: "Transporte",
  //     data: "2021-09-06",
  //   },
  //   { descricao: "Teatro", valor: 50, categoria: "Lazer", data: "2021-09-07" },
  //   {
  //     descricao: "Revista",
  //     valor: 10,
  //     categoria: "Outros",
  //     data: "2021-09-08",
  //   },
  // ];

  //filtra gastos por categoria
  const gastosFiltrados =
    filtro === "todos"
      ? gastos
      : gastos.filter((gasto) => gasto.categoria === filtro);

  //ordena gastos por valor
  const gastosOrdenados = [...gastosFiltrados].sort((a, b) => {
    if (ordenacao === "maior") return b.valor - a.valor;
    if (ordenacao === "menor") return a.valor - b.valor;
    return 0;
  });

  return (
    <div>
      <h2>Lista de Gastos</h2>

      {/* Filtros */}
      <label>Filtrar por categoria:</label>
      <select onChange={(e) => setFiltro(e.target.value)}>
        <option value="todos">Todos</option>
        <option value="Alimentação">Alimentação</option>
        <option value="Transporte">Transporte</option>
        <option value="Lazer">Lazer</option>
        <option value="Outros">Outros</option>
      </select>

      <label>Ordenar por valor:</label>
      <select onChange={(e) => setOrdenacao(e.target.value)}>
        <option value="maior">Maior valor</option>
        <option value="menor">Menor valor</option>
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
          </tr>
        </thead>
        <tbody>
          {gastosOrdenados.length > 0 ? (
            gastosOrdenados.map((gasto, index) => (
              <tr key={index}>
                <td>{gasto.descricao}</td>
                <td>R$ {gasto.valor.toFixed(2)}</td>
                <td>{gasto.categoria}</td>
                <td>{gasto.data}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nenhum gasto registrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaGastos;
