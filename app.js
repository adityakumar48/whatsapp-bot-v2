const { Client, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult, query } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fs = require('fs');
const { phoneNumberFormatter } = require('./helpers/formatter');
const axios = require('axios');
const port = process.env.PORT || 8000;
const fetch = require('node-fetch');
const { parse } = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const api = require('novelcovid');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const SESSION_FILE_PATH = './whatsapp-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
  },
  session: sessionCfg
});

client.on('message', msg => {
  if (msg.body == '-ping') {
    msg.reply('pong');
  } else if (msg.body == 'good morning') {
    msg.reply('Good Morning');
  } else if (msg.body == '-groups') {
    client.getChats().then(chats => {
      const groups = chats.filter(chat => chat.isGroup);

      if (groups.length == 0) {
        msg.reply('You have no group yet.');
      } else {
        let replyMsg = '*YOUR GROUPS*\n\n';
        groups.forEach((group, i) => {
          replyMsg += `ID: ${group.id._serialized}\nName: ${group.name}\n\n`;
        });
        replyMsg += '_You can use the group id to send a message to the group._'
        msg.reply(replyMsg);
      }
    });
  } else if (msg.body == '-hi'){
    msg.reply('Hi')
  } else if (msg.body == '-covid'){
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res => res.json())
    .then(text => {
      msg.reply(`*╒-----Covid19 Cases-----╕*

*Total Cases :* ${text.cases}
*Active Cases :* ${text.active}
*Recovered Cases :* ${text.recovered}
*Death Cases :* ${text.deaths}
*Critical Cases :* ${text.critical}
*Today Cases :* ${text.todayCases}
*Today Death Cases :* ${text.todayDeaths}
*Today Recovered Cases :* ${text.todayRecovered}
*Population :* ${text.population}
*Total Tests :* ${text.tests}
`)
    })
  } else if (msg.body == `-covid afghanistan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Afghanistan Covid19 Cases-----╕*

*Country Name :* ${con[0].country}    
*Total Cases :* ${con[0].cases}
*Active Cases :* ${con[0].active}
*Recovered Cases :* ${con[0].recovered}
*Death Cases :* ${con[0].deaths}
*Critical Cases :* ${con[0].critical}
*Population :* ${con[0].population}
*Total Tests :* ${con[0].tests}
`)})
  } else if (msg.body == `-covid albania`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Albania Covid19 Cases-----╕*

*Country Name :* ${con[1].country}    
*Total Cases :* ${con[1].cases}
*Active Cases :* ${con[1].active}
*Recovered Cases :* ${con[1].recovered}
*Death Cases :* ${con[1].deaths}
*Critical Cases :* ${con[1].critical}
*Population :* ${con[1].population}
*Total Tests :* ${con[1].tests}
`)})
  } else if (msg.body == `-covid algeria`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----algeria Covid19 Cases-----╕*

*Country Name :* ${con[2].country}    
*Total Cases :* ${con[2].cases}
*Active Cases :* ${con[2].active}
*Recovered Cases :* ${con[2].recovered}
*Death Cases :* ${con[2].deaths}
*Critical Cases :* ${con[2].critical}
*Population :* ${con[2].population}
*Total Tests :* ${con[2].tests}
`)})
  } else if (msg.body == `-covid andorra`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Andorra Covid19 Cases-----╕*

*Country Name :* ${con[3].country}    
*Cases :* ${con[3].cases}
*Active Cases :* ${con[3].active}
*Recovered Cases :* ${con[3].recovered}
*Death Cases :* ${con[3].deaths}
*Critical Cases :* ${con[3].critical}
*Population :* ${con[3].population}
*Total Tests :* ${con[3].tests}
`)})
  } else if (msg.body == `-covid angola`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Angola Covid19 Cases-----╕*

*Country Name :* ${con[4].country}  
*Total Cases :* ${con[4].cases}
*Active Cases :* ${con[4].active}
*Recovered Cases :* ${con[4].recovered}
*Death Cases :* ${con[4].deaths}
*Critical Cases :* ${con[4].critical}
*Population :* ${con[4].population}
*Total Tests :* ${con[4].tests}
`)})
  } else if (msg.body == `-covid anguilla`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Anguilla Covid19 Cases-----╕*

*Country Name :* ${con[5].country} 
*Total Cases :* ${con[5].cases}
*Active Cases :* ${con[5].active}
*Recovered Cases :* ${con[5].recovered}
*Death Cases :* ${con[5].deaths}
*Critical Cases :* ${con[5].critical}
*Population :* ${con[5].population}
*Total Tests :* ${con[5].tests}
`)})
  } else if (msg.body == `-covid antiguaandbarbuda`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Antigua and Barbuda Covid19 Cases-----╕*

*Country Name :* ${con[6].country}    
*Total Cases :* ${con[6].cases}
*Active Cases :* ${con[6].active}
*Recovered Cases :* ${con[6].recovered}
*Death Cases :* ${con[6].deaths}
*Critical Cases :* ${con[6].critical}
*Population :* ${con[6].population}
*Total Tests :* ${con[6].tests}
`)})
  } else if (msg.body == `-covid argentina`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Argentina Covid19 Cases-----╕*

*Country Name :* ${con[7].country}    
*Total Cases :* ${con[7].cases}
*Active Cases :* ${con[7].active}
*Recovered Cases :* ${con[7].recovered}
*Death Cases :* ${con[7].deaths}
*Critical Cases :* ${con[7].critical}
*Population :* ${con[7].population}
*Total Tests :* ${con[7].tests}
`)})
  } else if (msg.body == `-covid armenia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Armenia Covid19 Cases-----╕*

*Country Name :* ${con[8].country}    
*Total Cases :* ${con[8].cases}
*Active Cases :* ${con[8].active}
*Recovered Cases :* ${con[8].recovered}
*Death Cases :* ${con[8].deaths}
*Critical Cases :* ${con[8].critical}
*Population :* ${con[8].population}
*Total Tests :* ${con[8].tests}
`)})
  } else if (msg.body == `-covid aruba`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Australia Covid19 Cases-----╕*

*Country Name :* ${con[9].country}    
*Total Cases :* ${con[9].cases}
*Active Cases :* ${con[9].active}
*Recovered Cases :* ${con[9].recovered}
*Death Cases :* ${con[9].deaths}
*Critical Cases :* ${con[9].critical}
*Population :* ${con[9].population}
*Total Tests :* ${con[9].tests}
`)})
  } else if (msg.body == `-covid australia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Afghanistan Covid19 Cases-----╕*

*Country Name :* ${con[10].country}    
*Total Cases :* ${con[10].cases}
*Active Cases :* ${con[10].active}
*Recovered Cases :* ${con[10].recovered}
*Death Cases :* ${con[10].deaths}
*Critical Cases :* ${con[10].critical}
*Population :* ${con[10].population}
*Total Tests :* ${con[10].tests}
`)})
  } else if (msg.body == `-covid austria`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Austria Covid19 Cases-----╕*

*Country Name :* ${con[11].country}    
*Total Cases :* ${con[11].cases}
*Active Cases :* ${con[11].active}
*Recovered Cases :* ${con[11].recovered}
*Death Cases :* ${con[11].deaths}
*Critical Cases :* ${con[11].critical}
*Population :* ${con[11].population}
*Total Tests :* ${con[11].tests}
`)})
  } else if (msg.body == `-covid azerbaijan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Azerbaijan Covid19 Cases-----╕*

*Country Name :* ${con[12].country}   
*Total Cases :* ${con[12].cases}
*Active Cases :* ${con[12].active}
*Recovered Cases :* ${con[12].recovered}
*Death Cases :* ${con[12].deaths}
*Critical Cases :* ${con[12].critical}
*Population :* ${con[12].population}
*Total Tests :* ${con[12].tests}
`)})
  } else if (msg.body == `-covid bahamas`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Bahamas Covid19 Cases-----╕*

*Country Name :* ${con[13].country}   
*Total Cases :* ${con[13].cases}
*Active Cases :* ${con[13].active}
*Recovered Cases :* ${con[13].recovered}
*Death Cases :* ${con[13].deaths}
*Critical Cases :* ${con[13].critical}
*Population :* ${con[13].population}
*Total Tests :* ${con[13].tests}
`)})
  } else if (msg.body == `-covid bahrain`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Bahrain Covid19 Cases-----╕*

*Country Name :* ${con[14].country}    
*Total Cases :* ${con[14].cases}
*Active Cases :* ${con[14].active}
*Recovered Cases :* ${con[14].recovered}
*Death Cases :* ${con[14].deaths}
*Critical Cases :* ${con[14].critical}
*Population :* ${con[14].population}
*Total Tests :* ${con[14].tests}
`)})
  } else if (msg.body == `-covid bangladesh`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Bangladesh Covid19 Cases-----╕*

*Country Name :* ${con[15].country}    
*Total Cases :* ${con[15].cases}
*Active Cases :* ${con[15].active}
*Recovered Cases :* ${con[15].recovered}
*Death Cases :* ${con[15].deaths}
*Critical Cases :* ${con[15].critical}
*Population :* ${con[15].population}
*Total Tests :* ${con[15].tests}
`)})
  } else if (msg.body == `-covid barbados`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Barbados Covid19 Cases-----╕*

*Country Name :* ${con[16].country}   
*Total Cases :* ${con[16].cases}
*Active Cases :* ${con[16].active}
*Recovered Cases :* ${con[16].recovered}
*Death Cases :* ${con[16].deaths}
*Critical Cases :* ${con[16].critical}
*Population :* ${con[16].population}
*Total Tests :* ${con[16].tests}
`)})
  } else if (msg.body == `-covid belarus`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Belarus Covid19 Cases-----╕*

*Country Name :* ${con[17].country}   
*Total Cases :* ${con[17].cases}
*Active Cases :* ${con[17].active}
*Recovered Cases :* ${con[17].recovered}
*Death Cases :* ${con[17].deaths}
*Critical Cases :* ${con[17].critical}
*Population :* ${con[17].population}
*Total Tests :* ${con[17].tests}
`)})
  } else if (msg.body == `-covid belgium`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Belgium Covid19 Cases-----╕*

*Country Name :* ${con[18].country}    
*Total Cases :* ${con[18].cases}
*Active Cases :* ${con[18].active}
*Recovered Cases :* ${con[18].recovered}
*Death Cases :* ${con[18].deaths}
*Critical Cases :* ${con[18].critical}
*Population :* ${con[18].population}
*Total Tests :* ${con[18].tests}
`)})
  } else if (msg.body == `-covid belize`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Belize Covid19 Cases-----╕*

*Country Name :* ${con[19].country}    
*Total Cases :* ${con[19].cases}
*Active Cases :* ${con[19].active}
*Recovered Cases :* ${con[19].recovered}
*Death Cases :* ${con[19].deaths}
*Critical Cases :* ${con[19].critical}
*Population :* ${con[19].population}
*Total Tests :* ${con[19].tests}
`)})
  } else if (msg.body == `-covid venin`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Benin Covid19 Cases-----╕*

*Country Name :* ${con[20].country}    
*Total Cases :* ${con[20].cases}
*Active Cases :* ${con[20].active}
*Recovered Cases :* ${con[20].recovered}
*Death Cases :* ${con[20].deaths}
*Critical Cases :* ${con[20].critical}
*Population :* ${con[20].population}
*Total Tests :* ${con[20].tests}
`)})
  } else if (msg.body == `-covid bermuda`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Bermuda Covid19 Cases-----╕*

*Country Name :* ${con[21].country}    
*Total Cases :* ${con[21].cases}
*Active Cases :* ${con[21].active}
*Recovered Cases :* ${con[21].recovered}
*Death Cases :* ${con[21].deaths}
*Critical Cases :* ${con[21].critical}
*Population :* ${con[21].population}
*Total Tests :* ${con[21].tests}
`)})
  } else if (msg.body == `-covid bhutan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Bhutan Covid19 Cases-----╕*

*Country Name :* ${con[22].country}   
*Total Cases :* ${con[22].cases}
*Active Cases :* ${con[22].active}
*Recovered Cases :* ${con[22].recovered}
*Death Cases :* ${con[22].deaths}
*Critical Cases :* ${con[22].critical}
*Population :* ${con[22].population}
*Total Tests :* ${con[22].tests}
`)})
  } else if (msg.body == `-covid bolivia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Bolivia Covid19 Cases-----╕*

*Country Name :* ${con[23].country}   
*Total Cases :* ${con[23].cases}
*Active Cases :* ${con[23].active}
*Recovered Cases :* ${con[23].recovered}
*Death Cases :* ${con[23].deaths}
*Critical Cases :* ${con[23].critical}
*Population :* ${con[23].population}
*Total Tests :* ${con[23].tests}
`)})
  } else if (msg.body == `-covid bosnia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Bosnia Covid19 Cases-----╕*

*Country Name :* ${con[24].country}   
*Total Cases :* ${con[24].cases}
*Active Cases :* ${con[24].active}
*Recovered Cases :* ${con[24].recovered}
*Death Cases :* ${con[24].deaths}
*Critical Cases :* ${con[24].critical}
*Population :* ${con[24].population}
*Total Tests :* ${con[24].tests}
`)})
  } else if (msg.body == `-covid botswana`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Botswana Covid19 Cases-----╕*

*Country Name :* ${con[25].country}   
*Total Cases :* ${con[25].cases}
*Active Cases :* ${con[25].active}
*Recovered Cases :* ${con[25].recovered}
*Death Cases :* ${con[25].deaths}
*Critical Cases :* ${con[25].critical}
*Population :* ${con[25].population}
*Total Tests :* ${con[25].tests}
`)})
  } else if (msg.body == `-covid brazil`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Brazil Covid19 Cases-----╕*

*Country Name :* ${con[26].country}   
*Total Cases :* ${con[26].cases}
*Active Cases :* ${con[26].active}
*Recovered Cases :* ${con[26].recovered}
*Death Cases :* ${con[26].deaths}
*Critical Cases :* ${con[26].critical}
*Population :* ${con[26].population}
*Total Tests :* ${con[26].tests}
`)})
  } else if (msg.body == `-covid britishvirginislands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----British Virgin Islands Covid19 Cases-----╕*

*Country Name :* ${con[27].country}   
*Total Cases :* ${con[27].cases}
*Active Cases :* ${con[27].active}
*Recovered Cases :* ${con[27].recovered}
*Death Cases :* ${con[27].deaths}
*Critical Cases :* ${con[27].critical}
*Population :* ${con[27].population}
*Total Tests :* ${con[27].tests}
`)})
  } else if (msg.body == `-covid brunei`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Brunei Covid19 Cases-----╕*

*Country Name :* ${con[28].country}   
*Total Cases :* ${con[28].cases}
*Active Cases :* ${con[28].active}
*Recovered Cases :* ${con[28].recovered}
*Death Cases :* ${con[28].deaths}
*Critical Cases :* ${con[28].critical}
*Population :* ${con[28].population}
*Total Tests :* ${con[28].tests}
`)})
  } else if (msg.body == `-covid bulgaria`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Bulgaria Covid19 Cases-----╕*

*Country Name :* ${con[29].country}   
*Total Cases :* ${con[29].cases}
*Active Cases :* ${con[29].active}
*Recovered Cases :* ${con[29].recovered}
*Death Cases :* ${con[29].deaths}
*Critical Cases :* ${con[29].critical}
*Population :* ${con[29].population}
*Total Tests :* ${con[29].tests}
`)})
  } else if (msg.body == `-covid burkinafaso`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Burkina Faso Covid19 Cases-----╕*

*Country Name :* ${con[30].country}   
*Total Cases :* ${con[30].cases}
*Active Cases :* ${con[30].active}
*Recovered Cases :* ${con[30].recovered}
*Death Cases :* ${con[30].deaths}
*Critical Cases :* ${con[30].critical}
*Population :* ${con[30].population}
*Total Tests :* ${con[30].tests}
`)})
  } else if (msg.body == `-covid burundi`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Burundi Covid19 Cases-----╕*

*Country Name :* ${con[31].country}   
*Total Cases :* ${con[31].cases}
*Active Cases :* ${con[31].active}
*Recovered Cases :* ${con[31].recovered}
*Death Cases :* ${con[31].deaths}
*Critical Cases :* ${con[31].critical}
*Population :* ${con[31].population}
*Total Tests :* ${con[31].tests}
`)})
  } else if (msg.body == `-covid caboverde`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Cabo Verde Covid19 Cases-----╕*

*Country Name :* ${con[32].country}   
*Total Cases :* ${con[32].cases}
*Active Cases :* ${con[32].active}
*Recovered Cases :* ${con[32].recovered}
*Death Cases :* ${con[32].deaths}
*Critical Cases :* ${con[32].critical}
*Population :* ${con[32].population}
*Total Tests :* ${con[32].tests}
`)})
  } else if (msg.body == `-covid cambodia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Cambodia Covid19 Cases-----╕*

*Country Name :* ${con[33].country}   
*Total Cases :* ${con[33].cases}
*Active Cases :* ${con[33].active}
*Recovered Cases :* ${con[33].recovered}
*Death Cases :* ${con[33].deaths}
*Critical Cases :* ${con[33].critical}
*Population :* ${con[33].population}
*Total Tests :* ${con[33].tests}
`)})
  } else if (msg.body == `-covid cameroon`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Cameroon Covid19 Cases-----╕*

*Country Name :* ${con[34].country}   
*Total Cases :* ${con[34].cases}
*Active Cases :* ${con[34].active}
*Recovered Cases :* ${con[34].recovered}
*Death Cases :* ${con[34].deaths}
*Critical Cases :* ${con[34].critical}
*Population :* ${con[34].population}
*Total Tests :* ${con[34].tests}
`)})
  } else if (msg.body == `-covid canada`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Canada Covid19 Cases-----╕*

*Country Name :* ${con[35].country}   
*Total Cases :* ${con[35].cases}
*Active Cases :* ${con[35].active}
*Recovered Cases :* ${con[35].recovered}
*Death Cases :* ${con[35].deaths}
*Critical Cases :* ${con[35].critical}
*Population :* ${con[35].population}
*Total Tests :* ${con[35].tests}
`)})
  } else if (msg.body == `-covid caribbeannetherlands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Caribbean Netherlands Covid19 Cases-----╕*

*Country Name :* ${con[36].country}   
*Total Cases :* ${con[36].cases}
*Active Cases :* ${con[36].active}
*Recovered Cases :* ${con[36].recovered}
*Death Cases :* ${con[36].deaths}
*Critical Cases :* ${con[36].critical}
*Population :* ${con[36].population}
*Total Tests :* ${con[36].tests}
`)})
  } else if (msg.body == `-covid caymanislands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Cayman Islands Covid19 Cases-----╕*

*Country Name :* ${con[37].country}   
*Total Cases :* ${con[37].cases}
*Active Cases :* ${con[37].active}
*Recovered Cases :* ${con[37].recovered}
*Death Cases :* ${con[37].deaths}
*Critical Cases :* ${con[37].critical}
*Population :* ${con[37].population}
*Total Tests :* ${con[37].tests}
`)})
  } else if (msg.body == `-covid centralafricanrepublic`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Central African Republic Covid19 Cases-----╕*

*Country Name :* ${con[38].country}   
*Total Cases :* ${con[38].cases}
*Active Cases :* ${con[38].active}
*Recovered Cases :* ${con[38].recovered}
*Death Cases :* ${con[38].deaths}
*Critical Cases :* ${con[38].critical}
*Population :* ${con[38].population}
*Total Tests :* ${con[38].tests}
`)})
  } else if (msg.body == `-covid chad`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Chad Covid19 Cases-----╕*

*Country Name :* ${con[39].country}   
*Total Cases :* ${con[39].cases}
*Active Cases :* ${con[39].active}
*Recovered Cases :* ${con[39].recovered}
*Death Cases :* ${con[39].deaths}
*Critical Cases :* ${con[39].critical}
*Population :* ${con[39].population}
*Total Tests :* ${con[39].tests}
`)})
  } else if (msg.body == `-covid channelislands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Channel Islands Covid19 Cases-----╕*

*Country Name :* ${con[40].country}   
*Total Cases :* ${con[40].cases}
*Active Cases :* ${con[40].active}
*Recovered Cases :* ${con[40].recovered}
*Death Cases :* ${con[40].deaths}
*Critical Cases :* ${con[40].critical}
*Population :* ${con[40].population}
*Total Tests :* ${con[40].tests}
`)})
  } else if (msg.body == `-covid chile`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Chile Covid19 Cases-----╕*

*Country Name :* ${con[41].country}   
*Total Cases :* ${con[41].cases}
*Active Cases :* ${con[41].active}
*Recovered Cases :* ${con[41].recovered}
*Death Cases :* ${con[41].deaths}
*Critical Cases :* ${con[41].critical}
*Population :* ${con[41].population}
*Total Tests :* ${con[41].tests}
`)})
  } else if (msg.body == `-covid china`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----China Covid19 Cases-----╕*

*Country Name :* ${con[42].country}   
*Total Cases :* ${con[42].cases}
*Active Cases :* ${con[42].active}
*Recovered Cases :* ${con[42].recovered}
*Death Cases :* ${con[42].deaths}
*Critical Cases :* ${con[42].critical}
*Population :* ${con[42].population}
*Total Tests :* ${con[42].tests}
`)})
  } else if (msg.body == `-covid colombia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Colombia Covid19 Cases-----╕*

*Country Name :* ${con[43].country}   
*Total Cases :* ${con[43].cases}
*Active Cases :* ${con[43].active}
*Recovered Cases :* ${con[43].recovered}
*Death Cases :* ${con[43].deaths}
*Critical Cases :* ${con[43].critical}
*Population :* ${con[43].population}
*Total Tests :* ${con[43].tests}
`)})
  } else if (msg.body == `-covid comoros`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Comoros Covid19 Cases-----╕*

*Country Name :* ${con[44].country}   
*Total Cases :* ${con[44].cases}
*Active Cases :* ${con[44].active}
*Recovered Cases :* ${con[44].recovered}
*Death Cases :* ${con[44].deaths}
*Critical Cases :* ${con[44].critical}
*Population :* ${con[44].population}
*Total Tests :* ${con[44].tests}
`)})
  } else if (msg.body == `-covid congo`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Congo Covid19 Cases-----╕*

*Country Name :* ${con[45].country}   
*Total Cases :* ${con[45].cases}
*Active Cases :* ${con[45].active}
*Recovered Cases :* ${con[45].recovered}
*Death Cases :* ${con[45].deaths}
*Critical Cases :* ${con[45].critical}
*Population :* ${con[45].population}
*Total Tests :* ${con[45].tests}
`)})
  } else if (msg.body == `-covid costarica`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Costa Rica Covid19 Cases-----╕*

*Country Name :* ${con[46].country}   
*Total Cases :* ${con[46].cases}
*Active Cases :* ${con[46].active}
*Recovered Cases :* ${con[46].recovered}
*Death Cases :* ${con[46].deaths}
*Critical Cases :* ${con[46].critical}
*Population :* ${con[46].population}
*Total Tests :* ${con[46].tests}
`)})
  } else if (msg.body == `-covid croatia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Croatia Covid19 Cases-----╕*

*Country Name :* ${con[47].country}   
*Total Cases :* ${con[47].cases}
*Active Cases :* ${con[47].active}
*Recovered Cases :* ${con[47].recovered}
*Death Cases :* ${con[47].deaths}
*Critical Cases :* ${con[47].critical}
*Population :* ${con[47].population}
*Total Tests :* ${con[47].tests}
`)})
  } else if (msg.body == `-covid cuba`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Cuba Covid19 Cases-----╕*

*Country Name :* ${con[48].country}   
*Total Cases :* ${con[48].cases}
*Active Cases :* ${con[48].active}
*Recovered Cases :* ${con[48].recovered}
*Death Cases :* ${con[48].deaths}
*Critical Cases :* ${con[48].critical}
*Population :* ${con[48].population}
*Total Tests :* ${con[48].tests}
`)})
  } else if (msg.body == `-covid curacao`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Curaçao Covid19 Cases-----╕*

*Country Name :* ${con[49].country}   
*Total Cases :* ${con[49].cases}
*Active Cases :* ${con[49].active}
*Recovered Cases :* ${con[49].recovered}
*Death Cases :* ${con[49].deaths}
*Critical Cases :* ${con[49].critical}
*Population :* ${con[49].population}
*Total Tests :* ${con[49].tests}
`)})
  } else if (msg.body == `-covid cyprus`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Cyprus Covid19 Cases-----╕*

*Country Name :* ${con[50].country}   
*Total Cases :* ${con[50].cases}
*Active Cases :* ${con[50].active}
*Recovered Cases :* ${con[50].recovered}
*Death Cases :* ${con[50].deaths}
*Critical Cases :* ${con[50].critical}
*Population :* ${con[50].population}
*Total Tests :* ${con[50].tests}
`)})
  } else if (msg.body == `-covid czechia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Czechia Covid19 Cases-----╕*

*Country Name :* ${con[51].country}   
*Total Cases :* ${con[51].cases}
*Active Cases :* ${con[51].active}
*Recovered Cases :* ${con[51].recovered}
*Death Cases :* ${con[51].deaths}
*Critical Cases :* ${con[51].critical}
*Population :* ${con[51].population}
*Total Tests :* ${con[51].tests}
`)})
  } else if (msg.body == `-covid coted'ivoire"`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Côte d'Ivoire" Covid19 Cases-----╕*

*Country Name :* ${con[52].country}   
*Total Cases :* ${con[52].cases}
*Active Cases :* ${con[52].active}
*Recovered Cases :* ${con[52].recovered}
*Death Cases :* ${con[52].deaths}
*Critical Cases :* ${con[52].critical}
*Population :* ${con[52].population}
*Total Tests :* ${con[52].tests}
`)})
  } else if (msg.body == `-covid drc`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----DRC Covid19 Cases-----╕*

*Country Name :* ${con[53].country}   
*Total Cases :* ${con[53].cases}
*Active Cases :* ${con[53].active}
*Recovered Cases :* ${con[53].recovered}
*Death Cases :* ${con[53].deaths}
*Critical Cases :* ${con[53].critical}
*Population :* ${con[53].population}
*Total Tests :* ${con[53].tests}
`)})
  } else if (msg.body == `-covid denmark`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Denmark Covid19 Cases-----╕*

*Country Name :* ${con[54].country}   
*Total Cases :* ${con[54].cases}
*Active Cases :* ${con[54].active}
*Recovered Cases :* ${con[54].recovered}
*Death Cases :* ${con[54].deaths}
*Critical Cases :* ${con[54].critical}
*Population :* ${con[54].population}
*Total Tests :* ${con[54].tests}
`)})
  } else if (msg.body == `-covid diamondprincess`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Diamond Princess Covid19 Cases-----╕*

*Country Name :* ${con[55].country}   
*Total Cases :* ${con[55].cases}
*Active Cases :* ${con[55].active}
*Recovered Cases :* ${con[55].recovered}
*Death Cases :* ${con[55].deaths}
*Critical Cases :* ${con[55].critical}
*Population :* ${con[55].population}
*Total Tests :* ${con[55].tests}
`)})
  } else if (msg.body == `-covid djibouti`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Djibouti Covid19 Cases-----╕*

*Country Name :* ${con[56].country}   
*Total Cases :* ${con[56].cases}
*Active Cases :* ${con[56].active}
*Recovered Cases :* ${con[56].recovered}
*Death Cases :* ${con[56].deaths}
*Critical Cases :* ${con[56].critical}
*Population :* ${con[56].population}
*Total Tests :* ${con[56].tests}
`)})
  } else if (msg.body == `-covid dominica`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Dominica Covid19 Cases-----╕*

*Country Name :* ${con[57].country}   
*Total Cases :* ${con[57].cases}
*Active Cases :* ${con[57].active}
*Recovered Cases :* ${con[57].recovered}
*Death Cases :* ${con[57].deaths}
*Critical Cases :* ${con[57].critical}
*Population :* ${con[57].population}
*Total Tests :* ${con[57].tests}
`)})
  } else if (msg.body == `-covid dominicanrepublic"`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Dominican Republic" Covid19 Cases-----╕*

*Country Name :* ${con[58].country}   
*Total Cases :* ${con[58].cases}
*Active Cases :* ${con[58].active}
*Recovered Cases :* ${con[58].recovered}
*Death Cases :* ${con[58].deaths}
*Critical Cases :* ${con[58].critical}
*Population :* ${con[58].population}
*Total Tests :* ${con[58].tests}
`)})
  } else if (msg.body == `-covid ecuador`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Ecuador Covid19 Cases-----╕*

*Country Name :* ${con[59].country}   
*Total Cases :* ${con[59].cases}
*Active Cases :* ${con[59].active}
*Recovered Cases :* ${con[59].recovered}
*Death Cases :* ${con[59].deaths}
*Critical Cases :* ${con[59].critical}
*Population :* ${con[59].population}
*Total Tests :* ${con[59].tests}
`)})
  } else if (msg.body == `-covid egypt`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Egypt Covid19 Cases-----╕*

*Country Name :* ${con[60].country}   
*Total Cases :* ${con[60].cases}
*Active Cases :* ${con[60].active}
*Recovered Cases :* ${con[60].recovered}
*Death Cases :* ${con[60].deaths}
*Critical Cases :* ${con[60].critical}
*Population :* ${con[60].population}
*Total Tests :* ${con[60].tests}
`)})
  } else if (msg.body == `-covid elsalvador`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----El Salvador Covid19 Cases-----╕*

*Country Name :* ${con[61].country}   
*Total Cases :* ${con[61].cases}
*Active Cases :* ${con[61].active}
*Recovered Cases :* ${con[61].recovered}
*Death Cases :* ${con[61].deaths}
*Critical Cases :* ${con[61].critical}
*Population :* ${con[61].population}
*Total Tests :* ${con[61].tests}
`)})
  } else if (msg.body == `-covid equatorialguinea`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Equatorial Guinea Covid19 Cases-----╕*

*Country Name :* ${con[62].country}   
*Total Cases :* ${con[62].cases}
*Active Cases :* ${con[62].active}
*Recovered Cases :* ${con[62].recovered}
*Death Cases :* ${con[62].deaths}
*Critical Cases :* ${con[62].critical}
*Population :* ${con[62].population}
*Total Tests :* ${con[62].tests}
`)})
  } else if (msg.body == `-covid eritrea`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Eritrea Covid19 Cases-----╕*

*Country Name :* ${con[63].country}   
*Total Cases :* ${con[63].cases}
*Active Cases :* ${con[63].active}
*Recovered Cases :* ${con[63].recovered}
*Death Cases :* ${con[63].deaths}
*Critical Cases :* ${con[63].critical}
*Population :* ${con[63].population}
*Total Tests :* ${con[63].tests}
`)})
  } else if (msg.body == `-covid estonia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Estonia Covid19 Cases-----╕*

*Country Name :* ${con[64].country}   
*Total Cases :* ${con[64].cases}
*Active Cases :* ${con[64].active}
*Recovered Cases :* ${con[64].recovered}
*Death Cases :* ${con[64].deaths}
*Critical Cases :* ${con[64].critical}
*Population :* ${con[64].population}
*Total Tests :* ${con[64].tests}
`)})
  } else if (msg.body == `-covid ethiopia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Ethiopia Covid19 Cases-----╕*

*Country Name :* ${con[65].country}   
*Total Cases :* ${con[65].cases}
*Active Cases :* ${con[65].active}
*Recovered Cases :* ${con[65].recovered}
*Death Cases :* ${con[65].deaths}
*Critical Cases :* ${con[65].critical}
*Population :* ${con[65].population}
*Total Tests :* ${con[65].tests}
`)})
  } else if (msg.body == `-covid falklandislands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Falkland Islands (Malvinas) Covid19 Cases-----╕*

*Country Name :* ${con[66].country}   
*Total Cases :* ${con[66].cases}
*Active Cases :* ${con[66].active}
*Recovered Cases :* ${con[66].recovered}
*Death Cases :* ${con[66].deaths}
*Critical Cases :* ${con[66].critical}
*Population :* ${con[66].population}
*Total Tests :* ${con[66].tests}
`)})
  } else if (msg.body == `-covid faroeislands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Faroe Islands Covid19 Cases-----╕*

*Country Name :* ${con[67].country}   
*Total Cases :* ${con[67].cases}
*Active Cases :* ${con[67].active}
*Recovered Cases :* ${con[67].recovered}
*Death Cases :* ${con[67].deaths}
*Critical Cases :* ${con[67].critical}
*Population :* ${con[67].population}
*Total Tests :* ${con[67].tests}
`)})
  } else if (msg.body == `-covid fiji`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Fiji Covid19 Cases-----╕*

*Country Name :* ${con[68].country}   
*Total Cases :* ${con[68].cases}
*Active Cases :* ${con[68].active}
*Recovered Cases :* ${con[68].recovered}
*Death Cases :* ${con[68].deaths}
*Critical Cases :* ${con[68].critical}
*Population :* ${con[68].population}
*Total Tests :* ${con[68].tests}
`)})
  } else if (msg.body == `-covid finland`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Finland Covid19 Cases-----╕*

*Country Name :* ${con[69].country}   
*Total Cases :* ${con[69].cases}
*Active Cases :* ${con[69].active}
*Recovered Cases :* ${con[69].recovered}
*Death Cases :* ${con[69].deaths}
*Critical Cases :* ${con[69].critical}
*Population :* ${con[69].population}
*Total Tests :* ${con[69].tests}
`)})
  } else if (msg.body == `-covid france`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----France Covid19 Cases-----╕*

*Country Name :* ${con[70].country}   
*Total Cases :* ${con[70].cases}
*Active Cases :* ${con[70].active}
*Recovered Cases :* ${con[70].recovered}
*Death Cases :* ${con[70].deaths}
*Critical Cases :* ${con[70].critical}
*Population :* ${con[70].population}
*Total Tests :* ${con[70].tests}
`)})
  } else if (msg.body == `-covid frenchguiana`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----French Guiana Covid19 Cases-----╕*

*Country Name :* ${con[71].country}   
*Total Cases :* ${con[71].cases}
*Active Cases :* ${con[71].active}
*Recovered Cases :* ${con[71].recovered}
*Death Cases :* ${con[71].deaths}
*Critical Cases :* ${con[71].critical}
*Population :* ${con[71].population}
*Total Tests :* ${con[71].tests}
`)})
  } else if (msg.body == `-covid frenchpolynesia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----French Polynesia Covid19 Cases-----╕*

*Country Name :* ${con[72].country}   
*Total Cases :* ${con[72].cases}
*Active Cases :* ${con[72].active}
*Recovered Cases :* ${con[72].recovered}
*Death Cases :* ${con[72].deaths}
*Critical Cases :* ${con[72].critical}
*Population :* ${con[72].population}
*Total Tests :* ${con[72].tests}
`)})
  } else if (msg.body == `-covid gabon`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Gabon Covid19 Cases-----╕*

*Country Name :* ${con[73].country}   
*Total Cases :* ${con[73].cases}
*Active Cases :* ${con[73].active}
*Recovered Cases :* ${con[73].recovered}
*Death Cases :* ${con[73].deaths}
*Critical Cases :* ${con[73].critical}
*Population :* ${con[73].population}
*Total Tests :* ${con[73].tests}
`)})
  } else if (msg.body == `-covid gambia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Gambia Covid19 Cases-----╕*

*Country Name :* ${con[74].country}   
*Total Cases :* ${con[74].cases}
*Active Cases :* ${con[74].active}
*Recovered Cases :* ${con[74].recovered}
*Death Cases :* ${con[74].deaths}
*Critical Cases :* ${con[74].critical}
*Population :* ${con[74].population}
*Total Tests :* ${con[74].tests}
`)})
  } else if (msg.body == `-covid georgia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Georgia Covid19 Cases-----╕*

*Country Name :* ${con[75].country}   
*Total Cases :* ${con[75].cases}
*Active Cases :* ${con[75].active}
*Recovered Cases :* ${con[75].recovered}
*Death Cases :* ${con[75].deaths}
*Critical Cases :* ${con[75].critical}
*Population :* ${con[75].population}
*Total Tests :* ${con[75].tests}
`)})
  } else if (msg.body == `-covid germany`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Germany Covid19 Cases-----╕*

*Country Name :* ${con[76].country}   
*Total Cases :* ${con[76].cases}
*Active Cases :* ${con[76].active}
*Recovered Cases :* ${con[76].recovered}
*Death Cases :* ${con[76].deaths}
*Critical Cases :* ${con[76].critical}
*Population :* ${con[76].population}
*Total Tests :* ${con[76].tests}
`)})
  } else if (msg.body == `-covid ghana`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Ghana Covid19 Cases-----╕*

*Country Name :* ${con[77].country}   
*Total Cases :* ${con[77].cases}
*Active Cases :* ${con[77].active}
*Recovered Cases :* ${con[77].recovered}
*Death Cases :* ${con[77].deaths}
*Critical Cases :* ${con[77].critical}
*Population :* ${con[77].population}
*Total Tests :* ${con[77].tests}
`)})
  } else if (msg.body == `-covid gibraltar`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Gibraltar Covid19 Cases-----╕*

*Country Name :* ${con[78].country}   
*Total Cases :* ${con[78].cases}
*Active Cases :* ${con[78].active}
*Recovered Cases :* ${con[78].recovered}
*Death Cases :* ${con[78].deaths}
*Critical Cases :* ${con[78].critical}
*Population :* ${con[78].population}
*Total Tests :* ${con[78].tests}
`)})
  } else if (msg.body == `-covid greece`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Greece Covid19 Cases-----╕*

*Country Name :* ${con[79].country}   
*Total Cases :* ${con[79].cases}
*Active Cases :* ${con[79].active}
*Recovered Cases :* ${con[79].recovered}
*Death Cases :* ${con[79].deaths}
*Critical Cases :* ${con[79].critical}
*Population :* ${con[79].population}
*Total Tests :* ${con[79].tests}
`)})
  } else if (msg.body == `-covid greenland`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Greenland Covid19 Cases-----╕*

*Country Name :* ${con[80].country}   
*Total Cases :* ${con[80].cases}
*Active Cases :* ${con[80].active}
*Recovered Cases :* ${con[80].recovered}
*Death Cases :* ${con[80].deaths}
*Critical Cases :* ${con[80].critical}
*Population :* ${con[80].population}
*Total Tests :* ${con[80].tests}
`)})
  } else if (msg.body == `-covid grenada`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Grenada Covid19 Cases-----╕*

*Country Name :* ${con[81].country}   
*Total Cases :* ${con[81].cases}
*Active Cases :* ${con[81].active}
*Recovered Cases :* ${con[81].recovered}
*Death Cases :* ${con[81].deaths}
*Critical Cases :* ${con[81].critical}
*Population :* ${con[81].population}
*Total Tests :* ${con[81].tests}
`)})
  } else if (msg.body == `-covid guadeloupe`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Guadeloupe Covid19 Cases-----╕*

*Country Name :* ${con[82].country}   
*Total Cases :* ${con[82].cases}
*Active Cases :* ${con[82].active}
*Recovered Cases :* ${con[82].recovered}
*Death Cases :* ${con[82].deaths}
*Critical Cases :* ${con[82].critical}
*Population :* ${con[82].population}
*Total Tests :* ${con[82].tests}
`)})
  } else if (msg.body == `-covid guatemala`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Guatemala Covid19 Cases-----╕*

*Country Name :* ${con[83].country}   
*Total Cases :* ${con[83].cases}
*Active Cases :* ${con[83].active}
*Recovered Cases :* ${con[83].recovered}
*Death Cases :* ${con[83].deaths}
*Critical Cases :* ${con[83].critical}
*Population :* ${con[83].population}
*Total Tests :* ${con[83].tests}
`)})
  } else if (msg.body == `-covid guinea`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Guinea Covid19 Cases-----╕*

*Country Name :* ${con[84].country}   
*Total Cases :* ${con[84].cases}
*Active Cases :* ${con[84].active}
*Recovered Cases :* ${con[84].recovered}
*Death Cases :* ${con[84].deaths}
*Critical Cases :* ${con[84].critical}
*Population :* ${con[84].population}
*Total Tests :* ${con[84].tests}
`)})
  } else if (msg.body == `-covid guinea-bissau`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Guinea-Bissau Covid19 Cases-----╕*

*Country Name :* ${con[85].country}   
*Total Cases :* ${con[85].cases}
*Active Cases :* ${con[85].active}
*Recovered Cases :* ${con[85].recovered}
*Death Cases :* ${con[85].deaths}
*Critical Cases :* ${con[85].critical}
*Population :* ${con[85].population}
*Total Tests :* ${con[85].tests}
`)})
  } else if (msg.body == `-covid guyana`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Guyana Covid19 Cases-----╕*

*Country Name :* ${con[86].country}   
*Total Cases :* ${con[86].cases}
*Active Cases :* ${con[86].active}
*Recovered Cases :* ${con[86].recovered}
*Death Cases :* ${con[86].deaths}
*Critical Cases :* ${con[86].critical}
*Population :* ${con[86].population}
*Total Tests :* ${con[86].tests}
`)})
  } else if (msg.body == `-covid haiti`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Haiti Covid19 Cases-----╕*

*Country Name :* ${con[87].country}   
*Total Cases :* ${con[87].cases}
*Active Cases :* ${con[87].active}
*Recovered Cases :* ${con[87].recovered}
*Death Cases :* ${con[87].deaths}
*Critical Cases :* ${con[87].critical}
*Population :* ${con[87].population}
*Total Tests :* ${con[87].tests}
`)})
  } else if (msg.body == `-covid holysee`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Holy See (Vatican City State) Covid19 Cases-----╕*

*Country Name :* ${con[88].country}   
*Total Cases :* ${con[88].cases}
*Active Cases :* ${con[88].active}
*Recovered Cases :* ${con[88].recovered}
*Death Cases :* ${con[88].deaths}
*Critical Cases :* ${con[88].critical}
*Population :* ${con[88].population}
*Total Tests :* ${con[88].tests}
`)})
  } else if (msg.body == `-covid honduras`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Honduras Covid19 Cases-----╕*

*Country Name :* ${con[89].country}   
*Total Cases :* ${con[89].cases}
*Active Cases :* ${con[89].active}
*Recovered Cases :* ${con[89].recovered}
*Death Cases :* ${con[89].deaths}
*Critical Cases :* ${con[89].critical}
*Population :* ${con[89].population}
*Total Tests :* ${con[89].tests}
`)})
  } else if (msg.body == `-covid hongkong`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Hong Kong Covid19 Cases-----╕*

*Country Name :* ${con[90].country}   
*Total Cases :* ${con[90].cases}
*Active Cases :* ${con[90].active}
*Recovered Cases :* ${con[90].recovered}
*Death Cases :* ${con[90].deaths}
*Critical Cases :* ${con[90].critical}
*Population :* ${con[90].population}
*Total Tests :* ${con[90].tests}
`)})
  } else if (msg.body == `-covid hungary`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Hungary Covid19 Cases-----╕*

*Country Name :* ${con[91].country}   
*Total Cases :* ${con[91].cases}
*Active Cases :* ${con[91].active}
*Recovered Cases :* ${con[91].recovered}
*Death Cases :* ${con[91].deaths}
*Critical Cases :* ${con[91].critical}
*Population :* ${con[91].population}
*Total Tests :* ${con[91].tests}
`)})
  } else if (msg.body == `-covid iceland`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Iceland Covid19 Cases-----╕*

*Country Name :* ${con[92].country}   
*Total Cases :* ${con[92].cases}
*Active Cases :* ${con[92].active}
*Recovered Cases :* ${con[92].recovered}
*Death Cases :* ${con[92].deaths}
*Critical Cases :* ${con[92].critical}
*Population :* ${con[92].population}
*Total Tests :* ${con[92].tests}
`)})
  } else if (msg.body == `-covid india`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----India Covid19 Cases-----╕*

*Country Name :* ${con[93].country}   
*Total Cases :* ${con[93].cases}
*Active Cases :* ${con[93].active}
*Recovered Cases :* ${con[93].recovered}
*Death Cases :* ${con[93].deaths}
*Today Cases :* ${con[93].todayCases}
*Today Death Cases :* ${con[93].todayDeaths}
*Today Recovered :* ${con[93].todayRecovered}
*Critical Cases :* ${con[93].critical}
*Population :* ${con[93].population}
*Total Tests :* ${con[93].tests}
`)})
  } else if (msg.body == `-covid indonesia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Indonesia Covid19 Cases-----╕*

*Country Name :* ${con[94].country}   
*Total Cases :* ${con[94].cases}
*Active Cases :* ${con[94].active}
*Recovered Cases :* ${con[94].recovered}
*Death Cases :* ${con[94].deaths}
*Critical Cases :* ${con[94].critical}
*Population :* ${con[94].population}
*Total Tests :* ${con[94].tests}
`)})
  } else if (msg.body == `-covid iran`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Iran Covid19 Cases-----╕*

*Country Name :* ${con[95].country}   
*Total Cases :* ${con[95].cases}
*Active Cases :* ${con[95].active}
*Recovered Cases :* ${con[95].recovered}
*Death Cases :* ${con[95].deaths}
*Critical Cases :* ${con[95].critical}
*Population :* ${con[95].population}
*Total Tests :* ${con[95].tests}
`)})
  } else if (msg.body == `-covid iraq`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Iraq Covid19 Cases-----╕*

*Country Name :* ${con[96].country}   
*Total Cases :* ${con[96].cases}
*Active Cases :* ${con[96].active}
*Recovered Cases :* ${con[96].recovered}
*Death Cases :* ${con[96].deaths}
*Critical Cases :* ${con[96].critical}
*Population :* ${con[96].population}
*Total Tests :* ${con[96].tests}
`)})
  } else if (msg.body == `-covid ireland`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Ireland Covid19 Cases-----╕*

*Country Name :* ${con[97].country}   
*Total Cases :* ${con[97].cases}
*Active Cases :* ${con[97].active}
*Recovered Cases :* ${con[97].recovered}
*Death Cases :* ${con[97].deaths}
*Critical Cases :* ${con[97].critical}
*Population :* ${con[97].population}
*Total Tests :* ${con[97].tests}
`)})
  } else if (msg.body == `-covid isleofman`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Isle of Man Covid19 Cases-----╕*

*Country Name :* ${con[98].country}   
*Total Cases :* ${con[98].cases}
*Active Cases :* ${con[98].active}
*Recovered Cases :* ${con[98].recovered}
*Death Cases :* ${con[98].deaths}
*Critical Cases :* ${con[98].critical}
*Population :* ${con[98].population}
*Total Tests :* ${con[98].tests}
`)})
  } else if (msg.body == `-covid israel`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Israel Covid19 Cases-----╕*

*Country Name :* ${con[99].country}   
*Total Cases :* ${con[99].cases}
*Active Cases :* ${con[99].active}
*Recovered Cases :* ${con[99].recovered}
*Death Cases :* ${con[99].deaths}
*Critical Cases :* ${con[99].critical}
*Population :* ${con[99].population}
*Total Tests :* ${con[99].tests}
`)})
  } else if (msg.body == `-covid italy`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Italy Covid19 Cases-----╕*

*Country Name :* ${con[100].country}   
*Total Cases :* ${con[100].cases}
*Active Cases :* ${con[100].active}
*Recovered Cases :* ${con[100].recovered}
*Death Cases :* ${con[100].deaths}
*Critical Cases :* ${con[100].critical}
*Population :* ${con[100].population}
*Total Tests :* ${con[100].tests}
`)})
  } else if (msg.body == `-covid jamaica`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Jamaica Covid19 Cases-----╕*

*Country Name :* ${con[101].country}   
*Total Cases :* ${con[101].cases}
*Active Cases :* ${con[101].active}
*Recovered Cases :* ${con[101].recovered}
*Death Cases :* ${con[101].deaths}
*Critical Cases :* ${con[101].critical}
*Population :* ${con[101].population}
*Total Tests :* ${con[101].tests}
`)})
  } else if (msg.body == `-covid japan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Japan Covid19 Cases-----╕*

*Country Name :* ${con[102].country}   
*Total Cases :* ${con[102].cases}
*Active Cases :* ${con[102].active}
*Recovered Cases :* ${con[102].recovered}
*Death Cases :* ${con[102].deaths}
*Critical Cases :* ${con[102].critical}
*Population :* ${con[102].population}
*Total Tests :* ${con[102].tests}
`)})
  } else if (msg.body == `-covid jordan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Jordan Covid19 Cases-----╕*

*Country Name :* ${con[103].country}   
*Total Cases :* ${con[103].cases}
*Active Cases :* ${con[103].active}
*Recovered Cases :* ${con[103].recovered}
*Death Cases :* ${con[103].deaths}
*Critical Cases :* ${con[103].critical}
*Population :* ${con[103].population}
*Total Tests :* ${con[103].tests}
`)})
  } else if (msg.body == `-covid kazakhstan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Kazakhstan Covid19 Cases-----╕*

*Country Name :* ${con[104].country}   
*Total Cases :* ${con[104].cases}
*Active Cases :* ${con[104].active}
*Recovered Cases :* ${con[104].recovered}
*Death Cases :* ${con[104].deaths}
*Critical Cases :* ${con[104].critical}
*Population :* ${con[104].population}
*Total Tests :* ${con[104].tests}
`)})
  } else if (msg.body == `-covid kenya`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Kenya Covid19 Cases-----╕*

*Country Name :* ${con[105].country}   
*Total Cases :* ${con[105].cases}
*Active Cases :* ${con[105].active}
*Recovered Cases :* ${con[105].recovered}
*Death Cases :* ${con[105].deaths}
*Critical Cases :* ${con[105].critical}
*Population :* ${con[105].population}
*Total Tests :* ${con[105].tests}
`)})
  } else if (msg.body == `-covid kuwait`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Kuwait Covid19 Cases-----╕*

*Country Name :* ${con[106].country}   
*Total Cases :* ${con[106].cases}
*Active Cases :* ${con[106].active}
*Recovered Cases :* ${con[106].recovered}
*Death Cases :* ${con[106].deaths}
*Critical Cases :* ${con[106].critical}
*Population :* ${con[106].population}
*Total Tests :* ${con[106].tests}
`)})
  } else if (msg.body == `-covid kyrgyzstan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Kyrgyzstan Covid19 Cases-----╕*

*Country Name :* ${con[107].country}   
*Total Cases :* ${con[107].cases}
*Active Cases :* ${con[107].active}
*Recovered Cases :* ${con[107].recovered}
*Death Cases :* ${con[107].deaths}
*Critical Cases :* ${con[107].critical}
*Population :* ${con[107].population}
*Total Tests :* ${con[107].tests}
`)})
  } else if (msg.body == `-covid laopPeoplesdemocraticrepublic`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Lao People's Democratic Republic Covid19 Cases-----╕*

*Country Name :* ${con[108].country}   
*Total Cases :* ${con[108].cases}
*Active Cases :* ${con[108].active}
*Recovered Cases :* ${con[108].recovered}
*Death Cases :* ${con[108].deaths}
*Critical Cases :* ${con[108].critical}
*Population :* ${con[108].population}
*Total Tests :* ${con[108].tests}
`)})
  } else if (msg.body == `-covid latvia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Latvia Covid19 Cases-----╕*

*Country Name :* ${con[109].country}   
*Total Cases :* ${con[109].cases}
*Active Cases :* ${con[109].active}
*Recovered Cases :* ${con[109].recovered}
*Death Cases :* ${con[109].deaths}
*Critical Cases :* ${con[109].critical}
*Population :* ${con[109].population}
*Total Tests :* ${con[109].tests}
`)})
  } else if (msg.body == `-covid lebanon`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Lebanon Covid19 Cases-----╕*

*Country Name :* ${con[110].country}   
*Total Cases :* ${con[110].cases}
*Active Cases :* ${con[110].active}
*Recovered Cases :* ${con[110].recovered}
*Death Cases :* ${con[110].deaths}
*Critical Cases :* ${con[110].critical}
*Population :* ${con[110].population}
*Total Tests :* ${con[110].tests}
`)})
  } else if (msg.body == `-covid lesotho`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Lesotho Covid19 Cases-----╕*

*Country Name :* ${con[111].country}   
*Total Cases :* ${con[111].cases}
*Active Cases :* ${con[111].active}
*Recovered Cases :* ${con[111].recovered}
*Death Cases :* ${con[111].deaths}
*Critical Cases :* ${con[111].critical}
*Population :* ${con[111].population}
*Total Tests :* ${con[111].tests}
`)})
  } else if (msg.body == `-covid liberia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----liberia Covid19 Cases-----╕*

*Country Name :* ${con[112].country}   
*Total Cases :* ${con[112].cases}
*Active Cases :* ${con[112].active}
*Recovered Cases :* ${con[112].recovered}
*Death Cases :* ${con[112].deaths}
*Critical Cases :* ${con[112].critical}
*Population :* ${con[112].population}
*Total Tests :* ${con[112].tests}
`)})
  } else if (msg.body == `-covid libyanarabjamahiriya`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Libyan Arab Jamahiriya Covid19 Cases-----╕*

*Country Name :* ${con[113].country}   
*Total Cases :* ${con[113].cases}
*Active Cases :* ${con[113].active}
*Recovered Cases :* ${con[113].recovered}
*Death Cases :* ${con[113].deaths}
*Critical Cases :* ${con[113].critical}
*Population :* ${con[113].population}
*Total Tests :* ${con[113].tests}
`)})
  } else if (msg.body == `-covid Liechtenstein`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Liechtenstein Covid19 Cases-----╕*

*Country Name :* ${con[114].country}   
*Total Cases :* ${con[114].cases}
*Active Cases :* ${con[114].active}
*Recovered Cases :* ${con[114].recovered}
*Death Cases :* ${con[114].deaths}
*Critical Cases :* ${con[114].critical}
*Population :* ${con[114].population}
*Total Tests :* ${con[114].tests}
`)})
  } else if (msg.body == `-covid lithuania`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Lithuania Covid19 Cases-----╕*

*Country Name :* ${con[115].country}   
*Total Cases :* ${con[115].cases}
*Active Cases :* ${con[115].active}
*Recovered Cases :* ${con[115].recovered}
*Death Cases :* ${con[115].deaths}
*Critical Cases :* ${con[115].critical}
*Population :* ${con[115].population}
*Total Tests :* ${con[115].tests}
`)})
  } else if (msg.body == `-covid luxembourg`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Luxembourg Covid19 Cases-----╕*

*Country Name :* ${con[116].country}   
*Total Cases :* ${con[116].cases}
*Active Cases :* ${con[116].active}
*Recovered Cases :* ${con[116].recovered}
*Death Cases :* ${con[116].deaths}
*Critical Cases :* ${con[116].critical}
*Population :* ${con[116].population}
*Total Tests :* ${con[116].tests}
`)})
  } else if (msg.body == `-covid mszaandam`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----MS Zaandam Covid19 Cases-----╕*

*Country Name :* ${con[117].country}   
*Total Cases :* ${con[117].cases}
*Active Cases :* ${con[117].active}
*Recovered Cases :* ${con[117].recovered}
*Death Cases :* ${con[117].deaths}
*Critical Cases :* ${con[117].critical}
*Population :* ${con[117].population}
*Total Tests :* ${con[117].tests}
`)})
  } else if (msg.body == `-covid macao`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Macao Covid19 Cases-----╕*

*Country Name :* ${con[118].country}   
*Total Cases :* ${con[118].cases}
*Active Cases :* ${con[118].active}
*Recovered Cases :* ${con[118].recovered}
*Death Cases :* ${con[118].deaths}
*Critical Cases :* ${con[118].critical}
*Population :* ${con[118].population}
*Total Tests :* ${con[118].tests}
`)})
  } else if (msg.body == `-covid macedonia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Macedonia Covid19 Cases-----╕*

*Country Name :* ${con[119].country}   
*Total Cases :* ${con[119].cases}
*Active Cases :* ${con[119].active}
*Recovered Cases :* ${con[119].recovered}
*Death Cases :* ${con[119].deaths}
*Critical Cases :* ${con[119].critical}
*Population :* ${con[119].population}
*Total Tests :* ${con[119].tests}
`)})
  } else if (msg.body == `-covid madagascar`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Madagascar Covid19 Cases-----╕*

*Country Name :* ${con[120].country}   
*Total Cases :* ${con[120].cases}
*Active Cases :* ${con[120].active}
*Recovered Cases :* ${con[120].recovered}
*Death Cases :* ${con[120].deaths}
*Critical Cases :* ${con[120].critical}
*Population :* ${con[120].population}
*Total Tests :* ${con[120].tests}
`)})
  } else if (msg.body == `-covid malawi`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Malawi Covid19 Cases-----╕*

*Country Name :* ${con[121].country}   
*Total Cases :* ${con[121].cases}
*Active Cases :* ${con[121].active}
*Recovered Cases :* ${con[121].recovered}
*Death Cases :* ${con[121].deaths}
*Critical Cases :* ${con[121].critical}
*Population :* ${con[121].population}
*Total Tests :* ${con[121].tests}
`)})
  } else if (msg.body == `-covid malaysia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Malaysia Covid19 Cases-----╕*

*Country Name :* ${con[122].country}   
*Total Cases :* ${con[122].cases}
*Active Cases :* ${con[122].active}
*Recovered Cases :* ${con[122].recovered}
*Death Cases :* ${con[122].deaths}
*Critical Cases :* ${con[122].critical}
*Population :* ${con[122].population}
*Total Tests :* ${con[122].tests}
`)})
  } else if (msg.body == `-covid maldives`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Maldives Covid19 Cases-----╕*

*Country Name :* ${con[123].country}   
*Total Cases :* ${con[123].cases}
*Active Cases :* ${con[123].active}
*Recovered Cases :* ${con[123].recovered}
*Death Cases :* ${con[123].deaths}
*Critical Cases :* ${con[123].critical}
*Population :* ${con[123].population}
*Total Tests :* ${con[123].tests}
`)})
  } else if (msg.body == `-covid mali`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Mali Covid19 Cases-----╕*

*Country Name :* ${con[124].country}   
*Total Cases :* ${con[124].cases}
*Active Cases :* ${con[124].active}
*Recovered Cases :* ${con[124].recovered}
*Death Cases :* ${con[124].deaths}
*Critical Cases :* ${con[124].critical}
*Population :* ${con[124].population}
*Total Tests :* ${con[124].tests}
`)})
  } else if (msg.body == `-covid malta`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Malta Covid19 Cases-----╕*

*Country Name :* ${con[125].country}   
*Total Cases :* ${con[125].cases}
*Active Cases :* ${con[125].active}
*Recovered Cases :* ${con[125].recovered}
*Death Cases :* ${con[125].deaths}
*Critical Cases :* ${con[125].critical}
*Population :* ${con[125].population}
*Total Tests :* ${con[125].tests}
`)})
  } else if (msg.body == `-covid marshallislands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Marshall Islands Covid19 Cases-----╕*

*Country Name :* ${con[126].country}   
*Total Cases :* ${con[126].cases}
*Active Cases :* ${con[126].active}
*Recovered Cases :* ${con[126].recovered}
*Death Cases :* ${con[126].deaths}
*Critical Cases :* ${con[126].critical}
*Population :* ${con[126].population}
*Total Tests :* ${con[126].tests}
`)})
  } else if (msg.body == `-covid martinique`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Martinique Covid19 Cases-----╕*

*Country Name :* ${con[127].country}   
*Total Cases :* ${con[127].cases}
*Active Cases :* ${con[127].active}
*Recovered Cases :* ${con[127].recovered}
*Death Cases :* ${con[127].deaths}
*Critical Cases :* ${con[127].critical}
*Population :* ${con[127].population}
*Total Tests :* ${con[127].tests}
`)})
  } else if (msg.body == `-covid mauritania`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Mauritania Covid19 Cases-----╕*

*Country Name :* ${con[128].country}   
*Total Cases :* ${con[128].cases}
*Active Cases :* ${con[128].active}
*Recovered Cases :* ${con[128].recovered}
*Death Cases :* ${con[128].deaths}
*Critical Cases :* ${con[128].critical}
*Population :* ${con[128].population}
*Total Tests :* ${con[128].tests}
`)})
  } else if (msg.body == `-covid mauritius`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Mauritius Covid19 Cases-----╕*

*Country Name :* ${con[129].country}   
*Total Cases :* ${con[129].cases}
*Active Cases :* ${con[129].active}
*Recovered Cases :* ${con[129].recovered}
*Death Cases :* ${con[129].deaths}
*Critical Cases :* ${con[129].critical}
*Population :* ${con[129].population}
*Total Tests :* ${con[129].tests}
`)})
  } else if (msg.body == `-covid mayotte`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Mayotte Covid19 Cases-----╕*

*Country Name :* ${con[130].country}   
*Total Cases :* ${con[130].cases}
*Active Cases :* ${con[130].active}
*Recovered Cases :* ${con[130].recovered}
*Death Cases :* ${con[130].deaths}
*Critical Cases :* ${con[130].critical}
*Population :* ${con[130].population}
*Total Tests :* ${con[130].tests}
`)})
  } else if (msg.body == `-covid mexico`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Mexico Covid19 Cases-----╕*

*Country Name :* ${con[131].country}   
*Total Cases :* ${con[131].cases}
*Active Cases :* ${con[131].active}
*Recovered Cases :* ${con[131].recovered}
*Death Cases :* ${con[131].deaths}
*Critical Cases :* ${con[131].critical}
*Population :* ${con[131].population}
*Total Tests :* ${con[131].tests}
`)})
  } else if (msg.body == `-covid micronesia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Micronesia Covid19 Cases-----╕*

*Country Name :* ${con[132].country}   
*Total Cases :* ${con[132].cases}
*Active Cases :* ${con[132].active}
*Recovered Cases :* ${con[132].recovered}
*Death Cases :* ${con[132].deaths}
*Critical Cases :* ${con[132].critical}
*Population :* ${con[132].population}
*Total Tests :* ${con[132].tests}
`)})
  } else if (msg.body == `-covid moldova`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Moldova Covid19 Cases-----╕*

*Country Name :* ${con[133].country}   
*Total Cases :* ${con[133].cases}
*Active Cases :* ${con[133].active}
*Recovered Cases :* ${con[133].recovered}
*Death Cases :* ${con[133].deaths}
*Critical Cases :* ${con[133].critical}
*Population :* ${con[133].population}
*Total Tests :* ${con[133].tests}
`)})
  } else if (msg.body == `-covid monaco`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Monaco Covid19 Cases-----╕*

*Country Name :* ${con[134].country}   
*Total Cases :* ${con[134].cases}
*Active Cases :* ${con[134].active}
*Recovered Cases :* ${con[134].recovered}
*Death Cases :* ${con[134].deaths}
*Critical Cases :* ${con[134].critical}
*Population :* ${con[134].population}
*Total Tests :* ${con[134].tests}
`)})
  } else if (msg.body == `-covid mongolia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Mongolia Covid19 Cases-----╕*

*Country Name :* ${con[135].country}   
*Total Cases :* ${con[135].cases}
*Active Cases :* ${con[135].active}
*Recovered Cases :* ${con[135].recovered}
*Death Cases :* ${con[135].deaths}
*Critical Cases :* ${con[135].critical}
*Population :* ${con[135].population}
*Total Tests :* ${con[135].tests}
`)})
  } else if (msg.body == `-covid montenegro`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Montenegro Covid19 Cases-----╕*

*Country Name :* ${con[136].country}   
*Total Cases :* ${con[136].cases}
*Active Cases :* ${con[136].active}
*Recovered Cases :* ${con[136].recovered}
*Death Cases :* ${con[136].deaths}
*Critical Cases :* ${con[136].critical}
*Population :* ${con[136].population}
*Total Tests :* ${con[136].tests}
`)})
  } else if (msg.body == `-covid montserrat`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Montserrat Covid19 Cases-----╕*

*Country Name :* ${con[137].country}   
*Total Cases :* ${con[137].cases}
*Active Cases :* ${con[137].active}
*Recovered Cases :* ${con[137].recovered}
*Death Cases :* ${con[137].deaths}
*Critical Cases :* ${con[137].critical}
*Population :* ${con[137].population}
*Total Tests :* ${con[137].tests}
`)})
  } else if (msg.body == `-covid morocco`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Morocco Covid19 Cases-----╕*

*Country Name :* ${con[138].country}   
*Total Cases :* ${con[138].cases}
*Active Cases :* ${con[138].active}
*Recovered Cases :* ${con[138].recovered}
*Death Cases :* ${con[138].deaths}
*Critical Cases :* ${con[138].critical}
*Population :* ${con[138].population}
*Total Tests :* ${con[138].tests}
`)})
  } else if (msg.body == `-covid mozambique`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Mozambique Covid19 Cases-----╕*

*Country Name :* ${con[139].country}   
*Total Cases :* ${con[139].cases}
*Active Cases :* ${con[139].active}
*Recovered Cases :* ${con[139].recovered}
*Death Cases :* ${con[139].deaths}
*Critical Cases :* ${con[139].critical}
*Population :* ${con[139].population}
*Total Tests :* ${con[139].tests}
`)})
  } else if (msg.body == `-covid myanmar`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Myanmar Covid19 Cases-----╕*

*Country Name :* ${con[140].country}   
*Total Cases :* ${con[140].cases}
*Active Cases :* ${con[140].active}
*Recovered Cases :* ${con[140].recovered}
*Death Cases :* ${con[140].deaths}
*Critical Cases :* ${con[140].critical}
*Population :* ${con[140].population}
*Total Tests :* ${con[140].tests}
`)})
  } else if (msg.body == `-covid namibia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Namibia Covid19 Cases-----╕*

*Country Name :* ${con[141].country}   
*Total Cases :* ${con[141].cases}
*Active Cases :* ${con[141].active}
*Recovered Cases :* ${con[141].recovered}
*Death Cases :* ${con[141].deaths}
*Critical Cases :* ${con[141].critical}
*Population :* ${con[141].population}
*Total Tests :* ${con[141].tests}
`)})
  } else if (msg.body == `-covid nepal`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Nepal Covid19 Cases-----╕*

*Country Name :* ${con[142].country}   
*Total Cases :* ${con[142].cases}
*Active Cases :* ${con[142].active}
*Recovered Cases :* ${con[142].recovered}
*Death Cases :* ${con[142].deaths}
*Critical Cases :* ${con[142].critical}
*Population :* ${con[142].population}
*Total Tests :* ${con[142].tests}
`)})
  } else if (msg.body == `-covid netherlands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Netherlands Covid19 Cases-----╕*

*Country Name :* ${con[143].country}   
*Total Cases :* ${con[143].cases}
*Active Cases :* ${con[143].active}
*Recovered Cases :* ${con[143].recovered}
*Death Cases :* ${con[143].deaths}
*Critical Cases :* ${con[143].critical}
*Population :* ${con[143].population}
*Total Tests :* ${con[143].tests}
`)})
  } else if (msg.body == `-covid newcaledonia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----New Caledonia Covid19 Cases-----╕*

*Country Name :* ${con[144].country}   
*Total Cases :* ${con[144].cases}
*Active Cases :* ${con[144].active}
*Recovered Cases :* ${con[144].recovered}
*Death Cases :* ${con[144].deaths}
*Critical Cases :* ${con[144].critical}
*Population :* ${con[144].population}
*Total Tests :* ${con[144].tests}
`)})
  } else if (msg.body == `-covid newzealand`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----New Zealand Covid19 Cases-----╕*

*Country Name :* ${con[145].country}   
*Total Cases :* ${con[145].cases}
*Active Cases :* ${con[145].active}
*Recovered Cases :* ${con[145].recovered}
*Death Cases :* ${con[145].deaths}
*Critical Cases :* ${con[145].critical}
*Population :* ${con[145].population}
*Total Tests :* ${con[145].tests}
`)})
  } else if (msg.body == `-covid nicaragua`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Nicaragua Covid19 Cases-----╕*

*Country Name :* ${con[146].country}   
*Total Cases :* ${con[146].cases}
*Active Cases :* ${con[146].active}
*Recovered Cases :* ${con[146].recovered}
*Death Cases :* ${con[146].deaths}
*Critical Cases :* ${con[146].critical}
*Population :* ${con[146].population}
*Total Tests :* ${con[146].tests}
`)})
  } else if (msg.body == `-covid niger`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Niger Covid19 Cases-----╕*

*Country Name :* ${con[147].country}   
*Total Cases :* ${con[147].cases}
*Active Cases :* ${con[147].active}
*Recovered Cases :* ${con[147].recovered}
*Death Cases :* ${con[147].deaths}
*Critical Cases :* ${con[147].critical}
*Population :* ${con[147].population}
*Total Tests :* ${con[147].tests}
`)})
  } else if (msg.body == `-covid nigeria`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Nigeria Covid19 Cases-----╕*

*Country Name :* ${con[148].country}   
*Total Cases :* ${con[148].cases}
*Active Cases :* ${con[148].active}
*Recovered Cases :* ${con[148].recovered}
*Death Cases :* ${con[148].deaths}
*Critical Cases :* ${con[148].critical}
*Population :* ${con[148].population}
*Total Tests :* ${con[148].tests}
`)})
  } else if (msg.body == `-covid norway`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Norway Covid19 Cases-----╕*

*Country Name :* ${con[149].country}   
*Total Cases :* ${con[149].cases}
*Active Cases :* ${con[149].active}
*Recovered Cases :* ${con[149].recovered}
*Death Cases :* ${con[149].deaths}
*Critical Cases :* ${con[149].critical}
*Population :* ${con[149].population}
*Total Tests :* ${con[149].tests}
`)})
  } else if (msg.body == `-covid oman`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Oman Covid19 Cases-----╕*

*Country Name :* ${con[150].country}   
*Total Cases :* ${con[150].cases}
*Active Cases :* ${con[150].active}
*Recovered Cases :* ${con[150].recovered}
*Death Cases :* ${con[150].deaths}
*Critical Cases :* ${con[150].critical}
*Population :* ${con[150].population}
*Total Tests :* ${con[150].tests}
`)})
  } else if (msg.body == `-covid pakistan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Pakistan Covid19 Cases-----╕*

*Country Name :* ${con[151].country}   
*Total Cases :* ${con[151].cases}
*Active Cases :* ${con[151].active}
*Recovered Cases :* ${con[151].recovered}
*Death Cases :* ${con[151].deaths}
*Critical Cases :* ${con[151].critical}
*Population :* ${con[151].population}
*Total Tests :* ${con[151].tests}
`)})
  } else if (msg.body == `-covid palestine`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Palestine Covid19 Cases-----╕*

*Country Name :* ${con[152].country}   
*Total Cases :* ${con[152].cases}
*Active Cases :* ${con[152].active}
*Recovered Cases :* ${con[152].recovered}
*Death Cases :* ${con[152].deaths}
*Critical Cases :* ${con[152].critical}
*Population :* ${con[152].population}
*Total Tests :* ${con[152].tests}
`)})
  } else if (msg.body == `-covid panama`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Panama Covid19 Cases-----╕*

*Country Name :* ${con[153].country}   
*Total Cases :* ${con[153].cases}
*Active Cases :* ${con[153].active}
*Recovered Cases :* ${con[153].recovered}
*Death Cases :* ${con[153].deaths}
*Critical Cases :* ${con[153].critical}
*Population :* ${con[153].population}
*Total Tests :* ${con[153].tests}
`)})
  } else if (msg.body == `-covid papuanewguinea`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Papua New Guinea Covid19 Cases-----╕*

*Country Name :* ${con[154].country}   
*Total Cases :* ${con[154].cases}
*Active Cases :* ${con[154].active}
*Recovered Cases :* ${con[154].recovered}
*Death Cases :* ${con[154].deaths}
*Critical Cases :* ${con[154].critical}
*Population :* ${con[154].population}
*Total Tests :* ${con[154].tests}
`)})
  } else if (msg.body == `-covid paraguay`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Paraguay Covid19 Cases-----╕*

*Country Name :* ${con[155].country}   
*Total Cases :* ${con[155].cases}
*Active Cases :* ${con[155].active}
*Recovered Cases :* ${con[155].recovered}
*Death Cases :* ${con[155].deaths}
*Critical Cases :* ${con[155].critical}
*Population :* ${con[155].population}
*Total Tests :* ${con[155].tests}
`)})
  } else if (msg.body == `-covid peru`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Peru Covid19 Cases-----╕*

*Country Name :* ${con[156].country}   
*Total Cases :* ${con[156].cases}
*Active Cases :* ${con[156].active}
*Recovered Cases :* ${con[156].recovered}
*Death Cases :* ${con[156].deaths}
*Critical Cases :* ${con[156].critical}
*Population :* ${con[156].population}
*Total Tests :* ${con[156].tests}
`)})
  } else if (msg.body == `-covid philippines`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Philippines Covid19 Cases-----╕*

*Country Name :* ${con[157].country}   
*Total Cases :* ${con[157].cases}
*Active Cases :* ${con[157].active}
*Recovered Cases :* ${con[157].recovered}
*Death Cases :* ${con[157].deaths}
*Critical Cases :* ${con[157].critical}
*Population :* ${con[157].population}
*Total Tests :* ${con[157].tests}
`)})
  } else if (msg.body == `-covid poland`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Poland Covid19 Cases-----╕*

*Country Name :* ${con[158].country}   
*Total Cases :* ${con[158].cases}
*Active Cases :* ${con[158].active}
*Recovered Cases :* ${con[158].recovered}
*Death Cases :* ${con[158].deaths}
*Critical Cases :* ${con[158].critical}
*Population :* ${con[158].population}
*Total Tests :* ${con[158].tests}
`)})
  } else if (msg.body == `-covid portugal`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Portugal Covid19 Cases-----╕*

*Country Name :* ${con[159].country}   
*Total Cases :* ${con[159].cases}
*Active Cases :* ${con[159].active}
*Recovered Cases :* ${con[159].recovered}
*Death Cases :* ${con[159].deaths}
*Critical Cases :* ${con[159].critical}
*Population :* ${con[159].population}
*Total Tests :* ${con[159].tests}
`)})
  } else if (msg.body == `-covid qatar`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Qatar Covid19 Cases-----╕*

*Country Name :* ${con[160].country}   
*Total Cases :* ${con[160].cases}
*Active Cases :* ${con[160].active}
*Recovered Cases :* ${con[160].recovered}
*Death Cases :* ${con[160].deaths}
*Critical Cases :* ${con[160].critical}
*Population :* ${con[160].population}
*Total Tests :* ${con[160].tests}
`)})
  } else if (msg.body == `-covid romania`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Romania Covid19 Cases-----╕*

*Country Name :* ${con[161].country}   
*Total Cases :* ${con[161].cases}
*Active Cases :* ${con[161].active}
*Recovered Cases :* ${con[161].recovered}
*Death Cases :* ${con[161].deaths}
*Critical Cases :* ${con[161].critical}
*Population :* ${con[161].population}
*Total Tests :* ${con[161].tests}
`)})
  } else if (msg.body == `-covid russia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Russia Covid19 Cases-----╕*

*Country Name :* ${con[162].country}   
*Total Cases :* ${con[162].cases}
*Active Cases :* ${con[162].active}
*Recovered Cases :* ${con[162].recovered}
*Death Cases :* ${con[162].deaths}
*Critical Cases :* ${con[162].critical}
*Population :* ${con[162].population}
*Total Tests :* ${con[162].tests}
`)})
  } else if (msg.body == `-covid rwanda`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Rwanda Covid19 Cases-----╕*

*Country Name :* ${con[163].country}   
*Total Cases :* ${con[163].cases}
*Active Cases :* ${con[163].active}
*Recovered Cases :* ${con[163].recovered}
*Death Cases :* ${con[163].deaths}
*Critical Cases :* ${con[163].critical}
*Population :* ${con[163].population}
*Total Tests :* ${con[163].tests}
`)})
  } else if (msg.body == `-covid reunion`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Réunion Covid19 Cases-----╕*

*Country Name :* ${con[164].country}   
*Total Cases :* ${con[164].cases}
*Active Cases :* ${con[164].active}
*Recovered Cases :* ${con[164].recovered}
*Death Cases :* ${con[164].deaths}
*Critical Cases :* ${con[164].critical}
*Population :* ${con[164].population}
*Total Tests :* ${con[164].tests}
`)})
  } else if (msg.body == `-covid s.korea`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----S. Korea Covid19 Cases-----╕*

*Country Name :* ${con[165].country}   
*Total Cases :* ${con[165].cases}
*Active Cases :* ${con[165].active}
*Recovered Cases :* ${con[165].recovered}
*Death Cases :* ${con[165].deaths}
*Critical Cases :* ${con[165].critical}
*Population :* ${con[165].population}
*Total Tests :* ${con[165].tests}
`)})
  } else if (msg.body == `-covid sainthelena`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Saint Helena Covid19 Cases-----╕*

*Country Name :* ${con[166].country}   
*Total Cases :* ${con[166].cases}
*Active Cases :* ${con[166].active}
*Recovered Cases :* ${con[166].recovered}
*Death Cases :* ${con[166].deaths}
*Critical Cases :* ${con[166].critical}
*Population :* ${con[166].population}
*Total Tests :* ${con[166].tests}
`)})
  } else if (msg.body == `-covid saintkittsandnevis`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Saint Kitts and Nevis Covid19 Cases-----╕*

*Country Name :* ${con[167].country}   
*Total Cases :* ${con[167].cases}
*Active Cases :* ${con[167].active}
*Recovered Cases :* ${con[167].recovered}
*Death Cases :* ${con[167].deaths}
*Critical Cases :* ${con[167].critical}
*Population :* ${con[167].population}
*Total Tests :* ${con[167].tests}
`)})
  } else if (msg.body == `-covid saintlucia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Saint Lucia Covid19 Cases-----╕*

*Country Name :* ${con[168].country}   
*Total Cases :* ${con[168].cases}
*Active Cases :* ${con[168].active}
*Recovered Cases :* ${con[168].recovered}
*Death Cases :* ${con[168].deaths}
*Critical Cases :* ${con[168].critical}
*Population :* ${con[168].population}
*Total Tests :* ${con[168].tests}
`)})
  } else if (msg.body == `-covid saintmartin`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Saint Martin Covid19 Cases-----╕*

*Country Name :* ${con[169].country}   
*Total Cases :* ${con[169].cases}
*Active Cases :* ${con[169].active}
*Recovered Cases :* ${con[169].recovered}
*Death Cases :* ${con[169].deaths}
*Critical Cases :* ${con[169].critical}
*Population :* ${con[169].population}
*Total Tests :* ${con[169].tests}
`)})
  } else if (msg.body == `-covid saintpierremiquelon`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Saint Pierre Miquelon Covid19 Cases-----╕*

*Country Name :* ${con[170].country}   
*Total Cases :* ${con[170].cases}
*Active Cases :* ${con[170].active}
*Recovered Cases :* ${con[170].recovered}
*Death Cases :* ${con[170].deaths}
*Critical Cases :* ${con[170].critical}
*Population :* ${con[170].population}
*Total Tests :* ${con[170].tests}
`)})
  } else if (msg.body == `-covid samoa`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Samoa Covid19 Cases-----╕*

*Country Name :* ${con[171].country}   
*Total Cases :* ${con[171].cases}
*Active Cases :* ${con[171].active}
*Recovered Cases :* ${con[171].recovered}
*Death Cases :* ${con[171].deaths}
*Critical Cases :* ${con[171].critical}
*Population :* ${con[171].population}
*Total Tests :* ${con[171].tests}
`)})
  } else if (msg.body == `-covid sanmarino`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----San Marino Covid19 Cases-----╕*

*Country Name :* ${con[172].country}   
*Total Cases :* ${con[172].cases}
*Active Cases :* ${con[172].active}
*Recovered Cases :* ${con[172].recovered}
*Death Cases :* ${con[172].deaths}
*Critical Cases :* ${con[172].critical}
*Population :* ${con[172].population}
*Total Tests :* ${con[172].tests}
`)})
  } else if (msg.body == `-covid saotomeandprincipe`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Sao Tome and Principe Covid19 Cases-----╕*

*Country Name :* ${con[173].country}   
*Total Cases :* ${con[173].cases}
*Active Cases :* ${con[173].active}
*Recovered Cases :* ${con[173].recovered}
*Death Cases :* ${con[173].deaths}
*Critical Cases :* ${con[173].critical}
*Population :* ${con[173].population}
*Total Tests :* ${con[173].tests}
`)})
  } else if (msg.body == `-covid saudiarabia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Saudi Arabia Covid19 Cases-----╕*

*Country Name :* ${con[174].country}   
*Total Cases :* ${con[174].cases}
*Active Cases :* ${con[174].active}
*Recovered Cases :* ${con[174].recovered}
*Death Cases :* ${con[174].deaths}
*Critical Cases :* ${con[174].critical}
*Population :* ${con[174].population}
*Total Tests :* ${con[174].tests}
`)})
  } else if (msg.body == `-covid senegal`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Senegal Covid19 Cases-----╕*

*Country Name :* ${con[175].country}   
*Total Cases :* ${con[175].cases}
*Active Cases :* ${con[175].active}
*Recovered Cases :* ${con[175].recovered}
*Death Cases :* ${con[175].deaths}
*Critical Cases :* ${con[175].critical}
*Population :* ${con[175].population}
*Total Tests :* ${con[175].tests}
`)})
  } else if (msg.body == `-covid serbia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Serbia Covid19 Cases-----╕*

*Country Name :* ${con[176].country}   
*Total Cases :* ${con[176].cases}
*Active Cases :* ${con[176].active}
*Recovered Cases :* ${con[176].recovered}
*Death Cases :* ${con[176].deaths}
*Critical Cases :* ${con[176].critical}
*Population :* ${con[176].population}
*Total Tests :* ${con[176].tests}
`)})
  } else if (msg.body == `-covid seychelles`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Seychelles Covid19 Cases-----╕*

*Country Name :* ${con[177].country}   
*Total Cases :* ${con[177].cases}
*Active Cases :* ${con[177].active}
*Recovered Cases :* ${con[177].recovered}
*Death Cases :* ${con[177].deaths}
*Critical Cases :* ${con[177].critical}
*Population :* ${con[177].population}
*Total Tests :* ${con[177].tests}
`)})
  } else if (msg.body == `-covid sierraleone`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Sierra Leone Covid19 Cases-----╕*

*Country Name :* ${con[178].country}   
*Total Cases :* ${con[178].cases}
*Active Cases :* ${con[178].active}
*Recovered Cases :* ${con[178].recovered}
*Death Cases :* ${con[178].deaths}
*Critical Cases :* ${con[178].critical}
*Population :* ${con[178].population}
*Total Tests :* ${con[178].tests}
`)})
  } else if (msg.body == `-covid singapore`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Singapore Covid19 Cases-----╕*

*Country Name :* ${con[179].country}   
*Total Cases :* ${con[179].cases}
*Active Cases :* ${con[179].active}
*Recovered Cases :* ${con[179].recovered}
*Death Cases :* ${con[179].deaths}
*Critical Cases :* ${con[179].critical}
*Population :* ${con[179].population}
*Total Tests :* ${con[179].tests}
`)})
  } else if (msg.body == `-covid sintmaarten`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Sint Maarten Covid19 Cases-----╕*

*Country Name :* ${con[180].country}   
*Total Cases :* ${con[180].cases}
*Active Cases :* ${con[180].active}
*Recovered Cases :* ${con[180].recovered}
*Death Cases :* ${con[180].deaths}
*Critical Cases :* ${con[180].critical}
*Population :* ${con[180].population}
*Total Tests :* ${con[180].tests}
`)})
  } else if (msg.body == `-covid slovakia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Slovakia Covid19 Cases-----╕*

*Country Name :* ${con[181].country}   
*Total Cases :* ${con[181].cases}
*Active Cases :* ${con[181].active}
*Recovered Cases :* ${con[181].recovered}
*Death Cases :* ${con[181].deaths}
*Critical Cases :* ${con[181].critical}
*Population :* ${con[181].population}
*Total Tests :* ${con[181].tests}
`)})
  } else if (msg.body == `-covid slovenia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Slovenia Covid19 Cases-----╕*

*Country Name :* ${con[182].country}   
*Total Cases :* ${con[182].cases}
*Active Cases :* ${con[182].active}
*Recovered Cases :* ${con[182].recovered}
*Death Cases :* ${con[182].deaths}
*Critical Cases :* ${con[182].critical}
*Population :* ${con[182].population}
*Total Tests :* ${con[182].tests}
`)})
  } else if (msg.body == `-covid solomonislands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Solomon Islands Covid19 Cases-----╕*

*Country Name :* ${con[183].country}   
*Total Cases :* ${con[183].cases}
*Active Cases :* ${con[183].active}
*Recovered Cases :* ${con[183].recovered}
*Death Cases :* ${con[183].deaths}
*Critical Cases :* ${con[183].critical}
*Population :* ${con[183].population}
*Total Tests :* ${con[183].tests}
`)})
  } else if (msg.body == `-covid somalia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Somalia Covid19 Cases-----╕*

*Country Name :* ${con[184].country}   
*Total Cases :* ${con[184].cases}
*Active Cases :* ${con[184].active}
*Recovered Cases :* ${con[184].recovered}
*Death Cases :* ${con[184].deaths}
*Critical Cases :* ${con[184].critical}
*Population :* ${con[184].population}
*Total Tests :* ${con[184].tests}
`)})
  } else if (msg.body == `-covid southafrica`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----South Africa" Covid19 Cases-----╕*

*Country Name :* ${con[185].country}   
*Total Cases :* ${con[185].cases}
*Active Cases :* ${con[185].active}
*Recovered Cases :* ${con[185].recovered}
*Death Cases :* ${con[185].deaths}
*Critical Cases :* ${con[185].critical}
*Population :* ${con[185].population}
*Total Tests :* ${con[185].tests}
`)})
  } else if (msg.body == `-covid southsudan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----South Sudan Covid19 Cases-----╕*

*Country Name :* ${con[186].country}   
*Total Cases :* ${con[186].cases}
*Active Cases :* ${con[186].active}
*Recovered Cases :* ${con[186].recovered}
*Death Cases :* ${con[186].deaths}
*Critical Cases :* ${con[186].critical}
*Population :* ${con[186].population}
*Total Tests :* ${con[186].tests}
`)})
  } else if (msg.body == `-covid spain`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Spain Covid19 Cases-----╕*

*Country Name :* ${con[187].country}   
*Total Cases :* ${con[187].cases}
*Active Cases :* ${con[187].active}
*Recovered Cases :* ${con[187].recovered}
*Death Cases :* ${con[187].deaths}
*Critical Cases :* ${con[187].critical}
*Population :* ${con[187].population}
*Total Tests :* ${con[187].tests}
`)})
  } else if (msg.body == `-covid srilanka`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Sri Lanka Covid19 Cases-----╕*

*Country Name :* ${con[188].country}   
*Total Cases :* ${con[188].cases}
*Active Cases :* ${con[188].active}
*Recovered Cases :* ${con[188].recovered}
*Death Cases :* ${con[188].deaths}
*Critical Cases :* ${con[188].critical}
*Population :* ${con[188].population}
*Total Tests :* ${con[188].tests}
`)})
  } else if (msg.body == `-covid st.barth`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----St. Barth Covid19 Cases-----╕*

*Country Name :* ${con[189].country}   
*Total Cases :* ${con[189].cases}
*Active Cases :* ${con[189].active}
*Recovered Cases :* ${con[189].recovered}
*Death Cases :* ${con[189].deaths}
*Critical Cases :* ${con[189].critical}
*Population :* ${con[189].population}
*Total Tests :* ${con[189].tests}
`)})
  } else if (msg.body == `-covid sudan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Sudan Covid19 Cases-----╕*

*Country Name :* ${con[190].country}   
*Total Cases :* ${con[190].cases}
*Active Cases :* ${con[190].active}
*Recovered Cases :* ${con[190].recovered}
*Death Cases :* ${con[190].deaths}
*Critical Cases :* ${con[190].critical}
*Population :* ${con[190].population}
*Total Tests :* ${con[190].tests}
`)})
  } else if (msg.body == `-covid suriname`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Suriname Covid19 Cases-----╕*

*Country Name :* ${con[191].country}   
*Total Cases :* ${con[191].cases}
*Active Cases :* ${con[191].active}
*Recovered Cases :* ${con[191].recovered}
*Death Cases :* ${con[191].deaths}
*Critical Cases :* ${con[191].critical}
*Population :* ${con[191].population}
*Total Tests :* ${con[191].tests}
`)})
  } else if (msg.body == `-covid swaziland`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Swaziland Covid19 Cases-----╕*

*Country Name :* ${con[192].country}   
*Total Cases :* ${con[192].cases}
*Active Cases :* ${con[192].active}
*Recovered Cases :* ${con[192].recovered}
*Death Cases :* ${con[192].deaths}
*Critical Cases :* ${con[192].critical}
*Population :* ${con[192].population}
*Total Tests :* ${con[192].tests}
`)})
  } else if (msg.body == `-covid sweden`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Sweden Covid19 Cases-----╕*

*Country Name :* ${con[193].country}   
*Total Cases :* ${con[193].cases}
*Active Cases :* ${con[193].active}
*Recovered Cases :* ${con[193].recovered}
*Death Cases :* ${con[193].deaths}
*Critical Cases :* ${con[193].critical}
*Population :* ${con[193].population}
*Total Tests :* ${con[193].tests}
`)})
  } else if (msg.body == `-covid switzerland`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Switzerland Covid19 Cases-----╕*

*Country Name :* ${con[194].country}   
*Total Cases :* ${con[194].cases}
*Active Cases :* ${con[194].active}
*Recovered Cases :* ${con[194].recovered}
*Death Cases :* ${con[194].deaths}
*Critical Cases :* ${con[194].critical}
*Population :* ${con[194].population}
*Total Tests :* ${con[194].tests}
`)})
  } else if (msg.body == `-covid syrianarabrepublic`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Syrian Arab Republic Covid19 Cases-----╕*

*Country Name :* ${con[195].country}   
*Total Cases :* ${con[195].cases}
*Active Cases :* ${con[195].active}
*Recovered Cases :* ${con[195].recovered}
*Death Cases :* ${con[195].deaths}
*Critical Cases :* ${con[195].critical}
*Population :* ${con[195].population}
*Total Tests :* ${con[195].tests}
`)})
  } else if (msg.body == `-covid taiwan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Taiwan Covid19 Cases-----╕*

*Country Name :* ${con[196].country}   
*Total Cases :* ${con[196].cases}
*Active Cases :* ${con[196].active}
*Recovered Cases :* ${con[196].recovered}
*Death Cases :* ${con[196].deaths}
*Critical Cases :* ${con[196].critical}
*Population :* ${con[196].population}
*Total Tests :* ${con[196].tests}
`)})
  } else if (msg.body == `-covid tajikistan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Tajikistan Covid19 Cases-----╕*

*Country Name :* ${con[197].country}   
*Total Cases :* ${con[197].cases}
*Active Cases :* ${con[197].active}
*Recovered Cases :* ${con[197].recovered}
*Death Cases :* ${con[197].deaths}
*Critical Cases :* ${con[197].critical}
*Population :* ${con[197].population}
*Total Tests :* ${con[197].tests}
`)})
  } else if (msg.body == `-covid tanzania`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Tanzania Covid19 Cases-----╕*

*Country Name :* ${con[198].country}   
*Total Cases :* ${con[198].cases}
*Active Cases :* ${con[198].active}
*Recovered Cases :* ${con[198].recovered}
*Death Cases :* ${con[198].deaths}
*Critical Cases :* ${con[198].critical}
*Population :* ${con[198].population}
*Total Tests :* ${con[198].tests}
`)})
  } else if (msg.body == `-covid thailand`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Thailand Covid19 Cases-----╕*

*Country Name :* ${con[199].country}   
*Total Cases :* ${con[199].cases}
*Active Cases :* ${con[199].active}
*Recovered Cases :* ${con[199].recovered}
*Death Cases :* ${con[199].deaths}
*Critical Cases :* ${con[199].critical}
*Population :* ${con[199].population}
*Total Tests :* ${con[199].tests}
`)})
  } else if (msg.body == `-covid timor-leste`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Timor-Leste Covid19 Cases-----╕*

*Country Name :* ${con[200].country}   
*Total Cases :* ${con[200].cases}
*Active Cases :* ${con[200].active}
*Recovered Cases :* ${con[200].recovered}
*Death Cases :* ${con[200].deaths}
*Critical Cases :* ${con[200].critical}
*Population :* ${con[200].population}
*Total Tests :* ${con[200].tests}
`)})
  } else if (msg.body == `-covid togo`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Togo Covid19 Cases-----╕*

*Country Name :* ${con[201].country}   
*Total Cases :* ${con[201].cases}
*Active Cases :* ${con[201].active}
*Recovered Cases :* ${con[201].recovered}
*Death Cases :* ${con[201].deaths}
*Critical Cases :* ${con[201].critical}
*Population :* ${con[201].population}
*Total Tests :* ${con[201].tests}
`)})
  } else if (msg.body == `-covid trinidadandtobago`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Trinidad and Tobago Covid19 Cases-----╕*

*Country Name :* ${con[202].country}   
*Total Cases :* ${con[202].cases}
*Active Cases :* ${con[202].active}
*Recovered Cases :* ${con[202].recovered}
*Death Cases :* ${con[202].deaths}
*Critical Cases :* ${con[202].critical}
*Population :* ${con[202].population}
*Total Tests :* ${con[202].tests}
`)})
  } else if (msg.body == `-covid tunisia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Tunisia Covid19 Cases-----╕*

*Country Name :* ${con[203].country}   
*Total Cases :* ${con[203].cases}
*Active Cases :* ${con[203].active}
*Recovered Cases :* ${con[203].recovered}
*Death Cases :* ${con[203].deaths}
*Critical Cases :* ${con[203].critical}
*Population :* ${con[203].population}
*Total Tests :* ${con[203].tests}
`)})
  } else if (msg.body == `-covid turkey`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Turkey Covid19 Cases-----╕*

*Country Name :* ${con[204].country}   
*Total Cases :* ${con[204].cases}
*Active Cases :* ${con[204].active}
*Recovered Cases :* ${con[204].recovered}
*Death Cases :* ${con[204].deaths}
*Critical Cases :* ${con[204].critical}
*Population :* ${con[204].population}
*Total Tests :* ${con[204].tests}
`)})
  } else if (msg.body == `-covid turksandcaicosislands`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Turks and Caicos Islands Covid19 Cases-----╕*

*Country Name :* ${con[205].country}   
*Total Cases :* ${con[205].cases}
*Active Cases :* ${con[205].active}
*Recovered Cases :* ${con[205].recovered}
*Death Cases :* ${con[205].deaths}
*Critical Cases :* ${con[205].critical}
*Population :* ${con[205].population}
*Total Tests :* ${con[205].tests}
`)})
  } else if (msg.body == `-covid uae`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----UAE Covid19 Cases-----╕*

*Country Name :* ${con[206].country}   
*Total Cases :* ${con[206].cases}
*Active Cases :* ${con[206].active}
*Recovered Cases :* ${con[206].recovered}
*Death Cases :* ${con[206].deaths}
*Critical Cases :* ${con[206].critical}
*Population :* ${con[206].population}
*Total Tests :* ${con[206].tests}
`)})
  } else if (msg.body == `-covid uk`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----UK Covid19 Cases-----╕*

*Country Name :* ${con[207].country}   
*Total Cases :* ${con[207].cases}
*Active Cases :* ${con[207].active}
*Recovered Cases :* ${con[207].recovered}
*Death Cases :* ${con[207].deaths}
*Critical Cases :* ${con[207].critical}
*Population :* ${con[207].population}
*Total Tests :* ${con[207].tests}
`)})
  } else if (msg.body == `-covid usa`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----USA Covid19 Cases-----╕*

*Country Name :* ${con[208].country}   
*Total Cases :* ${con[208].cases}
*Active Cases :* ${con[208].active}
*Recovered Cases :* ${con[208].recovered}
*Death Cases :* ${con[208].deaths}
*Critical Cases :* ${con[208].critical}
*Population :* ${con[208].population}
*Total Tests :* ${con[208].tests}
`)})
  } else if (msg.body == `-covid uganda`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Uganda Covid19 Cases-----╕*

*Country Name :* ${con[209].country}   
*Total Cases :* ${con[209].cases}
*Active Cases :* ${con[209].active}
*Recovered Cases :* ${con[209].recovered}
*Death Cases :* ${con[209].deaths}
*Critical Cases :* ${con[209].critical}
*Population :* ${con[209].population}
*Total Tests :* ${con[209].tests}
`)})
  } else if (msg.body == `-covid ukraine`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Ukraine Covid19 Cases-----╕*

*Country Name :* ${con[210].country}   
*Total Cases :* ${con[210].cases}
*Active Cases :* ${con[210].active}
*Recovered Cases :* ${con[210].recovered}
*Death Cases :* ${con[210].deaths}
*Critical Cases :* ${con[210].critical}
*Population :* ${con[210].population}
*Total Tests :* ${con[210].tests}
`)})
  } else if (msg.body == `-covid uruguay`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Uruguay Covid19 Cases-----╕*

*Country Name :* ${con[211].country}   
*Total Cases :* ${con[211].cases}
*Active Cases :* ${con[211].active}
*Recovered Cases :* ${con[211].recovered}
*Death Cases :* ${con[211].deaths}
*Critical Cases :* ${con[211].critical}
*Population :* ${con[211].population}
*Total Tests :* ${con[211].tests}
`)})
  } else if (msg.body == `-covid uzbekistan`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Uzbekistan Covid19 Cases-----╕*

*Country Name :* ${con[212].country}   
*Total Cases :* ${con[212].cases}
*Active Cases :* ${con[212].active}
*Recovered Cases :* ${con[212].recovered}
*Death Cases :* ${con[212].deaths}
*Critical Cases :* ${con[212].critical}
*Population :* ${con[212].population}
*Total Tests :* ${con[212].tests}
`)})
  } else if (msg.body == `-covid vanuatu`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Vanuatu Covid19 Cases-----╕*

*Country Name :* ${con[213].country}   
*Total Cases :* ${con[213].cases}
*Active Cases :* ${con[213].active}
*Recovered Cases :* ${con[213].recovered}
*Death Cases :* ${con[213].deaths}
*Critical Cases :* ${con[213].critical}
*Population :* ${con[213].population}
*Total Tests :* ${con[213].tests}
`)})
  } else if (msg.body == `-covid venezuela`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Venezuela Covid19 Cases-----╕*

*Country Name :* ${con[214].country}   
*Total Cases :* ${con[214].cases}
*Active Cases :* ${con[214].active}
*Recovered Cases :* ${con[214].recovered}
*Death Cases :* ${con[214].deaths}
*Critical Cases :* ${con[214].critical}
*Population :* ${con[214].population}
*Total Tests :* ${con[214].tests}
`)})
  } else if (msg.body == `-covid vietnam`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Vietnam Covid19 Cases-----╕*

*Country Name :* ${con[215].country}   
*Total Cases :* ${con[215].cases}
*Active Cases :* ${con[215].active}
*Recovered Cases :* ${con[215].recovered}
*Death Cases :* ${con[215].deaths}
*Critical Cases :* ${con[215].critical}
*Population :* ${con[215].population}
*Total Tests :* ${con[215].tests}
`)})
  } else if (msg.body == `-covid wallisandfutuna`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Wallis and Futuna Covid19 Cases-----╕*

*Country Name :* ${con[216].country}   
*Total Cases :* ${con[216].cases}
*Active Cases :* ${con[216].active}
*Recovered Cases :* ${con[216].recovered}
*Death Cases :* ${con[216].deaths}
*Critical Cases :* ${con[216].critical}
*Population :* ${con[216].population}
*Total Tests :* ${con[216].tests}
`)})
  } else if (msg.body == `-covid westernsahara`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Western Sahara Covid19 Cases-----╕*

*Country Name :* ${con[217].country}   
*Total Cases :* ${con[217].cases}
*Active Cases :* ${con[217].active}
*Recovered Cases :* ${con[217].recovered}
*Death Cases :* ${con[217].deaths}
*Critical Cases :* ${con[217].critical}
*Population :* ${con[217].population}
*Total Tests :* ${con[217].tests}
`)})
  } else if (msg.body == `-covid yemen`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Yemen Covid19 Cases-----╕*

*Country Name :* ${con[218].country}   
*Total Cases :* ${con[218].cases}
*Active Cases :* ${con[218].active}
*Recovered Cases :* ${con[218].recovered}
*Death Cases :* ${con[218].deaths}
*Critical Cases :* ${con[218].critical}
*Population :* ${con[218].population}
*Total Tests :* ${con[218].tests}
`)})
  } else if (msg.body == `-covid zambia`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Zambia Covid19 Cases-----╕*

*Country Name :* ${con[219].country}   
*Total Cases :* ${con[219].cases}
*Active Cases :* ${con[219].active}
*Recovered Cases :* ${con[219].recovered}
*Death Cases :* ${con[219].deaths}
*Critical Cases :* ${con[219].critical}
*Population :* ${con[219].population}
*Total Tests :* ${con[219].tests}
`)})
  } else if (msg.body == `-covid zimbabwe`){
    fetch('https://disease.sh/v3/covid-19/countries')
    .then(res => res.json()).then(con=>{
      msg.reply(`*╒-----Zimbabwe Covid19 Cases-----╕*

*Country Name :* ${con[220].country}   
*Total Cases :* ${con[220].cases}
*Active Cases :* ${con[220].active}
*Recovered Cases :* ${con[220].recovered}
*Death Cases :* ${con[220].deaths}
*Critical Cases :* ${con[220].critical}
*Population :* ${con[220].population}
*Total Tests :* ${con[220].tests}
`)})

//  State Wise
// Andhra Pradesh
} else if (msg.body == `-covid anantapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Anantapur Covid19 Cases-----╕*

*District Name :* Anantapur, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData.Anantapur.confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData.Anantapur.active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData.Anantapur.recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData.Anantapur.deceased} 
`
)})
} else if (msg.body == `-covid eastgodavari`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----East Godavari Covid19 Cases-----╕*

*District Name :* East Godavari, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData['East Godavari'].confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData['East Godavari'].active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData['East Godavari'].recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData['East Godavari'].deceased} 
`
)})
} else if (msg.body == `-covid guntur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Guntur Covid19 Cases-----╕*

*District Name :* Guntur, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData.Guntur.confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData.Guntur.active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData.Guntur.recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData.Guntur.deceased} 
`
)})
} else if (msg.body == `-covid chittoor`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Chittoor Covid19 Cases-----╕*

*District Name :* Chittoor, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData.Chittoor.confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData.Chittoor.active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData.Chittoor.recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData.Chittoor.deceased} 
`

)})
} else if (msg.body == `-covid krishna`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Krishna Covid19 Cases-----╕*

*District Name :* Krishna, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData.Krishna.confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData.Krishna.active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData.Krishna.recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData.Krishna.deceased} 
`

)})
} else if (msg.body == `-covid kurnool`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kurnool Covid19 Cases-----╕*

*District Name :* Kurnool, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData.Kurnool.confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData.Kurnool.active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData.Kurnool.recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData.Kurnool.deceased} 
`

)})
} else if (msg.body == `-covid prakasam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Prakasam Covid19 Cases-----╕*

*District Name :* Prakasam, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData.Prakasam.confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData.Prakasam.active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData.Prakasam.recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData.Prakasam.deceased} 
`

)})
} else if (msg.body == `-covid spsnellore`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----S.P.S. Nellore Covid19 Cases-----╕*

*District Name :* S.P.S. Nellore, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData['S.P.S. Nellore'].confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData['S.P.S. Nellore'].active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData['S.P.S. Nellore'].recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData['S.P.S. Nellore'].deceased} 
`

)})
} else if (msg.body == `-covid srikakulam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Srikakulam Covid19 Cases-----╕*

*District Name :* Srikakulam, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData.Srikakulam.confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData.Srikakulam.active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData.Srikakulam.recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData.Srikakulam.deceased} 
`

)})
} else if (msg.body == `-covid visakhapatnam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Visakhapatnam Covid19 Cases-----╕*

*District Name :* Visakhapatnam, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData.Visakhapatnam.confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData.Visakhapatnam.active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData.Visakhapatnam.recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData.Visakhapatnam.deceased} 
`

)})
} else if (msg.body == `-covid vizianagaram`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Vizianagaram Covid19 Cases-----╕*

*District Name :* Vizianagaram, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData.Vizianagaram.confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData.Vizianagaram.active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData.Vizianagaram.recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData.Vizianagaram.deceased} 
`

)})
} else if (msg.body == `-covid westgodavari`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----West Godavari Covid19 Cases-----╕*

*District Name :* West Godavari, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData['West Godavari'].confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData['West Godavari'].active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData['West Godavari'].recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData['West Godavari'].deceased} 
`

)})
} else if (msg.body == `-covid ysrkadapa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Y.S.R. Kadapa Covid19 Cases-----╕*

*District Name :* Y.S.R. Kadapa, AP
*Total Cases :* ${con['Andhra Pradesh'].districtData['Y.S.R. Kadapa'].confirmed}
*Active Cases :* ${con['Andhra Pradesh'].districtData['Y.S.R. Kadapa'].active}
*Recovered Cases :* ${con['Andhra Pradesh'].districtData['Y.S.R. Kadapa'].recovered}
*Death Cases :* ${con['Andhra Pradesh'].districtData['Y.S.R. Kadapa'].deceased} 
`

)})

//  Arunachal Pradesh

} else if (msg.body == `-covid anjaw`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Anjaw Covid19 Cases-----╕*

*District Name :* Anjaw, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData.Anjaw.confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData.Anjaw.active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData.Anjaw.recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData.Anjaw.deceased} 
`

)})
} else if (msg.body == `-covid changlang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----changlang Covid19 Cases-----╕*

*District Name :* changlang, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData.changlang.confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData.changlang.active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData.changlang.recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData.changlang.deceased} 
`

)})
} else if (msg.body == `-covid eastkameng`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----East Kameng Covid19 Cases-----╕*

*District Name :* East Kameng, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['East Kameng'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['East Kameng'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['East Kameng'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['East Kameng'].deceased} 
`

)})
} else if (msg.body == `-covid eastsiang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----East Siang Covid19 Cases-----╕*

*District Name :* East Siang, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['East Siang'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['East Siang'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['East Siang'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['East Siang'].deceased} 
`

)})
} else if (msg.body == `-covid Kamle`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kamle Covid19 Cases-----╕*

*District Name :* Kamle, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData.Kamle.confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData.Kamle.active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData.Kamle.recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData.Kamle.deceased} 
`

)})
} else if (msg.body == `-covid kradaadi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kra Daadi Covid19 Cases-----╕*

*District Name :* Kra Daadi", AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Kra Daadi'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Kra Daadi'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Kra Daadi'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Kra Daadi'].deceased} 
`

)})
} else if (msg.body == `-covid kurungkumey`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kurung Kumey Covid19 Cases-----╕*

*District Name :* Kurung Kumey, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Kurung Kumey'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Kurung Kumey'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Kurung Kumey'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Kurung Kumey'].deceased} 
`

)})
} else if (msg.body == `-covid leparada`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Lepa Rada Covid19 Cases-----╕*

*District Name :* Lepa Rada, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Lepa Rada'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Lepa Rada'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Lepa Rada'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Lepa Rada'].deceased} 
`

)})
} else if (msg.body == `-covid lohit`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Lohit Covid19 Cases-----╕*

*District Name :* Lohit, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData.Lohit.confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData.Lohit.active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData.Lohit.recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData.Lohit.deceased} 
`

)})
} else if (msg.body == `-covid Longding`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Longding Covid19 Cases-----╕*

*District Name :* Longding, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData.Longding.confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData.Longding.active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData.Longding.recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData.Longding.deceased} 
`

)})
} else if (msg.body == `-covid lowerdibangvalley`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Lower Dibang Valley Covid19 Cases-----╕*

*District Name :* Lower Dibang Valley, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Lower Dibang Valley'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Lower Dibang Valley'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Lower Dibang Valley'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Lower Dibang Valley'].deceased} 
`

)})
} else if (msg.body == `-covid lowersiang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Lower Siang Covid19 Cases-----╕*

*District Name :* Lower Siang", AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Lower Siang'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Lower Siang'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Lower Siang'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Lower Siang'].deceased} 
`

)})
} else if (msg.body == `-covid lowersubansiri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Lower Subansiri Covid19 Cases-----╕*

*District Name :* Lower Subansiri, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Lower Subansiri'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Lower Subansiri'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Lower Subansiri'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Lower Subansiri'].deceased} 
`

)})
} else if (msg.body == `-covid namsai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Namsai Covid19 Cases-----╕*

*District Name :* Namsai, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData.Namsai.confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData.Namsai.active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData.Namsai.recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData.Namsai.deceased} 
`

)})
} else if (msg.body == `-covid pakkekessang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Pakke Kessang Covid19 Cases-----╕*

*District Name :* Pakke Kessang, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Pakke Kessang'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Pakke Kessang'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Pakke Kessang'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Pakke Kessang'].deceased} 
`

)})

} else if (msg.body == `-covid papumpare`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Papum Pare Covid19 Cases-----╕*

*District Name :* Papum Pare, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Papum Pare'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Papum Pare'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Papum Pare'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Papum Pare'].deceased} 
`

)})

} else if (msg.body == `-covid shiyomi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Shi Yomi Covid19 Cases-----╕*

*District Name :* Shi Yomi, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Shi Yomi'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Shi Yomi'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Shi Yomi'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Shi Yomi'].deceased} 
`

)})

} else if (msg.body == `-covid siang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Siang Covid19 Cases-----╕*

*District Name :* Siang, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData.Siang.confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData.Siang.active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData.Siang.recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData.Siang.deceased} 
`

)})

} else if (msg.body == `-covid tawang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Tawang Covid19 Cases-----╕*

*District Name :* Tawang, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData.Tawang.confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData.Tawang.active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData.Tawang.recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData.Tawang.deceased} 
`

)})

} else if (msg.body == `-covid tirap`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Tirap Covid19 Cases-----╕*

*District Name :* Tirap, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData.Tirap.confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData.Tirap.active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData.Tirap.recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData.Tirap.deceased} 
`

)})

} else if (msg.body == `-covid upperdibangvalley`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Upper Dibang Valley Covid19 Cases-----╕*

*District Name :* Upper Dibang Valley, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Upper Dibang Valley'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Upper Dibang Valley'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Upper Dibang Valley'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Upper Dibang Valley'].deceased} 
`

)})

} else if (msg.body == `-covid uppersiang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Upper Siang Covid19 Cases-----╕*

*District Name :* Upper Siang, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Upper Siang'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Upper Siang'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Upper Siang'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Upper Siang'].deceased} 
`

)})

} else if (msg.body == `-covid uppersubansiri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Upper Subansiri Covid19 Cases-----╕*

*District Name :* Upper Subansiri, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['Upper Subansiri'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['Upper Subansiri'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['Upper Subansiri'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['Upper Subansiri'].deceased} 
`

)})

} else if (msg.body == `-covid westkameng`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----West Kameng Covid19 Cases-----╕*

*District Name :* West Kameng, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['West Kameng'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['West Kameng'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['West Kameng'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['West Kameng'].deceased} 
`

)})

} else if (msg.body == `-covid westsiang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----West Siang Covid19 Cases-----╕*

*District Name :* West Siang, AR
*Total Cases :* ${con['Arunachal Pradesh'].districtData['West Siang'].confirmed}
*Active Cases :* ${con['Arunachal Pradesh'].districtData['West Siang'].active}
*Recovered Cases :* ${con['Arunachal Pradesh'].districtData['West Siang'].recovered}
*Death Cases :* ${con['Arunachal Pradesh'].districtData['West Siang'].deceased} 
`

)})

} else if (msg.body == `-covid baksa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Baksa Covid19 Cases-----╕*

*District Name :* Baksa, AS
*Total Cases :* ${con.Assam.districtData.Baksa.confirmed}
*Active Cases :* ${con.Assam.districtData.Baksa.active}
*Recovered Cases :* ${con.Assam.districtData.Baksa.recovered}
*Death Cases :* ${con.Assam.districtData.Baksa.deceased} 
`

)})

} else if (msg.body == `-covid barpeta`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Barpeta Covid19 Cases-----╕*

*District Name :* Barpeta, AS
*Total Cases :* ${con.Assam.districtData.Barpeta.confirmed}
*Active Cases :* ${con.Assam.districtData.Barpeta.active}
*Recovered Cases :* ${con.Assam.districtData.Barpeta.recovered}
*Death Cases :* ${con.Assam.districtData.Barpeta.deceased} 
`

)})
} else if (msg.body == `-covid biswanath`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Biswanath Covid19 Cases-----╕*

*District Name :* Biswanath, AS
*Total Cases :* ${con.Assam.districtData.Biswanath.confirmed}
*Active Cases :* ${con.Assam.districtData.Biswanath.active}
*Recovered Cases :* ${con.Assam.districtData.Biswanath.recovered}
*Death Cases :* ${con.Assam.districtData.Biswanath.deceased} 
`

)})
} else if (msg.body == `-covid bongaigaon`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Bongaigaon Covid19 Cases-----╕*

*District Name :* Bongaigaon, AS
*Total Cases :* ${con.Assam.districtData.Bongaigaon.confirmed}
*Active Cases :* ${con.Assam.districtData.Bongaigaon.active}
*Recovered Cases :* ${con.Assam.districtData.Bongaigaon.recovered}
*Death Cases :* ${con.Assam.districtData.Bongaigaon.deceased} 
`

)})
} else if (msg.body == `-covid cachar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Cachar Covid19 Cases-----╕*

*District Name :* Cachar, AS
*Total Cases :* ${con.Assam.districtData.Cachar.confirmed}
*Active Cases :* ${con.Assam.districtData.Cachar.active}
*Recovered Cases :* ${con.Assam.districtData.Cachar.recovered}
*Death Cases :* ${con.Assam.districtData.Cachar.deceased} 
`

)})
} else if (msg.body == `-covid charaideo`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Charaideo Covid19 Cases-----╕*

*District Name :* Charaideo, AS
*Total Cases :* ${con.Assam.districtData.Charaideo.confirmed}
*Active Cases :* ${con.Assam.districtData.Charaideo.active}
*Recovered Cases :* ${con.Assam.districtData.Charaideo.recovered}
*Death Cases :* ${con.Assam.districtData.Charaideo.deceased} 
`

)})
} else if (msg.body == `-covid chirang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Chirang Covid19 Cases-----╕*

*District Name :* Chirang, AS
*Total Cases :* ${con.Assam.districtData.Chirang.confirmed}
*Active Cases :* ${con.Assam.districtData.Chirang.active}
*Recovered Cases :* ${con.Assam.districtData.Chirang.recovered}
*Death Cases :* ${con.Assam.districtData.Chirang.deceased} 
`

)})
} else if (msg.body == `-covid darrang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Darrang Covid19 Cases-----╕*

*District Name :* Darrang, AS
*Total Cases :* ${con.Assam.districtData.Darrang.confirmed}
*Active Cases :* ${con.Assam.districtData.Darrang.active}
*Recovered Cases :* ${con.Assam.districtData.Darrang.recovered}
*Death Cases :* ${con.Assam.districtData.Darrang.deceased} 
`

)})
} else if (msg.body == `-covid dhemaji`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Dhemaji Covid19 Cases-----╕*

*District Name :* Dhemaji, AS
*Total Cases :* ${con.Assam.districtData.Dhemaji.confirmed}
*Active Cases :* ${con.Assam.districtData.Dhemaji.active}
*Recovered Cases :* ${con.Assam.districtData.Dhemaji.recovered}
*Death Cases :* ${con.Assam.districtData.Dhemaji.deceased} 
`

)})
} else if (msg.body == `-covid dhubri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Dhubri Covid19 Cases-----╕*

*District Name :* Dhubri, AS
*Total Cases :* ${con.Assam.districtData.Dhubri.confirmed}
*Active Cases :* ${con.Assam.districtData.Dhubri.active}
*Recovered Cases :* ${con.Assam.districtData.Dhubri.recovered}
*Death Cases :* ${con.Assam.districtData.Dhubri.deceased} 
`

)})
} else if (msg.body == `-covid dibrugarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Dibrugarh Covid19 Cases-----╕*

*District Name :* Dibrugarh, AS
*Total Cases :* ${con.Assam.districtData.Dibrugarh.confirmed}
*Active Cases :* ${con.Assam.districtData.Dibrugarh.active}
*Recovered Cases :* ${con.Assam.districtData.Dibrugarh.recovered}
*Death Cases :* ${con.Assam.districtData.Dibrugarh.deceased} 
`

)})
} else if (msg.body == `-covid dimahasao`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Dima Hasao Covid19 Cases-----╕*

*District Name :* Dima Hasao, AS
*Total Cases :* ${con.Assam.districtData['Dima Hasao'].confirmed}
*Active Cases :* ${con.Assam.districtData['Dima Hasao'].active}
*Recovered Cases :* ${con.Assam.districtData['Dima Hasao'].recovered}
*Death Cases :* ${con.Assam.districtData['Dima Hasao'].deceased} 
`

)})
} else if (msg.body == `-covid goalpara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Goalpara Covid19 Cases-----╕*

*District Name :* Goalpara, AS
*Total Cases :* ${con.Assam.districtData.Goalpara.confirmed}
*Active Cases :* ${con.Assam.districtData.Goalpara.active}
*Recovered Cases :* ${con.Assam.districtData.Goalpara.recovered}
*Death Cases :* ${con.Assam.districtData.Goalpara.deceased} 
`

)})
} else if (msg.body == `-covid golaghat`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Golaghat Covid19 Cases-----╕*

*District Name :* Golaghat, AS
*Total Cases :* ${con.Assam.districtData.Golaghat.confirmed}
*Active Cases :* ${con.Assam.districtData.Golaghat.active}
*Recovered Cases :* ${con.Assam.districtData.Golaghat.recovered}
*Death Cases :* ${con.Assam.districtData.Golaghat.deceased} 
`

)})
} else if (msg.body == `-covid hailakandi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Hailakandi Covid19 Cases-----╕*

*District Name :* Hailakandi, AS
*Total Cases :* ${con.Assam.districtData.Hailakandi.confirmed}
*Active Cases :* ${con.Assam.districtData.Hailakandi.active}
*Recovered Cases :* ${con.Assam.districtData.Hailakandi.recovered}
*Death Cases :* ${con.Assam.districtData.Hailakandi.deceased} 
`

)})
} else if (msg.body == `-covid hojai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Hojai Covid19 Cases-----╕*

*District Name :* Hojai, AS
*Total Cases :* ${con.Assam.districtData.Hojai.confirmed}
*Active Cases :* ${con.Assam.districtData.Hojai.active}
*Recovered Cases :* ${con.Assam.districtData.Hojai.recovered}
*Death Cases :* ${con.Assam.districtData.Hojai.deceased} 
`

)})
} else if (msg.body == `-covid jorhat`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Jorhat Covid19 Cases-----╕*

*District Name :* Jorhat, AS
*Total Cases :* ${con.Assam.districtData.Jorhat.confirmed}
*Active Cases :* ${con.Assam.districtData.Jorhat.active}
*Recovered Cases :* ${con.Assam.districtData.Jorhat.recovered}
*Death Cases :* ${con.Assam.districtData.Jorhat.deceased} 
`

)})
} else if (msg.body == `-covid kamrup`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kamrup Covid19 Cases-----╕*

*District Name :* Kamrup, AS
*Total Cases :* ${con.Assam.districtData.Kamrup.confirmed}
*Active Cases :* ${con.Assam.districtData.Kamrup.active}
*Recovered Cases :* ${con.Assam.districtData.Kamrup.recovered}
*Death Cases :* ${con.Assam.districtData.Kamrup.deceased} 
`

)})
} else if (msg.body == `-covid kamrupmetropolitan`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kamrup Metropolitan Covid19 Cases-----╕*

*District Name :* Kamrup Metropolitan, AS
*Total Cases :* ${con.Assam.districtData['Kamrup Metropolitan'].confirmed}
*Active Cases :* ${con.Assam.districtData['Kamrup Metropolitan'].active}
*Recovered Cases :* ${con.Assam.districtData['Kamrup Metropolitan'].recovered}
*Death Cases :* ${con.Assam.districtData['Kamrup Metropolitan'].deceased} 
`

)})
} else if (msg.body == `-covid karbianglong`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Karbi Anglong Covid19 Cases-----╕*

*District Name :* Karbi Anglong, AS
*Total Cases :* ${con.Assam.districtData['Karbi Anglong'].confirmed}
*Active Cases :* ${con.Assam.districtData['Karbi Anglong'].active}
*Recovered Cases :* ${con.Assam.districtData['Karbi Anglong'].recovered}
*Death Cases :* ${con.Assam.districtData['Karbi Anglong'].deceased} 
`

)})
} else if (msg.body == `-covid karimganj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Karimganj Covid19 Cases-----╕*

*District Name :* Karimganj, AS
*Total Cases :* ${con.Assam.districtData.Karimganj.confirmed}
*Active Cases :* ${con.Assam.districtData.Karimganj.active}
*Recovered Cases :* ${con.Assam.districtData.Karimganj.recovered}
*Death Cases :* ${con.Assam.districtData.Karimganj.deceased} 
`

)})
} else if (msg.body == `-covid kokrajhar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kokrajhar Covid19 Cases-----╕*

*District Name :* Kokrajhar, AS
*Total Cases :* ${con.Assam.districtData.Kokrajhar.confirmed}
*Active Cases :* ${con.Assam.districtData.Kokrajhar.active}
*Recovered Cases :* ${con.Assam.districtData.Kokrajhar.recovered}
*Death Cases :* ${con.Assam.districtData.Kokrajhar.deceased} 
`

)})
} else if (msg.body == `-covid lakhimpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Lakhimpur Covid19 Cases-----╕*

*District Name :* Lakhimpur, AS
*Total Cases :* ${con.Assam.districtData.Lakhimpur.confirmed}
*Active Cases :* ${con.Assam.districtData.Lakhimpur.active}
*Recovered Cases :* ${con.Assam.districtData.Lakhimpur.recovered}
*Death Cases :* ${con.Assam.districtData.Lakhimpur.deceased} 
`

)})
} else if (msg.body == `-covid majuli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Majuli Covid19 Cases-----╕*

*District Name :* Majuli, AS
*Total Cases :* ${con.Assam.districtData.Majuli.confirmed}
*Active Cases :* ${con.Assam.districtData.Majuli.active}
*Recovered Cases :* ${con.Assam.districtData.Majuli.recovered}
*Death Cases :* ${con.Assam.districtData.Majuli.deceased} 
`

)})
} else if (msg.body == `-covid morigaon`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Morigaon Covid19 Cases-----╕*

*District Name :* Morigaon, AS
*Total Cases :* ${con.Assam.districtData.Morigaon.confirmed}
*Active Cases :* ${con.Assam.districtData.Morigaon.active}
*Recovered Cases :* ${con.Assam.districtData.Morigaon.recovered}
*Death Cases :* ${con.Assam.districtData.Morigaon.deceased} 
`

)})
} else if (msg.body == `-covid nagaon`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Nagaon Covid19 Cases-----╕*

*District Name :* Nagaon, AS
*Total Cases :* ${con.Assam.districtData.Nagaon.confirmed}
*Active Cases :* ${con.Assam.districtData.Nagaon.active}
*Recovered Cases :* ${con.Assam.districtData.Nagaon.recovered}
*Death Cases :* ${con.Assam.districtData.Nagaon.deceased} 
`

)})
} else if (msg.body == `-covid nalbari`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Nalbari Covid19 Cases-----╕*

*District Name :* Nalbari, AS
*Total Cases :* ${con.Assam.districtData.Nalbari.confirmed}
*Active Cases :* ${con.Assam.districtData.Nalbari.active}
*Recovered Cases :* ${con.Assam.districtData.Nalbari.recovered}
*Death Cases :* ${con.Assam.districtData.Nalbari.deceased} 
`

)})
} else if (msg.body == `-covid sivasagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Sivasagar Covid19 Cases-----╕*

*District Name :* Sivasagar, AS
*Total Cases :* ${con.Assam.districtData.Sivasagar.confirmed}
*Active Cases :* ${con.Assam.districtData.Sivasagar.active}
*Recovered Cases :* ${con.Assam.districtData.Sivasagar.recovered}
*Death Cases :* ${con.Assam.districtData.Sivasagar.deceased} 
`

)})
} else if (msg.body == `-covid sonitpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Sonitpur Covid19 Cases-----╕*

*District Name :* Sonitpur, AS
*Total Cases :* ${con.Assam.districtData.Sonitpur.confirmed}
*Active Cases :* ${con.Assam.districtData.Sonitpur.active}
*Recovered Cases :* ${con.Assam.districtData.Sonitpur.recovered}
*Death Cases :* ${con.Assam.districtData.Sonitpur.deceased} 
`

)})
} else if (msg.body == `-covid southsalmaramankachar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----South Salmara Mankachar Covid19 Cases-----╕*

*District Name :* South Salmara Mankachar, AS
*Total Cases :* ${con.Assam.districtData['South Salmara Mankachar'].confirmed}
*Active Cases :* ${con.Assam.districtData['South Salmara Mankachar'].active}
*Recovered Cases :* ${con.Assam.districtData['South Salmara Mankachar'].recovered}
*Death Cases :* ${con.Assam.districtData['South Salmara Mankachar'].deceased} 
`

)})
} else if (msg.body == `-covid tinsukia`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Tinsukia Covid19 Cases-----╕*

*District Name :* Tinsukia, AS
*Total Cases :* ${con.Assam.districtData.Tinsukia.confirmed}
*Active Cases :* ${con.Assam.districtData.Tinsukia.active}
*Recovered Cases :* ${con.Assam.districtData.Tinsukia.recovered}
*Death Cases :* ${con.Assam.districtData.Tinsukia.deceased} 
`

)})
} else if (msg.body == `-covid udalguri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Udalguri Covid19 Cases-----╕*

*District Name :* Udalguri, AS
*Total Cases :* ${con.Assam.districtData.Udalguri.confirmed}
*Active Cases :* ${con.Assam.districtData.Udalguri.active}
*Recovered Cases :* ${con.Assam.districtData.Udalguri.recovered}
*Death Cases :* ${con.Assam.districtData.Udalguri.deceased} 
`

)})
} else if (msg.body == `-covid westkarbianglong`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----West Karbi Anglong Covid19 Cases-----╕*

*District Name :* West Karbi Anglong, AS
*Total Cases :* ${con.Assam.districtData['West Karbi Anglong'].confirmed}
*Active Cases :* ${con.Assam.districtData['West Karbi Anglong'].active}
*Recovered Cases :* ${con.Assam.districtData['West Karbi Anglong'].recovered}
*Death Cases :* ${con.Assam.districtData['West Karbi Anglong'].deceased} 
`

)})

// Bihar
} else if (msg.body == `-covid araria`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Araria Covid19 Cases-----╕*

*District Name :* Araria, BR
*Total Cases :* ${con.Bihar.districtData.Araria.confirmed}
*Active Cases :* ${con.Bihar.districtData.Araria.active}
*Recovered Cases :* ${con.Bihar.districtData.Araria.recovered}
*Death Cases :* ${con.Bihar.districtData.Araria.deceased} 
`

)})
} else if (msg.body == `-covid arwal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Arwal Covid19 Cases-----╕*

*District Name :* Arwal, BR
*Total Cases :* ${con.Bihar.districtData.Arwal.confirmed}
*Active Cases :* ${con.Bihar.districtData.Arwal.active}
*Recovered Cases :* ${con.Bihar.districtData.Arwal.recovered}
*Death Cases :* ${con.Bihar.districtData.Arwal.deceased} 
`

)})
} else if (msg.body == `-covid aurangabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Aurangabad Covid19 Cases-----╕*

*District Name :* Aurangabad, BR
*Total Cases :* ${con.Bihar.districtData.Aurangabad.confirmed}
*Active Cases :* ${con.Bihar.districtData.Aurangabad.active}
*Recovered Cases :* ${con.Bihar.districtData.Aurangabad.recovered}
*Death Cases :* ${con.Bihar.districtData.Aurangabad.deceased} 
`

)})
} else if (msg.body == `-covid banka`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Banka Covid19 Cases-----╕*

*District Name :* Banka, BR
*Total Cases :* ${con.Bihar.districtData.Banka.confirmed}
*Active Cases :* ${con.Bihar.districtData.Banka.active}
*Recovered Cases :* ${con.Bihar.districtData.Banka.recovered}
*Death Cases :* ${con.Bihar.districtData.Banka.deceased} 
`

)})
} else if (msg.body == `-covid begusarai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Begusarai Covid19 Cases-----╕*

*District Name :* Begusarai, BR
*Total Cases :* ${con.Bihar.districtData.Begusarai.confirmed}
*Active Cases :* ${con.Bihar.districtData.Begusarai.active}
*Recovered Cases :* ${con.Bihar.districtData.Begusarai.recovered}
*Death Cases :* ${con.Bihar.districtData.Begusarai.deceased} 
`

)})
} else if (msg.body == `-covid bhagalpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Bhagalpur Covid19 Cases-----╕*

*District Name :* Bhagalpur, BR
*Total Cases :* ${con.Bihar.districtData.Bhagalpur.confirmed}
*Active Cases :* ${con.Bihar.districtData.Bhagalpur.active}
*Recovered Cases :* ${con.Bihar.districtData.Bhagalpur.recovered}
*Death Cases :* ${con.Bihar.districtData.Bhagalpur.deceased} 
`

)})
} else if (msg.body == `-covid bhojpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Bhojpur Covid19 Cases-----╕*

*District Name :* Bhojpur, BR
*Total Cases :* ${con.Bihar.districtData.Bhojpur.confirmed}
*Active Cases :* ${con.Bihar.districtData.Bhojpur.active}
*Recovered Cases :* ${con.Bihar.districtData.Bhojpur.recovered}
*Death Cases :* ${con.Bihar.districtData.Bhojpur.deceased} 
`

)})
} else if (msg.body == `-covid buxar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Buxar Covid19 Cases-----╕*

*District Name :* Buxar, BR
*Total Cases :* ${con.Bihar.districtData.Buxar.confirmed}
*Active Cases :* ${con.Bihar.districtData.Buxar.active}
*Recovered Cases :* ${con.Bihar.districtData.Buxar.recovered}
*Death Cases :* ${con.Bihar.districtData.Buxar.deceased} 
`

)})
} else if (msg.body == `-covid darbhanga`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Darbhanga Covid19 Cases-----╕*

*District Name :* Darbhanga, BR
*Total Cases :* ${con.Bihar.districtData.Darbhanga.confirmed}
*Active Cases :* ${con.Bihar.districtData.Darbhanga.active}
*Recovered Cases :* ${con.Bihar.districtData.Darbhanga.recovered}
*Death Cases :* ${con.Bihar.districtData.Darbhanga.deceased} 
`

)})
} else if (msg.body == `-covid eastchamparan`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----East Champaran Covid19 Cases-----╕*

*District Name :* East Champaran, BR
*Total Cases :* ${con.Bihar.districtData['East Champaran'].confirmed}
*Active Cases :* ${con.Bihar.districtData['East Champaran'].active}
*Recovered Cases :* ${con.Bihar.districtData['East Champaran'].recovered}
*Death Cases :* ${con.Bihar.districtData['East Champaran'].deceased} 
`

)})
} else if (msg.body == `-covid gaya`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Gaya Covid19 Cases-----╕*

*District Name :* Gaya, BR
*Total Cases :* ${con.Bihar.districtData.Gaya.confirmed}
*Active Cases :* ${con.Bihar.districtData.Gaya.active}
*Recovered Cases :* ${con.Bihar.districtData.Gaya.recovered}
*Death Cases :* ${con.Bihar.districtData.Gaya.deceased} 
`

)})
} else if (msg.body == `-covid gopalganj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Gopalganj Covid19 Cases-----╕*

*District Name :* Gopalganj, BR
*Total Cases :* ${con.Bihar.districtData.Gopalganj.confirmed}
*Active Cases :* ${con.Bihar.districtData.Gopalganj.active}
*Recovered Cases :* ${con.Bihar.districtData.Gopalganj.recovered}
*Death Cases :* ${con.Bihar.districtData.Gopalganj.deceased} 
`

)})
} else if (msg.body == `-covid jamui`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Jamui Covid19 Cases-----╕*

*District Name :* Jamui, BR
*Total Cases :* ${con.Bihar.districtData.Jamui.confirmed}
*Active Cases :* ${con.Bihar.districtData.Jamui.active}
*Recovered Cases :* ${con.Bihar.districtData.Jamui.recovered}
*Death Cases :* ${con.Bihar.districtData.Jamui.deceased} 
`

)})
} else if (msg.body == `-covid jehanabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Jehanabad Covid19 Cases-----╕*

*District Name :* Jehanabad, BR
*Total Cases :* ${con.Bihar.districtData.Jehanabad.confirmed}
*Active Cases :* ${con.Bihar.districtData.Jehanabad.active}
*Recovered Cases :* ${con.Bihar.districtData.Jehanabad.recovered}
*Death Cases :* ${con.Bihar.districtData.Jehanabad.deceased} 
`

)})
} else if (msg.body == `-covid kaimur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kaimur Covid19 Cases-----╕*

*District Name :* Kaimur, BR
*Total Cases :* ${con.Bihar.districtData.Kaimur.confirmed}
*Active Cases :* ${con.Bihar.districtData.Kaimur.active}
*Recovered Cases :* ${con.Bihar.districtData.Kaimur.recovered}
*Death Cases :* ${con.Bihar.districtData.Kaimur.deceased} 
`

)})
} else if (msg.body == `-covid katihar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Katihar Covid19 Cases-----╕*

*District Name :* Katihar, BR
*Total Cases :* ${con.Bihar.districtData.Katihar.confirmed}
*Active Cases :* ${con.Bihar.districtData.Katihar.active}
*Recovered Cases :* ${con.Bihar.districtData.Katihar.recovered}
*Death Cases :* ${con.Bihar.districtData.Katihar.deceased} 
`

)})
} else if (msg.body == `-covid khagaria`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Khagaria Covid19 Cases-----╕*

*District Name :* Khagaria, BR
*Total Cases :* ${con.Bihar.districtData.Khagaria.confirmed}
*Active Cases :* ${con.Bihar.districtData.Khagaria.active}
*Recovered Cases :* ${con.Bihar.districtData.Khagaria.recovered}
*Death Cases :* ${con.Bihar.districtData.Khagaria.deceased} 
`

)})
} else if (msg.body == `-covid kishanganj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kishanganj Covid19 Cases-----╕*

*District Name :* Kishanganj, BR
*Total Cases :* ${con.Bihar.districtData.Kishanganj.confirmed}
*Active Cases :* ${con.Bihar.districtData.Kishanganj.active}
*Recovered Cases :* ${con.Bihar.districtData.Kishanganj.recovered}
*Death Cases :* ${con.Bihar.districtData.Kishanganj.deceased} 
`

)})
} else if (msg.body == `-covid lakhisarai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Lakhisarai Covid19 Cases-----╕*

*District Name :* Lakhisarai, BR
*Total Cases :* ${con.Bihar.districtData.Lakhisarai.confirmed}
*Active Cases :* ${con.Bihar.districtData.Lakhisarai.active}
*Recovered Cases :* ${con.Bihar.districtData.Lakhisarai.recovered}
*Death Cases :* ${con.Bihar.districtData.Lakhisarai.deceased} 
`

)})
} else if (msg.body == `-covid madhepura`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Madhepura Covid19 Cases-----╕*

*District Name :* Madhepura, BR
*Total Cases :* ${con.Bihar.districtData.Madhepura.confirmed}
*Active Cases :* ${con.Bihar.districtData.Madhepura.active}
*Recovered Cases :* ${con.Bihar.districtData.Madhepura.recovered}
*Death Cases :* ${con.Bihar.districtData.Madhepura.deceased} 
`

)})
} else if (msg.body == `-covid madhubani`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Madhubani Covid19 Cases-----╕*

*District Name :* Madhubani, BR
*Total Cases :* ${con.Bihar.districtData.Madhubani.confirmed}
*Active Cases :* ${con.Bihar.districtData.Madhubani.active}
*Recovered Cases :* ${con.Bihar.districtData.Madhubani.recovered}
*Death Cases :* ${con.Bihar.districtData.Madhubani.deceased} 
`

)})
} else if (msg.body == `-covid munger`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Munger Covid19 Cases-----╕*

*District Name :* Munger, BR
*Total Cases :* ${con.Bihar.districtData.Munger.confirmed}
*Active Cases :* ${con.Bihar.districtData.Munger.active}
*Recovered Cases :* ${con.Bihar.districtData.Munger.recovered}
*Death Cases :* ${con.Bihar.districtData.Munger.deceased} 
`

)})
} else if (msg.body == `-covid muzaffarpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Muzaffarpur Covid19 Cases-----╕*

*District Name :* Muzaffarpur, BR
*Total Cases :* ${con.Bihar.districtData.Muzaffarpur.confirmed}
*Active Cases :* ${con.Bihar.districtData.Muzaffarpur.active}
*Recovered Cases :* ${con.Bihar.districtData.Muzaffarpur.recovered}
*Death Cases :* ${con.Bihar.districtData.Muzaffarpur.deceased} 
`

)})
} else if (msg.body == `-covid nalanda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Nalanda Covid19 Cases-----╕*

*District Name :* Nalanda, BR
*Total Cases :* ${con.Bihar.districtData.Nalanda.confirmed}
*Active Cases :* ${con.Bihar.districtData.Nalanda.active}
*Recovered Cases :* ${con.Bihar.districtData.Nalanda.recovered}
*Death Cases :* ${con.Bihar.districtData.Nalanda.deceased} 
`

)})
} else if (msg.body == `-covid nawada`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Nawada Covid19 Cases-----╕*

*District Name :* Nawada, BR
*Total Cases :* ${con.Bihar.districtData.Nawada.confirmed}
*Active Cases :* ${con.Bihar.districtData.Nawada.active}
*Recovered Cases :* ${con.Bihar.districtData.Nawada.recovered}
*Death Cases :* ${con.Bihar.districtData.Nawada.deceased} 
`

)})
} else if (msg.body == `-covid patna`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Patna Covid19 Cases-----╕*

*District Name :* Patna, BR
*Total Cases :* ${con.Bihar.districtData.Patna.confirmed}
*Active Cases :* ${con.Bihar.districtData.Patna.active}
*Recovered Cases :* ${con.Bihar.districtData.Patna.recovered}
*Death Cases :* ${con.Bihar.districtData.Patna.deceased} 
`

)})
} else if (msg.body == `-covid purnia`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Purnia Covid19 Cases-----╕*

*District Name :* Purnia, BR
*Total Cases :* ${con.Bihar.districtData.Purnia.confirmed}
*Active Cases :* ${con.Bihar.districtData.Purnia.active}
*Recovered Cases :* ${con.Bihar.districtData.Purnia.recovered}
*Death Cases :* ${con.Bihar.districtData.Purnia.deceased} 
`

)})
} else if (msg.body == `-covid rohtas`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Rohtas Covid19 Cases-----╕*

*District Name :* Rohtas, BR
*Total Cases :* ${con.Bihar.districtData.Rohtas.confirmed}
*Active Cases :* ${con.Bihar.districtData.Rohtas.active}
*Recovered Cases :* ${con.Bihar.districtData.Rohtas.recovered}
*Death Cases :* ${con.Bihar.districtData.Rohtas.deceased} 
`

)})
} else if (msg.body == `-covid saharsa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Saharsa Covid19 Cases-----╕*

*District Name :* Saharsa, BR
*Total Cases :* ${con.Bihar.districtData.Saharsa.confirmed}
*Active Cases :* ${con.Bihar.districtData.Saharsa.active}
*Recovered Cases :* ${con.Bihar.districtData.Saharsa.recovered}
*Death Cases :* ${con.Bihar.districtData.Saharsa.deceased} 
`

)})
} else if (msg.body == `-covid samastipur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Samastipur Covid19 Cases-----╕*

*District Name :* Samastipur, BR
*Total Cases :* ${con.Bihar.districtData.Samastipur.confirmed}
*Active Cases :* ${con.Bihar.districtData.Samastipur.active}
*Recovered Cases :* ${con.Bihar.districtData.Samastipur.recovered}
*Death Cases :* ${con.Bihar.districtData.Samastipur.deceased} 
`

)})
} else if (msg.body == `-covid saran`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Saran Covid19 Cases-----╕*

*District Name :* Saran, BR
*Total Cases :* ${con.Bihar.districtData.Saran.confirmed}
*Active Cases :* ${con.Bihar.districtData.Saran.active}
*Recovered Cases :* ${con.Bihar.districtData.Saran.recovered}
*Death Cases :* ${con.Bihar.districtData.Saran.deceased} 
`

)})
} else if (msg.body == `-covid Sheikhpura`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Sheikhpura Covid19 Cases-----╕*

*District Name :* Sheikhpura, BR
*Total Cases :* ${con.Bihar.districtData.Sheikhpura.confirmed}
*Active Cases :* ${con.Bihar.districtData.Sheikhpura.active}
*Recovered Cases :* ${con.Bihar.districtData.Sheikhpura.recovered}
*Death Cases :* ${con.Bihar.districtData.Sheikhpura.deceased} 
`

)})
} else if (msg.body == `-covid sheohar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Sheohar Covid19 Cases-----╕*

*District Name :* Sheohar, BR
*Total Cases :* ${con.Bihar.districtData.Sheohar.confirmed}
*Active Cases :* ${con.Bihar.districtData.Sheohar.active}
*Recovered Cases :* ${con.Bihar.districtData.Sheohar.recovered}
*Death Cases :* ${con.Bihar.districtData.Sheohar.deceased} 
`

)})
} else if (msg.body == `-covid sitamarhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Sitamarhi Covid19 Cases-----╕*

*District Name :* Sitamarhi, BR
*Total Cases :* ${con.Bihar.districtData.Sitamarhi.confirmed}
*Active Cases :* ${con.Bihar.districtData.Sitamarhi.active}
*Recovered Cases :* ${con.Bihar.districtData.Sitamarhi.recovered}
*Death Cases :* ${con.Bihar.districtData.Sitamarhi.deceased} 
`

)})
} else if (msg.body == `-covid siwan`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Siwan Covid19 Cases-----╕*

*District Name :* Siwan, BR
*Total Cases :* ${con.Bihar.districtData.Siwan.confirmed}
*Active Cases :* ${con.Bihar.districtData.Siwan.active}
*Recovered Cases :* ${con.Bihar.districtData.Siwan.recovered}
*Death Cases :* ${con.Bihar.districtData.Siwan.deceased} 
`

)})
} else if (msg.body == `-covid supaul`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Supaul Covid19 Cases-----╕*

*District Name :* Supaul, BR
*Total Cases :* ${con.Bihar.districtData.Supaul.confirmed}
*Active Cases :* ${con.Bihar.districtData.Supaul.active}
*Recovered Cases :* ${con.Bihar.districtData.Supaul.recovered}
*Death Cases :* ${con.Bihar.districtData.Supaul.deceased} 
`

)})
} else if (msg.body == `-covid vaishali`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Vaishali Covid19 Cases-----╕*

*District Name :* Vaishali, BR
*Total Cases :* ${con.Bihar.districtData.Vaishali.confirmed}
*Active Cases :* ${con.Bihar.districtData.Vaishali.active}
*Recovered Cases :* ${con.Bihar.districtData.Vaishali.recovered}
*Death Cases :* ${con.Bihar.districtData.Vaishali.deceased} 
`

)})
} else if (msg.body == `-covid westchamparan`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----West Champaran Covid19 Cases-----╕*

*District Name :* West Champaran, BR
*Total Cases :* ${con.Bihar.districtData['West Champaran'].confirmed}
*Active Cases :* ${con.Bihar.districtData['West Champaran'].active}
*Recovered Cases :* ${con.Bihar.districtData['West Champaran'].recovered}
*Death Cases :* ${con.Bihar.districtData['West Champaran'].deceased} 
`

)})

// Candigarh


} else if (msg.body == `-covid chandigarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Chandigarh Covid19 Cases-----╕*

*District Name :* Chandigarh, CH
*Total Cases :* ${con.Chandigarh.districtData.Chandigarh.confirmed}
*Active Cases :* ${con.Chandigarh.districtData.Chandigarh.active}
*Recovered Cases :* ${con.Chandigarh.districtData.Chandigarh.recovered}
*Death Cases :* ${con.Chandigarh.districtData.Chandigarh.deceased} 
`

)})

// Chhattisgarh 
} else if (msg.body == `-covid balod`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒---- Covid19 Cases-----╕*

*District Name :* Balod, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.deceased}

`
)})
}  else if (msg.body == `-covid balodabazar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Baloda Bazar Covid19 Cases-----╕*

*District Name :* Baloda Bazar, CG 
*Total Cases :* ${con.Chhattisgarh.districtData['Baloda Bazar'].confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData['Baloda Bazar'].active}
*Recovered Cases :* ${con.Chhattisgarh.districtData['Baloda Bazar'].recovered}
*Death Cases :* ${con.Chhattisgarh.districtData['Baloda Bazar'].deceased}

`
)})
}  else if (msg.body == `-covid balrampur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Balrampur Covid19 Cases-----╕*

*District Name :* Balrampur, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Balrampur.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Balrampur.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Balrampur.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Balrampur.deceased}

`
)})
}  else if (msg.body == `-covid bametara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bametara Covid19 Cases-----╕*

*District Name :* Bametara, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Bametara.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Bametara.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Bametara.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Bametara.deceased}

`
)})
}  else if (msg.body == `-covid bastar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bastar Covid19 Cases-----╕*

*District Name :* Bastar, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Bastar.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Bastar.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Bastar.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Bastar.deceased}

`
)})
}  else if (msg.body == `-covid bijapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bijapur Covid19 Cases-----╕*

*District Name :* Bijapur, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Bijapur.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Bijapur.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Bijapur.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Bijapur.deceased}

`
)})
}  else if (msg.body == `-covid bilaspur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bilaspur Covid19 Cases-----╕*

*District Name :* Bilaspur, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Bilaspur.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Bilaspur.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Bilaspur.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Bilaspur.deceased}

`
)})
}  else if (msg.body == `-covid dakshinbastardantewada`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dakshin Bastar Dantewada Covid19 Cases-----╕*

*District Name :* Dakshin Bastar Dantewada, CG 
*Total Cases :* ${con.Chhattisgarh.districtData['Dakshin Bastar Dantewada'].confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData['Dakshin Bastar Dantewada'].active}
*Recovered Cases :* ${con.Chhattisgarh.districtData['Dakshin Bastar Dantewada'].recovered}
*Death Cases :* ${con.Chhattisgarh.districtData['Dakshin Bastar Dantewada'].deceased}

`
)})
}  else if (msg.body == `-covid dhamtari`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dhamtari Covid19 Cases-----╕*

*District Name :* Dhamtari, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Dhamtari.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Dhamtari.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Dhamtari.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Dhamtari.deceased}

`
)})
}  else if (msg.body == `-covid durg`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Durg Covid19 Cases-----╕*

*District Name :* Durg, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Durg.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Durg.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Durg.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Durg.deceased}

`
)})
}  else if (msg.body == `-covid gariaband`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gariaband Covid19 Cases-----╕*

*District Name :* Gariaband, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Gariaband.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Gariaband.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Gariaband.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Gariaband.deceased}

`
)})
}  else if (msg.body == `-covid janjgirchampa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Janjgir Champa Covid19 Cases-----╕*

*District Name :* Janjgir Champa, CG 
*Total Cases :* ${con.Chhattisgarh.districtData['Janjgir Champa'].confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData['Janjgir Champa'].active}
*Recovered Cases :* ${con.Chhattisgarh.districtData['Janjgir Champa'].recovered}
*Death Cases :* ${con.Chhattisgarh.districtData['Janjgir Champa'].deceased}

`
)})
}  else if (msg.body == `-covid jashpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jashpur Covid19 Cases-----╕*

*District Name :* Jashpur, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Jashpur.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Jashpur.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Jashpur.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Jashpur.deceased}

`
)})
}  else if (msg.body == `-covid kabeerdham`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kabeerdham Covid19 Cases-----╕*

*District Name :* Kabeerdham, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Kabeerdham.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Kabeerdham.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Kabeerdham.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Kabeerdham.deceased}

`
)})
}  else if (msg.body == `-covid kondagaon`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kondagaon Covid19 Cases-----╕*

*District Name :* Kondagaon, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Kondagaon.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Kondagaon.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Kondagaon.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Kondagaon.deceased}

`
)})
}  else if (msg.body == `-covid korba`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Korba Covid19 Cases-----╕*

*District Name :* Korba, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Korba.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Korba.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Korba.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Korba.deceased}

`
)})
}  else if (msg.body == `-covid koriya`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Koriya Covid19 Cases-----╕*

*District Name :* Koriya, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Koriya.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Koriya.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Koriya.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Koriya.deceased}

`
)})
}  else if (msg.body == `-covid mahasamund`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mahasamund Covid19 Cases-----╕*

*District Name :* Mahasamund, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Mahasamund.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Mahasamund.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Mahasamund.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Mahasamund.deceased}

`
)})
}  else if (msg.body == `-covid mungeli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mungeli Covid19 Cases-----╕*

*District Name :* Mungeli, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Mungeli.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Mungeli.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Mungeli.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Mungeli.deceased}

`
)})
}  else if (msg.body == `-covid narayanpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Narayanpur Covid19 Cases-----╕*

*District Name :* Narayanpur, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Narayanpur.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Narayanpur.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Narayanpur.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Narayanpur.deceased}

`
)})
}  else if (msg.body == `-covid raigarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Raigarh Covid19 Cases-----╕*

*District Name :* Raigarh, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Raigarh.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Raigarh.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Raigarh.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Raigarh.deceased}

`
)})
}  else if (msg.body == `-covid raipur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Raipur Covid19 Cases-----╕*

*District Name :* Raipur, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Raipur.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Raipur.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Raipur.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Raipur.deceased}

`
)})
}  else if (msg.body == `-covid rajnandgaon`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rajnandgaon Covid19 Cases-----╕*

*District Name :* Rajnandgaon, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Rajnandgaon.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Rajnandgaon.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Rajnandgaon.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Rajnandgaon.deceased}

`
)})
}  else if (msg.body == `-covid sukma`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sukma Covid19 Cases-----╕*

*District Name :* Sukma, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Sukma.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Sukma.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Sukma.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Sukma.deceased}

`
)})
}  else if (msg.body == `-covid surajpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Surajpur Covid19 Cases-----╕*

*District Name :* Surajpur, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Surajpur.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Surajpur.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Surajpur.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Surajpur.deceased}

`
)})
}  else if (msg.body == `-covid surguja`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Surguja Covid19 Cases-----╕*

*District Name :* Surguja, CG 
*Total Cases :* ${con.Chhattisgarh.districtData.Surguja.confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData.Surguja.active}
*Recovered Cases :* ${con.Chhattisgarh.districtData.Surguja.recovered}
*Death Cases :* ${con.Chhattisgarh.districtData.Surguja.deceased}

`
)})
}  else if (msg.body == `-covid uttarbastarkanker`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Uttar Bastar Kanker Covid19 Cases-----╕*

*District Name :* Uttar Bastar Kanker, CG 
*Total Cases :* ${con.Chhattisgarh.districtData['Uttar Bastar Kanker'].confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData['Uttar Bastar Kanker'].active}
*Recovered Cases :* ${con.Chhattisgarh.districtData['Uttar Bastar Kanker'].recovered}
*Death Cases :* ${con.Chhattisgarh.districtData['Uttar Bastar Kanker'].deceased}

`
)})
}  else if (msg.body == `-covid gaurelapendramarwahi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gaurela Pendra Marwahi Covid19 Cases-----╕*

*District Name :* Gaurela Pendra Marwahi, CG 
*Total Cases :* ${con.Chhattisgarh.districtData['Gaurela Pendra Marwahi'].confirmed}
*Active Cases :* ${con.Chhattisgarh.districtData['Gaurela Pendra Marwahi'].active}
*Recovered Cases :* ${con.Chhattisgarh.districtData['Gaurela Pendra Marwahi'].recovered}
*Death Cases :* ${con.Chhattisgarh.districtData['Gaurela Pendra Marwahi'].deceased}

`
)})
}
// Delhi


else if (msg.body == `-covid centraldelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Central Delhi Covid19 Cases-----╕*

*District Name :* Central Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['Central Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['Central Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['Central Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['Central Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid eastdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----East Delhi Covid19 Cases-----╕*

*District Name :* East Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['East Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['East Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['East Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['East Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid newdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----New Delhi Covid19 Cases-----╕*

*District Name :* New Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['New Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['New Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['New Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['New Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid northdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North Delhi Covid19 Cases-----╕*

*District Name :* North Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['North Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['North Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['North Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['North Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid northeastdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North East Delhi Covid19 Cases-----╕*

*District Name :* North East Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['North East Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['North East Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['North East Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['North East Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid northwestdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North West Delhi Covid19 Cases-----╕*

*District Name :* North West Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['North West Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['North West Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['North West Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['North West Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid northwestdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North West Delhi Covid19 Cases-----╕*

*District Name :* North West Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['North West Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['North West Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['North West Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['North West Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid southdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South Delhi Covid19 Cases-----╕*

*District Name :* South Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['South Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['South Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['South Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['South Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid southeastdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South East Delhi Covid19 Cases-----╕*

*District Name :* South East Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['South East Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['South East Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['South East Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['South East Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid southwestdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South West Delhi Covid19 Cases-----╕*

*District Name :* South West Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['South West Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['South West Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['South West Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['South West Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid westdelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----West Delhi Covid19 Cases-----╕*

*District Name :* West Delhi, DL 
*Total Cases :* ${con.Delhi.districtData['West Delhi'].confirmed}
*Active Cases :* ${con.Delhi.districtData['West Delhi'].active}
*Recovered Cases :* ${con.Delhi.districtData['West Delhi'].recovered}
*Death Cases :* ${con.Delhi.districtData['West Delhi'].deceased}

`
)})
}   else if (msg.body == `-covid shahdara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shahdara Covid19 Cases-----╕*

*District Name :* Shahdara, DL 
*Total Cases :* ${con.Delhi.districtData.Shahdara.confirmed}
*Active Cases :* ${con.Delhi.districtData.Shahdara.active}
*Recovered Cases :* ${con.Delhi.districtData.Shahdara.recovered}
*Death Cases :* ${con.Delhi.districtData.Shahdara.deceased}

`
)})
}  else if (msg.body == `-covid unknowndelhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Unknown Delhi Covid19 Cases-----╕*

*District Name :* Unknown, DL 
*Total Cases :* ${con.Delhi.districtData.Unknown.confirmed}
*Active Cases :* ${con.Delhi.districtData.Unknown.active}
*Recovered Cases :* ${con.Delhi.districtData.Unknown.recovered}
*Death Cases :* ${con.Delhi.districtData.Unknown.deceased}

`
)})
}  

// Dadra and Nagar Haveli and Daman and Diu

else if (msg.body == `-covid dadraandnagarhaveli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dadra and Nagar Haveli Covid19 Cases-----╕*

*District Name :* Dadra and Nagar Haveli, DH DD 
*Total Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData['Dadra and Nagar Haveli'].confirmed}
*Active Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData['Dadra and Nagar Haveli'].active}
*Recovered Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData['Dadra and Nagar Haveli'].recovered}
*Death Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData['Dadra and Nagar Haveli'].deceased}

`
)})
}  else if (msg.body == `-covid daman`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Daman Covid19 Cases-----╕*

*District Name :* Daman, DH DD 
*Total Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData.Daman.confirmed}
*Active Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData.Daman.active}
*Recovered Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData.Daman.recovered}
*Death Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData.Daman.deceased}

`
)})
}  else if (msg.body == `-covid diu`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Diu Covid19 Cases-----╕*

*District Name :* Diu, DH DD 
*Total Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData.Diu.confirmed}
*Active Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData.Diu.active}
*Recovered Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData.Diu.recovered}
*Death Cases :* ${con['Dadra and Nagar Haveli and Daman and Diu'].districtData.Diu.deceased}

`
)})
}  

//Goa

else if (msg.body == `-covid unknowngoa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Unknown Goa Covid19 Cases-----╕*

*District Name :* Unknown, GA 
*Total Cases :* ${con.Goa.districtData.Unknown.confirmed}
*Active Cases :* ${con.Goa.districtData.Unknown.active}
*Recovered Cases :* ${con.Goa.districtData.Unknown.recovered}
*Death Cases :* ${con.Goa.districtData.Unknown.deceased}

`
)})
}  else if (msg.body == `-covid northgoa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North Goa Covid19 Cases-----╕*

*District Name :* North Goa, GA 
*Total Cases :* ${con.Goa.districtData['North Goa'].confirmed}
*Active Cases :* ${con.Goa.districtData['North Goa'].active}
*Recovered Cases :* ${con.Goa.districtData['North Goa'].recovered}
*Death Cases :* ${con.Goa.districtData['North Goa'].deceased}

`
)})
}  else if (msg.body == `-covid southgoa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South Goa Covid19 Cases-----╕*

*District Name :* South Goa, GA 
*Total Cases :* ${con.Goa.districtData['South Goa'].confirmed}
*Active Cases :* ${con.Goa.districtData['South Goa'].active}
*Recovered Cases :* ${con.Goa.districtData['South Goa'].recovered}
*Death Cases :* ${con.Goa.districtData['South Goa'].deceased}

`
)})
}  

//Gujrat 

else if (msg.body == `-covid ahmedabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ahmedabad Covid19 Cases-----╕*

*District Name :* Ahmedabad, GJ
*Total Cases :* ${con.Gujarat.districtData.Ahmedabad.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Ahmedabad.active}
*Recovered Cases :* ${con.Gujarat.districtData.Ahmedabad.recovered}
*Death Cases :* ${con.Gujarat.districtData.Ahmedabad.deceased}

`
)})
}  else if (msg.body == `-covid amreli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Amreli Covid19 Cases-----╕*

*District Name :* Amreli, GJ
*Total Cases :* ${con.Gujarat.districtData.Amreli.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Amreli.active}
*Recovered Cases :* ${con.Gujarat.districtData.Amreli.recovered}
*Death Cases :* ${con.Gujarat.districtData.Amreli.deceased}

`
)})
}  else if (msg.body == `-covid anand`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Anand Covid19 Cases-----╕*

*District Name :* Anand, GJ
*Total Cases :* ${con.Gujarat.districtData.Anand.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Anand.active}
*Recovered Cases :* ${con.Gujarat.districtData.Anand.recovered}
*Death Cases :* ${con.Gujarat.districtData.Anand.deceased}

`
)})
}  else if (msg.body == `-covid aravalli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Aravalli Covid19 Cases-----╕*

*District Name :* Aravalli, GJ
*Total Cases :* ${con.Gujarat.districtData.Aravalli.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Aravalli.active}
*Recovered Cases :* ${con.Gujarat.districtData.Aravalli.recovered}
*Death Cases :* ${con.Gujarat.districtData.Aravalli.deceased}

`
)})
}  else if (msg.body == `-covid banaskantha`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Banaskantha Covid19 Cases-----╕*

*District Name :* Banaskantha, GJ
*Total Cases :* ${con.Gujarat.districtData.Banaskantha.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Banaskantha.active}
*Recovered Cases :* ${con.Gujarat.districtData.Banaskantha.recovered}
*Death Cases :* ${con.Gujarat.districtData.Banaskantha.deceased}

`
)})
}  else if (msg.body == `-covid bharuch`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bharuch Covid19 Cases-----╕*

*District Name :* Bharuch, GJ
*Total Cases :* ${con.Gujarat.districtData.Bharuch.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Bharuch.active}
*Recovered Cases :* ${con.Gujarat.districtData.Bharuch.recovered}
*Death Cases :* ${con.Gujarat.districtData.Bharuch.deceased}

`
)})
}  else if (msg.body == `-covid bhavnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bhavnagar Covid19 Cases-----╕*

*District Name :* Bhavnagar, GJ
*Total Cases :* ${con.Gujarat.districtData.Bhavnagar.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Bhavnagar.active}
*Recovered Cases :* ${con.Gujarat.districtData.Bhavnagar.recovered}
*Death Cases :* ${con.Gujarat.districtData.Bhavnagar.deceased}

`
)})
}  else if (msg.body == `-covid botad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Botad Covid19 Cases-----╕*

*District Name :* Botad, GJ
*Total Cases :* ${con.Gujarat.districtData.Botad.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Botad.active}
*Recovered Cases :* ${con.Gujarat.districtData.Botad.recovered}
*Death Cases :* ${con.Gujarat.districtData.Botad.deceased}

`
)})
}  else if (msg.body == `-covid chhotaudaipur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chhota Udaipur Covid19 Cases-----╕*

*District Name :* Chhota Udaipur, GJ
*Total Cases :* ${con.Gujarat.districtData['Chhota Udaipur'].confirmed}
*Active Cases :* ${con.Gujarat.districtData['Chhota Udaipur'].active}
*Recovered Cases :* ${con.Gujarat.districtData['Chhota Udaipur'].recovered}
*Death Cases :* ${con.Gujarat.districtData['Chhota Udaipur'].deceased}

`
)})
}  else if (msg.body == `-covid dahod`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dahod Covid19 Cases-----╕*

*District Name :* Dahod, GJ
*Total Cases :* ${con.Gujarat.districtData.Dahod.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Dahod.active}
*Recovered Cases :* ${con.Gujarat.districtData.Dahod.recovered}
*Death Cases :* ${con.Gujarat.districtData.Dahod.deceased}

`
)})
}  else if (msg.body == `-covid dang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dang Covid19 Cases-----╕*

*District Name :* Dang, GJ
*Total Cases :* ${con.Gujarat.districtData.Dang.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Dang.active}
*Recovered Cases :* ${con.Gujarat.districtData.Dang.recovered}
*Death Cases :* ${con.Gujarat.districtData.Dang.deceased}

`
)})
}  else if (msg.body == `-covid devbhumidwarka`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Devbhumi Dwarka Covid19 Cases-----╕*

*District Name :* Devbhumi Dwarka, GJ
*Total Cases :* ${con.Gujarat.districtData['Devbhumi Dwarka'].confirmed}
*Active Cases :* ${con.Gujarat.districtData['Devbhumi Dwarka'].active}
*Recovered Cases :* ${con.Gujarat.districtData['Devbhumi Dwarka'].recovered}
*Death Cases :* ${con.Gujarat.districtData['Devbhumi Dwarka'].deceased}

`
)})
}  else if (msg.body == `-covid gandhinagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gandhinagar Covid19 Cases-----╕*

*District Name :* Gandhinagar, GJ
*Total Cases :* ${con.Gujarat.districtData.Gandhinagar.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Gandhinagar.active}
*Recovered Cases :* ${con.Gujarat.districtData.Gandhinagar.recovered}
*Death Cases :* ${con.Gujarat.districtData.Gandhinagar.deceased}

`
)})
}  else if (msg.body == `-covid girsomnath`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gir Somnath Covid19 Cases-----╕*

*District Name :* Gir Somnath, GJ
*Total Cases :* ${con.Gujarat.districtData['Gir Somnath'].confirmed}
*Active Cases :* ${con.Gujarat.districtData['Gir Somnath'].active}
*Recovered Cases :* ${con.Gujarat.districtData['Gir Somnath'].recovered}
*Death Cases :* ${con.Gujarat.districtData['Gir Somnath'].deceased}

`
)})
}  else if (msg.body == `-covid jamnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jamnagar Covid19 Cases-----╕*

*District Name :* Jamnagar, GJ
*Total Cases :* ${con.Gujarat.districtData.Jamnagar.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Jamnagar.active}
*Recovered Cases :* ${con.Gujarat.districtData.Jamnagar.recovered}
*Death Cases :* ${con.Gujarat.districtData.Jamnagar.deceased}

`
)})
}  else if (msg.body == `-covid junagadh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Junagadh Covid19 Cases-----╕*

*District Name :* Junagadh, GJ
*Total Cases :* ${con.Gujarat.districtData.Junagadh.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Junagadh.active}
*Recovered Cases :* ${con.Gujarat.districtData.Junagadh.recovered}
*Death Cases :* ${con.Gujarat.districtData.Junagadh.deceased}

`
)})
}  else if (msg.body == `-covid kheda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kheda Covid19 Cases-----╕*

*District Name :* Kheda, GJ
*Total Cases :* ${con.Gujarat.districtData.Kheda.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Kheda.active}
*Recovered Cases :* ${con.Gujarat.districtData.Kheda.recovered}
*Death Cases :* ${con.Gujarat.districtData.Kheda.deceased}

`
)})
}  else if (msg.body == `-covid kutch`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kutch Covid19 Cases-----╕*

*District Name :* Kutch, GJ
*Total Cases :* ${con.Gujarat.districtData.Kutch.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Kutch.active}
*Recovered Cases :* ${con.Gujarat.districtData.Kutch.recovered}
*Death Cases :* ${con.Gujarat.districtData.Kutch.deceased}

`
)})
}  else if (msg.body == `-covid mahisagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mahisagar Covid19 Cases-----╕*

*District Name :* Mahisagar, GJ
*Total Cases :* ${con.Gujarat.districtData.Mahisagar.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Mahisagar.active}
*Recovered Cases :* ${con.Gujarat.districtData.Mahisagar.recovered}
*Death Cases :* ${con.Gujarat.districtData.Mahisagar.deceased}

`
)})
}   else if (msg.body == `-covid mehsana`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mehsana Covid19 Cases-----╕*

*District Name :* Mehsana, GJ
*Total Cases :* ${con.Gujarat.districtData.Mehsana.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Mehsana.active}
*Recovered Cases :* ${con.Gujarat.districtData.Mehsana.recovered}
*Death Cases :* ${con.Gujarat.districtData.Mehsana.deceased}

`
)})
}  else if (msg.body == `-covid morbi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Morbi Covid19 Cases-----╕*

*District Name :* Morbi, GJ
*Total Cases :* ${con.Gujarat.districtData.Morbi.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Morbi.active}
*Recovered Cases :* ${con.Gujarat.districtData.Morbi.recovered}
*Death Cases :* ${con.Gujarat.districtData.Morbi.deceased}

`
)})
}  else if (msg.body == `-covid narmada`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Narmada Covid19 Cases-----╕*

*District Name :* Narmada, GJ
*Total Cases :* ${con.Gujarat.districtData.Narmada.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Narmada.active}
*Recovered Cases :* ${con.Gujarat.districtData.Narmada.recovered}
*Death Cases :* ${con.Gujarat.districtData.Narmada.deceased}

`
)})
}  else if (msg.body == `-covid navsari`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Navsari Covid19 Cases-----╕*

*District Name :* Navsari, GJ
*Total Cases :* ${con.Gujarat.districtData.Navsari.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Navsari.active}
*Recovered Cases :* ${con.Gujarat.districtData.Navsari.recovered}
*Death Cases :* ${con.Gujarat.districtData.Navsari.deceased}

`
)})
}  else if (msg.body == `-covid panchmahal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Panchmahal Covid19 Cases-----╕*

*District Name :* Panchmahal, GJ
*Total Cases :* ${con.Gujarat.districtData.Panchmahal.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Panchmahal.active}
*Recovered Cases :* ${con.Gujarat.districtData.Panchmahal.recovered}
*Death Cases :* ${con.Gujarat.districtData.Panchmahal.deceased}

`
)})
}  else if (msg.body == `-covid patan`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Patan Covid19 Cases-----╕*

*District Name :* Patan, GJ
*Total Cases :* ${con.Gujarat.districtData.Patan.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Patan.active}
*Recovered Cases :* ${con.Gujarat.districtData.Patan.recovered}
*Death Cases :* ${con.Gujarat.districtData.Patan.deceased}

`
)})
}  else if (msg.body == `-covid porbandar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Porbandar Covid19 Cases-----╕*

*District Name :* Porbandar, GJ
*Total Cases :* ${con.Gujarat.districtData.Porbandar.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Porbandar.active}
*Recovered Cases :* ${con.Gujarat.districtData.Porbandar.recovered}
*Death Cases :* ${con.Gujarat.districtData.Porbandar.deceased}

`
)})
}  else if (msg.body == `-covid rajkot`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rajkot Covid19 Cases-----╕*

*District Name :* Rajkot, GJ
*Total Cases :* ${con.Gujarat.districtData.Rajkot.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Rajkot.active}
*Recovered Cases :* ${con.Gujarat.districtData.Rajkot.recovered}
*Death Cases :* ${con.Gujarat.districtData.Rajkot.deceased}

`
)})
}  else if (msg.body == `-covid sabarkantha`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sabarkantha Covid19 Cases-----╕*

*District Name :* Sabarkantha, GJ
*Total Cases :* ${con.Gujarat.districtData.Sabarkantha.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Sabarkantha.active}
*Recovered Cases :* ${con.Gujarat.districtData.Sabarkantha.recovered}
*Death Cases :* ${con.Gujarat.districtData.Sabarkantha.deceased}

`
)})
}  else if (msg.body == `-covid surat`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Surat Covid19 Cases-----╕*

*District Name :* Surat, GJ
*Total Cases :* ${con.Gujarat.districtData.Surat.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Surat.active}
*Recovered Cases :* ${con.Gujarat.districtData.Surat.recovered}
*Death Cases :* ${con.Gujarat.districtData.Surat.deceased}

`
)})
}  else if (msg.body == `-covid surendranagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Surendranagar Covid19 Cases-----╕*

*District Name :* Surendranagar, GJ
*Total Cases :* ${con.Gujarat.districtData.Surendranagar.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Surendranagar.active}
*Recovered Cases :* ${con.Gujarat.districtData.Surendranagar.recovered}
*Death Cases :* ${con.Gujarat.districtData.Surendranagar.deceased}

`
)})
}  else if (msg.body == `-covid tapi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tapi Covid19 Cases-----╕*

*District Name :* Tapi, GJ
*Total Cases :* ${con.Gujarat.districtData.Tapi.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Tapi.active}
*Recovered Cases :* ${con.Gujarat.districtData.Tapi.recovered}
*Death Cases :* ${con.Gujarat.districtData.Tapi.deceased}

`
)})
}  else if (msg.body == `-covid vadodara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Vadodara Covid19 Cases-----╕*

*District Name :* Vadodara, GJ
*Total Cases :* ${con.Gujarat.districtData.Vadodara.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Vadodara.active}
*Recovered Cases :* ${con.Gujarat.districtData.Vadodara.recovered}
*Death Cases :* ${con.Gujarat.districtData.Vadodara.deceased}

`
)})
}  else if (msg.body == `-covid valsad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Valsad Covid19 Cases-----╕*

*District Name :* Valsad, GJ
*Total Cases :* ${con.Gujarat.districtData.Valsad.confirmed}
*Active Cases :* ${con.Gujarat.districtData.Valsad.active}
*Recovered Cases :* ${con.Gujarat.districtData.Valsad.recovered}
*Death Cases :* ${con.Gujarat.districtData.Valsad.deceased}

`
)})
}  

//Himachal Pradesh

else if (msg.body == `-covid bilaspurhp`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bilaspur Covid19 Cases-----╕*

*District Name :* Bilaspur, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Bilaspur.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Bilaspur.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Bilaspur.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Bilaspur.deceased}

`
)})
}  else if (msg.body == `-covid chamba`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chamba Covid19 Cases-----╕*

*District Name :* Chamba, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Chamba.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Chamba.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Chamba.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Chamba.deceased}

`
)})
}  else if (msg.body == `-covid hamirpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hamirpur Covid19 Cases-----╕*

*District Name :* Hamirpur, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Hamirpur.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Hamirpur.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Hamirpur.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Hamirpur.deceased}

`
)})
}  else if (msg.body == `-covid kangra`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kangra Covid19 Cases-----╕*

*District Name :* Kangra, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Kangra.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Kangra.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Kangra.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Kangra.deceased}

`
)})
}  else if (msg.body == `-covid kinnaur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kinnaur Covid19 Cases-----╕*

*District Name :* Kinnaur, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Kinnaur.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Kinnaur.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Kinnaur.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Kinnaur.deceased}

`
)})
}  else if (msg.body == `-covid kullu`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kullu Covid19 Cases-----╕*

*District Name :* Kullu, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Kullu.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Kullu.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Kullu.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Kullu.deceased}

`
)})
}  else if (msg.body == `-covid mandi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mandi Covid19 Cases-----╕*

*District Name :* Mandi, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Mandi.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Mandi.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Mandi.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Mandi.deceased}

`
)})
}  else if (msg.body == `-covid shimla`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shimla Covid19 Cases-----╕*

*District Name :* Shimla, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Shimla.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Shimla.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Shimla.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Shimla.deceased}

`
)})
}  else if (msg.body == `-covid sirmaur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sirmaur Covid19 Cases-----╕*

*District Name :* Sirmaur, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Sirmaur.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Sirmaur.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Sirmaur.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Sirmaur.deceased}

`
)})
}  else if (msg.body == `-covid sirmaur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sirmaur Covid19 Cases-----╕*

*District Name :* Sirmaur, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Sirmaur.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Sirmaur.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Sirmaur.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Sirmaur.deceased}

`
)})
}  else if (msg.body == `-covid solan`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Solan Covid19 Cases-----╕*

*District Name :* Solan, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Solan.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Solan.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Solan.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Solan.deceased}

`
)})
}  else if (msg.body == `-covid una`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Una Covid19 Cases-----╕*

*District Name :* Una, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData.Una.confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData.Una.active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData.Una.recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData.Una.deceased}

`
)})
}  else if (msg.body == `-covid lahaulandspiti`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Lahaul and Spiti Covid19 Cases-----╕*

*District Name :* Lahaul and Spiti, HP
*Total Cases :* ${con['Himachal Pradesh'].districtData['Lahaul and Spiti'].confirmed}
*Active Cases :* ${con['Himachal Pradesh'].districtData['Lahaul and Spiti'].active}
*Recovered Cases :* ${con['Himachal Pradesh'].districtData['Lahaul and Spiti'].recovered}
*Death Cases :* ${con['Himachal Pradesh'].districtData['Lahaul and Spiti'].deceased}

`
)})
} 

//Harayna -


else if (msg.body == `-covid ambala`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ambala Covid19 Cases-----╕*

*District Name :* Ambala, HR
*Total Cases :* ${con.Haryana.districtData.Ambala.confirmed}
*Active Cases :* ${con.Haryana.districtData.Ambala.active}
*Recovered Cases :* ${con.Haryana.districtData.Ambala.recovered}
*Death Cases :* ${con.Haryana.districtData.Ambala.deceased}

`
)})
}  else if (msg.body == `-covid bhiwani`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bhiwani Covid19 Cases-----╕*

*District Name :* Bhiwani, HR
*Total Cases :* ${con.Haryana.districtData.Bhiwani.confirmed}
*Active Cases :* ${con.Haryana.districtData.Bhiwani.active}
*Recovered Cases :* ${con.Haryana.districtData.Bhiwani.recovered}
*Death Cases :* ${con.Haryana.districtData.Bhiwani.deceased}

`
)})
}  else if (msg.body == `-covid charkhidadri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Charkhi Dadri Covid19 Cases-----╕*

*District Name :* Charkhi Dadri, HR
*Total Cases :* ${con.Haryana.districtData['Charkhi Dadri'].confirmed}
*Active Cases :* ${con.Haryana.districtData['Charkhi Dadri'].active}
*Recovered Cases :* ${con.Haryana.districtData['Charkhi Dadri'].recovered}
*Death Cases :* ${con.Haryana.districtData['Charkhi Dadri'].deceased}

`
)})
}  else if (msg.body == `-covid faridabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Faridabad Covid19 Cases-----╕*

*District Name :* Faridabad, HR
*Total Cases :* ${con.Haryana.districtData.Faridabad.confirmed}
*Active Cases :* ${con.Haryana.districtData.Faridabad.active}
*Recovered Cases :* ${con.Haryana.districtData.Faridabad.recovered}
*Death Cases :* ${con.Haryana.districtData.Faridabad.deceased}

`
)})
}  else if (msg.body == `-covid fatehabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Fatehabad Covid19 Cases-----╕*

*District Name :* Fatehabad, HR
*Total Cases :* ${con.Haryana.districtData.Fatehabad.confirmed}
*Active Cases :* ${con.Haryana.districtData.Fatehabad.active}
*Recovered Cases :* ${con.Haryana.districtData.Fatehabad.recovered}
*Death Cases :* ${con.Haryana.districtData.Fatehabad.deceased}

`
)})
}  else if (msg.body == `-covid gurugram`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gurugram Covid19 Cases-----╕*

*District Name :* Gurugram, HR
*Total Cases :* ${con.Haryana.districtData.Gurugram.confirmed}
*Active Cases :* ${con.Haryana.districtData.Gurugram.active}
*Recovered Cases :* ${con.Haryana.districtData.Gurugram.recovered}
*Death Cases :* ${con.Haryana.districtData.Gurugram.deceased}

`
)}) 
}  else if (msg.body == `-covid hisar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hisar Covid19 Cases-----╕*

*District Name :* Hisar, HR
*Total Cases :* ${con.Haryana.districtData.Hisar.confirmed}
*Active Cases :* ${con.Haryana.districtData.Hisar.active}
*Recovered Cases :* ${con.Haryana.districtData.Hisar.recovered}
*Death Cases :* ${con.Haryana.districtData.Hisar.deceased}

`
)})
}  else if (msg.body == `-covid jhajjar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jhajjar Covid19 Cases-----╕*

*District Name :* Jhajjar, HR
*Total Cases :* ${con.Haryana.districtData.Jhajjar.confirmed}
*Active Cases :* ${con.Haryana.districtData.Jhajjar.active}
*Recovered Cases :* ${con.Haryana.districtData.Jhajjar.recovered}
*Death Cases :* ${con.Haryana.districtData.Jhajjar.deceased}

`
)})
}  else if (msg.body == `-covid jind`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jind Covid19 Cases-----╕*

*District Name :* Jind, HR
*Total Cases :* ${con.Haryana.districtData.Jind.confirmed}
*Active Cases :* ${con.Haryana.districtData.Jind.active}
*Recovered Cases :* ${con.Haryana.districtData.Jind.recovered}
*Death Cases :* ${con.Haryana.districtData.Jind.deceased}

`
)})
}  else if (msg.body == `-covid kaithal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kaithal Covid19 Cases-----╕*

*District Name :* Kaithal, HR
*Total Cases :* ${con.Haryana.districtData.Kaithal.confirmed}
*Active Cases :* ${con.Haryana.districtData.Kaithal.active}
*Recovered Cases :* ${con.Haryana.districtData.Kaithal.recovered}
*Death Cases :* ${con.Haryana.districtData.Kaithal.deceased}

`
)})
}  else if (msg.body == `-covid karnal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Karnal Covid19 Cases-----╕*

*District Name :* Karnal, HR
*Total Cases :* ${con.Haryana.districtData.Karnal.confirmed}
*Active Cases :* ${con.Haryana.districtData.Karnal.active}
*Recovered Cases :* ${con.Haryana.districtData.Karnal.recovered}
*Death Cases :* ${con.Haryana.districtData.Karnal.deceased}

`
)})
}  else if (msg.body == `-covid kurukshetra`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kurukshetra Covid19 Cases-----╕*

*District Name :* Kurukshetra, HR
*Total Cases :* ${con.Haryana.districtData.Kurukshetra.confirmed}
*Active Cases :* ${con.Haryana.districtData.Kurukshetra.active}
*Recovered Cases :* ${con.Haryana.districtData.Kurukshetra.recovered}
*Death Cases :* ${con.Haryana.districtData.Kurukshetra.deceased}

`
)})
}  else if (msg.body == `-covid mahendragarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mahendragarh Covid19 Cases-----╕*

*District Name :* Mahendragarh, HR
*Total Cases :* ${con.Haryana.districtData.Mahendragarh.confirmed}
*Active Cases :* ${con.Haryana.districtData.Mahendragarh.active}
*Recovered Cases :* ${con.Haryana.districtData.Mahendragarh.recovered}
*Death Cases :* ${con.Haryana.districtData.Mahendragarh.deceased}

`
)})
}  else if (msg.body == `-covid nuh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nuh Covid19 Cases-----╕*

*District Name :* Nuh, HR
*Total Cases :* ${con.Haryana.districtData.Nuh.confirmed}
*Active Cases :* ${con.Haryana.districtData.Nuh.active}
*Recovered Cases :* ${con.Haryana.districtData.Nuh.recovered}
*Death Cases :* ${con.Haryana.districtData.Nuh.deceased}

`
)})
}  else if (msg.body == `-covid palwal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Palwal Covid19 Cases-----╕*

*District Name :* Palwal, HR
*Total Cases :* ${con.Haryana.districtData.Palwal.confirmed}
*Active Cases :* ${con.Haryana.districtData.Palwal.active}
*Recovered Cases :* ${con.Haryana.districtData.Palwal.recovered}
*Death Cases :* ${con.Haryana.districtData.Palwal.deceased}

`
)})
}  else if (msg.body == `-covid panchkula`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Panchkula Covid19 Cases-----╕*

*District Name :* Panchkula, HR
*Total Cases :* ${con.Haryana.districtData.Panchkula.confirmed}
*Active Cases :* ${con.Haryana.districtData.Panchkula.active}
*Recovered Cases :* ${con.Haryana.districtData.Panchkula.recovered}
*Death Cases :* ${con.Haryana.districtData.Panchkula.deceased}

`
)})
}  else if (msg.body == `-covid panipat`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Panipat Covid19 Cases-----╕*

*District Name :* Panipat, HR
*Total Cases :* ${con.Haryana.districtData.Panipat.confirmed}
*Active Cases :* ${con.Haryana.districtData.Panipat.active}
*Recovered Cases :* ${con.Haryana.districtData.Panipat.recovered}
*Death Cases :* ${con.Haryana.districtData.Panipat.deceased}

`
)})
}  else if (msg.body == `-covid rewari`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rewari Covid19 Cases-----╕*

*District Name :* Rewari, HR
*Total Cases :* ${con.Haryana.districtData.Rewari.confirmed}
*Active Cases :* ${con.Haryana.districtData.Rewari.active}
*Recovered Cases :* ${con.Haryana.districtData.Rewari.recovered}
*Death Cases :* ${con.Haryana.districtData.Rewari.deceased}

`
)})
}  else if (msg.body == `-covid rohtak`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rohtak Covid19 Cases-----╕*

*District Name :* Rohtak, HR
*Total Cases :* ${con.Haryana.districtData.Rohtak.confirmed}
*Active Cases :* ${con.Haryana.districtData.Rohtak.active}
*Recovered Cases :* ${con.Haryana.districtData.Rohtak.recovered}
*Death Cases :* ${con.Haryana.districtData.Rohtak.deceased}

`
)})
}  else if (msg.body == `-covid sirsa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sirsa Covid19 Cases-----╕*

*District Name :* Sirsa, HR
*Total Cases :* ${con.Haryana.districtData.Sirsa.confirmed}
*Active Cases :* ${con.Haryana.districtData.Sirsa.active}
*Recovered Cases :* ${con.Haryana.districtData.Sirsa.recovered}
*Death Cases :* ${con.Haryana.districtData.Sirsa.deceased}

`
)})
}  else if (msg.body == `-covid sonipat`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sonipat Covid19 Cases-----╕*

*District Name :* Sonipat, HR
*Total Cases :* ${con.Haryana.districtData.Sonipat.confirmed}
*Active Cases :* ${con.Haryana.districtData.Sonipat.active}
*Recovered Cases :* ${con.Haryana.districtData.Sonipat.recovered}
*Death Cases :* ${con.Haryana.districtData.Sonipat.deceased}

`
)})
}  else if (msg.body == `-covid yamunanagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Yamunanagar Covid19 Cases-----╕*

*District Name :* Yamunanagar, HR
*Total Cases :* ${con.Haryana.districtData.Yamunanagar.confirmed}
*Active Cases :* ${con.Haryana.districtData.Yamunanagar.active}
*Recovered Cases :* ${con.Haryana.districtData.Yamunanagar.recovered}
*Death Cases :* ${con.Haryana.districtData.Yamunanagar.deceased}

`
)})
}  

// Jharkhand 

else if (msg.body == `-covid Bokaro`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bokaro Covid19 Cases-----╕*

*District Name :* Bokaro, JH
*Total Cases :* ${con.Jharkhand.districtData.Bokaro.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Bokaro.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Bokaro.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Bokaro.deceased}

`
)})
}  else if (msg.body == `-covid chatra`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chatra Covid19 Cases-----╕*

*District Name :* Chatra, JH
*Total Cases :* ${con.Jharkhand.districtData.Chatra.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Chatra.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Chatra.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Chatra.deceased}

`
)})
}  else if (msg.body == `-covid deoghar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Deoghar Covid19 Cases-----╕*

*District Name :* Deoghar, JH
*Total Cases :* ${con.Jharkhand.districtData.Deoghar.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Deoghar.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Deoghar.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Deoghar.deceased}

`
)})
}  else if (msg.body == `-covid dhanbad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dhanbad Covid19 Cases-----╕*

*District Name :* Dhanbad, JH
*Total Cases :* ${con.Jharkhand.districtData.Dhanbad.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Dhanbad.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Dhanbad.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Dhanbad.deceased}

`
)})
}  else if (msg.body == `-covid dumka`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dumka Covid19 Cases-----╕*

*District Name :* Dumka, JH
*Total Cases :* ${con.Jharkhand.districtData.Dumka.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Dumka.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Dumka.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Dumka.deceased}

`
)})
}  else if (msg.body == `-covid eastsinghbhum`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----East Singhbhum Covid19 Cases-----╕*

*District Name :* East Singhbhum, JH
*Total Cases :* ${con.Jharkhand.districtData['East Singhbhum'].confirmed}
*Active Cases :* ${con.Jharkhand.districtData['East Singhbhum'].active}
*Recovered Cases :* ${con.Jharkhand.districtData['East Singhbhum'].recovered}
*Death Cases :* ${con.Jharkhand.districtData['East Singhbhum'].deceased}

`
)})
}  else if (msg.body == `-covid garhwa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Garhwa Covid19 Cases-----╕*

*District Name :* Garhwa, JH
*Total Cases :* ${con.Jharkhand.districtData.Garhwa.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Garhwa.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Garhwa.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Garhwa.deceased}

`
)})
}  else if (msg.body == `-covid giridih`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Giridih Covid19 Cases-----╕*

*District Name :* Giridih, JH
*Total Cases :* ${con.Jharkhand.districtData.Giridih.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Giridih.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Giridih.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Giridih.deceased}

`
)})
}  else if (msg.body == `-covid godda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Godda Covid19 Cases-----╕*

*District Name :* Godda, JH
*Total Cases :* ${con.Jharkhand.districtData.Godda.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Godda.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Godda.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Godda.deceased}

`
)})
}  else if (msg.body == `-covid gumla`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gumla Covid19 Cases-----╕*

*District Name :* Gumla, JH
*Total Cases :* ${con.Jharkhand.districtData.Gumla.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Gumla.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Gumla.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Gumla.deceased}

`
)})
}  else if (msg.body == `-covid hazaribagh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hazaribagh Covid19 Cases-----╕*

*District Name :* Hazaribagh, JH
*Total Cases :* ${con.Jharkhand.districtData.Hazaribagh.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Hazaribagh.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Hazaribagh.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Hazaribagh.deceased}

`
)})
}  else if (msg.body == `-covid jamtara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jamtara Covid19 Cases-----╕*

*District Name :* Jamtara, JH
*Total Cases :* ${con.Jharkhand.districtData.Jamtara.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Jamtara.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Jamtara.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Jamtara.deceased}

`
)})
}  else if (msg.body == `-covid khunti`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Khunti Covid19 Cases-----╕*

*District Name :* Khunti, JH
*Total Cases :* ${con.Jharkhand.districtData.Khunti.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Khunti.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Khunti.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Khunti.deceased}

`
)})
}  else if (msg.body == `-covid koderma`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Koderma Covid19 Cases-----╕*

*District Name :* Koderma, JH
*Total Cases :* ${con.Jharkhand.districtData.Koderma.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Koderma.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Koderma.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Koderma.deceased}

`
)})
}  else if (msg.body == `-covid latehar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Latehar Covid19 Cases-----╕*

*District Name :* Latehar, JH
*Total Cases :* ${con.Jharkhand.districtData.Latehar.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Latehar.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Latehar.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Latehar.deceased}

`
)})
}  else if (msg.body == `-covid lohardaga`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Lohardaga Covid19 Cases-----╕*

*District Name :* Lohardaga, JH
*Total Cases :* ${con.Jharkhand.districtData.Lohardaga.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Lohardaga.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Lohardaga.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Lohardaga.deceased}

`
)})
}  else if (msg.body == `-covid pakur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pakur Covid19 Cases-----╕*

*District Name :* Pakur, JH
*Total Cases :* ${con.Jharkhand.districtData.Pakur.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Pakur.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Pakur.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Pakur.deceased}

`
)})
}  else if (msg.body == `-covid palamu`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Palamu Covid19 Cases-----╕*

*District Name :* Palamu, JH
*Total Cases :* ${con.Jharkhand.districtData.Palamu.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Palamu.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Palamu.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Palamu.deceased}

`
)})
}  else if (msg.body == `-covid ramgarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ramgarh Covid19 Cases-----╕*

*District Name :* Ramgarh, JH
*Total Cases :* ${con.Jharkhand.districtData.Ramgarh.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Ramgarh.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Ramgarh.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Ramgarh.deceased}

`
)})
}  else if (msg.body == `-covid ranchi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ranchi Covid19 Cases-----╕*

*District Name :* Ranchi, JH
*Total Cases :* ${con.Jharkhand.districtData.Ranchi.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Ranchi.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Ranchi.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Ranchi.deceased}

`
)})
}  else if (msg.body == `-covid sahibganj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sahibganj Covid19 Cases-----╕*

*District Name :* Sahibganj, JH
*Total Cases :* ${con.Jharkhand.districtData.Sahibganj.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Sahibganj.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Sahibganj.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Sahibganj.deceased}

`
)})
}  else if (msg.body == `-covid saraikela-kharsawan`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Saraikela-Kharsawan Covid19 Cases-----╕*

*District Name :* Saraikela-Kharsawan, JH
*Total Cases :* ${con.Jharkhand.districtData.Saraikela-Kharsawan.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Saraikela-Kharsawan.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Saraikela-Kharsawan.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Saraikela-Kharsawan.deceased}

`
)})
}  else if (msg.body == `-covid simdega`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Simdega Covid19 Cases-----╕*

*District Name :* Simdega, JH
*Total Cases :* ${con.Jharkhand.districtData.Simdega.confirmed}
*Active Cases :* ${con.Jharkhand.districtData.Simdega.active}
*Recovered Cases :* ${con.Jharkhand.districtData.Simdega.recovered}
*Death Cases :* ${con.Jharkhand.districtData.Simdega.deceased}

`
)})
}  else if (msg.body == `-covid westsinghbhum`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----West Singhbhum Covid19 Cases-----╕*

*District Name :* West Singhbhum, JH
*Total Cases :* ${con.Jharkhand.districtData['West Singhbhum'].confirmed}
*Active Cases :* ${con.Jharkhand.districtData['West Singhbhum'].active}
*Recovered Cases :* ${con.Jharkhand.districtData['West Singhbhum'].recovered}
*Death Cases :* ${con.Jharkhand.districtData['West Singhbhum'].deceased}

`
)})
}  

//Jammu & Kashmir

else if (msg.body == `-covid anantnag`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Anantnag Covid19 Cases-----╕*

*District Name :* Anantnag, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Anantnag.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Anantnag.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Anantnag.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Anantnag.deceased}

`
)})
}  else if (msg.body == `-covid bandipora`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bandipora Covid19 Cases-----╕*

*District Name :* Bandipora, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Bandipora.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Bandipora.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Bandipora.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Bandipora.deceased}

`
)})
}  else if (msg.body == `-covid baramulla`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Baramulla Covid19 Cases-----╕*

*District Name :* Baramulla, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Baramulla.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Baramulla.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Baramulla.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Baramulla.deceased}

`
)})
}  else if (msg.body == `-covid budgam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Budgam Covid19 Cases-----╕*

*District Name :* Budgam, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Budgam.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Budgam.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Budgam.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Budgam.deceased}

`
)})
}  else if (msg.body == `-covid doda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Doda Covid19 Cases-----╕*

*District Name :* Doda, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Doda.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Doda.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Doda.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Doda.deceased}

`
)})
}  else if (msg.body == `-covid ganderbal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ganderbal Covid19 Cases-----╕*

*District Name :* Ganderbal, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Ganderbal.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Ganderbal.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Ganderbal.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Ganderbal.deceased}

`
)})
}  else if (msg.body == `-covid jammu`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jammu Covid19 Cases-----╕*

*District Name :* Jammu, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Jammu.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Jammu.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Jammu.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Jammu.deceased}

`
)})
}  else if (msg.body == `-covid kathua`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kathua Covid19 Cases-----╕*

*District Name :* Kathua, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Kathua.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Kathua.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Kathua.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Kathua.deceased}

`
)})
}  else if (msg.body == `-covid kishtwar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kishtwar Covid19 Cases-----╕*

*District Name :* Kishtwar, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Kishtwar.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Kishtwar.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Kishtwar.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Kishtwar.deceased}

`
)})
}  else if (msg.body == `-covid kulgam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kulgam Covid19 Cases-----╕*

*District Name :* Kulgam, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Kulgam.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Kulgam.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Kulgam.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Kulgam.deceased}

`
)})
}  else if (msg.body == `-covid kupwara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kupwara Covid19 Cases-----╕*

*District Name :* Kupwara, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Kupwara.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Kupwara.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Kupwara.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Kupwara.deceased}

`
)})
}  else if (msg.body == `-covid mirpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mirpur Covid19 Cases-----╕*

*District Name :* Mirpur, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Mirpur.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Mirpur.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Mirpur.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Mirpur.deceased}

`
)})
}  else if (msg.body == `-covid muzaffarabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Muzaffarabad Covid19 Cases-----╕*

*District Name :* Muzaffarabad, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Muzaffarabad.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Muzaffarabad.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Muzaffarabad.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Muzaffarabad.deceased}

`
)})
}  else if (msg.body == `-covid pulwama`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pulwama Covid19 Cases-----╕*

*District Name :* Pulwama, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Pulwama.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Pulwama.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Pulwama.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Pulwama.deceased}

`
)})
}  else if (msg.body == `-covid punch`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Punch Covid19 Cases-----╕*

*District Name :* Punch, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Punch.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Punch.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Punch.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Punch.deceased}

`
)})
}  else if (msg.body == `-covid rajouri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rajouri Covid19 Cases-----╕*

*District Name :* Rajouri, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Rajouri.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Rajouri.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Rajouri.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Rajouri.deceased}

`
)})
}  else if (msg.body == `-covid reasi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Reasi Covid19 Cases-----╕*

*District Name :* Reasi, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Reasi.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Reasi.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Reasi.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Reasi.deceased}

`
)})
}  else if (msg.body == `-covid samba`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Samba Covid19 Cases-----╕*

*District Name :* Samba, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Samba.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Samba.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Samba.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Samba.deceased}

`
)})
}  else if (msg.body == `-covid shopiyan`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shopiyan Covid19 Cases-----╕*

*District Name :* Shopiyan, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Shopiyan.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Shopiyan.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Shopiyan.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Shopiyan.deceased}

`
)})
}  else if (msg.body == `-covid srinagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Srinagar Covid19 Cases-----╕*

*District Name :* Srinagar, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Srinagar.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Srinagar.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Srinagar.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Srinagar.deceased}

`
)})
}  else if (msg.body == `-covid udhampur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Udhampur Covid19 Cases-----╕*

*District Name :* Udhampur, JK
*Total Cases :* ${con['Jammu and Kashmir'].districtData.Udhampur.confirmed}
*Active Cases :* ${con['Jammu and Kashmir'].districtData.Udhampur.active}
*Recovered Cases :* ${con['Jammu and Kashmir'].districtData.Udhampur.recovered}
*Death Cases :* ${con['Jammu and Kashmir'].districtData.Udhampur.deceased}

`
)})
}  

// Karnataka

else if (msg.body == `-covid bagalkote`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bagalkote Covid19 Cases-----╕*

*District Name :* Bagalkote, KA
*Total Cases :* ${con.Karnataka.districtData.Bagalkote.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Bagalkote.active}
*Recovered Cases :* ${con.Karnataka.districtData.Bagalkote.recovered}
*Death Cases :* ${con.Karnataka.districtData.Bagalkote.deceased}

`
)})
}  else if (msg.body == `-covid ballari`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ballari Covid19 Cases-----╕*

*District Name :* Ballari, KA
*Total Cases :* ${con.Karnataka.districtData.Ballari.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Ballari.active}
*Recovered Cases :* ${con.Karnataka.districtData.Ballari.recovered}
*Death Cases :* ${con.Karnataka.districtData.Ballari.deceased}

`
)})
}  else if (msg.body == `-covid belagavi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Belagavi Covid19 Cases-----╕*

*District Name :* Belagavi, KA
*Total Cases :* ${con.Karnataka.districtData.Belagavi.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Belagavi.active}
*Recovered Cases :* ${con.Karnataka.districtData.Belagavi.recovered}
*Death Cases :* ${con.Karnataka.districtData.Belagavi.deceased}

`
)})
}  else if (msg.body == `-covid bengalururural`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bengaluru Rural Covid19 Cases-----╕*

*District Name :* Bengaluru Rural, KA
*Total Cases :* ${con.Karnataka.districtData['Bengaluru Rural'].confirmed}
*Active Cases :* ${con.Karnataka.districtData['Bengaluru Rural'].active}
*Recovered Cases :* ${con.Karnataka.districtData['Bengaluru Rural'].recovered}
*Death Cases :* ${con.Karnataka.districtData['Bengaluru Rural'].deceased}

`
)})
}  else if (msg.body == `-covid bengaluruurban`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bengaluru Urban Covid19 Cases-----╕*

*District Name :* Bengaluru Urban, KA
*Total Cases :* ${con.Karnataka.districtData['Bengaluru Urban'].confirmed}
*Active Cases :* ${con.Karnataka.districtData['Bengaluru Urban'].active}
*Recovered Cases :* ${con.Karnataka.districtData['Bengaluru Urban'].recovered}
*Death Cases :* ${con.Karnataka.districtData['Bengaluru Urban'].deceased}

`
)})
}  else if (msg.body == `-covid bidar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bidar Covid19 Cases-----╕*

*District Name :* Bidar, KA
*Total Cases :* ${con.Karnataka.districtData.Bidar.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Bidar.active}
*Recovered Cases :* ${con.Karnataka.districtData.Bidar.recovered}
*Death Cases :* ${con.Karnataka.districtData.Bidar.deceased}

`
)})
}  else if (msg.body == `-covid chamarajanagara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chamarajanagara Covid19 Cases-----╕*

*District Name :* Chamarajanagara, KA
*Total Cases :* ${con.Karnataka.districtData.Chamarajanagara.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Chamarajanagara.active}
*Recovered Cases :* ${con.Karnataka.districtData.Chamarajanagara.recovered}
*Death Cases :* ${con.Karnataka.districtData.Chamarajanagara.deceased}

`
)})
}  else if (msg.body == `-covid chikkaballapura`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----CChikkaballapura Covid19 Cases-----╕*

*District Name :* Chikkaballapura, KA
*Total Cases :* ${con.Karnataka.districtData.Chikkaballapura.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Chikkaballapura.active}
*Recovered Cases :* ${con.Karnataka.districtData.Chikkaballapura.recovered}
*Death Cases :* ${con.Karnataka.districtData.Chikkaballapura.deceased}

`
)})
}  else if (msg.body == `-covid chikkamagaluru`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chikkamagaluru Covid19 Cases-----╕*

*District Name :* Chikkamagaluru, KA
*Total Cases :* ${con.Karnataka.districtData.Chikkamagaluru.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Chikkamagaluru.active}
*Recovered Cases :* ${con.Karnataka.districtData.Chikkamagaluru.recovered}
*Death Cases :* ${con.Karnataka.districtData.Chikkamagaluru.deceased}

`
)})
}  else if (msg.body == `-covid chitradurga`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chitradurga Covid19 Cases-----╕*

*District Name :* Chitradurga, KA
*Total Cases :* ${con.Karnataka.districtData.Chitradurga.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Chitradurga.active}
*Recovered Cases :* ${con.Karnataka.districtData.Chitradurga.recovered}
*Death Cases :* ${con.Karnataka.districtData.Chitradurga.deceased}

`
)})
}  else if (msg.body == `-covid dakshinakannada`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dakshina Kannada Covid19 Cases-----╕*

*District Name :* Dakshina Kannada, KA
*Total Cases :* ${con.Karnataka.districtData['Dakshina Kannada'].confirmed}
*Active Cases :* ${con.Karnataka.districtData['Dakshina Kannada'].active}
*Recovered Cases :* ${con.Karnataka.districtData['Dakshina Kannada'].recovered}
*Death Cases :* ${con.Karnataka.districtData['Dakshina Kannada'].deceased}

`
)})
}  else if (msg.body == `-covid davanagere`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Davanagere Covid19 Cases-----╕*

*District Name :* Davanagere, KA
*Total Cases :* ${con.Karnataka.districtData.Davanagere.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Davanagere.active}
*Recovered Cases :* ${con.Karnataka.districtData.Davanagere.recovered}
*Death Cases :* ${con.Karnataka.districtData.Davanagere.deceased}

`
)})
}  else if (msg.body == `-covid dharwad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dharwad Covid19 Cases-----╕*

*District Name :* Dharwad, KA
*Total Cases :* ${con.Karnataka.districtData.Dharwad.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Dharwad.active}
*Recovered Cases :* ${con.Karnataka.districtData.Dharwad.recovered}
*Death Cases :* ${con.Karnataka.districtData.Dharwad.deceased}

`
)})
}  else if (msg.body == `-covid gadag`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gadag Covid19 Cases-----╕*

*District Name :* Gadag, KA
*Total Cases :* ${con.Karnataka.districtData.Gadag.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Gadag.active}
*Recovered Cases :* ${con.Karnataka.districtData.Gadag.recovered}
*Death Cases :* ${con.Karnataka.districtData.Gadag.deceased}

`
)})
}  else if (msg.body == `-covid hassan`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hassan Covid19 Cases-----╕*

*District Name :* Hassan, KA
*Total Cases :* ${con.Karnataka.districtData.Hassan.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Hassan.active}
*Recovered Cases :* ${con.Karnataka.districtData.Hassan.recovered}
*Death Cases :* ${con.Karnataka.districtData.Hassan.deceased}

`
)})
}  else if (msg.body == `-covid haveri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Haveri Covid19 Cases-----╕*

*District Name :* Haveri, KA
*Total Cases :* ${con.Karnataka.districtData.Haveri.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Haveri.active}
*Recovered Cases :* ${con.Karnataka.districtData.Haveri.recovered}
*Death Cases :* ${con.Karnataka.districtData.Haveri.deceased}

`
)})
}  else if (msg.body == `-covid kalaburagi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kalaburagi Covid19 Cases-----╕*

*District Name :* Kalaburagi, KA
*Total Cases :* ${con.Karnataka.districtData.Kalaburagi.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Kalaburagi.active}
*Recovered Cases :* ${con.Karnataka.districtData.Kalaburagi.recovered}
*Death Cases :* ${con.Karnataka.districtData.Kalaburagi.deceased}

`
)})
}  else if (msg.body == `-covid kodagu`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kodagu Covid19 Cases-----╕*

*District Name :* Kodagu, KA
*Total Cases :* ${con.Karnataka.districtData.Kodagu.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Kodagu.active}
*Recovered Cases :* ${con.Karnataka.districtData.Kodagu.recovered}
*Death Cases :* ${con.Karnataka.districtData.Kodagu.deceased}

`
)})
}  else if (msg.body == `-covid kolar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kolar Covid19 Cases-----╕*

*District Name :* Kolar, KA
*Total Cases :* ${con.Karnataka.districtData.Kolar.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Kolar.active}
*Recovered Cases :* ${con.Karnataka.districtData.Kolar.recovered}
*Death Cases :* ${con.Karnataka.districtData.Kolar.deceased}

`
)})
}  else if (msg.body == `-covid mandya`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mandya Covid19 Cases-----╕*

*District Name :* Mandya, KA
*Total Cases :* ${con.Karnataka.districtData.Mandya.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Mandya.active}
*Recovered Cases :* ${con.Karnataka.districtData.Mandya.recovered}
*Death Cases :* ${con.Karnataka.districtData.Mandya.deceased}

`
)})
}  else if (msg.body == `-covid mysuru`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mysuru Covid19 Cases-----╕*

*District Name :* Mysuru, KA
*Total Cases :* ${con.Karnataka.districtData.Mysuru.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Mysuru.active}
*Recovered Cases :* ${con.Karnataka.districtData.Mysuru.recovered}
*Death Cases :* ${con.Karnataka.districtData.Mysuru.deceased}

`
)})
}  else if (msg.body == `-covid raichur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Raichur Covid19 Cases-----╕*

*District Name :* Raichur, KA
*Total Cases :* ${con.Karnataka.districtData.Raichur.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Raichur.active}
*Recovered Cases :* ${con.Karnataka.districtData.Raichur.recovered}
*Death Cases :* ${con.Karnataka.districtData.Raichur.deceased}

`
)})
}  else if (msg.body == `-covid shivamogga`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shivamogga Covid19 Cases-----╕*

*District Name :* Shivamogga, KA
*Total Cases :* ${con.Karnataka.districtData.Shivamogga.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Shivamogga.active}
*Recovered Cases :* ${con.Karnataka.districtData.Shivamogga.recovered}
*Death Cases :* ${con.Karnataka.districtData.Shivamogga.deceased}

`
)})
}  else if (msg.body == `-covid tumakuru`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tumakuru Covid19 Cases-----╕*

*District Name :* Tumakuru, KA
*Total Cases :* ${con.Karnataka.districtData.Tumakuru.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Tumakuru.active}
*Recovered Cases :* ${con.Karnataka.districtData.Tumakuru.recovered}
*Death Cases :* ${con.Karnataka.districtData.Tumakuru.deceased}

`
)})
}  else if (msg.body == `-covid udupi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Udupi Covid19 Cases-----╕*

*District Name :* Udupi, KA
*Total Cases :* ${con.Karnataka.districtData.Udupi.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Udupi.active}
*Recovered Cases :* ${con.Karnataka.districtData.Udupi.recovered}
*Death Cases :* ${con.Karnataka.districtData.Udupi.deceased}

`
)})
}  else if (msg.body == `-covid uttarakannada`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Uttara Kannada Covid19 Cases-----╕*

*District Name :* Uttara Kannada, KA
*Total Cases :* ${con.Karnataka.districtData['Uttara Kannada'].confirmed}
*Active Cases :* ${con.Karnataka.districtData['Uttara Kannada'].active}
*Recovered Cases :* ${con.Karnataka.districtData['Uttara Kannada'].recovered}
*Death Cases :* ${con.Karnataka.districtData['Uttara Kannada'].deceased}

`
)})
}  else if (msg.body == `-covid vijayapura`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Vijayapura Covid19 Cases-----╕*

*District Name :* Vijayapura, KA
*Total Cases :* ${con.Karnataka.districtData.Vijayapura.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Vijayapura.active}
*Recovered Cases :* ${con.Karnataka.districtData.Vijayapura.recovered}
*Death Cases :* ${con.Karnataka.districtData.Vijayapura.deceased}

`
)})
}  else if (msg.body == `-covid yadgir`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Yadgir Covid19 Cases-----╕*

*District Name :* Yadgir, KA
*Total Cases :* ${con.Karnataka.districtData.Yadgir.confirmed}
*Active Cases :* ${con.Karnataka.districtData.Yadgir.active}
*Recovered Cases :* ${con.Karnataka.districtData.Yadgir.recovered}
*Death Cases :* ${con.Karnataka.districtData.Yadgir.deceased}

`
)})
}  

// Kerala

else if (msg.body == `-covid alappuzha`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Alappuzha Covid19 Cases-----╕*

*District Name :* Alappuzha, KL
*Total Cases :* ${con.Kerala.districtData.Alappuzha.confirmed}
*Active Cases :* ${con.Kerala.districtData.Alappuzha.active}
*Recovered Cases :* ${con.Kerala.districtData.Alappuzha.recovered}
*Death Cases :* ${con.Kerala.districtData.Alappuzha.deceased}

`
)})
}  else if (msg.body == `-covid ernakulam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ernakulam Covid19 Cases-----╕*

*District Name :* Ernakulam, KL
*Total Cases :* ${con.Kerala.districtData.Ernakulam.confirmed}
*Active Cases :* ${con.Kerala.districtData.Ernakulam.active}
*Recovered Cases :* ${con.Kerala.districtData.Ernakulam.recovered}
*Death Cases :* ${con.Kerala.districtData.Ernakulam.deceased}

`
)})
}  else if (msg.body == `-covid idukki`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Idukki Covid19 Cases-----╕*

*District Name :* Idukki, KL
*Total Cases :* ${con.Kerala.districtData.Idukki.confirmed}
*Active Cases :* ${con.Kerala.districtData.Idukki.active}
*Recovered Cases :* ${con.Kerala.districtData.Idukki.recovered}
*Death Cases :* ${con.Kerala.districtData.Idukki.deceased}

`
)})
}  else if (msg.body == `-covid kannur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kannur Covid19 Cases-----╕*

*District Name :* Kannur, KL
*Total Cases :* ${con.Kerala.districtData.Kannur.confirmed}
*Active Cases :* ${con.Kerala.districtData.Kannur.active}
*Recovered Cases :* ${con.Kerala.districtData.Kannur.recovered}
*Death Cases :* ${con.Kerala.districtData.Kannur.deceased}

`
)})
}  else if (msg.body == `-covid kasaragod`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kasaragod Covid19 Cases-----╕*

*District Name :* Kasaragod, KL
*Total Cases :* ${con.Kerala.districtData.Kasaragod.confirmed}
*Active Cases :* ${con.Kerala.districtData.Kasaragod.active}
*Recovered Cases :* ${con.Kerala.districtData.Kasaragod.recovered}
*Death Cases :* ${con.Kerala.districtData.Kasaragod.deceased}

`
)})
}  else if (msg.body == `-covid kollam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kollam Covid19 Cases-----╕*

*District Name :* Kollam, KL
*Total Cases :* ${con.Kerala.districtData.Kollam.confirmed}
*Active Cases :* ${con.Kerala.districtData.Kollam.active}
*Recovered Cases :* ${con.Kerala.districtData.Kollam.recovered}
*Death Cases :* ${con.Kerala.districtData.Kollam.deceased}

`
)})
}  else if (msg.body == `-covid kottayam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kottayam Covid19 Cases-----╕*

*District Name :* Kottayam, KL
*Total Cases :* ${con.Kerala.districtData.Kottayam.confirmed}
*Active Cases :* ${con.Kerala.districtData.Kottayam.active}
*Recovered Cases :* ${con.Kerala.districtData.Kottayam.recovered}
*Death Cases :* ${con.Kerala.districtData.Kottayam.deceased}

`
)})
}  else if (msg.body == `-covid kozhikode`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kozhikode Covid19 Cases-----╕*

*District Name :* Kozhikode, KL
*Total Cases :* ${con.Kerala.districtData.Kozhikode.confirmed}
*Active Cases :* ${con.Kerala.districtData.Kozhikode.active}
*Recovered Cases :* ${con.Kerala.districtData.Kozhikode.recovered}
*Death Cases :* ${con.Kerala.districtData.Kozhikode.deceased}

`
)})
}  else if (msg.body == `-covid malappuram`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Malappuram Covid19 Cases-----╕*

*District Name :* Malappuram, KL
*Total Cases :* ${con.Kerala.districtData.Malappuram.confirmed}
*Active Cases :* ${con.Kerala.districtData.Malappuram.active}
*Recovered Cases :* ${con.Kerala.districtData.Malappuram.recovered}
*Death Cases :* ${con.Kerala.districtData.Malappuram.deceased}

`
)})
}  else if (msg.body == `-covid palakkad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Palakkad Covid19 Cases-----╕*

*District Name :* Palakkad, KL
*Total Cases :* ${con.Kerala.districtData.Palakkad.confirmed}
*Active Cases :* ${con.Kerala.districtData.Palakkad.active}
*Recovered Cases :* ${con.Kerala.districtData.Palakkad.recovered}
*Death Cases :* ${con.Kerala.districtData.Palakkad.deceased}

`
)})
}  else if (msg.body == `-covid pathanamthitta`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pathanamthitta Covid19 Cases-----╕*

*District Name :* Pathanamthitta, KL
*Total Cases :* ${con.Kerala.districtData.Pathanamthitta.confirmed}
*Active Cases :* ${con.Kerala.districtData.Pathanamthitta.active}
*Recovered Cases :* ${con.Kerala.districtData.Pathanamthitta.recovered}
*Death Cases :* ${con.Kerala.districtData.Pathanamthitta.deceased}

`
)})
}  else if (msg.body == `-covid thiruvananthapuram`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Thiruvananthapuram Covid19 Cases-----╕*

*District Name :* Thiruvananthapuram, KL
*Total Cases :* ${con.Kerala.districtData.Thiruvananthapuram.confirmed}
*Active Cases :* ${con.Kerala.districtData.Thiruvananthapuram.active}
*Recovered Cases :* ${con.Kerala.districtData.Thiruvananthapuram.recovered}
*Death Cases :* ${con.Kerala.districtData.Thiruvananthapuram.deceased}

`
)})
}  else if (msg.body == `-covid thrissur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Thrissur Covid19 Cases-----╕*

*District Name :* Thrissur, KL
*Total Cases :* ${con.Kerala.districtData.Thrissur.confirmed}
*Active Cases :* ${con.Kerala.districtData.Thrissur.active}
*Recovered Cases :* ${con.Kerala.districtData.Thrissur.recovered}
*Death Cases :* ${con.Kerala.districtData.Thrissur.deceased}

`
)})
}  else if (msg.body == `-covid wayanad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Wayanad Covid19 Cases-----╕*

*District Name :* Wayanad, KL
*Total Cases :* ${con.Kerala.districtData.Wayanad.confirmed}
*Active Cases :* ${con.Kerala.districtData.Wayanad.active}
*Recovered Cases :* ${con.Kerala.districtData.Wayanad.recovered}
*Death Cases :* ${con.Kerala.districtData.Wayanad.deceased}

`
)})
}  

// Ladakh

else if (msg.body == `-covid kargil`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kargil Covid19 Cases-----╕*

*District Name :* Kargil, LA
*Total Cases :* ${con.Ladakh.districtData.Kargil.confirmed}
*Active Cases :* ${con.Ladakh.districtData.Kargil.active}
*Recovered Cases :* ${con.Ladakh.districtData.Kargil.recovered}
*Death Cases :* ${con.Ladakh.districtData.Kargil.deceased}

`
)})
}  else if (msg.body == `-covid leh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Leh Covid19 Cases-----╕*

*District Name :* Leh, LA
*Total Cases :* ${con.Ladakh.districtData.Leh.confirmed}
*Active Cases :* ${con.Ladakh.districtData.Leh.active}
*Recovered Cases :* ${con.Ladakh.districtData.Leh.recovered}
*Death Cases :* ${con.Ladakh.districtData.Leh.deceased}

`
)})
}  

// Lakshadweep

else if (msg.body == `-covid lakshadweep`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Lakshadweep Covid19 Cases-----╕*

*District Name :* Lakshadweep, LD
*Total Cases :* ${con.Lakshadweep.districtData.Lakshadweep.confirmed}
*Active Cases :* ${con.Lakshadweep.districtData.Lakshadweep.active}
*Recovered Cases :* ${con.Lakshadweep.districtData.Lakshadweep.recovered}
*Death Cases :* ${con.Lakshadweep.districtData.Lakshadweep.deceased}

`
)})
}  

// Maharashtra

else if (msg.body == `-covid ahmednagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ahmednagar Covid19 Cases-----╕*

*District Name :* Ahmednagar, MH
*Total Cases :* ${con.Maharashtra.districtData.Ahmednagar.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Ahmednagar.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Ahmednagar.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Ahmednagar.deceased}

`
)})
}  

else if (msg.body == `-covid akola`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Akola Covid19 Cases-----╕*

*District Name :* Akola, MH
*Total Cases :* ${con.Maharashtra.districtData.Akola.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Akola.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Akola.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Akola.deceased}

`
)})
}  else if (msg.body == `-covid amravati`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Amravati Covid19 Cases-----╕*

*District Name :* Amravati, MH
*Total Cases :* ${con.Maharashtra.districtData.Amravati.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Amravati.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Amravati.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Amravati.deceased}

`
)})
}  else if (msg.body == `-covid aurangabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Aurangabad Covid19 Cases-----╕*

*District Name :* Aurangabad, MH
*Total Cases :* ${con.Maharashtra.districtData.Aurangabad.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Aurangabad.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Aurangabad.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Aurangabad.deceased}

`
)})
}  else if (msg.body == `-covid beed`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Beed Covid19 Cases-----╕*

*District Name :* Beed, MH
*Total Cases :* ${con.Maharashtra.districtData.Beed.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Beed.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Beed.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Beed.deceased}

`
)})
}  else if (msg.body == `-covid bhandara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bhandara Covid19 Cases-----╕*

*District Name :* Bhandara, MH
*Total Cases :* ${con.Maharashtra.districtData.Bhandara.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Bhandara.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Bhandara.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Bhandara.deceased}

`
)})
}  else if (msg.body == `-covid buldhana`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Buldhana Covid19 Cases-----╕*

*District Name :* Buldhana, MH
*Total Cases :* ${con.Maharashtra.districtData.Buldhana.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Buldhana.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Buldhana.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Buldhana.deceased}

`
)})
}  else if (msg.body == `-covid chandrapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chandrapur Covid19 Cases-----╕*

*District Name :* Chandrapur, MH
*Total Cases :* ${con.Maharashtra.districtData.Chandrapur.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Chandrapur.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Chandrapur.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Chandrapur.deceased}

`
)})
}  else if (msg.body == `-covid dhule`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dhule Covid19 Cases-----╕*

*District Name :* Dhule, MH
*Total Cases :* ${con.Maharashtra.districtData.Dhule.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Dhule.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Dhule.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Dhule.deceased}

`
)})
}  else if (msg.body == `-covid gadchiroli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gadchiroli Covid19 Cases-----╕*

*District Name :* Gadchiroli, MH
*Total Cases :* ${con.Maharashtra.districtData.Gadchiroli.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Gadchiroli.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Gadchiroli.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Gadchiroli.deceased}

`
)})
}  else if (msg.body == `-covid gondia`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gondia Covid19 Cases-----╕*

*District Name :* Gondia, MH
*Total Cases :* ${con.Maharashtra.districtData.Gondia.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Gondia.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Gondia.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Gondia.deceased}

`
)})
}  else if (msg.body == `-covid hingoli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hingoli Covid19 Cases-----╕*

*District Name :* Hingoli, MH
*Total Cases :* ${con.Maharashtra.districtData.Hingoli.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Hingoli.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Hingoli.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Hingoli.deceased}

`
)})
}  else if (msg.body == `-covid jalgaon`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jalgaon Covid19 Cases-----╕*

*District Name :* Jalgaon, MH
*Total Cases :* ${con.Maharashtra.districtData.Jalgaon.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Jalgaon.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Jalgaon.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Jalgaon.deceased}

`
)})
}  else if (msg.body == `-covid jalna`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jalna Covid19 Cases-----╕*

*District Name :* Jalna, MH
*Total Cases :* ${con.Maharashtra.districtData.Jalna.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Jalna.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Jalna.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Jalna.deceased}

`
)})
}  else if (msg.body == `-covid kolhapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kolhapur Covid19 Cases-----╕*

*District Name :* Kolhapur, MH
*Total Cases :* ${con.Maharashtra.districtData.Kolhapur.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Kolhapur.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Kolhapur.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Kolhapur.deceased}

`
)})
}  else if (msg.body == `-covid latur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Latur Covid19 Cases-----╕*

*District Name :* Latur, MH
*Total Cases :* ${con.Maharashtra.districtData.Latur.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Latur.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Latur.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Latur.deceased}

`
)})
}  else if (msg.body == `-covid mumbai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mumbai Covid19 Cases-----╕*

*District Name :* Mumbai, MH
*Total Cases :* ${con.Maharashtra.districtData.Mumbai.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Mumbai.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Mumbai.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Mumbai.deceased}

`
)})
}  else if (msg.body == `-covid mumbaisuburban`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mumbai Suburban Covid19 Cases-----╕*

*District Name :* Mumbai Suburban, MH
*Total Cases :* ${con.Maharashtra.districtData['Mumbai Suburban'].confirmed}
*Active Cases :* ${con.Maharashtra.districtData['Mumbai Suburban'].active}
*Recovered Cases :* ${con.Maharashtra.districtData['Mumbai Suburban'].recovered}
*Death Cases :* ${con.Maharashtra.districtData['Mumbai Suburban'].deceased}

`
)})
}  else if (msg.body == `-covid nagpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nagpur Covid19 Cases-----╕*

*District Name :* Nagpur, MH
*Total Cases :* ${con.Maharashtra.districtData.Nagpur.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Nagpur.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Nagpur.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Nagpur.deceased}

`
)})
}  else if (msg.body == `-covid nanded`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nanded Covid19 Cases-----╕*

*District Name :* Nanded, MH
*Total Cases :* ${con.Maharashtra.districtData.Nanded.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Nanded.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Nanded.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Nanded.deceased}

`
)})
}  else if (msg.body == `-covid nandurbar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nandurbar Covid19 Cases-----╕*

*District Name :* Nandurbar, MH
*Total Cases :* ${con.Maharashtra.districtData.Nandurbar.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Nandurbar.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Nandurbar.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Nandurbar.deceased}

`
)})
}  else if (msg.body == `-covid nashik`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nashik Covid19 Cases-----╕*

*District Name :* Nashik, MH
*Total Cases :* ${con.Maharashtra.districtData.Nashik.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Nashik.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Nashik.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Nashik.deceased}

`
)})
}  else if (msg.body == `-covid osmanabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Osmanabad Covid19 Cases-----╕*

*District Name :* Osmanabad, MH
*Total Cases :* ${con.Maharashtra.districtData.Osmanabad.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Osmanabad.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Osmanabad.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Osmanabad.deceased}

`
)})
}  else if (msg.body == `-covid palghar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Palghar Covid19 Cases-----╕*

*District Name :* Palghar, MH
*Total Cases :* ${con.Maharashtra.districtData.Palghar.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Palghar.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Palghar.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Palghar.deceased}

`
)})
}  else if (msg.body == `-covid parbhani`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Parbhani Covid19 Cases-----╕*

*District Name :* Parbhani, MH
*Total Cases :* ${con.Maharashtra.districtData.Parbhani.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Parbhani.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Parbhani.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Parbhani.deceased}

`
)})
}  else if (msg.body == `-covid pune`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pune Covid19 Cases-----╕*

*District Name :* Pune, MH
*Total Cases :* ${con.Maharashtra.districtData.Pune.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Pune.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Pune.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Pune.deceased}

`
)})
}  else if (msg.body == `-covid raigad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Raigad Covid19 Cases-----╕*

*District Name :* Raigad, MH
*Total Cases :* ${con.Maharashtra.districtData.Raigad.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Raigad.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Raigad.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Raigad.deceased}

`
)})
}  else if (msg.body == `-covid ratnagiri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ratnagiri Covid19 Cases-----╕*

*District Name :* Ratnagiri, MH
*Total Cases :* ${con.Maharashtra.districtData.Ratnagiri.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Ratnagiri.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Ratnagiri.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Ratnagiri.deceased}

`
)})
}  else if (msg.body == `-covid sangli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sangli Covid19 Cases-----╕*

*District Name :* Sangli, MH
*Total Cases :* ${con.Maharashtra.districtData.Sangli.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Sangli.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Sangli.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Sangli.deceased}

`
)})
}  else if (msg.body == `-covid satara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Satara Covid19 Cases-----╕*

*District Name :* Satara, MH
*Total Cases :* ${con.Maharashtra.districtData.Satara.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Satara.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Satara.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Satara.deceased}

`
)})
}  else if (msg.body == `-covid sindhudurg`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sindhudurg Covid19 Cases-----╕*

*District Name :* Sindhudurg, MH
*Total Cases :* ${con.Maharashtra.districtData.Sindhudurg.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Sindhudurg.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Sindhudurg.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Sindhudurg.deceased}

`
)})
}  else if (msg.body == `-covid solapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Solapur Covid19 Cases-----╕*

*District Name :* Solapur, MH
*Total Cases :* ${con.Maharashtra.districtData.Solapur.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Solapur.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Solapur.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Solapur.deceased}

`
)})
}  else if (msg.body == `-covid thane`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Thane Covid19 Cases-----╕*

*District Name :* Thane, MH
*Total Cases :* ${con.Maharashtra.districtData.Thane.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Thane.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Thane.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Thane.deceased}

`
)})
}  else if (msg.body == `-covid wardha`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Wardha Covid19 Cases-----╕*

*District Name :* Wardha, MH
*Total Cases :* ${con.Maharashtra.districtData.Wardha.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Wardha.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Wardha.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Wardha.deceased}

`
)})
}  else if (msg.body == `-covid washim`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Washim Covid19 Cases-----╕*

*District Name :* Washim, MH
*Total Cases :* ${con.Maharashtra.districtData.Washim.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Washim.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Washim.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Washim.deceased}

`
)})
}  else if (msg.body == `-covid yavatmal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Yavatmal Covid19 Cases-----╕*

*District Name :* Yavatmal, MH
*Total Cases :* ${con.Maharashtra.districtData.Yavatmal.confirmed}
*Active Cases :* ${con.Maharashtra.districtData.Yavatmal.active}
*Recovered Cases :* ${con.Maharashtra.districtData.Yavatmal.recovered}
*Death Cases :* ${con.Maharashtra.districtData.Yavatmal.deceased}

`
)})
} 

// Meghalaya

else if (msg.body == `-covid eastgarohills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----East Garo Hills Covid19 Cases-----╕*

*District Name :* East Garo Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['East Garo Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['East Garo Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['East Garo Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['East Garo Hills'].deceased}

`
)})
}  else if (msg.body == `-covid eastjaintiahills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----East Jaintia Hills Covid19 Cases-----╕*

*District Name :* East Jaintia Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['East Jaintia Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['East Jaintia Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['East Jaintia Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['East Jaintia Hills'].deceased}

`
)})
}  else if (msg.body == `-covid eastkhasihills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----East Khasi Hills Covid19 Cases-----╕*

*District Name :* East Khasi Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['East Khasi Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['East Khasi Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['East Khasi Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['East Khasi Hills'].deceased}

`
)})
}  else if (msg.body == `-covid northgarohills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North Garo Hills Covid19 Cases-----╕*

*District Name :* North Garo Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['North Garo Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['North Garo Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['North Garo Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['North Garo Hills'].deceased}

`
)})
}  else if (msg.body == `-covid southgarohills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South Garo Hills Covid19 Cases-----╕*

*District Name :* South Garo Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['South Garo Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['South Garo Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['South Garo Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['South Garo Hills'].deceased}

`
)})
}  else if (msg.body == `-covid southwestgarohills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South West Garo Hills Covid19 Cases-----╕*

*District Name :* South West Garo Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['South West Garo Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['South West Garo Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['South West Garo Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['South West Garo Hills'].deceased}

`
)})
}  else if (msg.body == `-covid southwestkhasihills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South West Khasi Hills Covid19 Cases-----╕*

*District Name :* South West Khasi Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['South West Khasi Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['South West Khasi Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['South West Khasi Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['South West Khasi Hills'].deceased}

`
)})
}  else if (msg.body == `-covid westgarohills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----West Garo Hills Covid19 Cases-----╕*

*District Name :* West Garo Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['West Garo Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['West Garo Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['West Garo Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['West Garo Hills'].deceased}

`
)})
}  else if (msg.body == `-covid westjaintiahills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----West Jaintia Hills Covid19 Cases-----╕*

*District Name :* West Jaintia Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['West Jaintia Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['West Jaintia Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['West Jaintia Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['West Jaintia Hills'].deceased}

`
)})
}  else if (msg.body == `-covid westkhasihills`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----West Khasi Hills Covid19 Cases-----╕*

*District Name :* West Khasi Hills, ML
*Total Cases :* ${con.Meghalaya.districtData['West Khasi Hills'].confirmed}
*Active Cases :* ${con.Meghalaya.districtData['West Khasi Hills'].active}
*Recovered Cases :* ${con.Meghalaya.districtData['West Khasi Hills'].recovered}
*Death Cases :* ${con.Meghalaya.districtData['West Khasi Hills'].deceased}

`
)})
}  else if (msg.body == `-covid ribhoi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ribhoi Covid19 Cases-----╕*

*District Name :* Ribhoi, ML
*Total Cases :* ${con.Meghalaya.districtData.Ribhoi.confirmed}
*Active Cases :* ${con.Meghalaya.districtData.Ribhoi.active}
*Recovered Cases :* ${con.Meghalaya.districtData.Ribhoi.recovered}
*Death Cases :* ${con.Meghalaya.districtData.Ribhoi.deceased}

`
)})
}  

// Manipur

else if (msg.body == `-covid capfpersonnel`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----CAPF Personnel Covid19 Cases-----╕*

*District Name :* CAPF Personnel, MN
*Total Cases :* ${con.Manipur.districtData['CAPF Personnel'].confirmed}
*Active Cases :* ${con.Manipur.districtData['CAPF Personnel'].active}
*Recovered Cases :* ${con.Manipur.districtData['CAPF Personnel'].recovered}
*Death Cases :* ${con.Manipur.districtData['CAPF Personnel'].deceased}

`
)})
}  else if (msg.body == `-covid bishnupur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bishnupur Covid19 Cases-----╕*

*District Name :* Bishnupur, MN
*Total Cases :* ${con.Manipur.districtData.Bishnupur.confirmed}
*Active Cases :* ${con.Manipur.districtData.Bishnupur.active}
*Recovered Cases :* ${con.Manipur.districtData.Bishnupur.recovered}
*Death Cases :* ${con.Manipur.districtData.Bishnupur.deceased}

`
)})
}  else if (msg.body == `-covid chandel`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chandel Covid19 Cases-----╕*

*District Name :* Chandel, MN
*Total Cases :* ${con.Manipur.districtData.Chandel.confirmed}
*Active Cases :* ${con.Manipur.districtData.Chandel.active}
*Recovered Cases :* ${con.Manipur.districtData.Chandel.recovered}
*Death Cases :* ${con.Manipur.districtData.Chandel.deceased}

`
)})
}  else if (msg.body == `-covid churachandpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Churachandpur Covid19 Cases-----╕*

*District Name :* Churachandpur, MN
*Total Cases :* ${con.Manipur.districtData.Churachandpur.confirmed}
*Active Cases :* ${con.Manipur.districtData.Churachandpur.active}
*Recovered Cases :* ${con.Manipur.districtData.Churachandpur.recovered}
*Death Cases :* ${con.Manipur.districtData.Churachandpur.deceased}

`
)})
}  else if (msg.body == `-covid jiribam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jiribam Covid19 Cases-----╕*

*District Name :* Jiribam, MN
*Total Cases :* ${con.Manipur.districtData.Jiribam.confirmed}
*Active Cases :* ${con.Manipur.districtData.Jiribam.active}
*Recovered Cases :* ${con.Manipur.districtData.Jiribam.recovered}
*Death Cases :* ${con.Manipur.districtData.Jiribam.deceased}

`
)})
}  else if (msg.body == `-covid kakching`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kakching Covid19 Cases-----╕*

*District Name :* Kakching, MN
*Total Cases :* ${con.Manipur.districtData.Kakching.confirmed}
*Active Cases :* ${con.Manipur.districtData.Kakching.active}
*Recovered Cases :* ${con.Manipur.districtData.Kakching.recovered}
*Death Cases :* ${con.Manipur.districtData.Kakching.deceased}

`
)})
}  else if (msg.body == `-covid kamjong`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kamjong Covid19 Cases-----╕*

*District Name :* Kamjong, MN
*Total Cases :* ${con.Manipur.districtData.Kamjong.confirmed}
*Active Cases :* ${con.Manipur.districtData.Kamjong.active}
*Recovered Cases :* ${con.Manipur.districtData.Kamjong.recovered}
*Death Cases :* ${con.Manipur.districtData.Kamjong.deceased}

`
)})
}  else if (msg.body == `-covid kangpokpi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kangpokpi Covid19 Cases-----╕*

*District Name :* Kangpokpi, MN
*Total Cases :* ${con.Manipur.districtData.Kangpokpi.confirmed}
*Active Cases :* ${con.Manipur.districtData.Kangpokpi.active}
*Recovered Cases :* ${con.Manipur.districtData.Kangpokpi.recovered}
*Death Cases :* ${con.Manipur.districtData.Kangpokpi.deceased}

`
)})
}  else if (msg.body == `-covid noney`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Noney Covid19 Cases-----╕*

*District Name :* Noney, MN
*Total Cases :* ${con.Manipur.districtData.Noney.confirmed}
*Active Cases :* ${con.Manipur.districtData.Noney.active}
*Recovered Cases :* ${con.Manipur.districtData.Noney.recovered}
*Death Cases :* ${con.Manipur.districtData.Noney.deceased}

`
)})
}  else if (msg.body == `-covid pherzawl`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pherzawl Covid19 Cases-----╕*

*District Name :* Pherzawl, MN
*Total Cases :* ${con.Manipur.districtData.Pherzawl.confirmed}
*Active Cases :* ${con.Manipur.districtData.Pherzawl.active}
*Recovered Cases :* ${con.Manipur.districtData.Pherzawl.recovered}
*Death Cases :* ${con.Manipur.districtData.Pherzawl.deceased}

`
)})
}  else if (msg.body == `-covid senapati`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Senapati Covid19 Cases-----╕*

*District Name :* Senapati, MN
*Total Cases :* ${con.Manipur.districtData.Senapati.confirmed}
*Active Cases :* ${con.Manipur.districtData.Senapati.active}
*Recovered Cases :* ${con.Manipur.districtData.Senapati.recovered}
*Death Cases :* ${con.Manipur.districtData.Senapati.deceased}

`
)})
}  else if (msg.body == `-covid tamenglong`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tamenglong Covid19 Cases-----╕*

*District Name :* Tamenglong, MN
*Total Cases :* ${con.Manipur.districtData.Tamenglong.confirmed}
*Active Cases :* ${con.Manipur.districtData.Tamenglong.active}
*Recovered Cases :* ${con.Manipur.districtData.Tamenglong.recovered}
*Death Cases :* ${con.Manipur.districtData.Tamenglong.deceased}

`
)})
}  else if (msg.body == `-covid engnoupal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tengnoupal Covid19 Cases-----╕*

*District Name :* Tengnoupal, MN
*Total Cases :* ${con.Manipur.districtData.Tengnoupal.confirmed}
*Active Cases :* ${con.Manipur.districtData.Tengnoupal.active}
*Recovered Cases :* ${con.Manipur.districtData.Tengnoupal.recovered}
*Death Cases :* ${con.Manipur.districtData.Tengnoupal.deceased}

`
)})
}  else if (msg.body == `-covid thoubal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Thoubal Covid19 Cases-----╕*

*District Name :* Thoubal, MN
*Total Cases :* ${con.Manipur.districtData.Thoubal.confirmed}
*Active Cases :* ${con.Manipur.districtData.Thoubal.active}
*Recovered Cases :* ${con.Manipur.districtData.Thoubal.recovered}
*Death Cases :* ${con.Manipur.districtData.Thoubal.deceased}

`
)})
}  else if (msg.body == `-covid ukhrul`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ukhrul Covid19 Cases-----╕*

*District Name :* Ukhrul, MN
*Total Cases :* ${con.Manipur.districtData.Ukhrul.confirmed}
*Active Cases :* ${con.Manipur.districtData.Ukhrul.active}
*Recovered Cases :* ${con.Manipur.districtData.Ukhrul.recovered}
*Death Cases :* ${con.Manipur.districtData.Ukhrul.deceased}

`
)})
}  else if (msg.body == `-covid unknownmn`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Unknown Manipur Covid19 Cases-----╕*

*District Name :* Unknown, MN
*Total Cases :* ${con.Manipur.districtData.Unknown.confirmed}
*Active Cases :* ${con.Manipur.districtData.Unknown.active}
*Recovered Cases :* ${con.Manipur.districtData.Unknown.recovered}
*Death Cases :* ${con.Manipur.districtData.Unknown.deceased}

`
)})
}  else if (msg.body == `-covid imphaleast`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Imphal East Covid19 Cases-----╕*

*District Name :* Imphal East, MN
*Total Cases :* ${con.Manipur.districtData['Imphal East'].confirmed}
*Active Cases :* ${con.Manipur.districtData['Imphal East'].active}
*Recovered Cases :* ${con.Manipur.districtData['Imphal East'].recovered}
*Death Cases :* ${con.Manipur.districtData['Imphal East'].deceased}

`
)})
}  else if (msg.body == `-covid imphalwest`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Imphal West Covid19 Cases-----╕*

*District Name :* Imphal West, MN
*Total Cases :* ${con.Manipur.districtData['Imphal West'].confirmed}
*Active Cases :* ${con.Manipur.districtData['Imphal West'].active}
*Recovered Cases :* ${con.Manipur.districtData['Imphal West'].recovered}
*Death Cases :* ${con.Manipur.districtData['Imphal West'].deceased}

`
)})
}
// Madhya Pradesh
  else if (msg.body == `-covid agarmalwa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Agar Malwa  Covid19 Cases-----╕*

*District Name :* Agar Malwa , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData['Agar Malwa'].confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData['Agar Malwa'].active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData['Agar Malwa'].recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData['Agar Malwa'].deceased}

`
)})
  }else if (msg.body == `-covid alirajpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Alirajpur  Covid19 Cases-----╕*

*District Name :* Alirajpur , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Alirajpur.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Alirajpur.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Alirajpur.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Alirajpur.deceased}

`
)})
  }else if (msg.body == `-covid anuppur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Anuppur  Covid19 Cases-----╕*

*District Name :* Anuppur , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Anuppur.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Anuppur.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Anuppur.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Anuppur.deceased}

`
)})
  }else if (msg.body == `-covid ashoknagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ashoknagar  Covid19 Cases-----╕*

*District Name :* Ashoknagar, MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Ashoknagar.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Ashoknagar.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Ashoknagar.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Ashoknagar.deceased}

`
)})
  }else if (msg.body == `-covid balaghat`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Balaghat  Covid19 Cases-----╕*

*District Name :* Balaghat , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Balaghat.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Balaghat.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Balaghat.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Balaghat.deceased}
`
)})
  }else if (msg.body == `-covid barwani`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Barwani  Covid19 Cases-----╕*

*District Name :* Barwani , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Barwani.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Barwani.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Barwani.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Barwani.deceased}
`
)})
  }else if (msg.body == `-covid betul`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Betul  Covid19 Cases-----╕*

*District Name :* Betul , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Betul.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Betul.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Betul.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Betul.deceased}
`
)})
  }else if (msg.body == `-covid bhind`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bhind  Covid19 Cases-----╕*

*District Name :* Bhind , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Bhind.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Bhind.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Bhind.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Bhind.deceased}
`
)})
  }else if (msg.body == `-covid bhopal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bhopal  Covid19 Cases-----╕*

*District Name :* Bhopal , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Bhopal.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Bhopal.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Bhopal.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Bhopal.deceased}
`
)})
  }else if (msg.body == `-covid burhanpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Balaghat  Covid19 Cases-----╕*

*District Name :* Burhanpur , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Burhanpur.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Burhanpur.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Burhanpur.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Burhanpur.deceased}
`
)})
  }else if (msg.body == `-covid chhatarpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chhatarpur  Covid19 Cases-----╕*

*District Name :* Chhatarpur , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Chhatarpur.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Chhatarpur.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Chhatarpur.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Chhatarpur.deceased}
`
)})
  }else if (msg.body == `-covid chhindwara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chhindwara  Covid19 Cases-----╕*

*District Name :* Chhindwara , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Chhindwara.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Chhindwara.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Chhindwara.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Chhindwara.deceased}
`
)})
  }else if (msg.body == `-covid damoh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Damoh  Covid19 Cases-----╕*

*District Name :* Damoh , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Damoh.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Damoh.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Damoh.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Damoh.deceased}
`
)})
  }else if (msg.body == `-covid datia`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Datia  Covid19 Cases-----╕*

*District Name :* Datia , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Datia.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Datia.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Datia.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Datia.deceased}
`
)})
  }else if (msg.body == `-covid dewas`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dewas  Covid19 Cases-----╕*

*District Name :* Dewas , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Dewas.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Dewas.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Dewas.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Dewas.deceased}
`
)})
  }else if (msg.body == `-covid dhar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dhar  Covid19 Cases-----╕*

*District Name :* Dhar , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Dhar.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Dhar.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Dhar.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Dhar.deceased}
`
)})
  }else if (msg.body == `-covid dindori`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dindori  Covid19 Cases-----╕*

*District Name :* Dindori , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Dindori.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Dindori.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Dindori.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Dindori.deceased}
`
)})
  }else if (msg.body == `-covid guna`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Guna  Covid19 Cases-----╕*

*District Name :* Guna , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Guna.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Guna.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Guna.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Guna.deceased}
`
)})
  }else if (msg.body == `-covid gwalior`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gwalior  Covid19 Cases-----╕*

*District Name :* Gwalior , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Gwalior.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Gwalior.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Gwalior.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Gwalior.deceased}
`
)})
  }else if (msg.body == `-covid harda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Harda  Covid19 Cases-----╕*

*District Name :* Harda , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Harda.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Harda.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Harda.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Harda.deceased}
`
)})
  }else if (msg.body == `-covid hoshangabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hoshangabad  Covid19 Cases-----╕*

*District Name :* Hoshangabad , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Hoshangabad.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Hoshangabad.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Hoshangabad.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Hoshangabad.deceased}
`
)})
  }else if (msg.body == `-covid indore`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Indore  Covid19 Cases-----╕*

*District Name :* Indore , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Indore.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Indore.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Indore.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Indore.deceased}
`
)})
  }else if (msg.body == `-covid jabalpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jabalpur  Covid19 Cases-----╕*

*District Name :* Jabalpur , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Jabalpur.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Jabalpur.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Jabalpur.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Jabalpur.deceased}
`
)})
  }else if (msg.body == `-covid jhabua`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jhabua  Covid19 Cases-----╕*

*District Name :* Jhabua , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Jhabua.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Jhabua.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Jhabua.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Jhabua.deceased}
`
)})
  }else if (msg.body == `-covid katni`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Katni  Covid19 Cases-----╕*

*District Name :* Katni , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Katni.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Katni.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Katni.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Katni.deceased}
`
)})
  }else if (msg.body == `-covid khandwa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Khandwa  Covid19 Cases-----╕*

*District Name :* Khandwa , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Khandwa.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Khandwa.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Khandwa.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Khandwa.deceased}
`
)})
  }else if (msg.body == `-covid khargone`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Khargone  Covid19 Cases-----╕*

*District Name :* Khargone , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Khargone.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Khargone.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Khargone.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Khargone.deceased}
`
)})

  }else if (msg.body == `-covid mandla`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mandla  Covid19 Cases-----╕*

*District Name :* Mandla , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Mandla.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Mandla.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Mandla.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Mandla.deceased}
`
)})
  }else if (msg.body == `-covid mandsaur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mandsaur  Covid19 Cases-----╕*

*District Name :* Mandsaur , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Mandsaur.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Mandsaur.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Mandsaur.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Mandsaur.deceased}
`
)})

  }else if (msg.body == `-covid morena`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Morena  Covid19 Cases-----╕*

*District Name :* Morena , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Morena.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Morena.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Morena.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Morena.deceased}
`
)})
  }else if (msg.body == `-covid narsinghpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Narsinghpur  Covid19 Cases-----╕*

*District Name :* Narsinghpur , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Narsinghpur.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Narsinghpur.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Narsinghpur.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Narsinghpur.deceased}
`
)})

  }else if (msg.body == `-covid neemuch`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Neemuch  Covid19 Cases-----╕*

*District Name :* Neemuch , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Neemuch.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Neemuch.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Neemuch.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Neemuch.deceased}
`
)})
  }else if (msg.body == `-covid niwari`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Niwari  Covid19 Cases-----╕*

*District Name :* Niwari , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Niwari.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Niwari.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Niwari.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Niwari.deceased}
`
)})

  }else if (msg.body == `-covid panna`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Panna  Covid19 Cases-----╕*

*District Name :* Panna , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Panna.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Panna.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Panna.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Panna.deceased}
`
)})
  }else if (msg.body == `-covid raisen`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Raisen  Covid19 Cases-----╕*

*District Name :* Raisen , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Raisen.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Raisen.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Raisen.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Raisen.deceased}
`
)})
  }else if (msg.body == `-covid Rajgarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rajgarh  Covid19 Cases-----╕*

*District Name :* Rajgarh , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Rajgarh.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Rajgarh.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Rajgarh.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Rajgarh.deceased}
`
)})
  }else if (msg.body == `-covid ratlam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ratlam  Covid19 Cases-----╕*

*District Name :* Ratlam , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Ratlam.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Ratlam.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Ratlam.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Ratlam.deceased}
`
)})
  }else if (msg.body == `-covid rewa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rewa  Covid19 Cases-----╕*

*District Name :* Rewa , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Rewa.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Rewa.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Rewa.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Rewa.deceased}
`
)})
  }else if (msg.body == `-covid sagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sagar  Covid19 Cases-----╕*

*District Name :* Sagar , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Sagar.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Sagar.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Sagar.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Sagar.deceased}
`
)})
  }else if (msg.body == `-covid satna`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Satna  Covid19 Cases-----╕*

*District Name :* Satna , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Satna.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Satna.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Satna.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Satna.deceased}
`
)})
  }else if (msg.body == `-covid sehore`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sehore  Covid19 Cases-----╕*

*District Name :* Sehore , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Sehore.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Sehore.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Sehore.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Sehore.deceased}
`
)})
  }else if (msg.body == `-covid seoni`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Seoni  Covid19 Cases-----╕*

*District Name :* Seoni , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Seoni.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Seoni.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Seoni.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Seoni.deceased}
`
)})
  }else if (msg.body == `-covid shahdol`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shahdol  Covid19 Cases-----╕*

*District Name :* Shahdol , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Shahdol.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Shahdol.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Shahdol.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Shahdol.deceased}
`
)})
  }else if (msg.body == `-covid shajapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shajapur  Covid19 Cases-----╕*

*District Name :* Shajapur , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Shajapur.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Shajapur.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Shajapur.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Shajapur.deceased}
`
)})
  }else if (msg.body == `-covid sheopur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sheopur  Covid19 Cases-----╕*

*District Name :* Sheopur , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Sheopur.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Sheopur.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Sheopur.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Sheopur.deceased}
`
)})
  }else if (msg.body == `-covid shivpuri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shivpuri  Covid19 Cases-----╕*

*District Name :* Shivpuri , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Shivpuri.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Shivpuri.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Shivpuri.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Shivpuri.deceased}
`
)})
  }else if (msg.body == `-covid sidhi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sidhi  Covid19 Cases-----╕*

*District Name :* Sidhi , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Sidhi.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Sidhi.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Sidhi.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Sidhi.deceased}
`
)})
  }else if (msg.body == `-covid singrauli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Singrauli  Covid19 Cases-----╕*

*District Name :* Singrauli , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Singrauli.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Singrauli.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Singrauli.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Singrauli.deceased}
`
)})
  }else if (msg.body == `-covid tikamgarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tikamgarh  Covid19 Cases-----╕*

*District Name :* Tikamgarh , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Tikamgarh.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Tikamgarh.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Tikamgarh.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Tikamgarh.deceased}
`
)})
  }else if (msg.body == `-covid ujjain`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ujjain  Covid19 Cases-----╕*

*District Name :* Ujjain , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Ujjain.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Ujjain.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Ujjain.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Ujjain.deceased}
`
)})
  }else if (msg.body == `-covid umaria`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Umaria  Covid19 Cases-----╕*

*District Name :* Umaria , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Umaria.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Umaria.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Umaria.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Umaria.deceased}
`
)})
  }else if (msg.body == `-covid vidisha`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Vidisha  Covid19 Cases-----╕*

*District Name :* Vidisha , MP 
*Total Cases :* ${con['Madhya Pradesh'].districtData.Vidisha.confirmed}
*Active Cases :* ${con['Madhya Pradesh'].districtData.Vidisha.active}
*Recovered Cases :* ${con['Madhya Pradesh'].districtData.Vidisha.recovered}
*Death Cases :* ${con['Madhya Pradesh'].districtData.Vidisha.deceased}
`
)})
// Mizoram
  }else if (msg.body == `-covid aizawl`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----aizawl  Covid19 Cases-----╕*

*District Name :* aizawl , MZ 
*Total Cases :* ${con.Mizoram.districtData.Aizawl.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Aizawl.active}
*Recovered Cases :* ${con.Mizoram.districtData.Aizawl.recovered}
*Death Cases :* ${con.Mizoram.districtData.Aizawl.deceased}
`
)})
  }else if (msg.body == `-covid champhai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Champhai  Covid19 Cases-----╕*

*District Name :* Champhai , MZ 
*Total Cases :* ${con.Mizoram.districtData.Champhai.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Champhai.active}
*Recovered Cases :* ${con.Mizoram.districtData.Champhai.recovered}
*Death Cases :* ${con.Mizoram.districtData.Champhai.deceased}
`
)})
  }else if (msg.body == `-covid hnahthial`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hnahthial  Covid19 Cases-----╕*

*District Name :* Hnahthial , MZ 
*Total Cases :* ${con.Mizoram.districtData.Hnahthial.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Hnahthial.active}
*Recovered Cases :* ${con.Mizoram.districtData.Hnahthial.recovered}
*Death Cases :* ${con.Mizoram.districtData.Hnahthial.deceased}
`
)})
  }else if (msg.body == `-covid khawzawl`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Khawzawl  Covid19 Cases-----╕*

*District Name :* Khawzawl , MZ 
*Total Cases :* ${con.Mizoram.districtData.Khawzawl.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Khawzawl.active}
*Recovered Cases :* ${con.Mizoram.districtData.Khawzawl.recovered}
*Death Cases :* ${con.Mizoram.districtData.Khawzawl.deceased}
`
)})
  }else if (msg.body == `-covid kolasib`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kolasib  Covid19 Cases-----╕*

*District Name :* Kolasib , MZ 
*Total Cases :* ${con.Mizoram.districtData.Kolasib.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Kolasib.active}
*Recovered Cases :* ${con.Mizoram.districtData.Kolasib.recovered}
*Death Cases :* ${con.Mizoram.districtData.Kolasib.deceased}
`
)})
  }else if (msg.body == `-covid lawngtlai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Lawngtlai  Covid19 Cases-----╕*

*District Name :* Lawngtlai , MZ 
*Total Cases :* ${con.Mizoram.districtData.Lawngtlai.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Lawngtlai.active}
*Recovered Cases :* ${con.Mizoram.districtData.Lawngtlai.recovered}
*Death Cases :* ${con.Mizoram.districtData.Lawngtlai.deceased}
`
)})
  }else if (msg.body == `-covid lunglei`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Lunglei  Covid19 Cases-----╕*

*District Name :* Lunglei , MZ 
*Total Cases :* ${con.Mizoram.districtData.Lunglei.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Lunglei.active}
*Recovered Cases :* ${con.Mizoram.districtData.Lunglei.recovered}
*Death Cases :* ${con.Mizoram.districtData.Lunglei.deceased}
`
)})
  }else if (msg.body == `-covid mamit`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mamit  Covid19 Cases-----╕*

*District Name :* Mamit , MZ 
*Total Cases :* ${con.Mizoram.districtData.Mamit.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Mamit.active}
*Recovered Cases :* ${con.Mizoram.districtData.Mamit.recovered}
*Death Cases :* ${con.Mizoram.districtData.Mamit.deceased}
`
)})
  }else if (msg.body == `-covid saiha`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Saiha  Covid19 Cases-----╕*

*District Name :* Saiha , MZ 
*Total Cases :* ${con.Mizoram.districtData.Saiha.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Saiha.active}
*Recovered Cases :* ${con.Mizoram.districtData.Saiha.recovered}
*Death Cases :* ${con.Mizoram.districtData.Saiha.deceased}
`
)})
  }else if (msg.body == `-covid saitual`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Saitual  Covid19 Cases-----╕*

*District Name :* Saitual , MZ 
*Total Cases :* ${con.Mizoram.districtData.Saitual.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Saitual.active}
*Recovered Cases :* ${con.Mizoram.districtData.Saitual.recovered}
*Death Cases :* ${con.Mizoram.districtData.Saitual.deceased}
`
)})
  }else if (msg.body == `-covid serchhip`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Serchhip  Covid19 Cases-----╕*

*District Name :* Serchhip , MZ 
*Total Cases :* ${con.Mizoram.districtData.Serchhip.confirmed}
*Active Cases :* ${con.Mizoram.districtData.Serchhip.active}
*Recovered Cases :* ${con.Mizoram.districtData.Serchhip.recovered}
*Death Cases :* ${con.Mizoram.districtData.Serchhip.deceased}
`
)})
  }else if (msg.body == `-covid dimapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dimapur  Covid19 Cases-----╕*

*District Name :* Dimapur , NL
*Total Cases :* ${con.Nagaland.districtData.Dimapur.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Dimapur.active}
*Recovered Cases :* ${con.Nagaland.districtData.Dimapur.recovered}
*Death Cases :* ${con.Nagaland.districtData.Dimapur.deceased}
`
)})
  }else if (msg.body == `-covid kiphire`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kiphire  Covid19 Cases-----╕*

*District Name :* Kiphire , NL
*Total Cases :* ${con.Nagaland.districtData.Kiphire.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Kiphire.active}
*Recovered Cases :* ${con.Nagaland.districtData.Kiphire.recovered}
*Death Cases :* ${con.Nagaland.districtData.Kiphire.deceased}
`
)})
  }else if (msg.body == `-covid kohima`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kohima  Covid19 Cases-----╕*

*District Name :* Kohima , NL
*Total Cases :* ${con.Nagaland.districtData.Kohima.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Kohima.active}
*Recovered Cases :* ${con.Nagaland.districtData.Kohima.recovered}
*Death Cases :* ${con.Nagaland.districtData.Kohima.deceased}
`
)})
  }else if (msg.body == `-covid longleng`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Longleng  Covid19 Cases-----╕*

*District Name :* Longleng , NL
*Total Cases :* ${con.Nagaland.districtData.Longleng.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Longleng.active}
*Recovered Cases :* ${con.Nagaland.districtData.Longleng.recovered}
*Death Cases :* ${con.Nagaland.districtData.Longleng.deceased}
`
)})
  }else if (msg.body == `-covid mokokchung`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mokokchung  Covid19 Cases-----╕*

*District Name :* Mokokchung , NL
*Total Cases :* ${con.Nagaland.districtData.Mokokchung.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Mokokchung.active}
*Recovered Cases :* ${con.Nagaland.districtData.Mokokchung.recovered}
*Death Cases :* ${con.Nagaland.districtData.Mokokchung.deceased}
`
)})
  }else if (msg.body == `-covid mon`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mon  Covid19 Cases-----╕*

*District Name :* Mon , NL
*Total Cases :* ${con.Nagaland.districtData.Mon.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Mon.active}
*Recovered Cases :* ${con.Nagaland.districtData.Mon.recovered}
*Death Cases :* ${con.Nagaland.districtData.Mon.deceased}
`
)})
  }else if (msg.body == `-covid peren`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Peren  Covid19 Cases-----╕*

*District Name :* Peren , NL
*Total Cases :* ${con.Nagaland.districtData.Peren.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Peren.active}
*Recovered Cases :* ${con.Nagaland.districtData.Peren.recovered}
*Death Cases :* ${con.Nagaland.districtData.Peren.deceased}
`
)})
  }else if (msg.body == `-covid phek`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Phek  Covid19 Cases-----╕*

*District Name :* Phek , NL
*Total Cases :* ${con.Nagaland.districtData.Phek.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Phek.active}
*Recovered Cases :* ${con.Nagaland.districtData.Phek.recovered}
*Death Cases :* ${con.Nagaland.districtData.Phek.deceased}
`
)})
  }else if (msg.body == `-covid tuensang`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tuensang  Covid19 Cases-----╕*

*District Name :* Tuensang , NL
*Total Cases :* ${con.Nagaland.districtData.Tuensang.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Tuensang.active}
*Recovered Cases :* ${con.Nagaland.districtData.Tuensang.recovered}
*Death Cases :* ${con.Nagaland.districtData.Tuensang.deceased}
`
)})
  }else if (msg.body == `-covid wokha`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Wokha  Covid19 Cases-----╕*

*District Name :* Wokha , NL
*Total Cases :* ${con.Nagaland.districtData.Wokha.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Wokha.active}
*Recovered Cases :* ${con.Nagaland.districtData.Wokha.recovered}
*Death Cases :* ${con.Nagaland.districtData.Wokha.deceased}
`
)})
  }else if (msg.body == `-covid zunheboto`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Zunheboto  Covid19 Cases-----╕*

*District Name :* Zunheboto , NL
*Total Cases :* ${con.Nagaland.districtData.Zunheboto.confirmed}
*Active Cases :* ${con.Nagaland.districtData.Zunheboto.active}
*Recovered Cases :* ${con.Nagaland.districtData.Zunheboto.recovered}
*Death Cases :* ${con.Nagaland.districtData.Zunheboto.deceased}
`
)})

// Odisha
  }else if (msg.body == `-covid angul`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Angul  Covid19 Cases-----╕*

*District Name :* Angul , OR
*Total Cases :* ${con.Odisha.districtData.Angul.confirmed}
*Active Cases :* ${con.Odisha.districtData.Angul.active}
*Recovered Cases :* ${con.Odisha.districtData.Angul.recovered}
*Death Cases :* ${con.Odisha.districtData.Angul.deceased}
`
)})
  }else if (msg.body == `-covid balangir`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Balangir  Covid19 Cases-----╕*

*District Name :* Balangir , OR
*Total Cases :* ${con.Odisha.districtData.Balangir.confirmed}
*Active Cases :* ${con.Odisha.districtData.Balangir.active}
*Recovered Cases :* ${con.Odisha.districtData.Balangir.recovered}
*Death Cases :* ${con.Odisha.districtData.Balangir.deceased}
`
)})
  }else if (msg.body == `-covid balasore`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Balasore  Covid19 Cases-----╕*

*District Name :* Balasore , OR
*Total Cases :* ${con.Odisha.districtData.Balasore.confirmed}
*Active Cases :* ${con.Odisha.districtData.Balasore.active}
*Recovered Cases :* ${con.Odisha.districtData.Balasore.recovered}
*Death Cases :* ${con.Odisha.districtData.Balasore.deceased}
`
)})
  }else if (msg.body == `-covid bargarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bargarh  Covid19 Cases-----╕*

*District Name :* Bargarh , OR
*Total Cases :* ${con.Odisha.districtData.Bargarh.confirmed}
*Active Cases :* ${con.Odisha.districtData.Bargarh.active}
*Recovered Cases :* ${con.Odisha.districtData.Bargarh.recovered}
*Death Cases :* ${con.Odisha.districtData.Bargarh.deceased}
`
)})
  }else if (msg.body == `-covid bhadrak`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bhadrak  Covid19 Cases-----╕*

*District Name :* Bhadrak , OR
*Total Cases :* ${con.Odisha.districtData.Bhadrak.confirmed}
*Active Cases :* ${con.Odisha.districtData.Bhadrak.active}
*Recovered Cases :* ${con.Odisha.districtData.Bhadrak.recovered}
*Death Cases :* ${con.Odisha.districtData.Bhadrak.deceased}
`
)})
  }else if (msg.body == `-covid boudh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Boudh  Covid19 Cases-----╕*

*District Name :* Boudh , OR
*Total Cases :* ${con.Odisha.districtData.Boudh.confirmed}
*Active Cases :* ${con.Odisha.districtData.Boudh.active}
*Recovered Cases :* ${con.Odisha.districtData.Boudh.recovered}
*Death Cases :* ${con.Odisha.districtData.Boudh.deceased}
`
)})
  }else if (msg.body == `-covid cuttack`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Cuttack  Covid19 Cases-----╕*

*District Name :* Cuttack , OR
*Total Cases :* ${con.Odisha.districtData.Cuttack.confirmed}
*Active Cases :* ${con.Odisha.districtData.Cuttack.active}
*Recovered Cases :* ${con.Odisha.districtData.Cuttack.recovered}
*Death Cases :* ${con.Odisha.districtData.Cuttack.deceased}
`
)})
  }else if (msg.body == `-covid deogarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Deogarh  Covid19 Cases-----╕*

*District Name :* Deogarh , OR
*Total Cases :* ${con.Odisha.districtData.Deogarh.confirmed}
*Active Cases :* ${con.Odisha.districtData.Deogarh.active}
*Recovered Cases :* ${con.Odisha.districtData.Deogarh.recovered}
*Death Cases :* ${con.Odisha.districtData.Deogarh.deceased}
`
)})
  }else if (msg.body == `-covid dhenkanal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dhenkanal  Covid19 Cases-----╕*

*District Name :* Dhenkanal , OR
*Total Cases :* ${con.Odisha.districtData.Dhenkanal.confirmed}
*Active Cases :* ${con.Odisha.districtData.Dhenkanal.active}
*Recovered Cases :* ${con.Odisha.districtData.Dhenkanal.recovered}
*Death Cases :* ${con.Odisha.districtData.Dhenkanal.deceased}
`
)})
  }else if (msg.body == `-covid gajapati`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gajapati  Covid19 Cases-----╕*

*District Name :* Gajapati , OR
*Total Cases :* ${con.Odisha.districtData.Gajapati.confirmed}
*Active Cases :* ${con.Odisha.districtData.Gajapati.active}
*Recovered Cases :* ${con.Odisha.districtData.Gajapati.recovered}
*Death Cases :* ${con.Odisha.districtData.Gajapati.deceased}
`
)})
  }else if (msg.body == `-covid ganjam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ganjam  Covid19 Cases-----╕*

*District Name :* Ganjam , OR
*Total Cases :* ${con.Odisha.districtData.Ganjam.confirmed}
*Active Cases :* ${con.Odisha.districtData.Ganjam.active}
*Recovered Cases :* ${con.Odisha.districtData.Ganjam.recovered}
*Death Cases :* ${con.Odisha.districtData.Ganjam.deceased}
`
)})
  }else if (msg.body == `-covid jagatsinghpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jagatsinghpur  Covid19 Cases-----╕*

*District Name :* Jagatsinghpur , OR
*Total Cases :* ${con.Odisha.districtData.Jagatsinghpur.confirmed}
*Active Cases :* ${con.Odisha.districtData.Jagatsinghpur.active}
*Recovered Cases :* ${con.Odisha.districtData.Jagatsinghpur.recovered}
*Death Cases :* ${con.Odisha.districtData.Jagatsinghpur.deceased}
`
)})
  }else if (msg.body == `-covid jajpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jajpur  Covid19 Cases-----╕*

*District Name :* Jajpur , OR
*Total Cases :* ${con.Odisha.districtData.Jajpur.confirmed}
*Active Cases :* ${con.Odisha.districtData.Jajpur.active}
*Recovered Cases :* ${con.Odisha.districtData.Jajpur.recovered}
*Death Cases :* ${con.Odisha.districtData.Jajpur.deceased}
`
)})
  }else if (msg.body == `-covid jharsuguda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jharsuguda  Covid19 Cases-----╕*

*District Name :* Jharsuguda , OR
*Total Cases :* ${con.Odisha.districtData.Jharsuguda.confirmed}
*Active Cases :* ${con.Odisha.districtData.Jharsuguda.active}
*Recovered Cases :* ${con.Odisha.districtData.Jharsuguda.recovered}
*Death Cases :* ${con.Odisha.districtData.Jharsuguda.deceased}
`
)})
  }else if (msg.body == `-covid kalahandi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kalahandi  Covid19 Cases-----╕*

*District Name :* Kalahandi , OR
*Total Cases :* ${con.Odisha.districtData.Kalahandi.confirmed}
*Active Cases :* ${con.Odisha.districtData.Kalahandi.active}
*Recovered Cases :* ${con.Odisha.districtData.Kalahandi.recovered}
*Death Cases :* ${con.Odisha.districtData.Kalahandi.deceased}
`
)})
  }else if (msg.body == `-covid kandhamal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kandhamal  Covid19 Cases-----╕*

*District Name :* Kandhamal , OR
*Total Cases :* ${con.Odisha.districtData.Kandhamal.confirmed}
*Active Cases :* ${con.Odisha.districtData.Kandhamal.active}
*Recovered Cases :* ${con.Odisha.districtData.Kandhamal.recovered}
*Death Cases :* ${con.Odisha.districtData.Kandhamal.deceased}
`
)})
  }else if (msg.body == `-covid kendrapara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kendrapara  Covid19 Cases-----╕*

*District Name :* Kendrapara , OR
*Total Cases :* ${con.Odisha.districtData.Kendrapara.confirmed}
*Active Cases :* ${con.Odisha.districtData.Kendrapara.active}
*Recovered Cases :* ${con.Odisha.districtData.Kendrapara.recovered}
*Death Cases :* ${con.Odisha.districtData.Kendrapara.deceased}
`
)})
  }else if (msg.body == `-covid kendujhar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kendujhar  Covid19 Cases-----╕*

*District Name :* Kendujhar , OR
*Total Cases :* ${con.Odisha.districtData.Kendujhar.confirmed}
*Active Cases :* ${con.Odisha.districtData.Kendujhar.active}
*Recovered Cases :* ${con.Odisha.districtData.Kendujhar.recovered}
*Death Cases :* ${con.Odisha.districtData.Kendujhar.deceased}
`
)})
  }else if (msg.body == `-covid khordha`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Khordha  Covid19 Cases-----╕*

*District Name :* Khordha , OR
*Total Cases :* ${con.Odisha.districtData.Khordha.confirmed}
*Active Cases :* ${con.Odisha.districtData.Khordha.active}
*Recovered Cases :* ${con.Odisha.districtData.Khordha.recovered}
*Death Cases :* ${con.Odisha.districtData.Khordha.deceased}
`
)})
  }else if (msg.body == `-covid koraput`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Koraput  Covid19 Cases-----╕*

*District Name :* Koraput , OR
*Total Cases :* ${con.Odisha.districtData.Koraput.confirmed}
*Active Cases :* ${con.Odisha.districtData.Koraput.active}
*Recovered Cases :* ${con.Odisha.districtData.Koraput.recovered}
*Death Cases :* ${con.Odisha.districtData.Koraput.deceased}
`
)})
  }else if (msg.body == `-covid malkangiri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Malkangiri  Covid19 Cases-----╕*

*District Name :* Malkangiri , OR
*Total Cases :* ${con.Odisha.districtData.Malkangiri.confirmed}
*Active Cases :* ${con.Odisha.districtData.Malkangiri.active}
*Recovered Cases :* ${con.Odisha.districtData.Malkangiri.recovered}
*Death Cases :* ${con.Odisha.districtData.Malkangiri.deceased}
`
)})
  }else if (msg.body == `-covid mayurbhanj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mayurbhanj  Covid19 Cases-----╕*

*District Name :* Mayurbhanj , OR
*Total Cases :* ${con.Odisha.districtData.Mayurbhanj.confirmed}
*Active Cases :* ${con.Odisha.districtData.Mayurbhanj.active}
*Recovered Cases :* ${con.Odisha.districtData.Mayurbhanj.recovered}
*Death Cases :* ${con.Odisha.districtData.Mayurbhanj.deceased}
`
)})
  }else if (msg.body == `-covid nabarangapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nabarangapur  Covid19 Cases-----╕*

*District Name :* Nabarangapur , OR
*Total Cases :* ${con.Odisha.districtData.Nabarangapur.confirmed}
*Active Cases :* ${con.Odisha.districtData.Nabarangapur.active}
*Recovered Cases :* ${con.Odisha.districtData.Nabarangapur.recovered}
*Death Cases :* ${con.Odisha.districtData.Nabarangapur.deceased}
`
)})
  }else if (msg.body == `-covid nayagarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nayagarh  Covid19 Cases-----╕*

*District Name :* Nayagarh , OR
*Total Cases :* ${con.Odisha.districtData.Nayagarh.confirmed}
*Active Cases :* ${con.Odisha.districtData.Nayagarh.active}
*Recovered Cases :* ${con.Odisha.districtData.Nayagarh.recovered}
*Death Cases :* ${con.Odisha.districtData.Nayagarh.deceased}
`
)})
  }else if (msg.body == `-covid nuapada`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nuapada  Covid19 Cases-----╕*

*District Name :* Nuapada , OR
*Total Cases :* ${con.Odisha.districtData.Nuapada.confirmed}
*Active Cases :* ${con.Odisha.districtData.Nuapada.active}
*Recovered Cases :* ${con.Odisha.districtData.Nuapada.recovered}
*Death Cases :* ${con.Odisha.districtData.Nuapada.deceased}
`
)})
  }else if (msg.body == `-covid puri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Puri  Covid19 Cases-----╕*

*District Name :* Puri , OR
*Total Cases :* ${con.Odisha.districtData.Puri.confirmed}
*Active Cases :* ${con.Odisha.districtData.Puri.active}
*Recovered Cases :* ${con.Odisha.districtData.Puri.recovered}
*Death Cases :* ${con.Odisha.districtData.Puri.deceased}
`
)})
  }else if (msg.body == `-covid rayagada`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rayagada  Covid19 Cases-----╕*

*District Name :* Rayagada , OR
*Total Cases :* ${con.Odisha.districtData.Rayagada.confirmed}
*Active Cases :* ${con.Odisha.districtData.Rayagada.active}
*Recovered Cases :* ${con.Odisha.districtData.Rayagada.recovered}
*Death Cases :* ${con.Odisha.districtData.Rayagada.deceased}
`
)})
  }else if (msg.body == `-covid sambalpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sambalpur  Covid19 Cases-----╕*

*District Name :* Sambalpur , OR
*Total Cases :* ${con.Odisha.districtData.Sambalpur.confirmed}
*Active Cases :* ${con.Odisha.districtData.Sambalpur.active}
*Recovered Cases :* ${con.Odisha.districtData.Sambalpur.recovered}
*Death Cases :* ${con.Odisha.districtData.Sambalpur.deceased}
`
)})
  }else if (msg.body == `-covid subarnapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Subarnapur  Covid19 Cases-----╕*

*District Name :* Subarnapur , OR
*Total Cases :* ${con.Odisha.districtData.Subarnapur.confirmed}
*Active Cases :* ${con.Odisha.districtData.Subarnapur.active}
*Recovered Cases :* ${con.Odisha.districtData.Subarnapur.recovered}
*Death Cases :* ${con.Odisha.districtData.Subarnapur.deceased}
`
)})
  }else if (msg.body == `-covid sundargarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sundargarh  Covid19 Cases-----╕*

*District Name :* Sundargarh , OR
*Total Cases :* ${con.Odisha.districtData.Sundargarh.confirmed}
*Active Cases :* ${con.Odisha.districtData.Sundargarh.active}
*Recovered Cases :* ${con.Odisha.districtData.Sundargarh.recovered}
*Death Cases :* ${con.Odisha.districtData.Sundargarh.deceased}
`
)})

// Punjab
}else if (msg.body == `-covid amritsar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Amritsar  Covid19 Cases-----╕*

*District Name :* Amritsar , PB
*Total Cases :* ${con.Punjab.districtData.Amritsar.confirmed}
*Active Cases :* ${con.Punjab.districtData.Amritsar.active}
*Recovered Cases :* ${con.Punjab.districtData.Amritsar.recovered}
*Death Cases :* ${con.Punjab.districtData.Amritsar.deceased}
`
)})
}else if (msg.body == `-covid barnala`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Barnala  Covid19 Cases-----╕*

*District Name :* Barnala , PB
*Total Cases :* ${con.Punjab.districtData.Barnala.confirmed}
*Active Cases :* ${con.Punjab.districtData.Barnala.active}
*Recovered Cases :* ${con.Punjab.districtData.Barnala.recovered}
*Death Cases :* ${con.Punjab.districtData.Barnala.deceased}
`
)})
}else if (msg.body == `-covid bathinda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bathinda  Covid19 Cases-----╕*

*District Name :* Bathinda , PB
*Total Cases :* ${con.Punjab.districtData.Bathinda.confirmed}
*Active Cases :* ${con.Punjab.districtData.Bathinda.active}
*Recovered Cases :* ${con.Punjab.districtData.Bathinda.recovered}
*Death Cases :* ${con.Punjab.districtData.Bathinda.deceased}
`
)})
}else if (msg.body == `-covid faridkot`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Faridkot  Covid19 Cases-----╕*

*District Name :* Faridkot , PB
*Total Cases :* ${con.Punjab.districtData.Faridkot.confirmed}
*Active Cases :* ${con.Punjab.districtData.Faridkot.active}
*Recovered Cases :* ${con.Punjab.districtData.Faridkot.recovered}
*Death Cases :* ${con.Punjab.districtData.Faridkot.deceased}
`
)})
}else if (msg.body == `-covid fatehgarhsahib`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Fatehgarh Sahib  Covid19 Cases-----╕*

*District Name :* Fatehgarh Sahib , PB
*Total Cases :* ${con.Punjab.districtData['Fatehgarh Sahib'].confirmed}
*Active Cases :* ${con.Punjab.districtData['Fatehgarh Sahib'].active}
*Recovered Cases :* ${con.Punjab.districtData['Fatehgarh Sahib'].recovered}
*Death Cases :* ${con.Punjab.districtData['Fatehgarh Sahib'].deceased}
`
)})
}else if (msg.body == `-covid fazilka`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ferozepur  Covid19 Cases-----╕*

*District Name :* Ferozepur , PB
*Total Cases :* ${con.Punjab.districtData.Ferozepur.confirmed}
*Active Cases :* ${con.Punjab.districtData.Ferozepur.active}
*Recovered Cases :* ${con.Punjab.districtData.Ferozepur.recovered}
*Death Cases :* ${con.Punjab.districtData.Ferozepur.deceased}
`
)})
}else if (msg.body == `-covid gurdaspur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gurdaspur  Covid19 Cases-----╕*

*District Name :* Gurdaspur , PB
*Total Cases :* ${con.Punjab.districtData.Gurdaspur.confirmed}
*Active Cases :* ${con.Punjab.districtData.Gurdaspur.active}
*Recovered Cases :* ${con.Punjab.districtData.Gurdaspur.recovered}
*Death Cases :* ${con.Punjab.districtData.Gurdaspur.deceased}
`
)})
}else if (msg.body == `-covid hoshiarpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hoshiarpur  Covid19 Cases-----╕*

*District Name :* Hoshiarpur , PB
*Total Cases :* ${con.Punjab.districtData.Hoshiarpur.confirmed}
*Active Cases :* ${con.Punjab.districtData.Hoshiarpur.active}
*Recovered Cases :* ${con.Punjab.districtData.Hoshiarpur.recovered}
*Death Cases :* ${con.Punjab.districtData.Hoshiarpur.deceased}
`
)})
}else if (msg.body == `-covid jalandhar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jalandhar  Covid19 Cases-----╕*

*District Name :* Jalandhar , PB
*Total Cases :* ${con.Punjab.districtData.Jalandhar.confirmed}
*Active Cases :* ${con.Punjab.districtData.Jalandhar.active}
*Recovered Cases :* ${con.Punjab.districtData.Jalandhar.recovered}
*Death Cases :* ${con.Punjab.districtData.Jalandhar.deceased}
`
)})
}else if (msg.body == `-covid kapurthala`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kapurthala  Covid19 Cases-----╕*

*District Name :* Kapurthala , PB
*Total Cases :* ${con.Punjab.districtData.Kapurthala.confirmed}
*Active Cases :* ${con.Punjab.districtData.Kapurthala.active}
*Recovered Cases :* ${con.Punjab.districtData.Kapurthala.recovered}
*Death Cases :* ${con.Punjab.districtData.Kapurthala.deceased}
`
)})
}else if (msg.body == `-covid ludhiana`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ludhiana  Covid19 Cases-----╕*

*District Name :* Ludhiana , PB
*Total Cases :* ${con.Punjab.districtData.Ludhiana.confirmed}
*Active Cases :* ${con.Punjab.districtData.Ludhiana.active}
*Recovered Cases :* ${con.Punjab.districtData.Ludhiana.recovered}
*Death Cases :* ${con.Punjab.districtData.Ludhiana.deceased}
`
)})
}else if (msg.body == `-covid mansa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mansa  Covid19 Cases-----╕*

*District Name :* Mansa , PB
*Total Cases :* ${con.Punjab.districtData.Mansa.confirmed}
*Active Cases :* ${con.Punjab.districtData.Mansa.active}
*Recovered Cases :* ${con.Punjab.districtData.Mansa.recovered}
*Death Cases :* ${con.Punjab.districtData.Mansa.deceased}
`
)})
}else if (msg.body == `-covid moga`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Moga  Covid19 Cases-----╕*

*District Name :* Moga , PB
*Total Cases :* ${con.Punjab.districtData.Moga.confirmed}
*Active Cases :* ${con.Punjab.districtData.Moga.active}
*Recovered Cases :* ${con.Punjab.districtData.Moga.recovered}
*Death Cases :* ${con.Punjab.districtData.Moga.deceased}
`
)})
}else if (msg.body == `-covid pathankot`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pathankot  Covid19 Cases-----╕*

*District Name :* Pathankot , PB
*Total Cases :* ${con.Punjab.districtData.Pathankot.confirmed}
*Active Cases :* ${con.Punjab.districtData.Pathankot.active}
*Recovered Cases :* ${con.Punjab.districtData.Pathankot.recovered}
*Death Cases :* ${con.Punjab.districtData.Pathankot.deceased}
`
)})
}else if (msg.body == `-covid sasnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----S.A.S. Nagar  Covid19 Cases-----╕*

*District Name :* S.A.S. Nagar , PB
*Total Cases :* ${con.Punjab.districtData['S.A.S. Nagar'].confirmed}
*Active Cases :* ${con.Punjab.districtData['S.A.S. Nagar'].active}
*Recovered Cases :* ${con.Punjab.districtData['S.A.S. Nagar'].recovered}
*Death Cases :* ${con.Punjab.districtData['S.A.S. Nagar'].deceased}
`
)})
}else if (msg.body == `-covid patiala`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Patiala  Covid19 Cases-----╕*

*District Name :* Patiala , PB
*Total Cases :* ${con.Punjab.districtData.Patiala.confirmed}
*Active Cases :* ${con.Punjab.districtData.Patiala.active}
*Recovered Cases :* ${con.Punjab.districtData.Patiala.recovered}
*Death Cases :* ${con.Punjab.districtData.Patiala.deceased}
`
)})
}else if (msg.body == `-covid rupnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rupnagar  Covid19 Cases-----╕*

*District Name :* Rupnagar , PB
*Total Cases :* ${con.Punjab.districtData.Rupnagar.confirmed}
*Active Cases :* ${con.Punjab.districtData.Rupnagar.active}
*Recovered Cases :* ${con.Punjab.districtData.Rupnagar.recovered}
*Death Cases :* ${con.Punjab.districtData.Rupnagar.deceased}
`
)})
}else if (msg.body == `-covid sangrur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sangrur  Covid19 Cases-----╕*

*District Name :* Sangrur , PB
*Total Cases :* ${con.Punjab.districtData.Sangrur.confirmed}
*Active Cases :* ${con.Punjab.districtData.Sangrur.active}
*Recovered Cases :* ${con.Punjab.districtData.Sangrur.recovered}
*Death Cases :* ${con.Punjab.districtData.Sangrur.deceased}
`
)})
}else if (msg.body == `-covid shahidbhagatsinghnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shahid Bhagat Singh Nagar  Covid19 Cases-----╕*

*District Name :* Shahid Bhagat Singh Nagar , PB
*Total Cases :* ${con.Punjab.districtData['Shahid Bhagat Singh Nagar'].confirmed}
*Active Cases :* ${con.Punjab.districtData['Shahid Bhagat Singh Nagar'].active}
*Recovered Cases :* ${con.Punjab.districtData['Shahid Bhagat Singh Nagar'].recovered}
*Death Cases :* ${con.Punjab.districtData['Shahid Bhagat Singh Nagar'].deceased}
`
)})
}else if (msg.body == `-covid srimuktsarsahib`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sri Muktsar Sahib  Covid19 Cases-----╕*

*District Name :* Sri Muktsar Sahib , PB
*Total Cases :* ${con.Punjab.districtData['Sri Muktsar Sahib'].confirmed}
*Active Cases :* ${con.Punjab.districtData['Sri Muktsar Sahib'].active}
*Recovered Cases :* ${con.Punjab.districtData['Sri Muktsar Sahib'].recovered}
*Death Cases :* ${con.Punjab.districtData['Sri Muktsar Sahib'].deceased}
`
)})
}else if (msg.body == `-covid tarntaran`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tarn Taran  Covid19 Cases-----╕*

*District Name :* Tarn Taran , PB
*Total Cases :* ${con.Punjab.districtData['Tarn Taran'].confirmed}
*Active Cases :* ${con.Punjab.districtData['Tarn Taran'].active}
*Recovered Cases :* ${con.Punjab.districtData['Tarn Taran'].recovered}
*Death Cases :* ${con.Punjab.districtData['Tarn Taran'].deceased}
`
)})

// Puducherry
}else if (msg.body == `-covid karaikal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Karaikal Covid19 Cases-----╕*

*District Name :* Karaikal , PY
*Total Cases :* ${con.Puducherry.districtData.Karaikal.confirmed}
*Active Cases :* ${con.Puducherry.districtData.Karaikal.active}
*Recovered Cases :* ${con.Puducherry.districtData.Karaikal.recovered}
*Death Cases :* ${con.Puducherry.districtData.Karaikal.deceased}
`
)})
}else if (msg.body == `-covid mahe`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mahe  Covid19 Cases-----╕*

*District Name :* Mahe , PY
*Total Cases :* ${con.Puducherry.districtData.Mahe.confirmed}
*Active Cases :* ${con.Puducherry.districtData.Mahe.active}
*Recovered Cases :* ${con.Puducherry.districtData.Mahe.recovered}
*Death Cases :* ${con.Puducherry.districtData.Mahe.deceased}
`
)})
}else if (msg.body == `-covid puducherry`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Puducherry  Covid19 Cases-----╕*

*District Name :* Puducherry , PY
*Total Cases :* ${con.Puducherry.districtData.Puducherry.confirmed}
*Active Cases :* ${con.Puducherry.districtData.Puducherry.active}
*Recovered Cases :* ${con.Puducherry.districtData.Puducherry.recovered}
*Death Cases :* ${con.Puducherry.districtData.Puducherry.deceased}
`
)})
}else if (msg.body == `-covid yanam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Yanam  Covid19 Cases-----╕*

*District Name :* Yanam , PY
*Total Cases :* ${con.Puducherry.districtData.Yanam.confirmed}
*Active Cases :* ${con.Puducherry.districtData.Yanam.active}
*Recovered Cases :* ${con.Puducherry.districtData.Yanam.recovered}
*Death Cases :* ${con.Puducherry.districtData.Yanam.deceased}
`
)})
// Rajasthan
}else if (msg.body == `-covid ajmer`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ajmer  Covid19 Cases-----╕*

*District Name :* Ajmer , RJ
*Total Cases :* ${con.Rajasthan.districtData.Ajmer.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Ajmer.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Ajmer.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Ajmer.deceased}
`
)})
}else if (msg.body == `-covid alwar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Alwar  Covid19 Cases-----╕*

*District Name :* Alwar , RJ
*Total Cases :* ${con.Rajasthan.districtData.Alwar.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Alwar.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Alwar.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Alwar.deceased}
`
)})
}else if (msg.body == `-covid banswara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Banswara  Covid19 Cases-----╕*

*District Name :* Banswara , RJ
*Total Cases :* ${con.Rajasthan.districtData.Banswara.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Banswara.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Banswara.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Banswara.deceased}
`
)})
}else if (msg.body == `-covid baran`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Baran  Covid19 Cases-----╕*

*District Name :* Baran , RJ
*Total Cases :* ${con.Rajasthan.districtData.Baran.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Baran.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Baran.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Baran.deceased}
`
)})
}else if (msg.body == `-covid barmer`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Barmer  Covid19 Cases-----╕*

*District Name :* Barmer , RJ
*Total Cases :* ${con.Rajasthan.districtData.Barmer.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Barmer.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Barmer.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Barmer.deceased}
`
)})
}else if (msg.body == `-covid bharatpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bharatpur  Covid19 Cases-----╕*

*District Name :* Bharatpur , RJ
*Total Cases :* ${con.Rajasthan.districtData.Bharatpur.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Bharatpur.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Bharatpur.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Bharatpur.deceased}
`
)})
}else if (msg.body == `-covid bhilwara`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bhilwara  Covid19 Cases-----╕*

*District Name :* Bhilwara , RJ
*Total Cases :* ${con.Rajasthan.districtData.Bhilwara.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Bhilwara.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Bhilwara.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Bhilwara.deceased}
`
)})
}else if (msg.body == `-covid bikaner`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bikaner  Covid19 Cases-----╕*

*District Name :* Bikaner , RJ
*Total Cases :* ${con.Rajasthan.districtData.Bikaner.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Bikaner.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Bikaner.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Bikaner.deceased}
`
)})
}else if (msg.body == `-covid bsfcamp`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----BSF Camp  Covid19 Cases-----╕*

*District Name :* BSF Camp , RJ
*Total Cases :* ${con.Rajasthan.districtData['BSF Camp'].confirmed}
*Active Cases :* ${con.Rajasthan.districtData['BSF Camp'].active}
*Recovered Cases :* ${con.Rajasthan.districtData['BSF Camp'].recovered}
*Death Cases :* ${con.Rajasthan.districtData['BSF Camp'].deceased}
`
)})
}else if (msg.body == `-covid bundi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bundi  Covid19 Cases-----╕*

*District Name :* Bundi , RJ
*Total Cases :* ${con.Rajasthan.districtData.Bundi.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Bundi.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Bundi.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Bundi.deceased}
`
)})
}else if (msg.body == `-covid chittorgarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chittorgarh  Covid19 Cases-----╕*

*District Name :* Chittorgarh , RJ
*Total Cases :* ${con.Rajasthan.districtData.Chittorgarh.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Chittorgarh.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Chittorgarh.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Chittorgarh.deceased}
`
)})
}else if (msg.body == `-covid churu`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Churu  Covid19 Cases-----╕*

*District Name :* Churu , RJ
*Total Cases :* ${con.Rajasthan.districtData.Churu.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Churu.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Churu.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Churu.deceased}
`
)})
}else if (msg.body == `-covid dausa`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dausa  Covid19 Cases-----╕*

*District Name :* Dausa , RJ
*Total Cases :* ${con.Rajasthan.districtData.Dausa.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Dausa.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Dausa.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Dausa.deceased}
`
)})
}else if (msg.body == `-covid dholpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dholpur  Covid19 Cases-----╕*

*District Name :* Dholpur , RJ
*Total Cases :* ${con.Rajasthan.districtData.Dholpur.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Dholpur.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Dholpur.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Dholpur.deceased}
`
)})
}else if (msg.body == `-covid dungarpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dungarpur  Covid19 Cases-----╕*

*District Name :* Dungarpur , RJ
*Total Cases :* ${con.Rajasthan.districtData.Dungarpur.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Dungarpur.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Dungarpur.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Dungarpur.deceased}
`
)})
}else if (msg.body == `-covid evacuees`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Evacuees  Covid19 Cases-----╕*

*District Name :* Evacuees , RJ
*Total Cases :* ${con.Rajasthan.districtData.Evacuees.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Evacuees.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Evacuees.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Evacuees.deceased}
`
)})
}else if (msg.body == `-covid ganganagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ganganagar  Covid19 Cases-----╕*

*District Name :* Ganganagar , RJ
*Total Cases :* ${con.Rajasthan.districtData.Ganganagar.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Ganganagar.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Ganganagar.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Ganganagar.deceased}
`
)})
}else if (msg.body == `-covid hanumangarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hanumangarh  Covid19 Cases-----╕*

*District Name :* Hanumangarh , RJ
*Total Cases :* ${con.Rajasthan.districtData.Hanumangarh.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Hanumangarh.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Hanumangarh.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Hanumangarh.deceased}
`
)})
}else if (msg.body == `-covid italians`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Italians  Covid19 Cases-----╕*

*District Name :* Italians , RJ
*Total Cases :* ${con.Rajasthan.districtData.Italians.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Italians.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Italians.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Italians.deceased}
`
)})
}else if (msg.body == `-covid jaipur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jaipur  Covid19 Cases-----╕*

*District Name :* Jaipur , RJ
*Total Cases :* ${con.Rajasthan.districtData.Jaipur.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Jaipur.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Jaipur.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Jaipur.deceased}
`
)})
}else if (msg.body == `-covid jaisalmer`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jaisalmer  Covid19 Cases-----╕*

*District Name :* Jaisalmer , RJ
*Total Cases :* ${con.Rajasthan.districtData.Jaisalmer.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Jaisalmer.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Jaisalmer.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Jaisalmer.deceased}
`
)})
}else if (msg.body == `-covid jalore`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jalore  Covid19 Cases-----╕*

*District Name :* Jalore , RJ
*Total Cases :* ${con.Rajasthan.districtData.Jalore.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Jalore.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Jalore.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Jalore.deceased}
`
)})
}else if (msg.body == `-covid jhalawar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jhalawar  Covid19 Cases-----╕*

*District Name :* Jhalawar , RJ
*Total Cases :* ${con.Rajasthan.districtData.Jhalawar.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Jhalawar.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Jhalawar.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Jhalawar.deceased}
`
)})
}else if (msg.body == `-covid jhunjhunu`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jhunjhunu  Covid19 Cases-----╕*

*District Name :* Jhunjhunu , RJ
*Total Cases :* ${con.Rajasthan.districtData.Jhunjhunu.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Jhunjhunu.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Jhunjhunu.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Jhunjhunu.deceased}
`
)})
}else if (msg.body == `-covid jodhpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jodhpur  Covid19 Cases-----╕*

*District Name :* Jodhpur , RJ
*Total Cases :* ${con.Rajasthan.districtData.Jodhpur.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Jodhpur.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Jodhpur.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Jodhpur.deceased}
`
)})
}else if (msg.body == `-covid karauli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Karauli  Covid19 Cases-----╕*

*District Name :* Karauli , RJ
*Total Cases :* ${con.Rajasthan.districtData.Karauli.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Karauli.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Karauli.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Karauli.deceased}
`
)})
}else if (msg.body == `-covid kota`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kota  Covid19 Cases-----╕*

*District Name :* Kota , RJ
*Total Cases :* ${con.Rajasthan.districtData.Kota.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Kota.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Kota.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Kota.deceased}
`
)})
}else if (msg.body == `-covid nagaur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nagaur  Covid19 Cases-----╕*

*District Name :* Nagaur , RJ
*Total Cases :* ${con.Rajasthan.districtData.Nagaur.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Nagaur.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Nagaur.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Nagaur.deceased}
`
)})
}else if (msg.body == `-covid pali`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pali  Covid19 Cases-----╕*

*District Name :* Pali , RJ
*Total Cases :* ${con.Rajasthan.districtData.Pali.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Pali.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Pali.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Pali.deceased}
`
)})
}else if (msg.body == `-covid pratapgarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pratapgarh  Covid19 Cases-----╕*

*District Name :* Pratapgarh , RJ
*Total Cases :* ${con.Rajasthan.districtData.Pratapgarh.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Pratapgarh.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Pratapgarh.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Pratapgarh.deceased}
`
)})
}else if (msg.body == `-covid rajsamand`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rajsamand  Covid19 Cases-----╕*

*District Name :* Rajsamand , RJ
*Total Cases :* ${con.Rajasthan.districtData.Rajsamand.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Rajsamand.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Rajsamand.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Rajsamand.deceased}
`
)})
}else if (msg.body == `-covid sawaimadhopur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sawai Madhopur  Covid19 Cases-----╕*

*District Name :* Sawai Madhopur , RJ
*Total Cases :* ${con.Rajasthan.districtData['Sawai Madhopur'].confirmed}
*Active Cases :* ${con.Rajasthan.districtData['Sawai Madhopur'].active}
*Recovered Cases :* ${con.Rajasthan.districtData['Sawai Madhopur'].recovered}
*Death Cases :* ${con.Rajasthan.districtData['Sawai Madhopur'].deceased}
`
)})
}else if (msg.body == `-covid sikar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sikar  Covid19 Cases-----╕*

*District Name :* Sikar , RJ
*Total Cases :* ${con.Rajasthan.districtData.Sikar.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Sikar.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Sikar.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Sikar.deceased}
`
)})
}else if (msg.body == `-covid sirohi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sirohi  Covid19 Cases-----╕*

*District Name :* Sirohi , RJ
*Total Cases :* ${con.Rajasthan.districtData.Sirohi.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Sirohi.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Sirohi.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Sirohi.deceased}
`
)})
}else if (msg.body == `-covid tonk`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tonk  Covid19 Cases-----╕*

*District Name :* Tonk , RJ
*Total Cases :* ${con.Rajasthan.districtData.Tonk.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Tonk.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Tonk.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Tonk.deceased}
`
)})
}else if (msg.body == `-covid udaipur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Udaipur  Covid19 Cases-----╕*

*District Name :* Udaipur , RJ
*Total Cases :* ${con.Rajasthan.districtData.Udaipur.confirmed}
*Active Cases :* ${con.Rajasthan.districtData.Udaipur.active}
*Recovered Cases :* ${con.Rajasthan.districtData.Udaipur.recovered}
*Death Cases :* ${con.Rajasthan.districtData.Udaipur.deceased}
`
)})
// Sikkim
}else if (msg.body == `-covid eastsikkim`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----East Sikkim  Covid19 Cases-----╕*

*District Name :* East Sikkim , SK
*Total Cases :* ${con.Sikkim.districtData['East Sikkim'].confirmed}
*Active Cases :* ${con.Sikkim.districtData['East Sikkim'].active}
*Recovered Cases :* ${con.Sikkim.districtData['East Sikkim'].recovered}
*Death Cases :* ${con.Sikkim.districtData['East Sikkim'].deceased}
`
)})
}else if (msg.body == `-covid northsikkim`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North Sikkim  Covid19 Cases-----╕*

*District Name :* North Sikkim , SK
*Total Cases :* ${con.Rajasthan.districtData['North Sikkim'].confirmed}
*Active Cases :* ${con.Rajasthan.districtData['North Sikkim'].active}
*Recovered Cases :* ${con.Rajasthan.districtData['North Sikkim'].recovered}
*Death Cases :* ${con.Rajasthan.districtData['North Sikkim'].deceased}
`
)})
}else if (msg.body == `-covid southsikkim`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South Sikkim  Covid19 Cases-----╕*

*District Name :* South Sikkim , SK
*Total Cases :* ${con.Rajasthan.districtData['South Sikkim'].confirmed}
*Active Cases :* ${con.Rajasthan.districtData['South Sikkim'].active}
*Recovered Cases :* ${con.Rajasthan.districtData['South Sikkim'].recovered}
*Death Cases :* ${con.Rajasthan.districtData['South Sikkim'].deceased}
`
)})
}else if (msg.body == `-covid westsikkim`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----West Sikkim  Covid19 Cases-----╕*

*District Name :* West Sikkim , SK
*Total Cases :* ${con.Rajasthan.districtData['West Sikkim'].confirmed}
*Active Cases :* ${con.Rajasthan.districtData['West Sikkim'].active}
*Recovered Cases :* ${con.Rajasthan.districtData['West Sikkim'].recovered}
*Death Cases :* ${con.Rajasthan.districtData['West Sikkim'].deceased}
`
)})
// Telangana

}else if (msg.body == `-covid adilabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Adilabad  Covid19 Cases-----╕*

*District Name :* Adilabad , TS
*Total Cases :* ${con.Telangana.districtData.Adilabad.confirmed}
*Active Cases :* ${con.Telangana.districtData.Adilabad.active}
*Recovered Cases :* ${con.Telangana.districtData.Adilabad.recovered}
*Death Cases :* ${con.Telangana.districtData.Adilabad.deceased}
`
)})
}else if (msg.body == `-covid bhadradrikothagudem`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hyderabad Covid19 Cases-----╕*

*District Name :* Hyderabad , TS
*Total Cases :* ${con.Telangana.districtData['Bhadradri Kothagudem'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Bhadradri Kothagudem'].active}
*Recovered Cases :* ${con.Telangana.districtData['Bhadradri Kothagudem'].recovered}
*Death Cases :* ${con.Telangana.districtData['Bhadradri Kothagudem'].deceased}
`
)})
}else if (msg.body == `-covid hyderabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hyderabad  Covid19 Cases-----╕*

*District Name :* Hyderabad , TS
*Total Cases :* ${con.Telangana.districtData.Hyderabad.confirmed}
*Active Cases :* ${con.Telangana.districtData.Hyderabad.active}
*Recovered Cases :* ${con.Telangana.districtData.Hyderabad.recovered}
*Death Cases :* ${con.Telangana.districtData.Hyderabad.deceased}
`
)})
}else if (msg.body == `-covid jagtial`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jagtial Covid19 Cases-----╕*

*District Name :* Jagtial , TS
*Total Cases :* ${con.Telangana.districtData.Jagtial.confirmed}
*Active Cases :* ${con.Telangana.districtData.Jagtial.active}
*Recovered Cases :* ${con.Telangana.districtData.Jagtial.recovered}
*Death Cases :* ${con.Telangana.districtData.Jagtial.deceased}
`
)})
}else if (msg.body == `-covid Jangaon`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jangaon Covid19 Cases-----╕*

*District Name :* Jangaon , TS
*Total Cases :* ${con.Telangana.districtData.Jangaon.confirmed}
*Active Cases :* ${con.Telangana.districtData.Jangaon.active}
*Recovered Cases :* ${con.Telangana.districtData.Jangaon.recovered}
*Death Cases :* ${con.Telangana.districtData.Jangaon.deceased}
`
)})
}else if (msg.body == `-covid jayashankarbhupalapally`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jayashankar Bhupalapally Covid19 Cases-----╕*

*District Name :* Jayashankar Bhupalapally , TS
*Total Cases :* ${con.Telangana.districtData['Jayashankar Bhupalapally'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Jayashankar Bhupalapally'].active}
*Recovered Cases :* ${con.Telangana.districtData['Jayashankar Bhupalapally'].recovered}
*Death Cases :* ${con.Telangana.districtData['Jayashankar Bhupalapally'].deceased}
`
)})
}else if (msg.body == `-covid jogulambagadwal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jogulamba Gadwal Covid19 Cases-----╕*

*District Name :* Jogulamba Gadwal , TS
*Total Cases :* ${con.Telangana.districtData['Jogulamba Gadwal'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Jogulamba Gadwal'].active}
*Recovered Cases :* ${con.Telangana.districtData['Jogulamba Gadwal'].recovered}
*Death Cases :* ${con.Telangana.districtData['Jogulamba Gadwal'].deceased}
`
)})
}else if (msg.body == `-covid kamareddy`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kamareddy Covid19 Cases-----╕*

*District Name :* Kamareddy, TS
*Total Cases :* ${con.Telangana.districtData.Kamareddy.confirmed}
*Active Cases :* ${con.Telangana.districtData.Kamareddy.active}
*Recovered Cases :* ${con.Telangana.districtData.Kamareddy.recovered}
*Death Cases :* ${con.Telangana.districtData.Kamareddy.deceased}
`
)})

}else if (msg.body == `-covid karimnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Karimnagar Covid19 Cases-----╕*

*District Name :* Karimnagar, TS
*Total Cases :* ${con.Telangana.districtData.Karimnagar.confirmed}
*Active Cases :* ${con.Telangana.districtData.Karimnagar.active}
*Recovered Cases :* ${con.Telangana.districtData.Karimnagar.recovered}
*Death Cases :* ${con.Telangana.districtData.Karimnagar.deceased}
`
)})
}else if (msg.body == `-covid khammam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Khammam Covid19 Cases-----╕*

*District Name :* Khammam, TS
*Total Cases :* ${con.Telangana.districtData.Khammam.confirmed}
*Active Cases :* ${con.Telangana.districtData.Khammam.active}
*Recovered Cases :* ${con.Telangana.districtData.Khammam.recovered}
*Death Cases :* ${con.Telangana.districtData.Khammam.deceased}
`
)})
}else if (msg.body == `-covid komarambheem`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Komaram Bheem Covid19 Cases-----╕*

*District Name :* Komaram Bheem, TS
*Total Cases :* ${con.Telangana.districtData['Komaram Bheem'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Komaram Bheem'].active}
*Recovered Cases :* ${con.Telangana.districtData['Komaram Bheem'].recovered}
*Death Cases :* ${con.Telangana.districtData['Komaram Bheem'].deceased}
`
)})
}else if (msg.body == `-covid mahabubabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mahabubabad Covid19 Cases-----╕*

*District Name :* Mahabubabad, TS
*Total Cases :* ${con.Telangana.districtData.Mahabubabad.confirmed}
*Active Cases :* ${con.Telangana.districtData.Mahabubabad.active}
*Recovered Cases :* ${con.Telangana.districtData.Mahabubabad.recovered}
*Death Cases :* ${con.Telangana.districtData.Mahabubabad.deceased}
`
)})
}else if (msg.body == `-covid mahabubnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mahabubnagar Covid19 Cases-----╕*

*District Name :* Mahabubnagar, TS
*Total Cases :* ${con.Telangana.districtData.Mahabubnagar.confirmed}
*Active Cases :* ${con.Telangana.districtData.Mahabubnagar.active}
*Recovered Cases :* ${con.Telangana.districtData.Mahabubnagar.recovered}
*Death Cases :* ${con.Telangana.districtData.Mahabubnagar.deceased}
`
)})

}else if (msg.body == `-covid mancherial`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mancherial Covid19 Cases-----╕*

*District Name :* Mancherial, TS
*Total Cases :* ${con.Telangana.districtData.Mancherial.confirmed}
*Active Cases :* ${con.Telangana.districtData.Mancherial.active}
*Recovered Cases :* ${con.Telangana.districtData.Mancherial.recovered}
*Death Cases :* ${con.Telangana.districtData.Mancherial.deceased}
`
)})
}else if (msg.body == `-covid medak`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Medak Covid19 Cases-----╕*

*District Name :* Medak, TS
*Total Cases :* ${con.Telangana.districtData.Medak.confirmed}
*Active Cases :* ${con.Telangana.districtData.Medak.active}
*Recovered Cases :* ${con.Telangana.districtData.Medak.recovered}
*Death Cases :* ${con.Telangana.districtData.Medak.deceased}
`
)})
}else if (msg.body == `-covid medchalmalkajgiri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Medchal Malkajgiri Covid19 Cases-----╕*

*District Name :* Medchal Malkajgiri, TS
*Total Cases :* ${con.Telangana.districtData['Medchal Malkajgiri'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Medchal Malkajgiri'].active}
*Recovered Cases :* ${con.Telangana.districtData['Medchal Malkajgiri'].recovered}
*Death Cases :* ${con.Telangana.districtData['Medchal Malkajgiri'].deceased}
`
)})

}else if (msg.body == `-covid Mulugu`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mulugu Covid19 Cases-----╕*

*District Name :* Mulugu, TS
*Total Cases :* ${con.Telangana.districtData.Mulugu.confirmed}
*Active Cases :* ${con.Telangana.districtData.Mulugu.active}
*Recovered Cases :* ${con.Telangana.districtData.Mulugu.recovered}
*Death Cases :* ${con.Telangana.districtData.Mulugu.deceased}
`
)})

}else if (msg.body == `-covid nagarkurnool`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nagarkurnool Covid19 Cases-----╕*

*District Name :* Nagarkurnool, TS
*Total Cases :* ${con.Telangana.districtData.Nagarkurnool.confirmed}
*Active Cases :* ${con.Telangana.districtData.Nagarkurnool.active}
*Recovered Cases :* ${con.Telangana.districtData.Nagarkurnool.recovered}
*Death Cases :* ${con.Telangana.districtData.Nagarkurnool.deceased}
`
)})
}else if (msg.body == `-covid nalgonda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nalgonda Covid19 Cases-----╕*

*District Name :* Nalgonda, TS
*Total Cases :* ${con.Telangana.districtData.Nalgonda.confirmed}
*Active Cases :* ${con.Telangana.districtData.Nalgonda.active}
*Recovered Cases :* ${con.Telangana.districtData.Nalgonda.recovered}
*Death Cases :* ${con.Telangana.districtData.Nalgonda.deceased}
`
)})
}else if (msg.body == `-covid narayanpet`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Narayanpet Covid19 Cases-----╕*

*District Name :* Narayanpet, TS
*Total Cases :* ${con.Telangana.districtData.Narayanpet.confirmed}
*Active Cases :* ${con.Telangana.districtData.Narayanpet.active}
*Recovered Cases :* ${con.Telangana.districtData.Narayanpet.recovered}
*Death Cases :* ${con.Telangana.districtData.Narayanpet.deceased}
`
)})

}else if (msg.body == `-covid nirmal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nirmal Covid19 Cases-----╕*

*District Name :* Nirmal, TS
*Total Cases :* ${con.Telangana.districtData.Nirmal.confirmed}
*Active Cases :* ${con.Telangana.districtData.Nirmal.active}
*Recovered Cases :* ${con.Telangana.districtData.Nirmal.recovered}
*Death Cases :* ${con.Telangana.districtData.Nirmal.deceased}
`
)})
}else if (msg.body == `-covid nizamabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nizamabad Covid19 Cases-----╕*

*District Name :* Nizamabad, TS
*Total Cases :* ${con.Telangana.districtData.Nizamabad.confirmed}
*Active Cases :* ${con.Telangana.districtData.Nizamabad.active}
*Recovered Cases :* ${con.Telangana.districtData.Nizamabad.recovered}
*Death Cases :* ${con.Telangana.districtData.Nizamabad.deceased}
`
)})

}else if (msg.body == `-covid peddapalli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Peddapalli Covid19 Cases-----╕*

*District Name :* Peddapalli, TS
*Total Cases :* ${con.Telangana.districtData.Peddapalli.confirmed}
*Active Cases :* ${con.Telangana.districtData.Peddapalli.active}
*Recovered Cases :* ${con.Telangana.districtData.Peddapalli.recovered}
*Death Cases :* ${con.Telangana.districtData.Peddapalli.deceased}
`
)})
}else if (msg.body == `-covid rajannasircilla`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rajanna Sircilla Covid19 Cases-----╕*

*District Name :* Rajanna Sircilla, TS
*Total Cases :* ${con.Telangana.districtData['Rajanna Sircilla'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Rajanna Sircilla'].active}
*Recovered Cases :* ${con.Telangana.districtData['Rajanna Sircilla'].recovered}
*Death Cases :* ${con.Telangana.districtData['Rajanna Sircilla'].deceased}
`
)})


}else if (msg.body == `-covid rangareddy`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ranga Reddy Covid19 Cases-----╕*

*District Name :* Ranga Reddy, TS
*Total Cases :* ${con.Telangana.districtData['Ranga Reddy'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Ranga Reddy'].active}
*Recovered Cases :* ${con.Telangana.districtData['Ranga Reddy'].recovered}
*Death Cases :* ${con.Telangana.districtData['Ranga Reddy'].deceased}
`
)})


}else if (msg.body == `-covid sangareddy`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sangareddy Covid19 Cases-----╕*

*District Name :* Sangareddy, TS
*Total Cases :* ${con.Telangana.districtData.Sangareddy.confirmed}
*Active Cases :* ${con.Telangana.districtData.Sangareddy.active}
*Recovered Cases :* ${con.Telangana.districtData.Sangareddy.recovered}
*Death Cases :* ${con.Telangana.districtData.Sangareddy.deceased}
`
)})


}else if (msg.body == `-covid siddipet`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Siddipet Covid19 Cases-----╕*

*District Name :* Siddipet, TS
*Total Cases :* ${con.Telangana.districtData.Siddipet.confirmed}
*Active Cases :* ${con.Telangana.districtData.Siddipet.active}
*Recovered Cases :* ${con.Telangana.districtData.Siddipet.recovered}
*Death Cases :* ${con.Telangana.districtData.Siddipet.deceased}
`
)})

}else if (msg.body == `-covid suryapet`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Suryapet Covid19 Cases-----╕*

*District Name :* Suryapet, TS
*Total Cases :* ${con.Telangana.districtData.Suryapet.confirmed}
*Active Cases :* ${con.Telangana.districtData.Suryapet.active}
*Recovered Cases :* ${con.Telangana.districtData.Suryapet.recovered}
*Death Cases :* ${con.Telangana.districtData.Suryapet.deceased}
`
)})
}else if (msg.body == `-covid vikarabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Vikarabad Covid19 Cases-----╕*

*District Name :* Vikarabad, TS
*Total Cases :* ${con.Telangana.districtData.Vikarabad.confirmed}
*Active Cases :* ${con.Telangana.districtData.Vikarabad.active}
*Recovered Cases :* ${con.Telangana.districtData.Vikarabad.recovered}
*Death Cases :* ${con.Telangana.districtData.Vikarabad.deceased}
`
)})
}else if (msg.body == `-covid wanaparthy`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Wanaparthy Covid19 Cases-----╕*

*District Name :* Wanaparthy, TS
*Total Cases :* ${con.Telangana.districtData.Wanaparthy.confirmed}
*Active Cases :* ${con.Telangana.districtData.Wanaparthy.active}
*Recovered Cases :* ${con.Telangana.districtData.Wanaparthy.recovered}
*Death Cases :* ${con.Telangana.districtData.Wanaparthy.deceased}
`
)})
}else if (msg.body == `-covid warangalrural`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Warangal Rural Covid19 Cases-----╕*

*District Name :* Warangal Rural, TS
*Total Cases :* ${con.Telangana.districtData['Warangal Rural'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Warangal Rural'].active}
*Recovered Cases :* ${con.Telangana.districtData['Warangal Rural'].recovered}
*Death Cases :* ${con.Telangana.districtData['Warangal Rural'].deceased}
`
)})
}else if (msg.body == `-covid warangalurban`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Warangal Urban Covid19 Cases-----╕*

*District Name :* Warangal Urban, TS
*Total Cases :* ${con.Telangana.districtData['Warangal Urban'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Warangal Urban'].active}
*Recovered Cases :* ${con.Telangana.districtData['Warangal Urban'].recovered}
*Death Cases :* ${con.Telangana.districtData['Warangal Urban'].deceased}
`
)})
}else if (msg.body == `-covid yadadribhuvanagiri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Yadadri Bhuvanagiri Covid19 Cases-----╕*

*District Name :* Yadadri Bhuvanagiri, TS
*Total Cases :* ${con.Telangana.districtData['Yadadri Bhuvanagiri'].confirmed}
*Active Cases :* ${con.Telangana.districtData['Yadadri Bhuvanagiri'].active}
*Recovered Cases :* ${con.Telangana.districtData['Yadadri Bhuvanagiri'].recovered}
*Death Cases :* ${con.Telangana.districtData['Yadadri Bhuvanagiri'].deceased}
`
)})
// Tamil Nadu
}else if (msg.body == `-covid ariyalur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ariyalur Covid19 Cases-----╕*

*District Name :* Ariyalur, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Ariyalur.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Ariyalur.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Ariyalur.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Ariyalur.deceased}
`
)})
}else if (msg.body == `-covid chengalpattu`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chengalpattu Covid19 Cases-----╕*

*District Name :* Chengalpattu, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Chengalpattu.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Chengalpattu.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Chengalpattu.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Chengalpattu.deceased}
`
)})
}else if (msg.body == `-covid chennai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chennai Covid19 Cases-----╕*

*District Name :* Chennai, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Chennai.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Chennai.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Chennai.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Chennai.deceased}
`
)})
}else if (msg.body == `-covid coimbatore`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Coimbatore Covid19 Cases-----╕*

*District Name :* Coimbatore, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Coimbatore.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Coimbatore.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Coimbatore.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Coimbatore.deceased}
`
)})
}else if (msg.body == `-covid cuddalore`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Cuddalore Covid19 Cases-----╕*

*District Name :* Cuddalore, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Cuddalore.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Cuddalore.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Cuddalore.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Cuddalore.deceased}
`
)})
}else if (msg.body == `-covid dharmapuri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dharmapuri Covid19 Cases-----╕*

*District Name :* Dharmapuri, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Dharmapuri.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Dharmapuri.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Dharmapuri.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Dharmapuri.deceased}
`
)})
}else if (msg.body == `-covid dindigul`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dindigul Covid19 Cases-----╕*

*District Name :* Dindigul, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Dindigul.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Dindigul.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Dindigul.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Dindigul.deceased}
`
)})
}else if (msg.body == `-covid erode`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Erode Covid19 Cases-----╕*

*District Name :* Erode, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Erode.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Erode.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Erode.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Erode.deceased}
`
)})
}else if (msg.body == `-covid kallakurichi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kallakurichi Covid19 Cases-----╕*

*District Name :* Kallakurichi, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Kallakurichi.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Kallakurichi.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Kallakurichi.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Kallakurichi.deceased}
`
)})
}else if (msg.body == `-covid kancheepuram`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kancheepuram Covid19 Cases-----╕*

*District Name :* Kancheepuram, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Kancheepuram.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Kancheepuram.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Kancheepuram.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Kancheepuram.deceased}
`
)})
}else if (msg.body == `-covid kanyakumari`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kanyakumari Covid19 Cases-----╕*

*District Name :* Kanyakumari, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Kanyakumari.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Kanyakumari.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Kanyakumari.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Kanyakumari.deceased}
`
)})
}else if (msg.body == `-covid karur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Karur Covid19 Cases-----╕*

*District Name :* Karur, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Karur.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Karur.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Karur.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Karur.deceased}
`
)})
}else if (msg.body == `-covid krishnagiri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Krishnagiri Covid19 Cases-----╕*

*District Name :* Krishnagiri, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Krishnagiri.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Krishnagiri.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Krishnagiri.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Krishnagiri.deceased}
`
)})
}else if (msg.body == `-covid madurai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Madurai Covid19 Cases-----╕*

*District Name :* Madurai, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Madurai.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Madurai.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Madurai.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Madurai.deceased}
`
)})
}else if (msg.body == `-covid nagapattinam`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nagapattinam Covid19 Cases-----╕*

*District Name :* Nagapattinam, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Nagapattinam.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Nagapattinam.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Nagapattinam.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Nagapattinam.deceased}
`
)})
}else if (msg.body == `-covid namakkal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Namakkal Covid19 Cases-----╕*

*District Name :* Namakkal, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Namakkal.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Namakkal.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Namakkal.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Namakkal.deceased}
`
)})
}else if (msg.body == `-covid nilgiris`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nilgiris Covid19 Cases-----╕*

*District Name :* Nilgiris, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Nilgiris.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Nilgiris.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Nilgiris.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Nilgiris.deceased}
`
)})
}else if (msg.body == `-covid perambalur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Perambalur Covid19 Cases-----╕*

*District Name :* Perambalur, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Perambalur.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Perambalur.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Perambalur.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Perambalur.deceased}
`
)})
}else if (msg.body == `-covid pudukkottai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pudukkottai Covid19 Cases-----╕*

*District Name :* Pudukkottai, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Pudukkottai.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Pudukkottai.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Pudukkottai.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Pudukkottai.deceased}
`
)})
}else if (msg.body == `-covid ramanathapuram`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ramanathapuram Covid19 Cases-----╕*

*District Name :* Ramanathapuram, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Ramanathapuram.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Ramanathapuram.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Ramanathapuram.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Ramanathapuram.deceased}
`
)})
}else if (msg.body == `-covid ranipet`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ranipet Covid19 Cases-----╕*

*District Name :* Ranipet, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Ranipet.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Ranipet.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Ranipet.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Ranipet.deceased}
`
)})
}else if (msg.body == `-covid salem`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Salem Covid19 Cases-----╕*

*District Name :* Salem, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Salem.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Salem.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Salem.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Salem.deceased}
`
)})
}else if (msg.body == `-covid sivaganga`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sivaganga Covid19 Cases-----╕*

*District Name :* Sivaganga, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Sivaganga.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Sivaganga.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Sivaganga.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Sivaganga.deceased}
`
)})
}else if (msg.body == `-covid tenkasi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tenkasi Covid19 Cases-----╕*

*District Name :* Tenkasi, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Tenkasi.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Tenkasi.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Tenkasi.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Tenkasi.deceased}
`
)})
}else if (msg.body == `-covid thanjavur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Thanjavur Covid19 Cases-----╕*

*District Name :* Thanjavur, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Thanjavur.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Thanjavur.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Thanjavur.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Thanjavur.deceased}
`
)})
}else if (msg.body == `-covid theni`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Theni Covid19 Cases-----╕*

*District Name :* Theni, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Theni.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Theni.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Theni.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Theni.deceased}
`
)})
}else if (msg.body == `-covid thiruvallur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Thiruvallur Covid19 Cases-----╕*

*District Name :* Thiruvallur, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Thiruvallur.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Thiruvallur.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Thiruvallur.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Thiruvallur.deceased}
`
)})
}else if (msg.body == `-covid thiruvarur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Thiruvarur Covid19 Cases-----╕*

*District Name :* Thiruvarur, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Thiruvarur.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Thiruvarur.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Thiruvarur.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Thiruvarur.deceased}
`
)})
}else if (msg.body == `-covid thoothukkudi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Thoothukkudi Covid19 Cases-----╕*

*District Name :* Thoothukkudi, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Thoothukkudi.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Thoothukkudi.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Thoothukkudi.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Thoothukkudi.deceased}
`
)})
}else if (msg.body == `-covid tiruchirappalli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tiruchirappalli Covid19 Cases-----╕*

*District Name :* Tiruchirappalli, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Tiruchirappalli.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Tiruchirappalli.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Tiruchirappalli.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Tiruchirappalli.deceased}
`
)})
}else if (msg.body == `-covid tirunelveli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tirunelveli Covid19 Cases-----╕*

*District Name :* Tirunelveli, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Tirunelveli.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Tirunelveli.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Tirunelveli.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Tirunelveli.deceased}
`
)})
}else if (msg.body == `-covid tirupathur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tirupathur Covid19 Cases-----╕*

*District Name :* Tirupathur, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Tirupathur.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Tirupathur.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Tirupathur.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Tirupathur.deceased}
`
)})
}else if (msg.body == `-covid tiruppur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tiruppur Covid19 Cases-----╕*

*District Name :* Tiruppur, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Tiruppur.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Tiruppur.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Tiruppur.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Tiruppur.deceased}
`
)})
}else if (msg.body == `-covid tiruvannamalai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tiruvannamalai Covid19 Cases-----╕*

*District Name :* Tiruvannamalai, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Tiruvannamalai.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Tiruvannamalai.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Tiruvannamalai.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Tiruvannamalai.deceased}
`
)})
}else if (msg.body == `-covid vellore`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Vellore Covid19 Cases-----╕*

*District Name :* Vellore, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Vellore.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Vellore.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Vellore.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Vellore.deceased}
`
)})
}else if (msg.body == `-covid viluppuram`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Viluppuram Covid19 Cases-----╕*

*District Name :* Viluppuram, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Viluppuram.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Viluppuram.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Viluppuram.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Viluppuram.deceased}
`
)})
}else if (msg.body == `-covid virudhunagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Virudhunagar Covid19 Cases-----╕*

*District Name :* Virudhunagar, TN
*Total Cases :* ${con['Tamil Nadu'].districtData.Virudhunagar.confirmed}
*Active Cases :* ${con['Tamil Nadu'].districtData.Virudhunagar.active}
*Recovered Cases :* ${con['Tamil Nadu'].districtData.Virudhunagar.recovered}
*Death Cases :* ${con['Tamil Nadu'].districtData.Virudhunagar.deceased}
`
)})
// Tripura

}else if (msg.body == `-covid dhalai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dhalai Covid19 Cases-----╕*

*District Name :* Dhalai, TR
*Total Cases :* ${con.Tripura.districtData.Dhalai.confirmed}
*Active Cases :* ${con.Tripura.districtData.Dhalai.active}
*Recovered Cases :* ${con.Tripura.districtData.Dhalai.recovered}
*Death Cases :* ${con.Tripura.districtData.Dhalai.deceased}
`
)})
}else if (msg.body == `-covid gomati`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gomati Covid19 Cases-----╕*

*District Name :* Gomati, TR
*Total Cases :* ${con.Tripura.districtData.Gomati.confirmed}
*Active Cases :* ${con.Tripura.districtData.Gomati.active}
*Recovered Cases :* ${con.Tripura.districtData.Gomati.recovered}
*Death Cases :* ${con.Tripura.districtData.Gomati.deceased}
`
)})
}else if (msg.body == `-covid khowai`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Khowai Covid19 Cases-----╕*

*District Name :* Khowai, TR
*Total Cases :* ${con.Tripura.districtData.Khowai.confirmed}
*Active Cases :* ${con.Tripura.districtData.Khowai.active}
*Recovered Cases :* ${con.Tripura.districtData.Khowai.recovered}
*Death Cases :* ${con.Tripura.districtData.Khowai.deceased}
`
)})
}else if (msg.body == `-covid northtripura`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North Tripura Covid19 Cases-----╕*

*District Name :* North Tripura, TR
*Total Cases :* ${con.Tripura.districtData['North Tripura'].confirmed}
*Active Cases :* ${con.Tripura.districtData['North Tripura'].active}
*Recovered Cases :* ${con.Tripura.districtData['North Tripura'].recovered}
*Death Cases :* ${con.Tripura.districtData['North Tripura'].deceased}
`
)})
}else if (msg.body == `-covid sipahijala`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North Tripura Covid19 Cases-----╕*

*District Name :* Sipahijala, TR
*Total Cases :* ${con.Tripura.districtData.Sipahijala.confirmed}
*Active Cases :* ${con.Tripura.districtData.Sipahijala.active}
*Recovered Cases :* ${con.Tripura.districtData.Sipahijala.recovered}
*Death Cases :* ${con.Tripura.districtData.Sipahijala.deceased}
`
)})
}else if (msg.body == `-covid southtripura`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South Tripura Covid19 Cases-----╕*

*District Name :* South Tripura, TR
*Total Cases :* ${con.Tripura.districtData['South Tripura'].confirmed}
*Active Cases :* ${con.Tripura.districtData['South Tripura'].active}
*Recovered Cases :* ${con.Tripura.districtData['South Tripura'].recovered}
*Death Cases :* ${con.Tripura.districtData['South Tripura'].deceased}
`
)})
}else if (msg.body == `-covid unokoti`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Unokoti Covid19 Cases-----╕*

*District Name :* Unokoti, TR
*Total Cases :* ${con.Tripura.districtData.Unokoti.confirmed}
*Active Cases :* ${con.Tripura.districtData.Unokoti.active}
*Recovered Cases :* ${con.Tripura.districtData.Unokoti.recovered}
*Death Cases :* ${con.Tripura.districtData.Unokoti.deceased}
`
)})
}else if (msg.body == `-covid westtripura`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----West Tripura Covid19 Cases-----╕*

*District Name :* West Tripura, TR
*Total Cases :* ${con.Tripura.districtData['West Tripura'].confirmed}
*Active Cases :* ${con.Tripura.districtData['West Tripura'].active}
*Recovered Cases :* ${con.Tripura.districtData['West Tripura'].recovered}
*Death Cases :* ${con.Tripura.districtData['West Tripura'].deceased}
`
)})

// Uttarakhand
}else if (msg.body == `-covid almora`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Almora  Covid19 Cases-----╕*

*District Name :* Almora, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Almora.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Almora.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Almora.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Almora.deceased}
`
)})
}else if (msg.body == `-covid bageshwar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bageshwar  Covid19 Cases-----╕*

*District Name :* Bageshwar, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Bageshwar.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Bageshwar.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Bageshwar.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Bageshwar.deceased}
`
)})
}else if (msg.body == `-covid chamoli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chamoli  Covid19 Cases-----╕*

*District Name :* Chamoli, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Chamoli.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Chamoli.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Chamoli.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Chamoli.deceased}
`
)})
}else if (msg.body == `-covid champawat`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Champawat  Covid19 Cases-----╕*

*District Name :* Champawat, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Champawat.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Champawat.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Champawat.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Champawat.deceased}
`
)})
}else if (msg.body == `-covid dehradun`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dehradun  Covid19 Cases-----╕*

*District Name :* Dehradun, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Dehradun.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Dehradun.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Dehradun.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Dehradun.deceased}
`
)})
}else if (msg.body == `-covid haridwar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Haridwar  Covid19 Cases-----╕*

*District Name :* Haridwar, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Haridwar.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Haridwar.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Haridwar.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Haridwar.deceased}
`
)})
}else if (msg.body == `-covid nainital`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nainital  Covid19 Cases-----╕*

*District Name :* Nainital, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Nainital.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Nainital.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Nainital.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Nainital.deceased}
`
)})

}else if (msg.body == `-covid paurigarhwal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pauri Garhwal  Covid19 Cases-----╕*

*District Name :* Pauri Garhwal, UK 
*Total Cases :* ${con.Uttarakhand.districtData['Pauri Garhwal'].confirmed}
*Active Cases :* ${con.Uttarakhand.districtData['Pauri Garhwal'].active}
*Recovered Cases :* ${con.Uttarakhand.districtData['Pauri Garhwal'].recovered}
*Death Cases :* ${con.Uttarakhand.districtData['Pauri Garhwal'].deceased}
`
)})

}else if (msg.body == `-covid pithoragarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pithoragarh  Covid19 Cases-----╕*

*District Name :* Pithoragarh, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Pithoragarh.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Pithoragarh.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Pithoragarh.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Pithoragarh.deceased}
`
)})
}else if (msg.body == `-covid rudraprayag`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rudraprayag  Covid19 Cases-----╕*

*District Name :* Rudraprayag, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Rudraprayag.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Rudraprayag.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Rudraprayag.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Rudraprayag.deceased}
`
)})
}else if (msg.body == `-covid tehrigarhwal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tehri Garhwal  Covid19 Cases-----╕*

*District Name :* Tehri Garhwal, UK 
*Total Cases :* ${con.Uttarakhand.districtData['Tehri Garhwal'].confirmed}
*Active Cases :* ${con.Uttarakhand.districtData['Tehri Garhwal'].active}
*Recovered Cases :* ${con.Uttarakhand.districtData['Tehri Garhwal'].recovered}
*Death Cases :* ${con.Uttarakhand.districtData['Tehri Garhwal'].deceased}
`
)})

}else if (msg.body == `-covid dhamsinghnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Tehri Garhwal  Covid19 Cases-----╕*

*District Name :* Udham Singh Nagar, UK 
*Total Cases :* ${con.Uttarakhand.districtData['Udham Singh Nagar'].confirmed}
*Active Cases :* ${con.Uttarakhand.districtData['Udham Singh Nagar'].active}
*Recovered Cases :* ${con.Uttarakhand.districtData['Udham Singh Nagar'].recovered}
*Death Cases :* ${con.Uttarakhand.districtData['Udham Singh Nagar'].deceased}
`
)})

}else if (msg.body == `-covid uttarkashi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Uttarkashi  Covid19 Cases-----╕*

*District Name :* Uttarkashi, UK 
*Total Cases :* ${con.Uttarakhand.districtData.Uttarkashi.confirmed}
*Active Cases :* ${con.Uttarakhand.districtData.Uttarkashi.active}
*Recovered Cases :* ${con.Uttarakhand.districtData.Uttarkashi.recovered}
*Death Cases :* ${con.Uttarakhand.districtData.Uttarkashi.deceased}
`
)})
// Uttar Pradesh
}else if (msg.body == `-covid agra`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Agra  Covid19 Cases-----╕*

*District Name :* Agra, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Agra.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Agra.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Agra.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Agra.deceased}
`
)})
}else if (msg.body == `-covid aligarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Aligarh  Covid19 Cases-----╕*

*District Name :* Aligarh, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Aligarh.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Aligarh.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Aligarh.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Aligarh.deceased}
`
)})

}else if (msg.body == `-covid ambedkarnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ambedkar Nagar  Covid19 Cases-----╕*

*District Name :* Ambedkar Nagar, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData['Ambedkar Nagar'].confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData['Ambedkar Nagar'].active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData['Ambedkar Nagar'].recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData['Ambedkar Nagar'].deceased}
`
)})
}else if (msg.body == `-covid amethi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Amethi  Covid19 Cases-----╕*

*District Name :* Amethi, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Amethi.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Amethi.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Amethi.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Amethi.deceased}
`
)})

}else if (msg.body == `-covid amroha`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Amroha  Covid19 Cases-----╕*

*District Name :* Amroha, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Amroha.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Amroha.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Amroha.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Amroha.deceased}
`
)})
}else if (msg.body == `-covid auraiya`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Auraiya  Covid19 Cases-----╕*

*District Name :* Auraiya, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Auraiya.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Auraiya.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Auraiya.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Auraiya.deceased}
`
)})

}else if (msg.body == `-covid ayodhya`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ayodhya  Covid19 Cases-----╕*

*District Name :* Ayodhya, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Ayodhya.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Ayodhya.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Ayodhya.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Ayodhya.deceased}
`
)})
}else if (msg.body == `-covid azamgarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Azamgarh  Covid19 Cases-----╕*

*District Name :* Azamgarh, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Azamgarh.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Azamgarh.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Azamgarh.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Azamgarh.deceased}
`
)})

}else if (msg.body == `-covid baghpat`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Baghpat  Covid19 Cases-----╕*

*District Name :* Baghpat, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Baghpat.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Baghpat.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Baghpat.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Baghpat.deceased}
`
)})
}else if (msg.body == `-covid bahraich`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bahraich  Covid19 Cases-----╕*

*District Name :* Bahraich, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Bahraich.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Bahraich.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Bahraich.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Bahraich.deceased}
`
)})
}else if (msg.body == `-covid ballia`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ballia  Covid19 Cases-----╕*

*District Name :* Ballia, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Ballia.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Ballia.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Ballia.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Ballia.deceased}
`
)})
}else if (msg.body == `-covid balrampur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Balrampur  Covid19 Cases-----╕*

*District Name :* Balrampur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Balrampur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Balrampur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Balrampur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Balrampur.deceased}
`
)})
}else if (msg.body == `-covid banda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Banda  Covid19 Cases-----╕*

*District Name :* Banda, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Banda.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Banda.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Banda.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Banda.deceased}
`
)})
}else if (msg.body == `-covid barabanki`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Barabanki  Covid19 Cases-----╕*

*District Name :* Barabanki, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Barabanki.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Barabanki.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Barabanki.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Barabanki.deceased}
`
)})
}else if (msg.body == `-covid bareilly`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bareilly  Covid19 Cases-----╕*

*District Name :* Bareilly, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Bareilly.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Bareilly.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Bareilly.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Bareilly.deceased}
`
)})
}else if (msg.body == `-covid basti`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Basti  Covid19 Cases-----╕*

*District Name :* Basti, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Basti.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Basti.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Basti.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Basti.deceased}
`
)})
}else if (msg.body == `-covid bhadohi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bhadohi  Covid19 Cases-----╕*

*District Name :* Bhadohi, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Bhadohi.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Bhadohi.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Bhadohi.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Bhadohi.deceased}
`
)})
}else if (msg.body == `-covid bijnor`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bijnor  Covid19 Cases-----╕*

*District Name :* Bijnor, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Bijnor.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Bijnor.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Bijnor.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Bijnor.deceased}
`
)})
}else if (msg.body == `-covid budaun`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Budaun  Covid19 Cases-----╕*

*District Name :* Budaun, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Budaun.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Budaun.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Budaun.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Budaun.deceased}
`
)})
}else if (msg.body == `-covid bulandshahr`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bulandshahr  Covid19 Cases-----╕*

*District Name :* Bulandshahr, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Bulandshahr.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Bulandshahr.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Bulandshahr.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Bulandshahr.deceased}
`
)})
}else if (msg.body == `-covid chandauli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chandauli  Covid19 Cases-----╕*

*District Name :* Chandauli, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Chandauli.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Chandauli.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Chandauli.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Chandauli.deceased}
`
)})
}else if (msg.body == `-covid chitrakoot`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Chitrakoot  Covid19 Cases-----╕*

*District Name :* Chitrakoot, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Chitrakoot.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Chitrakoot.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Chitrakoot.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Chitrakoot.deceased}
`
)})
}else if (msg.body == `-covid deoria`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Deoria  Covid19 Cases-----╕*

*District Name :* Deoria, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Deoria.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Deoria.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Deoria.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Deoria.deceased}
`
)})
}else if (msg.body == `-covid etah`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Etah  Covid19 Cases-----╕*

*District Name :* Etah, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Etah.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Etah.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Etah.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Etah.deceased}
`
)})
}else if (msg.body == `-covid etawah`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Etawah  Covid19 Cases-----╕*

*District Name :* Etawah, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Etawah.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Etawah.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Etawah.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Etawah.deceased}
`
)})
}else if (msg.body == `-covid farrukhabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Farrukhabad  Covid19 Cases-----╕*

*District Name :* Farrukhabad, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Farrukhabad.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Farrukhabad.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Farrukhabad.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Farrukhabad.deceased}
`
)})
}else if (msg.body == `-covid fatehpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Fatehpur  Covid19 Cases-----╕*

*District Name :* Fatehpur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Fatehpur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Fatehpur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Fatehpur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Fatehpur.deceased}
`
)})
}else if (msg.body == `-covid gautambuddhanagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gautam Buddha Nagar  Covid19 Cases-----╕*

*District Name :* Gautam Buddha Nagar, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData['Gautam Buddha Nagar'].confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData['Gautam Buddha Nagar'].active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData['Gautam Buddha Nagar'].recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData['Gautam Buddha Nagar'].deceased}
`
)})
}else if (msg.body == `-covid ghaziabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ghaziabad  Covid19 Cases-----╕*

*District Name :* Ghaziabad, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Ghaziabad.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Ghaziabad.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Ghaziabad.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Ghaziabad.deceased}
`
)})
}else if (msg.body == `-covid ghazipur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Ghazipur  Covid19 Cases-----╕*

*District Name :* Ghazipur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Ghazipur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Ghazipur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Ghazipur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Ghazipur.deceased}
`
)})
}else if (msg.body == `-covid gonda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gonda  Covid19 Cases-----╕*

*District Name :* Gonda, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Gonda.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Gonda.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Gonda.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Gonda.deceased}
`
)})
}else if (msg.body == `-covid gorakhpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Gorakhpur  Covid19 Cases-----╕*

*District Name :* Gorakhpur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Gorakhpur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Gorakhpur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Gorakhpur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Gorakhpur.deceased}
`
)})
}else if (msg.body == `-covid hamirpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hamirpur  Covid19 Cases-----╕*

*District Name :* Hamirpur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Hamirpur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Hamirpur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Hamirpur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Hamirpur.deceased}
`
)})
}else if (msg.body == `-covid hapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hapur  Covid19 Cases-----╕*

*District Name :* Hapur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Hapur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Hapur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Hapur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Hapur.deceased}
`
)})
}else if (msg.body == `-covid hardoi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hardoi  Covid19 Cases-----╕*

*District Name :* Hardoi, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Hardoi.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Hardoi.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Hardoi.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Hardoi.deceased}
`
)})
}else if (msg.body == `-covid hathras`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Hathras  Covid19 Cases-----╕*

*District Name :* Hathras, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Hathras.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Hathras.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Hathras.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Hathras.deceased}
`
)})
}else if (msg.body == `-covid jalaun`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jalaun  Covid19 Cases-----╕*

*District Name :* Jalaun, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Jalaun.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Jalaun.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Jalaun.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Jalaun.deceased}
`
)})
}else if (msg.body == `-covid jaunpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jaunpur  Covid19 Cases-----╕*

*District Name :* Jaunpur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Jaunpur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Jaunpur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Jaunpur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Jaunpur.deceased}
`
)})
}else if (msg.body == `-covid jhansi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jhansi  Covid19 Cases-----╕*

*District Name :* Jhansi, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Jhansi.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Jhansi.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Jhansi.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Jhansi.deceased}
`
)})
}else if (msg.body == `-covid kannauj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kannauj  Covid19 Cases-----╕*

*District Name :* Kannauj, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Kannauj.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Kannauj.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Kannauj.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Kannauj.deceased}
`
)})
}else if (msg.body == `-covid kanpurdehat`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kanpur Dehat  Covid19 Cases-----╕*

*District Name :* Kanpur Dehat, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData['Kanpur Dehat'].confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData['Kanpur Dehat'].active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData['Kanpur Dehat'].recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData['Kanpur Dehat'].deceased}
`
)})
}else if (msg.body == `-covid kanpurnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kanpur Nagar  Covid19 Cases-----╕*

*District Name :* Kanpur Nagar, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData['Kanpur Nagar'].confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData['Kanpur Nagar'].active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData['Kanpur Nagar'].recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData['Kanpur Nagar'].deceased}
`
)})
}
else if (msg.body == `-covid kasganj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kasganj  Covid19 Cases-----╕*

*District Name :* Kasganj, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Kasganj.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Kasganj.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Kasganj.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Kasganj.deceased}
`
)})
}
else if (msg.body == `-covid kasganj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kasganj  Covid19 Cases-----╕*

*District Name :* Kasganj, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Kasganj.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Kasganj.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Kasganj.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Kasganj.deceased}
`
)})
}
else if (msg.body == `-covid kaushambi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kaushambi  Covid19 Cases-----╕*

*District Name :* Kaushambi, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Kaushambi.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Kaushambi.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Kaushambi.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Kaushambi.deceased}
`
)})
}
else if (msg.body == `-covid Kushinagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kushinagar  Covid19 Cases-----╕*

*District Name :* Kushinagar, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Kushinagar.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Kushinagar.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Kushinagar.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Kushinagar.deceased}
`
)})
}
else if (msg.body == `-covid lakhimpurkheri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Lakhimpur Kheri  Covid19 Cases-----╕*

*District Name :* Lakhimpur Kheri, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData['Lakhimpur Kheri'].confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData['Lakhimpur Kher'].active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData['Lakhimpur Khr'].recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData['Lakhimpur Kher'].deceased}
`)})
}
else if (msg.body == `-covid lalitpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Lalitpur  Covid19 Cases-----╕*

*District Name :* Lalitpur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Lalitpur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Lalitpur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Lalitpur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Lalitpur.deceased}
`)})
}
else if (msg.body == `-covid lucknow`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Lucknow  Covid19 Cases-----╕*

*District Name :* Lucknow, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Lucknow.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Lucknow.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Lucknow.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Lucknow.deceased}
`)})
}
else if (msg.body == `-covid maharajganj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Lucknow  Covid19 Cases-----╕*

*District Name :* Maharajganj, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Maharajganj.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Maharajganj.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Maharajganj.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Maharajganj.deceased}
`)})
}
else if (msg.body == `-covid mahoba`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mahoba Covid19 Cases-----╕*

*District Name :* Mahoba, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Mahoba.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Mahoba.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Mahoba.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Mahoba.deceased}
`)})
}
else if (msg.body == `-covid mainpuri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mainpuri Covid19 Cases-----╕*

*District Name :* Mainpuri, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Mainpuri.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Mainpuri.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Mainpuri.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Mainpuri.deceased}
`)})
}
else if (msg.body == `-covid mathura`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mathura Covid19 Cases-----╕*

*District Name :* Mathura, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Mathura.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Mathura.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Mathura.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Mathura.deceased}
`)})
}
else if (msg.body == `-covid mau`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mau Covid19 Cases-----╕*

*District Name :* Mau, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Mau.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Mau.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Mau.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Mau.deceased}
`)})
}
else if (msg.body == `-covid meerut`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Meerut Covid19 Cases-----╕*

*District Name :* Meerut, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Meerut.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Meerut.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Meerut.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Meerut.deceased}
`)})
}
else if (msg.body == `-covid mirzapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Mirzapur Covid19 Cases-----╕*

*District Name :* Mirzapur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Mirzapur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Mirzapur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Mirzapur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Mirzapur.deceased}
`)})
}
else if (msg.body == `-covid moradabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Moradabad Covid19 Cases-----╕*

*District Name :* Moradabad, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Moradabad.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Moradabad.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Moradabad.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Moradabad.deceased}
`)})

}
else if (msg.body == `-covid muzaffarnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Muzaffarnagar Covid19 Cases-----╕*

*District Name :* Muzaffarnagar, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Muzaffarnagar.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Muzaffarnagar.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Muzaffarnagar.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Muzaffarnagar.deceased}
`)})
}
else if (msg.body == `-covid pilibhit`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pilibhit Covid19 Cases-----╕*

*District Name :* Pilibhit, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Pilibhit.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Pilibhit.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Pilibhit.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Pilibhit.deceased}
`)})
}
else if (msg.body == `-covid Pratapgarh`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Pratapgarh Covid19 Cases-----╕*

*District Name :* Pratapgarh, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Pratapgarh.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Pratapgarh.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Pratapgarh.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Pratapgarh.deceased}
`)})
}
else if (msg.body == `-covid prayagraj`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Prayagraj Covid19 Cases-----╕*

*District Name :* Prayagraj, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Prayagraj.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Prayagraj.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Prayagraj.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Prayagraj.deceased}
`)})
}
else if (msg.body == `-covid raebareli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rae Bareli Covid19 Cases-----╕*

*District Name :* Rae Bareli, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData['Rae Bareli'].confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData['Rae Bareli'].active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData['Rae Bareli'].recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData['Rae Bareli'].deceased}
`)})



}
else if (msg.body == `-covid rampur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Rampur Covid19 Cases-----╕*

*District Name :* Rampur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Rampur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Rampur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Rampur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Rampur.deceased}
`)})
}
else if (msg.body == `-covid saharanpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Saharanpur Covid19 Cases-----╕*

*District Name :* Saharanpur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Saharanpur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Saharanpur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Saharanpur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Saharanpur.deceased}
`)})

}
else if (msg.body == `-covid sambhal`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sambhal Covid19 Cases-----╕*

*District Name :* Sambhal, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Sambhal.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Sambhal.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Sambhal.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Sambhal.deceased}
`)})


  }else if (msg.body == `-covid santkabirnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sant Kabir Nagar Covid19 Cases-----╕*

*District Name :* Sant Kabir Nagar, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData['Sant Kabir Nagar'].confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData['Sant Kabir Nagar'].active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData['Sant Kabir Nagar'].recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData['Sant Kabir Nagar'].deceased}
`)})

  }else if (msg.body == `-covid shahjahanpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shahjahanpur Covid19 Cases-----╕*

*District Name :* Shahjahanpur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Shahjahanpur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Shahjahanpur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Shahjahanpur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Shahjahanpur.deceased}
`)})

  }else if (msg.body == `-covid shamli`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shamli Covid19 Cases-----╕*

*District Name :* Shamli, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Shamli.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Shamli.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Shamli.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Shamli.deceased}
`)})

  }else if (msg.body == `-covid shrawasti`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Shrawasti Covid19 Cases-----╕*

*District Name :* Shrawasti, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Shrawasti.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Shrawasti.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Shrawasti.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Shrawasti.deceased}
`)})



  }else if (msg.body == `-covid siddharthnagar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Siddharthnagar Covid19 Cases-----╕*

*District Name :* Siddharthnagar, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Siddharthnagar.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Siddharthnagar.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Siddharthnagar.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Siddharthnagar.deceased}
`)})
  }else if (msg.body == `-covid sitapur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sitapur Covid19 Cases-----╕*

*District Name :* Sitapur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Sitapur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Sitapur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Sitapur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Sitapur.deceased}
`)})
  }else if (msg.body == `-covid sonbhadra`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sonbhadra Covid19 Cases-----╕*

*District Name :* Sonbhadra, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Sonbhadra.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Sonbhadra.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Sonbhadra.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Sonbhadra.deceased}
`)})
  }else if (msg.body == `-covid sultanpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Sultanpur Covid19 Cases-----╕*

*District Name :* Sultanpur, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Sultanpur.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Sultanpur.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Sultanpur.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Sultanpur.deceased}
`)})
  }else if (msg.body == `-covid unnao`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Unnao Covid19 Cases-----╕*

*District Name :* Unnao, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Unnao.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Unnao.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Unnao.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Unnao.deceased}
`)})
  }else if (msg.body == `-covid varanasi`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Varanasi Covid19 Cases-----╕*

*District Name :* Varanasi, UP 
*Total Cases :* ${con['Uttar Pradesh'].districtData.Varanasi.confirmed}
*Active Cases :* ${con['Uttar Pradesh'].districtData.Varanasi.active}
*Recovered Cases :* ${con['Uttar Pradesh'].districtData.Varanasi.recovered}
*Death Cases :* ${con['Uttar Pradesh'].districtData.Varanasi.deceased}
`)})









// West bengal
}else if (msg.body == `-covid alipurduar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Alipurduar  Covid19 Cases-----╕*

*District Name :* Alipurduar, WB 
*Total Cases :* ${con['West Bengal'].districtData.Alipurduar.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Alipurduar.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Alipurduar.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Alipurduar.deceased}
`
)})
}else if (msg.body == `-covid bankura`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Bankura  Covid19 Cases-----╕*

*District Name :* Bankura, WB
*Total Cases :* ${con['West Bengal'].districtData.Bankura.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Bankura.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Bankura.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Bankura.deceased}
`
)})
}else if (msg.body == `-covid birbhum`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Birbhum  Covid19 Cases-----╕*

*District Name :* Birbhum, WB
*Total Cases :* ${con['West Bengal'].districtData.Birbhum.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Birbhum.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Birbhum.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Birbhum.deceased}
`
)})
}else if (msg.body == `-covid coochbehar`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Cooch Behar  Covid19 Cases-----╕*

*District Name :* Cooch Behar, WB
*Total Cases :* ${con['West Bengal'].districtData['Cooch Behar'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['Cooch Behar'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['Cooch Behar'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['Cooch Behar'].deceased}
`
)})
}else if (msg.body == `-covid darjeeling`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----darjeeling  Covid19 Cases-----╕*

*District Name :* Darjeeling, WB
*Total Cases :* ${con['West Bengal'].districtData.Darjeeling.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Darjeeling.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Darjeeling.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Darjeeling.deceased}
`
)})
}else if (msg.body == `-covid dakshindinajpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dakshin Dinajpur  Covid19 Cases-----╕*

*District Name :* Dakshin Dinajpur, WB
*Total Cases :* ${con['West Bengal'].districtData['Dakshin Dinajpur'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['Dakshin Dinajpur'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['Dakshin Dinajpur'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['Dakshin Dinajpur'].deceased}
`
)})
}else if (msg.body == `-covid jalpaiguri`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jalpaiguri  Covid19 Cases-----╕*

*District Name :* Jalpaiguri, WB
*Total Cases :* ${con['West Bengal'].districtData.Jalpaiguri.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Jalpaiguri.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Jalpaiguri.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Jalpaiguri.deceased}
`
)})

}else if (msg.body == `-covid hooghly`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dakshin Dinajpur  Covid19 Cases-----╕*

*District Name :* Hooghly, WB
*Total Cases :* ${con['West Bengal'].districtData.Hooghly.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Hooghly.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Hooghly.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Hooghly.deceased}
`
)})
}else if (msg.body == `-covid howrah`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Dakshin Dinajpur  Covid19 Cases-----╕*

*District Name :* Howrah, WB
*Total Cases :* ${con['West Bengal'].districtData.Howrah.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Howrah.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Howrah.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Howrah.deceased}
`
)})
}else if (msg.body == `-covid jhargram`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Jhargram  Covid19 Cases-----╕*

*District Name :* Jhargram, WB
*Total Cases :* ${con['West Bengal'].districtData.Jhargram.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Jhargram.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Jhargram.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Jhargram.deceased}
`
)})
}else if (msg.body == `-covid kalimpong`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kalimpong  Covid19 Cases-----╕*

*District Name :* Kalimpong, WB
*Total Cases :* ${con['West Bengal'].districtData.Kalimpong.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Kalimpong.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Kalimpong.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Kalimpong.deceased}
`
)})

}else if (msg.body == `-covid kolkata`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Kolkata  Covid19 Cases-----╕*

*District Name :* Kolkata, WB
*Total Cases :* ${con['West Bengal'].districtData.Kolkata.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Kolkata.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Kolkata.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Kolkata.deceased}
`
)})

}else if (msg.body == `-covid malda`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Malda  Covid19 Cases-----╕*

*District Name :* Malda, WB
*Total Cases :* ${con['West Bengal'].districtData.Malda.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Malda.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Malda.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Malda.deceased}
`
)})

}else if (msg.body == `-covid murshidabad`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Murshidabad  Covid19 Cases-----╕*

*District Name :* Murshidabad, WB
*Total Cases :* ${con['West Bengal'].districtData.Murshidabad.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Murshidabad.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Murshidabad.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Murshidabad.deceased}
`
)})
}else if (msg.body == `-covid nadia`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Nadia  Covid19 Cases-----╕*

*District Name :* Nadia, WB
*Total Cases :* ${con['West Bengal'].districtData.Nadia.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Nadia.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Nadia.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Nadia.deceased}
`
)})

}else if (msg.body == `-covid north24parganas`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----North 24 Parganas  Covid19 Cases-----╕*

*District Name :* North 24 Parganas, WB
*Total Cases :* ${con['West Bengal'].districtData['North 24 Parganas'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['North 24 Parganas'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['North 24 Parganas'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['North 24 Parganas'].deceased}
`
)})
}else if (msg.body == `-covid otherstate`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Other State  Covid19 Cases-----╕*

*District Name :* Other State, WB
*Total Cases :* ${con['West Bengal'].districtData['Other State'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['Other State'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['Other State'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['Other State'].deceased}
`
)})

}else if (msg.body == `-covid paschimbardhaman`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Paschim Bardhaman  Covid19 Cases-----╕*

*District Name :* Paschim Bardhaman, WB
*Total Cases :* ${con['West Bengal'].districtData['Paschim Bardhaman'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['Paschim Bardhaman'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['Paschim Bardhaman'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['Paschim Bardhaman'].deceased}
`
)})
}else if (msg.body == `-covid paschimmedinipur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Paschim Medinipur  Covid19 Cases-----╕*

*District Name :* Paschim Medinipur, WB
*Total Cases :* ${con['West Bengal'].districtData['Paschim Medinipur'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['Paschim Medinipur'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['Paschim Medinipur'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['Paschim Medinipur'].deceased}
`
)})

}else if (msg.body == `-covid purbabardhaman`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Purba Bardhaman  Covid19 Cases-----╕*

*District Name :* Purba Bardhaman, WB
*Total Cases :* ${con['West Bengal'].districtData['Purba Bardhaman'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['Purba Bardhaman'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['Purba Bardhaman'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['Purba Bardhaman'].deceased}
`
)})
}else if (msg.body == `-covid purbamedinipur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Purba Medinipur  Covid19 Cases-----╕*

*District Name :* Purba Medinipur, WB
*Total Cases :* ${con['West Bengal'].districtData['Purba Medinipur'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['Purba Medinipur'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['Purba Medinipur'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['Purba Medinipur'].deceased}
`
)})
}else if (msg.body == `-covid purulia`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Purulia  Covid19 Cases-----╕*

*District Name :* Purulia, WB
*Total Cases :* ${con['West Bengal'].districtData.Purulia.confirmed}
*Active Cases :* ${con['West Bengal'].districtData.Purulia.active}
*Recovered Cases :* ${con['West Bengal'].districtData.Purulia.recovered}
*Death Cases :* ${con['West Bengal'].districtData.Purulia.deceased}
`
)})
}else if (msg.body == `-covid south24parganas`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----South 24 Parganas  Covid19 Cases-----╕*

*District Name :* South 24 Parganas, WB
*Total Cases :* ${con['West Bengal'].districtData['South 24 Parganas'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['South 24 Parganas'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['South 24 Parganas'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['South 24 Parganas'].deceased}
`
)})

}else if (msg.body == `-covid uttardinajpur`){
  fetch('https://api.covid19india.org/state_district_wise.json')
  .then(res => res.json()).then(con => {
      msg.reply(`*╒-----Uttar Dinajpur  Covid19 Cases-----╕*

*District Name :* Uttar Dinajpur, WB
*Total Cases :* ${con['West Bengal'].districtData['Uttar Dinajpur'].confirmed}
*Active Cases :* ${con['West Bengal'].districtData['Uttar Dinajpur'].active}
*Recovered Cases :* ${con['West Bengal'].districtData['Uttar Dinajpur'].recovered}
*Death Cases :* ${con['West Bengal'].districtData['Uttar Dinajpur'].deceased}
`
)})


// Notes 

}else if (msg.body == `-notes cn`){
    msg.reply(`
CN Notes Link - https://drive.google.com/drive/folders/1wBI06xjL3ULcO_EysthjkWRuniRHzRou
`)
}else if (msg.body == `-notes dbms`){
  msg.reply(`
DBMS Notes Link - https://drive.google.com/file/d/1fFz11sTKMeUUBMa1vlrUODt7OAXrOJiC/view
`)
}else if (msg.body == `-notes dwpd`){
    msg.reply(`
DWPD Notes Link - https://drive.google.com/drive/folders/1uaGe_sn8UzGlA_b6enE0YAXttaDWemNy?usp=sharing
`)
}else if (msg.body == `-notes erd`){
    msg.reply(`
ERD Notes Link - https://drive.google.com/drive/folders/1RAB6lws8QtFHbYIN2BnlFVvEOF9Rmz7k?usp=sharing
`)
}else if (msg.body == `-notes mis`){
    msg.reply(`
MIS Notes Link - https://drive.google.com/drive/folders/1F80unZtOgc6CJEGtpbk_E60dIfyBvMCP?usp=sharing
`)
}else if (msg.body == `-notes csa`){
    msg.reply(`
CSA Notes Link - https://drive.google.com/drive/folders/1TlYZ5RvaopsJYC9WHlywFjDI5ZOmZ7iR?usp=sharing
`)
}else if (msg.body == `-notes is`){
    msg.reply(`
IS Notes Link - https://drive.google.com/drive/folders/1mJB0uB1QhdBa9z6F0rzz0yNOg1YF0HZw?usp=sharing
`)

// QB
}else if (msg.body == `-qb cn`){
  msg.reply(`
CN QB Link - https://drive.google.com/drive/u/0/folders/1O7-bJ3nTB5G7DvHDleoGH2N6EFK9GFyW
  `)
}else if (msg.body == `-qb erd`){
  msg.reply(`
ERD QB Link - https://drive.google.com/drive/folders/1VUE9n6gFGlmjS0JmsFBwqdigQ4C85K5S?usp=sharing
`)
}else if (msg.body == `-qb is`){
  msg.reply(`
IS QB Link - https://drive.google.com/drive/folders/1RBCCqmAyehBX8U2I075bpEm_ymT6NMVt?usp=sharing
`)
}else if (msg.body == `-qb dwpd`){
  msg.reply(`
DWPD QB Currently Not Available 😓
`)
}else if (msg.body == `-qb csa`){
  msg.reply(`
CSA QB Currently Not Available 😓
`)
}else if (msg.body == `-qb dbms`){
  msg.reply(`
DBMS QB Currently Not Available 😓
`)
}else if (msg.body == `-qb mis`){
  msg.reply(`
MIS QB Link - https://drive.google.com/file/d/1xdYj9q6B_FG8fOnn0kKwB1LQOiV3vMMt/view?usp=sharing
`)

// Qp
}else if (msg.body == `-qp cn`){
  msg.reply(`
CN Question Paper Link - https://drive.google.com/drive/folders/1VEfLupIg1w0z6DBKVwFnzTLM568CKFeW?usp=sharing
  `)
}else if (msg.body == `-qp erd`){
  msg.reply(`
ERD Question Paper Link - https://drive.google.com/drive/folders/1ZeQQ_-TxNNLkPtzXD1FRi734tLkNbHTh?usp=sharing
`)
}else if (msg.body == `-qp is`){
  msg.reply(`
IS Question Paper Link - https://drive.google.com/drive/folders/1USQ9asi3Sq4Qikc8HyE9YEbi3HGuC9uO?usp=sharing
`)
}else if (msg.body == `-qp dwpd`){
  msg.reply(`
DWPD Question Paper Link - https://drive.google.com/drive/folders/1p9HYuyMo2J_Y76VeoKTXGGLjW3ixt4Pd?usp=sharing
`)
}else if (msg.body == `-qp csa`){
  msg.reply(`
CSA Question paper Link - https://drive.google.com/drive/folders/1f8rUY34VgniLTYKIppI9-egtU-Uw2Ejs?usp=sharing
`)
}else if (msg.body == `-qp dbms`){
  msg.reply(`
DBMS Question Paper Link - https://drive.google.com/drive/folders/1VEfLupIg1w0z6DBKVwFnzTLM568CKFeW?usp=sharing
`)
}else if (msg.body == `-qp mis`){
  msg.reply(`
MIS Qustion Paper Link - https://drive.google.com/drive/folders/1f8rUY34VgniLTYKIppI9-egtU-Uw2Ejs?usp=sharing
`)

// Covid HelpLine
}else if (msg.body == `-covid helpline`){
  msg.reply(`*╒-----Covid Helpline Numbers-----╕*

Central Helpline - +91-11-23978046
Andhra-Pradesh - 0886-2410978
Arunachal Pradesh - 9436055743
Assam - 6913347770
Bihar - 104
Chhattisgarh - 104 
Goa - 104
Gujarat - 104
Haryana - 8558893911
Himachal Pradesh - 104
Jharkhand - 104
Karnataka - 104
Kerala - 0471-2552056
Madhya Pradesh - 104
Maharashtra - 020-26127394
Manipur - 3852411668
Meghalaya - 108
Mizoram - 102
Nagaland - 7005539653
Odisha - 9439994859
Punjab - 104
Rajasthan - 0141-2225624
Sikkim - 104
Tamil Nadu - 044-29510500
Telangana - 104
Tripura - 0381-2315879
Uttarakhand - 104
Uttar Pradesh - 18001805145
West Bengal - 1800313444222, 03323412600
Andaman and Nicobar Islands - 03192-232102
Chandigarh - 9779558282
Dadra and Nagar Haveli and Daman & Diu - 104
Delhi - 011-22307145
Jammu & Kashmir - 01912520982, 0194-2440283
Ladakh - 01982256462
Lakshadweep - 104
Puducherry - 104
`)


// State wise ----

}else if (msg.body == `-covid andamanandnicobarislands`){
  fetch('https://api.covid19india.org/data.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Andaman and Nicobar Islands Covid19 Cases-----╕*

*State Name :* ${con.statewise[1].state}    
*Total Cases :* ${con.statewise[1].confirmed}
*Active Cases :* ${con.statewise[1].active}
*Recovered Cases :* ${con.statewise[1].recovered}
*Death Cases :* ${con.statewise[1].deaths}
*Last Updated Time :* ${con.statewise[1].lastupdatedtime}
`)})


 }else if (msg.body == `-covid andhrapradesh`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Andhra Pradesh Covid19 Cases-----╕*

*State Name :* ${con.statewise[2].state}    
*Total Cases :* ${con.statewise[2].confirmed}
*Active Cases :* ${con.statewise[2].active}
*Recovered Cases :* ${con.statewise[2].recovered}
*Death Cases :* ${con.statewise[2].deaths}
*Last Updated Time :* ${con.statewise[2].lastupdatedtime}
`)})


 }else if (msg.body == `-covid arunachalpradesh`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Arunachal Pradesh Covid19 Cases-----╕*

*State Name :* ${con.statewise[3].state}    
*Total Cases :* ${con.statewise[3].confirmed}
*Active Cases :* ${con.statewise[3].active}
*Recovered Cases :* ${con.statewise[3].recovered}
*Death Cases :* ${con.statewise[3].deaths}
*Last Updated Time :* ${con.statewise[3].lastupdatedtime}
`)})

 }else if (msg.body == `-covid assam`){
  fetch('https://api.covid19india.org/data.json')
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Assam Covid19 Cases-----╕*

*State Name :* ${con.statewise[4].state}    
*Total Cases :* ${con.statewise[4].confirmed}
*Active Cases :* ${con.statewise[4].active}
*Recovered Cases :* ${con.statewise[4].recovered}
*Death Cases :* ${con.statewise[4].deaths}
*Last Updated Time :* ${con.statewise[4].lastupdatedtime}
`)})
   
 
 }else if (msg.body == `-covid bihar`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Bihar Covid19 Cases-----╕*

*State Name :* ${con.statewise[5].state}    
*Total Cases :* ${con.statewise[5].confirmed}
*Active Cases :* ${con.statewise[5].active}
*Recovered Cases :* ${con.statewise[5].recovered}
*Death Cases :* ${con.statewise[5].deaths}
*Last Updated Time :* ${con.statewise[5].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid chandigarh`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Chandigarh Covid19 Cases-----╕*

*State Name :* ${con.statewise[6].state}    
*Total Cases :* ${con.statewise[6].confirmed}
*Active Cases :* ${con.statewise[6].active}
*Recovered Cases :* ${con.statewise[6].recovered}
*Death Cases :* ${con.statewise[6].deaths}
*Last Updated Time :* ${con.statewise[6].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid chhattisgarh`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Chhattisgarh Covid19 Cases-----╕*

*State Name :* ${con.statewise[7].state}    
*Total Cases :* ${con.statewise[7].confirmed}
*Active Cases :* ${con.statewise[7].active}
*Recovered Cases :* ${con.statewise[7].recovered}
*Death Cases :* ${con.statewise[7].deaths}
*Last Updated Time :* ${con.statewise[7].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid dadraandnagarhavelianddamananddiu`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Dadra and Nagar Haveli and Daman and Diu Covid19 Cases-----╕*

*State Name :* ${con.statewise[8].state}    
*Total Cases :* ${con.statewise[8].confirmed}
*Active Cases :* ${con.statewise[8].active}
*Recovered Cases :* ${con.statewise[8].recovered}
*Death Cases :* ${con.statewise[8].deaths}
*Last Updated Time :* ${con.statewise[8].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid delhi`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Delhi Covid19 Cases-----╕*

*State Name :* ${con.statewise[9].state}    
*Total Cases :* ${con.statewise[9].confirmed}
*Active Cases :* ${con.statewise[9].active}
*Recovered Cases :* ${con.statewise[9].recovered}
*Death Cases :* ${con.statewise[9].deaths}
*Last Updated Time :* ${con.statewise[9].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid goa`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Goa Covid19 Cases-----╕*

*State Name :* ${con.statewise[10].state}    
*Total Cases :* ${con.statewise[10].confirmed}
*Active Cases :* ${con.statewise[10].active}
*Recovered Cases :* ${con.statewise[10].recovered}
*Death Cases :* ${con.statewise[10].deaths}
*Last Updated Time :* ${con.statewise[10].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid gujarat`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Gujarat Covid19 Cases-----╕*

*State Name :* ${con.statewise[11].state}    
*Total Cases :* ${con.statewise[11].confirmed}
*Active Cases :* ${con.statewise[11].active}
*Recovered Cases :* ${con.statewise[11].recovered}
*Death Cases :* ${con.statewise[11].deaths}
*Last Updated Time :* ${con.statewise[11].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid haryana`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Haryana Covid19 Cases-----╕*

*State Name :* ${con.statewise[12].state}    
*Total Cases :* ${con.statewise[12].confirmed}
*Active Cases :* ${con.statewise[12].active}
*Recovered Cases :* ${con.statewise[12].recovered}
*Death Cases :* ${con.statewise[12].deaths}
*Last Updated Time :* ${con.statewise[12].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid himachalpradesh`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Himachal Pradesh Covid19 Cases-----╕*

*State Name :* ${con.statewise[13].state}    
*Total Cases :* ${con.statewise[13].confirmed}
*Active Cases :* ${con.statewise[13].active}
*Recovered Cases :* ${con.statewise[13].recovered}
*Death Cases :* ${con.statewise[13].deaths}
*Last Updated Time :* ${con.statewise[13].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid jammuandkashmir`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Jammu and Kashmir Covid19 Cases-----╕*

*State Name :* ${con.statewise[14].state}    
*Total Cases :* ${con.statewise[14].confirmed}
*Active Cases :* ${con.statewise[14].active}
*Recovered Cases :* ${con.statewise[14].recovered}
*Death Cases :* ${con.statewise[14].deaths}
*Last Updated Time :* ${con.statewise[14].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid jharkhand`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Jharkhand Covid19 Cases-----╕*

*State Name :* ${con.statewise[15].state}    
*Total Cases :* ${con.statewise[15].confirmed}
*Active Cases :* ${con.statewise[15].active}
*Recovered Cases :* ${con.statewise[15].recovered}
*Death Cases :* ${con.statewise[15].deaths}
*Last Updated Time :* ${con.statewise[15].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid karnataka`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Karnataka Covid19 Cases-----╕*

*State Name :* ${con.statewise[16].state}    
*Total Cases :* ${con.statewise[16].confirmed}
*Active Cases :* ${con.statewise[16].active}
*Recovered Cases :* ${con.statewise[16].recovered}
*Death Cases :* ${con.statewise[16].deaths}
*Last Updated Time :* ${con.statewise[16].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid kerala`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Kerala Covid19 Cases-----╕*

*State Name :* ${con.statewise[17].state}    
*Total Cases :* ${con.statewise[17].confirmed}
*Active Cases :* ${con.statewise[17].active}
*Recovered Cases :* ${con.statewise[17].recovered}
*Death Cases :* ${con.statewise[17].deaths}
*Last Updated Time :* ${con.statewise[17].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid ladakh`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Ladakh Covid19 Cases-----╕*

*State Name :* ${con.statewise[18].state}    
*Total Cases :* ${con.statewise[18].confirmed}
*Active Cases :* ${con.statewise[18].active}
*Recovered Cases :* ${con.statewise[18].recovered}
*Death Cases :* ${con.statewise[18].deaths}
*Last Updated Time :* ${con.statewise[18].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid lakshadweep`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Lakshadweep Covid19 Cases-----╕*

*State Name :* ${con.statewise[19].state}    
*Total Cases :* ${con.statewise[19].confirmed}
*Active Cases :* ${con.statewise[19].active}
*Recovered Cases :* ${con.statewise[19].recovered}
*Death Cases :* ${con.statewise[19].deaths}
*Last Updated Time :* ${con.statewise[19].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid madhyapradesh`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Madhya Pradesh Covid19 Cases-----╕*

*State Name :* ${con.statewise[20].state}    
*Total Cases :* ${con.statewise[20].confirmed}
*Active Cases :* ${con.statewise[20].active}
*Recovered Cases :* ${con.statewise[20].recovered}
*Death Cases :* ${con.statewise[20].deaths}
*Last Updated Time :* ${con.statewise[20].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid maharashtra`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Maharashtra Covid19 Cases-----╕*

*State Name :* ${con.statewise[21].state}    
*Total Cases :* ${con.statewise[21].confirmed}
*Active Cases :* ${con.statewise[21].active}
*Recovered Cases :* ${con.statewise[21].recovered}
*Death Cases :* ${con.statewise[21].deaths}
*Last Updated Time :* ${con.statewise[21].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid manipur`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Manipur Covid19 Cases-----╕*

*State Name :* ${con.statewise[22].state}    
*Total Cases :* ${con.statewise[22].confirmed}
*Active Cases :* ${con.statewise[22].active}
*Recovered Cases :* ${con.statewise[22].recovered}
*Death Cases :* ${con.statewise[22].deaths}
*Last Updated Time :* ${con.statewise[22].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid meghalaya`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Meghalaya Covid19 Cases-----╕*

*State Name :* ${con.statewise[23].state}    
*Total Cases :* ${con.statewise[23].confirmed}
*Active Cases :* ${con.statewise[23].active}
*Recovered Cases :* ${con.statewise[23].recovered}
*Death Cases :* ${con.statewise[23].deaths}
*Last Updated Time :* ${con.statewise[23].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid mizoram`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Mizoram Covid19 Cases-----╕*

*State Name :* ${con.statewise[24].state}    
*Total Cases :* ${con.statewise[24].confirmed}
*Active Cases :* ${con.statewise[24].active}
*Recovered Cases :* ${con.statewise[24].recovered}
*Death Cases :* ${con.statewise[24].deaths}
*Last Updated Time :* ${con.statewise[24].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid nagaland`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Nagaland Covid19 Cases-----╕*

*State Name :* ${con.statewise[25].state}    
*Total Cases :* ${con.statewise[25].confirmed}
*Active Cases :* ${con.statewise[25].active}
*Recovered Cases :* ${con.statewise[25].recovered}
*Death Cases :* ${con.statewise[25].deaths}
*Last Updated Time :* ${con.statewise[25].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid odisha`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Odisha Covid19 Cases-----╕*

*State Name :* ${con.statewise[26].state}    
*Total Cases :* ${con.statewise[26].confirmed}
*Active Cases :* ${con.statewise[26].active}
*Recovered Cases :* ${con.statewise[26].recovered}
*Death Cases :* ${con.statewise[26].deaths}
*Last Updated Time :* ${con.statewise[26].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid puducherry`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Puducherry Covid19 Cases-----╕*

*State Name :* ${con.statewise[27].state}    
*Total Cases :* ${con.statewise[27].confirmed}
*Active Cases :* ${con.statewise[27].active}
*Recovered Cases :* ${con.statewise[27].recovered}
*Death Cases :* ${con.statewise[27].deaths}
*Last Updated Time :* ${con.statewise[27].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid punjab`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Punjab Covid19 Cases-----╕*

*State Name :* ${con.statewise[28].state}    
*Total Cases :* ${con.statewise[28].confirmed}
*Active Cases :* ${con.statewise[28].active}
*Recovered Cases :* ${con.statewise[28].recovered}
*Death Cases :* ${con.statewise[28].deaths}
*Last Updated Time :* ${con.statewise[28].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid rajasthan`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Rajasthan Covid19 Cases-----╕*

*State Name :* ${con.statewise[29].state}    
*Total Cases :* ${con.statewise[29].confirmed}
*Active Cases :* ${con.statewise[29].active}
*Recovered Cases :* ${con.statewise[29].recovered}
*Death Cases :* ${con.statewise[29].deaths}
*Last Updated Time :* ${con.statewise[29].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid sikkim`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Sikkim Covid19 Cases-----╕*

*State Name :* ${con.statewise[30].state}    
*Total Cases :* ${con.statewise[30].confirmed}
*Active Cases :* ${con.statewise[30].active}
*Recovered Cases :* ${con.statewise[30].recovered}
*Death Cases :* ${con.statewise[30].deaths}
*Last Updated Time :* ${con.statewise[30].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid unassignedstate`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----unassignedstate Covid19 Cases-----╕*

*State Name :* ${con.statewise[31].state}    
*Total Cases :* ${con.statewise[31].confirmed}
*Active Cases :* ${con.statewise[31].active}
*Recovered Cases :* ${con.statewise[31].recovered}
*Death Cases :* ${con.statewise[31].deaths}
*Last Updated Time :* ${con.statewise[31].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid tamilnadu`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Tamil Nadu Covid19 Cases-----╕*

*State Name :* ${con.statewise[32].state}    
*Total Cases :* ${con.statewise[32].confirmed}
*Active Cases :* ${con.statewise[32].active}
*Recovered Cases :* ${con.statewise[32].recovered}
*Death Cases :* ${con.statewise[32].deaths}
*Last Updated Time :* ${con.statewise[32].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid telangana`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Telangana Covid19 Cases-----╕*

*State Name :* ${con.statewise[33].state}    
*Total Cases :* ${con.statewise[33].confirmed}
*Active Cases :* ${con.statewise[33].active}
*Recovered Cases :* ${con.statewise[33].recovered}
*Death Cases :* ${con.statewise[33].deaths}
*Last Updated Time :* ${con.statewise[33].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid tripura`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Tripura Covid19 Cases-----╕*

*State Name :* ${con.statewise[34].state}    
*Total Cases :* ${con.statewise[34].confirmed}
*Active Cases :* ${con.statewise[34].active}
*Recovered Cases :* ${con.statewise[34].recovered}
*Death Cases :* ${con.statewise[34].deaths}
*Last Updated Time :* ${con.statewise[34].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid uttarpradesh`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Uttar Pradesh Covid19 Cases-----╕*

*State Name :* ${con.statewise[35].state}    
*Total Cases :* ${con.statewise[35].confirmed}
*Active Cases :* ${con.statewise[35].active}
*Recovered Cases :* ${con.statewise[35].recovered}
*Death Cases :* ${con.statewise[35].deaths}
*Last Updated Time :* ${con.statewise[35].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid uttarakhand`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----Uttarakhand Covid19 Cases-----╕*

*State Name :* ${con.statewise[36].state}    
*Total Cases :* ${con.statewise[36].confirmed}
*Active Cases :* ${con.statewise[36].active}
*Recovered Cases :* ${con.statewise[36].recovered}
*Death Cases :* ${con.statewise[36].deaths}
*Last Updated Time :* ${con.statewise[36].lastupdatedtime}
`)})
 

 }else if (msg.body == `-covid westbengal`){
  fetch("https://api.covid19india.org/data.json")
  .then(res => res.json()).then(con=>{
    msg.reply(`*╒-----West Bengal Covid19 Cases-----╕*

*State Name :* ${con.statewise[37].state}    
*Total Cases :* ${con.statewise[37].confirmed}
*Active Cases :* ${con.statewise[37].active}
*Recovered Cases :* ${con.statewise[37].recovered}
*Death Cases :* ${con.statewise[37].deaths}
*Last Updated Time :* ${con.statewise[37].lastupdatedtime}
`)})
 
// FrontPage 
  }else if(msg.body=='-frontpage'){

    msg.reply(`
Front Page Download Link - https://drive.google.com/file/d/1F67YfzQby2gfj6vu6Ijr_--u57S9EMWR/view?usp=sharing
`)
  // 
  }else if (msg.body == '-guide'){
msg.reply(
`
*----------Exam Guidelines---------*

*For the examination session April-May 2021, the following guidelines are issued to the candidates for all the courses*

*1.* Examination of all courses is being conducted on online mode from 02 June 2021. For exam time table visit the university website

*2.* Prepare the subjective question paper under the syllabus related to the subject will be done

*3.* Students are informed that the candidates will appear in the above examinations only through the study institutes. Contact the studying college for additional guidelines regarding the examination

*4.* Half an hour before the examination, students must give their attendance information to their Head of Department / Coordinator

*5.* On the day of examination, at 09:30 am, the question paper will be sent to the students through email/whatsapp etc. to the Head of the Department, the coordinator. The PDF of the scanned answer book by the students will be sent to the concerned Head of Department / Coordinator. Will be sent in email/whatsapp

*6.* High speed bandwith of 10 MBPS  is required for an exam

*7.* The answer book can be scanned by the following application

*A.* Genius Scan Pdf Scanner
*B.* Clear Scan
*C.* Document Scanner

*8.* The size of the PDF should be maximum 20 MB and the name of the PDF (Nomenclature for PDF) will be subjectcode_rollnumber . For example - subject code is 300831 (37) and roll no. is 3033717052 then pdf nomenclature will be 300831(37)_3033717052

*9.* A4 size page will be used by the student, and the answers to the questions will be written logically (to the point), in case of non-availability of A4 size page, the register size page can be used. Enter the page number at the bottom right of each page

*10.* The format of the first page has been published in the website of the University, which should be downloaded by the student. In case of non-availability of printing facility, make a hand written format of the format and upload it by filling full details

11.* In the second page (page no. 2), the student will upload the photo taken by the student with the admit card. Due to non-availability of printing, instead of admit card, take a selfie with the format filled in handwritten details which will be page no. 2

12.* The maximum number of pages in the answer book will be 40 pages and on the first page student details and in the second page the student has to upload selfie with admit card/details. Thus it is mandatory to upload a total of 42 pages

*13.* If the answer book of any student is more than or less than 42 pages, then the answer book can be canceled and it will be the responsibility of the student

*14.* While scanning, the student should take care that the entire page should be a clear image and the PDF should be fully visible and readable

*15.* It should be ensured by the students that the answer to the last question is exhausted. After closing the last answer, the remaining page should be struck off (means it should be crossed )

*16.* Upload the scanned copy of the candidate's answer sheet in the given email / whatsapp of your college coordinator till 02:00 noon

*17.* The students are prohibited from having contact with each other or others during the examination. If such activity is found while monitoring, then action will be taken under Counterfeiting Case (UFM).

*18.* In case of discrepancy found in the answer sheets of two different students, the action of copying case (UFM) will be taken against both the students

*19.* In the examination of drawing / graphics subject, the answer to each question should be started from a separate page and after scanning each page separately, a PDF should be uploaded. The size of the PDF should be maximum 20 MB and the number of pages should be 40+2
`
)

// All QP
  }else if (msg.body == '-qp all'){
    msg.reply(
`
All Question Paper Link - https://drive.google.com/drive/folders/1hA3fY6mEYqO-4SVtt71PMsCJ3B5G-e4h?usp=sharing
`
    )

    }else if (msg.body == `-bore`){
      fetch("http://www.boredapi.com/api/activity?type=education")
      .then(res => res.json()).then(con=>{msg.reply(
`
*Activity :-* ${con.activity}
*Type :-* ${con.type}
*Link :-* ${con.link}
`
      )

      })
     
// HELP
} else if (msg.body == '-help'){
    msg.reply(
      `
 *Covid Commands*
      
1. -covid
2. -covid <country>
3. -covid <state>
4. -covid <district>
5. -covid <helpline>
      
 *College Commands*
      
1. -notes <subject>
2. -qp <subject>
3. -qb <subject>
4. -frontpage
5. -guide

  *Activity Commands*

1. -bore 
`
    )
  } else if (msg.body=='-commands'){
    msg.reply(
`
*Covid Commands*

1. -covid
2. -covid <country>
3. -covid <state>
4. -covid <district>
5. -covid <helpline>

*College Commands*

1. -notes <subject>
2. -qp <subject>
3. -qb <subject>
4. -frontpage
5. -guide

*Activity Commands*

1. -bore
`
    )
  }
});

client.initialize();

// Socket IO
io.on('connection', function(socket) {
  socket.emit('message', 'Connecting...');

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QR Code received, scan please-');
    });
  });

  client.on('ready', () => {
    socket.emit('ready', 'Whatsapp is ready-');
    socket.emit('message', 'Whatsapp is ready-');
  });

  client.on('authenticated', (session) => {
    socket.emit('authenticated', 'Whatsapp is authenticated-');
    socket.emit('message', 'Whatsapp is authenticated-');
    console.log('AUTHENTICATED', session);
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
      if (err) {
        console.error(err);
      }
    });
  });

  client.on('auth_failure', function(session) {
    socket.emit('message', 'Auth failure, restarting...');
  });

  client.on('disconnected', (reason) => {
    socket.emit('message', 'Whatsapp is disconnected-');
    fs.unlinkSync(SESSION_FILE_PATH, function(err) {
        if(err) return console.log(err);
        console.log('Session file deleted-');
    });
    client.destroy();
    client.initialize();
  });
});


const checkRegisteredNumber = async function(number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
}

// Send message
app.post('/send-message', [
  body('number').notEmpty(),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (-errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);
  const message = req.body.message;

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (-isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'The number is not registered'
    });
  }

  client.sendMessage(number, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

// Send media
app.post('/send-media', async (req, res) => {
  const number = phoneNumberFormatter(req.body.number);
  const caption = req.body.caption;
  const fileUrl = req.body.file;

  // const media = MessageMedia.fromFilePath('./image-example.png');
  // const file = req.files.file;
  // const media = new MessageMedia(file.mimetype, file.data.toString('base64'), file.name);
  let mimetype;
  const attachment = await axios.get(fileUrl, {
    responseType: 'arraybuffer'
  }).then(response => {
    mimetype = response.headers['content-type'];
    return response.data.toString('base64');
  });

  const media = new MessageMedia(mimetype, attachment, 'Media');

  client.sendMessage(number, media, {
    caption: caption
  }).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

const findGroupByName = async function(name) {
  const group = await client.getChats().then(chats => {
    return chats.find(chat => 
      chat.isGroup && chat.name.toLowerCase() == name.toLowerCase()
    );
  });
  return group;
}

// Send message to group
// You can use chatID or group name, yea-
app.post('/send-group-message', [
  body('id').custom((value, { req }) => {
    if (-value && -req.body.name) {
      throw new Error('Invalid value, you can use `id` or `name`');
    }
    return true;
  }),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (-errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  let chatId = req.body.id;
  const groupName = req.body.name;
  const message = req.body.message;

  // Find the group by name
  if (-chatId) {
    const group = await findGroupByName(groupName);
    if (-group) {
      return res.status(422).json({
        status: false,
        message: 'No group found with name: ' + groupName
      });
    }
    chatId = group.id._serialized;
  }

  client.sendMessage(chatId, message).then(response => {
    res.status(200).json({
      status: true,
      response: response
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  });
});

// Clearing message on spesific chat
app.post('/clear-message', [
  body('number').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (-errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = phoneNumberFormatter(req.body.number);

  const isRegisteredNumber = await checkRegisteredNumber(number);

  if (-isRegisteredNumber) {
    return res.status(422).json({
      status: false,
      message: 'The number is not registered'
    });
  }

  const chat = await client.getChatById(number);
  
  chat.clearMessages().then(status => {
    res.status(200).json({
      status: true,
      response: status
    });
  }).catch(err => {
    res.status(500).json({
      status: false,
      response: err
    });
  })
});

server.listen(port, function() {
  console.log('App running on *: ' + port);
});
