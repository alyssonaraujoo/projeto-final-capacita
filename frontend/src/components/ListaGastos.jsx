import { useEffect, useState } from "react";
import api from "../api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

const ListaGastos = () => {
  const [gastos, setGastos] = useState([]);
  const [gastosCompartilhados, setGastosCompartilhados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    categoria: "",
  });
  const [filtro, setFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState("nenhum");
  const [switchGastos, setSwitchGastos] = useState(true);

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

    const fetchGastosCompartilhados = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/gastos/compartilhados_comigo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGastosCompartilhados(response.data);
      } catch (error) {
        console.error("Erro ao buscar gastos compartilhados: ", error);
      }
    };

    fetchGastos();
    fetchGastosCompartilhados();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/gastos/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGastos(gastos.filter((gasto) => gasto.id !== id));
      setGastosCompartilhados(
        gastosCompartilhados.filter((gasto) => gasto.id !== id)
      );
    } catch (error) {
      console.error("Erro ao excluir gasto:", error);
    }
  };

  const handleEdit = (gasto) => {
    setEditando(gasto.id);
    setFormData({
      descricao: gasto.descricao,
      valor: gasto.valor,
      categoria: gasto.categoria,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/gastos/edit/${id}`,
        {
          descricao: formData.descricao,
          valor: parseFloat(formData.valor),
          categoria: formData.categoria,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGastos(
        gastos.map((gasto) =>
          gasto.id === id
            ? { ...gasto, ...formData, valor: parseFloat(formData.valor) }
            : gasto
        )
      );
      setGastosCompartilhados(
        gastosCompartilhados.map((gasto) =>
          gasto.id === id
            ? { ...gasto, ...formData, valor: parseFloat(formData.valor) }
            : gasto
        )
      );
      setEditando(null);
    } catch (error) {
      console.error("Erro ao editar gasto:", error);
    }
  };

  const gastosFiltradosPorTipo = switchGastos ? gastos : gastosCompartilhados;

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

  const somaGastos = gastosOrdenados.reduce(
    (total, gasto) => total + gasto.valor,
    0
  );

  return (
    <div>
      <h2>Lista de Gastos</h2>

      {/* Filtro por categoria */}
      <label>Filtrar por categoria:</label>
      <select onChange={(e) => setFiltro(e.target.value)} value={filtro}>
        <option value="todos">Todos</option>
        <option value="Alimentação">Alimentação</option>
        <option value="Transporte">Transporte</option>
        <option value="Lazer">Lazer</option>
        <option value="Outros">Outros</option>
      </select>
      <br />

      {/* Ordenação por valor */}
      <label>Ordenar por valor:</label>
      <select onChange={(e) => setOrdenacao(e.target.value)} value={ordenacao}>
        <option value="nenhum">Nenhum</option>
        <option value="maior">Maior valor</option>
        <option value="menor">Menor valor</option>
      </select>
      <br />

      {/* Alternar entre "Meus Gastos" e "Compartilhados" */}
      <label>Tipo de gasto:</label>
      <select
        onChange={(e) => setSwitchGastos(e.target.value === "true")}
        value={switchGastos}
      >
        <option value="true">Meus Gastos</option>
        <option value="false">Compartilhados Comigo</option>
      </select>

      <h3>Total de Gastos: R$ {somaGastos.toFixed(2)}</h3>

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
            <th>{switchGastos ? "Ações" : "Criado por"}</th>
          </tr>
        </thead>
        <tbody>
          {gastosOrdenados.map((gasto) => (
            <tr key={gasto.id}>
              <td>
                {editando === gasto.id ? (
                  <input
                    type="text"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                  />
                ) : switchGastos ? (
                  gasto.descricao
                ) : (
                  gasto.gasto.descricao
                )}
              </td>
              <td>
                {editando === gasto.id ? (
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({ ...formData, valor: e.target.value })
                    }
                  />
                ) : (
                  `R$ ${gasto.valor.toFixed(2)}`
                )}
              </td>
              <td>
                {editando === gasto.id ? (
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                  />
                ) : switchGastos ? (
                  gasto.categoria
                ) : (
                  gasto.gasto.categoria
                )}
              </td>
              <td>
                {switchGastos ? (
                  <>
                    {editando === gasto.id ? (
                      <button onClick={() => handleSaveEdit(gasto.id)}>
                        <SaveIcon />
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(gasto)}>
                        <EditIcon />{" "}
                      </button>
                    )}
                    <button onClick={() => handleDelete(gasto.id)}>
                      <DeleteIcon />
                    </button>
                  </>
                ) : (
                  <span>{gasto.gasto.payer?.email || "Desconhecido"}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaGastos;
