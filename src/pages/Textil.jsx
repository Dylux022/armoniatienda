import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Textil({ onAddToCart }) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarTextil = async () => {
      try {
        const colRef = collection(db, "textil");
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      } catch (err) {
        console.error("Error cargando perfumes textiles:", err);
        setError("No se pudieron cargar los perfumes textiles.");
      } finally {
        setCargando(false);
      }
    };

    cargarTextil();
  }, []);

  if (cargando) {
    return <p className="text-slate-300">Cargando perfumes textiles...</p>;
  }

  if (error) {
    return <p className="text-red-300 text-sm">{error}</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-slate-400">
        No hay perfumes textiles cargados por el momento.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-300">
        Perfume textil 👕✨
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((p) => (
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
