const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  aliases: ["指令"],
  description: "顯示所有可用的指令清單",
  execute: async (args, client, event) => {
    try{
      // 讀取所有指令
      const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith(".js"));
      let helpMessage = "📌 **指令清單**\n\n";

      commandFiles.forEach(file => {
        const command = require(`./${file}`);
        let aliasesText = command.aliases ? `（別名: ${command.aliases.join(", ")}）` : "";
        helpMessage += `🔹 **!${command.name}** ${aliasesText}\n   ➥ ${command.description || "無描述"}\n\n`;
      });

      await client.replyMessage(event.replyToken, {
        type: "text",
        text: helpMessage.trim(),
      });
    } catch (error) {
      // await client.replyMessage(event.replyToken, {
      //   type: "text",
      //   text: "❌獲取指令清單時發生錯誤，請稍後再試"
      // });
      console.log(error)
    }
  },
};
