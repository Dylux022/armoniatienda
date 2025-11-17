import React from "react";

function ProductCard({ product, onAddToCart }) {
  const { nombre, descripcion, precio, imagen } = product;

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <article className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:border-emerald-400/70 hover:shadow-emerald-500/10 transition-all">
      {/* Imagen */}
      {imagen && (
        <div className="w-full h-40 bg-slate-950/80">
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si falla la imagen, ocultamos el tag
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 flex flex-col p-4 space-y-2">
        <h3 className="text-sm font-semibold text-emerald-200">
          {nombre}
        </h3>

        {descripcion && (
          <p className="text-xs text-slate-400 leading-snug max-h-16 overflow-hidden">
            {descripcion}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-emerald-300">
            ${precio}
          </p>

          <button
            onClick={handleAdd}
            className="text-xs px-3 py-1.5 rounded-full bg-emerald-400 text-slate-950 font-medium hover:bg-emerald-300 active:scale-95 transition-all"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
