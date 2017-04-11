# Data-grabbing
    Data grabbing. study by https://github.com/cheeriojs/cheerio.

### 如何开始
    git clone https://github.com/TimRChen/Data-grabbing.git
    npm install
    node app 或者 npm start

### 遇到的问题
*   imgList.forEach报错: imgList.forEach is not a function(分析错误，最后发现为传参错误)
*   forEach发生报错有两种可能: 1. 调用forEach的参数为undefined 2. 调用forEach的参数类型为对象或其他非数组类型

### 关于使用模板引擎pug
    目前，模板引擎jade已更名为pug，熟悉了一些语法后才写出来的。
    ps: 
        1.暂时没有渲染的css文件，待测试
        2.排版之类的设计，后续需要优化