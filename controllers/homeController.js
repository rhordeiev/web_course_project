exports.home = (req, res) => {
    res.redirect("/login")
}
exports.login = (req, res) => {
    if(req.session.userId) {
        res.redirect("/user/" + req.session.userId)
    }
    let registerSuccess = false, loginError = false, loginErrorText = ""
    if (req.cookies["registerSuccess"] !== undefined) {
        registerSuccess = req.cookies["registerSuccess"]
        res.clearCookie("registerSuccess")
    }
    if (req.cookies["loginErrorText"] !== undefined) {
        loginErrorText = req.cookies["loginErrorText"]
        loginError = true
        res.clearCookie("loginErrorText")
    }
    res.render("loginOrRegisterPage", {
        layout: 'layout.hbs',
        title: 'Вхід',
        loggedIn: false,
        registerSuccess: registerSuccess,
        loginError: loginError,
        loginErrorText: loginErrorText,
        register: false
    })
}
exports.register = (req, res) => {
    if(req.session.userId) {
        res.redirect("/user/" + req.session.userId)
    }
    let errors = req.cookies["errors"]
    let errorsExist = req.cookies["errorsExist"]
    res.clearCookie("errors")
    res.clearCookie('errorsExist')
    res.render("loginOrRegisterPage", {
        layout: 'layout.hbs',
        title: 'Вхід',
        loggedIn: false,
        errorsExist: errorsExist,
        errors: errors,
        register: true
    })
}