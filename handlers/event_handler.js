const fs = require("fs");

module.exports = (client, Discord) => {

    //Karena di dalam folder "events" ada 2 sub folder. jadi harus di load dulu
    const load_dir = (dirs) => {

        //Load file event dari dalam masing masing sub folder tadi. Terus di filter yang endingnya .js
        const event_files = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'));

        //Looping buat pisahin nama event tiap file dari ending .js nya
        //Contoh: ready.js => nama eventnya "ready"
        for(const file of event_files){
            const event = require(`../events/${dirs}/${file}`);
            const event_name = file.split('.')[0];
            client.on(event_name, event.bind(null, Discord, client));
        }
    }
    //Bagian untuk deklarasi nama sub folder yang ada di dalam folder events
    ['client', 'guild'].forEach(subfolder_events => load_dir(subfolder_events));
}
