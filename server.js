/*********************************************************************************************
 * WEB322 - Assignment 03
 * I declare that this assignemnt is my own work in accordance with Seneca Academic Policy. No part
 * of this assignement has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 * 
 * Name: Yaju Patel | Studnet ID: 175082213 | Date: June 16, 2023
 * 
 * cyclic Web App URL: https://beautiful-fox-earmuffs.cyclic.app/
 * 
 * GitHub Repository URL: https://github.com/ApplePieDough/web322-app
 *********************************************************************************************/


// require blog-service.js
var blogData = require("./blog-service");
var multer = require("multer"); // Require multer
var cloudinary = require("cloudinary").v2; // Require cloudinary
var streamifier = require("streamifier"); // Require streamifier

// handlebars
var exphbs = require('express-handlebars');// Require handlebars
// safe html 
const stripJs = require('strip-js');


//configuring cloudinary credentials 
cloudinary.config({
    cloud_name: 'drz2a146g',
    api_key: '961926373394416',
    api_secret: 'mgjjoQ7lzxWtW3WHSRUk-AmFn3o',
    secure: true
});

//denying disk storage
const upload = multer();

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handlebars configuration
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

// active route
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

// custom helpers 
//TODO



// Route '/' redirects to '/about'
app.get("/", (req, res) => {
    res.redirect("/about");
});

// Route '/about' 
app.get("/about", (req, res) => {
  res.render("about");
});


// Route '/blog'
app.get('/blog', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blogData.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blogData.getPublishedPosts();
      }

      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // get the latest post from the front of the list (element 0)
      let post = posts[0]; 

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;
      viewData.post = post;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the full list of "categories"
      let categories = await blogData.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})

});

// Route '/posts'
app.get("/posts", (req, res) => {
  const category = req.query.category;
  const minDate = req.query.minDate;

  if (category) {
      blogData
          .getPostsByCategory(category)
          .then((data) => {
              res.render("posts", { posts: data });
          })
          .catch((error) => {
              res.render("posts", { message: "no results" });
          });
  } else if (minDate) {
      blogData
          .getPostsByMinDate(minDate)
          .then((data) => {
              res.render("posts", { posts: data });
          })
          .catch((error) => {
              res.render("posts", { message: "no results" });
          });
  } else {
      blogData
          .getAllPosts()
          .then((data) => {
              res.render("posts", { posts: data });
          })
          .catch((error) => {
              res.render("posts", { message: "no results" });
          });
  }
});

// Route '/categories'
app.get("/categories", (req, res) => {
  blogData.getCategories()
    .then((data) => {
      res.render("categories", { categories: data });
    })
    .catch((error) => {
      res.render("categories", { message: "no results" });
    });
});

// Route '/posts/add'
app.get("/posts/add", (req, res) => {
  res.render("addPost");
});

// POST route '/posts/add'
app.post("/posts/add", upload.single("featureImage"), (req, res) => {
    if (req.file) {
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
  
      async function uploadAndAddPost(req) {
        try {
          const uploaded = await streamUpload(req);
          const imageUrl = uploaded.url;
          const postData = {
            title: req.body.title,
            content: req.body.content,
            published: req.body.published === undefined ? false : true,
          };
  
          blogData
            .addPost(postData)
            .then((newPost) => {
              res.redirect("/posts");
            })
            .catch((error) => {
              res.send({ message: error });
            });
        } catch (error) {
          res.send({ message: error });
        }
      }
  
      uploadAndAddPost(req);
    } else {
      processPost("");
    }
  });

// route blog by id "/blog/:id"
app.get('/blog/:id', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blogData.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blogData.getPublishedPosts();
      }

      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the post by "id"
      viewData.post = await blogData.getPostById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }

  try{
      // Obtain the full list of "categories"
      let categories = await blogData.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})
});

  // route "posts/(id value)"
app.get("/posts/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    blogData.getPostById(postId)
      .then((post) => {
        res.send(JSON.stringify(post));
      })
      .catch((error) => {
        res.send({ message: error });
    });
});


// Handle 404 
app.use(function (req, res) {
    res.status(404).sendFile(__dirname + "/views/404.html");
});

blogData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Express http server listening on port " + HTTP_PORT);
    });
  }).catch((error) => {
    console.error("Error initializing data:", error);
  });
  
