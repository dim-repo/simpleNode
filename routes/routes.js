var express = require('express'),
 	router  = express.Router(),
 	bcrypt = require('bcrypt-nodejs'),
 	jwt = require('jsonwebtoken');


var userController = require('../controllers/user_controller');


function validatePassword(req, res , next) {
	req.checkBody({
		'password':{
    		notEmpty: true,
    		isLength: {
		      	options: [{min:6}],
		      	errorMessage: 'Invalid Length'
		    },
		   	matches: {
		    	options: [/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/],
		    	errorMessage: 'Invalid Password needs to have aleast one special character and capital letter.'
		    }
		}
	});

	var error = req.validationErrors();
	if(error.length > 0){
		return res.status(400).json(error)
	}
	req.body.password = bcrypt.hashSync(req.body.password);
	next();
}


function checkToken(req, res, next){

  
  var token = req.headers['token'];
 

  if (token) {

    jwt.verify(token,'constant', function(err, decoded) {      
      if (err) {
        return res.status(500).json({message: 'Failed to authenticate token.' });    
      } else {
        
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    return res.status(403).json({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
};


router.post('/createUser',validatePassword, userController.createUser);
router.post('/login', userController.login);
router.put('/updateUser/:id', checkToken, validatePassword, userController.updateUser);


module.exports = router;