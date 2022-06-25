const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {
    name: "stats",
    aliases: ["stat", "statistik", "botstat", "statistikbot", "statbot", "statsbot"],
    description: "Print jumlah server yang bot ikuti, plus jumlah anggotanya juga (bot juga termasuk)",

    async execute(client, message, cmd, args){
        try {
            const promises = [
                client.shard.fetchClientValues('guilds.cache.size'),
                client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
            ];
            return Promise.all(promises)
                .then(results => {
                    const totalGuild = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                    const totalAnggota = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

                    //Isi konten pesan embedded
                    const embedStatistikBot = new Discord.MessageEmbed()
                    .setColor('#FFC0CB')
                    .setTitle('Penasaran Miko ada dimana aja?')
                    .setDescription('')
                    .addFields(
                        {name: 'Jumlah Server :', value: `Miko ada di **${totalGuild}** server berbeda loh!:tada:`},
                        {name: 'Jumlah Member :', value: `Ada **${totalAnggota}** orang yang berteman dengan Miko!:heart_decoration:`},
                    )

                    //Kirim pesan berisi jumlah server, dan anggota
                    return message.reply(embedStatistikBot);
                })
                .catch(console.error);
        } catch (error) {
            console.log(error);
        }
    }
}