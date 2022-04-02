// const sharp = require('sharp');
const multer = require('multer');
const AppError = require('./../utils/appError');
// const catchAsync = require('./../utils/catchAsync');

// const multerStorage = multer.memoryStorage();
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    req.body.photo = `user-${Date.now()}.${ext}`;
    cb(null, req.body.photo);
  }
});

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image! Please upload only images.', 400), false);
//   }
// };

const multerFilter = (req, file, cb) => {
  // console.log(file);
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('app')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadPhoto = upload.single('photo');

// exports.resizePhoto = catchAsync(async (req, res, next) => {
//   console.log(req.body);

//   if (!req.file) return next();

//   // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//   req.body.photo = `user-${Date.now()}.jpeg`;
//   console.log(req.body);
//   await sharp(req.file.buffer)
//     .resize(150, 150)
//     .toFormat('jpeg')
//     .jpeg({ quality: 60 })
//     .toFile(`public/thumb/${req.body.photo}`);

//   next();
// });
