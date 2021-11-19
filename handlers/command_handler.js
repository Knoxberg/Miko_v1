const fs = require("fs");

module.exports = (client, Discord) => {
    //Cari file perintah di folder "perintah". terus di filter yang endingnya .js saja
    const command_files = fs.readdirSync("./perintah/").filter(file => file.endsWith(".js"));

    //Looping untuk list semua file perintah di folder perintah.
    for(const file of command_files){
        const command = require(`../perintah/${file}`);

        //Parameter nama di file perintah dijadikan nama perintahnya
        //Contoh: name : 'image'
        //Jadi perintah yang dipakai jadi [prefiks]image
        if(command.name){
            client.commands.set(command.name, command);
        } else {
            continue;
        }
    }
}