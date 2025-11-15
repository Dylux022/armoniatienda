import React from "react";
import ProductCard from "../components/ProductCard";
import { perfumesTextiles } from "../data/products";

function Textil({ onAddToCart }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-300">
        Perfume textil 👕✨
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {perfumesTextiles.map((p) => (
          <ProductCard
            key={p.id}
            nombre={p.nombre}
            descripcion={p.descripcion}
            precio={p.precio}
            imagen={p.imagen}
            onAdd={() => onAddToCart(p)}
          />
        ))}
      </div>
    </div>
  );
}

export default Textil;
