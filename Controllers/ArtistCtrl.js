const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination')
const Artist = require('../Models/artist');
const Album = require('../Models/album');
const Song = require('../Models/song');

exports.getArtist = function (req, res) {
  const artistId = req.params.id;
  Artist.findById(artistId, (err, artist) => {
    if (err) {
      res.status(500).send({ message: 'Error en la peticion' });
    } else {
      if (!artist) {
        res.status(404).send({ message: 'El Artista no existe' });
      } else {
        res.status(200).send({ artist });
      }
    }
  });
};
exports.saveArtist = function (req, res) {
  const artist = new Artist();
  const params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save((err, artistStored) => {
    if (err) {
      res.status(500).send({ message: 'Error al guardar el Artista' });
    } else {
      if (!artistStored) {
        res.status(404).send({ message: 'El Artista no ha sido guardado' });
      } else {
        res.status(200).send({ artist: artistStored });
      }
    }
  });
};
exports.getAllArtists = function (req, res) {
  if (req.params) {
    const page = req.params.page;
  } else {
    const page = 1;
  }
  const itemsPerPage = 3;

  Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
    if (err) {
      res.status(500).send({ message: 'Error en la peticion' });
    } else {
      if (!artists) {
        res.status(404).send({ message: 'No hay artistas' });
      } else {
        return res.status(200).send({
          total_item: total,
          artists: artists
        });
      }
    }
  });
};
exports.updateArtist = function (req, res) {
  const artistId = req.params.id;
  const update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if (err) {
      res.status(500).send({ message: 'Error al guardar el artista' });
    } else {
      if (!artistUpdated) {
        res.status(404).send({ message: 'El Artista no ha sido actualizado' });
      } else {
        res.status(200).send({
          artist: artistUpdated
        });
      }
    }
  });
};
exports.deleteArtist = function (req, res) {
  const artistId = req.params.id;
  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if (err) {
      res.status(500).send({ message: 'Error al eliminar el Artista' });
    } else {
      if (!artistRemoved) {
        res.status(404).send({ message: 'El Artista no ha sido eliminado' });
      } else {
        Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
          if (err) {
            res.status(500).send({ message: 'Error al eliminar el album' });
          } else {
            if (!albumRemoved) {
              res.status(404).send({ message: 'El album se ha eliminado' });
            } else {
              Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                if (err) {
                  res.status(500).send({ message: 'Error al eliminar la cancion' });
                } else {
                  if (!songRemoved) {
                    res.status(404).send({ message: 'La cancion no ha sido eliminada' });
                  } else {
                    res.status(200).send({ artist: artistRemoved });
                  }
                }
              });
            }
          }
        });
      }
    }
  });
};

exports.uploadImage = function (req, res) {
  const artistId = req.params.id;
  const file_name = 'Sin Imagen';

  if (req.files) {
    const file_path = req.files.image.path;
    const file_split = file_path.split('/');
    const file_name = file_split[2];
    const ext_split = file_name.split('.');
    const file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
        if (err) {
          res.status(500).send({ message: 'Error al actualizar la imagen' });
        } else {
          if (!artistUpdated) {
            res.status(400).send({ message: 'No se ha podido actualizar la imagen' })
          } else {
            res.status(200).send({ artist: artistUpdated });
          }
        }
      });
    } else {
      res.status(200).send({ message: 'Tipo de archivo no valido' });
    }

  } else {
    res.status(200).send({ message: 'No ha subido ninguna imagen' });
  }
};
exports.getImageFile = function (req, res) {
  const imageFile = req.params.imageFile;
  const path_file = './uploads/artist/' + imageFile;
  fs.exists(path_file, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: 'No Existe la imagen' });
    }
  });
}
