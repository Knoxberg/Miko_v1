const Discord = require("discord.js");
const client = new Discord.Client();

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const ffmpeg = require('ffmpeg-static');

module.exports = {
    name : 'play',
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
 
            const connection = await voiceChannel.join()

            const stream  = ytdl(args[0], {filter: 'audioonly'});

            //Search URL tadi di YT
            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }
            const video = await videoFinder(args[0]);

            try{
                //Putar lagu pakai url
                connection.play(stream, {seek: 0, volume: 1})
                .on('finish', () =>{
                voiceChannel.leave();

                message.channel.send('`INFO:` Pemutaran selesai, Miko keluar dari voice channel. :wave:');
            });

            //Pesan Embed yang isinya Judul, Durasi, Views, sama Thumbnail video
            const infoLagu = new Discord.MessageEmbed()
            .setColor('#FFC0CB')
            .setTitle(':white_check_mark: Okee, Miko tambahin!')
            .setImage(`${video.thumbnail}`)
            .addFields(
                {name: 'Judul           :', value: `${video.title}`},
                {name: 'Durasi :clock3: :', value: `${video.duration}`},
                {name: 'Views :eyes:  :', value: `${video.views}`}
            )

            //Kirim pesan embed diatas
            await message.reply(infoLagu);
            return;

            } catch(error) {
                console.log(`${error}`)
                return;
            }
        }


        //Bot join ke voice channel
        const connection = await voiceChannel.join()

        //Search video di YT
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        //Video yang ketemu diputar audio only
        const video = await videoFinder(args.join());
        if(video) {
            const stream = ytdl(video.url, {filter: 'audioonly'});

            try {
                connection.play(stream, {seek: 0, volume: 1})
                .on('finish', () => {
                voiceChannel.leave();
                message.channel.send('`INFO:` Pemutaran selesai, Miko keluar dari voice channel. :wave:');
                })

                //Pesan Embed yang isinya Judul, Durasi, Views, sama Thumbnail video
                const infoLagu = new Discord.MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle(':white_check_mark: Okee, Miko tambahin!')
                .setImage(`${video.thumbnail}`)
                .addFields(
                    {name: 'Judul           :', value: `${video.title}`},
                    {name: 'Durasi :clock3: :', value: `${video.duration}`},
                    {name: 'Views :eyes:  :', value: `${video.views}`}
                )

                //Kirim pesan embed diatas
                await message.reply(infoLagu);

            } catch(error){
                console.log(error);
                return;
            }

        
        } else {
            //Kalau tidak ada hasil pencarian di YT
            message.channel.send("Pencarian YouTube kosong.");
        }
    }
}