const axios = require('axios');
const moment = require('moment');

module.exports = {
  name: "weather",
  aliases: ["w","天氣"],
  description: "查詢鄉鎮市區的天氣資訊，使用說明:!w <鄉鎮市區>",
  execute: async (args, client, event) => {
    try{
      const dataId = await getDataId(args)
      const { year, month, day, Hour, Minute } = getDateTime();
      const time = `${year}${month}${day}${Hour}`
      const weatherData = await getWeatherData(dataId[0], time)
      const gtData = wdataToJSON(weatherData.data)[dataId[1]]
      const W50Data = await getIfonData()
      const w50 = idataToJSON(W50Data.data)[dataId[0]]
      

      let temp = gtData.C_T
      let at = gtData.C_AT
      let rh = gtData.RH
      let rain = gtData.Rain
      let sr = gtData.Sunrise
      let ss = gtData.Sunset

      await client.replyMessage(event.replyToken, {
        type: "text",
        text: `📍 ${args}\n🌡️ 目前氣溫 ${temp} \u00B0 C\n\n🌡️ 體感溫度: ${at}\u00B0 C\n💧 相對溼度: ${rh}%\n🌧️時雨量: ${rain}mm\n🌄日出時間: ${sr}\n🌆日落時間: ${ss}\n\n資料來源: CWA`
      });
      
    } catch (error) {
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "❌發生錯誤，無法取得資訊，請檢查輸入是否正確"
      });
      console.log(error)
    }
  },
};


async function getWeatherData(twonID, time) {
  return axios.get(
    `https://www.cwa.gov.tw/Data/js/GT/TableData_GT_T_${twonID}.js?T=${time}`
  );
}

async function getIfonData() {
  return axios.get(
    `https://www.cwa.gov.tw/Data/js/fcst/W50_Data.js`
  );
}

async function getTownId() {
  return axios.get(
    "https://www.cwa.gov.tw/Data/js/info/Info_Town.js?v=20200817", {headers: {'Accept-Charset': 'utf-8'}}
  );
}

function wdataToJSON(data) { //將天氣資料轉為JSON
  try {
    const gtMatch = data.match(/var\s+GT\s*=\s*({[\s\S]*?});/);
    if (gtMatch && gtMatch[1]) {
      const GT = JSON.parse(gtMatch[1].replace(/'/g, '"'));
      return GT
    } else {
      console.error("無法找到 GT 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

function idataToJSON(data) { //將w50資料轉為JSON
  try {
    const jsonStr = data.replace(/^var W50_County=/, '').replace(/;$/, '').replace(/'/g, '"');
    if (jsonStr) {
      try {
        const W50_County = JSON.parse(jsonStr);
      return W50_County
      } catch (parseError) {
        console.error('JSON 解析錯誤:', parseError);
      }
    } else {
      console.error("無法找到 w50 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

function tdataToJSON(data) { //將鄉鎮ID資料轉為JSON
  try {
    const itMatch = data.match(/var\s+Info_Town\s*=\s*({[\s\S]*?});/);
    if (itMatch && itMatch[1]) {
      const Info_Town = JSON.parse(itMatch[1].replace(/'/g, '"'));
      return Info_Town
    } else {
      console.error("無法找到 info_twon 物件");
    }
  } catch (error) {
    console.error("請求錯誤:", error);
  }
}

async function findCityId(townshipName,cityData) {// 尋找鄉鎮ID
  for (const [cityCode, townships] of Object.entries(cityData)) {
      const township = townships.find(t => t.Name.C === townshipName);
      if (township) {
          return [cityCode, township.ID];
      }
  }
  return null; 
}

async function getDataId(arg) {//取得城市及鄉鎮ID
  try {
    const response = await getTownId();
    const data = response.data;
    let twonId = tdataToJSON(data);
    let dataId = findCityId(arg[0], twonId);
    return dataId;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; 
  }
}

function getDateTime() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  let Hour = today.getHours();
  let currentMinute = today.getMinutes();

  if (currentMinute < 0) {
      currentMinute += 60;
      Hour -= 1;
      if (Hour < 0) {
          Hour = 23;
          day -= 1;
          if (day < 1) {
              month -= 1;
              if (month < 1) {
                  year -= 1;
                  month = 12;
              }
              const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();
              day = lastDayOfPreviousMonth;
          }
      }
  }

  month = String(month).padStart(2, '0');
  day = String(day).padStart(2, '0');
  Hour = String(Hour).padStart(2, '0');
  let Minute = String(Math.floor(currentMinute / 10) * 10).padStart(2, '0');

  return {year,month,day,Hour,Minute};
}