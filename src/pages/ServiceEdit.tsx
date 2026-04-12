import React, { useEffect, useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ServiceEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState<number | string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        axios.get(`${apiUrl}/servicos/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            console.log("Resposta da API:", res.data); // LOG PARA DEBUG
            // Ajustado para res.data.service conforme o seu JSON
            const s = res.data.service; 
            if (s) {
                setDescricao(s.Descricao || '');
                setValor(s.Valor || '');
                setError(""); // Limpa qualquer erro anterior
            } else {
                setError("Objeto 'service' não encontrado na resposta.");
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Erro Axios:", err.response);
            setError("Erro ao carregar dados do serviço.");
            setLoading(false);
        });
    }, [id, apiUrl]);
    
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('jwt');

        try {
            await axios.put(`${apiUrl}/servicos/${id}`, {
                Descricao: descricao,
                Valor: Number(valor) // Garante que vai como número
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Serviço atualizado com sucesso!');
            navigate('/servicos');
        } catch (err: any) {
            const msg = err.response?.data?.error || err.response?.data?.message || 'Erro ao atualizar.';
            setError(msg);
        }
    };

    if (loading) return <div className="container mt-5">Carregando...</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="mb-4">Alterar Serviço #{id}</h2>
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label">Descrição</label>
                        <input 
                            className="form-control" 
                            value={descricao} 
                            onChange={e => setDescricao(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Valor</label>
                        <input 
                            type="number"
                            step="0.01"
                            className="form-control" 
                            value={valor} 
                            onChange={e => setValor(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary me-2">Salvar Alterações</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/servicos')}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceEdit;
