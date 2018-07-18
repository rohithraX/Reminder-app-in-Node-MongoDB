var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var app = express();
var bodyparser = require('body-parser');

var url = "mongodb://localhost:27017/mydb";
console.log('Server-side code running');
app.listen(8080, () => {
  console.log('listening on 8080');
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use(bodyparser.json());
var urlencodedParser = bodyparser.urlencoded({ extended: false })
MongoClient.connect(url, (err, database) => {
  if (err) {
    return console.log(err);
  }
  var db = database.db("mydb");
  console.log("reached db");
  db.createCollection("customers", function (err, res) {
    if (err) throw err;
    console.log("Collection created!");
    database.close();
  });
});



app.post('/new', urlencodedParser, (req, res) => {
  console.log("inside new in appp.js");
  //  var rem={
  //      name:req.body.name,
  //      time:req.body.time
  //  }
  var rem = {
    //id: issueId,
    title: req.body.issueTitleInput,
    description: req.body.issueDescInput,
    severity: req.body.issueSeverityInput,
    date: req.body.issueDateInput,

  }
  console.log(rem);
  MongoClient.connect(url, function (err, database) {
    var db = database.db("mydb");
    var lcl = db.collection('customers');
    lcl.insertOne(rem, function (err, result) {
      if (err) {
        console.log('Some thing went wrong');
      } else {
        console.log('rem added to db');
      }
      database.close();
    });
  });

  res.redirect('/');

});




app.get('/show', urlencodedParser, (req, res) => {//parsr not needed
  console.log("inside show in appp.js");

  MongoClient.connect(url, function (err, database) {
    var db = database.db("mydb");
    var lcl = db.collection('customers');
    // var ret= lcl.find().toArray();
    // console.log("this" +ret);

    //res.send(ret);
    //console.log(ret);database.close();
    lcl.find().toArray((err, result) => {
      //console.log(result);
      //if (err) return console.log(err);
      res.send(result);


    });

  });
  //////////this is the reason for error . cant set headers once sent!!
  //res.redirect('/show');
});






var objectId = require('mongodb').ObjectId;

//////delete
app.post('/delete', (req, res) => {
  //parsr not needed
  //sObjectId = MongoClient.ObjectID;
  console.log(req.body);
  var lidid = objectId(req.body._id);

  var myquery = { "_id": lidid };
  console.log("myquery");

  console.log(myquery);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    //console.log(req.body);

    //myquery=JSON.stringify(myquery); // '{"name":"binchen"}'
    // console.log(myquery);
    dbo.collection("customers").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
    //res.redirect('/show');

});






app.post('/update', (req, res) => {
  console.log("hi");
  var lidid = objectId(req.body._id);
  console.log("updating in appp");
  console.log(req.body._id);
  var myquery = { "_id": lidid };
  console.log("myquery");

  console.log(myquery);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("customers").findOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log(obj);
      res.send(obj);
    })
    dbo.collection("customers").deleteOne(myquery, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
});



























// app.get('/update', urlencodedParser, (req, res) => {//parsr not needed
//   console.log("hello appp update");
//   console.log(req.body);

//   var lidid=objectId(req.body._id );

//   var myquery = { "_id" : lidid};
//   MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     //var myquery = { "_id" : objectId(req.body._id) };
//     //myquery=JSON.stringify(myquery); // '{"name":"binchen"}'
//     console.log(myquery);
//     //var result=
//     ///////
//     // dbo.collection("customers").findOne(myquery, function (err, obj) {
//     //   if (err) throw err;
//     //   console.log(obj);
//     //   res.send(obj);
//     // })
//     // dbo.collection("customers").deleteOne(myquery, function (err, obj) {
//     //   if (err) throw err;
//     //   console.log("1 document deleted");
//     //   db.close();
//     // });
//     ////////
//     var lcl = dbo.collection('customers');
//     var rax=lcl.find(myquery).toArray();
//     console.log(rax);
//     lcl.find(myquery).toArray((err, result) => {
//       //console.log(result);
//       if (err) return console.log(err);
//       res.send(result);
//       console.log(result);

//     });
//   });
// });

