const mongoose = require('mongoose');
const {ip} = require('../config.json')

const connection = `mongodb://${ip}:27017/gortbase?gssapiServiceName=mongodb`

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