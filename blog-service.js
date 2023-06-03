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

// expost funcitons
module.exports = {
  initialize,
  getAllPosts,
  getPublishedPosts,
  getCategories
};
