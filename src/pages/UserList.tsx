import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Usuario {
  Codigo: string;
  Nome: string;
  Login: string;
  Email: string;
  Data_criacao_atu: string;
}

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

const UserList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Define a URL base aqui para ser usada em todas as funções do componente
  const apiUrl = getApiUrl();
  
  useEffect(() => {
    const fetchUsuarios = async () => {
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
            console.error(err);
            setError('Erro ao carregar dados');
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    };

  fetchUsuarios();
  }, [apiUrl]);

  const deleteUser = async (codigo: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário #${codigo}?`)) return;

    const token = localStorage.getItem('jwt');

    try {
      // Agora o 'apiUrl' está acessível aqui
      await axios.delete(`${apiUrl}/usuarios/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove da lista na tela para feedback imediato
      setUsuarios(usuarios.filter(u => u.Codigo !== codigo));
      alert('Usuário removido com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert('Erro ao excluir usuário. Verifique se o backend permite o método DELETE.');
    }
  };

  if (loading) return <div className="container mt-5">Carregando...</div>;
  
  return (
    <div className="container mt-5">
      <h2>Consulta de Usuários</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-hover mt-4">
        <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Login</th>
              <th>E-mail</th>
              <th>Data Criação</th>
              <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {usuarios.map((u) => (
            <tr key={u.Codigo}>
                <td>{u.Nome}</td>
                <td>{u.Login}</td>
                <td>{u.Email}</td>
                <td>{new Date(u.Data_criacao_atu).toLocaleDateString('pt-BR')}</td>
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
