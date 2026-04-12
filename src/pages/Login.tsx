import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';

const Login: React.FC<{ setLoginOk: (loggedIn: boolean) => void }> = ({ setLoginOk }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/login`, {
        login: login,
        senha: senha,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('jwt', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setLoginOk(true);
        setRedirect(true);
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data.error || 'Falha no login');
      } else {
        setError('Servidor indisponível.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card shadow-sm border-dark p-4">
        <form onSubmit={submit}>
          <h1 className="h3 mb-4 fw-normal text-center">Login</h1>

          {error && (
            <div className="alert alert-danger py-2 text-center" role="alert">
              <small>{error}</small>
            </div>
          )}
          
          <div className="mb-3">
            <label className="form-label small fw-bold">Usuário</label>
            <input
              className="form-control"
              placeholder="Seu login"
              required
              disabled={loading}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">Senha</label>
            <input
              type="password"
              className="form-control"
              placeholder="Sua senha"
              required
              disabled={loading}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button className="btn btn-dark btn-lg w-100 py-2 mb-3" type="submit" disabled={loading}>
            {loading ? 'Acessando...' : 'Entrar'}
          </button>

          <div className="text-center">
            <Link to="/forgot" className="small text-decoration-none text-secondary">Esqueceu a senha?</Link>
          </div>
        </form>
      </div>
      <p className="mt-4 text-center text-muted small">&copy; 2026 API-Manager</p>
    </div>
  );
};

export default Login;
