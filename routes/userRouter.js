const express = require("express")
const bodyParser = require("body-parser")
const userController = require("../controllers/userController")
const postRouter = require("./postRouter")
const listRouter = require("./listRouter")

const userRouter = express.Router()

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json()

const upload = require("../middleware/uploadFile")

userRouter.use("/post", postRouter)
userRouter.use("/lists", listRouter)

userRouter.get("/news", userController.userNews)
userRouter.get("/logout", userController.logoutUser)
userRouter.get("/deleteUser", userController.deleteUser)
userRouter.get("/find", userController.findUsersPage)
userRouter.get("/findUsers", userController.findUsers)
userRouter.get("/:id", userController.userPage)
userRouter.post("/updateUserAvatar", urlencodedParser, upload.single("userAvatar"),  userController.updateUserAvatar)
userRouter.post("/updateUserName", urlencodedParser, userController.updateUserName)
userRouter.post("/updateUserPersonalInfo", urlencodedParser, userController.updateUserPersonalInfo)
userRouter.post("/updateUserAdditionalInfo", urlencodedParser, userController.updateUserAdditionalInfo)
userRouter.post("/loginUser", urlencodedParser, userController.loginUser)
userRouter.post("/createUser", urlencodedParser, upload.single("userAvatar"), userController.createUser)

module.exports = userRouter