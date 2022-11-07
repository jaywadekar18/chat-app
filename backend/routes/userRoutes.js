const express = require('express');
const User = require('../models/userModel')
const router = express.Router()
const bcrypt = require('bcrypt')
const JwtService = require('../service/jwtService')
const ErrorHandler = require('../service/errorHandlerService')
router.route('/').
    ///add a new user (signup)
    post(async (req, res, next) => {
        try {
            let { name, email, pic, password } = req.body;
            const userAlreadyExist = await User.findOne({ email })
            if (userAlreadyExist) {
                next(ErrorHandler.validationError('This email id is already taken!'));
            }

            let hashedPassword = await bcrypt.hash(password, 10)
            let user = new User({
                name, email, pic, password: hashedPassword
            })
            let newUser = await user.save()
            const accessToken = JwtService.sign({ _id: newUser._id })

            res.json({ accessToken: accessToken })
        }

        catch (err) {
            console.log("err",err)
            next(ErrorHandler.serverError(err.message));
        }
    })
router.route('/:keyword')
    //find users matching keyword
    .get(async (req, res, next) => {

        try {
            const keyword = req.params.keyword
            if (!keyword) {
                next(ErrorHandler.notFoundError('Enter some text to search!!'));
            }
            let userList = await User.find({
                $or: [
                    { name: { "$regex": keyword, $options: 'i' } },
                    { email: { "$regex": keyword, $options: 'i' } }
                ]
            });
            if (userList.length > 0) {
                res.json(userList)
            }
            else next(ErrorHandler.notFoundError('No user found'));
        }
        catch (err) {
            next(ErrorHandler.serverError(err.message));
        }
    });
//login
router.route('/login').post(async (req, res, next) => {

    try {
        let { email, password } = req.body;
        let foundUser = await User.findOne({ email })
        if (!foundUser) {
            next(ErrorHandler.wrongCredentials('Wrong username or password'))
        }

        let passwordMatch = await bcrypt.compare(password, foundUser.password);


        console.log('passwatch', passwordMatch)
        if (!passwordMatch) {
            next(ErrorHandler.wrongCredentials('Wrong password'))
        }
        else {
            const accessToken = JwtService.sign({ _id: foundUser._id })
            res.json({
                userId: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                accessToken
            })
        }

    }
    catch (err) {
        next(ErrorHandler.serverError())
    }
})
module.exports = router
