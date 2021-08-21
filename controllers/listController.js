const User = require("../models/userSchema")
const Post = require("../models/postSchema")
const List = require("../models/listSchema")
const menus = require("../helpers/menuTypes")

exports.userLists = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    const user = await User.findOne({_id: req.session.userId})
    if (!user) {
        req.session.reset()
        res.redirect("/login")
    }
    if (user && user.role === "Admin") {
        res.redirect("/user/news")
    }
    let lists = []
    for (let i = 0; i < user.lists.length; i++) {
        const list = await List.findOne({_id: user.lists[i]}).lean()
        lists.push(list)
    }
    res.render("listsPage", {
        layout: 'layout.hbs',
        title: 'Мої списки',
        loggedIn: true,
        menu: menus("user", req.session.userId),
        lists: lists
    })
}

exports.getListPosts = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    const list = await List.findOne({_id: req.params.id}).lean()
    let posts = []
    for (let i = 0; i < list.posts.length; i++) {
        const post = await Post.findOne({_id: list.posts[i]}).lean()
        posts.push(post)
    }
    let postByQuery
    let postNumber = req.query.post
    if (!postNumber || !/^\d+$/.test(postNumber) || postNumber > posts.length || postNumber < 1) {
        postNumber = 1
    }
    for (let i = 0; i < posts.length; i++) {
        if (parseInt(postNumber) === (i + 1)) {
            postByQuery = posts[i]
        }
    }
    const user = await User.findOne({_id: req.session.userId}).lean()
    let lists = []
    for (let i = 0; i < user.lists.length; i++) {
        let list = await List.findOne({_id: user.lists[i]}).lean()
        lists.push(list)
    }
    res.render("listsPostsPage", {
        layout: 'layout.hbs',
        title: 'Список: ' + list.name,
        loggedIn: true,
        menu: menus("user", req.session.userId),
        post: postByQuery,
        isListPage: true,
        lists: lists
    })
}

exports.getListPostsByNumber = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    const list = await List.findOne({_id: req.query.listId}).lean()
    let posts = []
    for (let i = 0; i < list.posts.length; i++) {
        const post = await Post.findOne({_id: list.posts[i]}).lean()
        posts.push(post)
    }
    let postByQuery
    let postNumber = req.params.postNumber
    if (!postNumber || !/^\d+$/.test(postNumber) || postNumber > posts.length || postNumber < 1) {
        postNumber = 1
    }
    for (let i = 0; i < posts.length; i++) {
        if (parseInt(postNumber) === (i + 1)) {
            postByQuery = posts[i]
        }
    }
    const user = await User.findOne({_id: req.session.userId}).lean()
    let lists = []
    for (let i = 0; i < user.lists.length; i++) {
        let list = await List.findOne({_id: user.lists[i]}).lean()
        lists.push(list)
    }
    res.send({
        post: postByQuery,
        isListPage: true,
        lists: lists
    })
}

exports.getListPostsCount = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    const list = await List.findOne({_id: req.params.listId}).lean()
    res.send({
        postCount: list.posts.length
    })
}

exports.createList = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    const user = await User.findOne({_id: req.session.userId})
    if (user && user.role === "Admin") {
        res.redirect("/user/news")
    }
    const list = new List({name: req.body.listName, ownerId: req.session.userId})
    user.lists.push(list._id)
    await list.save()
    await user.save()
    let lists = []
    for (let i = 0; i < user.lists.length; i++) {
        let list = await List.findOne({_id: user.lists[i]}).lean()
        lists.push(list)
    }
    res.send({
        lists: lists
    })
}

exports.addToList = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    const list = await List.findOne({_id: req.params.id})
    list.posts.push(req.query.postId)
    list.save()
}

exports.deletePostFromList = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    const list = await List.findOne({_id: req.params.listId})
    list.posts.splice(parseInt(req.query.postNumber) - 1, 1);
    list.save()
    res.redirect("/user/lists/" + req.params.listId)
}

exports.deleteList = async (req, res) => {
    if(!(req.session && req.session.userId)) {
        res.redirect("/login")
    }
    const user = await User.findOne({_id: req.session.userId})
    let index = user.lists.indexOf(req.params.listId)
    if (index !== -1) {
        user.lists.splice(index, 1);
    }
    user.save()
    await List.findOneAndRemove({_id: req.params.listId})
    res.redirect("/user/lists")
}