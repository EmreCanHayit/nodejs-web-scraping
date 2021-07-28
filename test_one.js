const axios = require('axios');
const { JSDOM } = require('jsdom');
const url = 'https://currency.world/exchange_rates/TRY';

axios
    .get(url)
    .then(response => {
        getSelected(response.data);
    })
    .catch(err => {
        console.log(err);
    })

const getSelected = html => {
    const data = [],
    DOM = new JSDOM(html),
    selectedAll = DOM.window.document.querySelectorAll('.ratestable a');

    selectedAll.forEach(item => {
        data.push({
            name: item.querySelector('.code').innerHTML,
            rate: item.querySelector('.rate').innerHTML
        })
    });
    console.log(data);
}