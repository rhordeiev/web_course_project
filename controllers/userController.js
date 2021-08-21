const mongoose = require('mongoose')
const formidable = require('formidable')
const bcrypt = require("bcrypt")
const fs = require("fs")
const Grid = require('gridfs-stream')
const User = require("../models/userSchema")
const Post = require("../models/postSchema")
const List = require("../models/listSchema")
const menus = require("../helpers/menuTypes")

exports.createUser = async (req, res) => {
    try {
        const user = new User({name: req.body.userName, surname: req.body.userSurname, birthDate: req.body.userBirthDate,
            gender: req.body.userGender, email: req.body.userEmail, login: req.body.userLogin, password: req.body.userPassword,
            info: req.body.userInfo, avatar: req.file.id})
        await user.save()
        res.cookie('registerSuccess', true)
        res.redirect('/login')
    } catch (e) {
        const errors = {}
        if (e.keyValue.login) {
            errors.login = "Такий логін вже використовується."
        }
        if (e.keyValue.email) {
            errors.email = "Така пошта вже використовується."
        }
        let gfs = Grid(mongoose.connection.db, mongoose.mongo)
        gfs.remove({ _id: req.file.id, root: "userAvatars"})
        res.cookie('errors', errors)
        res.cookie('errorsExist', true)
        //console.log(errors.name)
        res.redirect('/register')
    }
}

exports.loginUser = async (req, res) => {
    await User.findOne({login: req.body.loginName}, (err, user) => {
        if(err || !user || !bcrypt.compare(req.body.loginPassword, user.password)) {

            res.cookie('loginErrorText', "Такого користувача не знайдено. Перевірте будь ласка логін та пароль ще раз.")
            res.redirect("/login")
        } else {
            req.session.userId = user._id
            res.redirect("/user/" + req.session.userId)
        }
    })
}

exports.updateUserName = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    await User.findOne({_id: req.body.userId}, (err, user) => {
        if(err || !user) {
            res.send("Помилка зі зміненням імені користувача.")
        } else {
            user.name = req.body.userName
            user.surname = req.body.userSurname
            user.save()
            Post.find({ownerId: req.body.userId}, (err, posts) => {
                if(err || !posts) {
                    res.send("Помилка зі зміненням імені користувача.")
                } else {
                    posts.forEach(post => {
                        post.ownerName = user.name + " " + user.surname
                        post.save()
                    })
                }
            })
            res.send({
                name: user.name,
                surname: user.surname
            })
        }
    })
}

exports.updateUserAvatar = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    await User.findOne({_id: req.body.userId}, (err, user) => {
        if(err || !user) {
            res.send("Помилка зі зміненням імені користувача.")
        } else {
            let gfs = Grid(mongoose.connection.db, mongoose.mongo)
            gfs.remove({ _id: req.body.userAvatarId, root: "userAvatars"})
            user.avatar = req.file.id
            user.save()
            res.send({
                avatar: req.file.id
            })
        }
    })
}

exports.updateUserPersonalInfo = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    await User.findOne({_id: req.body.userId}, (err, user) => {
        if(err || !user) {
            res.send("Помилка зі зміненням імені користувача.")
        } else {
            user.birthDate = req.body.userBirthDate
            user.gender = req.body.userGender
            user.email = req.body.userEmail
            user.save()
            res.send({
                birthDate: user.birthDate,
                gender: user.gender,
                email: user.email
            })
        }
    })
}

exports.updateUserAdditionalInfo = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    await User.findOne({_id: req.body.userId}, (err, user) => {
        if(err || !user) {
            res.send("Помилка зі зміненням імені користувача.")
        } else {
            user.info = req.body.userInfo
            user.save()
            res.send({
                info: user.info,
            })
        }
    })
}

exports.userPage = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    let menu
    const user = await User.findOne({_id: req.params["id"]}).lean()
    const thisUser = await User.findOne({_id: req.session.userId}).lean()
    let posts = await Post.find({ownerId: req.params["id"]}).lean()
    if (user === null || user.role === "Admin") {
        res.redirect("/user/news")
    }
    let userPrivilege = {}
    if (req.params["id"] === req.session.userId) {
        userPrivilege.thisUser = true
    }
    if(thisUser.role === "User") {
        menu = menus("user", req.session.userId)
    } else {
        menu = menus("admin")
        userPrivilege.thisUser = false
        userPrivilege.admin = true
    }
    let postNumber = req.query.post
    if (!postNumber || !/^\d+$/.test(postNumber) || postNumber > posts.length || postNumber < 1) {
        postNumber = 1
    }
    let postByQuery
    for (let i = 0; i < posts.length; i++) {
        if (parseInt(postNumber) === (i + 1)) {
            posts = posts.reverse()
            postByQuery = posts[i]
        }
    }
    let lists = []
    if (thisUser && thisUser.lists && thisUser.lists.length > 0) {
        for (let i = 0; i < thisUser.lists.length; i++) {
            let list = await List.findOne({_id: thisUser.lists[i]}).lean()
            lists.push(list)
        }
    }
    res.render("userPage", {
        layout: 'layout.hbs',
        title: 'Моя сторінка',
        loggedIn: true,
        menu: menu,
        user: user,
        userPrivilege: userPrivilege,
        post: postByQuery,
        lists: lists
    })
}

