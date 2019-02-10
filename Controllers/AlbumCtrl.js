const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination')
const Artist = require('../Models/artist');
const Album = require('../Models/album');
const Song = require('../Models/song');

exports.getAlbum = function (req, res) {
  const albumId = req.params.id;
  Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
    if (err) {
      res.status(500).send({ message: 'Error en la peticion' });
    } else {
      if (!album) {
        res.status(404).send({ message: 'El Album no existe' });
      } else {
        res.status(200).send({ album });
      }
    }
  });
};
exports.saveAlbum = function (req, res) {
  const album = new Album();
  const params = req.body;

  album.title = params.title;
  album.description = params.description;
  album.image = 'null';
  album.year = params.year;
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({ message: 'Error al guardar el Album' });
    } else {
      if (!albumStored) {
        res.status(404).send({ message: 'El Album no ha sido guardado' });
      } else {
        res.status(200).send({ album: albumStored });
      }
    }
  });
};
exports.getAllAlbums = function (req, res) {
  const artistId = req.params.id;

  if (!artistId) {
    const find = Album.find({}).sort('title');
  } else {
    const find = Album.find({ artist: artistId }).sort('year');
  }

  find.populate({ path: 'artist' }).exec((err, albums) => {
    if (err) {
      res.status(500).send({ message: 'Error en la peticion' });
    } else {
      if (!albums) {
        res.status(404).send({ message: 'No hay albums' });
      } else {
        res.status(200).send({ albums });
      }
    }
  });

};
exports.updateAlbum = function (req, res) {
  const albumId = req.params.id;
  const update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({ message: 'Error al guardar el album' });
    } else {
      if (!albumUpdated) {
        res.status(404).send({ message: 'El Album no ha sido actualizado' });
      } else {
        res.status(200).send({
          album: albumUpdated
        });
      }
    }
  });
};
exports.deleteAlbum = function (req, res) {
  const albumId = req.params.id;
  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
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
              res.status(200).send({ album: albumRemoved });
            }
          }
        });
      }
    }
  });

};
exports.uploadImage = function (req, res) {
  const albumId = req.params.id;
  const file_name = 'Sin Imagen';

  if (req.files) {
    const file_path = req.files.image.path;
    const file_split = file_path.split('/');
    const file_name = file_split[2];
    const ext_split = file_name.split('.');
    const file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      User.findByIdAndUpdate(albumId, { image: file_name }, (err, userUpdated) => {
        if (err) {
          res.status(500).send({ message: 'Error al actualizar la imagen' });
        } else {
          if (!userUpdated) {
            res.status(400).send({ message: 'No se ha podido actualizar la imagen' })
          } else {
            res.status(200).send({ album: albumUpdated });
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
  const path_file = './uploads/album/' + imageFile;
  fs.exists(path_file, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: 'No Existe la imagen' });
    }
  });
}
