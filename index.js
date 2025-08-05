require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const axios = require('axios');
const net = require('net');

const NLP_API_URL = process.env.NLP_API_URL || 'http://localhost:8000';
const FIREWALL_API_URL = process.env.FIREWALL_API_URL || 'http://localhost:8001';
const FIREWALL_SECURITY_LIST_OCID = process.env.FIREWALL_SECURITY_LIST_OCID;
const MINECRAFT_SERVER_PORT = process.env.MINECRAFT_SERVER_PORT || 25565;
const MINECRAFT_VOICE_CHAT_PORT = process.env.MINECRAFT_VOICE_CHAT_PORT || 25560;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

function isValidIP(ip) {
    return net.isIP(ip) !== 0;
}

client.on('messageCreate', async (message) => {
  
  const isMessageFromBot = message.author.bot;
  const isDM = message.channel.type === 1;
  const wasMentioned = message.mentions.has(client.user);
  const startedWithPrefix = message.content.toLowerCase().startsWith('!pollocraft');

    if (isMessageFromBot || (!isDM && !wasMentioned && !startedWithPrefix)) {
      return;
    }

    await message.react('👀');
    await message.channel.sendTyping();

    const typingInterval = setInterval(() => {
        message.channel.sendTyping().catch(console.error);
    }, 8000);

  try {
    
    const interpretResponse = await axios.post(`${NLP_API_URL}/interpret`, {
        message: message.content
    });

    const {action, response} = interpretResponse.data;

    switch (action) {
        case 'add_ip':
            if (isValidIP(response)) {
                username = message.author.tag;
                const addIpResponse = await axios.post(`${FIREWALL_API_URL}/add_ip`, {
                    security_list_ocid: FIREWALL_SECURITY_LIST_OCID,
                    ip: response,
                    username: username,
                    tcp_port: MINECRAFT_SERVER_PORT,
                    udp_port: MINECRAFT_VOICE_CHAT_PORT
                });

                await message.reply(`La IP ha sido añadida correctamente al firewall. Puedes unirte al servidor de Minecraft. Si tienes problemas, contacta a Julio.`);
                
            } else {
                await message.reply(`La IP proporcionada no es válida. Por favor, verifica la IP y vuelve a intentarlo.`);
            }
            break;

        case 'small_talk':
          await message.reply(response);
          break;
        default:
          await message.reply('Lo siento, no entendí tu mensaje. Por favor intenta de nuevo.');
    }

  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    await message.reply('Lo siento, ocurrió un error al procesar tu mensaje. Por favor contacta a Julio si el problema persiste.');
  } 
  finally {
    clearInterval(typingInterval);
  }

});

client.login(process.env.DISCORD_TOKEN);