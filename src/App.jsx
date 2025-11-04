import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Conocenos from "./pages/Conocenos";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import RecuperarCuenta from "./pages/RecuperarCuenta";
import ResetPassword from "./pages/ResetPassword";
import EscribirResena from "./pages/EscribirResena";
import Hoteles from "./pages/categorias/Hoteles";
import Restaurantes from "./pages/categorias/Restaurantes";
import Entretenimiento from "./pages/categorias/Entretenimiento";
import Atracciones from "./pages/categorias/Atracciones";
import Dashboard from "./pages/Dashboard";
import Favoritos from "./pages/Favoritos";
import LugaresForm from "./pages/BuscarLugares";
import Profile from "./pages/profile";
import EditarPerfil from "./pages/EditarPerfil";
import BuscarLugares from "./pages/BuscarLugares"; // ✅ Importar componente de búsqueda

// Blog
import PostList from "./pages/blog/PostList";
import PostDetail from "./pages/blog/PostDetail";
import CreatePost from "./pages/blog/createpost";

// Sistema de notificaciones
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 shadow-sm bg-white">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 bg-clip-text text-transparent flex items-center">
            Find & Rate
          </h1>
          <span className="text-purple-500 text-2xl">⭐</span>
        </div>
        <nav className="flex space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-pink-600">Inicio</Link>
          <Link to="/registro" className="hover:text-pink-600">Registro</Link>
          <Link to="/login" className="hover:text-pink-600">Login</Link>
          <Link to="/conocenos" className="hover:text-pink-600">Conócenos</Link>
          <Link to="/blog" className="hover:text-pink-600">Blog</Link>
          <Link to="/buscar" className="hover:text-pink-600">Buscar Lugares</Link> {/* ✅ Nuevo link */}
        </nav>
      </header>

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conocenos" element={<Conocenos />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/escribir-resena" element={<EscribirResena />} />
        <Route path="/hoteles" element={<Hoteles />} />
        <Route path="/restaurantes" element={<Restaurantes />} />
        <Route path="/entretenimiento" element={<Entretenimiento />} />
        <Route path="/atracciones" element={<Atracciones />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/EditarPerfil" element={<EditarPerfil />} />
        <Route path="/lugaresform" element={<LugaresForm />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/buscar" element={<BuscarLugares />} /> {/* ✅ Nueva ruta */}

        {/* Blog */}
        <Route path="/blog" element={<PostList />} />
        <Route path="/blog/post/:id" element={<PostDetail />} />
        <Route path="/blog/create" element={<CreatePost />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <h1 className="text-center text-2xl mt-20 text-pink-600">
              Página no encontrada 💭
            </h1>
          }
        />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 6000,
          style: {
            background: "#fff0f6",
            color: "#d63384",
            border: "1px solid #f0a6c5",
            fontWeight: "bold",
            padding: "12px 18px",
            borderRadius: "12px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            transition: "all 0.4s ease-in-out",
          },
          iconTheme: { primary: "#ec4899", secondary: "#fff" },
        }}
      />
    </Router>
  );
}

export default App;
