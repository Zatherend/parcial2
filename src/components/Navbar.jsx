// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ carrito = [], usuarioActual, cerrarSesion }) => {
  const navigate = useNavigate();
  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const montoTotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const handleLogout = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow px-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-warning d-flex align-items-center gap-2" to="/">
          🏴‍☠️ Grand Line Posters
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categorias">Categorías</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-warning fw-bold" to="/ofertas">🔥 Ofertas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blogs">Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
            {usuarioActual && (
              <li className="nav-item">
                <Link className="nav-link text-info fw-bold" to="/perfil">
                  👤 Mi Perfil y Compras
                </Link>
              </li>
            )}
            {usuarioActual?.rol === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-bold" to="/admin">
                  ⚙️ Panel Admin
                </Link>
              </li>
            )}
            
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {usuarioActual ? (
              <>
                <Link to="/perfil" className="btn btn-outline-light btn-sm">
                  Hola, <strong>{usuarioActual.nombre}</strong> ({usuarioActual.rol})
                </Link>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Iniciar Sesión
                </Link>
                <Link className="btn btn-primary btn-sm fw-bold" to="/registro">
                  Crear Cuenta
                </Link>
              </>
            )}

            <Link className="btn btn-success btn-sm fw-bold" to="/carrito">
              🛒 Carrito ({totalUnidades}) - ${montoTotal.toLocaleString('es-CL')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;