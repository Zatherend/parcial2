// src/components/Registro.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario, validarCorreoDuoc } from '../database';

const Registro = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    calle: '',
    depto: '',
    comuna: 'Santiago'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCorreoDuoc(formData.correo)) {
      setError('Correo inválido. Debes registrarte exclusivamente con un correo @duocuc.cl o @duoc.cl');
      return;
    }

    if (formData.password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const resultado = registrarUsuario(formData);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }

    setError('');
    onRegisterSuccess(resultado.usuario);
    navigate('/perfil');
  };

  return (
    <div className="row justify-content-center mt-4">
      <div className="col-md-7">
        <div className="card shadow p-4 border-0">
          <h3 className="fw-bold text-center mb-2">Crear Cuenta</h3>
          <p className="text-muted text-center small mb-4">
            Regístrate con tu correo de Duoc UC para guardar tus direcciones y revisar tu historial de compras.
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Nombre *</label>
                <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Apellidos *</label>
                <input type="text" className="form-control" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Correo Institucional *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="correo" 
                  placeholder="nombre@duocuc.cl" 
                  value={formData.correo} 
                  onChange={handleChange} 
                  required 
                />
                <div className="form-text">Solo dominios @duocuc.cl o @duoc.cl</div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Contraseña *</label>
                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            <h5 className="mt-3 mb-2 fw-bold">Dirección de Envío Predeterminada</h5>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Calle y Número *</label>
                <input type="text" className="form-control" name="calle" value={formData.calle} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Depto (Opcional)</label>
                <input type="text" className="form-control" name="depto" value={formData.depto} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Comuna *</label>
                <input type="text" className="form-control" name="comuna" value={formData.comuna} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mt-2">
              Registrarme
            </button>
          </form>

          <hr className="my-3" />
          <p className="text-center small mb-0">
            ¿Ya tienes una cuenta? <Link to="/login" className="fw-bold">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;