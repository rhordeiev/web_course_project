const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    posts: {
        type: [String]
    },
    ownerId: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("List", listSchema);