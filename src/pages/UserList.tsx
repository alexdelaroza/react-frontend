import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Usuario {
  Codigo: string;
  Nome: string;
  Login: string;
  Email: string;
  Data_criacao_atu: string;
}

const UserList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const fetchUsuarios = useCallback(async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await axios.get(`${apiUrl}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && Array.isArray(response.data.user)) {
        setUsuarios(response.data.user);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      setError('Erro ao carregar lista de usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const deleteUser = async (codigo: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário #${codigo}?`)) return;

    const token = localStorage.getItem('jwt');

    try {
      await axios.delete(`${apiUrl}/usuarios/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsuarios(usuarios.filter(u => u.Codigo !== codigo));
      alert('Usuário removido com sucesso!');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || 'Erro ao excluir usuário.';
      alert(msg);
    }
  };

  if (loading) return <div className="container mt-5">Carregando usuários...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Consulta de Usuários</h2>
          {/* BOTÃO VOLTAR LOGO ABAIXO DO CABEÇALHO */}
          <button 
            className="btn btn-link text-decoration-none p-0 text-secondary" 
            onClick={() => navigate('/usuarios/menu')}
          >
            ← Voltar para Gestão de Usuários
          </button>
        </div>
        
        <button className="btn btn-success" onClick={() => navigate('/register')}>
          + Novo Usuário
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-hover mt-4">
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Login</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.Codigo}>
              <td>{u.Codigo}</td>
              <td>{u.Nome}</td>
              <td>{u.Login}</td>
              <td>{u.Email}</td>
              <td>
                <button 
                  className="btn btn-sm btn-warning me-2" 
                  onClick={() => navigate(`/usuarios/editar/${u.Codigo}`)}
                >
                  Alterar
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteUser(u.Codigo)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuarios.length === 0 && !error && (
        <p className="text-center mt-3">Nenhum usuário encontrado.</p>
      )}
    </div>
  );
};

export default UserList;
