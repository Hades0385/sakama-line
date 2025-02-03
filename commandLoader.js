const fs = require("fs");
const path = require("path");

// 讀取 commands 資料夾內的所有指令
const commands = {};
fs.readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const command = require(`./commands/${file}`);
    commands[command.name] = command;

    // 註冊 aliases（別名）
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach((alias) => {
        commands[alias] = command;
      });
    }
  });

module.exports = async (commandName, args, client, event) => {
  if (commands[commandName]) {
    try {
      await commands[commandName].execute(args, client, event);
    } catch (err) {
      console.error(`執行指令 ${commandName} 時發生錯誤:`, err);
    }
  } else {
    console.log(`未識別的指令: ${commandName}`);
  }
};
