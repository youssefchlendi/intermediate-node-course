const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true  },
	responses: [{ type: mongoose.Schema.Types.ObjectId, ref:"Response"}]
});

TopicSchema.pre('find',function(next){
	this.populate('author','name')
	this.populate('responses')
	next()
})

module.exports= mongoose.model('Topic',TopicSchema)