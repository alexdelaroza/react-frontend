import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Interface ajustada para as chaves exatas do seu JSON do Go
interface Log {
  Codigo: string;
  Descricao: string;
  Codigo_recurso: string;
  Criado_por: string;
  Data_criacao_atu: string;
}

const LogList: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Estados dos filtros (Padrão: dia de hoje)
  const hoje = new Date().toISOString().split('T')[0];
  const [dataInicio, setDataInicio] = useState(hoje);
  const [dataFim, setDataFim] = useState(hoje);
  const [codigoBusca, setCodigoBusca] = useState(''); 

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('jwt');
    
    try {
      const response = await axios.get(`${apiUrl}/logs`, {
        params: { 
            dataInicio, 
            dataFim, 
            id: codigoBusca 
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Acessando a chave "log" do seu JSON de retorno
      if (response.data && Array.isArray(response.data.log)) {
        setLogs(response.data.log);
      } else {
        setLogs([]);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || err.response?.data?.message || 'Erro ao carregar logs';
      setError(msg);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, dataInicio, dataFim, codigoBusca]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Histórico de Logs</h2>

      {/* Filtros de Data e Código */}
      <div className="card p-3 mb-4 shadow-sm border-dark">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-bold">Cód. Log (ID)</label>
            <input 
                type="text" 
                className="form-control" 
                placeholder="Ex: 9" 
                value={codigoBusca} 
                onChange={e => setCodigoBusca(e.target.value)} 
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Data Início</label>
            <input 
                type="date" 
                className="form-control" 
                value={dataInicio} 
                onChange={e => setDataInicio(e.target.value)} 
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Data Fim</label>
            <input 
                type="date" 
                className="form-control" 
                value={dataFim} 
                onChange={e => setDataFim(e.target.value)} 
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-dark w-100" onClick={fetchLogs}>
                Pesquisar
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center my-5">
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Carregando...</span>
            </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover border">
            <thead className="table-dark">
              <tr>
                <th>Cód.</th>
                <th>Descrição da Ação</th>
                <th>Recurso</th>
                <th>Autor</th>
                <th>Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.Codigo}>
                  <td>{l.Codigo}</td>
                  <td><strong>{l.Descricao}</strong></td>
                  <td><span className="badge bg-light text-dark border">Cód: {l.Codigo_recurso}</span></td>
                  <td>User {l.Criado_por}</td>
                  <td className="small">{new Date(l.Data_criacao_atu).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && !error && (
            <p className="text-center mt-3 text-muted">Nenhum registro encontrado para os filtros informados.</p>
          )}
        </div>
      )}

      {/* Botão Voltar no Rodapé seguindo o padrão de gestão */}
      <div className="text-center mt-5 mb-5">
        <button 
          className="btn btn-link text-decoration-none text-secondary" 
          onClick={() => navigate('/')}
        >
          ← Voltar para Home
        </button>
      </div>
    </div>
  );
};

export default LogList;
