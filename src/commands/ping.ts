import { Message } from 'discord.js';

export const name = 'ping';

export function execute(message: Message, args: string[]) {
  message.channel.send('Pong!');
}
