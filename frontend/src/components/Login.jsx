import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [mensagem, setMensagem] = useState("");
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Valores do Form:", { email, password }); // 🔥 Debug para checar se está capturando corretamente

    if (!email || !password) {
      setMensagem("Preencha todos os campos!");
      return;
    }

    const success = await login(email, password);

    if (success) {
      setMensagem("Login bem-sucedido!");
    } else {
      setMensagem("Falha no login!");
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <h2 className="login_h2">Login</h2>
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
        <button type="submit">Entrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
      <p>
        Ainda não tem conta?{" "}
        <button
          className="button_cadastro"
          onClick={() => navigate("/cadastro")}
        >
          {" "}
          Cadastre-se
        </button>{" "}
      </p>
    </>
  );
}

export default Login;
