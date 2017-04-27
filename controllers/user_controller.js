var express = require('express'),
	app = express(),
	userModel = require('../models/user_model'),
	jwt = require('jsonwebtoken');

var User = {};

User.createUser = function(req, res){
	userModel.insert(req.body)
	.then(function(result){
			res.status(201).json(result);
	})
	.catch(function(err){
			console.log("failed to create");
			res.status(409).json(err);
	});
};

User.updateUser = function(req, res){
	userModel.updateUser(req.params, req.body)
	.then(function(result){
		res.status(204).json(result);
	})
	.catch(function(err){
		res.status(304).json(err);
	});
};

User.login = function(req, res){
	userModel.login(req.body)
	.then(function(result){
		var token = jwt.sign(result,'constant');
		res.status(200).json({data:result, token:token});
	})
	.catch(function(err){
		res.status(400).json({err});
	});

};


module.exports =  User;