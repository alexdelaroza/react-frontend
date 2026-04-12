import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

const Register: React.FC = () => {
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    const apiUrl = getApiUrl();
    console.log('Tentando registrar com URL:', apiUrl);

    try {
      console.log('Dados do formulário:', {
        nome: nome,
        login: login,
        senha: senha,
        email: email,
        tipo: tipo,
      });

      const response = await axios.post(
        `${apiUrl}/usuarios`,
        {
          nome: nome,
          login: login,
          senha: senha,
          email: email,
          tipo: tipo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Resposta do servidor:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Registro bem sucedido, redirecionando...');
        navigate('/login'); // Redireciona diretamente
      }
    } catch (error: any) {
      console.log('Erro detalhado:', error);

      if (error.response) {
        const errorMsg = error.response.data.message || 'Registration failed';
        console.log('Mensagem de erro:', errorMsg);
        setError(errorMsg);
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError('Error during registration');
      }

      if (process.env.REACT_APP_LOG_LEVEL === 'debug') {
        console.error('Registration error:', error);
      }
    }
  };

  return (
    <form className="form-floating" onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Please register</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-signin">
        <input
          className="form-control"
          placeholder="Nome"
          required
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="form-signin">
        <input
          className="form-control"
          placeholder="Login"
          required
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>

      <div className="form-signin">
        <input
          type="password"
          className="form-control"
          placeholder="Senha"
          required
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>

      <div className="form-signin">
        <input
          type="email"
          className="form-control"
          placeholder="name@example.com"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-signin">
        <input
          type="text"
          className="form-control"
          placeholder="Tipo"
          required
          onChange={(e) => setTipo(e.target.value)}
        />
      </div>

      <button className="form-signin btn btn-primary w-100 py-2" type="submit">
        Register
      </button>

      <p className="mt-5 mb-3 text-body-secondary">&copy; 2026</p>
    </form>
  );
};

export default Register;
