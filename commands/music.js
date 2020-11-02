const ytdl = require('ytdl-core');
const youtube = require('youtube-search');
const { MessageEmbed } = require('discord.js');
const { google_key } = require('../config.json');

var queue = [];

var voiceChannel = null;
var connection = null;
var dispatcher = null;


function checkQueueConflicts(title){
  for (let i = 0; i < queue.length; i++){
    if (title === queue[i].title) {
      return i;
    }

    return false;
  }
}

/**
 * Starts music playback. The URL added here is the first in the queue.
 * @param {message} message from sender
 */
async function playSong(message) {
  const args = message.content.split(" ");

  if (!message.member.voice.channel){
    return message.channel.send("You need to be in a voice channel.");
  }

  if (queue.length === 0) {
    const songInfo = await ytdl.getInfo(args[1]);
    console.log(songInfo);
    queue.push(
      {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        id: songInfo.videoDetails.videoId,
        image_url: songInfo.videoDetails.thumbnail.thumbnails[0].url,
        requester: message.member.displayName
      }
    );
    playSong(message);

  } else {

    try{

      voiceChannel = message.member.voice.channel;
      const perms = voiceChannel.permissionsFor(message.client.user);
      if (!perms.has("CONNECT") || !perms.has("SPEAK")) {
        return message.channel.send("I need permissions to speak in the voice channel.");
      }
    
      connection = await voiceChannel.join();

      //start music playback via dispatcher
      dispatcher = connection
        .play(ytdl(queue[0].url))
        .on("finish", () => {
          if(queue.length === 0){
            voiceChannel.leave();
          } else {
            if (!queue[1]){
              stopSong(message);
              return;
            }
            queue.shift();
            playSong(message);
          }
        })
        .on("error", error => console.log(error));
      
      const messageEmbed = new MessageEmbed()
        .setColor('#0dac4e')
        .setTitle(`▶️ Now Playing: ${queue[0].title}`)
        .setDescription(queue[0].url)
        .addField("Requested By: ", queue[0].requester)
        .setImage(queue[0].image_url)
      message.channel.send(messageEmbed);

    } catch (err) {
      console.log(err);
      message.channel.send("🙂 Having some issues playing the current song. Try again 🙂");
    }

  }
}

/**
 * Adds a song to the queue.
 * @param {message} message from sender
 */
async function queueSong(message){
  if (!message.member.voice.channel){
    return message.channel.send("You have to be in a voice channel to perform music commands !!");
  }

  const args = message.content.split(" ");
  try{

    const songInfo = await ytdl.getInfo(args[1]);

    conflict_idx = checkQueueConflicts(songInfo.videoDetails.title);
    if (conflict_idx !== false){
      return message.channel.send(`Song is already in the queue (#${conflict_idx}) !!`);
    }

    queue.push(
      {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        id: songInfo.videoDetails.videoId,
        image_url: songInfo.videoDetails.thumbnail.thumbnails[0].url,
        requester: message.member.displayName
      }
    );
  
    for(let i = 0; i < queue.length; i++){
      console.log(queue[i].title);
    }

    let song_position = 0;

    for (let i = 0; i < queue.length; i++){
      if (queue[i].title === songInfo.videoDetails.title){
        song_position = i;
        break;
      }
      song_position = 0;
    }

    messageEmbed = new MessageEmbed()
      .setColor('#e08a00')
      .setTitle(`🎧 ${songInfo.videoDetails.title} was added to the queue`)
      .setDescription(songInfo.videoDetails.video_url)
      .addField("Position in queue: ", `#${song_position}`, true)
    message.channel.send(messageEmbed);

  } catch (err) {
    console.log(err);
    return message.channel.send("🙂 Had some issues getting video data. Try queueing again 🙂");
  }
}

/**
 * Stops playback and clears the queue.
 * @param {message} message 
 */
function stopSong(message){
  if(!message.member.voice.channel){
    return message.channel.send("You have to be in a voice channel to perform music commands !!");
  }

  console.log("stopping song connection");
  dispatcher.end();

  console.log("clearing queue");
  queue = [];

  console.log("leaving channel");
  voiceChannel.leave();
}

/**
 * Skips the currently playing song and plays the next song in the queue.
 * @param {message} message 
 */
function skipSong(message){
  if (!message.member.voice.channel){
    return message.channel.send("You have to be in a voice channel to perform music commands !!");
  }
  if(!queue){
    return message.channel.send("Got nothin to skip 😔");
  }

  dispatcher.end();
}

/**
 * Gets a set of videos on a search query.
 * @param {message} message from sender
 */
async function searchYt(message) {
  //let the user select the amount of results (max 10)
  let args = message.content.split("-n")[1];
  let query = message.content.split("-n")[0].split(" ");
  query.shift();
  query = query.join(" ");
  console.log(query);

  if (!query) return message.channel.send("`g!search [search query] [optional -n [1-20] ]`");

  console.log(!args ? "no args" : args.trim());
  var opts = {
    maxResults: !args ? 5 : args.trim(),
    key: google_key
  }

  youtube(query, opts, (err, results) => {
    if (err) return console.log(err);
    
    let results_array = results.map(o => {
      o.title = o.title.replace("&amp;", "&");
      return {url: o.link, title: `${o.title}`}
    });

    console.log(results_array);
    let search_string = results_array.map((o) => {
      return `${o.title}\n${o.url}`;
    })
    return message.channel.send(search_string);
  });
}

/**
 * Gets the next video based on the current song playing.
 * Format: g!recc [song] [artist]
 * @param {message} message from sender
 */
async function getNextVideoOnURL(message) {

  console.log(queue[0].title);

  var reccOpts = {
    maxResults: 20,
    key: google_key,
    relatedToVideoId: queue[0].id,
    type: [
      "video"
    ]
  }

  youtube('', reccOpts, (err, results) => {
    if (err) return console.log(err);

    //Select a random index to select
    let idx = Math.floor(Math.random()*20)+1

    conflict_idx = checkQueueConflicts(results[idx].title);
    if (conflict_idx !== false){
      return message.channel.send(`This one already in the queue 😔`);
    }

    queue.push(
      {
        title: results[idx].title,
        url: results[idx].link,
        id: results[idx].id,
        image_url: results[idx].thumbnails.default.url,
        requester: message.member.displayName
      }
    );

    let song_position = 0;

    for (let i = 0; i < queue.length; i++){
      if (queue[i].title === results[idx].title){
        song_position = i;
        break;
      }
      song_position = 0;
    }

    messageEmbed = new MessageEmbed()
      .setColor('#e08a00')
      .setTitle(`🎧 ${results[idx].title} was added to the queue`)
      .setDescription(results[idx].link)
      .addField("Position in queue: ", `#${song_position}`, true)
    message.channel.send(messageEmbed);

  });
}

function pause(message){
  dispatcher.pause();

  messageEmbed = new MessageEmbed()
    .setColor('#0dac4e')
    .setTitle(`⏸️ Paused ${queue[0].title}`)
  
  return message.channel.send(messageEmbed);
}

function resume(message){
  dispatcher.resume();

  messageEmbed = new MessageEmbed()
    .setColor('#0dac4e')
    .setTitle(`▶️ Resumed ${queue[0].title}`)

  return message.channel.send(messageEmbed);
}

module.exports = {
  playSong,
  stopSong,
  queueSong,
  skipSong,
  searchYt,
  getNextVideoOnURL,
  pause,
  resume
};