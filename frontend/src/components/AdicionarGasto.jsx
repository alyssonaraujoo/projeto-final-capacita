import { useState } from "react";
import api from "../api";

const AdicionarGasto = () => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState();
  const [erro, setErro] = useState("");
  const [compartilhadoCom, setCompartilhadoCom] = useState([]);
  const [amigos, setAmigos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descricao || !valor) {
      setErro("Descrição e valor são obrigatórios!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const gastoData = {
        descricao,
        valor: parseFloat(valor),
        data,
        categoria,
      };

      if (compartilhadoCom.length > 0) {
        gastoData.compartilhadoCom = compartilhadoCom;
      }

      const response = await api.post(
        "/gastos/new",
        {
          descricao,
          valor: parseFloat(valor),
          data,
          compartilhadoCom,
          categoria,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Gasto criado:", response.data);

      setDescricao("");
      setValor("");
      setCategoria("");
      setData();
    } catch (error) {
      console.error(
        "Erro ao criar gasto:",
        error.response?.data || error.message,
        erro
      );
      setErro(error.response?.data?.error || "Erro ao criar gasto.");
    }
  };

  return (
    <>
      <h2>Adicionar Gasto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <input
          type="text"
          placeholder="Compartilhar com (ID do amigo)"
          value={compartilhadoCom.join(", ")}
          onChange={(e) => setCompartilhadoCom(e.target.value.split(","))}
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">Escolha a categoria</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Transporte">Transporte</option>
          <option value="Lazer">Lazer</option>
          <option value="Outros">Outros</option>
        </select>
        <button type="submit">Adicionar Gasto</button>
      </form>
    </>
  );
};

export default AdicionarGasto;
