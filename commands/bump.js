const { Message } = require('discord.js');
const ms = require('parse-ms');

module.exports = {
    name: 'bump',
    syntax: 'bump',
    args: false,
    description: 'Bumps your Server on our list',
    commands: ['bump'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        const { colors, rawEmb, emotes } = msg.client;

        let emb = rawEmb(msg)
        var guild = await msg.client.database.server_cache.getGuild(msg.guild.id)

        if (guild.ban) {
            emb.setDescription("This Server is banned, You can´t bump him")
            return msg.channel.send(emb.setColor(colors.error))
        }
        if (guild.description == 0) {
            emb.setDescription("This Server has no description! please set one qwq")
            return msg.channel.send(emb.setColor(colors.error))
        }

        let bumped_time = guild.time
        let now = Date.now();
        let cooldown = 7.2e+6;
        let time = ms(cooldown - (now - bumped_time))

        if (bumped_time == 0) {
            guild.time = now;
            await guild.save()
            return msg.channel.send(emb.setDescription("**Please try again, I have missed smt**"))
        }

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
            bump(msg.guild.id, msg.guild.name, msg, msg.author.username)
            console.log(msg.guild.name + "   >>>  bumped!")
        }
    }
};

async function bump(id, title, msg, user) {
    var G = await msg.client.database.server_cache.getGuild(id)
    let emb = rawEmb()
    badges = "";
    if (G.partner) { badges += emotes.partner } else { badges += emotes.inactivpartner }
    if (id == 553942677117337600) { badges += emotes.staff } else { badges += emotes.inactivstaff }

    emb.setTitle(title)
        .setDescription(`${badges} \n **Description:**\n ${G.description} 
        \n **Invite: [klick](${"https://discord.gg/" + invite.code})** 
        \n${emotes.owner} ${msg.guild.owner.user.tag} 
        \n :globe_with_meridians: ${msg.guild.region}
        \n ${emotes.user} ${msg.guild.memberCount}
        \n ${emotes.bot} ${msg.guild.members.cache.filter(member => member.user.bot).size}
        `)
        .setColor(G.color != 0 ? G.color : colors.info)
        .setAuthor(user + " bumped: ", msg.guild.iconURL ? msg.guild.iconURL : user.avatarURL)
        .setFooter(`Bumped at ${(new Date()).toUTCString().substr(0, 16)}`)

    let ch = 0;
    let channels = await msg.client.database.server_cache.getChannel()

    for (c of channels) {
        if (c == 0) return
        ch = msg.client.channels.resolve(c)
        if (!c) return
        ch.send(emb).catch()
    }
}