const fs = require("fs")
const path = require("path");
const PASSWORD = process.env.PASSWORD



function staticLoginGET(req, res) {
    res.render("login")
}

function staticLoginPOST(req, res) {
    const { password } = req.body;
    if (password === PASSWORD) {
        res.cookie("isUserLoggedIn", true)
        res.redirect("/")
    }
    else {
        res.redirect("/login")
    }
}

function staticLogoutGET(req, res) {
    res.clearCookie("isUserLoggedIn")
    res.redirect("/")
}

function staticGET(req,res){
    const jsonBlog = fs.readFileSync(path.join(__dirname, "../data/blogs.json"));
  const blogs = JSON.parse(jsonBlog);

  res.appendHeader("Set-Cookie", "user=user-1");
  res.render("index", { blogs, req });
}

module.exports = {
    staticLoginGET,
    staticLoginPOST,
    staticLogoutGET,
    staticGET
}