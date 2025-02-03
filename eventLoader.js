const fs = require("fs");
const path = require("path");

// 讀取 events 資料夾內的所有事件處理
const events = {};
fs.readdirSync(path.join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const eventHandler = require(`./events/${file}`);
    events[eventHandler.eventType] = eventHandler;
  });

module.exports = async (event, client) => {
  try {
    if (events[event.type]) {
      await events[event.type].handle(event, client);
    } else {
      console.log(`未處理的事件類型: ${event.type}`);
    }
  } catch (err) {
    console.error("處理事件時發生錯誤:", err);
  }
};
