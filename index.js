const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const secret = 'jgfddhdDQ3$ADQFXS';

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: secret, saveUninitialized: true, resave: true }));
//app.set('views',"/storage/emulated/0/node/voting/views");
app.set('views',"/voting/views");
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', {name: null, vote: null, error: null});
});

app.post('/', function(req,res){
	let name = req.body.name;
	let age = req.body.age;
	let vote = req.body.vote;
	let uu = "http://localhost/live/vote.php";
	let sess = req.session;
	
	if(name == "" || age == "" || vote == ""){
		sess.name = name; sess.age = age; sess.vote = vote; 
		res.render('index',{error: "Please fill in the required fields"});
	}
	
	else{
		request(uu,function(err,response,body){
		   if(err){
			res.render('index',{name: null, vote: null, error: "An error occurred while processing your request"});
		   }
		
		   else{
			
		   }
		});
	}
});

app.listen(3000, function () {
  console.log('NodeJS app listening on port 3000!')
});