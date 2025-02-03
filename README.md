# Sakama-Line
> sakama的 Line 版本，提供包括鄉鎮天氣、天氣預報、降雨預估等功能。
## 主要功能
 - 當前鄉鎮市區氣溫
 - 鄉鎮天氣預報
 - 未來一小時降雨預估
 - 各縣市停班課訊息
 - 雷達迴波圖
 - 當前空氣品質
 - 當前縣市紫外線等級

## 環境
1. 下載並安裝 [Node.js](https://nodejs.org/en) `v18` 或`更新版本`
2. 開啟 `.env.example` 檔案並將其重新命名為 `.env` 並修改配置
```env
CHANNEL_ACCESS_TOKEN=#你的_LINE_頻道存取權杖
CHANNEL_SECRET=#你的_LINE_頻道密鑰
PORT=3000
COMMAND_PREFIX=!
CWA_API=#中央氣象署API
MOE_API=#環境部API
```
3. 安裝必需的套件
```sh
$ npm install
```

## 執行
在終端輸入以下指令來啟動伺服器
```sh
$ node .
```
