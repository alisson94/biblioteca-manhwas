const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  idioma: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  cap_atual: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  cap_total: {
    type: Number,
    required: true,
    min: 1,
  },
});

const manhwaSchema = new mongoose.Schema(
  {
    titulos: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    capa: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: '',
      trim: true,
    },
    capitulos: {
      type: Number,
      required: true,
      min: 1,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
    links: [linkSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Manhwa', manhwaSchema);