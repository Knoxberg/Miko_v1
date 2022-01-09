const Discord = require("discord.js");
const client = new Discord.Client();

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const ffmpeg = require('ffmpeg-static');

module.exports = {
    name : 'play-exp',
    description : 'Untuk play audio dari YT',

    async execute(client, message, args, Discord) {
        const voiceChannel = message.member.voice.channel;
        
        //Kalau orang yang ngetik perintah gak ada di voice channel bakal keluarin pesan error.
        if(!voiceChannel) return message.channel.send("`Ohh tidak:` Kamu harus bergabung ke `\ Voice Channel \` dahulu.");

        //Untuk cek izin di server
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("`Ohh tidak:` Kamu harus memiliki izin untuk `\CONNECT\` kedalam voice channel.");
        if(!permissions.has('SPEAK')) return message.channel.send("`Ohh tidak:` Kamu harus memiliki izin untuk `\SPEAK\` kedalam voice channel.");

        //Kalau tidak ada keyword yang dikasih bakal keluarin pesan bantuan.
        const playHelp = new Discord.MessageEmbed()
        .setColor('#FFC0CB')
	    .setTitle('Waah... Miko bantu kamu yah!')
	    .setDescription('`?play <judul lagu>` = Miko putar hasil pencarian teratas di Youtube. \n `?play <link Youtube>` = Miko putar link itu buat kamu! \n-----------------------------------------------------------------\n Pastikan kamu sudah ada didalam `Voice Channel` juga ya! :wink:')
        if(!args.length) return message.channel.send(playHelp)

        
    }
}