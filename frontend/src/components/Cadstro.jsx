import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Cadastro() {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register'); 
      setFormData(response.data);
      setMensagem('Cadastro realizado com sucesso! Faça login.');
    } catch (error) {
      setMensagem(error.response?.data?.message || 'Erro ao conectar com o servidor.');
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
        <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
      <p>Já possui uma conta ? <button  className='button_login' onClick={() => navigate('/')} > Faça login</button> </p>
    </div>
  );
}

export default Cadastro;
