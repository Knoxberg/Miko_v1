const { ShardingManager } = require("discord.js");
require('dotenv').config();


const managerShard = new ShardingManager("./bot.js", {
    // Info lebih tentang ShardingManager Discord.js:
    // https://discord.js.org/#/docs/main/stable/class/ShardingManager

    //Atur jumlah shard ("auto" buat setel otomatis)
    totalShards: "auto",

    //Token login
    token: process.env.TOKEN_LOGIN_BOT
});

// Waktu shard dibuat, kirim notif id shard di terminal
managerShard.on("shardCreate", (shard) => {
    console.log(`Shard baru dibuat. ID: ${shard.id}`)
});

// summon shard nya mwahhahwhhawhah
managerShard.spawn();