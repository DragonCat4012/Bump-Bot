const { Message } = require('discord.js');
const { rawEmb } = require('../index')

module.exports = {
    name: 'help',
    syntax: 'help',
    args: false,
    description: 'Shows you all my Commands',
    commands: ['help'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        const { colors, emotes } = msg.client;
        let emb = rawEmb(msg)

        if (args[0]) {
            var command = msg.client.commands.find(cmd => cmd.commands.includes(args[0].toLowerCase()));
            if (!command) {
                emb.setTitle("Command not found qwq")
                return msg.channel.send(emb);
            }
            emb.setTitle(command.name)
                .addField("**Syntax:**", command.syntax)
                .addField("**Description:**", command.beschreibung ? command.beschreibung : command.description)
                .setFooter("Trigger: " + command.commands.join(', '))

            msg.channel.send(emb);
        } else {
            let A = []
            for (cmd of msg.client.commands) {
                let command = cmd[1]
                A.push(`**${command.name}**\n \`#${command.syntax}\`\n\n`)
            }
            emb.setDescription(A.join(" "))
            msg.channel.send(emb.setFooter(`Type .help <command> for more || ${A.length} Commands`));
        }
    }
};