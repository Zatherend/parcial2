// src/database.js

// 1. CATÁLOGO AMPLIADO DE CARTELES WANTED (Rutas genéricas en /src/img/)
let productos = [
  // Emperadores y Leyendas
  { id: 1, nombre: "Wanted: Gol D. Roger", recompensa: 5564800000, precio: 9990, stock: 2, categoria: "Leyendas", imagen: "/src/img/roger.jpg", descripcion: "El Rey de los Piratas. Edición especial dorada." },
  { id: 2, nombre: "Wanted: Edward Newgate (Barbablanca)", recompensa: 5046000000, precio: 8990, stock: 3, categoria: "Leyendas", imagen: "/src/img/barbablanca.jpg", descripcion: "El hombre más fuerte del mundo." },
  { id: 3, nombre: "Wanted: Kaido de las Bestias", recompensa: 4611100000, precio: 7990, stock: 6, categoria: "Yonkou", imagen: "/src/img/kaido.jpg", descripcion: "Capitán de los Piratas Bestia y Gobernador de Onigashima." },
  { id: 4, nombre: "Wanted: Charlotte Linlin (Big Mom)", recompensa: 4388000000, precio: 7990, stock: 7, categoria: "Yonkou", imagen: "/src/img/linlin.jpg", descripcion: "Reina de Totto Land y capitana de los Piratas de Big Mom." },
  { id: 5, nombre: "Wanted: Shanks el Pelirrojo", recompensa: 4048900000, precio: 8490, stock: 4, categoria: "Yonkou", imagen: "/src/img/shanks.jpg", descripcion: "Jefe de los Piratas del Pelirrojo." },
  { id: 6, nombre: "Wanted: Marshall D. Teach (Barbanegra)", recompensa: 3996000000, precio: 7490, stock: 8, categoria: "Yonkou", imagen: "/src/img/barbanegra.jpg", descripcion: "Almirante de los Piratas de Barbanegra." },
  { id: 7, nombre: "Wanted: Dracule Mihawk", recompensa: 3590000000, precio: 7490, stock: 5, categoria: "Cross Guild", imagen: "/src/img/mihawk.jpg", descripcion: "El mejor espadachín del mundo." },
  { id: 8, nombre: "Wanted: Buggy el Payaso Estrella", recompensa: 3189000000, precio: 6490, stock: 14, categoria: "Yonkou / Cross Guild", imagen: "/src/img/buggy.jpg", descripcion: "Líder figura de Cross Guild y Emperador del Mar." },

  // Tripulación Sombrero de Paja (Mugiwara)
  { id: 9, nombre: "Wanted: Monkey D. Luffy (Gear 5)", recompensa: 3000000000, precio: 6990, stock: 3, categoria: "Mugiwara", imagen: "/src/img/luffy.jpg", descripcion: "Capitán de los Sombrero de Paja y Emperador del Mar." },
  { id: 10, nombre: "Wanted: Roronoa Zoro", recompensa: 1111000000, precio: 5990, stock: 10, categoria: "Mugiwara", imagen: "/src/img/zoro.jpeg", descripcion: "El Cazador de Piratas y combatiente principal." },
  { id: 11, nombre: "Wanted: Jinbe", recompensa: 1100000000, precio: 5490, stock: 8, categoria: "Mugiwara", imagen: "/src/img/jinbe.jpg", descripcion: "El Caballero del Mar, timonel de la banda." },
  { id: 12, nombre: "Wanted: Vinsmoke Sanji", recompensa: 1032000000, precio: 5990, stock: 4, categoria: "Mugiwara", imagen: "/src/img/sanji.png", descripcion: "Pierna Negra, cocinero de los Sombrero de Paja." },
  { id: 13, nombre: "Wanted: Nico Robin", recompensa: 930000000, precio: 5490, stock: 2, categoria: "Mugiwara", imagen: "/src/img/robin.jpg", descripcion: "La Niña Demonio, arqueóloga de la tripulación." },
  { id: 14, nombre: "Wanted: God Usopp", recompensa: 500000000, precio: 4990, stock: 15, categoria: "Mugiwara", imagen: "/src/img/usopp.jpg", descripcion: "El francotirador de los Sombrero de Paja." },
  { id: 15, nombre: "Wanted: Franky", recompensa: 394000000, precio: 4490, stock: 9, categoria: "Mugiwara", imagen: "/src/img/franky.jpg", descripcion: "Carpintero cyborg del Thousand Sunny." },
  { id: 16, nombre: "Wanted: Brook", recompensa: 383000000, precio: 4490, stock: 5, categoria: "Mugiwara", imagen: "/src/img/brook.jpeg", descripcion: "Soul King, músico de la banda." },
  { id: 17, nombre: "Wanted: Nami", recompensa: 366000000, precio: 4990, stock: 12, categoria: "Mugiwara", imagen: "/src/img/nami.jpg", descripcion: "La Gata Ladrona, navegante oficial." },
  { id: 18, nombre: "Wanted: Tony Tony Chopper", recompensa: 1000, precio: 2990, stock: 25, categoria: "Mugiwara", imagen: "/src/img/chopper.jpg", descripcion: "Médico de abordo." },

  // Supernovas, Revolucionarios y Otros
  { id: 19, nombre: "Wanted: Trafalgar D. Water Law", recompensa: 3000000000, precio: 6490, stock: 6, categoria: "Supernova", imagen: "/src/img/law.jpeg", descripcion: "El Cirujano de la Muerte, capitán de los Piratas Heart." },
  { id: 20, nombre: "Wanted: Eustass Kid", recompensa: 3000000000, precio: 6490, stock: 7, categoria: "Supernova", imagen: "/src/img/kid.jpg", descripcion: "Capitán de los Piratas de Kid." },
  { id: 21, nombre: "Wanted: Boa Hancock", recompensa: 1659000000, precio: 5990, stock: 4, categoria: "Kuja", imagen: "/src/img/hancock.png", descripcion: "La Emperatriz Pirata de Amazon Lily." },
  { id: 22, nombre: "Wanted: Portgas D. Ace", recompensa: 550000000, precio: 6990, stock: 3, categoria: "Barbablanca", imagen: "/src/img/ace.jpg", descripcion: "Puño de Fuego, comandante de la 2da división." }
];

