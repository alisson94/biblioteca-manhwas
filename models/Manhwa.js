const mongoose = require('mongoose');

const manhwaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true, 
  },
  slug:{
    type: String,
    required: true,
    unique: true, // Garante que o slug seja único
  },
  titulo: {

  },
  capa: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    //enum: ['em andamento', 'concluído', 'pausado'],
    //default: 'em andamento',
  },
  capitulos: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  links: [{
    idioma: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    cap_atual: {
      type: Number,
      required: true,
    },
    cap_total: {
      type: Number,
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now, // Data de criação automática
  },
});

module.exports = mongoose.model('Manhwa', manhwaSchema);