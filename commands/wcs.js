const axios = require('axios')

module.exports = {
  name: "wcs",
  aliases: ["停課","停班"],
  description: "查詢停班課資訊，使用說明:!wcs",
  execute: async (args, client, event) => {
    try{
      const wcsData = await getData()
      const citys = args[0]
      const $ = cheerio.load(wcsData.data);
      const updateTimeText = $(".Content_Updata h4").text().trim();

      const regex = /更新時間：(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2})/;
      const match = updateTimeText.match(regex);

      let updateTime = "";
      if (match) {
        updateTime = match[1];
      }

      const tableBody = $(".Table_Body");

      const results = [];

      tableBody.find("tr").each((index, element) => {
        const cityName = $(element)
          .find('td[headers="city_Name"] font')
          .text()
          .trim();
        const suspensionInfo = $(element)
          .find('td[headers="StopWorkSchool_Info"] font')
          .text()
          .trim();

        if (cityName !== "" && suspensionInfo !== "") {
          const statuses = suspensionInfo.split("。").slice(0, -1).map((status) => {
          const emoji = status.includes("停止") && !status.includes("未達") ? "🔴" : "🟢";
          return `${emoji} ${status.trim()}`;
        }).filter(status => status).join("\n");
    
          results.push({ city: cityName, suspension: statuses });
        }
      });

      let messageText = `⚠️ **天然災害停止上班及上課情形**\n\n`;

      if (results.length === 0) {
        messageText += `✅ 目前無停班停課訊息。\n`;
      } else {
        if (citys) {
          const cityData = results.find(result => result.city === citys);
          if (cityData) {
            messageText = `⚠️ **${citys} 天然災害停止上班及上課情形**\n\n`;
            messageText += `📍 **${cityData.city}**\n🏫 ${cityData.suspension}`;
          } else {
            messageText = `⚠️ **${citys} 天然災害停止上班及上課情形**\n\n`;
            messageText += `✅ 目前 **${citys} 無停班課訊息**`;
          }
        } else {
          for (const { city, suspension } of results) {
            messageText += `📍 **${city}**\n🏫 ${suspension}\n\n`;
          }
        }
      }

      messageText += `\n🕒 **更新時間:** ${updateTime}\n**資料來源:** 行政院人事行政總處`;

      const textMessage = {
        type: "text",
        text: messageText
      };

      await client.replyMessage(event.replyToken, textMessage);

    } catch (error) {
      // await client.replyMessage(event.replyToken, {
      //   type: "text",
      //   text: "❌發生錯誤，請稍後再試"
      // });
      console.log(error)
    }
  },
};

async function getData() {
  return axios.get(
    `https://www.dgpa.gov.tw/typh/daily/nds.html`
  );
}