const Discord = require("discord.js");
const client = new Discord.Client();
require('dotenv').config();

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

//Deklarasi nama file handlernya. JANGAN ASAL GANTI
['command_handler', 'event_handler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, Discord);
})

//Kalau sudah berhasil login bakal print nama sama tag bot di terminal
client.on("ready", () => {
  console.log(`Login sebagai ${client.user.tag}`)
});

// Login bot discordnya (Token disimpan secara aman di file .env)
client.login(process.env.TOKEN_LOGIN_BOT);