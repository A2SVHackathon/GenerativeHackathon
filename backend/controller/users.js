const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
// const Jobs = require('../models/Jobs')
const path = require('path')

// @desc Get all users
// @route Get /api/v1/users
// @access public 
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

// @desc Get single users
// @route Get /api/v1/users/:id
// @access public 
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user){
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success: true, data: user})
})

// @desc create new users
// @route POST /api/v1/users
// @access private 
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)
    res.status(201).json({success: true, data: user})
})

// @desc update user
// @route PUT /api/v1/users/:id
// @access private 
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!user){
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({success: true, data: user})
})

// @desc delete user
// @route DELETE /api/v1/users/:id
// @access private 
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );
    }

    // delete user dependencies
    // Cascade delete courses when a user is deleted
    // await Jobs.deleteMany({user: user._id})

    res.status(200).json({ success: true, data: {} });
})


// @desc upload photo for user
// @route PUT /api/v1/users/:id/photo
// @access private 
exports.uploadUserPhoto = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
        );
    }

    if (!req.files){
        return next(
            new ErrorResponse(`Please upload a file ${req.params.id}`, 400)
            );
    }

    const file = req.files.file

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')){
        return next(
            new ErrorResponse(`Please upload an image file ${req.params.id}`, 400)
            );
    }

    // check file size

    if (file.size > process.env.MAX_FILE_UPLOAD){
        return next(
            new ErrorResponse(`Please upload an image less than 
            ${process.env.MAX_FILE_UPLOAD/1000000} mv ${req.params.id}`, 400)
            );
    }

    // Create custom file name
    file.name = `photo_${user.id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            return next(
                new ErrorResponse(`Pproblem with uploading ${req.params.id}`, 500)
                );
        }
        await User.findByIdAndUpdate(req.params.id, {photo: `/uploads/${file.name}`})
        res.status(200).json({
            success: true,
            data: `/uploads/${file.name}`
        })
    })
})