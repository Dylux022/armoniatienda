import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";   // 👈 AGREGADO

import Home from "./pages/Home";
import Sahumerios from "./pages/Sahumerios";
import Aromatizantes from "./pages/Aromatizantes";
import Textil from "./pages/Textil";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import PedidoEnviado from "./pages/PedidoEnviado";
import AdminPedidos from "./pages/AdminPedidos";

const App = () => {
  // ✅ Inicializar carrito leyendo localStorage UNA sola vez
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      console.error("Error leyendo carrito del localStorage", e);
      return [];
    }
  });

  // ✅ Guardar carrito cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    if (indexToRemove === "all") {
      setCart([]);
      return;
    }
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        
        <Navbar cartCount={cart.length} />

        {/* CONTENIDO PRINCIPAL */}
        <main className="max-w-5xl mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/sahumerios"
              element={<Sahumerios onAddToCart={handleAddToCart} />}
            />

            <Route
              path="/aromatizantes"
              element={<Aromatizantes onAddToCart={handleAddToCart} />}
            />

            <Route
              path="/textil"
              element={<Textil onAddToCart={handleAddToCart} />}
            />

            <Route
              path="/carrito"
              element={<Cart cart={cart} onRemoveItem={handleRemoveFromCart} />}
            />

            <Route path="/admin" element={<Admin />} />

            <Route
              path="/checkout"
              element={<Checkout cart={cart} onClearCart={() => setCart([])} />}
            />

            <Route path="/pedido-enviado" element={<PedidoEnviado />} />

            <Route path="/admin/pedidos" element={<AdminPedidos />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />   {/* 👈 AGREGADO */}
      </div>
    </BrowserRouter>
  );
};

export default App;
