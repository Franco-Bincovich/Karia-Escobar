// components/layout/SidebarIntegraciones.jsx
// Lista de integraciones con toggle on/off + botón para abrir el modal.

import { useState, useEffect } from 'react';
import { integracionesApi } from '../../services/api';
import ModalIntegraciones from '../integraciones/ModalIntegraciones';

const ICONOS = { anthropic: '🤖', openai: '🧠', perplexity: '🔍', gamma: '🎨', gmail: '📧', drive: '💾', calendar: '📅' };
const NOMBRES = { anthropic: 'Anthropic', openai: 'OpenAI', perplexity: 'Perplexity', gamma: 'Gamma AI', gmail: 'Gmail', drive: 'Drive', calendar: 'Calendar' };

const ITEM = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '8px 12px', borderBottom: '1px solid #e5e5e5',
};
const LABEL = {
  fontSize: '13px', fontWeight: 500, color: 'var(--color-white)',
  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};

function StatusDot({ activo }) {
  return (
    <span style={{
      width: '8px', height: '8px', borderRadius: '50%',
      background: activo ? '#43D1C9' : '#FC8181', flexShrink: 0,
    }} />
  );
}

function Toggle({ activo, onClick }) {
  return (
    <button
      onClick={onClick}
      title={activo ? 'Desactivar' : 'Activar'}
      aria-label={activo ? 'Desactivar' : 'Activar'}
      style={{
        position: 'relative', width: '32px', height: '18px', borderRadius: '9px',
        background: activo ? '#43D1C9' : 'rgba(255,255,255,0.2)',
        border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: '3px', left: activo ? '16px' : '3px',
        width: '12px', height: '12px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
      }} />
    </button>
  );
}

/** @param {{ token: string|null }} props */
export default function SidebarIntegraciones({ token }) {
  const [integraciones, setIntegraciones] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  async function cargar() {
    if (!token) return;
    try {
      const data = await integracionesApi.listar(token);
      setIntegraciones(data.integraciones || []);
    } catch (_) { setIntegraciones([]); }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('connected') === 'google') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => { cargar(); }, [token]);

  async function handleToggle(tipo) {
    try {
      await integracionesApi.toggle(tipo, token);
      setIntegraciones((prev) =>
        prev.map((i) => (i.tipo === tipo ? { ...i, activo: !i.activo } : i))
      );
    } catch (_) {}
  }

  return (
    <>
      {integraciones.map((integ) => (
        <div key={integ.tipo} style={ITEM}>
          <span style={{ fontSize: '14px', flexShrink: 0 }}>{ICONOS[integ.tipo] || '🔗'}</span>
          <span style={LABEL}>{NOMBRES[integ.tipo] || integ.tipo}</span>
          <StatusDot activo={integ.activo} />
          <Toggle activo={integ.activo} onClick={() => handleToggle(integ.tipo)} />
        </div>
      ))}

      <button
        onClick={() => setModalAbierto(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 12px',
          cursor: 'pointer', borderRadius: 'var(--border-radius)', transition: 'background 0.2s',
          border: 'none', background: 'transparent', width: '100%',
          color: 'var(--color-teal)', fontSize: '13px', fontWeight: 500,
          fontFamily: 'var(--font)', textAlign: 'left',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(67,209,201,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ fontSize: '14px' }}>＋</span>
        <span>Agregar integración</span>
      </button>

      {modalAbierto && (
        <ModalIntegraciones
          token={token}
          onClose={() => setModalAbierto(false)}
          onConectado={() => { cargar(); setModalAbierto(false); }}
        />
      )}
    </>
  );
}
