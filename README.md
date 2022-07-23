# 简单新闻搜索引擎
2022web编程大作业

## 准备工作

安装依赖库：

* node.js
* vue
* elasticsearch

## 代码结构

```
|-- backend/
    |-- crawler/
        |-- crawlerUtil.js
        |-- newsChina.js
        |-- newsGuangming.js
        |-- newsXinhua.js
    |-- es/
        |-- config.js
        |-- init.js
        |-- query.js
    |-- server/
        |-- responseUtil.js
        |-- router.js
        |-- server.js
|-- frontend/
    |-- public/
    |-- src/
        |-- assets/
        |-- components/
        |-- pages/
        |-- router/
        |-- store/
        |-- App/vue
        |-- main.js
```

## 运行流程

1. 启动elasticsearch；
2. 在`backend/`目录下运行命令`npm install`；
3. 修改`crawler/crawlerUtil.js`中elasticsearch的相关配置；
4. 运行命令`node es/init.js`初始化elasticsearch的news索引；
5. 运行命令`node crawler/newsChina.js`、`node crawler/newsGuangming.js`、`node crawler/newsXinhua.js`启动爬虫爬取新闻；
6. 运行命令`node server/server.js`启动后端；
7. 在`frontend/`目录下运行命令`npm install`；
8. 运行命令`npm run serve`启动前端（开发环境），可以通过127.0.0.1:8081来访问前端页面。

## 项目开发流程及展示

知乎：https://zhuanlan.zhihu.com/p/545376739
