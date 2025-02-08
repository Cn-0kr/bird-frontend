# 做什么？

一个前后端分离的小程序。

前端：基于umi框架，使用HbuilderX编译器

后端：java+mysql，使用idea



# 什么时候DDL？

3月末到四月初之间结题。

然而由于报名了大挑，其截止时间为3月2日，仅剩1个月左右，因此还需抓紧开发。



# 有什么功能？

帖子的创建、点赞、浏览

地图搜索鸟类

上传照片ai分析

用户信息改写

-----

鸟类搜索排行榜

新手引导



# 目前的进展？

前端：

重构完成

四个页面已经初步搭建完善

路由建设

后端：

数据库仍然还是一坨

堪堪开发完4个接口



# 我要干什么？

根据下面分配的任务完成单个页面的开发：

## PosterPage（余）

界面设计：



<img src="./SITPplan/image-20250121154252347.png" alt="image-20250121154252347" style="zoom:50%;" />

功能要求：

1.能够通过首页的简略帖子信息点击进入相应的PosterPage

2.评论和点赞功能 收藏功能不要



## NoobPage（贾）

功能要求：

一篇新手引导的文章 包括第一次观鸟需要注意什么 携带什么物品等等（可以自己写也可以约稿）

随后把文章放入页面中即可



## RankingPage（孙）

界面设计：

<img src="./SITPplan/image-20250121162114299.png" alt="image-20250121162114299" style="zoom:50%;" />

功能要求：

左侧排名 中间介绍鸟类名称 地区 习性 文字简介 最近搜索量 右侧放置该鸟的代表图片

搜索第一占最大版幅 版幅随着排名依次减少 第四名之后版幅相同

统计前10排名即可

数据自己编



## AnalyzeResultPage（孙）

界面设计：

<img src="./SITPplan/image-20250121162019906.png" alt="image-20250121162019906" style="zoom:50%;" />

功能要求：

左侧排名 中间介绍相似性/可能性 鸟类名称 地区  文字简介 右侧放置该鸟的代表图片

枚举前三种可能性即可

屏幕底部添加两个按钮，功能是重新识别和记录本次识别结果。样式请保持与UploadPage相同。（可封装成组件）



## UploadPage（胡）

将之前项目中的上传界面移植到本项目中并进行优化



## AnalyzeWaitingPage（胡）

等待界面，需要一张动态的进度条或圈型gif作为缓冲

具体界面形式自己设计



## MapPage（余）

完成对于当前用户位置的获取功能，使得定位能正常使用。

添加热力图与切换地图模式功能



## ProfilePage（贾）

新增功能：识别记录，点击后能够看见用户之前识别过的所有鸟类

需要至少编一组数据



## Debug与优化（必看）

修复导航栏处于active状态时图标显示不正确，高亮字体显示不正确的bug；（余）

优化ProfilePage个人介绍和成就勋章的ui设计，不太好看；（贾/胡）

优化UploadPage的ui；（胡）



# 怎么干？

AI。

但是不是gpt。经过我的尝试，claude和cursor的效果是最好的，生成代码后需要的调整最少。

https://claude.ai/new

claude的注册需要国外的手机号和信用卡。如果觉得麻烦懒得搞，可以下载cursor。

https://www.cursor.com/

建议直接开会员（



另外，请确保你有一些关于vue框架和前端三件套的基本知识。



# 如何提交我的代码？

本项目的前端仓库：

https://github.com/Cn-0kr/bird-frontend

pull request方法：

https://www.bilibili.com/video/BV1ei4y1s7pU/?spm_id_from=333.337.search-card.all.click&vd_source=86c6b09721e0893e43fc3b93d929a6c9



# 追加任务

https://0krblog.yqbirdmp.com/ 三件套教程（必看）

https://www.codefather.cn/course/1803988942522802177?contentType=text&tabKey=list vue教程（略读）

孙+贾：研究对大模型封装成sdk的实现方法。uts/javasdk/flask

余+胡：学习flask框架 （请记录笔记）



下次组会：

2月4号
