export default {
  async fetch(request, env) {
    if (request.method === "POST") {
      const update = await request.json();
      
      // 1. Handle Messages
      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text || "";
        const name = update.message.from?.first_name || "there";

        if (text === "/start" || text.toLowerCase().includes("button")) {
          await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `Welcome ${name}! Click the button below:`,
              reply_markup: {
                inline_keyboard: [
                  [{ text: "🎲 Get Random Number", callback_data: "get_random_num" }]
                ]
              }
            })
          });
        } else if (text.toLowerCase().includes("hello")) {
          await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: `Hello back to you, ${name}! 👋` })
          });
        }
      }

      // 2. Handle Callback Queries (Button Clicks)
      if (update.callback_query) {
        const query = update.callback_query;
        const chatId = query.message.chat.id;
        
        if (query.data === "get_random_num") {
          const randomNum = Math.floor(Math.random() * 100) + 1;
          
          // Send the number
          await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: `Your random number is: ${randomNum} 🎲`
            })
          });

          // Stop the loading animation on the button
          await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/answerCallbackQuery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ callback_query_id: query.id })
          });
        }
      }

      return new Response("OK");
    }
    return new Response("Bot Worker is running!");
  }
}