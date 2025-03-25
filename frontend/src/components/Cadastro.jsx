import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");
  const { signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMensagem("Preencha todos os campos!");
      return;
    }

    if (!email || !password) {
      setMensagem("Preencha todos os campos!");
      return;
    }

    const success = await signup(email, password);

    if (success) {
      console.log("Cadastro bem-sucedido!");
    } else {
      console.error("Falha no cadastro!");
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
      <p>
        Já possui uma conta ?{" "}
        <button className="button_login" onClick={() => navigate("/")}>
          {" "}
          Faça login
        </button>{" "}
      </p>
    </div>
  );
}

export default Cadastro;
