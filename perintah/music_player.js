const Discord = require("discord.js");
const client = new Discord.Client();

const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const ffmpeg = require('ffmpeg-static');
const message = require("../events/guild/message");

const antrian = new Map();

module.exports = {
    name : 'play',
    aliases: ['skip', 'next', 'stop', 'queue', 'antrian', 'antri'],
    description : 'Untuk play audio dari YT dengan fitur Antrian (Queue), Skip, dan Stop',

    async execute(client, message, args, cmd, Discord) {
        const voiceChannel = message.member.voice.channel;
        
        //Kalau orang yang ngetik perintah gak ada di voice channel bakal keluarin pesan error.
        if(!voiceChannel) return message.channel.send("`Ohh tidak:` Kamu harus bergabung ke `\ Voice Channel \` dahulu.");

        //Untuk cek izin di server
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("`Ohh tidak:` Kamu harus memiliki izin untuk `\ CONNECT \` kedalam voice channel.");
        if(!permissions.has('SPEAK')) return message.channel.send("`Ohh tidak:` Kamu harus memiliki izin untuk `\ SPEAK \` kedalam voice channel.");

        const antrian_server = antrian.get(message.guild.id);

        //Listen buat perintah PLAY
        if(cmd === 'play'){

           //Kalau tidak ada keyword yang dikasih bakal keluarin pesan bantuan.
            const playHelp = new Discord.MessageEmbed()
            .setColor('#FFC0CB')
	        .setTitle('Waah... Miko bantu kamu yah!')
	        .setDescription('`?play <judul lagu>` = Miko putar hasil pencarian teratas di Youtube. \n `?play <link Youtube>` = Miko putar link itu buat kamu! \n-----------------------------------------\n Pastikan kamu sudah ada didalam `Voice Channel` juga ya! :wink:')
            if(!args.length) return message.channel.send(playHelp);

            //List kosong lagu
            let lagu = {};
            
            //Kalau URL
            if(ytdl.validateURL(args[0])){
                const info_lagu = await ytdl.getInfo(args[0]);
                lagu = {title: info_lagu.videoDetails.title, url: info_lagu.videoDetails.video_url}
                const tmp_judul_lagu = lagu.title;

                //Test Implementasi embed saat pakai Link
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }
                const video = await videoFinder(tmp_judul_lagu);
                lagu = {title: video.title, url: video.url, duration: video.duration, views: video.views, thumbnail: video.thumbnail}

            } else{
                //Kalau bukan URL, kita search pakai keyword
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await videoFinder(args.join(' '));
                if(video){
                    lagu = {title: video.title, url: video.url, duration: video.duration, views: video.views, thumbnail: video.thumbnail}
                } else{
                    //Kalau tidak ada hasil pencarian di YT
                    message.channel.send("Pencarian YouTube kosong.");
                }
            }
            //Kalau belum ada antrian
            if(!antrian_server){

                //Konstruktor antrian lagu
                const konstruktor_antrian = {
                    voice_channel: voiceChannel,
                    text_channel: message.channel,
                    connection: null,
                    list_lagu: [],
                }

                antrian.set(message.guild.id, konstruktor_antrian);
                konstruktor_antrian.list_lagu.push(lagu);

                try {
                    //Join Voice Channel
                    const connection = await voiceChannel.join();
                    konstruktor_antrian.connection = connection;
                    video_player(message.guild, konstruktor_antrian.list_lagu[0]);
                    

                } catch (error){
                    //Kalau ada error hapus semua antrian
                    antrian.delete(message.guild.id);

                    //Kirim pesan kalau gagal tersambung
                    message.channel.send('Wah, ada error. Miko gagal tersambung nih, Coba lagi yah :crying_cat_face:');
                    console.log(error);
                    //throw error;
                }

            } 

            //Kalau sudah ada antrian yang dibuat
            else{
                antrian_server.list_lagu.push(lagu);

                //Pesan Embed yang isinya Judul, Durasi, Views, sama Thumbnail video
                const infoLagu = new Discord.MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle(':white_check_mark: Okee, Miko tambahin ke antrian!')
                .setThumbnail(`${lagu.thumbnail}`)
                .addFields(
                    {name: 'Judul           :', value: `${lagu.title}`},
                    {name: 'URL             :', value: `${lagu.url}`},
                    {name: 'Durasi :clock3: :', value: `${lagu.duration}`},
                    {name: 'Views :eyes:  :', value: `${lagu.views}`, inline: true}
                )
                return message.channel.send(infoLagu);
            }
        }

        //Listen buat perintah SKIP
        else if(cmd === 'skip') skip_lagu(message, antrian_server);

        //Listen buat perintah NEXT
        else if(cmd === 'next') skip_lagu(message, antrian_server);

        //Listen buat perintah STOP
        else if(cmd === 'stop') stop_lagu(message, antrian_server);

        //Listen buat perintah QUEUE
        else if(cmd === 'queue') liat_daftar_antrian(message, Discord, antrian_server)

        //Listen buat perintah ANTRIAN
        else if(cmd === 'antrian') liat_daftar_antrian(message, Discord, antrian_server)

        //Listen buat perintah ANTRI
        else if(cmd === 'antri') liat_daftar_antrian(message, Discord, antrian_server)
    }
}

