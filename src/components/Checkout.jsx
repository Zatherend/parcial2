// src/components/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarCompra, validarCorreoDuoc } from '../database';

const Checkout = ({ carrito = [], limpiarCarrito, usuarioActual, mostrarAlerta }) => {
  const navigate = useNavigate();
  const [errorCorreo, setErrorCorreo] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    depto: '',
    comuna: 'Santiago'
  });

  // Autocompletar si el usuario ha iniciado sesión (Requisito de las instrucciones)
  useEffect(() => {
    if (usuarioActual) {
      setFormData({
        nombre: usuarioActual.nombre || '',
        apellidos: usuarioActual.apellidos || '',
        correo: usuarioActual.correo || '',
        calle: usuarioActual.calle || '',
        depto: usuarioActual.depto || '',
        comuna: usuarioActual.comuna || 'Santiago'
      });
    }
  }, [usuarioActual]);

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarCorreoDuoc(formData.correo)) {
      setErrorCorreo('El correo para la boleta debe ser exclusivamente @duocuc.cl o @duoc.cl');
      if (mostrarAlerta) {
        mostrarAlerta('Usa un correo institucional (@duocuc.cl o @duoc.cl).', 'danger', 'Correo Inválido');
      }
      return;
    }

    setErrorCorreo('');

    // Si escribe por ejemplo "error@duocuc.cl", simulamos pago con error
    const esError = formData.correo.toLowerCase().includes('error');
    
    if (esError) {
      if (mostrarAlerta) {
        mostrarAlerta('No se pudo realizar el pago. Revisa tus datos.', 'danger', 'Error de Pago');
      }
      navigate('/pago-error', { state: { formData, carrito, total } });
    } else {
      const ordenGuardada = registrarCompra({
        cliente: formData,
        items: carrito,
        total
      });
      limpiarCarrito();
      if (mostrarAlerta) {
        mostrarAlerta(`¡Compra ${ordenGuardada.idOrden} exitosa! Guardada en tu perfil.`, 'success', 'Pago Confirmado');
      }
      navigate('/pago-exitoso', { state: { formData, carrito, total, nroOrden: ordenGuardada.idOrden } });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold">💳 Checkout - Paso de Pago</h2>
      {usuarioActual && (
        <div className="alert alert-info py-2 small">
          ✅ Tus datos de perfil (<strong>{usuarioActual.correo}</strong>) se han autocompletado automáticamente.
        </div>
      )}

      {errorCorreo && (
        <div className="alert alert-danger">{errorCorreo}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-3 card p-4 shadow-sm" noValidate>
        <h4>Información del cliente</h4>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Nombre *</label>
            <input type="text" className="form-control" name="nombre" required value={formData.nombre} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Apellidos *</label>
            <input type="text" className="form-control" name="apellidos" required value={formData.apellidos} onChange={handleChange} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">
            Correo Institucional (@duocuc.cl o @duoc.cl) * {' '}
            <small className="text-muted">(Usa error@duocuc.cl si deseas probar la pantalla de fallo de pago)</small>
          </label>
          <input type="email" className="form-control" name="correo" required value={formData.correo} onChange={handleChange} />
        </div>

        <h4 className="mt-3">Dirección de entrega de los productos</h4>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Calle y número *</label>
            <input type="text" className="form-control" name="calle" required value={formData.calle} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Departamento (Opcional)</label>
            <input type="text" className="form-control" name="depto" value={formData.depto} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Comuna *</label>
            <input type="text" className="form-control" name="comuna" required value={formData.comuna} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 py-2 mt-3 fw-bold fs-5">
          Pagar ahora ${total.toLocaleString('es-CL')}
        </button>
      </form>
    </div>
  );
};

export default Checkout;