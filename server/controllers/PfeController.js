var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer'); 
const multer = require('multer'); 
const fs = require('fs');
const Pfe = require('../Models/Pfe');
const VerifyToken = require('./VerifyToken');
const creds = require('../config/contactConfig');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pfe');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-')+"-"+ file.originalname);
  }
});
const upload =multer({
  storage: fileStorage
});
var transport = {
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: creds.USER,
    pass: creds.PASS
  },
  tls: {
    rejectUnauthorized: false
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});
router.post('/sendConfirmation/:id', async(req, res, next) => {
  let id =req.params.id;
  const rapport = await Pfe.findOne({_id : id});
  var name = rapport.Nom
  var email = rapport.Email
  var mail = {
    from: name,
    to: email,  //Change to email address that you want to receive messages on
    subject: 'Nouveau message',
    html: '<h1>rapport acceptée</h1>/</br>'
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail'
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
});
router.post('/sendRefuse/:id', async(req, res, next) => {
  let id =req.params.id;
  const rapport = await Pfe.findOne({_id : id});
  var name = rapport.Nom
  var email = rapport.Email
  var mail = {
    from: name,
    to: email,  //Change to email address that you want to receive messages on
    subject: 'Nouveau message ',
    html: '<h1>rapport refusé</h1>/</br>'
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail'
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
});

router.post('/Create/',upload.single('rapport'), VerifyToken, function (req, res) {
    console.log(req.body)
    Pfe.create({
        title : req.body.title,
        userId: req.userId,  
        rapport : req.file.path,
        enseignantId:req.body.enseignantId
        },
        function (err, Pfe) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(Pfe);
        });
});

router.get('/List/:id', function (req, res) {
  Pfe.find({userId : req.params.id}, function (err, Pfe) {
      if (err) return res.status(500).send("There was a problem finding the Pfe.");
      res.status(200).send(Pfe);
  });
});

router.get('/Lists', function (req, res) {
  Pfe.find({}, function (err, Pfe) {
      if (err) return res.status(500).send("There was a problem finding the Pfe.");
      res.status(200).send(Pfe);
  });
});

router.get('/GetOne/:id', function (req, res) {
    Pfe.findById(req.params.id, function (err, rapport) {
        if (err) return res.status(500).send("There was a problem finding the Pfe.");
        if (!rapport) return res.status(404).send("No rapport found.");
        res.status(200).send(rapport);
    });
});

router.route('/update/:id').put(function (req, res) {
  Pfe.findById(req.params.id, function(err, rapport) {
    if (!rapport)
      return next(new Error('Could not load Document'));
    else {
        rapport.confirm = true;
        console.log(req.body.confirm);
        rapport.save().then(rapport => {
         console.log(rapport);
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// DELETES A Pfe FROM THE DATABASE
router.delete('/DeleteOne/:id', function (req, res) {
    Pfe.findByIdAndRemove({_id: req.params.id}, function(err, rapport){
      if(err) res.json(err);
      else res.json('Successfully removed');
  });
});
router.get('/OpenFile/:id', function (req, res) {
  Pfe.findById(req.params.id, function (err, rapport) {
      if (err) return res.status(500).send("There was a problem finding the Pfe.");
      if (!rapport) return res.status(404).send("No rapport found.");
      fs.readFile(rapport.cahierDeCharge, (err , data)=>{
        if(err){
          console.log(err);
        }else{
          console.log(data);
          res.send(data);
        }
      });
  });
});
module.exports = router;
