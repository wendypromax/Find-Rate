import { useEffect, useState } from "react";

export default function DetalleLugar() {
  const [resenias, setResenias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const idLugar = params.get("id") || 1;

  useEffect(() => {
    const cargarResenias = async () => {
      console.log("🟢 Buscando reseñas del lugar con ID:", idLugar);
      try {
        const res = await fetch(`http://localhost:5000/api/resenias/${idLugar}`);
        if (!res.ok) throw new Error("Error al obtener reseñas del servidor");
        const data = await res.json();
        console.log("📦 Datos recibidos:", data);
        setResenias(data);
      } catch (err) {
        console.error("❌ Error en fetch:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarResenias();
  }, [idLugar]);

  if (cargando) return <p>⏳ Cargando reseñas...</p>;
  if (error) return <p>❌ Error: {error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <h2 style={{ color: "#e85a8e" }}>💬 Reseñas de usuarios</h2>

      {resenias.length === 0 ? (
        <p>No hay reseñas todavía 😢</p>
      ) : (
        resenias.map((r) => (
          <div
            key={r.id_resenia}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <p>
              <strong style={{ color: "#d63384" }}>
                {r.nombre_usuario} {r.apellido_usuario}
              </strong>{" "}
              ⭐ {r.calificacion_resenia}
            </p>
            <p>{r.comentario_resenia}</p>
            <small style={{ color: "#888" }}>
              {new Date(r.fecha_resenia).toLocaleDateString()} {r.hora_resenia}
            </small>
          </div>
        ))
      )}
    </div>
  );
}
