import { Message } from 'discord.js';
import { Command } from '../../main';
import dataMessage from '../schemas/bot-message.json';

const separator = '||';
export const handleMessages = (
  incomingMessage: Message,
  commands: Command[]
) => {
  const prefix = process.env.PREFIX?.trim().split(',') || ['?'];
  let argument = '';

  if (prefix.includes(incomingMessage.content.charAt(0))) {
    terminalMessageLog(
      'argument',
      incomingMessage.content,
      incomingMessage.author.username
    );
    argument = incomingMessage.content.split(' ')[0].substring(1);
  }

  const command = commands.find((command) => command.name === argument);
  try {
    if (command) {
      const extraFields = incomingMessage.content.split(' ').slice(1);
      command.execute(incomingMessage, argument, extraFields);
    } else {
      hanndleNonCommand(incomingMessage);
    }
  } catch (error) {
    console.error(error);
    incomingMessage.reply('There was an error executing that command!');
  }
};

const hanndleNonCommand = (incomingMessage: Message) => {
  for (const message of dataMessage.messages as any) {
    // array 0 = key(trigger), array 1 = response, array 2 = include, array 3 = with author, array 4 = reply or broadcast channel
    const messageContent = incomingMessage.content.toLowerCase();
    if (
      messageContent === message[0] ||
      (messageContent.includes(message[0]) && message[2])
    ) {
      sent(incomingMessage, message);
      terminalMessageLog('key', message[0], incomingMessage.author.username);
      return;
    }

    if (message[0].includes(separator)) {
      const keys = message[0].split(separator);
      //check order of keys
      if (!isIncludesInOrder(keys, incomingMessage.content.toLowerCase()))
        continue;

      sentMultipleKeyMessage(incomingMessage, message);
      terminalMessageLog(
        'key',
        keys.join(', '),
        incomingMessage.author.username
      );
    }
  }
};

const sentMultipleKeyMessage = (incomingMessage: Message, message: string) => {
  if (message[1] === 'sama random user') {
    const server = incomingMessage.guild;
    const members = server?.members.cache.map((member) => {
      return member.nickname ? member.nickname : member.user.username;
    });
    const member = members
      ? members[Math.floor(Math.random() * members.length)]
      : null;
    incomingMessage.reply(`Sama ${member}`);
    return;
  } else {
    sent(incomingMessage, message);
    return;
  }
};

const isIncludesInOrder = (keys: string[], message: String) => {
  let startIndex = 0;
  for (const key of keys) {
    console.log(startIndex);
    console.log(key);
    startIndex = message.indexOf(key, startIndex);
    if (startIndex === -1) {
      return false;
    }
    startIndex += key.length;
  }
  return true;
};

const sent = (incomingMessage: Message, message: string) => {
  const messages = message[1].split(separator);
  const messageSend = messages[Math.floor(Math.random() * messages.length)];
  if (message[4] == 'gif') incomingMessage.channel.send(messageSend);
  if (message[4] == 'reply')
    incomingMessage.reply(
      `${messageSend} ${message[3] ? incomingMessage.author.username : ''}`
    );
  if (message[4] == 'channel')
    incomingMessage.channel.send(
      `${messageSend} ${message[3] ? incomingMessage.author.username : ''}`
    );
};

const terminalMessageLog = (type: string, log: string, author: string) => {
  console.log(
    `${
      type === 'key' ? 'key' : 'argument'
    } used : "${log}" by ${author} at ${new Date()}`
  );
};
