const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieRequestSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	vibes: {
		type: String,
		required: true
	},
	doesOwn: {
		type: Boolean,
		default: false
	},
	requestor: {
		type: String,
		required: true
	},
	watched: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model("MovieRequest", movieRequestSchema, "movie_requests");
