# Data-grabbing
    Data grabbing. study by https://github.com/cheeriojs/cheerio.

### 如何开始
    git clone https://github.com/TimRChen/Data-grabbing.git
    npm install
    node lib/grab.js 或者 npm start

### 遇到的问题
    imgList.forEach报错: imgList.forEach is not a function(分析错误，最后发现为传参错误)
    forEach发生报错有两种可能: 1. 调用forEach的参数为undefined 2. 调用forEach的参数类型为对象或其他非数组类型