import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ cartCount = 0 }) => {
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center text-emerald-300 text-sm">
            🕯️
          </div>
          <div>
            <p className="text-lg font-semibold tracking-wide">
              <span className="text-emerald-300">Armonía</span>
              <span className="text-emerald-500">.ald</span>
            </p>
            <p className="text-xs text-slate-400">
              Fragancias para cada rincón.
            </p>
          </div>
        </div>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-slate-200">
          <li>
            <Link to="/" className="hover:text-emerald-300 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/sahumerios"
              className="hover:text-emerald-300 transition-colors"
            >
              Sahumerios
            </Link>
          </li>
          <li>
            <Link
              to="/aromatizantes"
              className="hover:text-emerald-300 transition-colors"
            >
              Aromatizantes
            </Link>
          </li>
          <li>
            <Link
              to="/textil"
              className="hover:text-emerald-300 transition-colors"
            >
              Perfume textil
            </Link>
          </li>
        </ul>

               {/* Carrito */}
        <Link
          to="/carrito"
          className="relative text-xs md:text-sm px-3 py-1.5 rounded-full border border-emerald-400/60 text-emerald-200 hover:bg-emerald-400/10 transition-all"
        >
          Carrito
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-400 text-slate-900 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;
