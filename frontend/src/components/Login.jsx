import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [mensagem, setMensagem] = useState('');
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      const response = await api.post('/login', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      localStorage.setItem('token', response.data.token); // verificar com token jwt
      setMensagem('Login realizado com sucesso!'); // verificar com token jwt
    } catch (error) {
      setMensagem(error.response?.data?.message || 'Erro ao fazer login.');
    }
  };

  const navigate = useNavigate();

  return (
        <>
          <h2 className='login_h2' >Login</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
            <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
            <button type="submit">Entrar</button>
          </form>
          {mensagem && <p>{mensagem}</p>}
          <p>Ainda não tem conta? <button  className='button_cadastro' onClick={() => navigate('/cadastro')} > Cadastre-se</button> </p>
        </>
      )}

export default Login;
