const { default: axios } = require("axios");
const CWA_API = process.env.CWA_API

module.exports = {
  name: "station",
  aliases: ["s","測站"],
  description: "查詢測站天氣資訊，使用說明:!s <測站名>",
  execute: async (args, client, event) => {
    try{
      const response = await getDataNO(args[0]);
      let apiData = response.data.records.Station[0].WeatherElement;
      let apiInfo = response.data.records.Station[0];
      let currentTemp = apiData.AirTemperature;
      let wind = apiData.WindSpeed;
      let pressure = apiData.AirPressure;
      let cloudness = apiData.Weather;
      let country = apiInfo.StationName;
      let rh = apiData.RelativeHumidity;
      let tempH = apiData.DailyExtreme.DailyHigh.TemperatureInfo.AirTemperature;
      let tempL = apiData.DailyExtreme.DailyLow.TemperatureInfo.AirTemperature;
      let at = calculateWindChill(currentTemp, wind ,rh)
      let messageText = `📍 測站：${country}\n\n` +
        `☁️ 天氣概況：${cloudness}\n`+
        `🌡 目前氣溫：${currentTemp}\u00B0 C\n` +
        `🌡 體感溫度：${at}\u00B0 C\n` +
        `🔥 今日最高溫：${tempH}\u00B0 C\n` +
        `❄️ 今日最低溫：${tempL}\u00B0 C\n` +
        `💨 風速：${wind} m/s\n` +
        `💧 相對濕度：${rh} %\n` +
        `🌡 氣壓：${pressure} hpa\n`
      messageText += `\n資料來源:CWA`

      const textMessage = {
        type: "text",
        text: messageText
      };
      await client.replyMessage(event.replyToken, textMessage);

    } catch (error) {
      try{
        const response = await getDataNT(args[0]);
        let apiData = response.data.records.Station[0].WeatherElement;
        let apiInfo = response.data.records.Station[0];
        let currentTemp = apiData.AirTemperature;
        let wind = apiData.WindSpeed;
        let pressure = apiData.AirPressure;
        let cloudness = apiData.Weather;
        let country = apiInfo.StationName;
        let rh = apiData.RelativeHumidity;
        let tempH = apiData.DailyExtreme.DailyHigh.TemperatureInfo.AirTemperature;
        let tempL = apiData.DailyExtreme.DailyLow.TemperatureInfo.AirTemperature;
        let at = calculateWindChill(currentTemp, wind ,rh)
        let vb = apiData.VisibilityDescription;
        let uv = apiData.UVIndex;
        let messageText = `📍 測站：${country}\n\n` +
        `☁️ 天氣概況：${cloudness}\n`+
        `🌡 目前氣溫：${currentTemp}\u00B0 C\n` +
        `🌡 體感溫度：${at}\u00B0 C\n` +
        `🔥 今日最高溫：${tempH}\u00B0 C\n` +
        `❄️ 今日最低溫：${tempL}\u00B0 C\n` +
        `💨 風速：${wind} m/s\n` +
        `💧 相對濕度：${rh} %\n` +
        `🌡 氣壓：${pressure} hpa\n`
        messageText +=`👀 能見度：${vb} km\n`
        messageText +=`🌞 紫外線指數：${uv} 級\n`
        messageText +=`\n資料來源:CWA`
        
        const textMessage = {
        type: "text",
        text: messageText
      };
      await client.replyMessage(event.replyToken, textMessage);
      } catch (error) {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "❌發生錯誤，請檢查輸入或稍後再試"
        });
        console.log(error)
      }
    }
  },
};

async function getDataNO(args) {
  return axios.get(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${CWA_API}&limit=1&StationName=${args}`
  )
}

async function getDataNT(args) {
  return axios.get(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${CWA_API}&limit=1&StationName=${args}`
  )
}

function calculateWindChill(temperature, windSpeedMs, relativeHumidity) {
    var e = (relativeHumidity / 100) * 6.105 * Math.exp((17.27 * temperature) / (237.7 + temperature));
    var apparentTemperature = 1.04 * temperature + 0.2 * e - 0.65 * windSpeedMs - 2.7;
    apparentTemperature = Math.round(apparentTemperature * 10) / 10;
    return apparentTemperature;
}
