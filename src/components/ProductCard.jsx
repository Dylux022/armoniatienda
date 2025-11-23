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
    <article
      className="
        bg-white
        border border-slate-200
        rounded-2xl
        overflow-hidden
        flex flex-col
        shadow-sm
        hover:shadow-md
        hover:-translate-y-[2px]
        transition-all
        duration-200
      "
    >
      {/* Imagen */}
      {imagen && (
        <div className="w-full h-40 bg-slate-100">
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
        <h3 className="text-sm font-semibold text-slate-900">
          {nombre}
        </h3>

        {descripcion && (
          <p className="text-xs text-slate-600 leading-snug max-h-16 overflow-hidden">
            {descripcion}
          </p>
        )}

        {stock != null && (
          <p className="text-[11px] text-slate-500">
            Stock disponible:{" "}
            <span className="text-emerald-700 font-medium">
              {Math.max(stock - currentQuantity, 0)}
            </span>
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-emerald-700">
            ${precio}
          </p>

          <button
            onClick={handleAdd}
            disabled={sinStock || alLimite}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150 ${
              sinStock || alLimite
                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95 shadow-sm"
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
