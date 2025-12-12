const TelegramBot = require('node-telegram-bot-api');

// Your Token
const TOKEN = '7626608558:AAG2sSmF3awXpk8dbSKoEAb4QDpObyN-kNA'; 

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("Bot is starting...");

// --- 1. Handle Text Messages ---
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const name = msg.from.first_name;

    if (!text) return; 

    // If user types "/start" or "button", show the button
    if (text === '/start' || text.toLowerCase().includes('button')) {
        bot.sendMessage(chatId, `Welcome ${name}! Click the button below:`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        // { text: "Label", callback_data: "ID_FOR_CODE" }
                        { text: "🎲 Get Random Number", callback_data: 'get_random_num' }
                    ]
                ]
            }
        });
    } 
    else if (text.toLowerCase().includes('hello')) {
        bot.sendMessage(chatId, `Hello back to you, ${name}! 👋`);
    }
});

// --- 2. Handle Button Clicks ---
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data; // This is the 'callback_data' we set above

    if (data === 'get_random_num') {
        // Generate a random number between 1 and 100
        const randomNum = Math.floor(Math.random() * 100) + 1;

        // Send the result to the user
        bot.sendMessage(chatId, `Your random number is: ${randomNum} 🎲`);

        // Tell Telegram the button click was handled (stops the loading animation)
        bot.answerCallbackQuery(query.id);
    }
});

// Error handling
bot.on('polling_error', (error) => {
    console.log(`[Polling Error]: ${error.message}`);
});