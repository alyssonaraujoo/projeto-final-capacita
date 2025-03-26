import { useEffect, useState } from "react";
import api from "../api";

const AdicionarGasto = () => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState();
  const [erro, setErro] = useState("");
  const [compartilhadoCom, setCompartilhadoCom] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [me, setMe] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    api
      .get("/amizade/list", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setAmigos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar amigos:", error);
      });

    api
      .get("/user/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setMe(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar seus dados:", error);
      });
  }, [token]);

  if (!Array.isArray(amigos)) {
    console.error("O valor de 'amigos' não é um array:", amigos);
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descricao || !valor) {
      setErro("Descrição e valor são obrigatórios!");
      return;
    }
    const compartilhamentos = compartilhadoCom.map((amigo) => ({
      userId: amigo.userId,
      valor: amigo.valorAmigo ? parseFloat(amigo.valorAmigo) : 0,
    }));

    const gastoData = {
      descricao,
      valor: parseFloat(valor),
      data: data ? new Date(data).toISOString() : new Date().toISOString(),
      categoria,
      compartilhadoCom: compartilhamentos,
    };

    console.log("Enviando dados:", gastoData);  DEBUG

    try {
      const response = await api.post("/gastos/new", gastoData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setDescricao("");
        setValor("");
        setCategoria("");
        setData("");
        setCompartilhadoCom([]);
      } else {
        setErro("Erro ao criar gasto.");
      }
    } catch (error) {
      console.error(
        "Erro ao criar gasto:",
        error.response?.data || error.message
      );
      setErro(error.response?.data?.error || "Erro ao criar gasto.");
    }
  };

  const handleValorAmigo = (userId, valor) => {
    setCompartilhadoCom((prev) => {
      const index = prev.findIndex((item) => item.userId === userId);
      if (index !== -1) {
        prev[index].valorAmigo = valor;  
      } else {
        prev.push({ userId, valorAmigo: valor });  
      }
      return [...prev];
    });
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

        {/* Lista de Amigos */}
        <select
          name="amigos"
          onChange={(e) => {
            const selectedUserId = e.target.value;
            const amigoExistente = compartilhadoCom.find(
              (item) => item.userId === selectedUserId
            );

            if (!amigoExistente) {
              setCompartilhadoCom([
                ...compartilhadoCom,
                { userId: selectedUserId, valorAmigo: "" },  
              ]);
            }
          }}
        >
          <option disabled value="">
            Escolha um amigo
          </option>
          {amigos && Array.isArray(amigos)
            ? amigos.map((amizade) => {
                const amigo =
                  amizade.user1Id === me.id ? amizade.user2 : amizade.user1;
                return (
                  <option key={amizade.id} value={amigo.id}>
                    {amigo.email}
                  </option>
                );
              })
            : []}
        </select>

        {/* Campo de Valor do Amigo */}
        {compartilhadoCom.map((amigo, index) => (
          <div key={amigo.userId}>
            <label>{`Valor para ${amigo.userId}`}</label>
            <input
              type="number"
              placeholder={`Valor para ${amigo.userId}`}
              value={amigo.valorAmigo}
              onChange={(e) => {
                const novoValor = e.target.value;
                setCompartilhadoCom((prev) => {
                  const novaLista = [...prev];
                  novaLista[index].valorAmigo = novoValor;
                  return novaLista;
                });
              }}
            />
          </div>
        ))}

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option disabled value="">
            Escolha a categoria
          </option>
          <option value="Alimentação">Alimentação</option>
          <option value="Transporte">Transporte</option>
          <option value="Lazer">Lazer</option>
          <option value="Outros">Outros</option>
        </select>

        <button type="submit">Adicionar Gasto</button>
      </form>

      {erro && <p>{erro}</p>}
    </>
  );
};

export default AdicionarGasto;
