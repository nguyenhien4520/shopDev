const {Client, GatewayIntentBits} = require('discord.js')

const client = new Client(
{
    intents: [
        GatewayIntentBits.DirectMessages,
         GatewayIntentBits.Guilds,
         GatewayIntentBits.GuildMessages, 
         GatewayIntentBits.MessageContent]
}
)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const token = 'MTI5NzIwOTk1ODYxMzUxNjI4OA.GEZnim.pQBmPFriqsTwX1_Mi0-OZDesoYqjfdtBE9hqRk'

client.login(token);
client.on('messageCreate', msg => {
    // if( msg.author.bot) return;
    if(msg.content == 'hello'){
        msg.reply('chào đại ca, tôi giúp gì được cho đại ca')
    }
})
