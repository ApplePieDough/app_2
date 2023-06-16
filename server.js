/*********************************************************************************************
 * WEB322 - Assignment 02
 * I declare that this assignemnt is my own work in accordance with Seneca Academic Policy. No part
 * of this assignement has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 * 
 * Name: Yaju Patel | Studnet ID: 175082213 | Date: June 2, 2023
 * 
 * cyclic Web App URL: https://beautiful-fox-earmuffs.cyclic.app/
 * 
 * GitHub Repository URL: https://github.com/ApplePieDough/web322-app
 *********************************************************************************************/

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
    blogService.getPublishedPosts().then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send({ message: error });
    });
});

// Route '/posts'
app.get("/posts", (req,res) => {
    blogService.getAllPosts().then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send({ message: error });
    });
});

// Route '/categories'
app.get("/categories", (req,res) => {
    blogService.getCategories().then((data) => {
        res.send(data);
    }).catch((error) => {
        res.send({ message: error });
    });
});

// Route '/posts/add'
app.get("/posts/add", (req, res) => {
    res.sendFile(__dirname + "/views/addPost.html");
});

// Handle 404 
app.use(function (req, res) {
    res.status(404).sendFile(__dirname + "/views/404.html");
});

blogService.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Express http server listening on port " + HTTP_PORT);
    });
  }).catch((error) => {
    console.error("Error initializing data:", error);
  });
  
