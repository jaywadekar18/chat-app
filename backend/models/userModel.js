const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    pic: {
        type: String,
        required:false,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    password: { type: String, required: true },
}, {
    timestamps: true
});
const User = mongoose.model('User' ,userSchema)
module.exports = User