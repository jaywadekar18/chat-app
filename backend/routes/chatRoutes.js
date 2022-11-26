const express = require('express');
const router = express.Router()
const Chat = require('../models/chatModel')
const ErrorHandler = require('../service/errorHandlerService')
// router.route('/')
router.route('/')
    //add a  msg in chat
    .post(async (req, res, next) => {
        try {

            let { message, isGroupChat, chatId } = req.body
            //req.body =  {sender ,recievers id ,content of msg ,is group}
            ///if chat already exist push message in the same chat..else create new chat;
            let found;

            if (chatId) {

                found = await Chat.findOne({ _id: chatId });

            }
            else {

                found = await Chat.findOne({
                    $and: [{
                        peopleInvolvedInChat: message.senderId
                    },
                    {
                        peopleInvolvedInChat: message.receiverId
                    },
                    {
                        isGroupChat
                    }
                    ]
                })
            }
            if (found) {

                let updatedChat = await Chat.updateOne({ _id: found._id }, {
                    $push: {
                        messages: message
                    }
                })
                console.log('updatedchat', updatedChat)
                res.json({ ...message, _id: Math.random(), status: "old chat updated" })
            }
            else {
                ///new chat 

                let newChat = new Chat({
                    peopleInvolvedInChat: [message.senderId, message.receiverId],
                    isGroupChat,
                    messages: [message],
                })

                let newChatCreated = await newChat.save();

                console.log("newChatCreated", newChatCreated)
                if (newChatCreated) {
                    res.json({ ...message, status: "new chat created",
                     chatId: newChatCreated._id, isNew: true })
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
router.route('/allchats/:id').get(async (req, res, next) => {
    try {
        let allChats = await Chat.find({ peopleInvolvedInChat: req.params.id })
            .populate('peopleInvolvedInChat', '_id name email pic')
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

            if (chat) {
                res.json(chat)
            }
            // else {
            //     next(ErrorHandler.notFoundError('Chat not found'))
            // }
        }
        catch (err) {

            next(ErrorHandler.notFoundError('Chat not found'))
        }
    })
router.route('/between/:firstUser/:secondUser')
    .get(async (req, res, next) => {

        try {
            let firstUser = req.params.firstUser;
            let secondUser = req.params.secondUser
            let found = await Chat.findOne({
                $and: [{
                    peopleInvolvedInChat: firstUser
                },
                {
                    peopleInvolvedInChat: secondUser
                },
                {
                    isGroupChat: false
                }
                ]
            })

            if (found) {
                res.json(found)
            }
            else {
                next(ErrorHandler.notFoundError('No such chat exists!!'))
            }

        }
        catch (err) {

        }
    })

router.route('/creategroup')
    .post(async (req, res, next) => {

        try {
            let { groupMembers, groupName } = req.body;
            let newGroup = new Chat({
                peopleInvolvedInChat: [...groupMembers],
                isGroupChat: true,
                groupName,
                messages: []
            })
            let result = await newGroup.save();

            res.json(result)
        }
        catch (err) {

            next(ErrorHandler.serverError(err.message))
        }

    })
router.route('/group/:id')
    .delete(async (req, res, next) => {

        try {

        }
        catch (err) {
        }
    })
    .put(async (req, res, next) => {

        try {

        }
        catch (err) {
        }
    })
module.exports = router