const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')


exports.deleteOne = Model => catchAsync(async (req, res, next) => {
   const document = await Model.findByIdAndDelete(req.params.id)

   if (!document) return next(new AppError('No document found with that id', 404))

   res.status(204).json({
      status: 'success',
      data: null
   })
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
   const modelName = await Model.collection.collectionName.slice(0, -1)

   const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
   });

   if (!document) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
   }

   res.status(200).json({
      status: 'success',
      data: {
         [modelName]: document
      }
   });
})

exports.getOne = (Model, popOpt, selOpt = '-__v -id') => catchAsync(async (req, res, next) => {
   const modelName = Model.collection.collectionName.slice(0, -1)

   let query = Model.findById(req.params.id)

   if (!query) return next(new AppError('No document found with that ID', 404))

   if (popOpt) query.populate(popOpt)
   query.select(selOpt)

   const document = await query

   res.status(201).json({
      status: 'success',
      message: `${modelName} has successfully received`,
      [modelName]: document
   })
})