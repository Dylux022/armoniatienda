import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const CATEGORIAS = [
  { id: "todos", label: "Todos" },
  { id: "sahumerios", label: "Sahumerios" },
  { id: "aromatizantes", label: "Aromatizantes" },
  { id: "textil", label: "Perfume textil" },
];

function Catalogo({ onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        setCargando(true);
        setError(null);

        const categorias = ["sahumerios", "aromatizantes", "textil"];
        const resultados = [];

        for (const cat of categorias) {
          const snap = await getDocs(collection(db, cat));
          snap.forEach((docSnap) => {
            resultados.push({
              id: docSnap.id,
              categoria: cat,
              ...docSnap.data(),
            });
          });
        }

        setProductos(resultados);
      } catch (err) {
        console.error("Error cargando catálogo:", err);
        setError("No se pudo cargar el catálogo.");
      } finally {
        setCargando(false);
      }
    };

    cargarTodo();
  }, []);

  const productosFiltrados = productos.filter((p) =>
    filtro === "todos" ? true : p.categoria === filtro
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Catálogo completo
          </h2>
          <p className="text-sm text-slate-600">
            Todos los productos de Armonía.ALD en un solo lugar. Usá los filtros para
            ver solo la categoría que quieras.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 text-xs">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFiltro(cat.id)}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                filtro === cat.id
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {cargando ? (
        <p className="text-sm text-slate-600">Cargando catálogo...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : productosFiltrados.length === 0 ? (
        <p className="text-sm text-slate-600">
          No hay productos para mostrar en esta categoría.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados.map((p) => {
            const sinStock = p.stock === 0;
            return (
              <div
                key={`${p.id}-${p.categoria}`}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col"
              >
                {p.imagen && (
                  <Link
                    to={`/producto/${p.categoria}/${p.id}`}
                    className="block mb-3"
                  >
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="w-full h-40 object-cover rounded-xl border border-slate-100"
                    />
                  </Link>
                )}

                <div className="flex-1 space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-600/90">
                    {p.categoria}
                  </p>
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                    {p.nombre}
                  </h3>
                  {p.descripcion && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {p.descripcion}
                    </p>
                  )}

                  {p.stock != null && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Stock:{" "}
                      <span
                        className={
                          sinStock ? "text-red-600 font-medium" : "text-emerald-700 font-medium"
                        }
                      >
                        {p.stock}
                      </span>
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-base font-semibold text-emerald-700">
                    ${p.precio}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      to={`/producto/${p.categoria}/${p.id}`}
                      className="px-3 py-1.5 rounded-full border border-slate-300 text-[11px] text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      Ver detalle
                    </Link>

                    <button
                      type="button"
                      disabled={sinStock || !onAddToCart}
                      onClick={() => onAddToCart && onAddToCart(p)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                        sinStock
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                      }`}
                    >
                      {sinStock ? "Sin stock" : "Agregar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Catalogo;
