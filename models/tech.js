var mongoose = require("mongoose");

var techSchema = new mongoose.Schema({
	heading:String,
	image:String,
	post:String
});

var Tech = mongoose.model("Tech" , techSchema);

module.exports = Tech;