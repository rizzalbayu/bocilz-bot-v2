import { Client, Message } from 'discord.js';
import 'dotenv/config';
import { handleCommands } from './helpers/handlers/command';
import { handleMessages } from './helpers/handlers/message';

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
});
export interface Command {
  name: string;
  execute: (message: Message, args: string, extraFields?: string[]) => void;
}
const commands: Command[] = [];
const commandFiles = ['ping', 'random'];
for (const file of commandFiles) {
  const command = require(`./commands/${file}.js`);
  commands.push(command);
}

client.once('ready', async (client) => {
  client.user.setStatus('online');
  client.user.setActivity('Real Life', { type: 1 });
  console.log(`${client.user.username} is online.`);
});

client.on('messageCreate', (incomingMessage) => {
  if (incomingMessage.author.bot) return;
  handleMessages(incomingMessage, commands);
});

const botKey = process.env.API_KEY;
client.login(botKey);
