/*
* 万例挑一：导师列表--战队详情页
* 作者：ZHD
* Time:2019.04.24
* */
$(function () {
    var team={
        //根据参数获取到对应的数据
        param:{
            leve:comm.getpara().leve,//json数据位置
            areaLeve:comm.getpara().areaLeve,//医生id
            docLeve:comm.getpara().docLeve,//战队id
            activitId:comm.getpara().activityId,//活动id
        },
        init:function () {
            var t = this;
            t.getBaseInfo();
        },
        //获取基本信息
        getBaseInfo(){
            var t = this;
            $.ajax({
                url: '/js/column/activityTemplate/doctorLists.json',
                type: "get",//请求方式为get
                dataType: "json", //返回数据格式为json
                success: function (data) {
                    if (data && data.doctorList) {
                        if(data.doctorList[t.param.leve] && data.doctorList[t.param.leve].areaList && data.doctorList[t.param.leve].areaList.dataList && data.doctorList[t.param.leve].areaList.dataList[t.param.areaLeve] && data.doctorList[t.param.leve].areaList.dataList[t.param.areaLeve].docDataList[t.param.docLeve]){
                            var dataList = data.doctorList[t.param.leve].areaList.dataList[t.param.areaLeve].docDataList[t.param.docLeve];
                            $('.ev-actDocDesc .act_name').text(dataList.doctorName);
                            $('.doctorName').text(dataList.doctorName);
                            $('.ev-actDocDesc .act_auth').text(dataList.medicalTitleShow);
                            $('.ev-actDocDesc .act_hospital').text(dataList.hospitalName);
                            $('.ev-actTeamDesc .act_declaration').text(dataList.teamDeclaration);
                            $('.act_docImg').attr('src',dataList.teamBgImg);
                            setTimeout(function () {
                                t.convert2canvas();//当数据填充完毕后生成图片
                            },1500);
                            t.snsShare();
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('失败')
                }
            })
        },
        //微信/空间/微博分享功能
        snsShare: function () {
            var t = this;
            var shareObj = {},
            params = {
                paramJson: $.toJSON({
                    sceneType:97,
                    customerId:TempCache.getItem('userId')?TempCache.getItem('userId'):undefined,
                    teacherName:$('.doctorName').text(),
                    leve:t.param.leve,
                    areaLeve:t.param.areaLeve,
                    docLeve:t.param.docLeve,
                    visitSiteId:2,
                })
            }
            var callback = function (data) {
                if(comm.hasResponseData(data)){
                    var sList = data.responseObject.responseData.data_list[0].share_channel;
                    shareObj = {
                        title: '',
                        summary: '',
                        sinaTitle: '',
                        wxTitle: '',
                        wxDesc: '',
                    };
                    shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                    shareObj.url = data.responseObject.responseData.data_list[0].share_comm.shareUrl;
                    $(sList).each(function (index, element) {
                        if (element.shareChannel === 'QZone') {//QQ空间
                            shareObj.title = element.shareTitle;
                            shareObj.summary = element.shareDesc;
                        }
                        if (element.shareChannel === 'QQFriend') {//QQ朋友
                            shareObj.title = element.shareTitle;
                            shareObj.summary = element.shareDesc;
                        }
                        if (element.shareChannel === 'WechatFriend') {//微信朋友
                            shareObj.title = element.shareTitle;
                            shareObj.summary = element.shareDesc;
                        }
                        if (element.shareChannel === 'WechatTimeline') {//微信朋友圈
                            shareObj.wxTitle = element.shareTitle;
                        }
                        if (element.shareChannel === 'Sina') {//微博
                            shareObj.sinaTitle = element.shareDesc;
                            shareObj.sinaContent = element.shareDesc;
                        }
                        if(element.shareChannel === 'SMS'){//短信
                            shareObj.SMSTitle = element.shareTitle;
                            shareObj.SMSContent = element.shareDesc;
                        }
                        if(element.shareChannel === 'Email'){//邮件
                            shareObj.EmailTitle = element.shareTitle;
                            shareObj.EmailContent = element.shareDesc;
                        }
                    });
                    t.shareFunc(shareObj);
                }else{
                    popup('分享信息获取失败，请重试！')
                }
            };
            comm.ajax.async('/mcall/comm/data/share/getMapList3/', params, callback);
        },
        //shareAll分享函数
        shareFunc: function (shareData) {
            $('.Ev-ShareBtn').on("click", function () {
                appjs.share($.toJSON({
                        "url": shareData.url.replace("/activity_appTeamDesc", "/activity_teamDesc"),
                        "imgUrl": shareData.pic,
                        "sinaContent": shareData.sinaContent,//新浪简介
                        "qqTitle": shareData.title, //qq，qq空间，微信朋友title,
                        "qqContent": shareData.summary,//qq，qq空间，微信朋友简介
                        "wxTitle": shareData.wxTitle, //微信朋友圈title,
                        "messageContent": shareData.SMSContent,//短信
                        "emailTitle": shareData.EmailTitle, //qq微信title,
                        "emailContent": shareData.emailContent //邮箱
                    })
                );
            });
        },
        convert2canvas() {
            var t = this;
            window.scrollTo(0,0);
            var cntElem = $('#canvasCont')[0];
            var shareContent = cntElem;//需要截图的包裹的（原生的）DOM 对象
            var width = shareContent.offsetWidth; //获取dom 宽度
            var height = shareContent.offsetHeight; //获取dom 高度
            var canvas = document.createElement("canvas"); //创建一个canvas节点
            var scale = 2; //定义任意放大倍数 支持小数
            canvas.width = width * scale; //定义canvas 宽度 * 缩放
            canvas.height = height * scale; //定义canvas高度 *缩放
            canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
            var opts = {
                scale: scale, // 添加的scale 参数
                canvas: canvas, //自定义 canvas
                // logging: true, //日志开关，便于查看html2canvas的内部执行流程
                width: width, //dom 原始宽度
                height: height,
                useCORS: true // 【重要】开启跨域配置
            };

            html2canvas(shareContent, opts).then(function (canvas) {

                var context = canvas.getContext('2d');
                // 【重要】关闭抗锯齿
                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;

                // 【重要】默认转化的格式为png,也可设置为其他格式
                var img = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height);
                //加入延迟，用来防止图片加载时闪动
                setTimeout(function () {
                    $("#canvasImgCont").append(img);
                    //如果已经生成了图片则将dom结构进行隐藏
                    if($('#canvasImgCont img').length>0){
                        $('#canvasCont').hide();
                    }
                    $(img).css({
                        "width": canvas.width / scale + "px",
                        "height": canvas.height / scale+ "px",
                    });
                    t.saveBtn();//保存图片
                },500);
            });
        },
        saveBtn(){
            $('.appBot').on('click',function () {
                appjs.saveImage($('#canvasImgCont img').attr('src'));
            })
        }
    };
    team.init();
});