import React, { useEffect, useState } from "react";
import api from "../api";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AdicionarGasto = () => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState();
  const [erro, setErro] = useState("");
  const [compartilhadoCom, setCompartilhadoCom] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [me, setMe] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

    console.log("Enviando dados:", gastoData);

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
        setSelectedFriends({}); // Limpar os amigos selecionados ao criar o gasto
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

  const handleCheckboxChange = (userId) => {
    setSelectedFriends((prev) => {
      const newSelected = { ...prev };
      if (newSelected[userId]) {
        delete newSelected[userId]; // Remover o amigo da seleção
        setCompartilhadoCom(
          (prevCompartilhado) =>
            prevCompartilhado.filter((item) => item.userId !== userId) // Remover do compartilhadoCom
        );
      } else {
        newSelected[userId] = true; // Adicionar o amigo à seleção
        setCompartilhadoCom((prevCompartilhado) => [
          ...prevCompartilhado,
          { userId, valorAmigo: "" }, // Adicionar ao compartilhadoCom com valor inicial vazio
        ]);
      }
      return newSelected;
    });
  };

  const handleValorAmigo = (userId, valor) => {
    setCompartilhadoCom((prev) => {
      const index = prev.findIndex((item) => item.userId === userId);
      if (index !== -1) {
        prev[index].valorAmigo = valor;
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

        <button type="button" onClick={handleOpen}>
          Adicionar amigos ao gasto
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style }}>
            <h2 id="parent-modal-title">Adicionar amigos</h2>
            <ul>
              {amigos && Array.isArray(amigos)
                ? amigos.map((amizade) => {
                    const amigo =
                      amizade.user1Id === me.id ? amizade.user2 : amizade.user1;
                    return (
                      <li key={amizade.id}>
                        <input
                          type="checkbox"
                          name="amigo"
                          id={amizade.id}
                          value={amigo.id}
                          checked={selectedFriends[amigo.id] || false}
                          onChange={() => handleCheckboxChange(amigo.id)}
                        />
                        {amigo.email}
                        {compartilhadoCom
                          .filter((item) => item.userId === amigo.id)
                          .map((amigoSelecionado) => (
                            <div key={amigoSelecionado.userId}>
                              <input
                                type="number"
                                placeholder={`Valor`}
                                value={amigoSelecionado.valorAmigo}
                                onChange={(e) =>
                                  handleValorAmigo(
                                    amigoSelecionado.userId,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          ))}
                      </li>
                    );
                  })
                : []}
            </ul>
            <button type="button" onClick={handleClose}>
              Voltar
            </button>
          </Box>
        </Modal>
        <button type="submit">Adicionar Gasto</button>
      </form>

      {erro && <p>{erro}</p>}
    </>
  );
};

export default AdicionarGasto;
