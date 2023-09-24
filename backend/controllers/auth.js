const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
// const Stud = require('../models/Students')

// @desc Register User
// @route POST /api/v1/auth/register
// @access public 
exports.register = asyncHandler( async (req, res, next) => {
    const {name, email, password, role, address, phone, website} = req.body
    
    // create user
    const user = await User.create({
        name,
        email,
        password,
        role,
        address,
        phone,
        website
    })

    // Create token
    // const token = user.getSignedJwtToken()
    // console.log(user)

    res.status(200).json({success: true, name: user.name, id: user._id})
})


// // @desc Register Stud
// // @route POST /api/v1/auth/register/stud
// // @access public 
// exports.registerStud = asyncHandler( async (req, res, next) => {
//     const {name, email, password, role, address, phone, website, department, dob, skillsRequired} = req.body
    
//     // create stud
//     const stud = await Stud.create({
//         name,
//         email,
//         password,
//         role,
//         address,
//         phone,
//         website,
//         department,
//         dob, 
//         skillsRequired
//     })

//     // Create token
//     // const token = stud.getSignedJwtToken()
//     // console.log(stud)

//     res.status(200).json({success: true, name: stud.name, id: stud._id})
// })


// @desc Login User
// @route POST /api/v1/auth/login
// @access public 
exports.login = asyncHandler( async (req, res, next) => {
    const {email, password} = req.body
    
    // validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('please provide an email and password', 400))
    }

    // check for user
    const user = await User.findOne({email}).select('+password')

    if (!user) {
        // check for stud
        const stud = await Stud.findOne({email}).select('+password')

        if (!stud) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        // check if password matches
        const isMatch = await stud.matchPassword(password)

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401))
        }

        // Create token
        // const token = stud.getSignedJwtToken()

        res.status(200).json({success: true, role: "Student", name: stud.name, id: stud._id})
    }

    // check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    // Create token
    // const token = user.getSignedJwtToken()

    res.status(200).json({success: true, role: "Publisher", name: user.name, id: user._id})

})