import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Aromatizantes({ onAddToCart }) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarAromatizantes = async () => {
      try {
        const colRef = collection(db, "aromatizantes");
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      } catch (err) {
        console.error("Error cargando aromatizantes:", err);
        setError("No se pudieron cargar los aromatizantes.");
      } finally {
        setCargando(false);
      }
    };

    cargarAromatizantes();
  }, []);

  if (cargando) {
    return <p className="text-slate-300">Cargando aromatizantes...</p>;
  }

  if (error) {
    return <p className="text-red-300 text-sm">{error}</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-slate-400">
        No hay aromatizantes cargados por el momento.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-300">
        Aromatizantes 🌬️
      </h2>

      {/* GRID RESPONSIVE: 1 / 2 / 3 columnas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default Aromatizantes;
