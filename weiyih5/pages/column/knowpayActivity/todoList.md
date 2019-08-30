

### UI部分
* 用户默认头像需要切图
* “点赞排行榜”进度条需要切图
* “点赞排行榜”白色点赞按钮
* “我要评论”图标
* 底部的点缀图少一个
* 发布评论的页面需要关闭吗？



### 接口部分
* 建议
    * 接口需要注意是否要更新动态服务
    * 点赞排行榜的数据需要预填充
    

* getDiscussTotal 获取参与讨论的总人数
* getFavoriteRankData 获取点赞排行榜数据（3条）
    * 用户头像地址，userIconUrl
    * 用户姓名（如没有则为手机号隐藏中间4位），userName
    * 被点赞数量，favoriteTotal
    ```
         [
             {
                   favoriteTotal:355,
                   userIconUrl:"./images/test-icon.png",
                   userName:"我是用户1",
               }
           ]
    ```
* getFeaturedDiscussData 获取用户评论-精选评论 （最多6条）
    * 用户id ，curstomerId
    * 评论id ，discussId
    * 被点赞数量，favoriteTotal
    * 用户评论内容，userDiscussContent
    * 用户头像url ，userIconUrl
    * 用户姓名，userName
    ```
             [
                {
                   curstomerId:0,
                   discussId:"1554628457689-0",
                   favoriteTotal:55,
                   userDiscussContent:"今天下午，姥姥让搬家回旧家，因为我要上学。我的姥姥有两个家，一个是旧家，一个是新家。我们把冰箱里的东西搬了搬，把有用的东西也搬了搬。因为东西太多了，爸爸开车跑了两趟，先把老人和冰箱里的东西带走。最后把我和剩下的东西带走。旧家太小了，我还是喜欢在新家。",
                   userIconUrl:"./images/test-icon.png",
                   userName:"我是精选用户1"
                }
               ]
    ```
* getRecentDiscussData 获取用户评论-最新评论 （格式同 getFeaturedDiscussData）（额外需要注意，分页加载）

### 其他建议

* 用户评论部分，可以把“点赞，拿豪礼”改为“邀请点赞，拿豪礼”



##### 2019.04.07

* 已完成：整体页面的UI + 交互 （80%）
* 待完成：
    * 点赞 +1 交互
    * UI调整/补全
    * 线下 APP 开屏链接跳转是否可以获取到用户信息，是否能够调用 APP 内部分享
    * 分享话术对接
    * 埋点
    * 接口联调
 * 建议：
    * 4.8 号可以在我的测试环境中先看下当前效果，主要针对 UI 同事和运营同事
    * UI 部分可进入验收阶段
    * 固定文案部分可以进行校对


##### 2019.04.08

* 已完成：
    * 第一次UI调整/补全
* 待完成：
    * 点赞 +1 交互
    * UI调整/补全
    * 线下 APP 开屏链接跳转是否可以获取到用户信息，是否能够调用 APP 内部分享
    * 分享话术对接
    * 埋点
    * 接口联调
* 建议：
    * 4.9 号可以进行UI调整
    * 文案相关尽快确定（尤其是还有一个发布完成后的分享话术，影响到 UI同事 出弹窗设计稿）
    

##### 2019.04.09

* 已完成：
    * 点赞+1交互
    * 第二次UI调整/补全/交互，比较细微的调整已完成（后续除了比较关键的设计/样式问题，不建议再做调整）
    * 线下APP 开屏链接跳转可以获取到已登录的用户信息，可以调用 APP 内部分享功能，
* 待完成：
    * UI补全
    * 分享话术对接
    * 埋点
    * 接口联调
* 建议：
    * 文案相关尽快确定（尤其是还有一个发布完成后的分享话术，影响到 UI同事 出弹窗设计稿）
    * 接口部分（梳理分享话术、埋点对接等相关功能）
    * UI部分，需要补一个在 APP 中的“分享”按钮


