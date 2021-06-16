var express = require('express');
var router = express.Router(); 

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
var User = require('../Models/User');
var bcrypt = require('bcryptjs');

router.post('/enseignant', function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.cin, 8); 
    User.create({
            nom : req.body.nom,
            prenom : req.body.prenom,
            email : req.body.email,
            password :hashedPassword,
            cin : req.body.cin,
            age : req.body.age,
            role : "enseignant"
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

router.post('/etudiant', function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.cin, 8); 
    User.create({
            nom : req.body.nom,
            prenom : req.body.prenom,
            email : req.body.email,
            password :hashedPassword,
            cin : req.body.cin,
            age : req.body.age,
            role : "user"
        },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});
router.get('/etudiants', function (req, res) {
    User.find({role:"user"}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});
router.get('/en', function (req, res) {
    User.find({role:"enseignant"}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});
 
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});
 
router.delete('/:id', function (req, res) {
    User.findByIdAndDelete(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send(user);
    });
});
 
router.put('/:id', function (req, res) {
     let id = req.params.id;
    User.findByIdAndUpdate(id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});


module.exports = router;
