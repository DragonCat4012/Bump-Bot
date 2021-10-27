const { Message } = require('discord.js');
const { rawEmb } = require('../index')

module.exports = {
    name: 'status',
    syntax: 'status',
    args: true,
    description: 'Change the bots status',
    perm: 'ADMINISTRATOR',
    commands: ['status'],

    /**
     *@document
     * @this
     * @param {Message} msg 
     * @param {String[]} args 
     */
    async execute(msg, args) {
        const { colors, emotes } = msg.client;
        let emb = rawEmb(msg)
        if (msg.author.id !== msg.client.ownerID) return msg.channel.send(emb.setDescription("You are not authorised to use this command").setColor(colors.error))


        msg.client.user.setActivity(args.join(' '), { type: 'PLAYING' })

        return msg.channel.send(emb.setDescription("**Changed astatus to:** \n " + args.join('')).setColor(colors.success))
    }
};