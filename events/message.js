require("dotenv").config();
const commandLoader = require("../commandLoader");

const COMMAND_PREFIX = process.env.COMMAND_PREFIX || "!"; // 從 .env 讀取指令前綴，預設為 "!"

module.exports = {
  eventType: "message",
  handle: async (event, client) => {
    if (event.message.type === "text") {
      const text = event.message.text.trim();

      if (text.startsWith(COMMAND_PREFIX)) {
        const commandBody = text.slice(COMMAND_PREFIX.length).trim();
        const args = commandBody.split(/\s+/); 
        const commandName = args.shift().toLowerCase(); 

        // 呼叫 commandLoader，傳遞 commandName 和 args
        await commandLoader(commandName, args, client, event);
      } else {
        console.log("收到非指令訊息，忽略處理");
      }
    } else {
      console.log("收到非文字訊息，忽略處理");
    }
  },
};
