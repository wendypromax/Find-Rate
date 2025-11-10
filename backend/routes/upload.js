import multer from "multer";
import path from "path";
import fs from "fs";

// Crear la carpeta 'uploads' si no existe
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configurar el almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ruta absoluta segura
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // genera nombre único
  },
});

// Crear y exportar el middleware
export const upload = multer({ storage });

