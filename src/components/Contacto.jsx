// src/components/Contacto.jsx
import React, { useState } from 'react';
import { validarCorreoDuoc } from '../database';

const CORREO_DESTINO_EMPRESA = "maxim.alvarez@duocuc.cl"; // Puedes cambiarlo por el correo que desees recibir

const Contacto = ({ mostrarAlerta }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCorreoDuoc(formData.correo)) {
      setError('Por favor ingresa un correo válido con dominio @duocuc.cl o @duoc.cl');
      return;
    }

    if (formData.mensaje.trim().length < 10) {
      setError('El mensaje debe contener al menos 10 caracteres.');
      return;
    }

    setError('');

    // Construir el enlace mailto: con los datos del formulario codificados
    const subject = encodeURIComponent(`[Contacto Grand Line Posters] ${formData.asunto}`);
    const body = encodeURIComponent(
      `Hola equipo de Grand Line Posters,\n\n` +
      `Tienen un nuevo mensaje desde el formulario web:\n` +
      `--------------------------------------------------\n` +
      `Nombre: ${formData.nombre}\n` +
      `Correo del remitente: ${formData.correo}\n` +
      `Asunto: ${formData.asunto}\n` +
      `--------------------------------------------------\n\n` +
      `Mensaje:\n${formData.mensaje}\n`
    );

    // Abrir el cliente de correo predeterminado del usuario con el mensaje transferido
    window.location.href = `mailto:${CORREO_DESTINO_EMPRESA}?subject=${subject}&body=${body}`;

    if (mostrarAlerta) {
      mostrarAlerta('Abriendo tu aplicación de correo con el mensaje listo para enviar.', 'success', 'Correo Preparado');
    }

    setFormData({ nombre: '', correo: '', asunto: '', mensaje: '' });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Información de Contacto Lateral */}
        <div className="col-md-5 mb-4">
          <div className="card h-100 bg-dark text-white p-4 shadow border-0">
            <h3 className="fw-bold text-warning mb-3">📬 Contáctanos</h3>
            <p className="text-light small mb-4">
              ¿Buscas un cartel de recompensa personalizado o tienes dudas con tu despacho? Escríbenos y nuestro Den Den Mushi transferirá tu mensaje directamente a nuestro correo.
            </p>

            <div className="mb-3">
              <h6 className="fw-bold text-warning mb-1">📍 Dirección</h6>
              <p className="small mb-0">Av. Vicuña Mackenna 4917, San Joaquín, Santiago.</p>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold text-warning mb-1">📧 Correo de Destino</h6>
              <p className="small mb-0">{CORREO_DESTINO_EMPRESA}</p>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold text-warning mb-1">📞 Teléfono</h6>
              <p className="small mb-0">+56 9 8765 4321</p>
            </div>

            <div className="mt-auto pt-3 border-top border-secondary">
              <small className="text-muted">
                Al enviar el formulario se abrirá tu gestor de correo predeterminado (Mail, Outlook o Gmail) con los datos cargados.
              </small>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="col-md-7 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="fw-bold mb-3">Envíanos un Mensaje</h4>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-bold">Tu Nombre Completo *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="nombre" 
                  placeholder="Ej: Maximiliano Álvarez"
                  value={formData.nombre} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Tu Correo Institucional (@duocuc.cl o @duoc.cl) *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="correo" 
                  placeholder="usuario@duocuc.cl"
                  value={formData.correo} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Asunto *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="asunto" 
                  placeholder="Ej: Consulta sobre stock de póster de Shanks"
                  value={formData.asunto} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Mensaje *</label>
                <textarea 
                  className="form-control" 
                  name="mensaje" 
                  rows="4" 
                  placeholder="Escribe aquí los detalles de tu solicitud..."
                  value={formData.mensaje} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>

              <button type="submit" className="btn btn-dark w-100 fw-bold py-2">
                ✉️ Redactar y Enviar al Correo
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;