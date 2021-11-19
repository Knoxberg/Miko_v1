const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {
    name: 'leave',
    description: 'Stop pemutaran lagu dan keluar dari voice channel',

    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
 
        try {
            if(!voiceChannel) return message.channel.send("`Ehh, ups:` Kamu harus bergabung ke Voice Channel dahulu.");
            await voiceChannel.leave();
            await message.channel.send('Musik berhenti, Miko keluar dari voice channel. :wave:');

        } catch(err) {
            console.log(err)
            return;
        }
    }
}