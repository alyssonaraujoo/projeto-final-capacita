import { useState } from 'react';
import Cadastro from './Cadstro';
import api from '../api';

function Login() {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [mensagem, setMensagem] = useState('');
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      localStorage.setItem('token', response.data.token);
      setMensagem('Login realizado com sucesso!');
    } catch (error) {
      setMensagem(error.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  return (
    <div>
      {mostrarCadastro ? (
        <>
          <Cadastro />
          <p> Já tem uma conta? <button onClick={() => setMostrarCadastro(false)}>Faça login</button> </p>
        </>
      ) : (
        <>
          <h2 className='login_h2' >Login</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
            <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
            <button type="submit">Entrar</button>
          </form>
          {mensagem && <p>{mensagem}</p>}
          <p>Ainda não tem conta? <button  className='button_cadastro' onClick={() => setMostrarCadastro(true)}> Cadastre-se</button> </p>
        </>
      )}
    </div>
  );
}

export default Login;
