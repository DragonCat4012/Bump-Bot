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
const Bottoken = ""

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

client.on("ready", async() => {
    console.log(" >  Logged in as: " + client.user.tag);
    client.user.setPresence({ activity: { name: "Bump your server", type: 'PLAYING' }, status: 'idle' });
});

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