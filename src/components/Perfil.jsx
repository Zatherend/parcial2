// src/components/Perfil.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { obtenerHistorialPorUsuario, actualizarDatosUsuario } from '../database';

const Perfil = ({ usuarioActual, actualizarEstadoUsuario, mostrarAlerta }) => {
  const [misCompras, setMisCompras] = useState([]);
  const [editando, setEditando] = useState(false);
  const [datosForm, setDatosForm] = useState({
    nombre: usuarioActual?.nombre || '',
    apellidos: usuarioActual?.apellidos || '',
    calle: usuarioActual?.calle || '',
    depto: usuarioActual?.depto || '',
    comuna: usuarioActual?.comuna || ''
  });

  useEffect(() => {
    if (usuarioActual) {
      setMisCompras(obtenerHistorialPorUsuario(usuarioActual.correo));
    }
  }, [usuarioActual]);

  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  const handleGuardarCambios = (e) => {
    e.preventDefault();
    const actualizado = actualizarDatosUsuario(usuarioActual.correo, datosForm);
    if (actualizado) {
      actualizarEstadoUsuario(actualizado);
      setEditando(false);
      if (mostrarAlerta) {
        mostrarAlerta('Tus datos personales se han actualizado.', 'success', 'Perfil Actualizado');
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Columna Izquierda: Datos del Usuario */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <div className="text-center mb-3">
              <div className="bg-dark text-warning rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-2" style={{ width: '70px', height: '70px' }}>
                {usuarioActual.nombre.charAt(0).toUpperCase()}
              </div>
              <h4 className="fw-bold mt-2 mb-0">{usuarioActual.nombre} {usuarioActual.apellidos}</h4>
              <span className="badge bg-secondary text-uppercase mt-1">{usuarioActual.rol}</span>
            </div>

            <hr />

            {!editando ? (
              <div>
                <p className="mb-2"><strong>📧 Correo:</strong><br /> {usuarioActual.correo}</p>
                <p className="mb-2"><strong>🏠 Dirección:</strong><br /> {usuarioActual.calle || 'No registrada'} {usuarioActual.depto && `, Depto ${usuarioActual.depto}`}</p>
                <p className="mb-3"><strong>📍 Comuna:</strong><br /> {usuarioActual.comuna || 'No registrada'}</p>
                <button className="btn btn-outline-dark btn-sm w-100" onClick={() => setEditando(true)}>
                  ✏️ Editar Mis Datos
                </button>
              </div>
            ) : (
              <form onSubmit={handleGuardarCambios}>
                <div className="mb-2">
                  <label className="form-label small fw-bold">Nombre</label>
                  <input type="text" className="form-control form-control-sm" value={datosForm.nombre} onChange={(e) => setDatosForm({...datosForm, nombre: e.target.value})} required />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold">Apellidos</label>
                  <input type="text" className="form-control form-control-sm" value={datosForm.apellidos} onChange={(e) => setDatosForm({...datosForm, apellidos: e.target.value})} required />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold">Calle y Número</label>
                  <input type="text" className="form-control form-control-sm" value={datosForm.calle} onChange={(e) => setDatosForm({...datosForm, calle: e.target.value})} required />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold">Depto</label>
                  <input type="text" className="form-control form-control-sm" value={datosForm.depto} onChange={(e) => setDatosForm({...datosForm, depto: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Comuna</label>
                  <input type="text" className="form-control form-control-sm" value={datosForm.comuna} onChange={(e) => setDatosForm({...datosForm, comuna: e.target.value})} required />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success btn-sm w-100">Guardar</button>
                  <button type="button" className="btn btn-secondary btn-sm w-100" onClick={() => setEditando(false)}>Cancelar</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Columna Derecha: Historial de Compras del Usuario */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="fw-bold mb-3">📜 Mi Historial de Compras</h4>

            {misCompras.length === 0 ? (
              <div className="alert alert-light border text-center p-4">
                <p className="mb-2">Aún no registras compras asociadas a tu cuenta (<strong>{usuarioActual.correo}</strong>).</p>
                <Link to="/" className="btn btn-dark btn-sm">Explorar Catálogo Wanted</Link>
              </div>
            ) : (
              misCompras.map((orden, idx) => (
                <div className="card mb-3 border-dark" key={idx}>
                  <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <span><strong>Orden {orden.idOrden}</strong> — <small>{orden.fecha}</small></span>
                    <span className="badge bg-success">Total: ${orden.total.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="card-body p-3">
                    <p className="small text-muted mb-2">
                      Enviado a: {orden.cliente.calle} {orden.cliente.depto && `Depto ${orden.cliente.depto}`}, {orden.cliente.comuna}
                    </p>
                    <table className="table table-sm table-bordered mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Póster</th>
                          <th>Precio</th>
                          <th>Cant.</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orden.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.nombre}</td>
                            <td>${item.precio.toLocaleString('es-CL')}</td>
                            <td>{item.cantidad}</td>
                            <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;