const functions = require('firebase-functions');
const admin = require('firebase-admin'); 
const app = require('express') ();
admin.initializeApp();
// const { initializeApp } = require('firebase-admin');





const config = {
  apiKey: "AIzaSyAbD24uyELRcQSk4GNrmXjzgZAOCmDri5U",
  authDomain: "portal-74634.firebaseapp.com",
  databaseURL: "https://portal-74634.firebaseio.com",
  projectId: "portal-74634",
  storageBucket: "portal-74634.appspot.com",
  messagingSenderId: "653730382236",
  appId: "1:653730382236:web:4a5faa12de91690caa4859",
  measurementId: "G-2DPS61WTEF"
};

// const app = express();
const firebase = require('firebase');
firebase.initializeApp(config)
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
app.get('/posts',(req,res)=> {
  admin.firestore().collection('posts').orderBy('createdAt','desc').get().then(data => {
    let posts = [];
    data.for.Each(doc => {
        posts.push({
          postId:doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          cretedAt: doc.data().createdAt
        });
    });
    return res.json(posts);
 })
 .catch((err)=> console.error(err));
});
app.post(`/post`,(req,res) => {
const newPost = { 
  body: req.body.body,
  userHandle: req.body.userHandle,
  cretedAt : new Date().toISOString()
};
admin.firestore().collection('posts')
.add(newPost)
.then((doc) => {
  res.json ({
    message:`document ${doc.id } created successfully`
  });
})
.catch((err)=> 
  {
    res.status(500).json({error:`something went wrong`}) 
  });
console.error(err);
});





//signup
app.post('signup',(req,res) =>{
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };




//validate date
firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
.then((data) =>{
  return res.status(201).json({message: `user${data.user.uid} signed up successfully`});
  })
.catch((err)=>{
  console.error(err);
  return res.status(500).json({error: err.code});
  });
});





exports.api = functions.region('europe-west1').https.onRequest(app);