//Video player dari YT ==> Ambil audio aja ==> Stream di DC
const video_player = async (guild, lagu) => {
    const antrian_lagu = antrian.get(guild.id);

    //Kalau tidak ada lagu di antrian maka leave channel
    if(!lagu){
        antrian_lagu.voice_channel.leave();
        antrian.delete(guild.id);
        return;
    }

    //highWaterMark: 1 << 25 //Buffer 32Mb
    //quality: 'highestaudio',
    const stream = ytdl(lagu.url, {
        filter: 'audioonly',
        dlChunkSize: 0,
        highWaterMark: 1 << 25,
    });

    try {
        antrian_lagu.connection.play(stream, {seek: 0, volume: 1})
        .on('finish', () => {
            antrian_lagu.list_lagu.shift();
            video_player(guild, antrian_lagu.list_lagu[0]);
        });

    } catch (error){
        console.log(error);
        throw error;
    }
    

    //Pesan Embed yang isinya Judul, Durasi, Views, sama Thumbnail video
    const infoLagu = new Discord.MessageEmbed()
    .setColor('#FFC0CB')
    .setTitle(':minidisc: Sekarang Miko putar:')
    .setImage(`${lagu.thumbnail}`)
    .addFields(
        {name: 'Judul           :', value: `${lagu.title}`},
        {name: 'URL             :', value: `${lagu.url}`},
        {name: 'Durasi :clock3: :', value: `${lagu.duration}`},
        {name: 'Views :eyes:  :', value: `${lagu.views}`, inline: true}
    )
    
    await antrian_lagu.text_channel.send(infoLagu);
}

//Buat skip lagu
const skip_lagu = (message, antrian_server) => {
    //Kalau pengirim perintah tidak join di Voice Channel maka kirim pesan error
    if(!message.member.voice.channel) return message.channel.send("`Ohh tidak:` Kamu harus bergabung ke `\ Voice Channel \` dahulu.");
    
    //Kalau antrian server tidak ada maka kirim pesan kalau antrian kosong
    if(!antrian_server){
        return message.channel.send("Tidak ada lagu dalam antrian.");
    }
    antrian_server.connection.dispatcher.end();
}


//Buat stop lagu dan leave Voice Channel
const stop_lagu = (message, antrian_server) => {
    //Kalau pengirim perintah tidak join di Voice Channel maka kirim pesan error
    if(!message.member.voice.channel) return message.channel.send("`Ohh tidak:` Kamu harus bergabung ke `\ Voice Channel \` dahulu.");

    //Kosongin daftar antrian, karena daftar antrian kosong maka otomatis leave Voice Channel
    try {
        message.channel.send('Musik Miko hentikan. Bye-bye! :wave:');
        antrian_server.list_lagu = [];
        antrian_server.connection.dispatcher.end();

    } catch (error){
        console.log(error);
    }
}

const liat_daftar_antrian = async (message, Discord, antrian_server) => {
    if (antrian_server){
        const embeds = konstruktorPesanEmbedded(antrian_server.list_lagu)
    }
        
    function konstruktorPesanEmbedded(){
        //Array baru dengan value dari "title" antrian lagu
        var iniBuffer = [];

        try {
            for(var i=1; i<antrian_server.list_lagu.length; i++){
                //Formating menjadi => 1. [Judul lagu]
                iniBuffer.push(`${i}. ${antrian_server.list_lagu[i].title}`);
            }

            //Kalau ada antriannya bakal dikirim pakai ini
            if (iniBuffer.length > 0) {
                const infoAntrian = new Discord.MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle('Ini daftar antrian Miko! :page_facing_up:')
                .setDescription(' ')
                .addFields(
                    {name: 'Sekarang Memutar :dvd::', value: `${antrian_server.list_lagu[0].title}`},
                    {name: 'Antrian :cd::', value: iniBuffer},
                )
                return message.channel.send(infoAntrian);
            } 
            //Kalau ga ada antrian kirim yang ini (supaya tidak error empty message)
            else {
                const infoAntrian = new Discord.MessageEmbed()
                .setColor('#FFC0CB')
                .setTitle('Ini daftar antrian Miko! :page_facing_up:')
                .setDescription(' ')
                .addFields(
                    {name: 'Sekarang Memutar :dvd::', value: `${antrian_server.list_lagu[0].title}`},
                    {name: 'Antrian :cd::', value: "`Antrian kosong, Tambahin lagu lagi yuk!`"},
                )
                return message.channel.send(infoAntrian);
            }

        } catch (error) {
            console.log(error)
            message.channel.send('Wah, ada error. Miko gagal susun daftar antrian nih :crying_cat_face:')
        }
    }
}