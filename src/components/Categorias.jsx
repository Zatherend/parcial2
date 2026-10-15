// src/components/Categorias.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../database';

const Categorias = ({ agregarAlCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  useEffect(() => {
    setProductos(obtenerProductos());
  }, []);

  const categoriasUnicas = ['Todas', ...new Set(productos.map(p => p.categoria))];

  const productosFiltrados = categoriaActiva === 'Todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-center mb-4">🗂️ Categorías por Facción Pirata</h2>

      {/* Botones de Categorías (Diseño Figura 4) */}
      <div className="row justify-content-center mb-5">
        {categoriasUnicas.map((cat, idx) => (
          <div className="col-6 col-md-3 col-lg-2 mb-3" key={idx}>
            <div 
              onClick={() => setCategoriaActiva(cat)}
              className={`card text-center p-3 shadow-sm h-100 ${categoriaActiva === cat ? 'bg-dark text-warning border-warning' : 'bg-light'}`}
              style={{ cursor: 'pointer', transition: '0.2s' }}
            >
              <div className="fs-3 mb-1">🏴‍☠️</div>
              <h6 className="fw-bold mb-0">{cat}</h6>
            </div>
          </div>
        ))}
      </div>

      {/* Listado de la Categoría Seleccionada */}
      <h3 className="fw-bold mb-3 border-bottom pb-2">Categoría: {categoriaActiva}</h3>
      <div className="row">
        {productosFiltrados.map((prod) => (
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={prod.id}>
            <div className="card h-100 shadow-sm" style={{ backgroundColor: '#f4e4bc', border: '3px solid #8b6914' }}>
              <img 
                src={prod.imagen} 
                className="card-img-top p-3" 
                alt={prod.nombre} 
                style={{ height: '190px', objectFit: 'contain' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=WANTED' }} 
              />
              <div className="card-body d-flex flex-column text-center">
                <span className="badge bg-dark align-self-center mb-1">{prod.categoria}</span>
                <h5 className="card-title fw-bold">{prod.nombre}</h5>
                <p className="text-danger fw-bold small mb-1">฿ {prod.recompensa.toLocaleString('es-CL')}</p>
                <p className="text-success fw-bold fs-5 mb-2">${prod.precio.toLocaleString('es-CL')}</p>
                <div className="mt-auto d-flex gap-2">
                  <Link to={`/producto/${prod.id}`} className="btn btn-outline-dark btn-sm w-50 fw-bold">
                    Ver Detalle
                  </Link>
                  <button 
                    className="btn btn-dark btn-sm w-50 fw-bold" 
                    disabled={prod.stock === 0}
                    onClick={() => agregarAlCarrito(prod)}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorias;