var http = require('http');


const port = process.env.PORT || 3000;
const server = http.createServer(function(req, res) {
	
 /*hello('Testing Edge in NodeJS',function(error,result){
	if(error) throw error;
	console.log(result);
});*/
	
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write('<h3 style=\'color:red;\'>NodeJS is here</blockquote></center>');
  res.end('');

 
});
server.listen(port, function() {
  console.log('Server running at port: ' + port);
});