// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { autenticarUsuario, validarCorreoDuoc } from '../database';

const Login = ({ onLoginSuccess }) => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCorreoDuoc(correo)) {
      setError('El correo debe pertenecer al dominio @duocuc.cl o @duoc.cl');
      return;
    }

    const resultado = autenticarUsuario(correo, password);

    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }

    setError('');
    onLoginSuccess(resultado.usuario);

    if (resultado.usuario.rol === 'admin') {
      navigate('/admin');
    } else {
      navigate('/perfil');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow p-4 border-0">
          <h3 className="text-center mb-2 fw-bold">Iniciar Sesión</h3>
          <p className="text-muted text-center small mb-4">
            Ingresa con tu correo institucional para gestionar tus pedidos y perfil.
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-bold">Correo Institucional</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="usuario@duocuc.cl"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
              <div className="form-text">Solo se admiten cuentas @duocuc.cl y @duoc.cl</div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100 fw-bold py-2">
              Ingresar
            </button>
          </form>

          <hr className="my-4" />
          <p className="text-center small mb-0">
            ¿Aún no tienes cuenta? <Link to="/registro" className="fw-bold">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;