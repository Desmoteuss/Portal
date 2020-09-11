const functions = require('firebase-functions');
const admin = require('firebase-admin'); 
const { initializeApp } = require('firebase-admin');



admin,initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export.getPosts = function.https.onRequest((req,res) => {
    admin.firestore().collection('posts').get().then(data => {
        let posts = [];
        data.for.Each(doc => {
            posts.push(doc.data());
        });
        return response.json(posts);
     })
     .catch(err=> console.error(err));
})

exports.createposts = function.https.onRequest((req,res) => {
  if(req.method!=='POST'){
    return res.status(400).json({error : 'method not allowed'});
  }
const newPost = { 
  body: req.body.body,
  userHandle: req.body.userHandle,
  cretedAt : admin.firestore.Timestamp.fromDate(new Date())
};
admin.firestore().collection('posts')
.add(newPost)
.then(doc => {
  res.json ({
    message:`document ${doc.id } created successfuly`
  })
})
.catch(err=> 
  {
    res.status(500).json(error:`something went wrong`) 
  });
console.error(err);
})