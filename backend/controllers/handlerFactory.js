const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
exports.deleteAll = Model =>
  catchAsync(async (req, res, next) => {
    await Model.deleteMany();
    res.status(200).json({
      status: 'success',
      message: 'All documents from collection deleted'
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // console.log(req.body);
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        ...doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc
    });
  });

exports.backendSearch = (Model, fields) =>
  catchAsync(async (req, res, next) => {
    const regex = new RegExp(req.params.searchKey, 'i');
    const arrayOfRegex = [];
    fields.forEach(e => {
      arrayOfRegex.push({ [e]: regex });
    });
    const filterKey = {
      $or: arrayOfRegex
    };

    const features = new APIFeatures(Model.find(filterKey), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    //get total number of matched documents
    const countDocuments = new APIFeatures(
      Model.countDocuments(filterKey),
      req.query
    ).count();
    const totalNumberOfDocs = await countDocuments.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      nos: doc.length,
      totalNumberOfDocs,
      data: doc
    });
  });
