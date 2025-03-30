const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// check config file
if (!fs.existsSync('config.json')) {
    console.error('Cannot find config file. Creating...');
    fs.writeFileSync('config.json', JSON.stringify({DISCORD_TOKEN: 'your_token_here'}, null, 2));
    process.exit(1);
}

// check token
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const token = config.DISCORD_TOKEN;
if (token == null || token === 'your_token_here') {
    console.error('Missing Token.');
    process.exit(1);
}

// bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// list commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// list events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// login
client.login(token);