##### 2019.04.10

* 已完成：
    * 第三次UI调整/补全/交互（文案调整，活动结束弹窗，发布完成分享引导弹窗）
    * 接口定义
    * 分享话术
* 待完成：
    * 接口联调
    * 埋点
    


##### 2019.04.11
* 接口：
    * 点赞排行榜，只有应该传 3 条数据,而且顺序也有问题，应该是倒序
    * 点赞后数据没有入库
    * 发布评论后没有入库
    * 精选评论（有多少返多少、评论内容）/最新评论翻页（总页数、评论内容）



//参与讨论总数
http://m.allinmd.cn/mcall/single/activity/getTotalCount?queryJson=%7b%22activityId%22%3a1%7d
//发布评论
http://127.0.0.1:8099/activity/insert/customer/review?queryJson=%7b%22mobile%22%3a17600289045%2c%22customerId%22%3a1554887385850%2c%22reviewContent%22%3a%22%e5%8f%91%e5%b8%83%e8%af%84%e8%ae%ba%e4%ba%86%22%2c%22activityId%22%3a1%7d
http://m.allinmd.cn/mcall/single/activity/insertCustomerReview?queryJson=%7b%22mobile%22%3a17600289045%2c%22customerId%22%3a1554887385850%2c%22reviewContent%22%3a%22%e5%8f%91%e5%b8%83%e8%af%84%e8%ae%ba%e4%ba%86%22%2c%22activityId%22%3a1%7d

//点赞总数排行
upNum=1  降序排序，取3条

http://127.0.0.1:8099/activity/getBranchList?queryJson=%7b%22firstResult%22%3a0%2c%22maxResult%22%3a3%2c%22upNum%22%3a1%2c%22activityId%22%3a1%7d
http://m.allinmd.cn/mcall/single/activity/getBranchList?queryJson=%7b%22firstResult%22%3a0%2c%22maxResult%22%3a3%2c%22upNum%22%3a1%2c%22activityId%22%3a1%7d


//精选留言
http://127.0.0.1:8099/activity/getBranchList?queryJson=%7b%22firstResult%22%3a0%2c%22maxResult%22%3a2%2c%22reviewStatus%22%3a1%2c%22activityId%22%3a1%7d
http://m.allinmd.cn/mcall/single/activity/getBranchList?queryJson=%7b%22firstResult%22%3a0%2c%22maxResult%22%3a2%2c%22reviewStatus%22%3a1%2c%22activityId%22%3a1%7d



//最新留言
http://127.0.0.1:8099/activity/getBranchList?queryJson=%7b%22firstResult%22%3a0%2c%22maxResult%22%3a10%2c%22sortType%22%3a3%2c%22activityId%22%3a1%7d
http://m.allinmd.cn/mcall/single/activity/getBranchList?queryJson=%7b%22firstResult%22%3a0%2c%22maxResult%22%3a10%2c%22sortType%22%3a3%2c%22activityId%22%3a1%7d


//插入点赞
http://127.0.0.1:8099/activity/insert/customer/prefer?queryJson=%7b%22customerId%22%3a%22%22%2c%22refMobile%22%3a%221760000%22%2c%22refId%22%3a4%2c%22refCustomerId%22%3a%220%22%2c%22activityId%22%3a1%7d
http://m.allinmd.cn/mcall/single/activity/insertCustomerPrefer?queryJson=%7b%22customerId%22%3a%22%22%2c%22refMobile%22%3a%221760000%22%2c%22refId%22%3a4%2c%22refCustomerId%22%3a%220%22%2c%22activityId%22%3a1%7d

//获取分享话述
http://127.0.0.1:8099/activity//getShareContent?queryJson=%7b%22shareChannel%22%3a1%7d

http://m.allinmd.cn/mcall/single/activity/getShareContent?queryJson=%7b%22shareChannel%22%3a1%7d
