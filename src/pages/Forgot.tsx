import React, { useState, SyntheticEvent } from 'react';
import axios from 'axios';

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:3000';
};

interface NotifyState {
  show: boolean;
  error: boolean;
  message: string;
}

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState<NotifyState>({
    show: false,
    error: false,
    message: ''
  });

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotify({ show: false, error: false, message: '' });

    const apiUrl = getApiUrl();
    console.log('API URL:', apiUrl);
    console.log('Email:', email);

    try {
      console.log('Enviando requisição para:', `${apiUrl}/api/forgot`);
      const response = await axios.post(`${apiUrl}/api/forgot`, {
        email
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      console.log('Resposta:', response.data);
      setNotify({
        show: true,
        error: false,
        message: 'Password reset instructions have been sent to your email'
      });
      setEmail('');
    } catch (err: any) {
      console.error('Erro completo:', err);
      console.error('Resposta do erro:', err.response);
      console.error('Dados do erro:', err.response?.data);

      setNotify({
        show: true,
        error: true,
        message: err.response?.data?.message || 'Error sending email'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-floating" onSubmit={submit}>
      {notify.show && (
        <div 
          className={`alert ${notify.error ? 'alert-danger' : 'alert-success'}`} 
          role="alert"
        >
          {notify.message}
        </div>
      )}

      <h1 className="h3 mb-3 font-weight-normal">Reset Password</h1>
      
      <div className="form-signin">
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      <button 
        className="form-signin btn btn-primary w-100 py-2" 
        type="submit"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Reset Instructions'}
      </button>

      <p className="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
    </form>
  );
};

export default Forgot;