const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');   
const multers3 = require('multer-s3');
const AWS = require('aws-sdk');


const s3 = new AWS.S3({

    accessKeyId: 'AKIAW67MBQBTR2HRGQ7Y',
    secretAccessKey: '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'
});

const uploadS3 = multer({
    storage: multers3({
      s3: s3,
      acl: 'public-read',
      bucket: 'multer-s3-upload',
      metadata: (req, file, cb) => {
        cb(null, {fieldName: file.fieldname})
      },
      key: (req, file, cb) => {
        cb(null, Date.now().toString() + '-' + file.originalname)
      }
    })
  });



// Check File Type
function checkFileType(file, cb){
    // Allowed Ext
    const filetypes = /jpeg|jpg|png|gif|jif/;
    // Check Ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true); 
    } else {
        cb('Error: Images Only!');
    }
}



// init app
const app = express();

// ejs 
app.set('view engine', 'ejs');

// public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', uploadS3.single('myImage'),(req, res) => {
    (req, res, (err) => {
        if (err){
            res.render('index', {
                msg: err
            });
        } else {
           if(req.file == undefined){
            res.render('index', {
                msg: 'Error: No file selected!'
            });
           } else {
            res.render('index', {
                msg: 'File  Uploaded!', 
                file: `uploads/${req.file.filename}`
            });       
           }
        }
    });
});

const port = 4000;

app.listen(port, () => console.log(`Server started on port ${port}`));




