import { useState } from "react";

function ConsentimientoDatos({ onAceptar }) {
  const [aceptado, setAceptado] = useState(false);

  return (
    <div style={styles.container}>
      <h3>Tratamiento de datos personales</h3>

      <p>
        Para continuar en <strong>Find & Rate</strong>, debes aceptar el
        tratamiento de tus datos personales para fines de registro,
        autenticación, reseñas y calificaciones, conforme a la política de
        privacidad de la plataforma.
      </p>

      <label style={styles.label}>
        <input
          type="checkbox"
          checked={aceptado}
          onChange={() => setAceptado(!aceptado)}
        />
        Acepto el tratamiento de mis datos personales
      </label>

      <button
        onClick={onAceptar}
        disabled={!aceptado}
        style={{
          ...styles.button,
          backgroundColor: aceptado ? "#4f46e5" : "#9ca3af",
          cursor: aceptado ? "pointer" : "not-allowed",
        }}
      >
        Continuar
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "60px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    background: "#fff",
  },
  label: {
    display: "block",
    margin: "15px 0",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
  },
};

export default ConsentimientoDatos;
