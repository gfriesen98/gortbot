const mongoose = require('mongoose');

const connection = 'mongodb://localhost:27017/?gssapiServiceName=mongodb'

mongoose.connect(connection,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true, 
		useCreateIndex: true
	}, 
			(err) => {
				if (err) {
					throw err;
				} else {
					console.log("Connected to DB");
				}
			}
);

console.log("connected");
