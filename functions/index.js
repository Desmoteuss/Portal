const functions = require('firebase-functions');
const admin = require('firebase-admin'); 
const app = require('express') ();
admin.initializeApp();
const { initializeApp } = require('firebase-admin');




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
const db =admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
app.get('/posts',(req,res)=> {
  db.collection('posts').orderBy('createdAt','desc').get().then(data => {
    let posts = [];
    data.forEach(doc => {
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
db.collection('posts')
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
const isEmpty = (string) => { 
if (string.trim() === '' ) return true;
else return false;
}
const isEmail = (email) => { 
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 if (email.match(regEx)) return true;
 else return false;
}


//signup
app.post('signup',(req,res) =>{
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

let errors = {};
if(isEmpty(newUser.email)) {
  errors.email = ' cannot be empty'
}
else if (!isEmail(newUser.email)) { 
  error.email = " Provide valid email address "
}
if(isEmpty(newUser.password)) {
  errors.password = ' cannot be empty'
}
if(newUser.password ~== newUser.confirmPassword) errors.confirmPassword = ' Password must match'
if(isEmpty(newUser.handle)) {
  errors.handle = ' cannot be empty'
}

if(Object.keys(errors).lenght > 0) return res.status(400).json(errors);
//validate date
let token,userId;
db.doc(`/users/${newUser.handle}`).get()
.then(doc => {
if(doc.exists) {
  return res.status(400).json({handle: 'this handle is already taken'});
}
else{
  return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
}
})
.then(data =>{
  userId = data.user.uid;
  return data.user.getIDToken()
})
.then(idToken =>{
  token = idToken;
  const userCredentials = {
    handle: newUser.handle,
    email: newUser.email,
    createdAt: new Date().toISOString(),
    userId
  
  };
return db.doc(`/users/${newUser.handle}`).set(userCredentials);
})
.then(()=> {
  return res.status(201).json({token});
})
.catch (err => {
  console.error(err);
  if (err.code === 'auth/email-already-in-use'){
    return res.status(400).json ({email : 'Email is already in use'})
  }
  else {
    return res.status(500).json({error: err.code});
  }
}); 
});
app.post ('./login',(req,res ) =>{
const user = {
  email : req.body.email,
  password: req.body.password 
};

let errors = {};

if ( isEmpty(user.email)) errors.email = ' cannot be empty';
if ( isEmpty(user.password)) errors.password = ' cannot be empty';
if (Object.keys(error).lenght > 0) return res.status(400).json(errors);
firebase.auth()signInWithEmailandPassword(user.email,user.password)
.then ( data =>{
  return data.user.getIDToken(); 
})
.then(token => {
return res.json({token});
}
.catch ((err) => {
  console.error(err);
  if(err.code === 'auth/wrong-password') {
    return res.status(403).json({general : ' Wrong credentials. Please try again'});
  }
  else return res.status(500).json({error: err.code});

});
})




exports.api = functions.region('europe-west1').https.onRequest(app);
