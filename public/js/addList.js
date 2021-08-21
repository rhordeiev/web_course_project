$(document).ready(() => {
    $(".material-icons.spans").on("click", () => {
        if ($(".material-icons.spans").text() === "control_point") {
            $(".new-list-form").addClass("new-post-create")
            $(".material-icons.spans").text("clear")
            $(".new-list-form").html("<div class=\"form-group\">\n" +
                "            <label for=\"listName\">Введіть ім'я списку:</label>\n" +
                "            <input type=\"text\" class=\"form-control\" name=\"listName\" id=\"userListName\">\n" +
                "        </div>" +
                "<button type=\"button\" class=\"btn btn-default\" id=\"createListButton\">Додати</button>")
            $("#createListButton").on("click", () => {
                let listName = $( "input[name=listName]" ).val()
                const isEmpty = str => !str.trim().length
                if (isEmpty(listName)) {
                    $("<div class=\"alert alert-danger alert-client-validation\" style='margin-top: 10px;'>\n" +
                        "            <strong>Помилка додавання списку!</strong>\n" +
                        "            <div class=\"alert-error-text\" id=\"alertClientErrorText\">Поля не повинні бути пусті.</div>\n" +
                        "        </div>").appendTo(".new-list-form")
                    return false
                }

                $.ajax({
                    url: '/user/lists/createList',
                    type: 'POST',
                    data: {
                        listName: listName
                    },
                    success: function (data) {
                        let loc = window.location
                        window.location = loc.protocol + '//' + loc.host + loc.pathname + loc.search
                        /*$("#updateUserName").text("edit").removeClass("clear")*/
                    }
                })
            })
        } else {
            $(".new-list-form").html("")
            $(".new-list-form").removeClass("new-post-create")
            $(".material-icons.spans").text("control_point")
        }
    })
})