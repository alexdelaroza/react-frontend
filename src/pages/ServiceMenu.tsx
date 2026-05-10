import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceMenu: React.FC = () => {
    const navigate = useNavigate();
    const [searchId, setSearchId] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId.trim()) {
            // Redireciona para a tela de edição de serviço pelo código informado
            navigate(`/servicos/editar/${searchId}`);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4 text-center">Gestão de Serviços</h2>
            
            <div className="row">
                {/* Card Superior: Consultas - Padrão Dark */}
                <div className="col-12 mb-4">
                    <div className="card shadow-sm border-dark">
                        <div className="card-body">
                            <h5 className="card-title">Consultas</h5>
                            <p className="card-text text-muted small">
                                Consulte o catálogo completo ou busque um serviço pelo código.
                            </p>
                            
                            <button 
                                className="btn btn-dark w-100 mb-3" 
                                onClick={() => navigate('/servicos')} // Rota ajustada para evitar conflito
                            >
                                Listar Todos os Serviços
                            </button>

                            <form onSubmit={handleSearch} className="d-flex gap-2">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Código do Serviço" 
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                                <button type="submit" className="btn btn-outline-dark">
                                    Consultar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Card Inferior: Ações - Padrão Dark */}
                <div className="col-12">
                    <div className="card shadow-sm border-dark">
                        <div className="card-body">
                            <h5 className="card-title text-dark">Ações</h5>
                            <p className="card-text text-muted small">
                                Adicione novos serviços ou atualize valores e descrições no sistema.
                            </p>
                            
                            <button 
                                className="btn btn-dark w-100 mb-3" 
                                onClick={() => navigate('/servicos/novo')}
                            >
                                + Cadastrar Novo Serviço
                            </button>
                            
                            <div className="alert alert-light border-0 mb-0 py-1 text-center">
                                <p className="small text-secondary mb-0">
                                    * Para <strong>Alterar</strong> ou <strong>Deletar</strong>, 
                                    utilize a lista geral ou a consulta por código acima.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Botão Voltar centralizado no final */}
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

export default ServiceMenu;
