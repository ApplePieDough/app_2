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
    res.send("TODO: get all posts who have published == true");
});

// Route '/posts'
app.get("/posts", (req,res) => {
    res.send("TODO: get all posts from posts.json file");
});

// Route '/categories'
app.get("/categories", (req,res) => {
    res.send("TODO: get all categories from categories.json file");
});

// Handle 404 
app.use(function (req, res) {
    res.status(404).sendFile(__dirname + "/views/404.html");
});

app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on port " + HTTP_PORT);
});
