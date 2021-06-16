var express = require('express');
var router = express.Router();
const crypto = require('crypto'); 
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
var User = require('../Models/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var VerifyToken = require('./VerifyToken');
const nodemailer = require('nodemailer'); 

var transport = {
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: "mariemhajjem10@gmail.com",
    pass: "m"
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

router.post('/register', function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.mdp, 8); 
    User.create({

      email : req.body.email, 
      password : hashedPassword, 
      
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.")
       
      let payload = { id: user._id , email : user.email}
      var token = jwt.sign(payload, 'secret', {
        expiresIn: 86400  
      });
      res.status(200).send({token:token});
    });
  });

router.get('/profile', VerifyToken, function(req, res, next) {

  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");

    res.status(200).send(user);
  });
});

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');

    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.mdp, user.password);

    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
     let payload = { id: user._id , role:user.role, email : user.email };
    var token = jwt.sign(payload, 'secret', {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

  router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });


  router.post('/resetPassword', function(req, res){
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString('hex');
      User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');

        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
         return res.status(200).send({'email': 'email was sended successfully'});
      })
      .catch(err => {
        console.log(err);
      });
  });
  });
router.post('/reset/:token', function(req , res){
  const newPassword = req.body.password;
  const token = req.params.token;
  let resetUser;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      resetUser.save();
      return res.status(200).send({'password': 'password updated successfully'});
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
