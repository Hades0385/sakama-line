const axios = require('axios');

const MOE_API = process.env.MOE_API

module.exports = {
  name: "airquality",
  aliases: ["aq","空品"],
  description: "查詢空氣品質，使用說明:!aq <測站名>",
  execute: async (args, client, event) => {
    try{
      const aqData = await getData(sites[args[0]],MOE_API)
      const apiData = aqData.data.records[0]
      let dataTime = apiData.publishtime
      let sitename = apiData.sitename
      let county = apiData.county
      let aqi = apiData.aqi
      let status = apiData.status
      let so2 = apiData.so2
      let co = apiData.co
      let o3 = apiData.o3
      let pm10 = apiData.pm10
      let pm25 = apiData["pm2.5"]
      let no2 = apiData.no2

      let messageText = `🌍 空氣品質資訊\n\n` +
        `📍 監測站: ${county} / ${sitename}\n` +
        `🕒 時間: ${dataTime}\n\n` +
        `🌫️ AQI 指數: ${aqi}\n` +
        `📊 狀態: ${status}\n` +
        `----------------------\n` +
        `🌬️ PM2.5: ${pm25} μg/m³\n` +
        `🌪️ PM10: ${pm10} μg/m³\n` +
        `🟢 臭氧 (O3): ${o3} ppb\n` +
        `🛑 一氧化碳 (CO): ${co} ppm\n` +
        `🟡 二氧化硫 (SO2): ${so2} ppb\n` +
        `🔴 二氧化氮 (NO2): ${no2} ppb\n\n` +
        `資料來源: MOE`;

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

const sites = {
  "基隆" : "0" ,
  "汐止" : "1" ,
  "萬里" : "2" ,
  "新店" : "3" ,
  "土城" : "4" ,
  "板橋" : "5" ,
  "新莊" : "6" ,
  "菜寮" : "7" ,
  "林口" : "8" ,
  "淡水" : "9" ,
  "士林" : "10" ,
  "中山" : "11" ,
  "萬華" : "12" ,
  "古亭" : "13" ,
  "松山" : "14" ,
  "大同" : "15" ,
  "桃園" : "16" ,
  "大園" : "17" ,
  "觀音" : "18" ,
  "平鎮" : "19" ,
  "龍潭" : "20" ,
  "湖口" : "21" ,
  "竹東" : "22" ,
  "新竹" : "23" ,
  "頭份" : "24" ,
  "苗栗" : "25" ,
  "三義" : "26" ,
  "豐原" : "27" ,
  "沙鹿" : "28" ,
  "大里" : "29" ,
  "忠明" : "30" ,
  "西屯" : "31" ,
  "彰化" : "32" ,
  "線西" : "33" ,
  "二林" : "34" ,
  "南投" : "35" ,
  "斗六" : "36" ,
  "崙背" : "37" ,
  "新港" : "38" ,
  "朴子" : "39" ,
  "臺西" : "40" ,
  "嘉義" : "41" ,
  "新營" : "42" ,
  "善化" : "43" ,
  "安南" : "44" ,
  "臺南" : "45" ,
  "美濃" : "46" ,
  "橋頭" : "47" ,
  "仁武" : "48" ,
  "鳳山" : "49" ,
  "大寮" : "50" ,
  "林園" : "51" ,
  "楠梓" : "52" ,
  "左營" : "53" ,
  "前金" : "54" ,
  "前鎮" : "55" ,
  "小港" : "56" ,
  "屏東" : "57" ,
  "潮州" : "58" ,
  "恆春" : "59" ,
  "臺東" : "60" ,
  "花蓮" : "61" ,
  "陽明" : "62" ,
  "宜蘭" : "63" ,
  "冬山" : "64" ,
  "三重" : "65" ,
  "中壢" : "66" ,
  "竹山" : "67" ,
  "永和" : "68" ,
  "復興" : "69" ,
  "埔里" : "70" ,
  "馬祖" : "71" ,
  "金門" : "72" ,
  "馬公" : "73" ,
  "關山" : "74" ,
  "麥寮" : "75" ,
  "富貴角" : "76" ,
  "大城" : "77" ,
  "彰化" : "78" ,
  "高雄" : "79" ,
  "臺南" : "80" ,
  "屏東" : "81" ,
  "新北" : "82" ,
  "大甲" : "83" ,
  "屏東(枋山)" : "84" ,
}

async function getData(site,MOE_API){
  return axios.get(`https://data.moenv.gov.tw/api/v2/aqx_p_432?language=zh&offset=${site}&api_key=${MOE_API}`)
}