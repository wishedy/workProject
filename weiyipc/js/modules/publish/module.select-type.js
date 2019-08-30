/**
 * 功能描述：  pk活动期间发布按钮点击选择普通上传和参与活动上传
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/11/12.
 */
module.selectType=function(obj){
    controller= {
        config: {
            imgPath: "//modules.allinmd.cn/publish/"
        },
        el: {},
        path: {
            getActivity:PC_CALL+"cms/activity/getActivityList/",
            getActivityStatus:PC_CALL + "activity/event/isSignUpOver/"
        },
        template:{
            videoTem:function(option){
                var html="";
                html+='<div class="doc_tc al_publishCon select_tc" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                '<div class="doc_tc_content">'+
                '<div class="doc_tc_bg"></div>'+
                '<div class="dh_xz">请选择你想... </div>'+
                '<div class="dh_middle">'+
                '<div class="video_xuanba">参与视频选拔 </div>'+
                '<div class="shangchuan">普通上传</div>'+
                '<div class="clear"></div>'+
                '</div>'+
                '<div class="bufabu no_p_u">暂不发布</div>'+
                '</div>'+
                '</div>';

                return html;
            },
            caseTem:function(option){
                var html="";
                html+='<div class="doc_tc select_tc" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                '<div class="doc_tc_content">'+
                '<div class="doc_tc_bg"></div>'+
                '<div class="dh_xz">请选择你想...</div>'+
                '<div class="dh_middle">'+
                '<div class="bingli_xuanba">参与病例选拔</div>'+
                '<div class="shangchuan">普通上传</div>'+
                '<div class="clear"></div>'+
                '</div>'+
                '<div class="bufabu no_p_u">暂不发布</div>'+
                '</div>'+
                '</div>';

                return html;
            }
        },
        init:function(obj){
            var t=this;
            this.options={};
            var o={
                container:$("body")
            };
            this.options= $.extend(o,obj);
            if (!t.options.top) {
                var tTop = $(document).scrollTop();
                t.options.top = tTop +(tTop!=0?50:80);
                t.options.left = ($(window).width() - 713) / 2;
            }
            t.getActivity();
        },
        //获取活动信息
        getActivity:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.getActivity,
                data : {paramJson: $.toJSON({activityType:1})},
                dataType : "json",
                success : function(rep){
                    if(rep.responseObject.responseData&&rep.responseObject.responseData.list&&rep.responseObject.responseData.list.length>0){
                        t.activityId=rep.responseObject.responseData.list[0].activityId.toString();
                    }
                    if(t.activityId){//未结束有活动id
                        if(t.options.activityStatus){
                            t.activityStatus=t.options.activityStatus;
                            t.create();
                        }else{
                            t.getActivityStatus();
                        }
                    }else{//已结束没有活动id
                        t.activityStatus=-1;
                        t.create();
                    }
                },
                error:function(){}
            });
        },
        //获取活动状态
        getActivityStatus:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.getActivityStatus,
                data : {paramJson: $.toJSON({activityId: t.activityId})},
                dataType : "json",
                success : function(rep){
                    if(rep.responseObject.responseData&&rep.responseObject.responseData){
                        t.activityStatus=rep.responseObject.responseData.expireStatus;
                        t.create();
                    }
                },
                error:function(){}
            });
        },
        create:function(){
            var t=this;
            if(t.activityStatus==-1){//活动截止
                if (!t.options.top) {
                    var tTop = $(document).scrollTop();
                    t.options.top = tTop +(tTop!=0?50:80);
                    t.options.left = ($(window).width() - 713) / 2;
                }
                module.videoUpload({
                    videoBtn:t.options.uploadBtn,//创建点击btn
                    container: t.options.container,//存放弹层的外层
                    top: t.options.top,//弹层top值
                    left: t.options.left,
                    userImg:t.options.userImg,//是否有用户头像
                    needAuth:1,
                    callback:function(){
                        $(".select_tc").remove();
                    },
                    publishBack:t.options.publishBack?function(){
                        t.options.publishBack();
                    }:null
                });
                //if(t.options.type=="case"){
                //    module.caseUpload({
                //        caseBtn: t.options.uploadBtn,//创建点击btn
                //        container: t.options.container,//存放弹层的外层
                //        top: t.options.top,//弹层top值
                //        left: t.options.left,
                //        userImg:t.options.userImg,//是否有用户头像
                //        needAuth:1,
                //        callback:function(){
                //            $(".select_tc").remove();
                //        },
                //        publishBack:t.options.publishBack?function(){
                //            t.options.publishBack();
                //        }:null
                //    });
                //}else{}
            }else {
                this.options.uploadBtn.off("click").on("click", function () {
                    if (!t.options.top) {
                       var dTop = $(document).scrollTop();
                        t.options.top = dTop + dTop!=0?50:80;
                        t.options.left = ($(window).width() - 713) / 2;
                    }
                    user.login({
                        callback: function () {
                            if ($(".select_tc").length > 0) {
                                $(".select_tc").remove();
                            }
                            t.options.container.css("position", "relative");
                            comm.LightBox.show(95, "#3c3c3d");
                            comm.LightBox.setZIndex(8);
                            if (t.options.type == "case") {
                                t.options.container.append(t.template.caseTem({
                                    top: t.options.top,
                                    left: t.options.left,
                                    userImg: t.options.userImg,
                                    imgPath: t.config.imgPath
                                }));
                                t.caseAction();
                            } else {
                                t.options.container.append(t.template.videoTem({
                                    top: t.options.top,
                                    left: t.options.left,
                                    userImg: t.options.userImg,
                                    imgPath: t.config.imgPath
                                }));
                                t.videoAction();
                            }
                            t.mouseAction();
                            //不发布
                            $(".no_p_u").on("click", function () {
                                comm.LightBox.hide();
                                $(".select_tc").remove();
                            })
                        },
	                    scene:privilegeSceneConst.eSceneTypePublic
                    })
                })
            }
        },
        mouseAction:function(){
            $(".video_xuanba").on("mouseover",function(){
                $(this).addClass("video_xuanba_hover");
            });
            $(".video_xuanba").on("mouseout",function(){
                $(this).removeClass("video_xuanba_hover");
            });
            $(".shangchuan").on("mouseover",function(){
                $(this).addClass("shangchuan_hover");
            });
            $(".shangchuan").on("mouseout",function(){
                $(this).removeClass("shangchuan_hover");
            });
            $(".bingli_xuanba").on("mouseover",function(){
                $(this).addClass("bingli_hover");
            });
            $(".bingli_xuanba").on("mouseout",function(){
                $(this).removeClass("bingli_hover");
            });
        },
        caseAction:function(){
            var t=this;
            //
            module.caseUpload({
                caseBtn:$(".shangchuan"),//创建点击btn
                container: t.options.container,//存放弹层的外层
                top: t.options.top,//弹层top值
                left: t.options.left,
                userImg:t.options.userImg,//是否有用户头像
                callback:function(){
                    $(".select_tc").remove();
                },
                publishBack:t.options.publishBack?function(){
                    t.options.publishBack();
                }:null
            });
            //参赛选拔
            module.videoCasePk({
                enrollBtn:$(".bingli_xuanba"),
                container: t.options.container,//存放弹层的外层
                top: t.options.top,//弹层top值
                left: t.options.left,
                userImg:t.options.userImg,//是否有用户头像
                type: "case",
                activityId: t.activityId,
                callback:function(){
                    $(".select_tc").hide();
                },
                publishBack:t.options.publishBack?function(){
                    t.options.publishBack();
                }:null
            });
        },

        videoAction:function(){
            var t=this;
            //
            module.videoUpload({
                videoBtn:$(".shangchuan"),//创建点击btn
                container: t.options.container,//存放弹层的外层
                top: t.options.top,//弹层top值
                left: t.options.left,
                userImg:t.options.userImg,//是否有用户头像
                callback:function(){
                    $(".select_tc").remove();
                },
                indexLogin:t.options.indexLogin&&t.options.indexLogin(),
                publishBack:t.options.publishBack?function(){
                    t.options.publishBack();
                }:null
            });
            //参赛选拔
            module.videoCasePk2({
                enrollBtn:$(".video_xuanba"),
                container: t.options.container,//存放弹层的外层
                top: t.options.top,//弹层top值
                left: t.options.left,
                userImg:t.options.userImg,//是否有用户头像
                type: "video",
                activityId: t.activityId,
                callback:function(){
                    $(".select_tc").hide();
                },
                indexLogin:t.options.indexLogin&&t.options.indexLogin(),
                publishBack:t.options.publishBack?function(){
                    t.options.publishBack();
                }:null
            });
        }

    };
    controller.init(obj);
};
