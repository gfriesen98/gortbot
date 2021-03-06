const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
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

module.exports = mongoose.model("Movie", movieSchema, "movie");
