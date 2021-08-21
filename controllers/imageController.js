const mongoose = require('mongoose')
const Grid = require("gridfs-stream")
let gfs

let connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
    gfs = new Grid(connection.db, mongoose.mongo)
    gfs.collection('userAvatars')
})


exports.getImage = async (req, res) => {
    const readStream = gfs.createReadStream({_id: req.params.fileId, root: 'userAvatars'});
    readStream.pipe(res)
}