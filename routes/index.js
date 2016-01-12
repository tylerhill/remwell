var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, 'header.jpg');
  }
});

var upload = multer({ storage: storage });



/* GET home page. */
router.get('/', function(req, res, next) {
  var dbinst = req.app.get('db');
  var posts = [];
  dbinst.each('select rowid, * from posts', function(err,row) {
    var capt = row.capt.substring(0,300);
    capt = capt.concat('...');
    posts.push({id: row.rowid, title: row.title, capt: capt});
  },
  function() {
    console.log(posts);
    res.render('index', { posts: posts });
  });
});


router.get('/admin',function(req,res,next) {
    res.render('admin');
});
router.post('/admin',upload.single('pic'),function(req,res,next) {
    var dbinst = req.app.get('db');
    var title = req.body.title;
    var capt = req.body.capt;
    var last;
    dbinst.serialize(function() {
      dbinst.run('insert into posts values(?,?)', title,capt);
      dbinst.get('select last_insert_rowid() as lastid',function(err,row) {
        last = row.lastid;
        console.log(last);
        fs.mkdir('./uploads/post'+last,function(){
          fs.rename('./uploads/header.jpg', './uploads/post'+last+'/header.jpg');
        });
      });
    });
  res.render('admin');
  });

router.get('/post/:id', function(req,res,next) {
  var current = req.params.id;
  var dbinst = req.app.get('db');
  var post;
  dbinst.get('select * from posts where rowid = (?)',current,function(err,row) {
    post = {id: current, title: row.title, capt: row.capt };
    console.log(post);
    res.render('post', { post: post });
  });
});

module.exports = router;
