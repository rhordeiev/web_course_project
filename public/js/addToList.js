$(document).ready(() => {
    $(".dropdown-item").on("click", (e) => {
        e.preventDefault()
        $.get("/user/lists/addToList/" + $(e.target).attr('id') + "?postId=" + $(".post").attr("id"))
    })
})