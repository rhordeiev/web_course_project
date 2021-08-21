$(document).ready(() => {
    $("input#findUserName").on("input", () => {
        let str = $("#findUserName").val().trim()
        str = str.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } )
        let findValues = []
        findValues.push(str[0])
        str.shift()
        if (str.length !== 0)
            findValues.push(str.join(" "))
        if (findValues.length !== 0 && findValues[0] !== undefined) {
            /*console.log(findValues)*/
            if (findValues.length === 1) {
                /*console.log("/user/findUser?name=" + findValues[0])*/
                $.get("/user/findUsers?name=" + findValues[0])
                    .done((data) => {
                        /*console.log(data.users[0])*/
                        let foundUsersHtml = ""
                        for (let i = 0; i < data.users.length; i++) {
                            foundUsersHtml += "<div class=\"user\">\n" +
                                "                <div class=\"user-img\">\n" +
                                "                    <img src=\"/image/" + data.users[i].avatar + "\" alt=\"\" width=\"100px\" height=\"100px\">\n" +
                                "                </div>\n" +
                                "                <div class=\"user-name\">\n" +
                                "                    <a href=\"/user/" + data.users[i]._id + "\">" + data.users[i].name + " "  + data.users[i].surname +  "</a>\n" +
                                "                </div>\n" +
                                "            </div>"
                        }
                        $(".users").html(foundUsersHtml)
                    })
            } else {
                $.get("/user/findUsers?name=" + findValues[0] + "&surname=" + findValues[1])
                    .done((data) => {
                        let foundUsersHtml = ""
                        for (let i = 0; i < data.users.length; i++) {
                            foundUsersHtml += "<div class=\"user\">\n" +
                                "                <div class=\"user-img\">\n" +
                                "                    <img src=\"/image/" + data.users[i].avatar + "\" alt=\"\" width=\"100px\" height=\"100px\">\n" +
                                "                </div>\n" +
                                "                <div class=\"user-name\">\n" +
                                "                    <a href=\"/user/" + data.users[i]._id + "\">" + data.users[i].name + " "  + data.users[i].surname +  "</a>\n" +
                                "                </div>\n" +
                                "            </div>"
                        }
                        $(".users").html(foundUsersHtml)
                    })
            }
        }
        /*$.get("/user/lists/addToList/" + $(e.target).attr('id') + "?postId=" + $(".post").attr("id"))*/
    })
})