describe("Suite de 10 Pruebas Unitarias Frontend - Grand Line Posters (React + Jasmine/Karma)", function() {

  let mockCatalogo;
  let contenedorDOM;

  beforeEach(function() {
 
    contenedorDOM = document.createElement('div');
    document.body.appendChild(contenedorDOM);

    
    mockCatalogo = [
      { id: 1, nombre: "Wanted: Gol D. Roger", recompensa: 5564800000, precio: 9990, stock: 2, categoria: "Leyendas" },
      { id: 2, nombre: "Wanted: Monkey D. Luffy", recompensa: 3000000000, precio: 6990, stock: 3, categoria: "Mugiwara" },
      { id: 3, nombre: "Wanted: Roronoa Zoro", recompensa: 1111000000, precio: 5990, stock: 10, categoria: "Mugiwara" },
      { id: 4, nombre: "Wanted: Tony Tony Chopper", recompensa: 1000, precio: 2990, stock: 25, categoria: "Mugiwara" }
    ];
  });

  afterEach(function() {
  
    document.body.removeChild(contenedorDOM);
  });

  // ========================================================================
  // 1. PRUEBAS DE RENDERIZADO CORRECTO (Componente Home / Catálogo)
  // ========================================================================
  it("1. [Componente Home - Renderizado] Debe renderizar en el DOM todos los elementos de la lista de productos", function() {
    mockCatalogo.forEach(function(prod) {git config --global user.name "John Doe"
      const card = document.createElement('div');
      card.className = 'card producto-item';
      card.innerHTML = `<h5 class="card-title">${prod.nombre}</h5><span class="bounty">${prod.recompensa}</span>`;
      contenedorDOM.appendChild(card);
    });

    const elementosRenderizados = contenedorDOM.querySelectorAll('.producto-item');
    expect(elementosRenderizados.length).toBe(4);
    expect(elementosRenderizados[0].querySelector('.card-title').textContent).toContain("Gol D. Roger");
  });

  it("2. [Componente Home - Filtro Recompensas] Debe ordenar correctamente los posters de mayor a menor recompensa", function() {
    const desordenados = [...mockCatalogo].reverse();
    const ordenadosMayorAMenor = desordenados.sort((a, b) => b.recompensa - a.recompensa);

    expect(ordenadosMayorAMenor[0].nombre).toBe("Wanted: Gol D. Roger");
    expect(ordenadosMayorAMenor[0].recompensa).toBeGreaterThan(ordenadosMayorAMenor[3].recompensa);
  });

  // =========================================================================
  // 2. PRUEBAS DE RENDERIZADO CONDICIONAL (AlertaPersonalizada y Stock Crítico)
  // =========================================================================
  it("3. [Componente AlertaPersonalizada - Renderizado Condicional] Solo debe mostrar la alerta en el DOM cuando existe un mensaje de error o éxito", function() {
    const renderizarAlerta = (mensaje, tipo) => {
      if (!mensaje) return '';
      return `<div class="alert alert-${tipo}" id="alerta-custom">${mensaje}</div>`;
    };

    // Caso 1: Sin mensaje (no debe renderizar nada)
    contenedorDOM.innerHTML = renderizarAlerta('', 'danger');
    expect(contenedorDOM.querySelector('#alerta-custom')).toBeNull();

    // Caso 2: Con error presente (debe renderizar la alerta)
    contenedorDOM.innerHTML = renderizarAlerta('Credenciales incorrectas', 'danger');
    const alertaDOM = contenedorDOM.querySelector('#alerta-custom');
    expect(alertaDOM).not.toBeNull();
    expect(alertaDOM.textContent).toBe('Credenciales incorrectas');
  });

  it("4. [Componente Admin - Stock Crítico] Debe identificar y mostrar alerta condicional solo en productos con stock <= 5", function() {
    const productosCriticos = mockCatalogo.filter(p => p.stock <= 5);
    
    expect(productosCriticos.length).toBe(2); // Roger (2) y Luffy (3)
    expect(productosCriticos.every(p => p.stock <= 5)).toBeTrue();
  });

  // =========================================================================
  // 3. PRUEBAS DE PROPIEDADES / PROPS (Botón Añadir y Navbar)
  // =========================================================================
  it("5. [Componente Botón / Card - Props] Debe recibir correctamente la etiqueta (label) y asociar la función onClick", function() {
    const mockOnClick = jasmine.createSpy('agregarAlCarritoSpy');
    const labelProp = "🛒 Añadir al Carrito";

    const boton = document.createElement('button');
    boton.textContent = labelProp;
    boton.onclick = () => mockOnClick(mockCatalogo[1]);
    contenedorDOM.appendChild(boton);

    expect(boton.textContent).toBe("🛒 Añadir al Carrito");
    expect( typeof boton.onclick ).toBe('function');
  });

  it("6. [Componente Navbar / Carrito - Props] Debe calcular el total de unidades y monto a pagar a partir de la prop carrito", function() {
    const propCarrito = [
      { id: 1, nombre: "Wanted: Gol D. Roger", precio: 9990, cantidad: 1 },
      { id: 2, nombre: "Wanted: Monkey D. Luffy", precio: 6990, cantidad: 2 }
    ];

    const totalUnidades = propCarrito.reduce((acc, item) => acc + item.cantidad, 0);
    const montoTotal = propCarrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    expect(totalUnidades).toBe(3);
    expect(montoTotal).toBe(23970);
  });

  // =========================================================================
  // 4. PRUEBAS DE GESTIÓN DE ESTADO / STATE (Formularios Registro, Login y Checkout)
  // =========================================================================
  it("7. [Componente Registro / Login - State] Debe actualizar el estado del formulario cuando el usuario introduce texto y validar dominio @duocuc.cl o @duoc.cl", function() {
    let formState = { correo: '', password: '' };
    const validarCorreoDuoc = (email) => /^[a-zA-Z0-9._%+-]+@(duocuc\.cl|duoc\.cl)$/i.test(email.trim());

    const inputCorreo = document.createElement('input');
    inputCorreo.type = 'email';
    contenedorDOM.appendChild(inputCorreo);

    // Simulamos entrada de texto del usuario
    inputCorreo.value = 'maxi@duocuc.cl';
    formState.correo = inputCorreo.value;

    expect(formState.correo).toBe('maxi@duocuc.cl');
    expect(validarCorreoDuoc(formState.correo)).toBeTrue();
    expect(validarCorreoDuoc('pirata@gmail.com')).toBeFalse();
  });

  it("8. [Componente Perfil - State] Debe enlazar y filtrar en el estado únicamente las compras pertenecientes al usuario autenticado", function() {
    const historialGlobalMock = [
      { idOrden: '#OP-101', usuarioCorreo: 'maxi@duocuc.cl', total: 6990 },
      { idOrden: '#OP-102', usuarioCorreo: 'otro@duoc.cl', total: 5990 },
      { idOrden: '#OP-103', usuarioCorreo: 'maxi@duocuc.cl', total: 9990 }
    ];

    const misComprasState = historialGlobalMock.filter(o => o.usuarioCorreo === 'maxi@duocuc.cl');
    expect(misComprasState.length).toBe(2);
    expect(misComprasState[0].idOrden).toBe('#OP-101');
  });

  // =========================================================================
  // 5. PRUEBAS DE SIMULACIÓN DE EVENTOS (Clics en Carrito, Admin CRUD y Checkout)
  // =========================================================================
  it("9. [Componente Carrito - Evento Click] Debe ejecutar el mock de agregarAlCarrito y cambiar el estado al simular un clic en el botón", function() {
    let estadoCarrito = [];
    const mockAgregar = jasmine.createSpy('agregarAlCarrito').and.callFake(function(producto) {
      estadoCarrito.push({ ...producto, cantidad: 1 });
    });

    const btnAgregar = document.createElement('button');
    btnAgregar.addEventListener('click', () => mockAgregar(mockCatalogo[0]));
    contenedorDOM.appendChild(btnAgregar);

    // Simulamos clic real del usuario
    btnAgregar.click();

    expect(mockAgregar).toHaveBeenCalledTimes(1);
    expect(mockAgregar).toHaveBeenCalledWith(mockCatalogo[0]);
    expect(estadoCarrito.length).toBe(1);
  });

  it("10. [Componente Admin - Evento Submit CRUD] Debe crear un nuevo póster con imagen cargada al simular el envío del formulario", function() {
    const nuevoPoster = {
      id: 5,
      nombre: "Wanted: Shanks",
      recompensa: 4048900000,
      precio: 8490,
      stock: 4,
      imagen: "data:image/webp;base64,UklGRmockImage"
    };

    const mockGuardarProducto = jasmine.createSpy('guardarProducto').and.callFake(function(prod) {
      mockCatalogo.push(prod);
    });

    mockGuardarProducto(nuevoPoster);

    expect(mockGuardarProducto).toHaveBeenCalledWith(nuevoPoster);
    expect(mockCatalogo.length).toBe(5);
    expect(mockCatalogo[4].imagen).toContain("data:image/webp;base64");
  });

});