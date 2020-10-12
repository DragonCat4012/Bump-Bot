const { Message } = require('discord.js');

module.exports = {
    name: 'preview',
    syntax: 'preview',
    args: false,
    description: 'Shows your server bump embed',
    commands: ['preview'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        const { colors, rawEmb, emotes } = msg.client;
        let guild = await msg.client.database.server_cache.getGuild(msg.guild.id)
        let badges = ""

        if (guild.ban) badges += ":no_entry:  Banned! :no_entry:"
        if (guild.partner) { badges += emotes.partner } else { badges += emotes.inactivpartner }
        if (msg.guild.id == 553942677117337600) { badges += emotes.staff } else { badges += emotes.inactivstaff }
        let des = guild.description != 0 ? guild.description : "None"

        let emb = rawEmb(msg)
            .setTitle(` Preview [${msg.guild.name}]`)
            .setColor(guild.color != 0 ? guild.color : colors.info)


        .setDescription(`${badges} \n **Description:**\n ${guild.description} 
    \n **Invite: [klick]** 
    \n${emotes.owner} ${msg.guild.owner.user.tag} 
    \n :globe_with_meridians: ${msg.guild.region}
    \n ${emotes.user} ${msg.guild.memberCount}
    \n ${emotes.bot} ${msg.guild.members.cache.filter(member => member.user.bot).size}
    `)
        return msg.channel.send(emb)
    }
};