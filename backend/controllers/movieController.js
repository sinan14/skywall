const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const { promisify } = require('util');
const factory = require('./handlerFactory');
const Movie = require('./../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
// const ph = require('./../public/images/')

const unlinkAsync = promisify(fs.unlink);

const generateThumbnail = async doc => {
  try {
    const options = {
      width: 150,
      height: 150
      // responseType: 'base64',
      // jpegOptions: { force: true, quality: 90 }
    };

    const data = doc.map(async e => {
      const path = `public/images/${e.photo}`;
      const thumb = await imageThumbnail(path, options);
      return { ...e, thumb };
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

exports.createMovie = factory.createOne(Movie);
exports.getMovies = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  // try {
  //   const options = {
  //     width: 150,
  //     height: 150
  //     // responseType: 'base64',
  //     // jpegOptions: { force: true, quality: 90 }
  //   };
  //   doc.forEach(async e => {
  //     const path = `public/images/${e.photo}`;
  //     e.thumb = await imageThumbnail(path, options);
  //     console.log(e.thumb);
  //   });
  //   console.log(doc);
  // } catch (err) {
  //   console.error(err);
  // }

  // SEND RESPONSE
  // const data = await generateThumbnail(doc);

  // console.log(data);
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: doc
  });
});
exports.getMovie = factory.getOne(Movie);

exports.deleteAllMovies = factory.deleteAll(Movie);

exports.searchByTitle = factory.backendSearch(Movie, ['title']);
exports.searchByCast = factory.backendSearch(Movie, ['cast']);
// exports.commonSearch = factory.backendSearch(Movie, ['title', 'cast']);
exports.commonSearch = factory.backendSearch(Movie, ['title']);

exports.deleteOneMovie = catchAsync(async (req, res, next) => {
  const doc = await Movie.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (doc.photo) {
    const path = `./public/${doc.photo}`;
    if (fs.existsSync(path)) {
      await unlinkAsync(path);
      // fs.unlink(path, function(err) {
      //   if (err) return next(new AppError('photo not found', 404));
      // });
    }
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
