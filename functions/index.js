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
    admin.firestorm().collection('posts').get().then(data => {
        let posts = [];
        data.for.Each(doc => {
            postMessage.push(doc.data());
        });
        return.response.json(screams);
     })
     .catch(err=> console.err());
})

