export class Horario {
  constructor({ id_horario, hora_apertura, hora_cierre, id_diafk, id_lugarfk }) {
    this.id_horario = id_horario;
    this.hora_apertura = hora_apertura;
    this.hora_cierre = hora_cierre;
    this.id_diafk = id_diafk;
    this.id_lugarfk = id_lugarfk;
  }
}
