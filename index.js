const fs = require("fs");
const Discord = require("discord.js");
const { Message, Collection, Client, MessageEmbed } = require("discord.js");

const client = new Client();
const colors = {
    error: 0xF91A3C,
    info: 0x303136,
    success: 0x13EF8D
}
const emotes = {
    false: "❌",
    true: "✔️",
    owner: "👑",
    bot: '🤖',
    user: '👤'
}
const rawEmb = () => {
    return new MessageEmbed()
        .setColor(colors.info);
}
module.exports = { rawEmb }
client.colors = colors
client.emotes = emotes
const Bottoken = ''
const supportGuildId = ''
const supportGuildLog= ''

if(!Bottoken) throw new Error('Please enter a Bot Token!')
//==================================================================================================================================================
//Loading Things
//==================================================================================================================================================
const { Server, syncDatabase } = require('./database/dbInit');
var server_cache = new Collection();

Reflect.defineProperty(server_cache, "getGuild", {
    /**
     * @param {number} id Guild ID
     * @returns {Model} new User
     */
    value: async function(id) {
        var guild = server_cache.get(id);
        if (!guild) guild = await Server.findOne({ where: { key: id } });
        if (!guild) {
            guild = await Server.create({ key: id });
            server_cache.set(id, guild);
        }
        return guild;
    }
});

Reflect.defineProperty(server_cache, "getChannel", {
    /**
     *  @param {number} id Channel ID
     * @returns {Model} new User
     */
    value: async function() {
        let arr = []
        var channels = await Server.findAll();
        channels.forEach(entry => arr.push(entry.channel))
        return arr;
    }
});

//Sync
const initDatabase = async() => {
    await syncDatabase();

    try {
        for (let entr of(await Server.findAll())) {
            server_cache.set(entr.user_id, entr);
        }

        console.log(" > 🗸 Cached Database Entries");
    } catch (e) {
        console.log(" > ❌ Error While Caching Database")
        console.log(e);
        //process.exit(1);
    }
}
client.database = { server_cache };
//==================================================================================================================================================
//Initialize the Commands
//==================================================================================================================================================
client.commands = new Discord.Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
//==================================================================================================================================================
//Starting the Bot
//==================================================================================================================================================
const start = async() => {
    try {
        console.log("Logging in...");
        await client.login(Bottoken).catch(e => {
            switch (e.code) {
                case 500:
                    console.log(" > ❌ Fetch Error");
                    break;
                default:
                    console.log(" > ❌ Unknown Error");
                    break;
            }
            setTimeout(() => { throw e }, 5000);
        });
        await initDatabase();
    } catch (e) {
        console.log(e);
    }
}
start();

client.on("ready", () => {
    if(!supportGuildId)  throw new Error('Please enter your Support-Guild-ID')
    if(!supportGuildLog) throw new Error('Please enter your Support-Guild-Log-Channel-ID')
    console.log(" >  Logged in as: " + client.user.tag);
    client.user.setPresence({ activity: { name: "Bump your server", type: 'PLAYING' }, status: 'idle' });
});

client.on('guildMemberAdd', async member =>{
let{guild} = member
let settings = await client.database.server_cache.getGuild(guild.id)
if(!settings.wlc) return
let ch = await guild.channels.resolve(settings.wlc)
if(!ch) {
    settings.wlc = undefined
    return settings.save()
}
let emb = rawEmb().setTitle('Member Joined').setDescription(`${member} joined **${guild.name}**! Welcome you'r member No. **${guild.memberCount}**`)
ch.send(emb).catch()
})

client.on('guildCreate', async guild =>{
let supGuild = await client.guilds.resolve(supportGuildId)
let channel = await supGuild.channels.resolve(supportGuildLog)
let emb = rawEmb().setTitle('Server joined').setColor(colors.success)
channel.send(emb).catch()
})

client.on('guildMemberRemove', async member =>{
    let{guild} = member
    let settings = await client.database.server_cache.getGuild(guild.id)
    if(!settings.gb) return
    let ch = await guild.channels.resolve(settings.gb)
if(!ch) {
    settings.gb = undefined
    return settings.save()
}
let emb = rawEmb().setTitle('Member Leaved').setDescription(`${member} leaved from **${guild.name}** Bye Bye`)
ch.send(emb).catch()
})

client.on("message", async message => {
    if (message.author.bot) return;
    let settings = await client.database.server_cache.getGuild(message.guild.id)
    let prefix = settings.prefix;

    if (message.mentions.users.first()) {
        if (message.mentions.users.first().id == client.user.id) message.channel.send('My prefix is ' + settings.prefix)
    }
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);

    const commandName = args.shift().toLowerCase();
    const command = client.commands.find(cmd =>
        cmd.commands.includes(commandName)
    );

    if (command.perm) {
        if (!(message.member.hasPermission(command.perm))) {
            emb.setDescription("**You are missing following permission:** `" + command.perm + "`")
            return message.channel.send(emb.setColor(colors.error));
        }
    }
    try {
        command.execute(message, args);
    } catch (error) { console.log(error) }
});