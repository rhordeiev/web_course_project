const urlParams = new URLSearchParams(window.location.search);
let postNumber = parseInt(urlParams.get('post')) || 1
insertUrlParam("post", postNumber)

function getPostsPath(postNumber) {
    if (window.location.pathname.includes("lists")) {
        return "/user/lists/getListPosts/" + postNumber + "?listId=" + window.location.pathname.split("/").pop()
    } else {
        return "/user/post/" + postNumber + "?userId=" + window.location.pathname.split("/").pop()
    }
}
function getPostsCountPath() {
    if (window.location.pathname.includes("lists")) {
        return "/user/lists/listPostsCount/" + window.location.pathname.split("/").pop()
    } else {
        return "/user/post/postCount?userId=" + window.location.pathname.split("/").pop()
    }
}

if (postNumber === 1 || !postNumber || postNumber < 1) {
    $(".pagination-left").css({
        "visibility": "hidden"
    })
}
$.get(getPostsCountPath())
    .done((data) => {
        if(data.postCount === 0) {
            $(".post-and-pagination").hide()
        }
        if(postNumber === data.postCount) {
            $(".pagination-right").css({
                "visibility": "hidden"
            })
            postNumber = data.postCount
            insertUrlParam("post", data.postCount)
        }
        if(postNumber < 1 || postNumber > data.postCount || !Number.isInteger(postNumber)) {
            $(".pagination-left").css({
                "visibility": "hidden"
            })
            postNumber = 1
            insertUrlParam("post", 1)
        }
    })

function insertUrlParam(key, value) {
    if (history.pushState) {
        let searchParams = new URLSearchParams(window.location.search)
        searchParams.set(key, value)
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString()
        window.history.pushState({path: newurl}, '', newurl)
    }
}

