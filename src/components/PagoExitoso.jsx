// src/components/PagoExitoso.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PagoExitoso = () => {
  const { state } = useLocation();
  const formData = state?.formData || {};
  const carrito = state?.carrito || [];
  const total = state?.total || 0;

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 border-success">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <div>
            <h3 className="text-success fw-bold mb-0">
              ✅ Se ha realizado la compra. Nro {state?.nroOrden || '#20240705'}
            </h3>
            <small className="text-muted">Detalle de tu boleta electrónica</small>
          </div>
          <span className="badge bg-dark fs-6">Código: {state?.nroOrden || 'ORDER2026'}</span>
        </div>

        <h5 className="fw-bold">Información del cliente</h5>
        <div className="row mb-3">
          <div className="col-md-4"><strong>Nombre:</strong> {formData.nombre}</div>
          <div className="col-md-4"><strong>Apellidos:</strong> {formData.apellidos}</div>
          <div className="col-md-4"><strong>Correo:</strong> {formData.correo}</div>
        </div>

        <h5 className="fw-bold">Dirección de entrega de los productos</h5>
        <div className="row mb-4">
          <div className="col-md-5"><strong>Calle:</strong> {formData.calle}</div>
          <div className="col-md-3"><strong>Depto:</strong> {formData.depto || 'N/A'}</div>
          <div className="col-md-4"><strong>Comuna:</strong> {formData.comuna}</div>
        </div>

        <table className="table align-middle table-bordered">
          <thead className="table-light">
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => (
              <tr key={item.id}>
                <td><img src={item.imagen} alt={item.nombre} style={{ width: '45px', height: '45px', objectFit: 'contain' }} /></td>
                <td>{item.nombre}</td>
                <td>${item.precio.toLocaleString('es-CL')}</td>
                <td>{item.cantidad}</td>
                <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-end my-3">
          <h4 className="fw-bold text-success">Total pagado: ${total.toLocaleString('es-CL')}</h4>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-danger" onClick={() => window.print()}>🖨️ Imprimir Boleta en PDF</button>
          <Link to="/perfil" className="btn btn-success">Ver en Mi Historial</Link>
          <Link to="/" className="btn btn-dark">Volver al Catálogo</Link>
        </div>
      </div>
    </div>
  );
};

export default PagoExitoso;