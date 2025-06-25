const mineflayer = require('mineflayer');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const MAX_BOT = 30;
const botCount = Math.min(config.botCount || 1, MAX_BOT);

function createBot(id) {
  const username = config.username + id;

  console.log(`🔄 [Bot ${id}] Starting... Username: ${username}`);

  const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: username,
    version: config.version,
  });

  bot.once('spawn', () => {
    console.log(`✅ [Bot ${id}] Logged into the server and spawned.`);

    setTimeout(() => {
      if (config.firstJoin) {
        bot.chat(`/register ${config.password}`);
        console.log(`🟢 [Bot ${id}] /register command sent.`);
      } else {
        bot.chat(`/login ${config.password}`);
        console.log(`🔒 [Bot ${id}] /login command sent.`);
      }
    }, 3000);

    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 2000);

    setInterval(() => {
      bot.setControlState('forward', true);
      setTimeout(() => bot.setControlState('forward', false), 3000);
      console.log(`🚶 [Bot ${id}] walked forward.`);
    }, 5 * 60 * 1000);
  });

  bot.on('login', () => {
    console.log(`👤 [Bot ${id}] has entered the game.`);
  });

  bot.on('error', (err) => {
    console.log(`⚠️ [Bot ${id}] Error: ${err.message}`);
  });

  bot.on('kicked', (reason) => {
    console.log(`❌ [Bot ${id}] was kicked from the server! Reason: ${reason}`);
  });

  bot.on('end', () => {
    console.log(`🔌 [Bot ${id}] Connection lost. Reconnecting in 5 seconds...`);
    setTimeout(() => {
      createBot(id); 
    }, 5000);
  });
}

for (let i = 1; i <= botCount; i++) {
  createBot(i);
}
