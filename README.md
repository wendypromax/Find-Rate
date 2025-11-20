# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

🧩 Implementación del PSP (Personal Software Process)

Este proyecto aplica el Personal Software Process (PSP) para mejorar la planificación, estimación, control del tiempo y calidad del software desarrollado.

⏱️ 1. Registro del tiempo (Clockify)

Para medir el esfuerzo real del proyecto se registraron las actividades del día en Clockify, siguiendo las fases del PSP:

Fase	Tiempo registrado
Planificación	5h
Diseño	8h
Codificación	4h 20m
Compilación	3h 31m
Corrección de errores	2h
Pruebas	1h 51m

📌 Las capturas completas del registro se encuentran en el informe de la Actividad 4.

🐞 2. Registro de defectos (GitHub Issues)

El control de errores se realizó con GitHub Issues, registrando tanto los defectos abiertos como los ya corregidos.

🔹 Defectos Abiertos

⭐ Las estrellas de calificación muestran valores incorrectos

⭐ Error al publicar reseña: no se inserta en la base de datos

🔹 Defectos Cerrados

✔ No se eliminan usuarios: error en la consulta SQL

✔ Error en el registro: el procedimiento almacenado no inserta el usuario

✔ Error en la validación del usuario y contraseña

Puedes ver todos los issues aquí:
👉 https://github.com/wendypromax/Find-Rate/issues

📊 3. Métricas del proceso

A partir del tiempo registrado y los defectos detectados, se analizaron:

Tiempo invertido por fase

Cantidad de defectos por origen

Fase donde más se introducen errores → Codificación

Fase donde más se detectan errores → Pruebas

Productividad general del día

Estas métricas permiten identificar cuellos de botella y oportunidades de mejora.

✔️ 4. Conclusiones del PSP aplicado

El PSP permitió medir de forma precisa el esfuerzo del proyecto.

Clockify facilitó el registro por fases durante el día.

GitHub Issues proporcionó trazabilidad clara de problemas.

Se identificó que la mayoría de errores provienen de la fase de Codificación.

Se recomienda fortalecer la revisión de código y las pruebas tempranas.

El PSP apoyó la toma de decisiones para mejorar la calidad del desarrollo.

🏁 Fin de la sección PSP
