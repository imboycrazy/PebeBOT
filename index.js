require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// ---------------------------------------------------------------------------
// Access control
// ---------------------------------------------------------------------------

const ALLOWED_SENDMSG_ID = '1178243446817955933';

// ---------------------------------------------------------------------------
// Weighted response pools
// ---------------------------------------------------------------------------

// weight: 3 = often, 2 = normal, 1 = rare
const ASK_PEBE_RESPONSES = [
  { text: "Andy is forcing me to answer yes to this question", weight: 3 },
  { text: "My wrinkled left tit says no", weight: 2 },
  { text: "woof woof bitch [that means no]", weight: 1 },
  { text: "What if I direct your question to KeshaBOT?", weight: 3 },
  { text: "Yeah, why not?", weight: 3 },
  { text: "Nope, find God instead", weight: 3 },
  { text: "No fucking way!", weight: 3 },
  { text: "Rope and a Chair", weight: 2 },
  { text: "I’d give you a clever answer, but my brain is buffering like a 2010 YouTube video.", weight: 2 },
  { text: "My naked butt says yes to this filth", weight: 3 },
  { text: "My naked butt farts a big smelly no to this one", weight: 3 },
];

const PEBE_RESPONSES = [
  "If life gives you a dick, ride it!",
  "Queef is my answer to so many issues 🤍",
  "Don't blame yourself for your mistakes, blame Kesha instead.",
  "Should I wear my penis costume again?",
  "Writing songs is for the delusional people like Kesha. Oh, wait...",
  "My cooch smells terrible... Oh wait you want an advice? My bad",
  "in the 70s I used to live in the middle of nowhere. I still live in the middle of nowhere",
  "'Kinky Spice' is the name of Kesha's secret Google Drive btw",
  "slaying the boots down, serving cunt 💋",
  "I put the placenta necklace inside my coochie",
  "One of the dogs just pooped on my new carpet. I’m so sad.",
  "Do you remember the dick costume Kesha made me wear? I think she bought it from eBay. It was so musky and smelled real stinky.",
  "My name isn't Phoebe! It's Pebe. Pee-Bee. ♥️",
  "Album or single? I’m single. ♥️",
  "Dolly Parton and I hooked up once...",
  "When I got sued, I wanted to hire Tom. Let's just say buying a house in LA would have been cheaper!",
  "I've built the Khia Asylum with my daughter",
  "Hard Times Ahead was about 9/11",
  "Christine Lepera is actually hot 🥵",
  "I drink my pee once a week. I heard it's good for hags like me.",
  "I'm a lyricist for Sizzy Rocket's next album. I think she's very talented, like my daughter. I also listened to some random artist's discography - her name's Kesha. She was so untalented and her music was so bad.",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function weightedRandom(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item.text;
  }
  return items[items.length - 1].text;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildAskPebeReply(question) {
  const answer = weightedRandom(ASK_PEBE_RESPONSES);
  return `**❓ ${question}**\n\n${answer}`;
}

function buildPebeReply() {
  return randomPick(PEBE_RESPONSES);
}

// ---------------------------------------------------------------------------
// Slash commands
// ---------------------------------------------------------------------------

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'askpebe') {
    const question = interaction.options.getString('question');
    await interaction.reply(buildAskPebeReply(question));
  }

  if (interaction.commandName === 'pebe') {
    await interaction.reply(buildPebeReply());
  }

  if (interaction.commandName === 'sendmsg') {
    if (interaction.user.id !== ALLOWED_SENDMSG_ID) {
      await interaction.reply({ content: 'Access denied: Only people from Tel Aviv are able to use it.', ephemeral: true });
      return;
    }

    const targetUser = interaction.options.getUser('user');
    const msgText = interaction.options.getString('message');

    try {
      await targetUser.send(msgText);
      await interaction.reply({ content: `Message sent to ${targetUser.username}!`, ephemeral: true });
    } catch {
      await interaction.reply({ content: `Could not send a message to ${targetUser.username}. They may have DMs disabled.`, ephemeral: true });
    }
  }

  if (interaction.commandName === 'send') {
    if (interaction.user.id !== ALLOWED_SENDMSG_ID) {
      await interaction.reply({ content: 'Access denied: Only people from Tel Aviv are able to use it.', ephemeral: true });
      return;
    }

    const msgText = interaction.options.getString('message');
    await interaction.channel.send(msgText);
    await interaction.reply({ content: 'Message sent!', ephemeral: true });
  }
});

// ---------------------------------------------------------------------------
// Prefix commands + mention trigger
// ---------------------------------------------------------------------------

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;

  const content = message.content.trim();
  const lowerContent = content.toLowerCase();

  // !askpebe <question>
  if (lowerContent.startsWith('!askpebe')) {
    const question = content.slice('!askpebe'.length).trim();
    if (!question) {
      await message.reply('Please include a question! e.g. `!askpebe how are you?`');
      return;
    }
    await message.reply(buildAskPebeReply(question));
    return;
  }

  // !pebe
  if (lowerContent.startsWith('!pebe')) {
    await message.reply(buildPebeReply());
    return;
  }

  // @mention the bot
  if (message.mentions.has(client.user)) {
    await message.reply(buildPebeReply());
    return;
  }
});

// ---------------------------------------------------------------------------
// Ready
// ---------------------------------------------------------------------------

client.once(Events.ClientReady, () => {
  console.log(`PebeBot is online as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{
      name: 'Precum(ition)',
      type: 2,
    }],
    status: 'online',
  });
});

client.login(process.env.DISCORD_TOKEN);
