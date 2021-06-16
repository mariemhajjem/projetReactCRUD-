var jwt = require('jsonwebtoken');
let User = require('../Models/User');

//middleware function:handle all the authorization
function verifyToken(req, res, next) {
  if (!req.headers.authorization)
    return res.status(401).send('Unauthorized!!!!....');


  if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer'){
   
    let token= req.headers.authorization.split(' ')[1];
    jwt.verify(token,'secret', function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    req.user = User.findById(req.userId, { password: 0 }, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (user) return  user;
  })

    next();
    });
   }
  else
  {
    return res.status(401).send('noooo.');
  }
}
module.exports = verifyToken;
