const {admin, db } = required('../util/admin');
const config = require('../util/config');

const  firebase = require('firebase');
const { validateSignupDate } = require('../util/validators');
firebase.initializeApp(config)


const  { validateSignupDate, validateLoginDate, reduceUserDetails} = require('../util/validators');

//sign in
exports.signup =  (req,res) =>{
      const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
      };
    
    
    //validate date
    const { valid,errors } = validateSignupDate(newUser);

    if(!valid) return res.status(400).json(errors);


    let token,userId;
    
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
      userId = data.user.uid;
      return data.user.getIDToken()
    })
    .then(idToken =>{
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      
    
      };
    
    return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(()=> {
      return res.status(201).json({token});
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
    
    }

//login user
    exports.login = (req,res) =>{
        const user = {
          email : req.body.email,
          password: req.body.password 
        
        };
        
          const { valid, errors } = validateLoginDate(user);

    if(!valid) return res.status(400).json(errors);
        
        firebase.auth().signInWithEmailandPassword(user.email, user.password)
        .then ( (data)=>{
          return data.user.getIDToken(); 
        })
        .then((token) => {
        return res.json({token});
        
        })
        .catch((err) => {
          console.error(err);
          if(err.code === 'auth/wrong-password') {
            return res.status(403).json({general : ' Wrong credentials. Please try again'});
          }
          else return res.status(500).json({error: err.code});
        
        
          });
        };
//user details
exports.addUserDetails = (req, res) => {
let userDetails = reduceUserDetails(req.body);
db.doc(`/users/${req.user.handle}`).update(userDetails)
.then(()=>{

return res.json({message: 'Details added successfully'});
})
.catch(err => {
  console.error(err);
    return res.status(500).json({error:err.code});
})
}

exports.uploadImage = (req,res ) => {
const BusBoy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const busboy = new busboy({ headers : req.headers });

 let imageFileName; 
 let imageToBeUploaded= {};

 busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
 if(mimetype!== 'image/jpeg' && mimetype !== 'image/png') {
   return res.status(400).json({error: ' wrong file type submitted'})
 }

    const imageExtension = filename.split('.')[filename.split('.').lenght -1];

    imageFileName = `${Math.round(Math.random()*100000000)}.${imageExtansion}`;
    const filepath  = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = {filepath, mimetype};
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', ()=> {
    admin.storage().bucket().upload(imageToBeUploaded.filepath), {
      resumable: false,
      metadata: {
        contentType: imageToBeUploaded.mimetype
      }
    }
  })
  .then (() => {
    const imageUrl = `https://firebasestore.googleapis.com/v0/b${config.storageBucket}/o/${imageFileName}?alt=media`;
    return db.doc(`/users/${req.user.handle}`).update ({ imageUrl });
  })
  .then(() => {
    return res.json({ message: 'Image uploaded successfully'});
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({ error: err.code })
  });

busboy.end(req.rawBody);
};
