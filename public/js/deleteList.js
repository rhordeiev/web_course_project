$(document).ready(() => {
    let listId
    $(".material-icons.delete").on("click", (e) => {
        listId = $(e.target).siblings().attr('id')
    })
    $(".modal-footer button:first-child").on("click", () => {
        /*console.log("/user/lists/deletePost/" + window.location.pathname.split("/").pop() + "?postId=" + $(".post").attr("id"))*/
        /*console.log("/user/lists/deleteList/" + listId)*/
        $.get("/user/lists/deleteList/" + listId)
            .done(() => {
                let loc = window.location
                window.location = loc.protocol + '//' + loc.host + loc.pathname + loc.search
            })
    })
})