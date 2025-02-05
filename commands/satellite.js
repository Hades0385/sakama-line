module.exports = {
  name: "satellite",
  aliases: ["sa","衛星"],
  description: "查詢衛星影像，使用說明:!sa",
  execute: async (args, client, event) => {
    try{
      const { year, month, day, Hour, Minute } = getDateTime();
      
      const imageMessage = {
        type: "image",
        originalContentUrl: `https://www.cwa.gov.tw/Data/satellite/LCC_IR1_CR_2750/LCC_IR1_CR_2750-${year}-${month}-${day}-${Hour}-${Minute}.jpg`,
        previewImageUrl: `https://www.cwa.gov.tw/Data/satellite/LCC_IR1_CR_2750/LCC_IR1_CR_2750-${year}-${month}-${day}-${Hour}-${Minute}.jpg`
      };
      
      await client.replyMessage(event.replyToken, imageMessage);

    } catch (error) {
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "❌發生錯誤，請稍後再試"
      });
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
  let utcMinute = today.getUTCMinutes() - 20;

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