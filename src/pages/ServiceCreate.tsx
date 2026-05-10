import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServiceCreate: React.FC = () => {
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState<number | string>('');
    const [error, setError] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const token = localStorage.getItem('jwt');

        try {
            await axios.post(`${apiUrl}/servicos`, {
                Descricao: descricao,
                Valor: Number(valor)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSucesso(true);
            setTimeout(() => navigate('/servicos/menu'), 2000);
        } catch (err: any) {
            const msg = err.response?.data?.error || err.response?.data?.message || 'Erro ao cadastrar serviço.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="card shadow-sm border-dark p-4">
                <h2 className="text-center mb-4 fw-bold">Novo Serviço</h2>
                
                {sucesso && (
                    <div className="alert alert-success text-center shadow-sm">
                        ✅ Serviço cadastrado com sucesso!
                    </div>
                )}
                
                {error && (
                    <div className="alert alert-danger py-2 text-center shadow-sm" role="alert">
                        <small>{error}</small>
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary">Descrição</label>
                        <input 
                            className="form-control form-control-lg" 
                            placeholder="Ex: Consultoria Técnica"
                            value={descricao} 
                            onChange={(e) => setDescricao(e.target.value)} 
                            required 
                            disabled={loading || sucesso}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-secondary">Valor (R$)</label>
                        <input 
                            type="number"
                            step="0.01"
                            className="form-control form-control-lg" 
                            placeholder="0.00"
                            value={valor} 
                            onChange={(e) => setValor(e.target.value)} 
                            required 
                            disabled={loading || sucesso}
                        />
                    </div>

                    {/* Seção de Botões Padronizada (Igual ao Register) */}
                    <div className="d-flex flex-column gap-2">
                        <button 
                            className="btn btn-dark btn-lg shadow-sm w-100 fw-bold" 
                            type="submit" 
                            disabled={loading || sucesso}
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
                            onClick={() => navigate('/servicos/menu')}
                            disabled={loading || sucesso}
                        >
                            Cancelar e Voltar
                        </button>
                    </div>
                </form>
            </div>
            
            <p className="text-center mt-4 text-muted small">&copy; 2026 API-Manager</p>
        </div>
    );
};

export default ServiceCreate;
