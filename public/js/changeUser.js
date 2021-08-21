$( document ).ready(() => {
    let userNameAndSurnameInitial = $("#userNameAndSurname").text(), userAvatarInitial = $("#userAvatar").attr("src"),
        userBirthDateInitial = $("#userBirthDate").text(), userGenderInitial = $("#userGender").text(),
        userEmailInitial = $("#userEmail").text(), userInfoInitial = $("#userInfo").text()
    $("#updateUserName").on("click", () => {
        if ($("#updateUserName").text() === "edit") {
            $(".user-page-header .header-text").html("<div class=\"form-group\">\n" +
                "            <label for=\"userName\">Введіть ім'я:</label>\n" +
                "            <input type=\"text\" class=\"form-control\" name=\"userName\" id=\"userName\">\n" +
                "        </div>\n" +
                "        <div class=\"form-group\">\n" +
                "            <label for=\"userSurname\">Введіть прізвище:</label>\n" +
                "            <input type=\"text\" class=\"form-control\" name=\"userSurname\" id=\"userSurname\">\n" +
                "        </div>" +
                "<button type=\"button\" class=\"btn btn-default\" id=\"updateNameButton\">Змінити</button>")
            $("#updateNameButton").on("click", () => {
                let userName = $( "input[name=userName]" ).val()
                let userSurname = $("input[name=userSurname]").val()
                const isEmpty = str => !str.trim().length
                if (isEmpty(userName) || isEmpty(userSurname)) {
                    $("<div class=\"alert alert-danger alert-client-validation\" style='margin-top: 10px;'>\n" +
                        "            <strong>Помилка зміни імені користувача!</strong>\n" +
                        "            <div class=\"alert-error-text\" id=\"alertClientErrorText\">Поля не повинні бути пусті.</div>\n" +
                        "        </div>").appendTo(".user-page-header .header-text")
                    return false
                }

                $.ajax({
                    url: '/user/updateUserName',
                    type: 'POST',
                    data: {
                        userName: userName,
                        userSurname: userSurname,
                        userId: window.location.pathname.split("/").pop()
                    },
                    success: function (data) {
                        userNameAndSurnameInitial = data.name + " " + data.surname
                        $(".user-page-header .header-text").text(data.name + " " + data.surname)
                        $("#ownerInfo").text(data.name + " " + data.surname)
                        $(".user-page-header").removeClass("user-page-header-update")
                        $("#updateUserName").text("edit").removeClass("clear")
                        $("#deleteUser").show()
                    }
                });
            })
            $(".user-page-header").addClass("user-page-header-update")
            $("#updateUserName").text("clear").addClass("clear")
            $("#deleteUser").hide()
        } else {
            $(".user-page-header .header-text").text(userNameAndSurnameInitial)
            $(".user-page-header").removeClass("user-page-header-update")
            $("#updateUserName").text("edit").removeClass("clear")
            $("#deleteUser").show()
        }
    })
    $("#updateUserAvatar").on("click", () => {
        if ($("#updateUserAvatar").text() === "edit") {
            $(".user-avatar-img").addClass("user-avatar-img-update")
            $("#updateUserAvatar").text("clear").addClass("clear")
            $(".user-avatar-img").html("<div class=\"form-group\">\n" +
                "            <label for=\"userAvatar\">Оберіть фото профіля:</label>\n" +
                "            <input type=\"file\" class=\"form-control-file\" name=\"userAvatar\" id=\"userAvatar\" accept=\"image/*\">\n" +
                "        </div>" +
                "<button type=\"button\" class=\"btn btn-default\" id=\"updateAvatarButton\">Змінити</button>")
            $("#updateAvatarButton").on("click", () => {
                let userAvatar = $('input[name=userAvatar]')[0].files[0]
                if (userAvatar === undefined) {
                    $("<div class=\"alert alert-danger alert-client-validation\" style='margin-top: 10px;'>\n" +
                        "            <strong>Помилка зміни фото профіля!</strong>\n" +
                        "            <div class=\"alert-error-text\" id=\"alertClientErrorText\">Фото профіля повинно бути обрано.</div>\n" +
                        "        </div>").appendTo(".user-avatar-img")
                    return false
                }
                if (userAvatar.type !== "image/jpeg" && userAvatar.type !== "image/png") {
                    $("<div class=\"alert alert-danger alert-client-validation\">\n" +
                        "            <strong>Помилка зміни фото профіля!</strong>\n" +
                        "            <div class=\"alert-error-text\" id=\"alertClientErrorText\">Фото профіля має бути з розширення .jpeg або .png.</div>\n" +
                        "        </div>").appendTo(".user-avatar-img")
                    return false
                }

                let fd = new FormData;

                fd.append('userAvatar', userAvatar)
                fd.append('userId', window.location.pathname.split("/").pop())
                fd.append('userAvatarId', userAvatarInitial.split("/").pop())

                $.ajax({
                    url: '/user/updateUserAvatar',
                    data: fd,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data) {
                        $(".user-avatar-img").html("<img src=\"/image/" + data.avatar +  "\" alt=\"Фото профіля\" id=\"userAvatar\" width=\"300vh\" height=\"350vh\">")
                        $(".user-avatar-img").removeClass("user-avatar-img-update")
                        $("#updateUserAvatar").text("edit").removeClass("clear")
                        userAvatarInitial = $("#userAvatar").attr("src")
                    }
                });
            })
        } else {
            $(".user-avatar-img").html("<img src=\"" + userAvatarInitial +  "\" alt=\"Фото профіля\" id=\"userAvatar\" width=\"300vh\" height=\"350vh\">")
            $(".user-avatar-img").removeClass("user-avatar-img-update")
            $("#updateUserAvatar").text("edit").removeClass("clear")
        }
    })
    $("#updatePersonalInfo").on("click", () => {
        if ($("#updatePersonalInfo").text() === "edit") {
            $(".user-personal-main-info").html("<div class=\"form-group\">\n" +
                "            <label for=\"userBirthDate\">Введіть свою дату народження:</label>\n" +
                "            <input type=\"date\" class=\"form-control\" name=\"userBirthDate\" id=\"userBirthDate\">\n" +
                "        </div>\n" +
                "        <div class=\"form-group\">\n" +
                "            <label for=\"userGender\">Оберіть стать:</label>\n" +
                "            <select class=\"form-control\" id=\"userGender\" name=\"userGender\">\n" +
                "                <option selected>чоловіча</option>\n" +
                "                <option>жіноча</option>\n" +
                "            </select>\n" +
                "        </div>\n" +
                "        <div class=\"form-group\">\n" +
                "            <label for=\"userEmail\">Введіть свою пошту:</label>\n" +
                "            <input type=\"email\" class=\"form-control\" name=\"userEmail\" id=\"userEmail\">\n" +
                "        </div>" +
                "<button type=\"button\" class=\"btn btn-default\" id=\"updatePersonalInfoButton\">Змінити</button>")
            $("#updatePersonalInfoButton").on("click", () => {
                let userBirthDate = $( "input[name=userBirthDate]" ).val()
                let userGender = $("select[name=userGender]").val()
                let userEmail = $("input[name=userEmail]").val()
                const isEmpty = str => !str.trim().length
                if (isEmpty(userBirthDate) || isEmpty(userGender) || isEmpty(userEmail)) {
                    $("<div class=\"alert alert-danger alert-client-validation\" style='margin-top: 10px;'>\n" +
                        "            <strong>Помилка зміни персональної інформації користувача!</strong>\n" +
                        "            <div class=\"alert-error-text\" id=\"alertClientErrorText\">Поля не повинні бути пусті.</div>\n" +
                        "        </div>").appendTo(".user-personal-main-info")
                    return false
                }

                $.ajax({
                    url: '/user/updateUserPersonalInfo',
                    type: 'POST',
                    data: {
                        userBirthDate: userBirthDate,
                        userGender: userGender,
                        userEmail: userEmail,
                        userId: window.location.pathname.split("/").pop()
                    },
                    success: function (data) {
                        $(".user-personal-main-info").html("<span class=\"user-personal-info-header\">Дата народження: </span> <span id=\"userBirthDate\">" + data.birthDate + "</span>\n" +
                            "                <span class=\"user-personal-info-header\">Стать: </span> <span id=\"userGender\">" + data.gender + "</span>\n" +
                            "                <span class=\"user-personal-info-header\">Пошта: </span> <span id=\"userEmail\">" + data.email + "</span>")
                        $(".user-personal-main-info").removeClass("user-page-header-update")
                        $("#updatePersonalInfo").text("edit").removeClass("clear")
                        userBirthDateInitial = $("#userBirthDate").text()
                        userGenderInitial = $("#userGender").text()
                        userEmailInitial = $("#userEmail").text()
                    }
                });
            })
            $(".user-personal-main-info").addClass("user-page-header-update")
            $("#updatePersonalInfo").text("clear").addClass("clear")
        } else {
            $(".user-personal-main-info").html("<span class=\"user-personal-info-header\">Дата народження: </span> <span id=\"userBirthDate\">" + userBirthDateInitial + "</span>\n" +
                "                <span class=\"user-personal-info-header\">Стать: </span> <span id=\"userGender\">" + userGenderInitial + "</span>\n" +
                "                <span class=\"user-personal-info-header\">Пошта: </span> <span id=\"userEmail\">" + userEmailInitial + "</span>")
            $(".user-personal-main-info").removeClass("user-page-header-update")
            $("#updatePersonalInfo").text("edit").removeClass("clear")
        }
    })
    $("#updateUserInfo").on("click", () => {
        if ($("#updateUserInfo").text() === "edit") {
            $(".user-personal-additional-info").html("<div class=\"form-group\">\n" +
                "            <label for=\"userInfo\">Розкажіть про себе:</label>\n" +
                "            <textarea class=\"form-control\" id=\"userInfo\" name=\"userInfo\" rows=\"3\"></textarea>\n" +
                "        </div>" +
                "<button type=\"button\" class=\"btn btn-default\" id=\"updateUserInfoButton\">Змінити</button>")
            $("#updateUserInfoButton").on("click", () => {
                let userInfo = $("textarea[name=userInfo]").val()
                const isEmpty = str => !str.trim().length
                if (isEmpty(userInfo)) {
                    $("<div class=\"alert alert-danger alert-client-validation\" style='margin-top: 10px;'>\n" +
                        "            <strong>Помилка зміни додаткової інформації користувача!</strong>\n" +
                        "            <div class=\"alert-error-text\" id=\"alertClientErrorText\">Поля не повинні бути пусті.</div>\n" +
                        "        </div>").appendTo(".user-personal-additional-info")
                    return false
                }

                $.ajax({
                    url: '/user/updateUserAdditionalInfo',
                    type: 'POST',
                    data: {
                        userInfo: userInfo,
                        userId: window.location.pathname.split("/").pop()
                    },
                    success: function (data) {
                        $(".user-personal-additional-info").html("<p id=\"userInfo\">" + data.info + "</p>")
                        $(".user-personal-additional-info").removeClass("user-page-header-update")
                        $("#updateUserInfo").text("edit").removeClass("clear")
                        userInfoInitial = $("#userInfo").text()
                    }
                });
            })
            $(".user-personal-additional-info").addClass("user-page-header-update")
            $("#updateUserInfo").text("clear").addClass("clear")
        } else {
            $(".user-personal-additional-info").html("<p id=\"userInfo\">" + userInfoInitial + "</p>")
            $(".user-personal-additional-info").removeClass("user-page-header-update")
            $("#updateUserInfo").text("edit").removeClass("clear")
        }
    })
})