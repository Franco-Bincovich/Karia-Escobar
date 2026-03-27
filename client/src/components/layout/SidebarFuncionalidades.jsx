// components/layout/SidebarFuncionalidades.jsx
// Lista de funcionalidades con toggle on/off, más botón para crear nueva.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { funcionalidadesApi } from '../../services/api';

const ITEM = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  padding: '8px 12px', borderBottom: '1px solid #e5e5e5',
};
const LABEL = {
  fontSize: '13px', fontWeight: 500, color: 'var(--color-white)',
  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};

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
export default function SidebarFuncionalidades({ token }) {
  const [funcionalidades, setFuncionalidades] = useState([]);
  const navigate = useNavigate();

  async function cargar() {
    if (!token) return;
    try {
      const data = await funcionalidadesApi.listar(token);
      setFuncionalidades(data.funcionalidades || []);
    } catch (_) { setFuncionalidades([]); }
  }

  useEffect(() => { cargar(); }, [token]);

  async function handleToggle(id) {
    try {
      await funcionalidadesApi.toggle(id, token);
      setFuncionalidades((prev) =>
        prev.map((f) => (f.id === id ? { ...f, activo: !f.activo } : f))
      );
    } catch (_) {}
  }

  return (
    <>
      {funcionalidades.map((f) => (
        <div key={f.id} style={ITEM}>
          <span style={{ fontSize: '14px', flexShrink: 0 }}>📄</span>
          <span style={LABEL}>{f.nombre}</span>
          <Toggle activo={f.activo !== false} onClick={() => handleToggle(f.id)} />
        </div>
      ))}

      <button
        onClick={() => navigate('/crear-funcionalidad')}
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
        <span>Agregar funcionalidad</span>
      </button>
    </>
  );
}
