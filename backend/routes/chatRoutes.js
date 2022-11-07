const express = require('express');

const router = express.Router()
const Chat = require('../models/chatModel')
const ErrorHandler = require('../service/errorHandlerService')
// router.route('/')
router.route('/')
    //add a  msg in chat
    .post(async (req, res, next) => {
        try {

            let { message, isGroupChat } = req.body
            //req.body =  {sender ,recievers id ,content of msg ,is group}
            ///if chat already exist push message in the same chat..else create new chat

            let found = await Chat.find({
                $and: [{
                    peopleInvolvedInChat: message.senderId
                },
                {
                    peopleInvolvedInChat: message.receiverId
                },
                {
                    isGroupChat: false
                }
                ]

            })
            if (found.length > 0) {

                let updatedChat = await Chat.updateOne({ _id: found[0]._id }, {
                    $push: {
                        messages: message
                    }
                })
                res.json({ data: 'old chat updated successfully created' })
            }
            else {

                let newChat = new Chat({
                    peopleInvolvedInChat: [message.senderId, message.receiverId],
                    isGroupChat,
                    messages: [message],
                })

                let newChatCreated = await newChat.save()
                if (newChatCreated) {
                    res.json({ data: 'new chat successfully created' })
                }
                else {
                    next(ErrorHandler.serverError())
                }
            }
        }
        catch (err) {
            next(ErrorHandler.serverError(err.message))
        }
    })
    //get all chat message
    .get(async (req, res, next) => {
        try {
            let allChats = await Chat.find({}).populate('peopleInvolvedInChat', '_id name email pic')
            res.json(allChats)
        }
        catch (err) {
            next(ErrorHandler.serverError(err.message))
        }

    })
router.route('/:id')
    //get chat by id
    .get(async (req, res, next) => {
        try {


            let chat = await Chat.findOne({ _id: req.params.id }).populate('peopleInvolvedInChat');
            console.log('chat', chat)
            console.log(chat);
            if (chat) {
                res.json(chat)
            }
            // else {
            //     next(ErrorHandler.notFoundError('Chat not found'))
            // }
        }
        catch (err) {
            console.log(err)
            next(ErrorHandler.notFoundError('Chat not found'))
        }
    })

module.exports = router