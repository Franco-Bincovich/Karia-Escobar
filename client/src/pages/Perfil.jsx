// pages/Perfil.jsx
// Gestión de funcionalidades e integraciones del usuario.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { funcionalidadesApi, integracionesApi } from '../services/api';
import Layout from '../components/layout/Layout';

const ICONOS = { anthropic: '🤖', openai: '🧠', perplexity: '🔍', gamma: '🎨', gmail: '📧', drive: '💾', calendar: '📅' };
const NOMBRES = { anthropic: 'Anthropic', openai: 'OpenAI', perplexity: 'Perplexity', gamma: 'Gamma AI', gmail: 'Gmail', drive: 'Drive', calendar: 'Calendar' };

const CARD = {
  background: '#fff', borderRadius: 'var(--border-radius)',
  boxShadow: 'var(--shadow)', padding: '1.5rem', marginBottom: '1.5rem',
};
const ROW = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  padding: '10px 0', borderBottom: '1px solid #f0f0f0',
};
const BTN_DELETE = {
  background: 'transparent', border: '1px solid #FC8181', color: '#FC8181',
  fontSize: '12px', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer',
  fontFamily: 'var(--font)', fontWeight: 500, flexShrink: 0, transition: 'all 0.2s',
};
const BADGE = (activo) => ({
  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '99px',
  background: activo ? 'rgba(67,209,201,0.15)' : 'rgba(252,129,129,0.15)',
  color: activo ? '#43D1C9' : '#FC8181', flexShrink: 0,
});

export default function Perfil() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [funcionalidades, setFuncionalidades] = useState([]);
  const [integraciones, setIntegraciones] = useState([]);

  useEffect(() => {
    if (!token) return;
    funcionalidadesApi.listar(token).then((d) => setFuncionalidades(d.funcionalidades || [])).catch(() => {});
    integracionesApi.listar(token).then((d) => setIntegraciones(d.integraciones || [])).catch(() => {});
  }, [token]);

  async function eliminarFunc(id, nombre) {
    if (!window.confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await funcionalidadesApi.eliminar(id, token);
      setFuncionalidades((prev) => prev.filter((f) => f.id !== id));
    } catch (_) {}
  }

  async function eliminarInteg(tipo) {
    if (!window.confirm(`¿Eliminar la integración ${NOMBRES[tipo] || tipo}? Se borrarán las credenciales guardadas.`)) return;
    try {
      await integracionesApi.desconectar(tipo, token);
      setIntegraciones((prev) => prev.filter((i) => i.tipo !== tipo));
    } catch (_) {}
  }

  return (
    <Layout onSeleccionarConversacion={(id) => navigate(`/chat?c=${id}`)} onLogout={() => {}}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
          Mi Perfil
        </h1>

        {/* Funcionalidades */}
        <div style={CARD}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Mis Funcionalidades
          </h2>
          {funcionalidades.length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No tenés funcionalidades creadas.</p>
          )}
          {funcionalidades.map((f) => (
            <div key={f.id} style={ROW}>
              <span style={{ fontSize: '14px' }}>📄</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>{f.nombre}</div>
                {f.descripcion && (
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.descripcion}
                  </div>
                )}
              </div>
              <span style={BADGE(f.activo !== false)}>{f.activo !== false ? 'Activo' : 'Inactivo'}</span>
              <button
                onClick={() => eliminarFunc(f.id, f.nombre)}
                style={BTN_DELETE}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FC8181'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FC8181'; }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {/* Integraciones */}
        <div style={CARD}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Mis Integraciones
          </h2>
          {integraciones.map((integ) => (
            <div key={integ.tipo} style={ROW}>
              <span style={{ fontSize: '14px' }}>{ICONOS[integ.tipo] || '🔗'}</span>
              <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                {NOMBRES[integ.tipo] || integ.tipo}
              </span>
              <span style={BADGE(integ.activo)}>{integ.activo ? 'Activo' : 'Inactivo'}</span>
              <button
                onClick={() => eliminarInteg(integ.tipo)}
                style={BTN_DELETE}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FC8181'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FC8181'; }}
              >
                Eliminar
              </button>
            </div>
          ))}
          {integraciones.length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              No tenés integraciones conectadas. Agregá desde el sidebar.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
