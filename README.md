# gortbot

A music playing bot for discord.

## Features

* `g!play [url]` start playback from a youtube url
* `g!pause` pause playback
* `g!resume` resume playback
* `g!q [url]` queue a video from a youtube url
* `g!skip` skips the current song. ends playback if at the end of the queue
* `g!recc` queues a video based off of the currently playing one
* `g!search [query]` searches youtube based off a query. default max result is 5
  * optionally append `-n [1-20]` after the query to control the amount of results

## Setup
1. Clone this repository
2. Get a Discord Developer account and create an app
3. Get a YouTube Data v3 api key
4. Create a file in the cloned repository called `config.json`
5. Make it look like this

```json
{
  "discord_token": "your_token_here",
  "google_key": "your_google_key_here",
  "smug_path":  "./images/smug",
  "reacc_path": "./images/anime"
}
```
6. Start with `node gortbot.js`