const axios = require('axios');
const CWA_API = process.env.CWA_API

module.exports = {
  name: "earthquake",
  aliases: ["e","地震"],
  description: "查詢最近的有感地震報告，使用說明!e",
  execute: async (args, client, event) => {
    try{
      const response = await getData();
      let apiData = response.data.records.Earthquake[0].EarthquakeInfo;
      let apiInfo = response.data.records.Earthquake[0];
      let data = apiData.OriginTime;
      let fd = apiData.FocalDepth; //震央深度
      let nl = apiData.Epicenter.EpicenterLatitude; //北緯
      let el = apiData.Epicenter.EpicenterLongitude; //東經
      let location = apiData.Epicenter.Location
      let rm = apiInfo.ReportRemark
      let eno = apiInfo.EarthquakeNo
      let mv = apiData.EarthquakeMagnitude.MagnitudeValue

      let messageText = `📢 顯著有感地震報告\n`+ 
      `📝地震編號 NO.${eno}\n`+
      `📅 時間：${data}\n`+
      `📍 位置：${location}\n`+
      `🌍 北緯：${nl} 東經：${el}\n`+  
      `地震深度：${fd} 公里\n`+  
      `芮氏規模：${mv}\n\n`+  
      `${rm}`;
      
      const imageMessage = {
        type: "image",
        originalContentUrl: apiInfo.ReportImageURI,
        previewImageUrl: apiInfo.ReportImageURI
      };
      const textMessage = {
        type: "text",
        text: messageText
      };

      await client.replyMessage(event.replyToken, [textMessage, imageMessage]);

    } catch (error) {
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "❌發生錯誤，請稍後再試"
      });
      console.log(error)
    }
  },
};

async function getData() {
  return axios.get(`
  https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=${CWA_API}&limit=1
  `);
}