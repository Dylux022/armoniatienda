import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function ProductDetail({ onAddToCart }) {
  const { categoria, id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [aromaSeleccionado, setAromaSeleccionado] = useState(""); // 🔹 nuevo

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setCargando(true);
        setError(null);

        let colName = null;
        if (categoria === "sahumerios") colName = "sahumerios";
        else if (categoria === "aromatizantes") colName = "aromatizantes";
        else if (categoria === "textil") colName = "textil";
        else {
          setError("Categoría no válida.");
          setCargando(false);
          return;
        }

        const ref = doc(db, colName, id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError("Producto no encontrado.");
        } else {
          // Incluimos la categoría para que el carrito/stock la tenga
          const data = {
            id: snap.id,
            categoria,
            ...snap.data(),
          };
          setProduct(data);
        }
      } catch (err) {
        console.error("Error cargando producto:", err);
        setError("No se pudo cargar el producto.");
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [categoria, id]);

  // Cuando llega el producto, si tiene aromas, dejamos el primero seleccionado por defecto
  useEffect(() => {
    if (
      product &&
      Array.isArray(product.aromas) &&
      product.aromas.length > 0
    ) {
      setAromaSeleccionado((prev) => prev || product.aromas[0]);
    } else {
      setAromaSeleccionado("");
    }
  }, [product]);

  const handleAdd = () => {
    if (!product || !onAddToCart) return;

    const itemConAroma = {
      ...product,
      ...(aromaSeleccionado && { aromaSeleccionado }), // 👈 se guarda en el item
    };

    onAddToCart(itemConAroma);
  };

  if (cargando) {
    return <p className="text-sm text-slate-600">Cargando producto...</p>;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
        >
          Volver
        </button>
      </div>
    );
  }

  if (!product) return null;

  const { nombre, descripcion, precio, imagen, stock, aromas } = product;
  const sinStock = stock === 0;

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr,1fr] items-start">
      {/* Imagen grande */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {imagen ? (
          <img
            src={imagen}
            alt={nombre}
            className="w-full h-72 md:h-96 object-cover"
          />
        ) : (
          <div className="w-full h-72 md:h-96 flex items-center justify-center text-slate-400 text-sm">
            Sin imagen disponible
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-600/80">
            {categoria}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            {nombre}
          </h1>
        </div>

        {descripcion && (
          <p className="text-sm text-slate-700 leading-relaxed">
            {descripcion}
          </p>
        )}

        {stock != null && (
          <p className="text-sm text-slate-600">
            Stock disponible:{" "}
            <span
              className={`font-semibold ${
                sinStock ? "text-red-600" : "text-emerald-700"
              }`}
            >
              {stock}
            </span>
          </p>
        )}

        {/* 🔹 Selector de aroma si el producto tiene aromas cargados */}
        {Array.isArray(aromas) && aromas.length > 0 && (
          <div className="space-y-1 pt-1">
            <label className="text-sm font-medium text-slate-700">
              Aroma
            </label>
            <select
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={aromaSeleccionado}
              onChange={(e) => setAromaSeleccionado(e.target.value)}
            >
              {aromas.map((aroma) => (
                <option key={aroma} value={aroma}>
                  {aroma}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Elegí el aroma que querés para este producto.
            </p>
          </div>
        )}

        <p className="text-xl font-semibold text-emerald-700">
          ${precio}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleAdd}
            disabled={sinStock}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
              sinStock
                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95 shadow-sm"
            }`}
          >
            {sinStock ? "Sin stock" : "Agregar al carrito"}
          </button>

          <Link
            to="/carrito"
            className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-xs hover:bg-slate-100 transition-all"
          >
            Ir al carrito
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
          <p>
            💡 Tip: podés combinarlo con otros aromas para crear tu propio
            ritual de armonía.
          </p>
          <Link
            to={`/${categoria}`}
            className="text-emerald-700 hover:underline"
          >
            Volver a {categoria}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
