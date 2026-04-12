import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';

// Função para retornar a URL base da API
const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

const Login: React.FC<{ setLoginOk: (loggedIn: boolean) => void }> = ({ setLoginOk }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    const apiUrl = getApiUrl();

    console.log('1. Iniciando login...');
    console.log('Base URL:', apiUrl);

    try {
      console.log('2. Fazendo requisição POST para /login');
      const response = await axios.post(`${apiUrl}/login`, {
        login,
        senha,
      });

      console.log('3. Resposta do login:', response.data);

      if (response.data?.jwt) {
        console.log('4. Token recebido:', response.data.jwt);
        localStorage.setItem('jwt', response.data.jwt);
        console.log('5. Token salvo no localStorage:', localStorage.getItem('jwt'));

        const headers = {
          Authorization: `Bearer ${response.data.jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

        axios.defaults.headers.common = headers;
        console.log('6. Token configurado no axios:', headers);

        setLoginOk(true);
        setRedirect(true);
      }
    } catch (error: any) {
      console.log('Erro durante login:', error);
      localStorage.removeItem('jwt');
      delete axios.defaults.headers.common['Authorization'];

      if (error.response) {
        setError(error.response.data.message || 'Login failed');
      } else if (error.request) {
        setError('No response from server');
      } else {
        setError('Error during login');
      }
    }
  };

  if (redirect) {
    console.log('7. Redirecionando após login bem-sucedido');
    console.log('8. Headers do axios:', axios.defaults.headers.common);
    return <Navigate to="/" />;
  }

  return (
    <form className="form-floating" onSubmit={submit}>
      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="form-signin">
        <input
          className="form-control"
          placeholder="Login"
          required
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>

      <div className="form-signin">
        <input
          type="password"
          className="form-control"
          placeholder="Senha"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <div className="mb-3">
          <Link to="/forgot">Forgot Senha?</Link>
        </div>
      </div>

      <button className="form-signin btn btn-primary w-100 py-2" type="submit">
        Sign in
      </button>

      <p className="mt-5 mb-3 text-body-secondary">&copy; 2026</p>
    </form>
  );
};

export default Login;
