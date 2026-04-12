import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('user');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${apiUrl}/usuarios`, {
        nome: nome,
        login: login,
        senha: senha,
        email: email,
        tipo: tipo,
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data.error || 'Erro ao registrar');
      } else {
        setError('Servidor indisponível no momento.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-dark p-4">
        <h2 className="text-center mb-4 fw-bold">Criar Conta</h2>

        {success && (
          <div className="alert alert-success text-center shadow-sm">
            ✅ Conta criada com sucesso! Redirecionando...
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 text-center shadow-sm" role="alert">
            <small>{error}</small>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Nome Completo</label>
            <input
              className="form-control form-control-lg"
              placeholder="Ex: João Silva"
              required
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-secondary">Login</label>
              <input
                className="form-control"
                placeholder="usuario123"
                required
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-secondary">Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="******"
                required
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">E-mail</label>
            <input
              type="email"
              className="form-control"
              placeholder="email@exemplo.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Tipo de Perfil</label>
            <select 
              className="form-select" 
              value={tipo} 
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="user">Usuário Padrão</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Seção de Botões Melhorada: Empilhados e com Hierarquia */}
          <div className="d-flex flex-column gap-2 mb-4">
            <button 
              className="btn btn-dark btn-lg shadow-sm w-100 fw-bold" 
              type="submit" 
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processando...
                </>
              ) : (
                'Confirmar Cadastro'
              )}
            </button>
            
            <button 
              type="button" 
              className="btn btn-link text-decoration-none text-secondary btn-sm w-100" 
              onClick={() => navigate('/usuarios/menu')}
            >
              Cancelar e Voltar
            </button>
          </div>

          <div className="text-center pt-3 border-top">
            <span className="small text-muted">Já tem uma conta? </span>
            <Link to="/login" className="small text-decoration-none fw-bold text-dark">Entrar</Link>
          </div>
        </form>
      </div>
      
      <p className="text-center mt-4 text-muted small">&copy; 2026 API-Manager</p>
    </div>
  );
};

export default Register;
