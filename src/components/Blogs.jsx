// src/components/Blogs.jsx
import React, { useState } from 'react';

const articulosBlog = [
  {
    id: 1,
    titulo: "El impacto del Gear 5: ¿Por qué el cartel de Luffy es el más buscado?",
    fecha: "10 de Octubre, 2026",
    autor: "Big News Morgans",
    categoria: "Novedades del Nuevo Mundo",
    imagen: "/src/img/gear5.jpeg",
    resumen: "Tras los incidentes en Onigashima y Egghead, la fotografía tomada por el CP0 convirtió este cartel en una pieza histórica de colección.",
    contenidoCompleto: `El Gobierno Mundial intentó ocultar la nueva apariencia del Emperador Monkey D. Luffy, pero las imprentas del Diario de Economía Mundial lograron distribuir la imagen alrededor de todo el globo. 

Con una recompensa de 3.000.000.000 de Berries, este cartel destaca por su acabado fotográfico único mostrando el despertar de la Fruta Hito Hito: Modelo Nika. En Grand Line Posters imprimimos esta edición en papel pergamino de alto gramaje, resistente a la humedad del mar y con tinta de alta definición para coleccionistas.`
  },
  {
    id: 2,
    titulo: "Cross Guild sacude el mercado: Ahora los Marines también tienen recompensa",
    fecha: "12 de Octubre, 2026",
    autor: "Redacción Grand Line",
    categoria: "Historia y Curiosidades",
    imagen: "/src/img/crossguild.jpeg",
    resumen: "La organización liderada por Buggy, Mihawk y Crocodile ha cambiado las reglas del juego emitiendo sus propios carteles con coronas y estrellas.",
    contenidoCompleto: `Por primera vez en la historia de los mares, la Marina ya no es la única entidad que fija precios por la cabeza de las personas. La alianza conocida como Cross Guild ha implementado un sistema de estrellas y coronas (donde cada estrella equivale a 100 millones de Berries y una corona a 1.000 millones).

En nuestra tienda hemos incorporado toda la línea de los líderes de Cross Guild, destacando el cartel de Dracule Mihawk con 3.590.000.000 de Berries y el de Buggy el Payaso Estrella. Todos nuestros envíos van protegidos en tubos rígidos para asegurar que lleguen intactos a tu domicilio.`
  }
];

const Blogs = () => {
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);

  // Vista Detalle Blog #1 o #2
  if (articuloSeleccionado) {
    return (
      <div className="container mt-4">
        <button 
          className="btn btn-outline-dark mb-4 fw-bold" 
          onClick={() => setArticuloSeleccionado(null)}
        >
          ← Volver a Blogs
        </button>

        <div className="card shadow border-0 p-4" style={{ backgroundColor: '#fdfbf7' }}>
          <span className="badge bg-warning text-dark w-auto align-self-start mb-2">
            Detalle Blog #{articuloSeleccionado.id} — {articuloSeleccionado.categoria}
          </span>
          <h2 className="fw-bold mb-2">{articuloSeleccionado.titulo}</h2>
          <p className="text-muted small mb-4">
            Por <strong>{articuloSeleccionado.autor}</strong> | Publicado el {articuloSeleccionado.fecha}
          </p>

          <div className="text-center my-3 bg-light p-3 rounded border">
            <img 
              src={articuloSeleccionado.imagen} 
              alt={articuloSeleccionado.titulo} 
              style={{ maxHeight: '300px', objectFit: 'contain' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=WANTED+BLOG' }}
            />
          </div>

          <div className="mt-3 fs-5" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
            {articuloSeleccionado.contenidoCompleto}
          </div>
        </div>
      </div>
    );
  }

  // Vista Principal de Blogs
  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6">📰 Blog: Diario de Economía Mundial</h2>
        <p className="text-muted">
          Artículos, curiosidades e historia detrás de los carteles de recompensa más famosos del mar.
        </p>
      </div>

      <div className="row">
        {articulosBlog.map((post) => (
          <div className="col-md-6 mb-4" key={post.id}>
            <div className="card h-100 shadow-sm border-dark">
              <div className="text-center bg-light p-3">
                <img 
                  src={post.imagen} 
                  alt={post.titulo} 
                  style={{ height: '200px', objectFit: 'contain' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=BLOG+ONE+PIECE' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <span className="badge bg-dark mb-2 align-self-start">{post.categoria}</span>
                <h4 className="card-title fw-bold">{post.titulo}</h4>
                <p className="text-muted small mb-2">
                  📅 {post.fecha} | ✍️ {post.autor}
                </p>
                <p className="card-text">{post.resumen}</p>
                <div className="mt-auto pt-3">
                  <button 
                    className="btn btn-warning fw-bold w-100"
                    onClick={() => setArticuloSeleccionado(post)}
                  >
                    📖 Leer Detalle Blog #{post.id}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;