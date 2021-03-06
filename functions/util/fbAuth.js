// const { db } = require ('../index'); 
const { admin, db } = require ('./admin');

module.exports = ( req,res,next) =>{
    let idToken;
    if(req.headers.autorization && req.headers.autorization.startsWith('Bearer ')){
  idToken = req.headers.autorization.split('Bearer ')[1];
  
    } else{
      console.error('no token found')
      return res.status(403).json({error : ' unauthorized'});
    }
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db.collection('users')
      .where('userId', '==', req.user.uid)
      .limit(1)
      .get();
    })
    .then(data =>{
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch(err => {
      console.error('error while verifing token',err);
      return res.status(403).json(err);
    })
  }
  