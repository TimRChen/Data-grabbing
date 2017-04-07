/**
 * @file cheerio apply
 * @author timrchen
 */

const http = require('http');
const cheerio = require('cheerio');
const request = require('superagent');
const async = require('async');

// pagetype info
const AllImgType = {
    ecy: "http://tu.hanhande.com/ecy/ecy_",
    scy: "http://tu.hanhande.com/scy/scy_",
    cos: "http://tu.hanhande.com/cos/cos_",
};


// load url
let getHtmlAsync = url => {
    return new Promise((resolve, reject) => {
        request.get(url).charset('gbk').end((err, res) => {
            err ? reject(err) : resolve(cheerio.load(res.text));
        });
    });
}

// get Albums
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
                        imgList: []
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

let writeJsonToFile = albumList => {
    let folder = `json-${Config.currentImgType}-${Config.startPage}-${Config.endPage}`;
    fs.mkdirSync(folder);
}


