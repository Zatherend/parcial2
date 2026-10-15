// src/components/AlertaPersonalizada.jsx
import React from 'react';

const AlertaPersonalizada = ({ alerta, cerrarAlerta }) => {
  if (!alerta || !alerta.mensaje) return null;

  return (
    <div 
      className={`alert alert-${alerta.tipo || 'success'} alert-dismissible fade show shadow-lg`} 
      role="alert"
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        borderLeft: '5px solid #212529'
      }}
    >
      <strong>{alerta.titulo || 'Aviso del Grand Line'}: </strong> 
      <span>{alerta.mensaje}</span>
      <button type="button" className="btn-close" onClick={cerrarAlerta}></button>
    </div>
  );
};

export default AlertaPersonalizada;