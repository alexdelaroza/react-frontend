import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServiceCreate: React.FC = () => {
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState<number | string>('');
    const [error, setError] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setError('');
        const token = localStorage.getItem('jwt');

        try {
            await axios.post(`${apiUrl}/servicos`, {
                Descricao: descricao,
                Valor: Number(valor)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSucesso(true);
            setTimeout(() => navigate('/servicos'), 2000);
        } catch (err: any) {
            const msg = err.response?.data?.error || err.response?.data?.message || 'Erro ao cadastrar serviço.';
            setError(msg);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="mb-4">Novo Serviço</h2>
                
                {sucesso && <div className="alert alert-success">Serviço cadastrado com sucesso!</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label">Descrição</label>
                        <input 
                            className="form-control" 
                            placeholder="Ex: Consultoria Técnica"
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
                            placeholder="0.00"
                            value={valor} 
                            onChange={e => setValor(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-success me-2">Cadastrar</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/servicos')}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceCreate;