exports.deleteUser = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    await User.findOne({_id: req.query.userId}, (err, user) => {
        if(err || !user) {
            res.send("Помилка з видаленням користувача.")
        } else {
            let gfs = Grid(mongoose.connection.db, mongoose.mongo)
            gfs.remove({ _id: user.avatar, root: "userAvatars"})
            user.posts.forEach(post => {
                Post.findOne({_id: post}, (err, post) => {
                    if(err || !post) {
                        res.send("Помилка з видаленням користувача.")
                    } else {
                        let gfs = Grid(mongoose.connection.db, mongoose.mongo)
                        gfs.remove({ _id: post.picture, root: "userAvatars"})
                        Post.findOneAndDelete({_id: post}, (err) => {
                            if(err) {
                                res.send("Помилка з видаленням посту.")
                            }
                        })
                    }
                })
            })
            for (let i = 0; i < user.lists.length; i++) {
                List.findOneAndDelete({_id: user.lists[i]}, (err) => {
                    if(err) {
                        res.send("Помилка з видаленням списку.")
                    }
                })
            }
        }
    })
    await User.findOneAndDelete({_id: req.query.userId}, (err) => {
        if(err) {
            res.send("Помилка з видаленням користувача.")
        }
    })
    await User.findOne({_id: req.session.userId}, (err, user) => {
        if(err) {
            res.send("Помилка з видаленням користувача.")
        } else {
            if(user === null) {
                req.session.reset()
                res.redirect('/login')
            } else {
                res.redirect('/user/news')
            }
        }
    })
}

exports.userNews = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    let menu
    let userPrivilege = {}
    let isNewsPage = false
    const thisUser = await User.findOne({_id: req.session.userId}).lean()
    let posts = await Post.find({ownerName: "Admin"}).lean()
    let lists = []
    if(thisUser.role === "User") {
        menu = menus("user", req.session.userId)
        if (thisUser && thisUser.lists && thisUser.lists.length > 0) {
            for (let i = 0; i < thisUser.lists.length; i++) {
                let list = await List.findOne({_id: thisUser.lists[i]}).lean()
                lists.push(list)
            }
        }
    } else {
        menu = menus("admin")
        userPrivilege.admin = true
        isNewsPage = true
    }
    let postNumber = req.query.post
    if (!postNumber || !/^\d+$/.test(postNumber) || postNumber > posts.length || postNumber < 1) {
        postNumber = 1
    }
    let postByQuery
    for (let i = 0; i < posts.length; i++) {
        if (parseInt(postNumber) === (i + 1)) {
            posts = posts.reverse()
            postByQuery = posts[i]
        }
    }
    res.render("newsPage", {
        layout: 'layout.hbs',
        title: 'Новини',
        loggedIn: true,
        menu: menu,
        userPrivilege: userPrivilege,
        post: postByQuery,
        isNewsPage: isNewsPage,
        lists: lists
    })
}

exports.findUsersPage = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    let menu
    const thisUser = await User.findOne({_id: req.session.userId})
    if(thisUser.role === "User") {
        menu = menus("user", req.session.userId)
    } else {
        menu = menus("admin")
    }
    res.render("findPage", {
        layout: 'layout.hbs',
        title: 'Пошук користувачів',
        loggedIn: true,
        menu: menu
    })
}

exports.findUsers = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    let users
    //console.log(req.query)
    const name = req.query.name
    const regexName = new RegExp(name, 'i')
    if (req.query.surname !== undefined) {
        //console.log(req.query.surname)
        const surname = req.query.surname
        const regexSurname = new RegExp(surname, 'i')
        users = await User.find({name: {$regex: regexName}, surname: {$regex: regexSurname}, role: "User"})
    } else {
        users = await User.find({name: {$regex: regexName}, role: "User"})
    }
    res.send({users: users})
}

exports.logoutUser = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    req.session.reset()
    res.redirect('/login')
}