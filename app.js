/**
 * @file cheerio apply
 * @author timrchen
 */

'use strict'

const express = require('express');

const fs = require('fs');
const cheerio = require('cheerio');
const async = require('async');
const request = require('superagent');
require('superagent-charset')(request);

const Config = {
    startPage: 1,
    endPage: 1,
    downloadImg: true, // 是否下载图片至硬盘中，否则只保存json信息到文件
    downloadConcurrent: 10, // 下载图片最大并发数
    currentImgType: 'scy' // 当前程序要爬取得图片类型，取下面AllImgType的key
};

// pagetype info
const AllImgType = {
    ecy: "http://tu.hanhande.com/ecy/ecy_", // 总页码：50
    scy: "http://tu.hanhande.com/scy/scy_", // 总页码：64
    cos: "http://tu.hanhande.com/cos/cos_", // 总页码：20
};

// load url
let getHtmlAsync = url => {
    return new Promise((resolve, reject) => {
        request.get(url).charset('gbk').end((err, res) => {
            err ? reject(err) : resolve(cheerio.load(res.text));
        });
    });
}

// 获取所有图册URL
let getAlbumsAsync = () => {
    return new Promise((resolve, reject) => {
        console.log('Start get albums .....');
        let albums = [];
        let q = async.queue(async function (url, taskDone) {
            try {
                let $ = await getHtmlAsync(url);
                console.log(`download ${url} success`);
                $('.picList em a').each((index, element) => {
                    albums.push({
                        title: element.children[1].attribs.alt,
                        url: element.attribs.href,
                        imgSrc: element.children[1].attribs.src,
                        imgList: [],
                    });
                });
            } catch (e) {
                console.log(`Error: get Album list - download ${url} err: ${e}`);
            }
            finally {
                taskDone();
            }
        }, 10);
        /**
         * 监听：当所有任务都执行完后，将调用该函数
         */
        q.drain = function () {
            console.log('Get album list complete');
            resolve(albums);
        };

        let pageUrls = [];
        let imageTypeUrl = AllImgType[Config.currentImgType];
        for (let i = Config.startPage; i <= Config.endPage; i++) {
            pageUrls.push(imageTypeUrl + `${i}.shtml`);
        }
        q.push(pageUrls);
    });
};

// 获取图册里的所有图片URL
let getImageListAsync = albumsList => {
    return new Promise((resolve, reject) => {
        console.log('Start get album`s imgList....');
        let q = async.queue(async function ({url: albumUrl, title: albumTitle, imgList}, taskDone) {
            try {
                let $ = await getHtmlAsync(albumUrl);
                console.log(`get album ${albumTitle} image list done`);
                $('#picLists img').each((index, element) => {
                    imgList.push(element.attribs.src);
                });
            } catch (e) {
                console.log(`Error: get image list - download ${albumUrl} err: ${e}`);
            }
            finally {
                taskDone();
            }
        }, 10);
        /**
         * listen: call this function when all task done.
         */
        q.drain = function () {
            console.log('Get image list complete');
            resolve(albumsList);
        };
        q.push(albumsList);
    });
}

// 将图册信息保存为JSON
let writeJsonToFile = albumList => {
    let folder = `json-${Config.currentImgType}-${Config.startPage}-${Config.endPage}`;
    fs.mkdirSync(folder);
    let filePath = `./${folder}/${Config.currentImgType}-${Config.startPage}-${Config.endPage}.json`;
    fs.writeFileSync(filePath, JSON.stringify(albumList));

    let simpleAlbums = [];
    const slice = "http://www.hanhande.com/upload/".length;
    albumList.forEach(function ({title: albumTitle, url: albumUrl, imgList}) {
        let imgListTemp = [];
        imgList.forEach(url => {
            imgListTemp.push(url.slice(slice));
        });
        simpleAlbums.push({title: albumTitle, url: albumUrl, imgList: imgListTemp});
    });
    filePath = `./${folder}/${Config.currentImgType}-${Config.startPage}-${Config.endPage}.min.json`;
    fs.writeFileSync(filePath, JSON.stringify(simpleAlbums));
};

// download Image
let downloadImg = albumList => {
    console.log('Start download album`s image .....');
    const folder = `img-${Config.currentImgType}-${Config.startPage}-${Config.endPage}`;
    fs.mkdirSync(folder);
    let downloadCount = 0;
    let q = async.queue(async function ({title: albumTitle, url: imageUrl}, taskDone) {
        request.get(imageUrl).end((err, res) => {
            console.log('download...');
            if (err) {
                console.log(err);
                taskDone();
            } else {
                fs.writeFile(`./${folder}/${albumTitle}-${++downloadCount}.jpg`, res.body, err => {
                    err ? console.log(err) : console.log(`${albumTitle}保存一张`);
                    taskDone();
                });
            }
        });
    }, Config.downloadConcurrent);
    /**
     * listen: call this function when all task done.
     */
    q.drain = function () {
        console.log('All img download');
    };
    let imgListTemp = [];
    albumList.forEach(({title, imgList}) => {
        imgList.forEach(url => {
            imgListTemp.push({title: title, url: url});
        });
    });
    q.push(imgListTemp);
};

// 渲染模板配置
let options = {};

async function dataGrab() {
    let albums = await getAlbumsAsync();
    let albumList = await getImageListAsync(albums);
    // 自动下载图片    
    // writeJsonToFile(albumList);
    // if (Config.downloadImg) {
    //     downloadImg(albumList);
    // }

    options = {
        title: 'Albums',
        albums: albums,
    }; 
}

// 抓取数据
dataGrab();



// 服务器配置
let app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('show');
});

app.get('/open', (req, res) => {
    res.render('pic', {options});
});

app.listen(3000);

