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
      // Necesitamos id, categoria y un stock numérico para que tenga sentido
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
          // Firestore se encarga de restar desde el valor actual
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


  // Actualizar estado de un pedido
  // 🔸 y descontar stock AUTOMÁTICAMENTE cuando pasa a "pagado" por primera vez
const actualizarEstado = async (pedido, nuevoEstado) => {
  try {
    const yaDescontado = pedido.stockDescontado === true;

    const pasaAPagado =
      pedido.estado !== "pagado" && nuevoEstado === "pagado";

    // Si estaba pagado y lo pasás a pendiente o cancelado → devolvemos stock
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


  // Armar mensaje para WhatsApp
  const generarMensaje = (p) => {
    const fechaFormateada = p.fecha
      ? new Date(p.fecha).toLocaleString()
      : "—";

    const productosTexto = p.items
      ?.map(
        (i) =>
          `• ${i.nombre} — $${i.precio} x ${i.cantidad} = $${
            i.precio * i.cantidad
          }`
      )
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

  // Pantallas de permisos
  if (loadingAuth)
    return <p className="text-slate-300">Verificando sesión...</p>;
  if (!user)
    return (
      <p className="text-red-300">
        Tenés que iniciar sesión para ver los pedidos.
      </p>
    );
  if (!ADMIN_EMAILS.includes(user.email))
    return (
      <p className="text-red-300">
        Esta cuenta no tiene permisos para ver pedidos.
      </p>
    );

  // Vista principal
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-semibold text-emerald-300">
        Pedidos recibidos 🧾
      </h2>

      {pedidos.length === 0 ? (
        <p className="text-slate-400">Todavía no hay pedidos.</p>
      ) : (
        pedidos.map((p) => (
          <div
            key={p.id}
            className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 space-y-3"
          >
            <p className="text-[11px] text-slate-500">
              <strong>ID:</strong> {p.id}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Fecha:</strong>{" "}
              {p.fecha ? new Date(p.fecha).toLocaleString() : "—"}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Cliente:</strong>{" "}
              <span className="text-emerald-300">{p.nombreCliente}</span>
            </p>

            <p className="text-sm text-slate-300">
              <strong>Teléfono:</strong> {p.telefono}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Método pago:</strong> {p.metodoPago}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Entrega:</strong> {p.entrega}
            </p>

            <p className="text-sm text-slate-300">
              <strong>Total:</strong>{" "}
              <span className="text-emerald-300">${p.total}</span>
            </p>

            {/* SELECT DEL ESTADO */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-300">
                <strong>Estado:</strong>
              </p>
            <select
  value={p.estado}
  onChange={(e) => actualizarEstado(p, e.target.value)}
  className="text-xs bg-slate-800 border border-slate-600 rounded-full px-2 py-1 text-slate-200"
>
  <option value="pendiente">Pendiente</option>
  <option value="pagado">Pagado (descuenta stock)</option>
  <option value="entregado">Entregado</option>
  <option value="cancelado">Cancelado (devuelve stock)</option>
</select>

            </div>

            {/* LISTA DE PRODUCTOS */}
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-200">
                Productos:
              </p>
              <ul className="list-disc ml-5 text-[13px] text-slate-400 space-y-1">
                {p.items?.map((i, idx) => (
                  <li key={idx}>
                    {i.nombre} — ${i.precio} x {i.cantidad} = $
                    {i.precio * i.cantidad}
                  </li>
                ))}
              </ul>
            </div>

            {/* BOTÓN WHATSAPP */}
            <button
              onClick={() => enviarWhatsapp(p)}
              className="mt-3 w-full bg-green-500/90 hover:bg-green-400 text-slate-900 font-medium py-1.5 rounded-full transition-all text-sm"
            >
              Enviar por WhatsApp
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPedidos;
