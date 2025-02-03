const axios = require('axios')

module.exports = {
  name: "uvi",
  aliases: ["uv","紫外線"],
  description: "查詢紫外線資訊，使用說明:!uv <縣市名>",
  execute: async (args, client, event) => {
    try{
      const uviData = await getUviData()
      let siteId = uviSite[args] 
      let dataTime = getDataTime(uviData.data)
      let sitename = uviStations(uviData.data)[siteId].Name.C
      let county = args
      let dataLength = dataToJson(uviData.data)[siteId]
      let uvi = dataLength[dataLength.length-1].y
      let uvilv = uvilevel(uvi)
      let sg = suggestion[uvilv]
      let messageText = `☀️ 紫外線資訊\n\n`;
        messageText += `📍 地區: ${county}\n`;
        messageText += `🕒 資料時間: ${dataTime}\n\n`;
        messageText += `🌞 UVI 指數: ${uvi}\n`;
        messageText += `⚠️ 等級: ${uvilv}\n\n`;
        messageText += `📢 建議:\n> ${description[uvilv]}\n${sg}\n\n`;
        messageText += `資料來源: CWA (測站: ${sitename})`;

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


const suggestion = {
  "低量級" : '不需要任何防護保護 ',
  "中量級" : '帽子/陽傘+防曬液+太陽眼鏡+儘量待在陰涼處. ',
  "高量級" : '帽子/陽傘+防曬液+太陽眼鏡+儘量待在陰涼處. ',
  "過量級" : '帽子/陽傘+防曬液+太陽眼鏡+陰涼處+長袖衣物+上午十時至下午二時最好不外出.',
  "危險級" : '帽子/陽傘+防曬液+太陽眼鏡+陰涼處+長袖衣物+上午十時至下午二時最好不外出.',
}

function uvilevel(uvi) {
  if (uvi<=2) {
    let level = "低量級";
    return level
  }else if (uvi<=5){
    let level = "中量級";
    return level
  }else if (uvi<=7){
    let level = "高量級";
    return level
  }else if (uvi<=10){
    let level = "過量級";
    return level
  }else{
    let level = "危險級";
    return level
  }
}

async function getUviData() {
  return axios.get(
    `https://www.cwa.gov.tw/Data/js/OBS_UVI_chart.js`
  );
}

function dataToJson(data) {
  try {
    const uviMatch = data.match(/var\s+UVI\s*=\s*({[\s\S]*?})(?:\s*var\s+\w+\s*=|\s*$)/);
    if (uviMatch && uviMatch[1]) {
      const UVI = JSON.parse(uviMatch[1].replace(/'/g, '"').replace(/(\b\w+\b):/g, '"$1":'));
      return UVI
    } else {
      console.error("無法找到 UVI 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

function getDataTime(data) {
  try {
    const timeMatch = data.match(/var\s+Time_To\s*=\s*"([^"]*)";/);
    if (timeMatch && timeMatch[1]) {
      const time = timeMatch[1].replace(/'/g, '"');
      return time
    } else {
      console.error("無法找到 Time_To 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

function uviStations(data) {
  try {
    const siteMatch = data.match(/var\s+Info_UVI_Stations\s*=\s*({[\s\S]*?})(?:\s*var\s+\w+\s*=|\s*$)/);
    if (siteMatch && siteMatch[1]) {
      const site = JSON.parse(siteMatch[1].replace(/'/g, '"'));
      return site
    } else {
      console.error("無法找到 Info_UVI_Stations 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

const uviSite = {
  '臺北市':'46692',
  '新北市':'46688',
  '桃園市':'46705',
  '臺中市':'46749',
  '臺南市':'46741',
  '高雄市':'46744',
  '基隆市':'46694',
  '新竹市':'46757',
  '嘉義市':'46748',
  '宜蘭縣':'46708',
  '新竹縣':'46757',
  '苗栗縣':'46728',
  '彰化縣':'46727',
  '南投縣':'46765',
  '嘉義縣':'46748',
  '雲林縣':'46729',
  '屏東縣':'46759',
  '臺東縣':'46766',
  '花蓮縣':'46699',
  '澎湖縣':'46735',
  '金門縣':'46711',
  '連江縣':'46799',
}

const description = {
  "低量級" : '對於一般人無危險 ',
  "中量級" : '無保護暴露於陽光中有較輕傷害的風險',
  "高量級" : '30分鐘內可能曬傷,無保護暴露於陽光中有很大傷害的風險',
  "過量級" : '20分鐘內可能曬傷,暴露於陽光中有極高風險',
  "危險級" : '10分鐘內可能曬傷,暴露於陽光中極其危險',
}