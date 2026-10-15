import React from 'react';
import { Link } from 'react-router-dom';

const Carrito = ({ carrito = [], actualizarCantidad, eliminarDelCarrito }) => {
  // Calcular total general
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Carrito de Compras</h2>
      
      {carrito.length === 0 ? (
        <div className="alert alert-info">
          Tu carrito está vacío. <Link to="/" className="alert-link">Volver a la tienda</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img src={item.imagen} alt={item.nombre} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                    </td>
                    <td>{item.nombre}</td>
                    <td>${item.precio.toLocaleString()}</td>
                    <td>
                      <input 
                        type="number" 
                        min="1" 
                        value={item.cantidad} 
                        onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value) || 1)}
                        style={{ width: '60px' }}
                        className="form-control form-control-sm"
                      />
                    </td>
                    <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarDelCarrito(item.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <h4>Resumen de la orden</h4>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Total a pagar:</span>
                <span className="fw-bold text-success fs-5">${total.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="btn btn-success w-100">
                Comprar ahora
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;