const fs = require('fs');

let posts = [];
let categories = [];

// fill posts[] and categories[]
function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/posts.json', 'utf8', (err, postData) => {
      if (err) {
        reject('Unable to read posts.json');
        return;
      }

      posts = JSON.parse(postData);

      fs.readFile('./data/categories.json', 'utf8', (err, categoryData) => {
        if (err) {
          reject('Unable to read categories.json');
          return;
        }

        categories = JSON.parse(categoryData);

        resolve();
      });
    });
  });
}

// retrieve posts
function getAllPosts() {
  return new Promise((resolve, reject) => {
    if (posts.length > 0) {
      resolve(posts);
    } else {
      reject('No posts available');
    }
  });
}

// retireve posts that are uploaded 
function getPublishedPosts() {
  return new Promise((resolve, reject) => {
    const publishedPosts = posts.filter(post => post.published);
    if (publishedPosts.length > 0) {
      resolve(publishedPosts);
    } else {
      reject('No published posts available');
    }
  });
}

// retrieve data from categories
function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length > 0) {
      resolve(categories);
    } else {
      reject('No categories available');
    }
  });
}

// add new post 
function addPost(postData) {
  return new Promise((resolve, reject) => {
    const newPost = {
      id: posts.length + 1,
      title: postData.title,
      content: postData.content,
      published: postData.published === undefined ? false : true,
    };

    posts.push(newPost);

    resolve(newPost);
  });
}

// retrieve posts by category
function getPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter(post => post.category === category);

    if (filteredPosts.length > 0) {
      resolve(filteredPosts);
    } else {
      reject('No results returned');
    }
  });
}

// retrieve posts by minimum date
function getPostsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter(post => new Date(post.postDate) >= new Date(minDateStr));

    if (filteredPosts.length > 0) {
      resolve(filteredPosts);
    } else {
      reject('No results returned');
    }
  });
}

// retrieve post by id
function getPostById(id) {
  return new Promise((resolve, reject) => {
    const foundPost = posts.find(post => post.id === id);

    if (foundPost) {
      resolve(foundPost);
    } else {
      reject('No result returned');
    }
  });
}

//retrieve published posts by category 
function getPublishedPostsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredPosts = posts.filter(post => post.published && post.category === category);
    if (filteredPosts.length > 0) {
      resolve(filteredPosts);
    } else {
      reject('No published posts available in the given category');
    }
  });
}


// expost funcitons
module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories,
  addPost,
  getPostsByCategory,
  getPostsByMinDate,
  getPostById,
  getPublishedPostsByCategory
};
