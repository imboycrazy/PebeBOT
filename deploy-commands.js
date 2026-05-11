require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('askpebe')
    .setDescription('Ask Pebe a question and get a random answer')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('What do you want to ask Pebe?')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('pebe')
    .setDescription('Get a random piece of Pebe wisdom'),

  new SlashCommandBuilder()
    .setName('sendmsg')
    .setDescription('Send a private message to a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to send the message to')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('The message to send')
        .setRequired(true)
    ),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
})();
