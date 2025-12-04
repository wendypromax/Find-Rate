export class Favoritos {
  constructor({ id_favorito, id_usuariofk, id_lugarfk }) {
    this.id_favorito = id_favorito;
    this.id_usuariofk = id_usuariofk;
    this.id_lugarfk = id_lugarfk;
  }
}
