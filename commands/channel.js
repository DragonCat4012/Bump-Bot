const { Message } = require('discord.js');
const { rawEmb } = require('../index')

module.exports = {
    name: 'channel',
    syntax: 'channel <#channel>',
    args: true,
    description: 'Change your server advertisment channel',
    perm: 'ADMINISTRATOR',
    commands: ['channel', 'setchannel'],

    /**
     *@document
     * @this
     * @param {Message} msg 
     * @param {String[]} args 
     */
    async execute(msg, args) {
        const { colors, emotes } = msg.client;
        let emb = rawEmb(msg)
        let channel = msg.mentions.channels.first()

        if (!channel) {
            emb.setDescription("**You have to mention a channel**")
            return msg.channel.send(emb.setColor(colors.error))
        }

        let guild = await msg.client.database.server_cache.getGuild(msg.guild.id)
        guild.channel = channel.id;
        await guild.save()

        return msg.channel.send(emb.setDescription("**Changed add Channel succesfully to:** \n <#" + channel + ">").setColor(colors.success))
    }
};