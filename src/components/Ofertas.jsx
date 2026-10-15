// src/components/Ofertas.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../database';

const Ofertas = ({ agregarAlCarrito }) => {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    // Seleccionamos como ofertas los posters con precio <= 5990
    const todos = obtenerProductos();
    setOfertas(todos.filter(p => p.precio <= 5990));
  }, []);

  return (
    <div className="container mt-4">
      <div className="p-4 mb-4 bg-danger text-white rounded-3 shadow text-center">
        <h1 className="fw-bold">🔥 OFERTAS DEL GRAND LINE</h1>
        <p className="mb-0">Aprovecha precios rebajados en carteles seleccionados de la tripulación y Supernovas.</p>
      </div>

      <div className="row">
        {ofertas.map((prod) => {
          const precioOriginal = Math.round(prod.precio * 1.25);
          return (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={prod.id}>
              <div className="card h-100 shadow position-relative" style={{ backgroundColor: '#f4e4bc', border: '3px solid #dc3545' }}>
                <span className="badge bg-danger position-absolute top-0 start-0 m-2 shadow">
                  🏷️ -20% OFERTA
                </span>

                <img 
                  src={prod.imagen} 
                  className="card-img-top p-3 mt-2" 
                  alt={prod.nombre} 
                  style={{ height: '190px', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=OFERTA+WANTED' }} 
                />
                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title fw-bold">{prod.nombre}</h5>
                  <p className="text-danger fw-bold small mb-1">Recompensa: ฿ {prod.recompensa.toLocaleString('es-CL')}</p>
                  <div className="mb-2">
                    <span className="text-muted text-decoration-line-through me-2 small">
                      ${precioOriginal.toLocaleString('es-CL')}
                    </span>
                    <span className="text-success fw-bold fs-5">
                      ${prod.precio.toLocaleString('es-CL')}
                    </span>
                  </div>
                  <div className="mt-auto d-flex gap-2">
                    <Link to={`/producto/${prod.id}`} className="btn btn-outline-dark btn-sm w-50 fw-bold">
                      Detalle
                    </Link>
                    <button 
                      className="btn btn-danger btn-sm w-50 fw-bold" 
                      disabled={prod.stock === 0}
                      onClick={() => agregarAlCarrito(prod)}
                    >
                      🛒 Añadir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ofertas;