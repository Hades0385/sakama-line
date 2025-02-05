const axios = require("axios");

module.exports = {
  name: "rainforecast",
  aliases: ["rf","降雨"],
  description: "查詢未來一小時可能降雨地區，使用說明:!rf",
  execute: async (args, client, event) => {
    axios
      .get("https://watch.ncdr.nat.gov.tw/wh/dv_ncdrnowcast_town?")
      .then(async (response) => {
        const city = args[0];
        const rainData = parseHTMLData(response.data);
        // 過濾出level值等於1的資料
        const rainForecast = rainData.filter((item) => item.level === 1);

        let time = rainData[0].timestamp;
        let description = `⚠️ 預警標準：\n` +
        `未來 1 小時內可能發生 10mm/10分鐘 或 40mm/1小時 的降雨量\n` +
        `此資訊僅供參考，實際降雨請以氣象署公告為主\n\n`;

        let messageText = `🌧️ 推估未來 1 小時內會發生大雨的鄉鎮列表\n\n` + description;

        if (rainForecast.length === 0) {
          messageText += `✅ 目前 無預警縣市\n`;
        } else {
          // 按照城市分組
          const groupedData = rainForecast.reduce((acc, item) => {
            if (!acc[item.city]) {
              acc[item.city] = [];
            }
            acc[item.city].push(item.town);
            return acc;
          }, {});

          if (city) {
            if (groupedData[city]) {
              messageText = `🌧️ 推估 ${city} 未來 1 小時內會發生大雨的鄉鎮\n\n` + description;
              messageText += `📍 ${city}\n🏘️ ` + groupedData[city].join("、");
            } else {
              messageText = `🌧️ 推估 ${city} 未來 1 小時內會發生大雨的鄉鎮\n\n` + description;
              messageText += `✅ 目前 ${city} 無預警鄉鎮`;
            }
          } else {
            for (const [cityName, towns] of Object.entries(groupedData)) {
              messageText += `📍 ${cityName}\n🏘️ ` + towns.join("、") + `\n\n`;
            }
          }
        }
        messageText += `\n\n🕒 最近更新時間: ${time}\n資料來源: 國家災害防救科技中心 - 氣象組`;

        const textMessage = {
          type: "text",
          text: messageText
        };

        await client.replyMessage(event.replyToken, textMessage);

      })
      .catch(async (error) => {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "❌發生錯誤，請稍後再試"
        });
        console.error(error);
      });
  },
};

function parseHTMLData(htmlContent) {
  const dataStartIndex = htmlContent.indexOf("\n") + 1;
  const csvData = htmlContent.substring(dataStartIndex).trim();

  const lines = csvData.split("\n");

  const parsedData = [];

  lines.forEach((line) => {
    const [id, level, timestamp, cid, city, town] = line.split(",");
    parsedData.push({
      id: id.trim(),
      level: parseInt(level.trim()),
      timestamp: timestamp.trim(),
      cid: cid.trim(),
      city: city.trim(),
      town: town.trim(),
    });
  });

  return parsedData;
}