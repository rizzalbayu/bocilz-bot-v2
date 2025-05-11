import { Message } from 'discord.js';
import { Command } from '../../main';

export const handleCommands = (message: Message, commands: Command[]) => {
  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName || commandName.charAt(0) !== '!') return;

  const command = commands.find((c) => c.name === commandName.slice(1));
  if (!command) return;

  try {
    command.execute(message, args[0]);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command!');
  }
};
