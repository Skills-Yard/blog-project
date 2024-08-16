const express = require("express");
const router = express.Router();
const { createBlogGET, createBlogPOST } = require("../controller/createBlog")


router.route("/")
    .get(createBlogGET)
    .post(createBlogPOST);


module.exports.createBlogs = router