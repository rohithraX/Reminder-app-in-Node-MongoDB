var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var bodyparser=require('body-parser');

var url = "mongodb://localhost:27017/mydb";
console.log('Server-side code running');
app.listen(8080, () => {
  console.log('listening on 8080');
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/main.html');
});
app.use(bodyparser.json());
var urlencodedParser = bodyparser.urlencoded({ extended: false })
MongoClient.connect(url, (err, database) => {
    if(err) {
      return console.log(err);
    }
    var db = database.db("mydb");
    console.log("reached db");
    db.createCollection("customers", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      database.close();
    });
  });

app.post('/new', urlencodedParser,(req, res) => {
   console.log("inside new in appp.js");
   var rem={
       name:req.body.name,
       time:req.body.time
   }
   console.log(rem);
   MongoClient.connect(url, function(err, database) {
     var db = database.db("mydb");
     var lcl=db.collection('customers');
       lcl.insertOne(rem, function(err, result) {
       if(err){
         console.log('Some thing went wrong');
       }else{
       console.log('rem added to db');
       }
       database.close();
    });
  });

  res.redirect('/');

});










