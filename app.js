require('dotenv').config()
require('./config/db')

const express = require("express")
const app = express()
const hbs = require("hbs")
const expressHbs = require("express-handlebars")
const path = require("path")
const cookieParser = require('cookie-parser')
const sessions = require("client-sessions")

const homeRouter = require("./routes/homeRouter")
const userRouter = require("./routes/userRouter")
const imageRouter = require("./routes/imageRouter")

app.set("view engine", "hbs")

app.use(express.static(path.join(__dirname, '/public')))

app.use(cookieParser())

app.use(sessions({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 30 * 6 * 1000
}))

app.engine("hbs", expressHbs(
    {
        layoutsDir: "views/layouts",
        default: "layout",
        extname: "hbs"
    }
))

hbs.registerPartials(path.join(__dirname, "views/partials"), err => {
    if (err) {
        console.log(err);
    }
})

app.use("/", homeRouter)
app.use("/user", userRouter)
app.use("/image", imageRouter)
app.listen(process.env.PORT || 8080);
