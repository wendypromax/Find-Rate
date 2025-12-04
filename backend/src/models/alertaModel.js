export class Alerta {
  constructor({ id_alerta, fecha_alerta, estado_alerta, id_usuariofk }) {
    this.id_alerta = id_alerta;
    this.fecha_alerta = fecha_alerta;
    this.estado_alerta = estado_alerta;
    this.id_usuariofk = id_usuariofk;
  }
}
