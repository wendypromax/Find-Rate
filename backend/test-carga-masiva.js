const fs = require('fs');
const path = require('path');

// Crear archivo CSV de prueba
const crearArchivoPrueba = () => {
  const contenido = `nombre,direccion,categoria,descripcion,telefono,email,sitioWeb,horario,precioPromedio,capacidad,latitud,longitud,etiquetas
Restaurante Prueba 1,Calle Test 123,Restaurante,Descripción de prueba,555-1111,test1@test.com,www.test1.com,9-18,25.50,50,40.4168,-3.7038,test1,prueba
Cafetería Prueba 2,Avenida Demo 456,Cafetería,Otra descripción,555-2222,test2@test.com,www.test2.com,8-20,12.75,30,40.4178,-3.7048,test2,café
Hotel Prueba 3,Plaza Example 789,Hotel,Hotel de prueba,555-3333,test3@test.com,www.test3.com,24/7,80.00,100,40.4188,-3.7058,hotel,lujo`;

  const filePath = path.join(__dirname, 'test-upload.csv');
  fs.writeFileSync(filePath, contenido, 'utf8');
  console.log('✅ Archivo de prueba creado:', filePath);
  return filePath;
};

// Ejecutar
crearArchivoPrueba();