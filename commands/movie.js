const MovieRequest = require("../database/movieRequestModel.js");
const {MessageEmbed} = require('discord.js');

/**
 * Show movie requests in the chat
 * @param {String} message 
 */
async function showMovieRequests(message){
	try{
		const movies = await MovieRequest.find();
		console.log(movies);

		const msg = movies.map((n) => {
			n.doesOwn = n.doesOwn ? "yes" : "no";
			let messageEmbed = new MessageEmbed()
				.setColor('#0dac4e')
				.setTitle(n.name)
				.setDescription(n.vibes)
				.addField('Do it be downloaded: ', n.doesOwn ? "yes" : "no")
				.addField('Have we watched this: ', n.watched ? "yes" : "no")
				.addField('Requested By: ', n.requestor);
			return message.channel.send(messageEmbed);
		})

	}catch (err){
		console.log(err);
		return message.channel.send("Couldn't retrieve movie listing.");
	}	
}

/**
 * Adds a movie request
 * @param {String} message 
 */
function requestMovie(message){
	let args = message.content.split(" ");
	args.shift();
	args = args.join();
	
	let substring = args.split("'");
	
	substring = substring.filter((n) => {
		console.log(n);
		if (n !== '' && n !== ',' && n !==' '){
			return true;
		} else {
			return false;
		}
	}).map((x) => {
		return x.replace(/,/g, " ");
	});

	console.log(substring);
	
	const movie = {name: substring[0], vibes: substring[1], doesOwn: false, requestor: message.member.displayName};

	console.log(movie);
	let {name,vibes,doesOwn,requestor} = movie;
	const model = new MovieRequest({name, vibes, doesOwn, requestor});
	model.save((err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("saved to db");
		}
	})

	return message.channel.send(`${movie.name} added`);
}

// random number from two numbers given
function r(message){
	let args = message.content.split(' ');
	console.log(args);
	args.shift();
	if (args.length > 2) return message.channel.send("Only a range between two numbers is supported");
	let max, min;
	
	if (args[0] > args[1]) return message.channel.send("g!random [min] [max]");

	return message.channel.send(Math.floor(Math.random() * (args[1]- args[0] + 1) + args[0]));
}

function coinFlip(message){
	let rnum = Math.floor(Math.random() * (1000 - 0 + 1) + 0);
	return (rnum % 2 === 0) ? message.channel.send(`Heads \`(calc: ${rnum} % 2 = 0)\``) 
		 		: message.channel.send(`Tails \`(calc: ${rnum} % 2 = 1)\``); 
}


module.exports = {
	requestMovie,
	showMovieRequests,
	r,
	coinFlip
}
