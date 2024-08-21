const express = require("express");
const fs = require('fs');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const masterPassword = process.env["MASTER_PASSWORD"];


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  let authenticated = false;

  const { session } = req.cookies;
  const sessionTokenList = JSON.parse(fs.readFileSync("./data/sessions.json"));

  if (sessionTokenList.some((a) => a == session)) {
    authenticated = true;
  }

  req.authenticated = authenticated;

  next();
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  const jsonBlog = fs.readFileSync("./data/blogs.json");
  const blogs = JSON.parse(jsonBlog);
  res.render("index", { blogs, authenticated: req.authenticated });
});

app.get("/create-blog", (req, res) => {

  if(req.authenticated) {
    res.render("create-blog");
  } else {
    res.send('<h1>Not Authenticated</h1><a href="/">Home</a>');
  }
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


app.get("/login", (req, res) => {
  res.render('login');
});

app.post("/login", (req, res) => {
  const { password } = req.body;
  if (password == masterPassword) {
    const sessionToken = uuid.v4();
    res.cookie("session", sessionToken);
    const sessionTokenList = JSON.parse(fs.readFileSync("./data/sessions.json"));
    sessionTokenList.push(sessionToken);
    fs.writeFileSync("./data/sessions.json", JSON.stringify(sessionTokenList));
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  const { session } = req.cookies;

  // remove from session JSON list
  let sessionTokenList = JSON.parse(fs.readFileSync("./data/sessions.json"));
  sessionTokenList = sessionTokenList.filter(s => s != session);
  fs.writeFileSync("./data/sessions.json", JSON.stringify(sessionTokenList));

  res.clearCookie('session');
  res.render('logout')
});

app.listen(3000, () => {
  console.log("Server running at 3000!");
});