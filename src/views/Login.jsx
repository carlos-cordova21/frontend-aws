import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user_info', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al autenticar contra el Backend');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('password123');
    setError('');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        
        {/* Header con Badge de Seguridad */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '14px' }}>
            <span className="badge badge-cyan">
              <span className="badge-dot"></span>
              VPC FRONTEND &bull; DMZ
            </span>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Zero Trust Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Autenticación continua hacia la VPC Backend privada
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="alert alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Usuario</label>
            <input 
              id="username"
              type="text" 
              className="form-input"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="ej. admin"
              required 
              autoComplete="username"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input 
              id="password"
              type="password" 
              className="form-input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••••••"
              required 
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? (
              <>
                <span className="badge-dot" style={{ backgroundColor: '#fff' }}></span>
                Verificando credenciales...
              </>
            ) : (
              'Iniciar Sesión Segura'
            )}
          </button>
        </form>

        {/* Ayuda de Credenciales de Prueba */}
        <div style={{
          marginTop: '20px',
          padding: '12px 14px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-sm)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span>Demo: <strong>admin</strong> / <strong>password123</strong></span>
          </div>
          <button 
            onClick={handleFillDemo} 
            type="button" 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent-cyan)', 
              cursor: 'pointer', 
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            Autocompletar
          </button>
        </div>

        {/* Footer Security Badges */}
        <div style={{ 
          marginTop: '24px', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px', 
          flexWrap: 'wrap' 
        }}>
          <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>Fail2Ban Monitored</span>
          <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>AWS WAF Ready</span>
          <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>PostgreSQL</span>
        </div>

      </div>
    </div>
  );
}