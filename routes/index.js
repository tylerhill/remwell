var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, 'pans.jpg');
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
    console.log(dbinst);
    console.log(req.body);
    console.log(req.file);
    //dbinst.serialize(function() {
    //  dbinst.run('insert into posts values ((?), (?), (?))',title,pic,blurb);
    //});
  });

module.exports = router;
