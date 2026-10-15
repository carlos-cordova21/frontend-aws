import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [rawToken, setRawToken] = useState('');
  const [decodedToken, setDecodedToken] = useState(null);
  const navigate = useNavigate();

  // Decodificar JWT en cliente para visualización de claims
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const loadData = useCallback(() => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('jwt_token');
    if (token) {
      setRawToken(token);
      setDecodedToken(parseJwt(token));
    }

    api.get('/dashboard/data')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user_info');
          navigate('/login');
        } else {
          setError(err.response?.data?.error || 'Error conectando con la VPC Backend a través de VPC Peering');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px', width: '100%' }}>
      
      {/* Barra Superior / Header */}
      <header className="glass-panel" style={{
        padding: '18px 26px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '26px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: '#fff'
          }}>
            ZT
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Zero Trust Security Dashboard</h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '3px' }}>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                <span className="badge-dot"></span>
                VPC Peering: Activo
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Arquitectura de Defensa en Profundidad
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {data?.user && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{data.user.username}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{data.user.role || 'Usuario'}</div>
            </div>
          )}
          <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Alerta de Error si la hay */}
      {error && (
        <div className="alert alert-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            <strong>Error de Conexión:</strong> {error}
          </div>
        </div>
      )}

      {/* Grid de Estado de la Arquitectura */}
      <div className="dashboard-grid">
        
        {/* Card 1: VPC Frontend */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="metric-label">Perímetro Web</div>
            <span className="badge badge-blue">VPC Frontend</span>
          </div>
          <div className="metric-value" style={{ marginTop: '10px', color: '#60a5fa' }}>
            Nginx + React + Vite
          </div>
          <div className="metric-sub">
            Subred Pública &bull; Hardening UFW &bull; AWS WAF &bull; Certbot SSL
          </div>
        </div>

        {/* Card 2: VPC Backend */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="metric-label">Capa de Aplicación y Datos</div>
            <span className="badge badge-cyan">VPC Backend</span>
          </div>
          <div className="metric-value" style={{ marginTop: '10px', color: 'var(--accent-cyan)' }}>
            Node.js + PostgreSQL
          </div>
          <div className="metric-sub">
            Subred Privada Aislada &bull; Sin acceso a Internet &bull; Fail2Ban
          </div>
        </div>

        {/* Card 3: Zero Trust Status */}
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="metric-label">Principio Zero Trust</div>
            <span className="badge badge-green">Continuo</span>
          </div>
          <div className="metric-value" style={{ marginTop: '10px', color: 'var(--accent-green)' }}>
            Never Trust, Always Verify
          </div>
          <div className="metric-sub">
            Cada solicitud valida firma JWT y origen en red privada
          </div>
        </div>

      </div>

      {/* Panel Central: Respuesta y Verificación del Backend */}
      <div className="glass-panel" style={{ marginTop: '26px', padding: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Respuesta del Backend Protegido</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Datos transmitidos a través del túnel privado de VPC Peering
            </p>
          </div>
          <button 
            onClick={loadData} 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            {loading ? 'Consultando...' : 'Re-verificar Solicitud'}
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <span className="badge-dot" style={{ display: 'inline-block', marginRight: '8px' }}></span>
            Consultando API privada en VPC Backend...
          </div>
        ) : data ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '4px solid var(--accent-green)'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600, marginBottom: '4px' }}>
                {data.message}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>Timestamp del Servidor:</strong> {data.timestamp}
              </div>
            </div>

            {data.security && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ZONA VPC</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{data.security.vpcZone}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MÉTODO DE AUTENTICACIÓN</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{data.security.authMethod}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>USUARIOS EN POSTGRESQL</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px', color: 'var(--accent-cyan)' }}>
                    {data.security.totalRegisteredUsers !== undefined ? `${data.security.totalRegisteredUsers} usuario(s)` : 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Panel de Inspección de Token JWT (Zero Trust Evidence) */}
      <div className="glass-panel" style={{ marginTop: '26px', padding: '26px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '6px' }}>
          Inspección de Credenciales Criptográficas (JWT)
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Evidencia de identidad emitida con firma HMAC-SHA256 para validación continua
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
              Claims Decodificados (Payload):
            </div>
            <pre style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              color: '#38bdf8',
              overflowX: 'auto',
              border: '1px solid rgba(56, 189, 248, 0.2)'
            }}>
              {decodedToken ? JSON.stringify(decodedToken, null, 2) : 'Token no disponible'}
            </pre>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
              Token Compacto Serializado:
            </div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              wordBreak: 'break-all',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              maxHeight: '145px',
              overflowY: 'auto'
            }}>
              {rawToken || 'No disponible'}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}