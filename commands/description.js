const { Message } = require('discord.js');
const { rawEmb } = require('../index')

module.exports = {
    name: 'description',
    syntax: 'description <text>',
    args: true,
    description: 'Change your server description',
    perm: 'ADMINISTRATOR',
    commands: ['description', 'setdescription'],

    /**
     *@document
     * @this
     * @param {Message} msg 
     * @param {String[]} args 
     */
    async execute(msg, args) {
        const { colors, emotes } = msg.client;
        let emb = rawEmb(msg)
        let text = args.join(" ")

        if (text.length > 1000) {
            emb.setDescription("**Sorry, but you can only use 1000 Characters for ur description qwq**")
            return msg.channel.send(emb.setColor(colors.error))
        }

        let guild = await msg.client.database.server_cache.getGuild(msg.guild.id)
        guild.description = text;
        await guild.save()

        emb.setFooter("Use #preview to see your text")

        return msg.channel.send(emb.setDescription("**Changed description succesfully to:** \n" + text).setColor(colors.success))
    }
};