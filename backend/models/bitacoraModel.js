export class Bitacora {
  constructor({ id_bitacora, descripcion, fecha_bitacora, id_usuariofk }) {
    this.id_bitacora = id_bitacora;
    this.descripcion = descripcion;
    this.fecha_bitacora = fecha_bitacora;
    this.id_usuariofk = id_usuariofk;
  }
}
