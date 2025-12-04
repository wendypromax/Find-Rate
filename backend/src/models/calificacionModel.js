// modelos/calificacionModel.js
export class Calificacion {
  constructor({ id_calificacion, puntuacion, comentario, id_usuariofk, id_reseniafk }) {
    this.id_calificacion = id_calificacion;
    this.puntuacion = puntuacion;
    this.comentario = comentario;
    this.id_usuariofk = id_usuariofk;
    this.id_reseniafk = id_reseniafk;
  }
}
