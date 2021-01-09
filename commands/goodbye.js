const { Message } = require('discord.js');
const { rawEmb } = require('../index')

module.exports = {
    name: 'goodbye',
    syntax: 'goodbye <#channel>',
    args: true,
    description: 'Change your server goodbye channel',
    perm: 'ADMINISTRATOR',
    commands: ['goodbye', 'setgoodbye'],

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
        guild.gb = channel.id;
        await guild.save()

        return msg.channel.send(emb.setDescription("**Changed goodbye Channel succesfully to:** \n <#" + channel + ">").setColor(colors.success))
    }
};