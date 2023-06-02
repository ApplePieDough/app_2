//require blog-service.js
var blogService = require("./blog-service");

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route '/' redirects to '/about'
app.get("/", (req, res) => {
    res.redirect("/about");
});

// Route '/about' 
app.get("/about", (req, res) => {
    res.sendFile(__dirname + "/views/about.html");
});

// Route '/blog'
app.get("/blog", (req, res) => {
    var publishedPosts = blogService.getPublishedPosts();
    res.json(publishedPosts);
});

app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on port " + HTTP_PORT);
});