$('.pagination-right').click(() => {
    if (!postNumber) {
        postNumber = 1
    }
    $.get(getPostsCountPath())
        .done((data) => {
            postNumber++
            if (postNumber === data.postCount) {
                $(".pagination-right").css({
                    "visibility": "hidden"
                })
            }
            if (postNumber > 1) {
                $(".pagination-left").css({
                    "visibility": "visible"
                })
            }
            insertUrlParam("post", postNumber)
            $.get(getPostsPath(postNumber))
                .done((data) => {
                    let changeButtons, listsPart = "", listsLinksPart = ""
                    data.lists.forEach(list => {
                        listsLinksPart += "<a class=\"dropdown-item\" href=\"/user/lists/addToList/" + list._id + "?postId=" + data.post._id + "\" id=\"" + list._id + "\">" + list.name + "</a>"
                    })
                    listsPart = "<div class=\"dropdown\" id=\"addToListButton\">\n" +
                        "                    <span class=\"material-icons\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
                        "                        more_vert\n" +
                        "                    </span>\n" +
                        "                    <div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton\">\n" +
                        "                        <h6 class=\"dropdown-header\">Додати до списку:</h6>\n" +
                        listsLinksPart +
                        "                    </div>\n" +
                        "                </div>"
                    if(data.userPrivilege && data.userPrivilege.thisUser) {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "            <span class=\"material-icons\">more_vert</span>" +
                            "<span class=\"material-icons\">edit</span>\n" +
                            "            <span class=\"material-icons\">delete</span>\n" +
                            "        </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "        <div class=\"change-buttons\">\n" +
                            listsPart +
                            "<span class=\"material-icons update\" id=\"updatePostButton\">edit</span>\n" +
                            "            <span class=\"material-icons delete\" id=\"deletePostButton\" data-toggle=\"modal\" data-target=\"#deleteModal\">delete</span>\n" +
                            "        </div>\n"
                    } else if(data.userPrivilege && data.isNewsPage && data.userPrivilege.admin) {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "            <span class=\"material-icons\">edit</span>\n" +
                            "            <span class=\"material-icons\">delete</span>\n" +
                            "        </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "        <div class=\"change-buttons\">\n" +
                            "            <span class=\"material-icons update\" id=\"updatePostButton\">edit</span>\n" +
                            "            <span class=\"material-icons delete\" id=\"deletePostButton\" data-toggle=\"modal\" data-target=\"#deleteModal\">delete</span>\n" +
                            "        </div>\n"
                    } else if (data.userPrivilege && data.userPrivilege.admin) {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "            <span class=\"material-icons\">delete</span>\n" +
                            "        </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "        <div class=\"change-buttons\">\n" +
                            "            <span class=\"material-icons delete\" id=\"deletePostButton\" data-toggle=\"modal\" data-target=\"#deleteModal\">delete</span>\n" +
                            "        </div>\n"
                    } else if (data.isListPage) {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "            <span class=\"material-icons\">more_vert</span>" +
                            "            <span class=\"material-icons\">delete</span>\n" +
                            "        </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "        <div class=\"change-buttons\">\n" +
                            listsPart +
                            "            <span class=\"material-icons delete\" id=\"deletePostFromListButton\" data-toggle=\"modal\" data-target=\"#deletePostFromListModal\">delete</span>\n" +
                            "        </div>\n"
                    } else {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "                        <span class=\"material-icons\">more_vert</span>\n" +
                            "                    </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "<div class=\"change-buttons\">\n" +
                            listsPart +
                            "                    </div>\n"
                    }
                    $(".posts").html("<link rel=\"stylesheet\" href=\"/css/postsStyle.css\">\n" +
                        "<div class=\"post\" id=\"" + data.post._id + "\"> \n" +
                        "    <div class=\"post-block header\" id=\"header\">\n" +
                        changeButtons +
                        "    </div>\n" +
                        "    <div class=\"post-block post-picture\">\n" +
                        "        <img src=\"/image/" + data.post.picture + "\" alt=\"Картинка поста\" width=\"80%\" height=\"400vh\" id=\"picture\">\n" +
                        "    </div>\n" +
                        "    <div class=\"post-block creation-info\">\n" +
                        "        <div class=\"created-at\">\n" +
                        "            <span class=\"field-header\">Час створення:</span> <span id=\"creationDate\">" + data.post.creationDate + "</span>\n" +
                        "        </div>\n" +
                        "        <div class=\"created-by\">\n" +
                        "            <span class=\"field-header\">Автор:</span> <a href=\"/user/" + data.post.ownerId + "\" id=\"ownerInfo\">" + data.post.ownerName + "</a>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "    <div class=\"post-text\">\n" +
                        "        <p id=\"text\">" + data.post.text + "</p>\n" +
                        "    </div>\n" +
                        " <div class=\"modal fade\" id=\"deleteModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"deleteModalLabel\" aria-hidden=\"true\">\n" +
                        "        <div class=\"modal-dialog\" role=\"document\">\n" +
                        "            <div class=\"modal-content\">\n" +
                        "                <div class=\"modal-header\">\n" +
                        "                    <h5 class=\"modal-title\" id=\"deleteModalLabel\">Видалення поста</h5>\n" +
                        "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
                        "                        <span aria-hidden=\"true\">&times;</span>\n" +
                        "                    </button>\n" +
                        "                </div>\n" +
                        "                <div class=\"modal-body\">\n" +
                        "                    Ви дійсно хочете видалити даний пост?\n" +
                        "                </div>\n" +
                        "                <div class=\"modal-footer\">\n" +
                        "                    <button type=\"button\" class=\"btn btn-primary\" id=\"deletePostButton\"><a href=\"/user/post/deletePost/" + data.post._id + "\">Так</a></button>\n" +
                        "                    <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Закрити</button>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "    </div>" +
                        "</div>" +
                        "<script src=\"/js/changePost.js\"></script>" +
                        "<script src=\"/js/addToList.js\"></script>")
                })
        })
})

