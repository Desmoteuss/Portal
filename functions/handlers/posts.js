const { db } = require('../util.admin');


exports.getAllPosts = (req,res)=> {
      db.collection('posts').orderBy('createdAt','desc').get().then(data => {
        let posts = [];
        data.forEach(doc => {
            posts.push({
              postId:doc.id,
              body: doc.data().body,
              userHandle: doc.data().userHandle,
              cretedAt: doc.data().createdAt,
            commentCount: doc.data().commentCount,
            likeCount: doc.data().likeCount
            });
        });
        return res.json(posts);
      })
     .catch((err)=> {
    console.error(err);
    res.status(500).json({ error: err.code });
      });
    }




    exports.postOnePost = (req,res) => {
        if ( req.bidy.body.trim() === '') {
          return res.status(400).json ( {body: 'body must not be empoty'});
        }
      const newPost = { 
        body: req.body.body,
        userHandle: req.body.handle,
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
      }