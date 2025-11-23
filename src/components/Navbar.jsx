import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ cartCount }) => {
  const [open, setOpen] = useState(false);

  const linkBase =
    "text-sm text-slate-700 hover:text-emerald-600 transition-colors";
  const activeClass = "text-emerald-700 font-medium";

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : ""}`
        }
        onClick={() => setOpen(false)}
      >
        Inicio
      </NavLink>

      <NavLink
        to="/sahumerios"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : ""}`
        }
        onClick={() => setOpen(false)}
      >
        Sahumerios
      </NavLink>

      <NavLink
        to="/aromatizantes"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : ""}`
        }
        onClick={() => setOpen(false)}
      >
        Aromatizantes
      </NavLink>

      <NavLink
        to="/textil"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? activeClass : ""}`
        }
        onClick={() => setOpen(false)}
      >
        Perfume textil
      </NavLink>

      {/* Link a Admin */}
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          `text-xs px-3 py-1 rounded-full border ${
            isActive
              ? "border-emerald-500 text-emerald-700 bg-white"
              : "border-slate-300 text-slate-600 hover:border-emerald-500 hover:text-emerald-700"
          } transition-colors`
        }
        onClick={() => setOpen(false)}
      >
        Admin
      </NavLink>
    </>
  );

  return (
    <header className="backdrop-blur-md bg-white/90 border-b border-slate-200 sticky top-0 z-40 shadow-sm text-soft">

      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo / marca */}
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-xl font-semibold tracking-wide text-slate-900">
            Armonía
          </span>
          <span className="text-sm font-medium text-emerald-600">.ald</span>
        </Link>

        {/* Menú desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks}
        </nav>

        {/* Cart + botón mobile */}
        <div className="flex items-center gap-3">
          {/* Carrito */}
          <Link
            to="/carrito"
            className="relative flex items-center gap-1 text-sm text-slate-700 hover:text-emerald-600 transition-colors"
            onClick={() => setOpen(false)}
          >
            <span role="img" aria-label="carrito">
              🛒
            </span>
            {cartCount > 0 && (
              <span className="text-xs bg-emerald-500 text-white rounded-full px-2 py-0.5 shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Botón hamburguesa (solo mobile) */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 transition"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Abrir menú"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menú mobile desplegable */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-2">
            {navLinks}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
