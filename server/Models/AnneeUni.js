const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let annee = new Schema({
    Annee : {
      type: String
    }, 
    DateDepotPFE: {
        type: Date
    },
  },
  {
    collection: 'annee'
  }, {timestamps: true});


module.exports = mongoose.model('annee', annee);
