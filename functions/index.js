const functions = require('firebase-functions');

const app = require('express') ();

const FBAuth = require('./util/fbAuth');
const { getAllPosts, postOnePost } = require ('./handlers/posts');
const { postOnePost } = require ('./handlers/posts');

const { signup, login, uploadImage } = require ( './handlers/users');

//posts
app.get('/posts',getAllPosts);
app.post(`/post`,FBAuth, postOnePost);

//users , signup
app.post('signup', signup);
app.post ('./login', login);
app.post( '/users/image', uploadImage)


exports.api = functions.region('europe-west1').https.onRequest(app);
