const express = require("express")
const imageController = require("../controllers/imageController")

const imageRouter = express.Router()

imageRouter.get("/:fileId", imageController.getImage)

module.exports = imageRouter