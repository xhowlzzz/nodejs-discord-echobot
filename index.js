const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!'; // Prefix for bot commands
const keep_alive = require('./keep_alive.js')

client.on('message', async message => {
    // Check if the message starts with the specified prefix and is from a user
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Command to trigger the Pacific message
    if (command === 'pacific') {
        // Delete the user's message
        message.delete().catch(console.error);

        // Send the Pacific message
        const pacificMessage = await message.channel.send('@everyone react pentru pacific');
        pacificMessage.react('✅');

        // Define a reaction collector
        const collector = pacificMessage.createReactionCollector({
            max: 20, // Limit of 20 reactions (excluding bot's reaction)
            dispose: true // Emits when a reaction is removed
        });

        // Listen for reactions
        collector.on('collect', (reaction, user) => {
            // Check if the reaction is from the bot
            if (user.bot) return;

            // Check if the total reactions exceed the limit
            if (reaction.count > 20) {
                // Remove the user's reaction
                reaction.users.remove(user).catch(console.error);
            }
        });
    }

    // Command to choose two people from the reacts
    if (command === 'choose') {
        // Fetch the last message from the channel
        const fetchedMessages = await message.channel.messages.fetch({ limit: 1 });
        const lastMessage = fetchedMessages.first();

        // Fetch the reactions from the last message
        const reactions = lastMessage.reactions.cache.get('✅');

        // Fetch users who reacted
        const reactionUsers = await reactions.users.fetch();

        // Convert the reactionUsers collection to an array
        const usersArray = reactionUsers.array();

        // Choose two random users
        const chosenUsers = [];
        for (let i = 0; i < 2; i++) {
            const randomIndex = Math.floor(Math.random() * usersArray.length);
            chosenUsers.push(usersArray[randomIndex]);
            usersArray.splice(randomIndex, 1); // Remove the chosen user from the array
        }

        // Send a message with the chosen users
        message.channel.send(`Chosen users: ${chosenUsers.map(user => user.username).join(', ')}`);
    }
});

// Log in to Discord with your app's token
client.login('token');
