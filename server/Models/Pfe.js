var mongoose = require('mongoose');
const User = require('../Models/User');
var RapportPFESchema = new mongoose.Schema({
    title: String,
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
    rapport: String, 
    confirmed :{ type: Boolean, default: false },
    enseignantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
});
mongoose.model('Pfe', RapportPFESchema);

module.exports = mongoose.model('Pfe');
