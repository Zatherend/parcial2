// src/components/Admin.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  obtenerProductos, 
  agregarProducto, 
  actualizarProducto, 
  eliminarProducto,
  obtenerHistorial,
  obtenerUsuarios
} from '../database';

const Admin = ({ isAdmin, mostrarAlerta }) => {
  const [pestana, setPestana] = useState('dashboard');
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarSoloCriticos, setMostrarSoloCriticos] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);

  const [formProducto, setFormProducto] = useState({
    nombre: '',
    recompensa: '',
    precio: '',
    stock: '',
    categoria: 'Mugiwara',
    descripcion: '',
    imagen: ''
  });

  useEffect(() => {
    setProductos(obtenerProductos());
    setOrdenes(obtenerHistorial());
    setUsuarios(obtenerUsuarios());
  }, [pestana]);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const productosCriticos = productos.filter(p => p.stock <= 5);
  const listaMostrar = mostrarSoloCriticos ? productosCriticos : productos;

  // =========================================================================
  // FUNCIONES DE EXPORTACIÓN A EXCEL (CSV) Y PDF
  // =========================================================================

  // 1. Exportar Inventario de Productos Restantes a Excel (.csv)
  const exportarProductosExcel = () => {
    const encabezados = ['ID', 'Nombre del Poster', 'Categoria', 'Recompensa (Berries)', 'Precio (CLP)', 'Stock Restante', 'Estado'];
    const filas = listaMostrar.map(p => [
      p.id,
      `"${p.nombre.replace(/"/g, '""')}"`,
      `"${p.categoria}"`,
      p.recompensa,
      p.precio,
      p.stock,
      p.stock === 0 ? 'Agotado' : p.stock <= 5 ? 'CRITICO' : 'Normal'
    ]);

    const contenidoCSV = '\uFEFF' + [encabezados.join(';'), ...filas.map(f => f.join(';'))].join('\n');
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Reporte_Inventario_Productos_${new Date().toLocaleDateString('es-CL')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (mostrarAlerta) {
      mostrarAlerta('Inventario de productos exportado a Excel (.csv) correctamente.', 'success', 'Exportación Exitosa');
    }
  };

  // 2. Exportar Inventario de Productos Restantes a PDF
  const exportarProductosPDF = () => {
    const ventana = window.open('', '_blank', 'width=900,height=700');
    const filasHTML = listaMostrar.map(p => `
      <tr>
        <td style="text-align:center;">${p.id}</td>
        <td><strong>${p.nombre}</strong></td>
        <td>${p.categoria}</td>
        <td style="text-align:right;">$${p.precio.toLocaleString('es-CL')}</td>
        <td style="text-align:center; font-weight:bold; color:${p.stock <= 5 ? '#dc3545' : '#198754'};">${p.stock}</td>
        <td style="text-align:center;">${p.stock === 0 ? 'Agotado' : p.stock <= 5 ? 'STOCK CRÍTICO' : 'Disponible'}</td>
      </tr>
    `).join('');

    ventana.document.write(`
      <html>
        <head>
          <title>Reporte de Productos Restantes - Grand Line Posters</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; color: #222; }
            h2 { margin-bottom: 5px; }
            p { color: #555; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ccc; padding: 8px 10px; font-size: 13px; }
            th { background-color: #212529; color: #fff; text-align: left; }
          </style>
        </head>
        <body>
          <h2>🏴‍☠️ Grand Line Posters — Reporte de Stock e Inventario</h2>
          <p>Fecha de emisión: ${new Date().toLocaleString('es-CL')} | Total de productos listados: ${listaMostrar.length}</p>
          <table>
            <thead>
              <tr>
                <th style="text-align:center;">ID</th>
                <th>Nombre del Póster</th>
                <th>Categoría</th>
                <th style="text-align:right;">Precio Unitario</th>
                <th style="text-align:center;">Stock Restante</th>
                <th style="text-align:center;">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filasHTML}
            </tbody>
          </table>
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => {
      ventana.print();
    }, 300);
  };

  // 3. Exportar Historial de Compras Hechas a Excel (.csv)
  const exportarComprasExcel = () => {
    if (ordenes.length === 0) {
      if (mostrarAlerta) mostrarAlerta('No hay compras registradas para exportar.', 'warning', 'Sin Datos');
      return;
    }

    const encabezados = ['Nro Orden', 'Fecha', 'Cliente', 'Correo Duoc', 'Direccion', 'Comuna', 'Detalle Productos', 'Total Pagado (CLP)'];
    const filas = ordenes.map(o => {
      const resumenItems = o.items.map(i => `${i.nombre} (x${i.cantidad})`).join(' | ');
      return [
        `"${o.idOrden}"`,
        `"${o.fecha}"`,
        `"${o.cliente.nombre} ${o.cliente.apellidos}"`,
        `"${o.cliente.correo}"`,
        `"${o.cliente.calle} ${o.cliente.depto || ''}"`,
        `"${o.cliente.comuna}"`,
        `"${resumenItems.replace(/"/g, '""')}"`,
        o.total
      ];
    });

    const contenidoCSV = '\uFEFF' + [encabezados.join(';'), ...filas.map(f => f.join(';'))].join('\n');
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Reporte_Historial_Compras_${new Date().toLocaleDateString('es-CL')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (mostrarAlerta) {
      mostrarAlerta('Historial de compras exportado a Excel (.csv) correctamente.', 'success', 'Exportación Exitosa');
    }
  };

  // 4. Exportar Historial de Compras Hechas a PDF
  const exportarComprasPDF = () => {
    if (ordenes.length === 0) {
      if (mostrarAlerta) mostrarAlerta('No hay compras registradas para exportar.', 'warning', 'Sin Datos');
      return;
    }

    const totalRecaudado = ordenes.reduce((acc, o) => acc + o.total, 0);
    const ventana = window.open('', '_blank', 'width=950,height=700');
    const filasHTML = ordenes.map(o => {
      const detalleItems = o.items.map(i => `${i.nombre} (x${i.cantidad})`).join('<br/>');
      return `
        <tr>
          <td><strong>${o.idOrden}</strong></td>
          <td>${o.fecha}</td>
          <td>${o.cliente.nombre} ${o.cliente.apellidos}<br/><small>${o.cliente.correo}</small></td>
          <td>${o.cliente.calle}, ${o.cliente.comuna}</td>
          <td>${detalleItems}</td>
          <td style="text-align:right; font-weight:bold;">$${o.total.toLocaleString('es-CL')}</td>
        </tr>
      `;
    }).join('');

    ventana.document.write(`
      <html>
        <head>
          <title>Reporte de Historial de Compras - Grand Line Posters</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; color: #222; }
            h2 { margin-bottom: 5px; }
            p { color: #555; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ccc; padding: 8px 10px; font-size: 12px; vertical-align: top; }
            th { background-color: #212529; color: #fff; text-align: left; }
            .resumen { margin-top: 15px; text-align: right; font-size: 16px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>🏴‍☠️ Grand Line Posters — Historial General de Compras Realizadas</h2>
          <p>Fecha de emisión: ${new Date().toLocaleString('es-CL')} | Total de órdenes: ${ordenes.length}</p>
          <table>
            <thead>
              <tr>
                <th>N° Orden</th>
                <th>Fecha</th>
                <th>Cliente / Correo</th>
                <th>Dirección de Envío</th>
                <th>Productos Comprados</th>
                <th style="text-align:right;">Total Pagado</th>
              </tr>
            </thead>
            <tbody>
              ${filasHTML}
            </tbody>
          </table>
          <div class="resumen">Total Recaudado en Ventas: $${totalRecaudado.toLocaleString('es-CL')}</div>
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => {
      ventana.print();
    }, 300);
  };

  // =========================================================================
  // MANEJADORES CRUD DE PRODUCTOS
  // =========================================================================

  const handleChange = (e) => {
    setFormProducto({ ...formProducto, [e.target.name]: e.target.value });
  };

  const handleImagenUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormProducto((prev) => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarProducto = (e) => {
    e.preventDefault();
    if (editandoId) {
      actualizarProducto(editandoId, {
        ...formProducto,
        precio: Number(formProducto.precio),
        recompensa: Number(formProducto.recompensa),
        stock: Number(formProducto.stock)
      });
      setEditandoId(null);
      if (mostrarAlerta) mostrarAlerta('Póster actualizado correctamente.', 'info', 'Producto Editado');
    } else {
      agregarProducto({
        ...formProducto,
        imagen: formProducto.imagen || '/src/img/luffy.webp'
      });
      if (mostrarAlerta) mostrarAlerta('Nuevo póster Wanted agregado al catálogo.', 'success', 'Producto Creado');
    }

    setProductos(obtenerProductos());
    setFormProducto({ nombre: '', recompensa: '', precio: '', stock: '', categoria: 'Mugiwara', descripcion: '', imagen: '' });
  };

  const cargarParaEditar = (prod) => {
    setEditandoId(prod.id);
    setFormProducto({
      nombre: prod.nombre,
      recompensa: prod.recompensa,
      precio: prod.precio,
      stock: prod.stock,
      categoria: prod.categoria,
      descripcion: prod.descripcion,
      imagen: prod.imagen
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = (id, nombre) => {
    const actualizada = eliminarProducto(id);
    setProductos([...actualizada]);
    if (mostrarAlerta) mostrarAlerta(`Se eliminó "${nombre}" del inventario.`, 'warning', 'Producto Eliminado');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">⚙️ Sistema Administrativo - Marina HQ</h2>
        <div className="btn-group">
          <button className={`btn ${pestana === 'dashboard' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`btn ${pestana === 'productos' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('productos')}>
            📦 Productos ({productos.length})
          </button>
          <button className={`btn ${pestana === 'ordenes' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('ordenes')}>
            🧾 Órdenes / Boletas ({ordenes.length})
          </button>
          <button className={`btn ${pestana === 'usuarios' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPestana('usuarios')}>
            👥 Usuarios ({usuarios.length})
          </button>
        </div>
      </div>

      {/* ALERTA PERMANENTE DE PRODUCTOS CRÍTICOS */}
      {productosCriticos.length > 0 && (
        <div className="alert alert-danger shadow-sm d-flex justify-content-between align-items-center">
          <div>
            <strong>🚨 ¡Alerta de Stock Crítico!</strong> Hay <strong>{productosCriticos.length} productos</strong> con 5 o menos unidades.
          </div>
          <button 
            className="btn btn-sm btn-danger fw-bold"
            onClick={() => { setPestana('productos'); setMostrarSoloCriticos(true); }}
          >
            Ver Productos Críticos
          </button>
        </div>
      )}

      {/* PESTAÑA 1: DASHBOARD Y REPORTES RÁPIDOS */}
      {pestana === 'dashboard' && (
        <div>
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card bg-primary text-white p-4 shadow-sm border-0">
                <h3>🛒 Compras / Órdenes</h3>
                <h1 className="fw-bold display-5">{ordenes.length}</h1>
                <small>Órdenes procesadas en el sistema</small>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-success text-white p-4 shadow-sm border-0">
                <h3>📦 Productos</h3>
                <h1 className="fw-bold display-5">{productos.length}</h1>
                <small>Críticos actuales: {productosCriticos.length}</small>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-warning text-dark p-4 shadow-sm border-0">
                <h3>👥 Usuarios</h3>
                <h1 className="fw-bold display-5">{usuarios.length}</h1>
                <small>Cuentas registradas con correo Duoc</small>
              </div>
            </div>
          </div>

          {/* Centro de Descarga de Reportes (Figura 9 y 10: Módulo Reportes) */}
          <div className="card p-4 shadow-sm border-dark mb-4 bg-light">
            <h5 className="fw-bold mb-3">📈 Centro de Exportación de Reportes (PDF y Excel)</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 bg-white border rounded">
                  <h6 className="fw-bold mb-2">📦 Reporte de Productos Restantes (ID y Stock)</h6>
                  <p className="small text-muted mb-3">Descarga la nómina actual de carteles con su ID, precio, unidades restantes y estado de stock crítico.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm fw-bold" onClick={exportarProductosExcel}>
                      📊 Exportar Stock a Excel (.CSV)
                    </button>
                    <button className="btn btn-danger btn-sm fw-bold" onClick={exportarProductosPDF}>
                      📄 Exportar Stock a PDF
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-white border rounded">
                  <h6 className="fw-bold mb-2">🧾 Reporte de Historial de Compras Realizadas</h6>
                  <p className="small text-muted mb-3">Descarga todas las órdenes emitidas con datos del comprador, productos adquiridos y total pagado.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm fw-bold" onClick={exportarComprasExcel}>
                      📊 Exportar Compras a Excel (.CSV)
                    </button>
                    <button className="btn btn-danger btn-sm fw-bold" onClick={exportarComprasPDF}>
                      📄 Exportar Compras a PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: PRODUCTOS CRUD + EXPORTACIÓN DE STOCK */}
      {pestana === 'productos' && (
        <div>
          <div className="card p-4 mb-4 shadow-sm border-dark">
            <h4 className="fw-bold mb-3">
              {editandoId ? `✏️ Editando Producto ID #${editandoId}` : '➕ Añadir Nuevo Cartel de Recompensa'}
            </h4>
            <form onSubmit={handleGuardarProducto} className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Nombre del Póster</label>
                <input type="text" className="form-control" name="nombre" value={formProducto.nombre} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">Recompensa (฿)</label>
                <input type="number" className="form-control" name="recompensa" value={formProducto.recompensa} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">Precio ($)</label>
                <input type="number" className="form-control" name="precio" value={formProducto.precio} onChange={handleChange} required />
              </div>
              <div className="col-md-1">
                <label className="form-label fw-bold">Stock</label>
                <input type="number" className="form-control" name="stock" value={formProducto.stock} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">Categoría</label>
                <input type="text" className="form-control" name="categoria" value={formProducto.categoria} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">📸 Cargar Imagen desde Mac</label>
                <input type="file" accept="image/*" className="form-control" onChange={handleImagenUpload} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Descripción</label>
                <input type="text" className="form-control" name="descripcion" value={formProducto.descripcion} onChange={handleChange} required />
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-dark fw-bold">
                  {editandoId ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
                {editandoId && (
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setEditandoId(null);
                    setFormProducto({ nombre: '', recompensa: '', precio: '', stock: '', categoria: 'Mugiwara', descripcion: '', imagen: '' });
                  }}>
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Barra de Herramientas y Botones de Exportación de Inventario */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 className="mb-0">{mostrarSoloCriticos ? '📋 Listado de Productos Críticos (Stock <= 5)' : '📦 Inventario de Productos Restantes'}</h4>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-success btn-sm fw-bold" onClick={exportarProductosExcel}>
                📊 Exportar a Excel (.CSV)
              </button>
              <button className="btn btn-danger btn-sm fw-bold" onClick={exportarProductosPDF}>
                📄 Exportar a PDF
              </button>
              <button className="btn btn-outline-dark btn-sm fw-bold" onClick={() => setMostrarSoloCriticos(!mostrarSoloCriticos)}>
                {mostrarSoloCriticos ? 'Mostrar Todos' : 'Filtrar Stock Crítico (<= 5)'}
              </button>
            </div>
          </div>

          <table className="table table-hover align-middle shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock Restante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaMostrar.map((prod) => (
                <tr key={prod.id} className={prod.stock <= 5 ? 'table-danger' : ''}>
                  <td className="fw-bold">#{prod.id}</td>
                  <td><img src={prod.imagen} alt={prod.nombre} style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></td>
                  <td className="fw-bold">{prod.nombre}</td>
                  <td>{prod.categoria}</td>
                  <td>${prod.precio.toLocaleString('es-CL')}</td>
                  <td className="fw-bold">
                    {prod.stock} unidades {prod.stock <= 5 && <span className="badge bg-danger ms-1">CRÍTICO</span>}
                  </td>
                  <td className="d-flex gap-1">
                    <button className="btn btn-warning btn-sm fw-bold" onClick={() => cargarParaEditar(prod)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(prod.id, prod.nombre)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PESTAÑA 3: ÓRDENES Y EXPORTACIÓN DE HISTORIAL DE COMPRAS */}
      {pestana === 'ordenes' && (
        <div className="card p-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h4 className="fw-bold mb-0">🧾 Historial de Compras Realizadas</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm fw-bold" onClick={exportarComprasExcel}>
                📊 Exportar Historial a Excel (.CSV)
              </button>
              <button className="btn btn-danger btn-sm fw-bold" onClick={exportarComprasPDF}>
                📄 Exportar Historial a PDF
              </button>
            </div>
          </div>

          {ordenes.length === 0 ? (
            <p className="text-muted">Aún no se han registrado compras en la tienda.</p>
          ) : (
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>N° Orden</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Correo</th>
                  <th>Total</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((o, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold">{o.idOrden}</td>
                    <td>{o.fecha}</td>
                    <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
                    <td>{o.cliente.correo}</td>
                    <td className="fw-bold text-success">${o.total.toLocaleString('es-CL')}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => setBoletaSeleccionada(o)}>
                        Mostrar Boleta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {boletaSeleccionada && (
            <div className="mt-4 p-4 border border-dark rounded bg-light">
              <div className="d-flex justify-content-between">
                <h5 className="fw-bold">Detalle de Boleta {boletaSeleccionada.idOrden}</h5>
                <button className="btn-close" onClick={() => setBoletaSeleccionada(null)}></button>
              </div>
              <p className="small mb-2">
                <strong>Cliente:</strong> {boletaSeleccionada.cliente.nombre} {boletaSeleccionada.cliente.apellidos} ({boletaSeleccionada.cliente.correo})<br />
                <strong>Dirección:</strong> {boletaSeleccionada.cliente.calle}, {boletaSeleccionada.cliente.comuna}
              </p>
              <ul className="mb-2">
                {boletaSeleccionada.items.map(i => (
                  <li key={i.id}>{i.nombre} x {i.cantidad} — ${(i.precio * i.cantidad).toLocaleString('es-CL')}</li>
                ))}
              </ul>
              <strong className="text-success">Total Pagado: ${boletaSeleccionada.total.toLocaleString('es-CL')}</strong>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 4: USUARIOS E HISTORIAL DE COMPRAS */}
      {pestana === 'usuarios' && (
        <div className="card p-4 shadow-sm">
          <h4 className="fw-bold mb-3">👥 Usuarios Registrados e Historial</h4>
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Correo Duoc</th>
                <th>Rol</th>
                <th>Comuna</th>
                <th>Compras Realizadas</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => {
                const comprasDeUsuario = ordenes.filter(o => o.usuarioCorreo?.toLowerCase() === u.correo.toLowerCase());
                return (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="fw-bold">{u.nombre} {u.apellidos}</td>
                    <td>{u.correo}</td>
                    <td><span className="badge bg-secondary">{u.rol}</span></td>
                    <td>{u.comuna}</td>
                    <td>{comprasDeUsuario.length} orden(es)</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;