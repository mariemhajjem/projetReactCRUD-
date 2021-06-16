var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var UserSchema = new mongoose.Schema({
  id: String,
  email: {type:String ,unique: true},
  password: String, 
  banned: { type: Boolean, default: false },
  role: { type:String ,default: "user"},
  nom:String,
  prenom: String,
  resetToken: String,
  resetTokenExpiration: Date,
  tel: Number,
  age : { type: Date },
  Niveau : { type: String }, 
  cin: String
});
UserSchema.plugin(uniqueValidator);

UserSchema.methods.toAuthJSON = function(){
  return {
      email: this.email,
      role: this.role,
      nom: this.nom,
      prenom: this.prenom
  };
};
 
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
