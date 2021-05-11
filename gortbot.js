require('dotenv').config();
const Discord = require('discord.js');
const prefix = process.env.PREFIX
const music = require('./commands/music.js');
const movie = require('./commands/movie.js');
const gortflix = require('./commands/gortflix');
const systools = require('./systools');
const fs = require('fs')
const client = new Discord.Client();
require('./database/connection');

const smug = [];
const reacc = [];

fs.readdir(process.env.SMUG_PATH, (err, files) => {
  if (err) {
    return systools.saveLogs("SMUG_LOAD", err.toString());
  }
  files.forEach((file) => {
    smug.push(file);
  });
}); console.log('SMUG LOADED');

fs.readdir(process.env.REACC_PATH, (err, files) => {
  if (err) {
    return systools.saveLogs("REACC_LOAD", err.toString());
  } 
  files.forEach((file) => {
    reacc.push(file);
  });
}); console.log('REACC LOADED');

client.once('ready', () => {
  console.log("====gortbot ready====");
});
client.once('reconnecting', () => {
  console.log('....reconnecting....');
});
client.once('disconnect', () => {
  console.log('////disconnecting////');
});

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;


  //Music commands
  if (message.content.startsWith(`${prefix}play`)) {
    music.playSong(message);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)){
    music.stopSong(message);
  } else if (message.content.startsWith(`${prefix}q`)){
    music.queueSong(message);
  } else if (message.content.startsWith(`${prefix}skip`)){
    music.skipSong(message);
  } else if (message.content.startsWith(`${prefix}recc`)){ 
    music.getNextVideoOnURL(message);
  } else if (message.content.startsWith(`${prefix}search`)){
    music.searchYt(message); 
  } else if (message.content.startsWith(`${prefix}pause`)){
    music.pause(message);
  } else if (message.content.startsWith(`${prefix}resume`)){
    music.resume(message);
  } else if (message.content.startsWith(`${prefix}next`)){
    music.upNext(message);
  } else if (message.content.startsWith(`${prefix}current`)){
    music.nowPlaying(message);
  }

  //gortflix commands
  else if (message.content.startsWith(`${prefix}addme`)) {
    gortflix.requestAddAccount(message);
  } else if (message.content.startsWith(`${prefix}test`)) {
    gortflix.test(message);
  }

  
  //Reaction commands
  else if (message.content.startsWith(`${prefix}smug`)){
    message.channel.send({files: [`${process.env.SMUG_PATH}/${smug[Math.floor(Math.random()*smug.length)+1]}`]})
  } else if (message.content.startsWith(`${prefix}reacc`)){
    message.channel.send({files: [`${process.env.REACC_PATH}/${reacc[Math.floor(Math.random()*reacc.length)+1]}`]})
  } else if (message.content.startsWith(`${prefix}society`)){
    message.channel.send('https://cdn.discordapp.com/attachments/648336970048602119/772965800784691251/UKRrxHDk-Vs0_61C.mp4')
  } else if (message.content.startsWith(`${prefix}smiling`)){
    message.channel.send('https://cdn.discordapp.com/attachments/648336970048602119/772967994769801236/cloutgang.mp4');
  }
  
  
  //Movie commands
  else if (message.content.startsWith(`${prefix}reqmovie`)){
    //movie.requestMovie(message);
    message.channel.send("Movie requests is broken as shit rn");
  } else if (message.content.startsWith(`${prefix}showreqs`)){
message.channel.send("Movie requests is broken as shit rn");
  } else if (message.content.startsWith(`${prefix}random`)) { 
  	movie.r(message);
  } else if (message.content.startsWith(`${prefix}flip`)){
	movie.coinFlip(message);
  //Help
  } else if (message.content.startsWith(`${prefix}help`)){
    message.channel.send(
      "```gortbot commands:\n"+
      "g!play [youtube url]\n"+
      "   Starts playing audio in the voice channel. Use g!q after starting playback.\n"+
      "g!pause\n"+
      "   Pauses playback.\n"+
      "g!resume\n"+
      "   Resumes playback.\n"+
      "g!q [youtube url]\n"+
      "   Adds a video to the queue.\n"+
      "g!skip\n"+
      "   Skips the current song in the queue. Ends playback if the queue is empty.\n"+
      "g!next\n"+
      "   Shows the next three songs in the queue.\n"+
      "g!current\n"+
      "   Shows the currently playing song.\n"+
      "g!recc\n"+
      "   Queues a random recommended song (based off the current song) to the queue.\n"+
      "g!search [search query]]\n"+
      "   Adds a song to the queue based off a search query.\n"+
      "g!reqmovie 'title' 'desc' (single quotes required)\n"+
      "   Requests a movie\n"+
      "g!showreqs\n"+
      "Shows a list of movies requests and will spam the fuck outta chat\n"+
      "g!smug\n"+
      "   Posts a smug reaction image.\n"+
      "g!reacc\n"+
      "   Posts an anime reaction image.\n"+
      "g!society\n"+
      "g!random [min] [max]\n"+
      "   Shows a random number from a range.\n"+
      "g!flip\n"+
      "   Coinflips. Algorithm generates a number from 0 to 1000 and mods it by 2 to get either 1 or 0."+
      "g!smiling\n```"
    )
  } else {
    message.channel.send("g!help to view commands.");
  }
  
});

client.login(process.env.DISCORD_TOKEN);
