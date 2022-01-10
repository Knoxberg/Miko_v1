const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {
    name: 'help',
    aliases: ['bantuan'],
    description: 'Test menu help baru pakai fitur embed.',

    execute(client, message, args, cmd, Discord) {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#FFC0CB')
        .setTitle('Butuh Bantuan?  >w< ')
        .setDescription('Apa ada yang bisa Miko bantu?.  Miko pikir ini bisa bantu kamu!')
        .addFields(
            { name: "Perintah Umum :fox:", value : "`?help` = Menampilkan menu bantuan. \n `?tentang` = Menampilkan informasi tentang Miko. \n `?hai` = Haloo!"},
            { name: 'Fitur Lain:', value: '`?image (Keyword)` = Menampilkan foto sesuai dengan keyword kamu!' },
            { name: 'Music Player :notes:', value: '`?play (Keyword / Link YT)` = Memutar lagu pilihanmu dari YouTube! \n `?leave` = Menghentikan lagu yang diputar, dan keluar dari Voice Channel.'}

        )
        message.channel.send(newEmbed);
    }
}