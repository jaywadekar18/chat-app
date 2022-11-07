const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true, trim: true },
}, {
    timestamps: true
});
const chatSchema = new mongoose.Schema({
    peopleInvolvedInChat: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGroupChat: { type: Boolean, default: false },
    messages: [messageSchema]
}, {
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat