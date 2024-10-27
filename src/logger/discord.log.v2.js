// const{Client, GatewayIntentBits} = require('discord.js')

// class LoggerService{
//     constructor(){
//         this.client = new Client({
//             intents: [GatewayIntentBits.GUILDS, 
//              GatewayIntentBits.GuildMessages, 
//              GatewayIntentBits.MessageContent,
//              GatewayIntentBits.DirectMessages]
//         })
//         this.channelId = '1297212050241749023'
//         this.client.on('ready', () => {
//             console.log(`Logged in as ${this.client.user.tag}!`);
//         });
//         this.client.login('MTI5NzIwOTk1ODYxMzUxNjI4OA.GEZnim.pQBmPFriqsTwX1_Mi0-OZDesoYqjfdtBE9hqRk')
//     }

//     sendToMessage(mesage = 'message'){
//         const channel = this.client.channels.cache.get(this.channelId)
//         if(!channel){
//             console.log('can not find channel', channel);
//             return
//         }
//         channel.send(mesage).catch(e => console.error(e))
//     }
// }

// module.exports = new LoggerService()