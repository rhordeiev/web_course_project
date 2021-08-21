const express = require("express")
const homeController = require("../controllers/homeController")

const homeRouter = express.Router()

homeRouter.get("/", homeController.home)
homeRouter.get("/login", homeController.login)
homeRouter.get("/register", homeController.register)

module.exports = homeRouter