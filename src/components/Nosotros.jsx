// src/components/Nosotros.jsx
import React from 'react';

const Nosotros = () => {
  return (
    <div className="container mt-4">
      {/* Encabezado */}
      <div className="p-5 mb-4 bg-dark text-white rounded-3 shadow text-center" style={{ border: '3px solid #d4af37' }}>
        <h1 className="fw-bold text-warning">🏴‍☠️ Sobre Grand Line Posters</h1>
        <p className="lead mb-0">
          La imprenta y distribuidora oficial de carteles "Wanted" para coleccionistas en Chile.
        </p>
      </div>

      {/* Quienes Somos */}
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h3 className="fw-bold mb-3">¿Quiénes Somos?</h3>
        <p className="text-secondary" style={{ lineHeight: '1.8' }}>
          <strong>Grand Line Posters</strong> nació de la pasión por el universo de <em>One Piece</em> y el coleccionismo de alta calidad. Nos especializamos en la réplica exacta de los carteles de recompensa emitidos por la Marina y Cross Guild, utilizando papel texturizado tipo pergamino envejecido e impresión láser de alta durabilidad para que cada fanático pueda decorar su espacio como una auténtica taberna del Nuevo Mundo.
        </p>
      </div>

      {/* Misión y Visión */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card h-100 shadow-sm border-warning p-4" style={{ backgroundColor: '#fffdf7' }}>
            <h4 className="fw-bold text-dark">🎯 Nuestra Misión</h4>
            <p className="mb-0 text-secondary">
              Entregar a los fanáticos del anime y manga en todo Chile carteles de recompensa con calidad de museo, precios accesibles y un sistema de compra rápido, seguro y transparente, garantizando que cada pedido llegue en perfectas condiciones.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-dark p-4">
            <h4 className="fw-bold text-dark">🔭 Nuestra Visión</h4>
            <p className="mb-0 text-secondary">
              Convertirnos en la tienda temática líder a nivel nacional en artículos de colección de One Piece, destacando por nuestra innovación digital, atención personalizada y actualización inmediata de recompensas según avanza la obra original.
            </p>
          </div>
        </div>
      </div>

      {/* Ubicación y Datos de la Empresa */}
      <div className="card shadow-sm border-0 p-4 bg-light">
        <h4 className="fw-bold mb-3">📍 Ubicación y Sede Central</h4>
        <div className="row">
          <div className="col-md-6">
            <p className="mb-2"><strong>🏢 Dirección Casa Matriz:</strong> Av. Vicuña Mackenna 4917, San Joaquín, Región Metropolitana, Santiago de Chile.</p>
            <p className="mb-2"><strong>🕒 Horario de Atención:</strong> Lunes a Viernes de 09:00 a 18:30 hrs.</p>
            <p className="mb-2"><strong>📞 Teléfono de Contacto:</strong> +56 9 8765 4321</p>
            <p className="mb-0"><strong>✉️ Correo Oficial:</strong> contacto@duocuc.cl</p>
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center mt-3 mt-md-0">
            <div className="p-3 bg-white border rounded text-center w-100">
              <span className="fw-bold d-block text-uppercase text-muted small">Despachos a todo Chile</span>
              <p className="mb-0 mt-1 small">
                Enviamos desde nuestra sucursal en Santiago hacia todas las regiones mediante empaque tubular reforzado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;