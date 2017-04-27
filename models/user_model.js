var app = require('express')(),
bcrypt = require('bcrypt-nodejs');

var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://localhost:27017/my_db';

var dbcon;
var UserModel = {};

mongo.connect(url,function(err, db){
	if(!err){
		db.createCollection('users');
		console.log("connected");
		dbcon = db;
	}
});	



var emailExist = function(userEmail) {
	return new Promise((resolve, reject) => {
		dbcon.collection('users').findOne({email:userEmail})
		.then(function(result){
			if(result){
				return resolve(true);
			}else{
				return resolve(false);
			}
		});
	});
};

UserModel.insert = function(body){
	return new Promise((resolve, reject) => {emailExist(body.email)
		.then(function(result){
			if(result){
				return resolve({errorMsg:"emailExist already existed."});
			}else{
					dbcon.collection('users').insert(body)
					.then(function(result){
						return resolve(result);
					})
					.catch(function(err){
						return reject(err);
					});
				}
			});
	});
};

UserModel.updateUser = function(params, body){
	return new Promise((resolve, reject) => {
		dbcon.collection('users').update({_id: new ObjectId(params.id) },{$set: body})
		.then(function(result){
			return resolve(result);
		})
		.catch(function(err){
			return reject(err);
		});

	});
};

UserModel.login = function(body){
	return new Promise((resolve, reject) => {
		dbcon.collection('users').findOne({email:body.email})
		.then(function(result){
			if(bcrypt.compareSync(body.password,result.password)) {
				return resolve(result);

			}else {
				return resolve(err);
			}
		})
		.catch(function(err){
			return reject(err);
		});
	});
}

UserModel.dropCollection = function(){
	return new Promise((resolve, reject) => {
		dbcon.collection('users').drop()
		.then(function(result){
			return resolve(result);
		})
		.catch(function(err){
			return reject(err);
		});
	});
}


module.exports = UserModel;