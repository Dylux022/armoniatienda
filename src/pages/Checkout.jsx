import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function Checkout({ cart, onClearCart }) {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [entrega, setEntrega] = useState("retiro");
  const [direccion, setDireccion] = useState("");
  const [barrio, setBarrio] = useState("");
  const [notas, setNotas] = useState("");

  const [estado, setEstado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const total = useMemo(
    () =>
      cart.reduce(
        (acc, item) => acc + (item.precio || 0) * (item.cantidad || 1),
        0
      ),
    [cart]
  );

  // Si el carrito está vacío, no tiene sentido hacer checkout
  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Checkout
        </h2>
        <div className="bg-white border border-slate-200 rounded-3xl px-5 py-4 shadow-sm space-y-2">
          <p className="text-slate-600 text-sm">
            Tu carrito está vacío. Agregá algunos productos antes de finalizar la compra.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  const validarFormulario = () => {
    if (!nombre.trim() || !telefono.trim()) {
      setEstado({ tipo: "error", mensaje: "Completá nombre y teléfono." });
      return false;
    }

    if (!metodoPago) {
      setEstado({
        tipo: "error",
        mensaje: "Seleccioná un método de pago.",
      });
      return false;
    }

    if (!entrega) {
      setEstado({
        tipo: "error",
        mensaje: "Seleccioná una forma de entrega.",
      });
      return false;
    }

    if (entrega === "envio" && (!direccion.trim() || !barrio.trim())) {
      setEstado({
        tipo: "error",
        mensaje: "Para envío a domicilio, completá dirección y barrio.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado(null);

    if (!validarFormulario()) return;

    setEnviando(true);

    try {
      const pedido = {
        items: cart.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          categoria: item.categoria,
          precio: item.precio,
          cantidad: item.cantidad,
          stock: item.stock ?? null,
          aromaSeleccionado: item.aromaSeleccionado || null,
        })),
        total,
        fecha: new Date().toISOString(),
        estado: "pendiente",
        nombreCliente: nombre.trim(),
        telefono: telefono.trim(),
        metodoPago,
        entrega,
        direccion: entrega === "envio" ? direccion.trim() : "",
        barrio: entrega === "envio" ? barrio.trim() : "",
        notas: notas.trim(),
      };

      await addDoc(collection(db, "pedidos"), pedido);

      if (onClearCart) onClearCart();

      navigate("/pedido-enviado", {
        state: {
          total,
          nombre: nombre.trim(),
        },
      });
    } catch (err) {
      console.error("Error al enviar pedido:", err);
      setEstado({
        tipo: "error",
        mensaje: "No se pudo enviar el pedido. Probá de nuevo más tarde.",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[1.4fr,1fr] items-start">
      {/* FORMULARIO */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Finalizar compra 🧾
        </h2>

        <p className="text-sm text-slate-600">
          Completá tus datos para que podamos coordinar el pago y la entrega.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm"
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Nombre y apellido
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Teléfono (WhatsApp)
            </label>
            <input
              type="tel"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          {/* MÉTODO DE PAGO */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700">
              Método de pago
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMetodoPago("transferencia")}
                className={`px-3 py-1.5 rounded-full border ${
                  metodoPago === "transferencia"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                } transition-all`}
              >
                Transferencia
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago("efectivo")}
                className={`px-3 py-1.5 rounded-full border ${
                  metodoPago === "efectivo"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                } transition-all`}
              >
                Efectivo
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago("otro")}
                className={`px-3 py-1.5 rounded-full border ${
                  metodoPago === "otro"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                } transition-all`}
              >
                A coordinar
              </button>
            </div>
          </div>

          {/* ENTREGA */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700">
              Entrega
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setEntrega("retiro")}
                className={`px-3 py-1.5 rounded-full border ${
                  entrega === "retiro"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                } transition-all`}
              >
                Retiro en punto a coordinar
              </button>
              <button
                type="button"
                onClick={() => setEntrega("envio")}
                className={`px-3 py-1.5 rounded-full border ${
                  entrega === "envio"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                } transition-all`}
              >
                Envío a domicilio
              </button>
            </div>
          </div>

          {/* CAMPOS EXTRA SOLO SI ES ENVÍO */}
          {entrega === "envio" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Dirección
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Barrio / Zona
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  value={barrio}
                  onChange={(e) => setBarrio(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* NOTAS OPCIONALES */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Notas adicionales (opcional)
            </label>
            <textarea
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 min-h-[70px] focus:outline-none focus:ring-2 focus:ring-emerald-300"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: horario preferido, timbre, indicaciones..."
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full mt-2 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {enviando ? "Enviando pedido..." : "Confirmar pedido"}
          </button>

          {estado && (
            <p
              className={`text-xs mt-2 ${
                estado.tipo === "error" ? "text-red-500" : "text-emerald-600"
              }`}
            >
              {estado.mensaje}
            </p>
          )}
        </form>
      </section>

      {/* RESUMEN DEL PEDIDO */}
      <aside className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Tu pedido
        </h3>

        <div className="space-y-2 max-h-64 overflow-auto pr-1">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 text-sm bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 truncate">{item.nombre}</p>

                {item.aromaSeleccionado && (
                  <p className="text-[11px] text-emerald-700">
                    Aroma: {item.aromaSeleccionado}
                  </p>
                )}

                {item.descripcion && (
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {item.descripcion}
                  </p>
                )}

                <p className="text-[11px] text-slate-500">
                  ${item.precio} x {item.cantidad}
                </p>
              </div>

              <p className="text-sm font-semibold text-emerald-700">
                ${item.precio * item.cantidad}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-xl font-semibold text-emerald-700">
            ${total}
          </p>
        </div>
      </aside>
    </div>
  );
}

export default Checkout;
