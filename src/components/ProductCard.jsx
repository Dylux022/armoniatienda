import React from "react";

function ProductCard({ product, onAddToCart, currentQuantity = 0 }) {
  const { nombre, descripcion, precio, imagen, stock } = product || {};

  const sinStock = stock === 0;
  const alLimite =
    stock != null && currentQuantity != null && currentQuantity >= stock;

  const handleAdd = () => {
    if (sinStock || alLimite) return;
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

        {stock != null && (
          <p className="text-[11px] text-slate-500">
            Stock disponible:{" "}
            <span className="text-emerald-300">
              {Math.max(stock - currentQuantity, 0)}
            </span>
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-emerald-300">
            ${precio}
          </p>

          <button
            onClick={handleAdd}
            disabled={sinStock || alLimite}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              sinStock || alLimite
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                : "bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:scale-95"
            }`}
          >
            {sinStock
              ? "Sin stock"
              : alLimite
              ? "Máximo en carrito"
              : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
