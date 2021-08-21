$(".alert-client-validation").hide()
function validateForm() {
    let userName = document.forms["registerForm"]["userName"].value
    let userSurname = document.forms["registerForm"]["userSurname"].value
    let userBirthDate = document.forms["registerForm"]["userBirthDate"].value
    let userGender = document.forms["registerForm"]["userGender"].value
    let userEmail = document.forms["registerForm"]["userEmail"].value
    let userLogin = document.forms["registerForm"]["userLogin"].value
    let userPassword = document.forms["registerForm"]["userPassword"].value
    let userPasswordReenter = document.forms["registerForm"]["userPasswordReenter"].value
    let userAvatar = document.forms["registerForm"]["userAvatar"].files[0]
    const isEmpty = str => !str.trim().length
    /*alert("userAvatar.length")*/
    /*console.log(userAvatar)*/
    if (isEmpty(userName) || isEmpty(userSurname) || isEmpty(userBirthDate) || isEmpty(userGender) ||
        isEmpty(userEmail) || isEmpty(userLogin) || isEmpty(userPassword) || isEmpty(userPasswordReenter)) {
        //console.log(userAvatar.type)
        $("#alertClientErrorText").html("Поля не повинні бути пусті.")
        $(".alert-client-validation").show()
        return false
    }
    if (userAvatar === undefined) {
        $("#alertClientErrorText").html("Фото профіля повинно бути обрано.")
        $(".alert-client-validation").show()
        return false
    }
    if (userPassword.length < 7) {
        $("#alertClientErrorText").html("Довжина пароля має бути мінімум 7 символів.")
        $(".alert-client-validation").show()
        return false
    }
    if (userPassword !== userPasswordReenter) {
        $("#alertClientErrorText").html("Паролі не збігаються.")
        $(".alert-client-validation").show()
        return false
    }
    if (userAvatar.type !== "image/jpeg" && userAvatar.type !== "image/png") {
        $("#alertClientErrorText").html("Фото профіля має бути з розширення .jpeg або .png.")
        $(".alert-client-validation").show()
        return false
    }
}
