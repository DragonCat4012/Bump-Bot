const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, SlashCommandBuilder, Collection } = require('discord.js');
const {clientId, guildId, token} = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    client.commands.set(command.data.name, command);
}

const colors = {
    error: 0xF91A3C,
    info: 0x303136,
    success: 0x13EF8D
}
const emotes = {
    false: "❌",
    true: "✔️",
    owner: "👑",
    bot: '🤖',
    user: '👤'
}



const {syncCommands} = require("./deploy-commands")
client.once('ready', () => {
	console.log('Ready!');
   syncCommands()
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(token);
//.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers);