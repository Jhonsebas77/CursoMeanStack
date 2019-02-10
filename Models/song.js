'user stric'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SongSchema = new Schema({
  number: { type: String },
  name: { type: String },
  duration: { type: Number },
  file: { type: String },
  album: { type: Schema.ObjectId, ref: 'album' }
  // Hace referencia a el ID de otro Objeto que esta en la BD
});

module.exports = mongoose.model('song', SongSchema);
