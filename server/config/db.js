var mongoose = require('mongoose');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

  const  DB = 'mongodb://localhost:27017/projet0001' ;
  //Configure Mongoose
mongoose.connect(DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);
mongoose.set('debug', true);
