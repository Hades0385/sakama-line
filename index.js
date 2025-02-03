require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");
const eventLoader = require("./eventLoader");

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

// 設定 LINE Webhook
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map((event) => eventLoader(event, client)))
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error("Webhook error:", err);
      res.status(500).end();
    });
});

app.listen(PORT, () => {
  console.log(`LINE Bot 伺服器運行於 http://localhost:${PORT}`);
});
