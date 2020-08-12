var mongoose = require("mongoose");

var querySchema = new mongoose.Schema({
	subject:String,
	details:String
});

var Query = mongoose.model("Query" , querySchema);

module.exports = Query;