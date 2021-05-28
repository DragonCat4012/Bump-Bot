const { Message, Guild } = require('discord.js');
const ms = require('parse-ms');
const { rawEmb } = require('../index')

module.exports = {
    name: 'bump',
    syntax: 'bump',
    args: false,
    description: 'Bumps your Server',
    commands: ['bump'],

    /**
     *@document
     * @this
     * @param {Message} msg 
     * @param {String[]} args 
     */
    async execute(msg, args) {
        const { colors, emotes } = msg.client;

        let emb = rawEmb()
        var guild = await msg.client.database.server_cache.getGuild(msg.guild.id)

        if (guild.description == 0) {
            emb.setDescription("This Server has no description! please set one qwq")
            return msg.channel.send(emb.setColor(colors.error))
        }

        let bumped_time = guild.time
        let now = Date.now();
        if (bumped_time == 0) bumped_time = now - 8.64e+7
        let cooldown = 7.2e+6;
        let time = ms(cooldown - (now - bumped_time))

        if (guild.channel == 0) {
            guild.channel = msg.channel.id
            await guild.save()
        } else {
            let F = msg.client.channels.resolve(guild.channel)
            if (!F) {
                guild.channel = msg.channel.id
                await guild.save()
            }
        }

        let invite;
        try {
            invite = await msg.channel.createInvite({
                maxAge: 86400
            }, `Bump Invite`)
        } catch { return msg.channel.send(emb.setDescription("**Can´t create my invite link qwq**").setColor(colors.error)) }

        let segments = []
        if (time.hours > 0) segments.push(time.hours + ' Hour' + ((time.hours == 1) ? '' : 's'));
        if (time.minutes > 0) segments.push(time.minutes + ' Minute' + ((time.minutes == 1) ? '' : 's'));

        const timeString = segments.join('\n');

        if (cooldown - (now - bumped_time) > 0) {
            emb.setColor(colors.error)
                .setDescription(`**${timeString}**`)
                .setTitle("You have to wait ;-;")
            return msg.channel.send(emb)
        } else {
            guild.time = now;
            await guild.save()
            emb.setDescription(`**Bumped succesfully**`)
                .setColor(colors.success)
            msg.channel.send(emb)
            bump(msg.guild.id, msg.guild.name, msg, msg.author.username, msg.client.emotes, msg.client.colors)
            console.log(msg.guild.name + "   >>>  bumped!")
        }
    }
};

async function bump(id, title, msg, user, emotes, colors) {
    var G = await msg.client.database.server_cache.getGuild(id)
    let invite = await msg.channel.createInvite({})
    let emb = rawEmb()

    emb.setTitle(title)
        .setDescription(` \n **Description:**\n ${G.description} 
        \n **Invite: [klick](${"https://discord.gg/" + invite.code})** 
        \n :globe_with_meridians: ${msg.guild.region}
        \n ${emotes.user} ${msg.guild.memberCount}
        `)
        .setColor(G.color != 0 ? G.color : colors.info)
        .setAuthor(user + " bumped: ", msg.guild.iconURL ? msg.guild.iconURL : user.avatarURL)
        .setTimestamp()

    let ch = 0;
    let channels = await msg.client.database.server_cache.getChannel()

    for (c of channels) {
        if (c == 0) return
        ch = await msg.client.channels.resolve(c)
        if (!c) return
        ch.send(emb).catch(() => { })
    }
}