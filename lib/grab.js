/**
 * @file cheerio apply
 * @author timrchen
 */

const http = require('http');
const cheerio = require('cheerio');


// 问题？如何将爬虫与本地服务器提供html进行挂载？
http.get('http://localhost:3000/', res => {
    let $ = cheerio.load('<div class="title">123</div>');


    $('div.title').text('hello cheerio!');
    $('div').addClass('welcome');

    $.html();
    console.log(res);
});


