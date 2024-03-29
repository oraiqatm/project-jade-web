var PORT = process.env.PORT || 3000;
var express = require('express')
var admin = require("firebase-admin");
var bodyParser = require('body-parser'); //used to pass post data

var urlencoderParser = bodyParser.urlencoded({extended:false});
// Fetch the service account key JSON file contents
var serviceAccount = require("./serviceAccountKey.json");
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pythondb-6b948.firebaseio.com"
  });
// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("/py_command")

var app =express();
app.set ('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/rasp', function(req, res){
    ref.once("value", function(snapshot) {
        res.send(snapshot.val());
    });
    
});

app.get('/', function(req, res){
    ref.once("value", function(snapshot){
        res.render('index');
    });
});

app.post('/rasp',urlencoderParser, function(req, res){
    var rasp_command = req.param('Rasp_Command');
    var colorP = req.param('Color')
    console.log(rasp_command);
    ref.set({command: rasp_command, color: colorP});
    ref.once("value", function(snapshot) {
        res.send(snapshot.val());
    });
});





app.listen(PORT);