const Discord = require("discord.js");
const client = new Discord.Client();

var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer : {
        headless: true 
    }
});

//module export gambar
module.exports = {
    name:'image',
    description:'Kirim foto sesuai keyword yang diberikan',

    async execute(client, message, args, cmd, Discord) {
        const image_query = args.join('  ');


        try {
            //Kalau tidak ada keyword yang diberi, bakal keluar tanda error.
            if(!image_query) return message.channel.send('`Ehh, ups:` Jangan lupa masukkan keyword setelah perintah.');
            message.channel.send("Miko sedang mencari...")
            
            //Hasil foto
            const image_results = await google.scrape(image_query, 1);

            message.channel.send(image_results[0].url);

        } catch(error) {
            console.log(error);
            return;
        }
    }
}