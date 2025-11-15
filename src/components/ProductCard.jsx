import React from "react";

const ProductCard = ({ nombre, precio, descripcion, imagen, onAdd }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 hover:border-emerald-400/40 transition-all">
      <img
        src={imagen}
        alt={nombre}
        className="w-full h-40 object-cover rounded-xl mb-3 border border-slate-800"
      />

      <h3 className="font-medium text-emerald-200">{nombre}</h3>
      <p className="text-sm text-slate-400 mt-1">{descripcion}</p>

      <p className="mt-2 text-lg font-semibold text-emerald-300">
        ${precio}
      </p>

      <button
        className="mt-3 w-full py-2 text-sm rounded-full border border-emerald-400/60 text-emerald-300 hover:bg-emerald-400/10 transition-all"
        onClick={onAdd}
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductCard;
