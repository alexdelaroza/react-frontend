import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Servico {
  Codigo: string;
  Descricao: string;
  Valor: number;
  Data_criacao_atu: string;
}

const ServiceList: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchServicos = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axios.get(`${apiUrl}/servicos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Acessando a chave "services" do seu JSON
        if (response.data && Array.isArray(response.data.services)) {
          setServicos(response.data.services);
        } else {
          setServicos([]);
        }
      } catch (err) {
        setError('Erro ao carregar serviços');
      } finally {
        setLoading(false);
      }
    };

    fetchServicos();
  }, [apiUrl]);

  if (loading) return <div className="container mt-5">Carregando serviços...</div>;

  const deleteService = async (codigo: string) => {
    // Pergunta ao usuário antes de deletar
    if (!window.confirm(`Deseja realmente excluir o serviço #${codigo}?`)) return;

    const token = localStorage.getItem('jwt');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    try {
        // 1. Envia a requisição para o Go
        // Ajuste a URL conforme sua rota: /servicos/:id ou /servicos/:codigo
        await axios.delete(`${apiUrl}/servicos/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` }
        });

        // 2. Se deu certo na API, remove da lista no React (Estado)
        setServicos(servicos.filter(s => s.Codigo !== codigo));
        
        alert('Serviço excluído com sucesso!');
    } catch (err: any) {
        console.error(err);
        const msg = err.response?.data?.error || 'Erro ao excluir o serviço';
        alert(msg);
    }
};

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Consulta de Serviços</h2>
        <button className="btn btn-success" onClick={() => navigate('/servicos/novo')}>
          + Novo Serviço
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-hover mt-4">
        <thead className="table-dark">
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Data Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((s) => (
            <tr key={s.Codigo}>
              <td>{s.Codigo}</td>
              <td>{s.Descricao}</td>
              <td>{s.Valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td>{new Date(s.Data_criacao_atu).toLocaleDateString('pt-BR')}</td>
              <td>
                <button 
                    className="btn btn-sm btn-warning me-2" 
                    onClick={() => navigate(`/servicos/editar/${s.Codigo}`)}
                >
                    Alterar
                </button>
                <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteService(s.Codigo)}
                >
                    Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {servicos.length === 0 && !error && <p className="text-center">Nenhum serviço cadastrado.</p>}
    </div>
  );
};

export default ServiceList;
