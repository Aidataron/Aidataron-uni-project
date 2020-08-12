var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
	username: String,
	yourname:String,
	password: String,
	details:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Details"
		}
	],
	contact:String,
	organization:String,
	country:String,
	querys:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Query"
			
		}
			
	]
});

userSchema.plugin(passportlocalmongoose);

var User = mongoose.model("User",userSchema);

module.exports = User;