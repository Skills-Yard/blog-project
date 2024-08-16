const fs = require("fs")
const path = require("path");
const PASSWORD = process.env.PASSWORD

function createBlogGET(req, res) {
    res.render("create-blog");
}

function createBlogPOST(req, res) {
    const { title, content, password } = req.body;
    const jsonBlog = fs.readFileSync(path.join(__dirname, "../data/blogs.json"));
    const blogs = JSON.parse(jsonBlog);
    let slug = "/blog/" + title.trim().replaceAll(/\s+/g, "-").toLowerCase();

    if (password != PASSWORD) {
        res.send("You are not authorized!");
    }

    let isUnique = true;
    for (let blog of blogs) {
        if (blog.slug == slug) {
            isUnique = false;
        }
    }

    if (!isUnique) {
        slug = slug + '-' + blogs.length;
    }

    const time = new Date();
    blogs.push({
        title, content, slug,
        createdAt: time.toUTCString()
    });
    fs.writeFileSync(path.join(__dirname, "../data/blogs.json"), JSON.stringify(blogs, null, 2));
    res.redirect(`${slug}`);
}

module.exports = {
    createBlogGET,
    createBlogPOST,
}