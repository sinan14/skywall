const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide movie title!'],
      unique: [true, 'This title is already registered']
    },
    cast: {
      type: String,
      required: [true, 'Please provide cast']
    },
    genre: {
      type: String,
      required: [true, 'Please provide movie genre!']
    },
    year: {
      type: Date,
      required: [true, 'please provide release year']
    },

    ratings: {
      type: Number,
      required: [true, 'Please provide rating']
    },

    description: {
      type: String,
      required: [true, 'Please provide some description!']
    },

    photo: {
      type: String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const Movie = mongoose.model('Movie', movieSchema);
movieSchema.index({
  cast: 1
});
movieSchema.index({
  year: 1
});
movieSchema.index({
  title: 1
});
movieSchema.virtual('thumb').get(function() {
  const folder = 'images';
  return `${process.env.BASE_URL}/${folder}/${this.photo}`;
});

module.exports = Movie;
