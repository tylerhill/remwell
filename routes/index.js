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
  console.log(upload);
  res.render('index', { title: 'Express' });
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

module.exports = router;
