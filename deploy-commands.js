const {SlashCommandBuilder, Routes} = require('discord.js');
const {REST} = require('@discordjs/rest');
const {clientId, guildId, token} = require('./config.json');

function syncCommands(){
    const commands = [
        new SlashCommandBuilder().setName('bump').setDescription('Bumps your Server'),
        new SlashCommandBuilder().setName('channel').setDescription('Change your server advertisment channel'),
        new SlashCommandBuilder().setName('color').setDescription('Change your bump embed color'),
        new SlashCommandBuilder().setName('description').setDescription('Change your server description'),
        new SlashCommandBuilder().setName('goodbye').setDescription('Change your server goodbye channel'),
        new SlashCommandBuilder().setName('help').setDescription('Shows you all my Commands'),
        new SlashCommandBuilder().setName('invite').setDescription('Get my Invite link'),
        new SlashCommandBuilder().setName('prefix').setDescription('Change your server prefix'),
        new SlashCommandBuilder().setName('preview').setDescription('Shows your server bump embed'),
        new SlashCommandBuilder().setName('welcome').setDescription('Change your server welcome channel'),
        new SlashCommandBuilder().setName('status').setDescription('Change the bots status'),
    ]
    .map(command => command.toJSON());

const rest = new REST({
    version: '10'
}).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands
    })
    .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
    .catch(console.error);
}

module.exports = {syncCommands}