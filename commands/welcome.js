const { Message } = require('discord.js');
const { rawEmb } = require('../index')

module.exports = {
    name: 'welcome',
    syntax: 'welcome <#channel>',
    args: true,
    description: 'Change your server welcome channel',
    perm: 'ADMINISTRATOR',
    commands: ['welcome', 'setwelcome'],

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
        guild.wlc = channel.id;
        await guild.save()

        return msg.channel.send(emb.setDescription("**Changed welcome Channel succesfully to:** \n <#" + channel + ">").setColor(colors.success))
    }
};