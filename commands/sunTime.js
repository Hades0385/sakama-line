const axios = require('axios')
const CWA_API = process.env.CWA_API

module.exports = {
  name: "sun",
  aliases: ["st","日出","日落"],
  description: "查詢日出日落時間，使用說明:!st <縣市>",
  execute: async (args, client, event) => {
    try{
      const  { year, month, day, Hour, Minute }  = getDateTime();
      const time = `${year}-${month}-${day}`
      const response = await getData(args[0],time)
      let apiData = response.data.records.locations.location[0].time[0];
      let apiInfo = response.data.records.locations.location[0];
      let data = apiData.Date;
      let fltime = apiData.BeginCivilTwilightTime;
      let lltime = apiData.EndCivilTwilightTime;
      let sunr = apiData.SunRiseTime;
      let suns = apiData.SunSetTime;
      let country = apiInfo.CountyName;
      
      let messageText = `☀️ ${country} 日出日落時間\n` +
        `🕒 資料時間: ${data}\n\n` +
        `🌅 第一道曙光: ${fltime}\n` +
        `🌄 日出時間: ${sunr}\n` +
        `🌆 日落時間: ${suns}\n` +
        `🌇 最後一道曙光: ${lltime}\n\n` +
        `資料來源: CWA`;

      const textMessage = {
        type: "text",
        text: messageText
      };
      await client.replyMessage(event.replyToken, textMessage);

    } catch (error) {
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "❌發生錯誤，請稍後再試"
      });
      console.log(error)
    }
  },
};

async function getData(args,todayData) {
  return axios.get(`
  https://opendata.cwa.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=${CWA_API}&limit=1&format=JSON&CountyName=${args}&Date=${todayData}
  `);
}

function getDateTime() {
  const today = new Date();

  const utcYear = today.getUTCFullYear();
  const utcMonth = today.getUTCMonth(); 
  const utcDay = today.getUTCDate();
  let utcHour = today.getUTCHours();
  let utcMinute = today.getUTCMinutes();

  if (utcMinute < 0) {
    utcMinute += 60;
    utcHour -= 1;
    if (utcHour < 0) {
      utcHour = 23;
      utcDay -= 1;
      if (utcDay < 1) {
        const lastDayOfPreviousMonth = new Date(utcYear, utcMonth, 0).getDate();
        utcDay = lastDayOfPreviousMonth;
        if (utcMonth === 0) {
          utcMonth = 11;
          utcYear -= 1;
        } else {
          utcMonth -= 1;
        }
      }
    }
  }

  utcHour += 8;
  if (utcHour >= 24) {
    utcHour -= 24;
    utcDay += 1;
    if (utcDay > new Date(utcYear, utcMonth + 1, 0).getDate()) {
      utcDay = 1;
      utcMonth += 1;
      if (utcMonth > 11) {
        utcMonth = 0;
        utcYear += 1;
      }
    }
  }

  const year = String(utcYear);
  const month = String(utcMonth + 1).padStart(2, '0');
  const day = String(utcDay).padStart(2, '0');
  const Hour = String(utcHour).padStart(2, '0');
  let Minute = String(Math.floor(utcMinute / 10) * 10).padStart(2, '0');

  return { year, month, day, Hour, Minute };
}