/**
 * @file cheerio apply
 * @author timrchen
 */

const http = require('http');
const cheerio = require('cheerio');


// 问题？如何将爬虫与本地服务器提供html进行挂载？
http.get('http://localhost:3000/', res => {
    let data = '';
    res.on('data', chunk => {
        data += chunk;
<<<<<<< HEAD
        console.log(data);
    });
    res.on('end', () => {
        try {
            let $ = cheerio.load('<div class="title">123</div>');
            $('div.title').text('hello cheerio!');
            $('div').addClass('welcome');
            $.html();
        } catch (e) {
            console.log(e);
        }
=======
    });
    res.on('end', () => {
        let $ = cheerio.load('<div class="title">123</div>');

        $('div.title').text('hello cheerio!');
        $('div').addClass('welcome');

        $.html();
>>>>>>> a7b217eb598e088b67d29836b5d1aba7bb2942b8
    });
});


