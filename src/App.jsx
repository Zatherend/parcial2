// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Carrito from './components/Carrito';
import Checkout from './components/Checkout';
import PagoExitoso from './components/PagoExitoso';
import PagoError from './components/PagoError';
import Admin from './components/Admin';
import Login from './components/Login';
import Registro from './components/Registro';
import Perfil from './components/Perfil';
import AlertaPersonalizada from './components/AlertaPersonalizada';
import Blogs from './components/Blogs';
import Nosotros from './components/Nosotros';
import Contacto from './components/Contacto';
import Categorias from './components/Categorias';
import Ofertas from './components/Ofertas';
import DetalleProducto from './components/DetalleProducto';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [alerta, setAlerta] = useState(null);

  const mostrarAlerta = (mensaje, tipo = 'success', titulo = 'Notificación') => {
    setAlerta({ mensaje, tipo, titulo });
    setTimeout(() => {
      setAlerta(null);
    }, 3500);
  };

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    mostrarAlerta(`Se añadió "${producto.nombre}" a tu carrito.`, 'success', '🛒 Carrito Actualizado');
  };

  const actualizarCantidad = (id, cantidad) => {
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad } : item));
    mostrarAlerta('Cantidad actualizada en el carrito.', 'info', 'Carrito');
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
    mostrarAlerta('Póster eliminado del carrito.', 'warning', 'Carrito');
  };

  const limpiarCarrito = () => setCarrito([]);

  return (
    <Router>
      <Navbar 
        carrito={carrito} 
        usuarioActual={usuarioActual} 
        cerrarSesion={() => {
          setUsuarioActual(null);
          mostrarAlerta('Has cerrado tu sesión correctamente.', 'info', 'Sesión Cerrada');
        }} 
      />
      
      <AlertaPersonalizada alerta={alerta} cerrarAlerta={() => setAlerta(null)} />

      <div className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} actualizarCantidad={actualizarCantidad} eliminarDelCarrito={eliminarDelCarrito} />} />
          <Route path="/checkout" element={<Checkout carrito={carrito} limpiarCarrito={limpiarCarrito} usuarioActual={usuarioActual} mostrarAlerta={mostrarAlerta} />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-error" element={<PagoError />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto mostrarAlerta={mostrarAlerta} />} />
          <Route path="/categorias" element={<Categorias agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/ofertas" element={<Ofertas agregarAlCarrito={agregarAlCarrito} />} />
          <Route path="/producto/:id" element={<DetalleProducto agregarAlCarrito={agregarAlCarrito} />} />
          
          <Route path="/login" element={
            <Login onLoginSuccess={(usuario) => {
              setUsuarioActual(usuario);
              mostrarAlerta(`¡Bienvenido de vuelta, ${usuario.nombre}!`, 'success', 'Sesión Iniciada');
            }} />
          } />

          <Route path="/registro" element={
            <Registro onRegisterSuccess={(nuevoUsuario) => {
              setUsuarioActual(nuevoUsuario);
              mostrarAlerta(`¡Cuenta creada con éxito! Bienvenido, ${nuevoUsuario.nombre}.`, 'success', 'Registro Completado');
            }} />
          } />

          <Route path="/perfil" element={
            <Perfil 
              usuarioActual={usuarioActual} 
              actualizarEstadoUsuario={setUsuarioActual} 
              mostrarAlerta={mostrarAlerta} 
            />
          } />

          <Route path="/admin" element={
            <Admin 
              isAdmin={usuarioActual?.rol === 'admin'} 
              mostrarAlerta={mostrarAlerta} 
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;