// src/components/Historial.jsx
import React, { useState, useEffect } from 'react';
import { obtenerHistorial } from '../database';
import { Link } from 'react-router-dom';

const Historial = () => {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    setCompras(obtenerHistorial());
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">📜 Mi Historial de Compras (Temporal)</h2>

      {compras.length === 0 ? (
        <div className="alert alert-warning p-4 shadow-sm">
          <h5>Aún no has realizado ninguna compra en esta sesión.</h5>
          <p className="mb-2">Elige tus carteles de recompensa favoritos y completa el Checkout para ver tus boletas aquí.</p>
          <Link to="/" className="btn btn-dark btn-sm">Ir al Catálogo</Link>
        </div>
      ) : (
        compras.map((orden, index) => (
          <div className="card mb-4 shadow-sm border-success" key={index}>
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <span><strong>Orden N°: {orden.idOrden}</strong> — Fecha: {orden.fecha}</span>
              <span className="badge bg-success fs-6">Pagado: ${orden.total.toLocaleString('es-CL')}</span>
            </div>
            <div className="card-body">
              <p className="mb-2">
                <strong>Cliente:</strong> {orden.cliente.nombre} {orden.cliente.apellidos} ({orden.cliente.correo})<br />
                <strong>Dirección de Envío:</strong> {orden.cliente.calle} {orden.cliente.depto && `, Depto ${orden.cliente.depto}`}, {orden.cliente.comuna}
              </p>
              <table className="table table-sm table-bordered mt-2 mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Póster</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
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
  );
};

export default Historial;