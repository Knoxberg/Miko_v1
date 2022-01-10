const Discord = require("discord.js");
const client = new Discord.Client();
require('dotenv').config();

module.exports = (Discord, client, message) => {
    //Prefix buat perintah bot. (Disimpan secara aman di file .env)
    const prefix = process.env.PREFIX;

    //Kalau pesan tidak diawali dengan prefiks / pesan dikirim sama bot sendiri bakal di cuekin
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    
    //Pisahin mana yang prefiks, mana yang perintahnya. terus di rubah ke lowercase
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(alias => alias.aliases && alias.aliases.includes(cmd));

    //jalanin perintahnya
    //if(command)command.execute(client, message, args, Discord);
    try {
        command.execute(client, message, args, cmd, Discord);
    } catch(error) {
        message.reply(":mega: Terjadi error nih >~< \n Apa perintah sudah benar?");
    }
}