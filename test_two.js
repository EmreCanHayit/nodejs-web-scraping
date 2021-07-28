const axios = require('axios');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const url = 'https://www.accuweather.com/tr/tr/istanbul/318251/daily-weather-forecast/318251';

const spaceRegex = new RegExp(/\s*/, "gm");
const ignoreHtmlRegex = new RegExp(/<[^>]*>?/, "gm");

axios
    .get(url)
    .then(response => {
        getSelected(response.data); 
    })
    .catch(err => {
        console.log(err);
    });

const getSelected = html => {
    const data = [],
    DOM = new JSDOM(html),
    selectedAll = DOM.window.document.querySelectorAll('.daily-wrapper');

    selectedAll.forEach(item => {
        data.push({
            day: {
                sub: item.querySelector('.info .date .sub').innerHTML,
                dow: item.querySelector('.info .date .dow').innerHTML,
            },
            temp: {
                high: item.querySelector('.info .temp .high').innerHTML,
                low: item.querySelector('.info .temp .low').innerHTML.slice(1),
            },
            phrase: item.querySelector('.phrase').innerHTML.replace(spaceRegex,''),
            percip: item.querySelector('.precip').innerHTML.replace(ignoreHtmlRegex, '').replace(spaceRegex,'')
        })
    })

    let outJSON = JSON.stringify(data);
    fs.writeFile('data.json', outJSON, (err) => {
        if(err) throw err;
        console.log("Çıktı başarılı.");
    });
}