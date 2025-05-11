import { EmbedBuilder, Message } from 'discord.js';

export const name = 'random';

export function execute(
  message: Message,
  args: string[],
  extraFields: string[]
) {
  if (!args[1]) message.reply('input argument');

  switch (extraFields[0]) {
    case 'user':
      const server = message.guild;
      if (!server) return;

      const members = server.members.cache.map((member) => {
        return member.nickname ? member.nickname : member.user.username;
      });
      const member = members[Math.floor(Math.random() * members.length)];
      const embedResult = new EmbedBuilder()
        .setTitle('Result User')
        .addFields({ name: 'Username', value: member })
        .setColor(0x3498db);

      message.channel.send({ embeds: [embedResult] });
      break;

    default:
      break;
  }
}
