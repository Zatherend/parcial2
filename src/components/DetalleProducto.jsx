// src/components/DetalleProducto.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerProductos } from '../database';

const DetalleProducto = ({ agregarAlCarrito }) => {
  const { id } = useParams();
  const todosLosProductos = obtenerProductos();
  const producto = todosLosProductos.find(p => p.id === parseInt(id));

  if (!producto) {
    return (
      <div className="container mt-5 text-center">
        <h3>Póster no encontrado</h3>
        <Link to="/" className="btn btn-dark mt-3">Volver al Catálogo</Link>
      </div>
    );
  }

  // Carteles relacionados de la misma facción/categoría
  const relacionados = todosLosProductos
    .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-outline-dark mb-4 fw-bold">
        ← Volver al Catálogo Principal
      </Link>

      {/* Ficha Principal de Muestra del Póster */}
      <div className="card shadow-lg border-0 p-4 mb-5" style={{ backgroundColor: '#fdfbf7' }}>
        <div className="row align-items-center">
          {/* Vista Grande del Cartel Wanted */}
          <div className="col-md-5 text-center mb-4 mb-md-0">
            <div 
              className="p-4 rounded shadow d-inline-block w-100" 
              style={{ backgroundColor: '#f4e4bc', border: '6px solid #8b6914', maxWidth: '360px' }}
            >
              <h2 className="fw-bold mb-2" style={{ fontFamily: 'serif', letterSpacing: '5px', color: '#3d2b1f' }}>
                WANTED
              </h2>
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="img-fluid border border-dark p-1 bg-white" 
                style={{ maxHeight: '340px', objectFit: 'contain' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x350?text=WANTED' }} 
              />
              <h4 className="fw-bold mt-2 mb-1" style={{ fontFamily: 'serif', color: '#3d2b1f' }}>
                DEAD OR ALIVE
              </h4>
              <div className="fw-bold text-danger fs-5">
                ฿ {producto.recompensa.toLocaleString('es-CL')}
              </div>
            </div>
          </div>

          {/* Información Detallada y Compra */}
          <div className="col-md-7">
            <div className="mb-2">
              <span className="badge bg-dark fs-6">{producto.categoria}</span>
              {producto.stock <= 5 && producto.stock > 0 && (
                <span className="badge bg-danger ms-2 fs-6">
                  ⚠️ ¡Stock Crítico: Solo quedan {producto.stock} unidades!
                </span>
              )}
              {producto.stock === 0 && (
                <span className="badge bg-secondary ms-2 fs-6">❌ Agotado</span>
              )}
            </div>

            <h1 className="fw-bold display-6 mt-2">{producto.nombre}</h1>
            <h4 className="text-danger fw-bold my-3">
              Recompensa Oficial (Bounty): ฿ {producto.recompensa.toLocaleString('es-CL')}
            </h4>

            <p className="fs-5 text-secondary">{producto.descripcion}</p>

            <div className="p-3 bg-light rounded border mb-4">
              <h6 className="fw-bold mb-2">📜 Especificaciones del Cartel de Colección:</h6>
              <ul className="mb-0 small text-secondary">
                <li><strong>Material:</strong> Papel pergamino texturizado de alto gramaje (250g).</li>
                <li><strong>Dimensiones:</strong> 42 x 29.7 cm (Formato A3 Oficial).</li>
                <li><strong>Acabado:</strong> Impresión láser de alta definición resistente a la humedad.</li>
                <li><strong>Empaque:</strong> Tubo rígido protector para envío a todo Chile.</li>
              </ul>
            </div>

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pt-2 border-top">
              <div>
                <span className="text-muted small d-block">Precio Oficial:</span>
                <h2 className="text-success fw-bold mb-0">
                  ${producto.precio.toLocaleString('es-CL')}
                </h2>
                <small className="text-muted">Unidades en inventario: <strong>{producto.stock}</strong></small>
              </div>

              <button 
                className="btn btn-dark btn-lg fw-bold px-5 py-3 shadow-sm"
                disabled={producto.stock === 0}
                onClick={() => agregarAlCarrito(producto)}
              >
                {producto.stock === 0 ? 'Sin Stock Disponible' : '🛒 Añadir al Carrito'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carteles Relacionados */}
      {relacionados.length > 0 && (
        <div className="mt-4">
          <h4 className="fw-bold mb-3">🏴‍☠️ Otros Carteles de la facción "{producto.categoria}"</h4>
          <div className="row">
            {relacionados.map((rel) => (
              <div className="col-6 col-md-3 mb-3" key={rel.id}>
                <div className="card h-100 shadow-sm text-center p-2" style={{ backgroundColor: '#f4e4bc', border: '2px solid #8b6914' }}>
                  <Link to={`/producto/${rel.id}`} className="text-decoration-none text-dark">
                    <img 
                      src={rel.imagen} 
                      alt={rel.nombre} 
                      style={{ height: '130px', objectFit: 'contain' }} 
                      className="card-img-top p-2"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=WANTED' }}
                    />
                    <h6 className="fw-bold mb-1">{rel.nombre}</h6>
                  </Link>
                  <small className="text-success fw-bold mb-2">${rel.precio.toLocaleString('es-CL')}</small>
                  <Link to={`/producto/${rel.id}`} className="btn btn-outline-dark btn-sm mt-auto">
                    Ver Muestra
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleProducto;