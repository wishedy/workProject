/**
 * 功能描述：  发布话题
 * 使用方法:   module.topicUpload({
                    topicBtn:$("#topic_upload"),//创建点击btn
                    container:$(".personal_content"),//存放弹层的外层
                    top:126,//弹层top值
                    userImg:"头像地址",//是否有用户头像
                    activityId:xxx,//活动ID 不传表示普通上传
                    property:{},//活动时选择的专业和术式
                    property_area:{},//新版活动赛区参数
                    publishBack:function(){}
                });
 * 注意事件：
 * 引入来源：引入第三方插件<script src="/js/third-party/uploadify/swfobject2.2.js"></script>
                         <script src="/js/third-party/uploadify/jquery.uploadify.js"></script>
                         <link href="/js/third-party/uploadify/uploadify.css" rel="stylesheet" type="text/css" >
            作用：多图片上传插件
 *
 * Created by LiChunHui on 2015/3/24.
 */
module.topicUpload=function(obj){
    controller= {
        config: {
            videoLen:1,//最大上传视频数
            imgLen:9,//最大上传照片数
            imgPath: "//modules.allinmd.cn/publish/",
            swf:"/js/third-party/uploadify/uploadify.swf",
            uploadImg:"//modules.allinmd.cn/publish/images/add_img_new.jpg",
            conUpload:"//modules.allinmd.cn/publish/images/add_img_small.jpg"
        },
        el: {},
        path: {
            getAreaExpertise: PC_CALL+"commdata/getAreaExpertise/",
            videoInfo: PC_CALL+"qiniu/storage/saveVideoInfo/",
            topicCreate:PC_CALL+"topic/baseinfo/create/",
            topicUpdate:PC_CALL+"topic/baseinfo/update/",
            topicAttList:PC_CALL+"topic/attachment/json_list/",
            topicAttCreate:PC_CALL+"topic/attachment/create/",
            topicAttDelete:PC_CALL+"topic/attachment/delete/"
        },
        template:{
            topicTem:function(option){
                var html="";
                html+='<div class="doc_tc al_publishCon" id="topic" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                '<!-- 发布遮罩 -->'+
                '<div class="publish_mask">'+
                '<img src="//modules.allinmd.cn/publish/images/loading6060.gif" />'+
                '</div>'+
                '<!-- 点击取消遮罩 -->'+
                '<div class="cancel_mask"></div>'+
                '<div class="upload_end">'+
                '<div class="upload_question">接下来你想....</div>'+
                '<div class="bjfb_but">'+
                '<div><a href="javascript:;"><img class="continue_edit" src="//modules.allinmd.cn/publish/images/go_bj.png" /></a></div>'+
                '<div style="margin-left:25px;"><a href="javascript:;"><img class="cancel_pub" src="//modules.allinmd.cn/publish/images/qx_fb.png" /></a></div>'+
                '</div>'+
                '</div>'+
                (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                '<div class="fb_doc">'+
                '<div class="doc_tc_bg"></div>'+
                '<div class="upload_center">'+
                '<div class="radio_upload_topic font_yahei">'+
                '<div class="publish_topic_lx">类型</div>'+
                '<div class="publish_topic_radio">'+
                '<input type="radio" name="topicType" value="1">随便聊聊</div>'+
                '<div class="publish_topic_radio">'+
                '<input type="radio" name="topicType" value="2">专业话题 </div>'+
                '</div>'+
                '<div class="upload_title">'+
                '<div class="found_case_small">'+
                '<div class="default_name font_yahei" style="display:none">标题</div>'+
                '<div class="input_write01">'+
                '<input type="text" id="topic_name" placeholder="标题" class="font_yahei" max="25">'+
                '</div>'+
                '<div class="djs_num toc_num">25</div>'+
                '</div>'+
                '</div>'+
                /*'<div class="xuezu_x" style="border-top:none;">'+
                '<div class="found_case_big">'+
                '<div class="default_name font_yahei" id="areaTitle1" style="display:block; top:26px">标签</div>'+
                '<div class="input_write">'+
                '<ul class="tc_tab_list" id="areaSel1"></ul>'+//选中专业存放
                '<div class="clear"></div>'+
                '</div>'+
                '</div>'+
                '<div class="clear"></div>'+
                '<div class="publish_zy_position">'+
                '<ul id="areaExp1"></ul>'+//专业数据
                '</div>'+
                '</div>'+*/
                '<div class="clear"></div>'+
                '<div class="upload_textarea_topic">'+
                '<div class="default_name font_yahei">文字讨论</div>'+
                '<div class="textarea_write">'+
                '<textarea placeholder="文字讨论" id="topic_discuss" class="font_yahei" max="1000" style="top: 14px"></textarea>'+
                '</div>'+
                '<div class="ds_text tocd_num">1000</div>'+
                '</div>'+
                '<div class="clear"></div>'+
                '</div>'+
                '<div class="add_img add_sWidth"><div class="add_content">请上传该话题的相关照片，jpg或png，单张不超过5M，最多9张</div><input type="file" name="uploadifyToc" id="uploadifyToc"></div>'+
                '<div class="add_video add_sWidth">' +
                '<a href="javascript:;" class="add_video_a" id="add_video_container">' +
                '<span class="add_content" style="z-index: 0;">请上传该话题的相关视频，</br>视频大小不超过80M，最多1个</span>' +
                '<input class="add_video_input" type="file" name="file" id="Ev_uploadVideo">' +
                '</a>' +
                '</div>'+
                '<div class="clear"></div>'+
                '<div class="add_img_fangda">'+
                '<ul id="topic_img_queue">'+

                '</ul>'+
                '<div class="add_img_a">'+
                '<a href="javascript:;">jpg或png，单张不超过10M还能上传<span class="is_num"></span>张</a>'+
                '<input type="file" name="uploadifyTop_con" id="uploadifyTop_con">'+
                '</div>'+
                '<div class="add_video_con">'+
                '<a href="javascript:;" id="add_video_container1">'+
                '<span class="add_video_cTex" href="javascript:;">请上传该话题的相关视频，</br>视频大小不超过80M，最多<span class="is_videoNum"></span>个</span>'+
                '<input type="file" name="uploadify_vcon" id="uploadify_vcon">'+
                '</a>'+
                '</div>'+
                '<div class="clear"></div>'+
                '</div>'+
                /*'<div class="found_case_big write_topic_cont">'+
                '<div class="default_name_new font_yahei" >标签（多个用逗号或者回车分隔）</div>'+
                '<div class="input_write">'+
                '<ul class="tc_tab_list" style="float:none">'+

                '</ul>'+
                '<input type="text" id="tag_input" placeholder="标签（多个用逗号或者回车分隔）" class="mr_input font_yahei">'+
                '<div class="clear"></div>'+
                '</div>'+
                '</div>'+*/
                '<div class="tx_who" id="upload_remind" style="margin-top:20px">'+
                '<div class="found_case_big font_yahei">'+
                '<div class="default_name" >提醒谁看</div>'+
                '<div class="remind_par"><div class="topic_tx_who remind_name">'+
                '</div>'+
                '<input type="text" placeholder="提醒谁看" class="remind_input font_yahei">' +
                '<div class="clear"></div>'+
                '</div>'+
                '<div class="clear"></div>'+
                '<div class="at_personal_name Ev_reCon" style="top:62px;">'+
                '<ul class="remind_list"></ul>'+
                '</div>'+
                '<div class="djs_num"><span class="remind_num">0</span>/10</div>'+
                '</div>'+
                '</div>'+
                '<div class="t_but">'+
                '<div class="publish_t_fb can_fb" id="topic_save">发布</div>'+
                '<div class="publish_t_qx" id="topic_cancel">取消</div>'+
                '</div>'+
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

            this.options.topicBtn.attr("on",true);
            this.uploadImgStatus=true;//上传图片的状态
            this.create();

        },
        create:function(){
            var t=this;
            if(t.options.oneUpload){//TODO:针对活动只有一个资源发布时先清除click事件
                t.options.topicBtn.off("click");
            }
            this.options.topicBtn.on("click",function(){
                //if (!t.options.top) {
                    var tTop = $(document).scrollTop();
                    t.options.top = tTop +(tTop!=0?50:80);
                    t.options.left = ($(window).width() - 713) / 2;
                //}
                var $this=$(this);
                if($(this).attr("on")=="true"){
                    $(this).attr("on",false);
                    user.login({
                        callback:function(){
                            //t.options.indexLogin&& t.options.indexLogin();
                            t.imgLen=0;
                            t.videoLen=0;
                            t.topicId="";
                            $.ajax({
                                url: t.path.topicCreate,
                                type: "post",
                                dataType:"json",
                                success: function (data) {
                                    $this.attr("on",true);
                                    if(data.responseObject.responseStatus){

                                        t.topicId=data.responseObject.responsePk;
                                        t.options.container.css("position","relative");
                                        comm.LightBox.show(95,"#3c3c3d");
                                        comm.LightBox.setZIndex(8);
                                        t.options.container.append(t.template.topicTem({
                                            top:t.options.top,
                                            left: t.options.left,
                                            userImg:t.options.userImg,
                                            imgPath:t.config.imgPath
                                        }));
                                        $("#topic").find("input[placeholder], textarea[placeholder]").placeholder();	// 表单默认值 插件
                                        //t.getXuezu();
                                        comm.textChange({"$tex":$("#topic_name"),"$num":$(".toc_num")});
                                        comm.textChange({"$tex":$("#topic_discuss"),"$num":$(".tocd_num"),"minTop":14});
                                        $("#upload_remind").on("click",function(){
                                            $(".remind_input").focus();
                                        });
                                        $("#upload_remind").replyRemind({
                                            upload:1,
                                            callback:function(){
                                                t.customerIds="";
                                                $(".remind_name span","#upload_remind").each(function(i,em){
                                                    t.customerIds+=$(em).attr("customerid")+",";
                                                });
                                            }  //回调函数
                                        });

                                        t.uploadImg();
                                        t.uploadVideo("#Ev_uploadVideo");
                                        t.uploadVideo("#uploadify_vcon");
                                        //t.tagInput();
                                        //t.bindImgClick();
                                        t.publishCancel();
                                        t.publish();
                                    }else{
                                        $.topTip({mark:"warn",content:"未创建成功，请稍后再试！"});
                                    }
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown){
                                    $.topTip({mark:"warn",content:"未创建成功，请稍后再试！"});
                                }
                            });

                        },
                        onClose:function(){
                            $this.attr("on",true);
                            t.options.indexLogin&& t.options.indexLogin();
                        },
                        onAuthCancel:function(){
                            $this.attr("on",true);
                            t.options.indexLogin&& t.options.indexLogin();
                        },
                        scene:privilegeSceneConst.eSceneTypePublic
                    })
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"发布",
                    keyword:"发布话题",
                    actionId: 35
                });
                return false;
            })

        },
        //上传图片处理插件
        uploadImg:function(){
            var t=this;
            $("#uploadifyToc").uploadify({
                'swf'             : t.config.swf,//uploadify.swf文件的路径。
                'uploader'        : t.path.topicAttCreate,
                'formData'        : {'topicId':t.topicId},
                'auto'            : true,
                'width'           : 308,
                'height'          : 141,
                'buttonImage'     : t.config.uploadImg,
                'fileObjName'     : 'uploadify',
                'fileTypeExts'    : '*.jpg;*.png;*.jpeg',//上传文件类型
                'fileTypeDesc'    : 'Web Image Files (.JPG, .PNG, .JPEG)',
                'fileSizeLimit'   : 5120*2,//单个文件允许大小
                'uploadLimit'     : t.config.imgLen,//允许你设置同时上传文件的最大数量。
                'removeTimeout'   : 0.5,
                //'removeCompleted' : false,//自动移除队列中已经完成上传的项目设置
                'onSelect':function(){//每选择一个文件触发
                    t.uploadImgStatus=false;//上传图片的状态：正在上传中
                },
                'onQueueComplete' :function(){
                    t.uploadImgStatus=true;//上传图片的状态：上传完成
                    $("#uploadifyToc").animate({opacity:0,height:0},200,function(){
                        $(".add_img").hide();
                        $("#uploadifyToc").hide();
                        $("#uploadifyToc").css({height:141,opacity:1});
                    });
                    t.getImgList();
                    //t.conUpload();
                },
                'onFallback'     :function(){//针对safari没有flash安全权限时触发
                    $("#uploadifyToc").hide();
                    $(".add_content").eq(0).html('您还没有安装flash播放器，请点击<br><a href="//www.adobe.com/go/getflash" target="_blank" style="color:red">这里</a>安装');
                }
            });
        },
        //继续上传
        conUpload:function(){
            var t=this;
            var maxNum=this.config.imgLen-this.imgLen;
            $(".is_num").text(maxNum);
            $("#uploadifyTop_con").uploadify({
                'swf'             : t.config.swf,//uploadify.swf文件的路径。
                'uploader'        : t.path.topicAttCreate,
                'formData'        : {"topicId":t.topicId},
                'auto'            : true,
                'width'           : 200,
                'height'          : 200,
                'buttonImage'     : t.config.conUpload,
                'fileObjName'     : 'uploadify',
                'fileTypeExts'    : '*.jpg;*.png;*.jpeg',//上传文件类型
                'fileTypeDesc'    : 'Web Image Files (.JPG, .PNG, .JPEG)',
                'fileSizeLimit'   : 5120*2,//单个文件允许大小
                'uploadLimit'     : maxNum,//允许你设置同时上传文件的最大数量。
                'removeTimeout'   : 0.5,
                //'removeCompleted' : false,//自动移除队列中已经完成上传的项目设置
                'onSelect':function(){//每选择一个文件触发
                    t.uploadImgStatus=false;//上传图片的状态：正在上传中
                },
                'onQueueComplete' :function(){
                    t.uploadImgStatus=true;//上传图片的状态：上传完成
                    t.getImgList();
                },
                'onFallback'     :function(){//针对safari没有flash安全权限时触发
                    $("#uploadifyTop_con").hide();
                    $(".add_img_a a").html('您还没有安装flash播放器，请点击<a href="//www.adobe.com/go/getflash" target="_blank" style="color:red;position:static">这里</a>安装');
                }

            });
        },
        //扇形进度条
        progress:function(num){
            var outer=$(".outer");
            var pie=$(".pie");

            if(num>=50){
                outer.addClass("outer2");
                pi="rotate("+((num-50)*(180/50)-180)+"deg)";
                outer.css({transform:pi});
            }else{
                pi="rotate("+(num*(180/50)-180)+"deg)";
                pie.css({transform:pi});
            }
            if(num==100){
                $(".pubilc_default_mask").remove();
            }

        },
        //上传视频
        uploadVideo:function(obj){
            var t = this;
            t.videoUped=1;//视频上传完成参数
            t.uploadStatrus=true;//允许上传
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: obj.substring(1),
                container: $(obj).parent().attr("id"),
                //drop_element: $(obj).parent().attr("id"),
                //max_file_size: '2048mb',
                multi_selection: false,
                flash_swf_url: '/js/third-party/plupload/Moxie.swf',
                //dragdrop: false,
                chunk_size: '4mb',
                uptoken_url: PC_CALL+"qiniu/storage/getQiniuToken/",
                domain: "//"+location.hostname,
                get_new_uptoken: false,
                filters: {
                    /*mime_types: [ //只允许上传video
                        {title: "video", extensions: "mp4,mov,avi,wmv,flv"}
                    ],*/
                    prevent_duplicates: true //不允许选取重复文件
                },
                // downtoken_url: '/downtoken',
                // unique_names: true,
                // save_key: true,
                // x_vars: {
                //     'id': '1234',
                //     'time': function(up, file) {
                //         var time = (new Date()).getTime();
                //         // do something with 'time'
                //         return time;
                //     },
                // },
                auto_start: true,
                init: {
                    'FilesAdded': function (up, files) {// 文件添加进队列后,处理相关的事情
                        if(!t.uploadStatrus){
                            return;
                        }
                        plupload.each(files, function (file) {
                            t.videoUped=0;
                            var progress = new FileProgress(file, 'fsUploadProgress');
                            progress.setStatus("等待...");
                            progress.bindUploadCancel(up);
                            t.conUpload();//继续添加图片
                            html='<li class="publish_img_list Ev-videoList">'+
                            '<img class="pic" src="'+ t.config.imgPath+'images/default_img.jpg"><div class="pubilc_default_mask"><div class="ct"><div class="outer"></div><div class="pie"></div></div></div>'+
                            '<div class="topic_close removeico"><img src="'+ t.config.imgPath+'images/close_tc.png" /></div>'+
                            '</li>';
                            $("#topic_img_queue").append(html);
                            t.videoLen= $("#topic_img_queue .Ev-videoList").length;
                            $.each($("#topic_img_queue .Ev-videoList"),function(i,em){
                                //状态选择
                                $("li",$(em)).each(function(j,val){
                                    $(this).live("click",function(){
                                        $("li",$(em)).removeClass("active");
                                        $(this).addClass("active");
                                    });
                                });

                            });

                            t.setStyle();
                            $(".is_videoNum").text(t.config.videoLen- t.videoLen);
                            $(".add_img").hide();	//上传图片按钮隐藏
                            $(".add_video").hide(); //上传视频按钮隐藏
                            if(t.imgLen< t.config.imgLen){
                                $(".add_img_a").show();
                            }else{
                                $(".add_img_a").hide();
                            }
                            if(t.videoLen<t.config.videoLen){
                                $(".add_video_con").show();
                            }else{
                                $(".add_video_con").hide();
                            }
                        });

                    },
                    'BeforeUpload': function (up, file) {// 每个文件上传前,处理相关的事情
                        if(!t.uploadImgStatus){//在图片上传过程中不能上传视频
                            alert("请图片上传完成后再上传视频");
                            t.uploadStatrus=false;
                            return;
                        }
                        t.uploadStatrus=true;
                        var name=comm.file.getName(file.name);
                        var fileName=name.fileName;
                        var suffix=name.suffixName;
                        if ((/(mp4)|(mov)|(avi)|(wmv)|(flv)$/i.test(suffix))) {
                            var fileSize = file.size;
                            if (fileSize > 80 * 1048576) {
                                alert("视频过大，请联系在线客服寻求帮助");
                                uploader.removeFile(uploader.getFile(file.id));
                                t.uploadStatrus=false;
                                return false;
                            } else {

                            }
                        } else {
                            alert("格式不支持，请选择mov、mp4、avi、wmv、flv");
                            uploader.removeFile(uploader.getFile(file.id));
                            t.uploadStatrus=false;
                            return false;
                        }

                        t.videoName = fileName.length > 15 ? fileName.substring(0, 15) + '...'  + '.' + suffix : fileName + '.' + suffix;

                        var progress = new FileProgress(file, 'fsUploadProgress');
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        if (up.runtime === 'html5' && chunk_size) {
                            progress.setChunkProgess(chunk_size);
                        }
                    },
                    'UploadProgress': function (up, file) {// 每个文件上传时,处理相关的事情
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        t.progress(file.percent);
                        //progress.setProgress(file.percent + "%", file.speed, chunk_size);
                        //$(".jdt_content").animate({width: file.percent + '%'}, 200);
                    },
                    'UploadComplete': function () { //队列文件处理完毕后,处理相关的事情
                        endTime = new Date();
                    },
                    'FileUploaded': function (up, file, info) {// 每个文件上传成功后,处理相关的事情
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        progress.setComplete(up, info);
                        t.videoUped=1;
                        if(info){
                            var dataJSON = JSON.parse(info);
                            t.key=dataJSON.key;
                            t.persistentId=dataJSON.persistentId;
                            $(obj).parent().find(".moxie-shim").remove();
                            $(".Ev-videoList .removeico").on("click",function(){
                                $(this).parents("li").remove();
                                t.videoLen= $("#topic_img_queue .Ev-videoList").length;
                                $(".is_videoNum").text(t.config.videoLen- t.videoLen);
                                if(t.videoLen<t.config.videoLen){
                                    $(".add_video_con").show();
                                }
                                if(t.imgLen==0 && t.videoLen==0){
                                    $("#uploadifyToc").show();
                                    $(".add_img").show();
                                    $(".add_img_a").hide();
                                    $(".add_video").show();
                                    $(".add_video_con").hide();
                                }
                                t.setStyle();
                                if($(".add_content").eq(0).text().indexOf("flash")>-1){
                                    $("#uploadifyToc").hide();
                                }
                            });
                            $(".Ev-videoList .pic").attr("src","//img10.allinmd.cn/default/qiniu196_196.jpg");
                            t.uploadVideo(obj);//重新获取token
                        }

                    },
                    'Error': function (up, err, errTip) {// 每个文件上传失败后,处理相关的事情
                        var progress = new FileProgress(err.file, 'fsUploadProgress');
                        progress.setError();
                        progress.setStatus(errTip);
                        var name=comm.file.getName(err.file.name);
                        var suffix=name.suffixName;
                        if ((/(mp4)|(mov)|(avi)|(wmv)|(flv)$/i.test(suffix))) {
                            var fileSize = err.file.size;
                            if (fileSize > 80 * 1048576) {
                                alert("视频过大，请联系在线客服寻求帮助");
                                uploader.removeFile(uploader.getFile(err.file.id));
                                t.uploadStatrus=false;
                                return false;
                            } else {

                            }
                        } else {
                            alert("格式不支持，请选择mov、mp4、avi、wmv、flv");
                            uploader.removeFile(uploader.getFile(err.file.id));
                            t.uploadStatrus=false;
                            return false;
                        }
                        $(".Ev-videoList li").remove();
                        t.videoLen= $("#topic_img_queue .Ev-videoList").length;
                        $(".is_videoNum").text(t.config.videoLen- t.videoLen);
                        if(t.videoLen<t.config.videoLen){
                            $(".add_video_con").show();
                        }
                        if(t.imgLen==0 && t.videoLen==0){
                            $("#uploadifyToc").show();
                            $(".add_img").show();
                            $(".add_img_a").hide();
                            $(".add_video").show();
                            $(".add_video_con").hide();
                        }
                        t.setStyle();
                    }
                    /*'Key': function(up, file) {
                     var key = "";
                     // do something with key
                     return key
                     }*/
                }
            });
            uploader.bind('FilesAdded', function(uploader, file){
                if(uploader.files.length>1){ // 最多上传1个视频
                    uploader.splice(1,999);
                }
            });
            uploader.bind('FileUploaded', function () {
                //console.log('hello man,a file is uploaded');
            });
        },
        //获取上传图片列表
        getImgList:function(){
            var t=this;
            var params={};
            var data={};
            data.topicId=t.topicId;
            data.attUseFlag=AttUseFlag.g;
            params.paramJson= $.toJSON(data);
            $.ajax({
                url: t.path.topicAttList,
                type: "post",
                data: params,
                //dataType:"json",
                success: function (data) {
                    var html="";
                    if(data.responseObject.responseData){
                        var rows=data.responseObject.responseData.data_list;
                        $.each(rows,function(i,val){
                            if(i>t.imgLen-1||t.imgLen==0){//只加载最新添加的图片
                                html+='<li class="publish_img_list Ev-imgList" listId="'+val.id+'">'+
                                '<img class="pic" src="'+val.topicAttUrl+'">'+
                                '<div class="topic_close removeico"><img src="'+ t.config.imgPath+'images/close_tc.png" /></div>'+
                                '</li>';
                            }
                        });

                    }
                    $("#topic_img_queue").append(html);
                    t.imgLen=rows.length;
                    t.setStyle();
                    $(".is_videoNum").text(t.config.videoLen- t.videoLen);
                    t.conUpload();//继续添加图片
                    t.removeImg();
                    //t.viewBigpic();

                    if(t.imgLen>0){
                        $(".add_img").hide();	//上传图片按钮隐藏
                        $(".add_video").hide(); //上传视频按钮隐藏
                    }
                    if(t.imgLen< t.config.imgLen){
                        $(".add_img_a").show();
                    }else{
                        $(".add_img_a").hide();
                    }
                    if(t.videoLen<t.config.videoLen){
                        $(".add_video_con").show();
                    }else{
                        $(".add_video_con").hide();
                    }

                },
                error: function(XMLHttpRequest, textStatus, errorThrown){

                }
            });
        },
        //删除图片
        removeImg:function(){
            var t=this;
            /*$("#topic_img_queue li").live("mouseover",function(){
                $(this).find(".ico").show();
            });
            $("#topic_img_queue li").live("mouseout",function(){
                $(this).find(".ico").hide();
            });*/
            $.each($(".removeico"),function(){
                $(this).live("click",function(){
                    var removeLi=$(this).parents("li");
                    $(".publish_mask").show();
                    var data={};
                    var param={};
                    data.id=$(this).parents("li").attr("listId");
                    param.paramJson= $.toJSON(data);
                    $.ajax({
                        url: t.path.topicAttDelete,
                        type: "post",
                        data: param,
                        dataType:"json",
                        success:function(data){
                            $(".publish_mask").hide();
                            if(data.responseObject.responseStatus){
                                removeLi.remove();
                                t.imgLen=$("#topic_img_queue .Ev-imgList").length;
                                t.setStyle();
                                if(t.imgLen< t.config.imgLen){
                                    $(".add_img_a").show();
                                }
                                if(t.videoLen<t.config.videoLen){
                                    $(".add_video_con").show();
                                }
                                if(t.imgLen==0 && t.videoLen==0){
                                    if($(".add_content").text().lastIndexOf("flash")<=-1){
                                        $("#uploadifyToc").show();
                                    }
                                    $(".add_img").show();
                                    $(".add_img_a").hide();
                                    $(".add_video").show();
                                    $(".add_video_con").hide();
                                }
                                t.conUpload();//继续添加图片
                            }else{
                                alert("删除失败");
                            }

                        }
                    });
                });
            });
        },
        setStyle:function(){
            var list=$("#topic_img_queue .publish_img_list");
            list.css("marginRight","16px");
            list.each(function(i,em){
                if(i%3===2){
                    $(em).css("marginRight","0");
                }
            });
            if(list.length%3==2|| this.imgLen== this.config.imgLen){
                $(".add_video_con").css("marginLeft","0");
            }else{
                $(".add_video_con").css("marginLeft","16px");
            }

        },
        //获取专业数据
        getXuezu:function(){
            var html='';
            var t=this;
            $.ajax({
                type: "POST",
                url: t.path.getAreaExpertise,
                dataType: "json",
                async:false,
                success: function(data){
                    $.each(data,function(i,n){
                        html+='<li tagId='+data[i].id+'>'+data[i].tagName+'</li>';
                    });

                    $("#areaExp1").html(html);
                    t.selectXuezu();
                }
            });
        },
        //选择学组
        selectXuezu:function(){
            var t=this;
            $(".xuezu_x","#topic").bind("click",function(){
                clearTimeout(t.timer);
                $(".publish_zy_position","#topic").css("bottom",-$(".publish_zy_position","#topic").outerHeight());
                $(".publish_zy_position","#topic").show();
                t.mouse=true;
            });
            $(".xuezu_x","#topic").bind("mouseover",function(){
                if(t.mouse){
                    clearTimeout(t.timer);
                    $(".publish_zy_position", "#topic").show();
                }
            });
            $(".xuezu_x","#topic").bind("mouseout",function(){
                if(t.mouse){
                    t.timer=setTimeout(function(){
                        $(".publish_zy_position","#topic").hide();
                        t.mouse=false;
                    },500);

                }
            });
            //下拉学组鼠标移入
            $(".publish_zy_position li","#topic").live("mouseover",function(){
                if($(this).attr("select-status")===undefined || $(this).attr("select-status")==="false") {//未选择
                    $(".publish_zy_position li", "#topic").removeClass("active");
                    $(this).addClass("active");
                }
                return false;
            });
            //下拉学组鼠标移出
            $(".publish_zy_position li","#topic").live("mouseout",function(){
                $(".publish_zy_position li","#topic").removeClass("active");
                return false;
            });
            //下拉学组鼠标点击
            $(".publish_zy_position li","#topic").die("click").live("click",function(){
                var tagName=$(this).text();
                var tagId=$(this).attr("tagId");

                if($(this).attr("select-status")===undefined || $(this).attr("select-status")==="false"){//未选择
                    $(this).addClass("disable");
                    $(this).attr("select-status","true");
                    t.createSelectedItem(tagName,tagId);
                }else{                                   //已选择
                    $(this).removeClass("disable");
                    $(this).attr("select-status","false");
                    t.clearTag(tagName,tagId);
                }

            });
        },
        // 选中后添加关键词
        createSelectedItem:function(keyName,tagId){
            var t = this;
            $("#areaTitle1").css("top",20);//所属专业上浮
            var el = $("<li><div class='tab_text tagName' tagId="+tagId+">"+keyName+"</div>"+
            "<div class='tc_close'><img src='"+t.config.imgPath+"images/close.png' /></div>"+
            "</li>");

            el.find(".tc_close").click(function(){
                t.clearTag(keyName,tagId);
                t.clearDownSelector(el.find(".tagName"));
                return false;
            });

            $("#areaSel1").append(el);
        },
        // 清除标签
        clearTag:function(keyName,tagId){
            $.each($("#areaSel1 li"),function(i,em){
                if($(em).find(".tagName").attr("tagId")==tagId){
                    $(em).remove();
                }
            });
            if($("#areaSel1 li").length===0){
                $("#areaTitle1").css("top",26);
            }
        },
        // 取消下拉学组的其中一个选中状态
        clearDownSelector:function(obj){
            $.each($("#areaExp1 li"),function(i,em){
                if($(em).attr("tagId")===obj.attr("tagId")){
                    $(em).removeClass("disable");
                    $(em).attr("select-status","false");
                }
            });

        },
        tagInput:function(){
            var t=this;
            $("#tag_input").on("keyup",function(ev){//13:enter键,188:逗号,8:删除
               tagName=$(this).val();
               if(tagName!==""&&$("#tagSel li").length<10){
                   $(".default_name_new").show();
                   $(this).removeClass("mr_input");
                   $(this).attr("placeholder","");
                   if(ev.keyCode=="13"){//
                       if($(this).val().length>50){
                           alert("标签最多50个字");
                           return;
                       }
                       html='<li><div class="tab_text tagName" tagId="0">'+tagName+'</div>'+
                           '<div class="tc_close"><img src="'+ t.config.imgPath+'images/close.png" /></div>'+
                       '</li>';
                       $(".tc_tab_list").append(html);
                       $(this).val("");
                   }
                   if(ev.keyCode=="188"&&tagName!="，"){
                       if($(this).val().length>50){
                           alert("标签最多50个字");
                           return;
                       }
                       html='<li><div class="tab_text tagName" tagId="0">'+tagName.substring(0,tagName.length-1)+'</div>'+
                       '<div class="tc_close"><img src="'+ t.config.imgPath+'images/close.png" /></div>'+
                       '</li>';
                       $(".tc_tab_list").append(html);
                       $(this).val("");
                   }
               }else{
                   if($(".tc_tab_list li").length===0){
                       $(".default_name_new").hide();
                       $(this).addClass("mr_input");
                       $(this).attr("placeholder","标签（多个用逗号或者回车分隔）");
                   }
               }
            });
            $(".tc_tab_list .tc_close").live("click",function(){
                $(this).parent().remove();
                if($(".tc_tab_list li").length===0){
                    $(".default_name_new").hide();
                    $("#tag_input").addClass("mr_input");
                    $("#tag_input").attr("placeholder","标签（多个用逗号或者回车分隔）");
                }
            })
        },
        //发布取消
        publishCancel:function(){
            var t=this;
            $("#topic_cancel").bind("click",function(){
                if($("#topic_name").val()==''&&$("#topic textarea").val()==''&&$("#topic_img_queue li").length==0&&!$("input[name='topicType']").attr("checked")){
                    $("#topic")[0].innerHTML="";
                    $("#topic").remove();
                    comm.LightBox.hide();
                }else{
                    $(".cancel_mask").show();
                    $(".upload_end").show();
                    var scrollTop=$(window).scrollTop();
                    if(scrollTop> t.options.top){//当滚动高度大于弹层top值
                        var top=($("#topic").height()-(scrollTop-t.options.top))/2+(scrollTop-t.options.top);
                        $("#topic .upload_end").css({"top":top});
                    }else{
                        $("#topic .upload_end").css({top:50+'%'});
                    }
                    /*if($(".upload_end","#topic").height>window.innerHeight){
                        var top=(window.innerHeight-$(".upload_end","#topic").height())/2+$(document).scrollTop();
                        $(".upload_end","#topic").css({"top":top});
                    }else{
                        $(".upload_end","#topic").css({top:50+'%'});
                    }*/
                    $(".continue_edit").bind("click",function(){
                        $(".cancel_mask").hide();
                        $(".upload_end").hide();
                    });
                    $(".cancel_pub").bind("click",function(){
                        $("#topic")[0].innerHTML="";
                        $("#topic").remove();
                        comm.LightBox.hide();
                    });
                }
                t.options.indexLogin&& t.options.indexLogin();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"话题发布取消",
                    browType:84,
                    actionId:45
                });
            });
        },
        //发布
        publish:function(){
            var t=this;
            $("#topic_save").off("click").on("click",function(){
                if(TempCache.getItem("userId")){
                    if(!t.videoUped){//视频已上传完成后才能发布
                        return false;
                    }
                    var params={};
                    var data={};
                    var content=[];
                    /*var position=$("#areaSel1 .tagName");
                     var tagList='';
                     for(var i=0; i<position.length; i++){
                     tagname=position.eq(i).attr("tagId")+'_'+position.eq(i).text()+",";
                     tagList+=tagname;
                     };*/
                    var topicType=0;
                    var type=$("input[name='topicType']");
                    for(var i=0; i<type.length; i++){
                        if(type[i].checked){
                            topicType=type[i].value;
                        }
                    };
                    data.topicId=t.topicId;
                    data.isValid=1;
                    data.topicName=$("#topic_name").val();
                    data.topicType=topicType;
                    topicDiscuss=$("#topic_discuss").val();
                    data.platformId= $("#sesDepartment").val();
                    content.push({"content":topicDiscuss,"contentType":"0","topicAttName":""});
                    $.each($("#topic_img_queue .Ev-imgList"),function(i,em){
                        var pic=$(em).find(".pic").attr("src").replace("_c_t_200_200","");
                        content.push({"content":pic,"contentType":"1","topicAttId":$(em).attr("listId"),"topicAttName":""});
                    });
                    //data.tagList=tagList.substring(0,tagList.length-1);
                    if(t.customerIds){
                        data.refCustomerIdList= t.customerIds.substring(0,t.customerIds.length-1);
                    }

                    if(data.topicType<1){
                        alert("请选择类型");
                        return;
                    }
                    if(data.topicName||data.topicDiscuss||$("#topic_img_queue li").length>0){
                        $(".publish_mask").show();
                        if(t.videoLen>0){
                            var params2 = {};
                            var data2 = {};
                            data2.key= t.key;
                            data2.persistentId= t.persistentId;
                            data2.videoName= t.videoName;
                            data2.refType=4;
                            data2.topicId= t.topicId;
                            params2.paramJson = $.toJSON(data2);
                            $.ajax({
                                type : "post",
                                url : t.path.videoInfo,
                                data : params2,
                                dataType : "json",
                                async:false,
                                success : function(rep){
                                    t.options.indexLogin&& t.options.indexLogin();
                                    var topicAttId=rep.responseObject.responseData.data_list.attachment.id
                                    content.push({"content":t.persistentId,"contentType":"2","topicAttId":topicAttId,"topicAttName":t.videoName});
                                    if(!(rep&&rep.responseObject.responseStatus)){
                                        $(".publish_mask").hide();
                                        $.topTip({mark:"warn",content:rep.responseObject.responseMessage});
                                        return false;
                                    }
                                },
                                error:function(){}
                            });
                        }

                        data.contentJson= content;
                        //TODO 活动ID
                        if (t.options.activityId) {
                            data.activityId = t.options.activityId;
                        }
                        //TODO 新版活动报名添加赛区和类别的参数
                        if(t.options.property){
                            data.property= t.options.property;//JSON.stringify(t.options.property);
                        }
                        if(t.options.property_area){
                            data.property_area= t.options.property_area;//JSON.stringify(t.options.property_area);
                        }
                        params.paramJson= $.toJSON(data);
                        $.ajax({
                            url:t.path.topicUpdate,
                            type: "post",
                            data: params,
                            dataType:"json",
                            success:function(data){
                                if(data.responseObject.responseData.data_list){
                                    if(data.responseObject.responseData.data_list.cms_topic){
                                        url=data.responseObject.responseData.data_list.cms_topic.pageStoragePath;
                                    }else{
                                        url="";
                                    }
                                    //判断页面是否生成
                                    //comm.ajaxExistHtml(url,function(){
                                    $(".publish_mask").hide();//关闭loading
                                    $("#topic")[0].innerHTML="";
                                    $("#topic").remove();
                                    comm.LightBox.hide();
                                    $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});
                                    t.topicId="";
                                    if(t.options.publishBack){//有回调函数
                                        t.options.publishBack();
                                    }else{
                                        g_sps.jump(null,url);
                                    }
                                    //});

                                }else{
                                    $(".publish_mask").hide();
                                    $("#topic")[0].innerHTML="";
                                    $("#topic").remove();
                                    comm.LightBox.hide();
                                    $.topTip({mark:"warn",content:"未发布成功，请稍后再试！"});
                                }

                            }
                        });

                    }else{
                        alert("标题，讨论，照片或视频必须有一项填写或上传");
                        return;
                    }
                }else{
                    g_sps.jump(null,"/");
                }
            });
        }
    };

    controller.init(obj);
};
