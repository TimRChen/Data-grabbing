/**
 * @file cheerio apply
 * @author timrchen
 */

const http = require('http');
const cheerio = require('cheerio');

http.get('http://localhost:3000/', res => {
    let data = '';
    res.on('data', chunk => {
        data += chunk;
        console.log(data);
    });
    res.on('end', () => {
        let $ = cheerio.load(data);
        const text = $('div.title').text();
        const html = $.html();
        console.log(text);
        console.log('\n' + html);
    });
});


