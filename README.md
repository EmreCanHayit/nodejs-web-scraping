# Api desteği olmayan servisleri / siteleri kazımak.

Kullanmak istediğiniz bir servisin api desteği bulunmuyordur veya bir web sayfası üzerindeki verileri kullanmak istediğiniz zaman resmi api desteğinin gelmesini beklemeyiz. Kazırız :D

## Peki nedir bu kazımak ?
En genel anlamıyla bot diyebiliriz. İstenen veriyi çekerek belli bir formatta kullanmak için sakladığımız bir yapı.

## Nasıl ve neler yapacağız ?
Çok basit, web sitesine bir istekte bulunacağız ve istek sonucu dönen veri içinde istediğimiz kısımları alıp gerisini atarak. 
### Nasıl yapıyoruz;
Hemen hemen bütün programla dilleri üzerinde kazıma yapılabilir ama bu makalede node.js üzerine odaklanıyoruz.
* İstek atmak için axios
* Düzenleme için jsdom
* Çıktı için fs kütüphanelerini kullanıyoruz.

## Kısa kısa kütüphaneler
* axios http istekleri ve geri dönüşleri dinlemek için kullanılıyor.
* jsdom adından da anlaşıldığı gibi DOM üzerinde gezinmemizi sağlıyor. (Hiç bilmeyenler için DOM(Document Object Model) element hiyerarşisini kontrol eden ve diğer diller ile web sayfalarını konuşturan ara katman)
* fs nodejs üzerinde dosya kontrol sistemi

# Kazımak için hazırsak kodlayalım :)
İlk olarak package.json dosyasını oluşturarak başlayalım.
```
npm init -y
```
İkinci olarakta kütüphanelerin eklenmesi tabiiki
```
npm install axios jsdom --save
```
Artık kodlama kısmına geçebiliriz. Bir tane javascript dosyası oluşturalım ismini herhangi bir şey yapabilirsiniz. Ben App.js olarak oluşturuyorum.

## Buradan sonra ilk önce mantığı anlatıp daha sonra örnek projeler ile pekiştirelim.
```
axios
    .get(url)
    .then(response => {
        getSelected(response.data); 
    })
    .catch(error => {
        console.log(error);
    });
```
axios ile bir istekte bulunduk ve web sitesinin cevabını düzenlemek için gönderiyoruz. Herhangi bir hata ihtimali için önlemimizi alıyoruz.
```
const getSelected = html => {
    const data = [],
    DOM = new JSDOM(html),
    selectedAll = DOM.window.document.querySelectorAll('element');

    selectedAll.forEach(item => {
        data.push({
            push...
        })
    })
```
Gelen parametre ile DOM üzerinde element seçimi yapıyoruz. Bu element istenilen bütün elemanları kapsamalıdır. Çünkü boşta kalan eleman olursa tekrar çalıştırma gerekir.

querySelectorAll geriye bir dizi döndürdüğü için bu dizi üzerinde yeni eşleşmeler arayabilir veya kaydedebiliriz.
```
let outJSON = JSON.stringify(data);
fs.writeFile('data.json', outJSON, (err) => {
    if(err) throw err;
    console.log("Çıktı başarılı.");
});
```
JSON.stringify ile dizimizi JSON formatına çevirip, fs ile kaydediyoruz. Hata ihtimali için önlemimizi ve başarılı sonuçlar için bilgilendirmemizi yapıyoruz.

## Hadi bir kaç örnek yapalarak kodları daha iyi anlayalım.

İlk örneğimiz ``currency.word`` üzerinden döviz kurlarını çekmek.
```
const axios = require('axios');
const { JSDOM } = require('jsdom');
const url = 'https://currency.world/exchange_rates/TRY';

axios.get(url).then(response => {
    getSelected(response.data);
}).catch(error => {
    console.log(error);
})

const getSelected = html => {
    const data = [],
    dom = new JSDOM(html),
    selectedAll = dom.window.document.querySelectorAll('.ratestable a');

    selectedAll.forEach(item => {
        data.push({
            name: item.querySelector('.code').innerHTML,
            rate: item.querySelector('.rate').innerHTML
        })
    });
    console.log(data);
}
```
Çıktımız
```
[
  { name: 'USD', rate: '8.558' },
  { name: 'EUR', rate: '10.101' },
  { name: 'GBP', rate: '11.830' },
  { name: 'RUB', rate: '0.1161' },
  { name: 'CAD', rate: '6.821' },
  { name: 'AUD', rate: '6.318' },
  { name: 'CNY', rate: '1.320' },
  { name: 'JPY', rate: '0.07753' },
  { name: 'CHF', rate: '9.346' },
  { name: 'SGD', rate: '6.300' },
  { name: 'BTC', rate: '318535' },
  { name: 'XAU', rate: '15382' }
]
```
İkinci örneğimiz ``accuweather.com`` üzerinden hava durumu çekmek.
```
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
    .catch(error => {
        console.log(error);
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
    console.log(data);
}
```
Çıktımız
```
[
  {
    "day": {
      "sub": "27.7",
      "dow": "Sal"
    },
    "temp": {
      "high": "32°",
      "low": "23°"
    },
    "phrase": "Güneşli",
    "percip": "%0"
  },
  .
  .
  .
]
```
