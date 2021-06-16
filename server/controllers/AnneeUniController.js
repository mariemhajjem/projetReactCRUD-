var express = require('express');
var router = express.Router(); 
var AnneeUni = require('../Models/AnneeUni');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

 
router.post('/Create',function (req, res) {
    AnneeUni.create({
        Annee : req.body.nomAnnee,
        DateDepotPFE: req.body.DateDepotPFE 
        },
        function (err, AnneeUni) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(AnneeUni);
        });
});
 
router.get('/List', function (req, res) {
    AnneeUni.find({}, function (err, AnneeUni) {
        if (err) return res.status(500).send("There was a problem finding the partnaire.");
        res.status(200).send(AnneeUni);
    });
});
 
router.get('/GetOne/:id', function (req, res) {
    AnneeUni.findById(req.params.id, function (err, AnneeUni) {
        if (err) return res.status(500).send("There was a problem finding the partnaire.");
        if (!AnneeUni) return res.status(404).send("No partnaire found.");
        res.status(200).send(AnneeUni);
    });
});


router.delete('/DeleteOne/:id', function (req, res) {
    AnneeUni.findByIdAndDelete(req.params.id, function (err, AnneeUni) {
        if (err) return res.status(500).send("There was a problem finding the partnaire.");
        res.status(200).send("Partnaire:   was deleted.");
    });
});

module.exports = router;