// 2. MEMORIA TEMPORAL DE USUARIOS (Incluye Admin oculto y un Cliente base)
let usuarios = [
  {
    id: 1,
    nombre: "Administrador",
    apellidos: "Marina HQ",
    correo: "admin@duoc.cl",
    password: "admin123",
    rol: "admin",
    calle: "Cuartel General Marineford 1",
    depto: "Oficina Almirante",
    comuna: "Santiago"
  },
  {
    id: 2,
    nombre: "Maximiliano",
    apellidos: "Álvarez",
    correo: "maxi@duocuc.cl",
    password: "123456",
    rol: "cliente",
    calle: "Av. Vicuña Mackenna 4917",
    depto: "",
    comuna: "San Joaquín"
  }
];

// 3. MEMORIA TEMPORAL DE COMPRAS
let historialCompras = [];

// --- VALIDACIÓN DE CORREO INSTITUCIONAL ---
export const validarCorreoDuoc = (correo) => {
  if (!correo) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@(duocuc\.cl|duoc\.cl)$/i;
  return regex.test(correo.trim());
};

// --- FUNCIONES DE USUARIOS (REGISTRO, LOGIN Y PERFIL) ---
export const obtenerUsuarios = () => [...usuarios];

export const registrarUsuario = (datosUsuario) => {
  const correoNormalizado = datosUsuario.correo.trim().toLowerCase();

  if (!validarCorreoDuoc(correoNormalizado)) {
    return { exito: false, mensaje: "El correo debe ser exclusivamente @duocuc.cl o @duoc.cl" };
  }

  const existe = usuarios.some(u => u.correo.toLowerCase() === correoNormalizado);
  if (existe) {
    return { exito: false, mensaje: "Ya existe una cuenta registrada con este correo institucional." };
  }

  const nuevoUsuario = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
    nombre: datosUsuario.nombre,
    apellidos: datosUsuario.apellidos,
    correo: correoNormalizado,
    password: datosUsuario.password,
    rol: "cliente",
    calle: datosUsuario.calle || "",
    depto: datosUsuario.depto || "",
    comuna: datosUsuario.comuna || "Santiago"
  };

  usuarios.push(nuevoUsuario);
  return { exito: true, usuario: nuevoUsuario };
};

export const autenticarUsuario = (correo, password) => {
  const correoNormalizado = correo.trim().toLowerCase();

  if (!validarCorreoDuoc(correoNormalizado)) {
    return { exito: false, mensaje: "Solo se permite el acceso con correos @duocuc.cl o @duoc.cl" };
  }

  const usuario = usuarios.find(
    u => u.correo.toLowerCase() === correoNormalizado && u.password === password
  );

  if (!usuario) {
    return { exito: false, mensaje: "Correo o contraseña incorrectos." };
  }

  return { exito: true, usuario };
};

export const actualizarDatosUsuario = (correo, nuevosDatos) => {
  let usuarioActualizado = null;
  usuarios = usuarios.map(u => {
    if (u.correo.toLowerCase() === correo.toLowerCase()) {
      usuarioActualizado = { ...u, ...nuevosDatos };
      return usuarioActualizado;
    }
    return u;
  });
  return usuarioActualizado;
};

// --- FUNCIONES CRUD DE PRODUCTOS ---
export const obtenerProductos = () => [...productos];

export const obtenerProductosCriticos = () => productos.filter(p => p.stock <= 5);

export const agregarProducto = (nuevoProducto) => {
  const productoConId = {
    ...nuevoProducto,
    id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1,
    precio: Number(nuevoProducto.precio),
    recompensa: Number(nuevoProducto.recompensa || 0),
    stock: Number(nuevoProducto.stock)
  };
  productos.push(productoConId);
  return productoConId;
};

export const actualizarProducto = (id, datosActualizados) => {
  productos = productos.map(p => 
    p.id === parseInt(id) ? { ...p, ...datosActualizados } : p
  );
  return obtenerProductos();
};

export const eliminarProducto = (id) => {
  productos = productos.filter(p => p.id !== parseInt(id));
  return obtenerProductos();
};

export const descontarStock = (itemsComprados) => {
  itemsComprados.forEach(item => {
    productos = productos.map(p => 
      p.id === item.id ? { ...p, stock: Math.max(0, p.stock - item.cantidad) } : p
    );
  });
};

// --- FUNCIONES DE HISTORIAL DE COMPRAS LIGADAS AL USUARIO ---
export const registrarCompra = (compra) => {
  const nuevaCompra = {
    ...compra,
    usuarioCorreo: compra.cliente.correo.trim().toLowerCase(),
    idOrden: `#OP-${Math.floor(100000 + Math.random() * 900000)}`,
    fecha: new Date().toLocaleString('es-CL')
  };
  historialCompras.unshift(nuevaCompra);
  descontarStock(compra.items);
  return nuevaCompra;
};

export const obtenerHistorial = () => [...historialCompras];

export const obtenerHistorialPorUsuario = (correo) => {
  if (!correo) return [];
  return historialCompras.filter(
    orden => orden.usuarioCorreo.toLowerCase() === correo.trim().toLowerCase()
  );
};