# Slarries Discord Bot

This bot is designed for the Slarries Discord server, providing a range of features from moderation and administrative tools to fun commands, music playback, and Minecraft-related utilities. It leverages slash commands for a more intuitive user experience and incorporates a robust database for persistent storage of settings and data.

## Features

### Administration

* **`/announce`**: Broadcast announcements to a designated channel with an @everyone ping. (Owner only)
* **`/bot-command-channels`**: Manage channels where bot commands can be used.
* **`/command`**: Enable or disable slash commands, and list disabled commands.
* **`/direct-message`**: Send a direct message to a specified user.
* **`/dm-role`**: Send a direct message to all users with a certain role.
* **`/nuke`**: Clone a text channel, effectively deleting all messages.
* **`/rr-menu`**: Manage reaction role menus, allowing users to self-assign roles. (Owner only)
* **`/save-channel`**: Save a channel's chat history as an HTML file.
* **`/send-embed`**: Create and send custom embedded messages.
* **`/send-message`**: Send a message to a specified channel.
* **`/send-preset-embed`**: Send pre-configured embedded messages for specific purposes like rules, verification, and slayer prices. (Owner only)
* **`/suggest-setup`**: Configure the suggestion system, including the target channel and suggestion manager roles.
* **`/suggestion`**: Manage suggestions by accepting, declining, or deleting them.
* **`/ticket-panel`**: Send a ticket panel with buttons to open different types of tickets. (Owner only)
* **`/to-do-list-setup`**: Configure the to-do list system, including the category for to-do channels.

### Development

* **`/activity`**: Set or remove the bot's activity status. (Bot owner only)
* **`/emitt`**: Emit specific events for testing purposes. (Bot owner only)
* **`/eval`**: Evaluate JavaScript code. (Bot owner only)
* **`/leave`**: Make the bot leave a specified guild. (Bot owner only)
* **`/maintenance`**: Toggle maintenance mode, disabling most commands for regular users. (Bot owner only)
* **`/restart`**: Restart the bot. (Bot owner only)
* **`/status`**: Display bot status, database connection status, and resource usage. (Bot owner only)

### Fun

* **`/8ball`**: Ask a question and receive a random answer.
* **`/coin-flip`**: Flip a coin and guess the outcome.
* **`/discord-together`**: Start Discord Together activities like YouTube Together or games in a voice channel.
* **`/discord-user-card`**: Generate a user profile card.
* **`/meme`**: Fetch a random meme from Reddit's r/memes.
* **`/reddit`**: Fetch a post from a specified subreddit.
* **`/yo-mamma`**: Send a random "Yo Mamma" joke.
* **`/zoo`**: Get a random animal image and fact.

### Minecraft

* **`/denick`**:  Find the real Minecraft IGN of a player using a known nickname.
* **`/hypixel`**: Retrieve Hypixel player statistics, link/unlink Discord accounts, and view detailed Bedwars and Duels statistics.

### Moderation

* **`/ban`**: Ban a user from the server.
* **`/clear`**: Delete a specified number of messages in a channel.
* **`/kick`**: Kick a user from the server.
* **`/lock`**: Lock a channel, preventing users from sending messages.
* **`/role`**: Add or remove a role from a user.
* **`/slowmode`**: Set a slowmode for a channel, limiting message frequency.
* **`/ticket`**:  Manage tickets by adding or removing users.
* **`/unban`**: Unban a user from the server.
* **`/unlock`**: Unlock a previously locked channel.

### Systems

* **`/afk`**: Set an AFK status and notify users who mention you.
* **`/chatFilter`**: (Manage Messages Permission and Owner only) Configure a chat filter, add or remove blacklisted words, and set the logging channel.
* **`/giveaway`**: Manage giveaways, including starting, ending, pausing, and rerolling.
* **`/music`**: A comprehensive music system with features like play, pause, skip, volume control, filters, queue management, and repeat/shuffle options. Requires the user to be in a voice channel.
* **`/poll`**: Create polls with different types of options.
* **`/suggest`**: Submit a suggestion.
* **`/to-do-list`**: Manage personal to-do lists, including adding, removing, ticking off items, clearing the list, and managing privacy settings. 

### Utilities

* **`/help`**: Display the help menu, listing all commands and their usage.
* **`/ping`**: Check the bot's latency and API latency.
* **`/serverinfo`**: Display server information, including member count, channel count, boost level, and creation date.
* **`/userinfo`**: Display user information, including roles, join date, and account creation date. (Context menu command)

## Setup Instructions

1. **Clone the repository:** `git clone https://github.com/MahdiRazzaque/slarries-discord-bot.git`
2. **Install dependencies:** `npm install`
3. **Configure environment variables:**
    * Create a `.env` file in the root directory.
    * Add the following variables, replacing the placeholders with your actual values:
        ```
        TOKEN=<your_bot_token>
        Database=<your_mongodb_connection_string>
		apikey=<your_hypixel_api_key>
        ```
4. **Run the bot:** `npm start` or `node .`

## Usage Examples

* **Start a giveaway:** `/giveaway start duration:1h winners:1 prize:"Nitro Classic" channel:#giveaways`
* **Ban a user:** `/ban target:@user reason:"Spamming"`
* **Play a song:** `/music play query:never gonna give you up`
* **Get Hypixel Bedwars stats:** `/hypixel bedwars player:MaddoxHD`
* **Create a to-do list channel:** `/to-do-list create-channel`

## Notes

* This bot requires Node.js v16 or higher.
* Some commands are restricted to server owners or bot owners.
* The bot utilises a MongoDB database for storing configuration and data. Make sure you have a MongoDB instance running and update the `.env` file with your connection string.
* Erela.js is used for music playback, along with plugins for Spotify, Apple Music, and Deezer integration. Ensure you have the necessary API keys and credentials for these services if you want to use their features.
* This bot hasn't been updated for a while, so some features may not be fully functional.