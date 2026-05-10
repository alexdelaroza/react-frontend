import React, { useEffect, useState, useCallback } from 'react';
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

  const fetchServicos = useCallback(async () => {
    const token = localStorage.getItem('jwt');
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/servicos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const lista = response.data.services || response.data.service || response.data.user || response.data;
      
      if (Array.isArray(lista)) {
        setServicos(lista);
      } else {
        setServicos([]);
      }
    } catch (err: any) {
      setError('Erro ao carregar serviços');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchServicos();
  }, [fetchServicos]);

  const deleteService = async (codigo: string) => {
    if (!window.confirm(`Deseja excluir o serviço #${codigo}?`)) return;
    const token = localStorage.getItem('jwt');
    try {
      await axios.delete(`${apiUrl}/servicos/list/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServicos(servicos.filter(s => s.Codigo !== codigo));
    } catch (err: any) {
      alert('Erro ao excluir');
    }
  };

  if (loading) return <div className="container mt-5 text-center">Carregando...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 text-dark">Consulta de Serviços</h2>
          {/* BOTÃO VOLTAR REVISADO COM CAMINHO ABSOLUTO FORÇADO */}
          <button 
            type="button"
            className="btn btn-link text-decoration-none p-0 text-secondary" 
            onClick={() => {
                console.log("Tentando navegar para /servicos/menu");
                navigate('/servicos/menu');
            }}
          >
            ← Voltar para Gestão de Serviços
          </button>
        </div>
        
        <button className="btn btn-success" onClick={() => navigate('/servicos/novo')}>
          + Novo Serviço
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-hover mt-4 border shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Data</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {servicos.map((s) => (
              <tr key={s.Codigo}>
                <td>{s.Codigo}</td>
                <td><strong>{s.Descricao}</strong></td>
                <td>{(s.Valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{new Date(s.Data_criacao_atu).toLocaleDateString('pt-BR')}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/servicos/editar/${s.Codigo}`)}>Alterar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteService(s.Codigo)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceList;
