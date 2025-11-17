import React, { useEffect, useState } from "react";
import { db, auth, googleProvider } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { Link } from "react-router-dom";


const ADMIN_EMAIL = "ellautysk8@gmail.com"; // acá va tu mail

const Admin = () => {
  const [categoria, setCategoria] = useState("sahumerios");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [estado, setEstado] = useState(null);

  const [user, setUser] = useState(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [errorAuth, setErrorAuth] = useState(null);

  // Escuchar estado de autenticación
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (userFb) => {
      setUser(userFb);
      setCargandoAuth(false);
    });

    return () => unsub();
  }, []);

  const handleLogin = async () => {
    setErrorAuth(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setErrorAuth("No se pudo iniciar sesión.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado(null);

    if (!nombre || !descripcion || !precio || !imagen) {
      setEstado({ tipo: "error", mensaje: "Completá todos los campos." });
      return;
    }

    const precioNumber = Number(precio);
    if (isNaN(precioNumber) || precioNumber <= 0) {
      setEstado({
        tipo: "error",
        mensaje: "El precio debe ser un número válido mayor a 0.",
      });
      return;
    }

    try {
      const colRef = collection(db, categoria);
      await addDoc(colRef, {
        nombre,
        descripcion,
        precio: precioNumber,
        imagen,
      });

      setEstado({ tipo: "ok", mensaje: "Producto cargado correctamente." });
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setImagen("");
    } catch (err) {
      console.error("Error guardando producto:", err);
      setEstado({ tipo: "error", mensaje: "No se pudo guardar el producto." });
    }
  };

  // 1) Mientras chequea si estás logueado
  if (cargandoAuth) {
    return <p className="text-slate-300">Verificando sesión...</p>;
  }

  // 2) Si no hay usuario logueado → pedir login
  if (!user) {
    return (
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-semibold text-emerald-300">
          Panel admin – Iniciar sesión
        </h2>
        <p className="text-sm text-slate-400">
          Esta sección es sólo para administración de Armonía.ald.
          Iniciá sesión con tu cuenta de Google para continuar.
        </p>

        <button
          onClick={handleLogin}
          className="px-4 py-2 rounded-full bg-emerald-400 text-slate-950 text-sm font-medium hover:bg-emerald-300 transition-all"
        >
          Iniciar sesión con Google
        </button>

        {errorAuth && (
          <p className="text-xs text-red-300 mt-2">{errorAuth}</p>
        )}
      </div>
    );
  }

  // 3) Si hay usuario pero NO es el admin correcto
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-semibold text-emerald-300">
          Sin permisos
        </h2>
        <p className="text-sm text-slate-400">
          Estás logueado como <span className="text-emerald-300">{user.email}</span>, 
          pero esta cuenta no tiene acceso de administración.
        </p>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-full border border-slate-600 text-slate-200 text-xs hover:bg-slate-900 transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  // 4) Si es el admin correcto → mostrar formulario
  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-emerald-300">
            Panel admin – Cargar producto
          </h2>
          <p className="text-xs text-slate-400">
            Logueado como <span className="text-emerald-300">{user.email}</span>
          </p>
          <Link
  to="/admin/pedidos"
  className="text-xs text-emerald-300 underline block mb-2"
>
  Ver pedidos
</Link>

        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-full border border-slate-600 text-slate-200 text-xs hover:bg-slate-900 transition-all"
        >
          Cerrar sesión
        </button>
      </div>

      <p className="text-sm text-slate-400">
        Desde acá podés cargar productos a las colecciones de Firebase:
        sahumerios, aromatizantes y textil.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4"
      >
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Categoría</label>
          <select
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="sahumerios">Sahumerios</option>
            <option value="aromatizantes">Aromatizantes</option>
            <option value="textil">Perfume textil</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Nombre</label>
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Descripción</label>
          <textarea
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 min-h-[70px]"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Precio</label>
          <input
            type="number"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">URL de la imagen</label>
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-full bg-emerald-400 text-slate-950 text-sm font-medium hover:bg-emerald-300 transition-all"
        >
          Guardar producto
        </button>

        {estado && (
          <p
            className={`text-xs mt-2 ${
              estado.tipo === "ok" ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {estado.mensaje}
          </p>
        )}
      </form>
    </div>
  );
};

export default Admin;
