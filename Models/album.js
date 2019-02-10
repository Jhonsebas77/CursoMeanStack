'user stric'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlbumSchema = new Schema({
  title: { type: String },
  description: { type: String },
  year: { type: Number },
  image: { type: String },
  artist: { type: Schema.ObjectId, ref: 'artist' }
  // Hace referencia a el ID de otro Objeto que esta en la BD
});

module.exports = mongoose.model('album', AlbumSchema);