$('.pagination-left').click(() => {
    if (!postNumber) {
        postNumber = 1
    }
    $.get(getPostsCountPath())
        .done((data) => {
            if (postNumber === 1) {
                postNumber++
            }
            postNumber--
            if (postNumber < data.postCount) {
                $(".pagination-right").css({
                    "visibility": "visible"
                })
            }
            if (postNumber === 1) {
                $(".pagination-left").css({
                    "visibility": "hidden"
                })
            }
            insertUrlParam("post", postNumber)
            $.get(getPostsPath(postNumber))
                .done((data) => {
                    let changeButtons, listsPart = "", listsLinksPart = ""
                    data.lists.forEach(list => {
                        listsLinksPart += "<a class=\"dropdown-item\" href=\"/user/lists/addToList/" + list._id + "?postId=" + data.post._id + "\" id=\"" + list._id + "\">" + list.name + "</a>"
                    })
                    listsPart = "<div class=\"dropdown\" id=\"addToListButton\">\n" +
                        "                    <span class=\"material-icons\" id=\"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
                        "                        more_vert\n" +
                        "                    </span>\n" +
                        "                    <div class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton\">\n" +
                        "                        <h6 class=\"dropdown-header\">Додати до списку:</h6>\n" +
                        listsLinksPart +
                        "                    </div>\n" +
                        "                </div>"
                    if(data.userPrivilege && data.userPrivilege.thisUser) {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "            <span class=\"material-icons\">more_vert</span>" +
                            "<span class=\"material-icons\">edit</span>\n" +
                            "            <span class=\"material-icons\">delete</span>\n" +
                            "        </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "        <div class=\"change-buttons\">\n" +
                            listsPart +
                            "<span class=\"material-icons update\" id=\"updatePostButton\">edit</span>\n" +
                            "            <span class=\"material-icons delete\" id=\"deletePostButton\" data-toggle=\"modal\" data-target=\"#deleteModal\">delete</span>\n" +
                            "        </div>\n"
                    } else if(data.userPrivilege && data.isNewsPage && data.userPrivilege.admin) {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "            <span class=\"material-icons\">edit</span>\n" +
                            "            <span class=\"material-icons\">delete</span>\n" +
                            "        </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "        <div class=\"change-buttons\">\n" +
                            "            <span class=\"material-icons update\" id=\"updatePostButton\">edit</span>\n" +
                            "            <span class=\"material-icons delete\" id=\"deletePostButton\" data-toggle=\"modal\" data-target=\"#deleteModal\">delete</span>\n" +
                            "        </div>\n"
                    } else if (data.userPrivilege && data.userPrivilege.admin) {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "            <span class=\"material-icons\">delete</span>\n" +
                            "        </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "        <div class=\"change-buttons\">\n" +
                            "            <span class=\"material-icons delete\" id=\"deletePostButton\" data-toggle=\"modal\" data-target=\"#deleteModal\">delete</span>\n" +
                            "        </div>\n"
                    } else if (data.isListPage) {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "            <span class=\"material-icons\">more_vert</span>" +
                            "            <span class=\"material-icons\">delete</span>\n" +
                            "        </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "        <div class=\"change-buttons\">\n" +
                            listsPart +
                            "            <span class=\"material-icons delete\" id=\"deletePostFromListButton\" data-toggle=\"modal\" data-target=\"#deletePostFromListModal\">delete</span>\n" +
                            "        </div>\n"
                    } else {
                        changeButtons = "<div class=\"hidden\">\n" +
                            "                        <span class=\"material-icons\">more_vert</span>\n" +
                            "                    </div>\n" +
                            "        <div class=\"header-text\">" + data.post.header + "</div>\n" +
                            "<div class=\"change-buttons\">\n" +
                            listsPart +
                            "                    </div>\n"
                    }
                    $(".posts").html("<link rel=\"stylesheet\" href=\"/css/postsStyle.css\">\n" +
                        "<div class=\"post\" id=\"" + data.post._id + "\"> \n" +
                        "    <div class=\"post-block header\" id=\"header\">\n" +
                        changeButtons +
                        "    </div>\n" +
                        "    <div class=\"post-block post-picture\">\n" +
                        "        <img src=\"/image/" + data.post.picture + "\" alt=\"Картинка поста\" width=\"80%\" height=\"400vh\" id=\"picture\">\n" +
                        "    </div>\n" +
                        "    <div class=\"post-block creation-info\">\n" +
                        "        <div class=\"created-at\">\n" +
                        "            <span class=\"field-header\">Час створення:</span> <span id=\"creationDate\">" + data.post.creationDate + "</span>\n" +
                        "        </div>\n" +
                        "        <div class=\"created-by\">\n" +
                        "            <span class=\"field-header\">Автор:</span> <a href=\"/user/" + data.post.ownerId + "\" id=\"ownerInfo\">" + data.post.ownerName + "</a>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "    <div class=\"post-text\">\n" +
                        "        <p id=\"text\">" + data.post.text + "</p>\n" +
                        "    </div>\n" +
                        " <div class=\"modal fade\" id=\"deleteModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"deleteModalLabel\" aria-hidden=\"true\">\n" +
                        "        <div class=\"modal-dialog\" role=\"document\">\n" +
                        "            <div class=\"modal-content\">\n" +
                        "                <div class=\"modal-header\">\n" +
                        "                    <h5 class=\"modal-title\" id=\"deleteModalLabel\">Видалення поста</h5>\n" +
                        "                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
                        "                        <span aria-hidden=\"true\">&times;</span>\n" +
                        "                    </button>\n" +
                        "                </div>\n" +
                        "                <div class=\"modal-body\">\n" +
                        "                    Ви дійсно хочете видалити даний пост?\n" +
                        "                </div>\n" +
                        "                <div class=\"modal-footer\">\n" +
                        "                    <button type=\"button\" class=\"btn btn-primary\" id=\"deletePostButton\"><a href=\"/user/post/deletePost/" + data.post._id + "\">Так</a></button>\n" +
                        "                    <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Закрити</button>\n" +
                        "                </div>\n" +
                        "            </div>\n" +
                        "        </div>\n" +
                        "    </div>" +
                        "</div>" +
                        "<script src=\"/js/changePost.js\"></script>" +
                        "<script src=\"/js/addToList.js\"></script>")
                })
        })
})