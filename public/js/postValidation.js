$(document).ready(function() {
    $("#newPostForm").on('submit', function() {
        let postName = document.forms["newPostForm"]["postHeader"].value
        let postText = document.forms["newPostForm"]["postText"].value
        let postPicture = document.forms["newPostForm"]["postPicture"].files[0]
        const isEmpty = str => !str.trim().length
        if (isEmpty(postName) || isEmpty(postText)) {
            $("#alertClientErrorText").html("Поля не повинні бути пусті.")
            $(".alert-client-validation").show()
            return false
        }
        if (postPicture === undefined) {
            $("#alertClientErrorText").html("Фото для поста повинно бути обрано.")
            $(".alert-client-validation").show()
            return false
        }
        if (postPicture.type !== "image/jpeg" && postPicture.type !== "image/png") {
            $("#alertClientErrorText").html("Фото профіля має бути з розширення .jpeg або .png.")
            $(".alert-client-validation").show()
            return false
        }
    })
})
