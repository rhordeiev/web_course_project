$( document ).ready(() => {
    const postHeaderInitial = $(".post-block.header .header-text").text(), postImageInitial = $("#picture").attr("src"),
        postTextInitial = $("#text").text()
    $("#updatePostButton").on("click", () => {
        if ($("#updatePostButton").text() === "edit") {
            $(".post-block.header .header-text").html("<div class=\"form-group\">\n" +
                "                <input type=\"text\" class=\"form-control\" name=\"postHeader\" id=\"postHeader\">\n" +
                "            </div>")
            $(".post-picture").html("<div class=\"form-group\">\n" +
                "<input type=\"file\" class=\"form-control-file\" name=\"postPicture\" id=\"postPicture\" accept=\"image/*\">" +
                "            </div>")
            $(".post-text").html("<div class=\"form-group\">\n" +
                "<textarea class=\"form-control\" id=\"postText\" name=\"postText\" rows=\"3\"></textarea>" +
                "            </div>")

            $("<div class=\"post-submit-button\">\n" +
                "        <button class=\"btn btn-default\">Змінити</button>\n" +
                "    </div>").appendTo(".post-text")
            $(".post-submit-button button").on("click", () => {
                let postName = $( "input[name=postHeader]" ).val()
                let postText = $("textarea[name=postText]").val()
                let postPicture = $('input[name=postPicture]')[0].files[0]
                const isEmpty = str => !str.trim().length
                if (isEmpty(postName) || isEmpty(postText)) {
                    $("<div class=\"alert alert-danger alert-client-validation\">\n" +
                        "            <strong>Помилка зміни посту!</strong>\n" +
                        "            <div class=\"alert-error-text\" id=\"alertClientErrorText\">Поля не повинні бути пусті.</div>\n" +
                        "        </div>").appendTo(".post-text")
                    return false
                }
                if (postPicture === undefined) {
                    $("<div class=\"alert alert-danger alert-client-validation\">\n" +
                        "            <strong>Помилка зміни посту!</strong>\n" +
                        "            <div class=\"alert-error-text\" id=\"alertClientErrorText\">Фото для поста повинно бути обрано.</div>\n" +
                        "        </div>").appendTo(".post-text")
                    return false
                }
                if (postPicture.type !== "image/jpeg" && postPicture.type !== "image/png") {
                    $("<div class=\"alert alert-danger alert-client-validation\">\n" +
                        "            <strong>Помилка зміни посту!</strong>\n" +
                        "            <div class=\"alert-error-text\" id=\"alertClientErrorText\">Фото для поста має бути з розширення .jpeg або .png.</div>\n" +
                        "        </div>").appendTo(".post-text")
                    return false
                }
                let fd = new FormData;

                fd.append('postPicture', postPicture)
                fd.append('postName', postName)
                fd.append('postText', postText)
                fd.append('oldPostPictureId', postImageInitial.split("/").pop())

                $.ajax({
                    url: 'post/updatePost',
                    data: fd,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data) {
                        $(".post-block.header .header-text").html("<div class=\"header-text\">" + data.header + "</div>")
                        $(".post-picture").html("<img src=\"/image/" + data.picture + "\" alt=\"Картинка поста\" width=\"80%\" height=\"400vh\" id=\"picture\">")
                        $(".post-text").html("<p id=\"text\">" + data.text + "</p>")
                        $("#updatePostButton").text("edit").removeClass("clear")
                        $("#deletePostButton").show()
                        $("#addToListButton").show()
                    }
                });
            })
            $("#updatePostButton").text("clear").addClass("clear")
            $("#deletePostButton").hide()
            $("#addToListButton").hide()
        }
        else {
            $(".post-block.header .header-text").html("<div class=\"header-text\">" + postHeaderInitial + "</div>")
            $(".post-picture").html("<img src=\"" + postImageInitial + "\" alt=\"Картинка поста\" width=\"80%\" height=\"400vh\" id=\"picture\">")
            $(".post-text").html("<p id=\"text\">" + postTextInitial + "</p>")
            $("#updatePostButton").text("edit").removeClass("clear")
            $("#deletePostButton").show()
            $("#addToListButton").show()
        }
    })
})