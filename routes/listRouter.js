const express = require("express")
const bodyParser = require("body-parser")
const listController = require("../controllers/listController")

const listRouter = express.Router()

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()

listRouter.get("/", listController.userLists)
listRouter.get("/:id", listController.getListPosts)
listRouter.get("/getListPosts/:postNumber", listController.getListPostsByNumber)
listRouter.get("/addToList/:id", listController.addToList)
listRouter.get("/listPostsCount/:listId", listController.getListPostsCount)
listRouter.get("/deletePost/:listId", listController.deletePostFromList)
listRouter.get("/deleteList/:listId", listController.deleteList)
listRouter.post("/createList", urlencodedParser, listController.createList)

module.exports = listRouter