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
  "When I went to vote last week at the Brentwood, TN library, I chose the Republican candidate, Donald Trump, three different times, and it highlighted a Democratic candidate. It happened again when I tried to vote for another Republican, and I had to press twice before it would highlight the Republican candidate. I didn’t say anything because I thought maybe I just hadn’t been careful enough, but I’ve since heard widespread reports of the same thing happening to lots of other people here in Tennessee with the same candidates. I’m just here to say this happened to me. Ridiculous.",
  "Look, it's me with my sugar daddy in 1921. I was much younger, but still ugly as fuck 😂 https://cdn.discordapp.com/attachments/1350086261112700988/1570903183461449839/p.png?ex=6af8c918&is=6af77798&hm=c1f5f692c4e29e8a63f00906bf6df272c559b82ac134c4f18a97cdfe663ea10b&",
  "I guess OKAN being more active than for 5 minutes is rarer than Kesha getting a hit. Both situations are the rarest things in the world tho...",
  "Photoshoot with Katy Perry! https://cdn.discordapp.com/attachments/1350086261112700988/1570904121794371674/kp.png?ex=6af8c9f8&is=6af77878&hm=994b2023108445493b4febdd254e1c30876c071ca3e1d6f88528c2dd16d98b29&",
  "My new videoshoot avaiable on onlyscams.com 🤍 https://cdn.discordapp.com/attachments/1350086261112700988/1570904385326809118/of.png?ex=6af8ca37&is=6af778b7&hm=d5af20fd782db07ab1e5a6d9ca6ec369e234282a27207fb5101f640d1c6b8024&",
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
