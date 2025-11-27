import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// MULTI-ADMIN: Lista de correos autorizados
const ADMIN_EMAILS = [
  "dylanc021684@gmail.com",
  "thagostina@gmail.com",
   "Armonia.ald@gmail.com",
  "ellautysk8@gmail.com",
];

// Tu número de WhatsApp en formato internacional
const ADMIN_WHATSAPP = "5491130560849";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Verificar sesión del usuario
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  // Cargar pedidos desde Firestore
  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const snap = await getDocs(collection(db, "pedidos"));
        const data = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // Ordenar por fecha (más nuevos arriba)
        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setPedidos(data);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
      }
    };

    if (user && ADMIN_EMAILS.includes(user.email)) {
      cargarPedidos();
    }
  }, [user]);

  // 🔹 Descontar stock de TODOS los productos de un pedido
  const descontarStockDePedido = async (pedido) => {
    if (!pedido.items || !Array.isArray(pedido.items)) return;

    const ops = pedido.items.map(async (item) => {
      if (!item.id || !item.categoria || typeof item.cantidad !== "number") {
        return;
      }

      let colName = null;
      if (item.categoria === "sahumerios") colName = "sahumerios";
      else if (item.categoria === "aromatizantes") colName = "aromatizantes";
      else if (item.categoria === "textil") colName = "textil";

      if (!colName) return;

      try {
        const ref = doc(db, colName, item.id);
        await updateDoc(ref, {
          stock: increment(-item.cantidad),
        });
      } catch (err) {
        console.error("Error actualizando stock para item:", item, err);
      }
    });

    await Promise.all(ops);
  };

  // 🔹 Volver a sumar stock de TODOS los productos de un pedido
  const reponerStockDePedido = async (pedido) => {
    if (!pedido.items || !Array.isArray(pedido.items)) return;

    const ops = pedido.items.map(async (item) => {
      if (!item.id || !item.categoria || typeof item.cantidad !== "number") {
        return;
      }

      let colName = null;
      if (item.categoria === "sahumerios") colName = "sahumerios";
      else if (item.categoria === "aromatizantes") colName = "aromatizantes";
      else if (item.categoria === "textil") colName = "textil";

      if (!colName) return;

      try {
        const ref = doc(db, colName, item.id);
        await updateDoc(ref, {
          stock: increment(item.cantidad), // 👈 volvemos a sumar
        });
      } catch (err) {
        console.error("Error reponiendo stock para item:", item, err);
      }
    });

    await Promise.all(ops);
  };

  // Actualizar estado de un pedido y manejar stock
  const actualizarEstado = async (pedido, nuevoEstado) => {
    try {
      const yaDescontado = pedido.stockDescontado === true;

      const pasaAPagado =
        pedido.estado !== "pagado" && nuevoEstado === "pagado";

      const pasaAPendienteOCancelado =
        pedido.estado === "pagado" &&
        (nuevoEstado === "pendiente" || nuevoEstado === "cancelado");

      let nuevoFlagStock = pedido.stockDescontado || false;

      if (pasaAPagado && !yaDescontado) {
        await descontarStockDePedido(pedido);
        nuevoFlagStock = true;
      } else if (pasaAPendienteOCancelado && yaDescontado) {
        await reponerStockDePedido(pedido);
        nuevoFlagStock = false;
      }

      await updateDoc(doc(db, "pedidos", pedido.id), {
        estado: nuevoEstado,
        stockDescontado: nuevoFlagStock,
      });

      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedido.id
            ? {
                ...p,
                estado: nuevoEstado,
                stockDescontado: nuevoFlagStock,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  // Armar mensaje para WhatsApp (incluyendo aroma si existe)
  const generarMensaje = (p) => {
    const fechaFormateada = p.fecha
      ? new Date(p.fecha).toLocaleString()
      : "—";

    const productosTexto = p.items
      ?.map((i) => {
        const aroma =
          i.aromaSeleccionado || i.aroma || i.scent || null;
        const aromaTexto = aroma ? ` (Aroma: ${aroma})` : "";
        return `• ${i.nombre}${aromaTexto} — $${i.precio} x ${
          i.cantidad
        } = $${i.precio * i.cantidad}`;
      })
      .join("\n");

    return `
Nuevo pedido para Armonía.ALD 💚

Cliente: ${p.nombreCliente || "—"}
Teléfono: ${p.telefono || "—"}
Método de pago: ${p.metodoPago || "—"}
Entrega: ${p.entrega || "—"}

Productos:
${productosTexto || "—"}

Total: $${p.total}
Estado: ${p.estado}

Fecha: ${fechaFormateada}
ID del pedido: ${p.id}
    `;
  };

  // Enviar por WhatsApp
  const enviarWhatsapp = (pedido) => {
    const mensaje = encodeURIComponent(generarMensaje(pedido));
    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${mensaje}`;
    window.open(url, "_blank");
  };

  // Pantallas de permisos (versión linda)
  if (loadingAuth) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 px-5 py-4 text-sm text-slate-700">
          Verificando sesión...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-amber-200 px-5 py-4 text-sm text-slate-700">
          Tenés que iniciar sesión para ver los pedidos.  
          <span className="block text-xs text-slate-500 mt-1">
            Iniciá sesión desde el panel de administración.
          </span>
        </div>
      </div>
    );
  }

  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-rose-200 px-5 py-4 text-sm text-slate-700">
          Esta cuenta no tiene permisos para ver pedidos.
          <span className="block text-xs text-slate-500 mt-1">
            Estás logueado como{" "}
            <span className="font-medium text-slate-900">{user.email}</span>.
          </span>
        </div>
      </div>
    );
  }

  // Vista principal
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Pedidos recibidos 🧾
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Panel interno de administración — Armonía.ALD
          </p>
        </div>

        <p className="text-[11px] text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1 self-start sm:self-auto">
          Logueado como{" "}
          <span className="font-medium text-slate-900">{user.email}</span>
        </p>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-700">Todavía no hay pedidos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] text-slate-500">
                  <span className="font-semibold">ID:</span> {p.id}
                </p>
                <p className="text-[11px] text-slate-500">
                  <span className="font-semibold">Fecha:</span>{" "}
                  {p.fecha ? new Date(p.fecha).toLocaleString() : "—"}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <p className="text-slate-700">
                  <span className="font-semibold">Cliente:</span>{" "}
                  <span className="text-slate-900">
                    {p.nombreCliente || "—"}
                  </span>
                </p>

                <p className="text-slate-700">
                  <span className="font-semibold">Teléfono:</span>{" "}
                  {p.telefono || "—"}
                </p>

                <p className="text-slate-700">
                  <span className="font-semibold">Método de pago:</span>{" "}
                  {p.metodoPago || "—"}
                </p>

                <p className="text-slate-700">
                  <span className="font-semibold">Entrega:</span>{" "}
                  {p.entrega || "—"}
                </p>

                <p className="text-slate-700">
                  <span className="font-semibold">Total:</span>{" "}
                  <span className="font-semibold text-emerald-700">
                    ${p.total}
                  </span>
                </p>

                {p.stockDescontado && (
                  <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-1 inline-flex items-center w-max">
                    Stock descontado
                  </p>
                )}
              </div>

              {/* Estado */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <p className="text-sm text-slate-700 font-semibold">
                  Estado:
                </p>
                <select
                  value={p.estado}
                  onChange={(e) => actualizarEstado(p, e.target.value)}
                  className="text-xs bg-white border border-slate-300 rounded-full px-3 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado (descuenta stock)</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado (devuelve stock)</option>
                </select>
              </div>

              {/* Lista de productos */}
              <div className="mt-2">
                <p className="text-sm font-semibold text-slate-800">
                  Productos
                </p>
                <ul className="mt-1 text-[13px] text-slate-700 space-y-1 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-200">
                  {p.items?.map((i, idx) => {
                    const aroma =
                      i.aromaSeleccionado || i.aroma || i.scent || null;

                    return (
                      <li key={idx} className="flex justify-between gap-3">
                        <span className="truncate">
                          {i.nombre}
                          {aroma && (
                            <span className="text-[11px] text-slate-500">
                              {" "}
                              — Aroma: {aroma}
                            </span>
                          )}{" "}
                          — ${i.precio} x {i.cantidad}
                        </span>
                        <span className="font-medium text-slate-900">
                          ${i.precio * i.cantidad}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Botón WhatsApp */}
              <button
                onClick={() => enviarWhatsapp(p)}
                className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-full transition-all text-sm"
              >
                Enviar resumen por WhatsApp
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPedidos;
