module.exports = {
  name: "radar",
  aliases: ["r","雷達"],
  description: "查詢雷達迴波圖，使用說明:!r",
  execute: async (args, client, event) => {
    try{
      const { year, month, day, Hour, Minute } = getDateTime();

      const imageMessage = {
        type: "image",
        originalContentUrl: `https://www.cwa.gov.tw/Data/radar/CV1_TW_1000_${year}${month}${day}${Hour}${Minute}.png`,
        previewImageUrl: `https://www.cwa.gov.tw/Data/radar/CV1_TW_1000_${year}${month}${day}${Hour}${Minute}.png`
      };
      
      await client.replyMessage(event.replyToken, imageMessage);
      
    } catch (error) {
      // await client.replyMessage(event.replyToken, {
      //   type: "text",
      //   text: "❌發生錯誤，請稍後再試"
      // });
      console.log(error)
    }
  },
};

function getDateTime() {
  const today = new Date();

  const utcYear = today.getUTCFullYear();
  const utcMonth = today.getUTCMonth(); 
  const utcDay = today.getUTCDate();
  let utcHour = today.getUTCHours();
  let utcMinute = today.getUTCMinutes() - 10;

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
