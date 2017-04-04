/**
 * @file http
 */

const http = require('http');

let server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<div class="title">123</div>');
});


server.listen(3000);

