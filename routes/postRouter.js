const express = require("express")
const bodyParser = require("body-parser")
const postController = require("../controllers/postController")

const postRouter = express.Router()

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()

const upload = require("../middleware/uploadFile")

postRouter.get("/new", postController.new)
postRouter.get("/postCount", postController.getPostCount)
postRouter.get("/:postNumber", postController.getPost)
postRouter.get("/deletePost/:id", postController.deletePost)
postRouter.post("/newPost", urlencodedParser, upload.single("postPicture"), postController.newPost)
postRouter.post("/updatePost", urlencodedParser, upload.single("postPicture"), postController.updatePost)

module.exports = postRouter