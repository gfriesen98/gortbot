# gortbot

A music playing bot for discord.

## Features

* `g!play [url]` start playback from a youtube url
* `g!pause` pause playback
* `g!resume` resume playback
* `g!q [url]` queue a video from a youtube url
* `g!skip` skips the current song. ends playback if at the end of the queue
* `g!recc` queues a video based off of the currently playing one
* `g!search [query]` searches youtube and adds that video to the queue
* `g!pause/resume`  pauses/resumes playback
* `g!next`  shows the next 3 songs in the queue
* `g!current`   shows the current song
* `g!smug`  shows a smug image
* `g!reacc`   shows an anime reaction image
* `g!society` YOU BROOOKE MEEEEEE
* `g!smiling` *you like girls? smash that mf like button 😥*

## Setup
1. Clone this repository
2. Get a Discord Developer account and create an app. [Read this article for more information](https://discord.com/developers/docs/intro)
3. Get a YouTube Data v3 api key. [Read this article for more information](https://developers.google.com/youtube/v3/getting-started)
4. Edit `config_example.json` and fill out the fields for `discord_token` and `google_key`
5. Rename to just `config.json`
6. Start with `node gortbot.js`