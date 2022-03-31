const axios = require('axios').default;
const Captcha = require('@infosimples/node_two_captcha');
const { MnemonicKey } = require ( '@terra-money/terra.js' ) ;
const HttpsProxyAgent = require('https-proxy-agent');
const dotenv = require('dotenv');
dotenv.config();
var agent = new HttpsProxyAgent(process.env.PROXY);

async function faucetRequest(walletAddress, response) {
  await axios({
    "method": "POST",
    "url": "https://faucet.terra.dev/claim",
    "headers": {
      "Authority": "faucet.terra.dev",
      "Sec-Ch-Ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Sec-Ch-Ua-Mobile": "?0",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
      "Sec-Ch-Ua-Platform": "\"macOS\"",
      "Origin": "https://faucet.terra.money",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Referer": "https://faucet.terra.money/",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "Accept-Encoding": "gzip"
    },
    "data": {
      "address": walletAddress,
      "response": response.text,
      "denom": "uluna",
      "lcd_url": "https://bombay-lcd.terra.dev",
      "chain_id": "bombay-12"
    },
    httpsAgent: agent,
  }).catch((error) => {
    console.log('terra Error: ', error.message);
    // faucetRequest(walletAddress, response);
  });
}

async function faucet(captchaKey, index) {
  const mk = new MnemonicKey({
    mnemonic: process.env.MNEMONIC,
    index,
  });
  const walletAddress = mk.accAddress;
  await client.decodeRecaptchaV2({
    googlekey: captchaKey,
    pageurl: 'https://faucet.terra.money',
  }).then(async function(response) {
    console.log(response.text)
    await faucetRequest(walletAddress, response);
  }).catch((error) => {
    console.log('2captcha Error: ', error.message);
  });

  console.log(index, walletAddress);
  if (index < process.env.MAX_INDEX - 0) {
    faucet(captchaKey, index + 1);
  }
}

client = new Captcha(process.env.CAPTCHA_KEY , {
  timeout: 120000,
  polling: 5000,
  throwErrors: false});

faucet('6Ld4w4cUAAAAAJceMYGpOTpjiJtMS_xvzOg643ix', process.env.START_INDEX - 0);

