// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../database';

const Home = ({ agregarAlCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [ordenRecompensa, setOrdenRecompensa] = useState('mayor');

  useEffect(() => {
    setProductos(obtenerProductos());
  }, []);

  // Filtrar por búsqueda y ordenar por recompensa o precio
  const productosFiltrados = productos
    .filter((prod) => prod.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (ordenRecompensa === 'mayor') return b.recompensa - a.recompensa;
      if (ordenRecompensa === 'menor') return a.recompensa - b.recompensa;
      if (ordenRecompensa === 'precio-mayor') return b.precio - a.precio;
      if (ordenRecompensa === 'precio-menor') return a.precio - b.precio;
      return 0;
    });

  return (
    <div>
      {/* Banner Principal */}
      <div className="p-5 mb-4 bg-dark text-white rounded-3 text-center shadow" style={{ border: '3px solid #d4af37' }}>
        <h1 className="display-5 fw-bold text-warning">🏴‍☠️ TIENDA DE RECOMPENSAS DEL NUEVO MUNDO</h1>
        <p className="col-md-8 fs-5 mx-auto text-light">
          Colecciona los carteles "WANTED" oficiales emitidos por la Marina. ¡Haz clic en cualquier cartel para ver su ficha completa!
        </p>
      </div>

      {/* Controles de Búsqueda y Ordenamiento por Recompensa */}
      <div className="row mb-4 align-items-center bg-light p-3 rounded shadow-sm">
        <div className="col-md-6 mb-2 mb-md-0">
          <input 
            type="text" 
            className="form-control" 
            placeholder="🔍 Buscar pirata (ej: Luffy, Zoro, Roger)..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-md-end gap-2">
          <label className="fw-bold text-nowrap">Ordenar por:</label>
          <select 
            className="form-select w-auto" 
            value={ordenRecompensa} 
            onChange={(e) => setOrdenRecompensa(e.target.value)}
          >
            <option value="mayor">🔥 Mayor a Menor Recompensa (Berries)</option>
            <option value="menor">🌱 Menor a Mayor Recompensa (Berries)</option>
            <option value="precio-menor">💲 Precio: Menor a Mayor</option>
            <option value="precio-mayor">💰 Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Catálogo de Carteles Wanted Clickeables */}
      <div className="row">
        {productosFiltrados.map((prod) => (
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={prod.id}>
            <div 
              className="card h-100 shadow position-relative" 
              style={{ backgroundColor: '#f4e4bc', border: '4px solid #8b6914', transition: 'transform 0.2s' }}
            >
              {/* Alerta Visual de Stock Crítico (<= 5) */}
              {prod.stock <= 5 && prod.stock > 0 && (
                <span className="badge bg-danger position-absolute top-0 end-0 m-2 shadow" style={{ zIndex: 2 }}>
                  ⚠️ ¡Stock Crítico: {prod.stock}!
                </span>
              )}
              {prod.stock === 0 && (
                <span className="badge bg-secondary position-absolute top-0 end-0 m-2 shadow" style={{ zIndex: 2 }}>
                  ❌ Agotado
                </span>
              )}

              {/* Enlace clickeable en el encabezado e imagen del póster */}
              <Link 
                to={`/producto/${prod.id}`} 
                className="text-decoration-none"
                title={`Ver página de muestra de ${prod.nombre}`}
              >
                <div className="text-center pt-2">
                  <h4 className="fw-bold mb-0" style={{ fontFamily: 'serif', letterSpacing: '3px', color: '#3d2b1f' }}>
                    WANTED
                  </h4>
                </div>

                <img 
                  src={prod.imagen} 
                  className="card-img-top px-3 pt-1" 
                  alt={prod.nombre} 
                  style={{ height: '210px', objectFit: 'contain', cursor: 'pointer' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=WANTED' }} 
                />
              </Link>

              <div className="card-body d-flex flex-column text-center">
                <small className="fw-bold text-uppercase" style={{ color: '#5c4033' }}>DEAD OR ALIVE</small>
                
                {/* Título clickeable que lleva a la página de muestra */}
                <Link to={`/producto/${prod.id}`} className="text-decoration-none">
                  <h5 className="card-title fw-bold mt-1" style={{ color: '#2b1d0e', cursor: 'pointer' }}>
                    {prod.nombre}
                  </h5>
                </Link>

                <p className="card-text small text-muted mb-2">{prod.descripcion}</p>
                
                <div className="mt-auto">
                  <div className="p-1 mb-2 rounded" style={{ backgroundColor: '#e6d2a0', border: '1px solid #8b6914' }}>
                    <small className="d-block text-dark fw-bold">RECOMPENSA (BOUNTY):</small>
                    <span className="fw-bold text-danger">฿ {prod.recompensa.toLocaleString('es-CL')}</span>
                  </div>

                  <p className="text-success fw-bold fs-5 mb-1">
                    Precio: ${prod.precio.toLocaleString('es-CL')}
                  </p>
                  <small className="d-block text-muted mb-2">Stock disponible: {prod.stock}</small>

                  {/* Botones de Acción: Ver Muestra y Añadir al Carrito */}
                  <div className="d-flex gap-2">
                    <Link 
                      to={`/producto/${prod.id}`} 
                      className="btn btn-outline-dark btn-sm w-50 fw-bold d-flex align-items-center justify-content-center"
                    >
                      🔍 Ver Póster
                    </Link>
                    <button 
                      className="btn btn-dark btn-sm w-50 fw-bold" 
                      disabled={prod.stock === 0}
                      onClick={() => agregarAlCarrito(prod)}
                    >
                      {prod.stock === 0 ? 'Agotado' : '🛒 Añadir'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;