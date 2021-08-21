$(document).ready(() => {
    $(".modal-footer button:first-child").on("click", () => {
        const urlParams = new URLSearchParams(window.location.search)
        /*console.log("/user/lists/deletePost/" + window.location.pathname.split("/").pop() + "?postId=" + $(".post").attr("id"))*/
        $.get("/user/lists/deletePost/" + window.location.pathname.split("/").pop() + "?postNumber=" + urlParams.get('post'))
            .done(() => {
                let loc = window.location
                window.location = loc.protocol + '//' + loc.host + loc.pathname + loc.search
            })
    })
})