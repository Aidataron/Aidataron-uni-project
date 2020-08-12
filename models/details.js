var mongoose = require("mongoose");

var detailsSchema = new mongoose.Schema({
	contact:String,
	organization:String,
	country:String
});

var Detail = mongoose.model("Detail" , detailsSchema);

module.exports = Detail;