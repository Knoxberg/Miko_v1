const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {
    name: "hai",
    description: "Membalas pesan hai dengan halo!",

    execute(client, message, args, cmd, Discord) {
        message.channel.send("Haloo!");
    }
}