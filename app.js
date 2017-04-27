var app = require('express')(),
 	routes = require('./routes/routes'),
	bodyParser = require('body-parser'),
	validator = require('express-validator');


//Middleware function to log request protocol
app.use(bodyParser.json());
app.use( validator() );
app.use(bodyParser.urlencoded({ extended: true })); 

//app route handlers
app.use('/user',routes);



app.listen(3000, function(){
	console.log('Sir Dim, we are now running your app');
});

module.exports = app;