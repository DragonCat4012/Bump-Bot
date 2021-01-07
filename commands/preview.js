const { Message } = require('discord.js');
const { rawEmb } = require('../index')

module.exports = {
    name: 'preview',
    syntax: 'preview',
    args: false,
    description: 'Shows your server bump embed',
    commands: ['preview'],

    /**
     *@document
     * @this
     * @param {Message} msg 
     * @param {String[]} args 
     */
    async execute(msg, args) {
        const { colors, emotes } = msg.client;
        let guildData = await msg.client.database.server_cache.getGuild(msg.guild.id)
        let des = guildData.description != 0 ? guildData.description : "None"

        let emb = rawEmb(msg)
            .setTitle(` Preview [${msg.guild.name}]`)
            .setColor(guildData.color != 0 ? guildData.color : colors.info)

        .setDescription(`\n **Description:**\n ${des} 
    \n **Invite: [klick]** 
    \n :globe_with_meridians: ${msg.guild.region}
    \n ${emotes.user} ${msg.guild.memberCount}
    `)
        return msg.channel.send(emb)
    }
};