function isUserLoggedIn(req, res, next) {
    if (req.cookies.isUserLoggedIn)
        next();
    else res.redirect("/login")
}

module.exports = {
    isUserLoggedIn
}