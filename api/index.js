var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1546740995:AAGDFa9qum9GZj-xJFKiNShD283TMka3b3s'
const bot = new TelegramBot(token, {polling: true});


// Main Menu bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );   
});

// input requires I and V
state = 0;
bot.onText(/\/predict/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Masukan Nilai i|v , contoh 7|8'
    );
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        i = s[0]
        v = s[1]
        model.predict(
            [
                parseFloat(s[0]), //string to float
                parseFloat(s[1])
            ]
       ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                `Nilai V yang Di Prediksi adalah ${jres[0]} Volt`
            );
            
            bot.sendMessage(
                msg.chat.id,
                `Nilai P yang Di Prediksi adalah ${jres[1]} Watt`
            );
        })
    }else{
        state = 0
    }
})

// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
