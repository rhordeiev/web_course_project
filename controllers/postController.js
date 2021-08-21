const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const menus = require("../helpers/menuTypes")
const User = require("../models/userSchema")
const Post = require("../models/postSchema")
const List = require("../models/listSchema")

exports.new = (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    let menu
    User.findOne({_id: req.session.userId}, (err, user) => {
        if (err || !user) {
            res.send("Помилка з отриманням сторінки.")
        } else {
            if (user.role === "Admin") {
                menu = menus("admin")
            } else {
                if (req.query.destination === "news") {
                    res.redirect("/user/post/new?destination=user")
                }
                menu = menus("user", req.session.userId)
            }
            res.render("newPostPage",
                {
                    layout: 'layout.hbs',
                    title: 'Створення поста',
                    loggedIn: true,
                    destination: req.query.destination,
                    menu: menu,
                })
        }
    })
}

exports.getPostCount = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    if(req.query.userId === "news") {
        await Post.find( {ownerName: "Admin"},(err, posts) => {
            if(err || !posts) {
                res.send("Помилка зі отриманням постів.")
            } else {
                res.send({
                    postCount: posts.length
                })
            }
        })
    } else {
        await Post.find({ownerId: req.query.userId}, (err, posts) => {
            if(err || !posts) {
                res.send("Помилка зі отриманням постів.")
            } else {
                res.send({
                    postCount: posts.length
                })
            }
        })
    }
}

exports.getPost = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    if(req.query.userId === "news") {
        await Post.find( {ownerName: "Admin"},async (err, posts) => {
            if(err || !posts) {
                res.send("Помилка зі отриманням постів.")
            } else {
                posts = posts.reverse()
                let userPrivilege = {}
                await User.findOne({_id: req.session.userId}, async (err, user) => {
                    if(err || !posts) {
                        res.send("Помилка зі отриманням постів.")
                    } else {
                        if(user.role === "Admin") {
                            userPrivilege.admin = true
                        }
                        for (let i = 0; i < posts.length; i++) {
                            if (parseInt(req.params.postNumber) === (i + 1)) {
                                let lists = []
                                for (let j = 0; j < user.lists.length; j++) {
                                    await List.findOne({_id: user.lists[j]}, (err, list) => {
                                        if (err) {
                                            res.send("Помилка з отриманням списків.")
                                        } else {
                                            lists.push(list)
                                        }
                                    }).lean()
                                }
                                res.send({
                                    post: posts[i],
                                    userPrivilege: userPrivilege,
                                    isNewsPage: true,
                                    lists: lists
                                })
                            }
                        }
                    }
                })
            }
        })
    } else {
        await Post.find({ownerId: req.query.userId}, async (err, posts) => {
            if(err || !posts) {
                res.send("Помилка зі отриманням постів.")
            } else {
                posts = posts.reverse()
                let userPrivilege = {}
                if (req.query.userId === req.session.userId) {
                    userPrivilege.thisUser = true
                }
                await User.findOne({_id: req.session.userId}, async (err, user) => {
                    if(err || !posts) {
                        res.send("Помилка зі отриманням постів.")
                    } else {
                        if(user.role === "Admin") {
                            userPrivilege.thisUser = false
                            userPrivilege.admin = true
                        }
                        for (let i = 0; i < posts.length; i++) {
                            if (parseInt(req.params.postNumber) === (i + 1)) {
                                let lists = []
                                for (let j = 0; j < user.lists.length; j++) {
                                    await List.findOne({_id: user.lists[j]}, (err, list) => {
                                        if (err) {
                                            res.send("Помилка з отриманням списків.")
                                        } else {
                                            lists.push(list)
                                        }
                                    }).lean()
                                }
                                res.send({
                                    post: posts[i],
                                    userPrivilege: userPrivilege,
                                    lists: lists
                                })
                            }
                        }
                    }
                })
            }
        })
    }
}

exports.newPost = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    await User.findOne({_id: req.session.userId}, (err, user) => {
        if(err || !user) {
            res.send("Помилка з додаваням поста.")
        } else {
            let today = new Date()
            let ownerName = user.name + ' ' + user.surname
            if (req.query.destination === "news") {
                ownerName = "Admin"
            }
            const post = new Post({header: req.body.postHeader, text: req.body.postText,
                picture: req.file.id, ownerId: req.session.userId, ownerName: ownerName,
                creationDate: ("0" + today.getDate()).slice(-2)+'.'+("0" + (today.getMonth() + 1)).slice(-2)+
                    '.'+today.getFullYear() + ' ' + today.getHours() + ':' + ("0" + today.getMinutes()).slice(-2)
            })
            user.posts.push(post._id)
            post.save()
            user.save()
            res.redirect("/user/"+req.session.userId)
        }
    })
}
exports.updatePost = async (req, res) => {
    await Post.findOne({picture: req.body.oldPostPictureId}, (err, post) => {
        if(err || !post) {
            res.send("Помилка зі зміненням посту.")
        } else {
            post.header = req.body.postName
            post.text = req.body.postText
            post.picture = req.file.id
            let gfs = Grid(mongoose.connection.db, mongoose.mongo)
            gfs.remove({ _id: req.body.oldPostPictureId, root: "userAvatars"})
            post.save()
            res.send({
                header: post.header,
                text: post.text,
                picture: post.picture
            })
        }
    })
}
exports.deletePost = async (req, res) => {
    let userId
    const post = await Post.findOne({_id: req.params.id})
    const user = await User.findOne({_id: post.ownerId})
    let gfs = Grid(mongoose.connection.db, mongoose.mongo)
    gfs.remove({ _id: post.picture, root: "userAvatars"})
    let index = user.posts.indexOf(req.params.id)
    if (index !== -1) {
        user.posts.splice(index, 1);
    }
    user.save()
    const lists = await List.find({posts: req.params.id})
    lists.forEach(list => {
        list.posts = list.posts.filter(x => x !== req.params.id)
        list.save()
    })
    await Post.findOneAndDelete({_id: req.params.id}, (err) => {
        if(err) {
            res.send("Помилка з видаленням посту.")
        } else {
            res.redirect("/user/" + user._id)
        }
    })
}