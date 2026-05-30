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
  { text: "NO is for Naked Oral fun in the woods", weight: 2 },
  { text: "Andy is forcing me to answer yes to this question", weight: 3 },
  { text: "Dolly Parton and I hooked up once", weight: 2 },
  { text: "Sage is NOT mine!", weight: 2 },
  { text: "My wrinkled left tit says otherwise.", weight: 2 },
  { text: "Should I write a hit for another artist to spite my daughter?", weight: 2 },
  { text: "When I got sued, I wanted to hire Tom. Let's just say buying a house in LA would have been cheaper!", weight: 2 },
  { text: "woof woof bitch", weight: 1 },
  { text: "I've built the Khia Asylum with my daughter Kesha", weight: 2 },
  { text: "So who has got Lana's dad's phone number?", weight: 2 },
  { text: "Do you remember the dick costume Kesha made me wear? I think she bought it from eBay. It was so musky and smelled real stinky.", weight: 2 },
  { text: "What if I direct your question to KeshaBOT?", weight: 3 },
  { text: "Hard Times Ahead was about 9/11", weight: 2 },
  { text: "Christine Lepera is actually hot 🥵", weight: 1 },
  { text: "I drink my pee once a week", weight: 1 },
  { text: "The magic mission was a scam at first but Kesha had to ruin my plans", weight: 2 },
  { text: "Connor is threatening to release music I haven't written yet.", weight: 2 },
  { text: "Yeah, why not?", weight: 3 },
  { text: "Nope, find God instead", weight: 3 },
  { text: "No fucking way!", weight: 3 },
  { text: "Andrew I'll blow up your State for a 1.99$", weight: 2 },
  { text: "Rope and a Chair", weight: 2 },
  { text: "So what if you don't stream Origami and stream Vampire instead? I'll love you forever ♾️", weight: 2 },
  { text: "Dan I have a glitter covered vape for you!", weight: 2 },
  { text: "I wrote a song about who shot Trump", weight: 2 },
  { text: "Crazy in me sees the crazy in you is my favourite lyric I've ever written.", weight: 2 },
  { text: "I’d give you a clever answer, but my brain is buffering like a 2010 YouTube video", weight: 3 },
  { text: "My naked butt says yes to this filth", weight: 3 },
  { text: "My naked butt farts a big smelly no to this one", weight: 3 },
];

const PEBE_RESPONSES = [
  "If life gives you a dick, ride it.",
  "Vodo Magic is my answer to so many issues.",
  "Don't blame yourself for your mistakes, blame Kesha instead.",
  "If you have a gun, swing it.",
  "Listen to your elders when they speak.",
  "Daddy is a state of mind.",
  "Writing songs is for the delusional people like Kesha",
  "You're a beautiful shit head, you deserve to be hired instead of Chelsea",
  "Why 7/11 is still open? Oh wait you want an advice? My bad.",
  "Sex Toys are important to have in the bedroom.",
  "in the 70s I used to live in the middle of nowhere",
  "'Kinky Spice' is the name of Kesha's secret Google Drive",
  "slaying the boots down, serving cunt 💋",
  "I put the placenta necklace inside my coochie... Feels so good",
  "One of the dogs just pooped on my new carpet. I’m so sad.",
  "Where is my penis costume",
  "My name isn't Phoebe! It's Pebe. Pee-Bee. ♥️",
  "Album or single? I’m single. ♥️",
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
      name: 'Queef Times Ahead',
      type: 2,
    }],
    status: 'online',
  });
});

client.login(process.env.DISCORD_TOKEN);
