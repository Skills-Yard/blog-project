const express = require("express");
const fs = require('fs');
const cookieParser = require('cookie-parser');

const PASSWORD = "password";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  console.log("Cookies:", req.cookies);

  const jsonBlog = fs.readFileSync("./data/blogs.json");
  const blogs = JSON.parse(jsonBlog);

  res.appendHeader("Set-Cookie", "user=user-1");
  res.render("index", {blogs});
});

app.get("/create-blog", (req, res) => {
  res.render("create-blog");
});

app.post("/create-blog", (req, res) => {
  const { title, content, password } = req.body;
  const jsonBlog = fs.readFileSync("./data/blogs.json");
  const blogs = JSON.parse(jsonBlog);
  let slug = "/blog/" + title.trim().replaceAll(/\s+/g, "-").toLowerCase();

  if(password != PASSWORD) {
    res.send("You are not authorized!");
  }

  let isUnique = true;
  for(let blog of blogs) {
    if(blog.slug == slug) {
      isUnique = false;
    }
  }

  if(!isUnique) {
    slug = slug + '-' + blogs.length;
  }

  const time = new Date();
  blogs.push({
    title, content, slug,
    createdAt: time.toUTCString()
  });
  fs.writeFileSync("./data/blogs.json", JSON.stringify(blogs, null, 2));

  res.redirect(`/blog/${slug}`);
});

app.get("/blog/:slug", (req, res) => {
  const {slug} =  req.params;
  const jsonBlog = fs.readFileSync("./data/blogs.json");
  const blogs = JSON.parse(jsonBlog);
  const blog = blogs.find(b => b.slug== '/blog/' + slug);
  res.render('blog', { blog });
});


app.listen(3000, () => {
  console.log("Server running at 3000!");
});