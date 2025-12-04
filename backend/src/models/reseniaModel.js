export class Resenia {
  constructor({
    id_resenia,
    titulo_resenia,
    contenido_resenia,
    fecha_resenia,
    id_usuariofk,
    id_lugarfk,
  }) {
    this.id_resenia = id_resenia;
    this.titulo_resenia = titulo_resenia;
    this.contenido_resenia = contenido_resenia;
    this.fecha_resenia = fecha_resenia;
    this.id_usuariofk = id_usuariofk;
    this.id_lugarfk = id_lugarfk;
  }
}
