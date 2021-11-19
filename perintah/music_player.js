const Discord = require("discord.js");
const client = new Discord.Client();

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name : 'play',
    description : 'Untuk play audio dari YT',

    async execute(client, message, args, Discord) {
        const voiceChannel = message.member.voice.channel;

        //Kalau orang yang ngetik perintah gak ada di voice channel bakal keluarin pesan error.
        if(!voiceChannel) return message.channel.send("`Ehh, ups:` Kamu harus bergabung ke `\Voice Channel\` dahulu.");

        //Untuk cek izin di server
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("`Eh, ups:` Kamu harus memiliki izin untuk `\CONNECT\` kedalam voice channel.");
        if(!permissions.has('SPEAK')) return message.channel.send("`Eh, ups:` Kamu harus memiliki izin untuk `\SPEAK\` kedalam voice channel.");
        //Kalau tidak ada keyword yang dikasih bakal keluarin pesan error.
        if(!args.length) return message.channel.send("`Ehh, ups:` Perintah tidak lengkap.")

        //Kalau diberi link, maka kita cek apakah format url valid
        const URL_valid = (str) =>{
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if(!regex.test(str)){
                return false;
            } else {
                return true;
            }
        }
 
        //Kalau url valid bot bakal join voice dan putar lagu
        if(URL_valid(args[0])){
 
            const  connection = await voiceChannel.join();
            const stream  = ytdl(args[0], {filter: 'audioonly'});
 
            //Putar lagu pakai url
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () =>{
                voiceChannel.leave();
                message.channel.send('Pemutaran selesai, Miko keluar dari voice channel. :wave:');
            });
 
            await message.reply(`:minidisc: Sekarang memutar ${args[0]}`)
            return;
        }


        //Bot join ke voice channel
        const connection = await voiceChannel.join();

        //Search video di YT
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        //Video yang ketemu diputar audio only
        const video = await videoFinder(args.join());
        if(video) {
            const stream = ytdl(video.url, {filter: 'audioonly'});
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () => {
                voiceChannel.leave();
                message.channel.send('Pemutaran selesai, Miko keluar dari voice channel. :wave:');
            })

            //Kirim judul lagu yang diputar
            await message.reply(`:minidisc: Sekarang memutar ${video.title}`)
        
        } else {
            //Kalau tidak ada hasil pencarian di YT
            message.channel.send("Pencarian YouTube kosong.");
        }
    }
}