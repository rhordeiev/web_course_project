const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    header: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    creationDate: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Post", postSchema);