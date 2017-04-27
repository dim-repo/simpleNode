var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var userModel = require('../models/user_model');

chai.use(chaiHttp);

describe('Blobs',function(){

	  userModel.dropCollection();
	  var sampleInsertData = {
	  	"email":"sample@gmail.com",
	  	"firstname":"cardo",
	  	"lastname":"dalisay",
	  	"password":"Cardo@123"
	  };

	  var sampleInvalidLengthData = {
	  	"email":"yahoo@gmail.com",
	  	"firstname":"cardo",
	  	"lastname":"dalisay",
	  	"password":"123"
	  };

	  var loginData = {
	  	"email":"sample@gmail.com",
	  	"password":"Cardo@123"
	  };

	  var dropCollection = function(){
	  	userModel.dropCollection()
	  	.then(function(result){
	  		console.log("dropped");
	  	})
	  	.catch(function(err){
	  		console.log("error droping");
	  	});
	  };

	  var id;

	  var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJlbmFudG9saXNkaW1mdWxAZ21haWwuY29tIiwiZmlyc3RuYW1lIjoiRElNRlVMIiwibGFzdG5hbWUiOiJiZW5hbnRvbGlzIiwicGFzc3dvcmQiOiIkMmEkMTAkREJGdVRhZjcwQ0JmMzcuQVc2UmNYZTNOb2p1bldFbW9WRTNKelhwMWdGVTI1OTJYcFJkSmUiLCJfaWQiOiI1OTAwMmJmODJlNGVjNzE4MzQ1NzEwYTUiLCJpYXQiOjE0OTMxOTkwNDB9.gMfYdKPZ4A0-EvT6aiFY0rp9wLUB9dtr6IUC6F8lGVM'


	  after(function(done){
	  	dropCollection();
	  	done();
	  });

	   it('should create User on /user/createUser',function(done){
	   	chai.request(server)
	   	.post('/user/createUser')
	   	.send(sampleInsertData)
	   	.end(function(err, res){
	   		id = res.body.ops[0]._id;
	   		res.should.be.json;
	   		res.should.have.status(201);
	   		res.should.be.a('object');
	   		done();
	   	});
	   });


	    it('should have errorMsg with "emailExist already existed." value on /user/createUser',function(done){
	   	chai.request(server)
	   	.post('/user/createUser')
	   	.send(sampleInsertData)
	   	.end(function(err, res){
	   		res.should.be.json;
	   		res.should.have.status(201);
	   		res.should.be.a('object');
	   		res.body.should.have.property('errorMsg').eql('emailExist already existed.');
	   		done();
	   	});
	   });


	    it('should have errorMsg with "Invalid Length/Invalid Password needs to have aleast one special character and capital letter." value on /user/createUser',function(done){
	   	chai.request(server)
	   	.post('/user/createUser')
	   	.send(sampleInvalidLengthData)
	   	.end(function(err, res){
	   		res.should.be.json;
	   		res.should.have.status(400);
	   		res.should.be.a('object');
	   		res.body[0].should.have.property('msg').eql('Invalid Length');
	   		res.body[1].should.have.property('msg').eql('Invalid Password needs to have aleast one special character and capital letter.');
	   		done();
	   	});
	   });


	   it('should login User on /user/login',function(done){
	   	chai.request(server)
	   	.post('/user/login')
	   	.send(loginData)
	   	.end(function(err, res){
	   		res.should.be.json;
	   		res.should.have.status(200);
	   		res.should.be.a('object');
	   		res.body.should.have.property('data');
	   		res.body.should.have.property('token');
	   		done();
	   	});
	   });

	   it('should update User on /user/updateUser/:id',function(done){

	   	chai.request(server)
	   	.put('/user/updateUser/'+id)
	   	.set('token',token)
	   	.send(sampleInsertData)
	   	.end(function(err, res){
	   		res.should.have.status(204);
	   		res.should.be.a('object');
	   		done();
	   	});
	   });
	  // it('should list a SINGLE blob on /blob/<id> GET');
	  // it('should add a SINGLE blob on /blobs POST');
	  // it('should update a SINGLE blob on /blob/<id> PUT');
	  // it('should delete a SINGLE blob on /blob/<id> DELETE');
});
