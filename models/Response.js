const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
	comment: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
	topic: { type: mongoose.Schema.Types.ObjectId, ref:"Topic" }
});

ResponseSchema.pre('find',function(next){
	this.populate('author','name')
	next()
})

module.exports= mongoose.model('Response',ResponseSchema)