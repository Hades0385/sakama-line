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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`伺服器已啟動，正在監聽 ${PORT}`);
});

