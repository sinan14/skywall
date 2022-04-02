const express = require('express');
const movieController = require('./../controllers/movieController');
const multerController = require('./../controllers/multerController');

const router = express.Router();

router
  .route('/')
  .get(movieController.getMovies)
  .post(multerController.uploadPhoto, movieController.createMovie);

router.get('/commonSearch/:searchKey', movieController.commonSearch);
router.delete('/all', movieController.deleteAllMovies);

router
  .route('/:id')
  .get(movieController.getMovie)
  .delete(movieController.deleteOneMovie);

module.exports = router;
