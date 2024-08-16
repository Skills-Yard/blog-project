require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser');
const fs = require("fs");
const { isUserLoggedIn } = require("./middleware/middleware");
const { createBlogs } = require("./routes/createBlog");
const { static } = require("./routes/static");

const PORT = process.env.PORT || 8055;
const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// set the view engine to ejs
app.set('views', './views');
app.set('view engine', 'ejs');


// static routes
app.use("/", static)


// create-blog route
app.use("/create-blog", isUserLoggedIn, createBlogs)


//blog/slug route
app.get("/blog/:slug", (req, res) => {
  const { slug } = req.params;
  const jsonBlog = fs.readFileSync("./data/blogs.json");
  const blogs = JSON.parse(jsonBlog);
  const blog = blogs.find(b => b.slug == '/blog/' + slug);
  res.render('blog', { blog });
});


app.listen(PORT, () => {
  console.log("Server running at", PORT);
});