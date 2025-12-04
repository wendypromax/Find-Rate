export class Sucursal {
  constructor({
    id_sucursal,
    nombre_sucursal,
    direccion_sucursal,
    telefono_sucursal,
    id_lugarfk,
  }) {
    this.id_sucursal = id_sucursal;
    this.nombre_sucursal = nombre_sucursal;
    this.direccion_sucursal = direccion_sucursal;
    this.telefono_sucursal = telefono_sucursal;
    this.id_lugarfk = id_lugarfk;
  }
}
