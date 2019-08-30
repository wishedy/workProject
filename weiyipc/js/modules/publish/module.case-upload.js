/**
 * 功能描述：  发布文档
 * 使用方法:   module.caseUpload({
 *                  editBtn:$(""),//编辑按钮
                    caseBtn:$("#case_upload"),//创建点击btn
                    container:$(".personal_content"),//存放弹层的外层
                    top:126,//弹层top值
                    userImg:1,//是否有用户头像
                    activityId:xxx,//活动ID 不传表示普通上传
                    property:{},//活动时选择的专业和术式
                    property_area:{},//新版活动赛区参数
                    propertyIdList:'',//标签专题页带过来的id
                    callback:function(){},//回调函数
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
module.caseUpload=function(obj){
    controller= {
        config: {
            videoLen:1,//最大上传视频数
            imgLen:40,//最大上传照片数
            imgPath: "//modules.allinmd.cn/publish/",
            swf: "/js/third-party/uploadify/uploadify.swf",
            uploadImg: "//modules.allinmd.cn/publish/images/add_img_new.jpg",
            conUpload: "//modules.allinmd.cn/publish/images/add_img_small.jpg"
        },
        el: {},
        path: {
            getAreaExpertise: PC_CALL+"commdata/getAreaExpertise/",
            videoInfo: PC_CALL+"qiniu/storage/saveVideoInfo/",
            caseCreate: PC_CALL+"case_baseinfo/create/",
            caseUpdate: PC_CALL+"case_baseinfo/update/",
            //caseInfo: PC_CALL+"case_baseinfo/info/",
            caseInfo: PC_CALL+"case_baseinfo/getMapById/",
            caseDelete: PC_CALL+"case_baseinfo/deleteAll/",
            caseSupSave: PC_CALL+"case_supplement/save/",
            caseSupInfo: PC_CALL+"case_supplement/info/",
            caseAttList: PC_CALL+"case_attachment/json_list/",
            caseAttCreate: PC_CALL+"case_attachment/upload/",
            caseAttDelete: PC_CALL+"case_attachment/delete/"
        },
        template: {
            caseTem: function (option) {
                var html = "";
                html += '<div class="doc_tc al_publishCon" id="case" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
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
                    '<div class="upload_title">'+
                    '<div class="found_case_small">'+
                    '<div class="default_name font_yahei">标题</div>'+
                    '<div class="input_write01">'+
                    '<input type="text" id="case_name" placeholder="标题（必填）" class="font_yahei" max="25">'+
                    '</div>'+
                    '<div class="djs_num name_num">25</div>'+
                    '</div>'+
                    '</div>'+
                        /*'<div class="xuezu_x" style="border-top:none;">'+
                         '<div class="found_case_big">'+
                         '<div class="default_name font_yahei" id="areaTitle" style="display:block; top:26px">所属专业</div>'+
                         '<div class="input_write">'+
                         '<ul class="tc_tab_list" id="areaSel"></ul>'+//选中专业存放
                         '<div class="clear"></div>'+
                         '</div>'+
                         '</div>'+
                         '<div class="clear"></div>'+
                         '<div class="publish_zy_position">'+
                         '<ul id="areaExp"></ul>'+//专业数据
                         '</div>'+
                         '</div>'+*/
                    '<div class="clear"></div>'+
                    '<div class="publish_sexy font_yahei">'+
                    '<div class="publish_sexy_radio">'+
                    '<div class="publish_case_radio">'+
                    '<input type="radio" name="sex_id" value="1">男</div>'+
                    '<div class="publish_case_radio">'+
                    '<input type="radio" name="sex_id" value="2">女</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="publish_nl font_yahei">'+
                    '<div class="publish_nl_text nl_text01">年龄</div>'+
                    '<input type="text" id="age" class="focus"/><div class="text publish_nl_text publish_nl_text_hover">岁</div>'+
                    '<input type="text" id="month" disabled/><div class="text publish_nl_text">月</div>'+
                    '<input type="text" id="day" disabled/><div class="text publish_nl_text">天</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '<div class="found_case_small normal_title_border">'+
                    '<div class="default_name font_yahei" style="display:none">主诉</div>'+
                    '<div class="input_write01">'+
                    '<input type="text" id="main_narrate" placeholder="主诉（必填）" class="font_yahei" max="50">'+
                    '</div>'+
                    '<div class="djs_num narrate_num">50</div>'+
                    '</div>'+
                    '<div class="found_case_small normal_title_border">'+
                    '<div class="default_name font_yahei" style="display:none">现病史</div>'+
                    '<div class="input_write01">'+
                    '<input type="text" id="illness_history" placeholder="现病史" class="font_yahei" max="1500">'+
                    '</div>'+
                    '<div class="djs_num history_num">1500</div>'+
                    '</div>'+
                    '<div class="found_case_small normal_title_border">'+
                    '<div class="default_name font_yahei" style="display:none">体格检查（全身查体&专科查体）</div>'+
                    '<div class="input_write01">'+
                    '<input type="text" id="professional_checking" placeholder="体格检查（全身查体&专科查体）" class="font_yahei" max="1500">'+
                    '</div>'+
                    '<div class="djs_num checking_num">1500</div>'+
                    '</div>'+
                    '<div class="upload_textarea_topic">'+
                    '<div class="default_name font_yahei">文字讨论</div>'+
                    '<div class="textarea_write">'+
                    '<textarea placeholder="文字讨论（必填）" id="discussion" class="font_yahei" max="3000" style="top: 14px"></textarea>'+
                    '</div>'+
                    '<div class="djs_num ds_text discussion_num">3000</div>'+
                    '</div>'+
                    '<div class="clear"></div>'+

                    '</div>'+
                    '<div class="add_img add_sWidth"><div class="add_content">请上传该病例的检查照片，</br>图片格式jpg或png，单张不超过5M，最多40张</div><input type="file" name="uploadify" id="uploadify"></div>'+
                    '<div class="add_video add_sWidth">' +
                    '<a href="javascript:;" class="add_video_a" id="add_video_container">' +
                    '<span class="add_content" style="z-index: 0;">请上传该病例的相关视频，</br>视频大小不超过80M，最多1个</span>' +
                    '<input class="add_video_input" type="file" name="file" id="Ev_uploadVideo">' +
                    '</a>' +
                    '</div>'+
                    '<div class="clear"></div>'+
                    '<div class="add_img_fangda">'+
                    '<ul id="case_img_queue">'+

                    '</ul>'+
                    '<div class="add_img_a">'+
                    '<a href="javascript:;">jpg或png，单张不超过5M还能上传<span class="is_num"></span>张</a>'+
                    '<input type="file" name="uploadify_con" id="uploadify_con">'+
                    '</div>'+
                    '<div class="add_video_con">'+
                    '<a href="javascript:;" id="add_video_container1">'+
                    '<span class="add_video_cTex" href="javascript:;">请上传该病例的相关视频，</br>视频大小不超过80M，最多<span class="is_videoNum"></span>个</span>'+
                    '<input type="file" name="uploadify_vcon" id="uploadify_vcon">'+
                    '</a>'+
                    '</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                        /*'<div class="found_case_big write_topic_cont">'+
                         '<div class="default_name_new font_yahei" >标签（多个用逗号或者回车分隔）</div>'+
                         '<div class="input_write">'+
                         '<ul class="tc_tab_list" id="tagSel" style="float:none">'+

                         '</ul>'+
                         '<input type="text" id="tag_input" placeholder="标签（多个用逗号或者回车分隔）" class="mr_input font_yahei">'+
                         '<div class="clear"></div>'+
                         '</div>'+
                         '</div>'+*/
                    '<div class="tx_who" id="uploadCase_remind" style="margin-top:20px">'+
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
                    '<div class="more_case_cont font_yahei">还有更多病例内容没填？<a href="javascript:;" id="addMore">继续完善病例</a></div>'+
                    '<div class="t_but_case_bottom" style="margin-top:10px;">'+
                    '<div class="publish_t_fb can_fb" id="publish_case">发布</div>'+
                    '<div class="publish_t_qx" id="cancel_case">取消</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';

                return html;
            },
            caseSupTem:function(option){
                var html="";
                html+='<div class="doc_tc al_publishCon" id="case_sup" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                    '<!-- 发布遮罩 -->'+
                    '<div class="sup_mask">'+
                    ' <img src="//modules.allinmd.cn/publish/images/loading6060.gif" />'+
                    '</div>'+
                    '<!-- 点击取消遮罩 -->'+

                    '<div class="upload_end">'+
                    '<div class="upload_question">接下来你想....</div>'+
                    '<div class="bjfb_but">'+
                    '<div><a href="javascript:;"><img class="continue_edit" src="//modules.allinmd.cn/publish/images/go_bj.png" /></a></div>'+
                    '<div style="margin-left:25px;"><a href="javascript:;"><img class="cancel_pub" src="//modules.allinmd.cn/publish/images/qx_fb.png" /></a></div>'+
                    '</div>'+
                    '</div>'+
                    (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                    '<div class="fb_doc">'+
                    '<div class="doc_tc_bg" style="margin-bottom: 70px;"></div>'+
                    '<div class="upload_center">'+
                    '<input id="id" type="hidden" value="0"/>'+
                    '<div class="fixed">'+
                    '<span><a class="back" href="javascript:;">返回上一页</a></span>'+
                    '<span class="f_center">本页全部是选填项哦！</span>'+
                    '</div>'+
                    '<div class="found_case_border">'+

                    '<div class="sup_title sup_border">基本信息</div>'+

                    '<div class="found_case_small sup_border">'+
                    '<div class="default_name font_yahei">既往史</div>'+
                    '<div class="input_write01"><input id="past_history" type="text" placeholder="既往史" max="1500" class="font_yahei"/></div>'+
                    '<div class="djs_num past_num">1500</div>'+
                    '</div>'+
                    '<div class="found_case_small sup_border">'+
                    '<div class="default_name font_yahei">个人史</div>'+
                    '<div class="input_write01"><input id="personal_history" type="text" placeholder="个人史" max="1500" class="font_yahei"/></div>'+
                    '<div class="djs_num personal_num">1500</div>'+
                    '</div>'+
                    '<div class="found_case_small sup_border">'+
                    '<div class="default_name font_yahei">家族史</div>'+
                    '<div class="input_write01"><input id="family_history" type="text"placeholder="家族史" max="1500" class="font_yahei" /></div>'+
                    '<div class="djs_num family_num">1500</div>'+
                    '</div>'+

                    '<div class="sup_title sup_border">检查信息</div>'+

                    '<div class="found_case_small sup_border">'+
                    '<div class="default_name font_yahei">辅助检查</div>'+
                    '<div class="input_write01"><input id="auxiliary_info" type="text" placeholder="辅助检查" max="1500" class="font_yahei"/></div>'+
                    '<div class="djs_num aux_num">1500</div>'+
                    '</div>'+
                    '<div class="found_case_small sup_border">'+
                    '<div class="default_name font_yahei">诊断&鉴别诊断</div>'+
                    '<div class="input_write01"><input id="diagnosis_info" type="text" placeholder="诊断&鉴别诊断" max="2000" class="font_yahei"/></div>'+
                    '<div class="djs_num diag_num">2000</div>'+
                    '</div>'+

                    '<div class="sup_title sup_border">诊疗信息 </div>'+

                    '<div class="found_case_small sup_border">'+
                    '<div class="default_name font_yahei">治疗过程</div>'+
                    '<div class="input_write01"><input id="treatment_record" type="text" placeholder="治疗过程" max="2000" class="font_yahei"/></div>'+
                    '<div class="djs_num record_num">2000</div>'+
                    '</div>'+

                    '<div class="found_case_small sup_border">'+
                    '<div class="default_name font_yahei">手术名称</div>'+
                    '<div class="input_write01"><input id="operation_name" type="text" placeholder="手术名称" max="100" class="font_yahei"/></div>'+
                    '<div class="djs_num ope_num">100</div>'+
                    '</div>'+
                    '<div class="found_case_small sup_border">'+
                    '<div class="default_name font_yahei">手术记录（主要病理发现）</div>'+
                    '<div class="input_write01"><input id="intraoperative_info" type="text" placeholder="手术记录（主要病理发现）" max="3000" class="font_yahei"/></div>'+
                    '<div class="djs_num intra_num">3000</div>'+
                    '</div>'+
                    '<div class="found_case_small sup_border_both">'+
                    '<div class="default_name font_yahei">产品信息</div>'+
                    '<div class="input_write01"><input id="product_info" type="text" placeholder="产品信息" max="1500" class="font_yahei"/></div>'+
                    '<div class="djs_num pro_num">1500</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="t_but_case_bottom" style="margin-top:10px;">'+
                    '<div class="publish_t_fb can_fb" id="publish_sup">发布</div>'+
                    '<div class="publish_t_qx" id="cancel_sup">取消</div>'+
                    '<div class="clear"></div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                return html;
            }
        },
        init: function (obj) {
            var t = this;
            this.options = {};
            var o = {
                container: $("body")
            };
            this.options = $.extend(o, obj);

            t.uploadImgStatus=true;//上传图片的状态
            if(t.options.editBtn){//修改
                t.options.editBtn.attr("on",true);
                this.editCase();
            }
            if(t.options.caseBtn){//创建
                t.options.caseBtn.attr("on",true);
                this.create();
            }
        },
        create:function(){
            var t=this;
            if(t.options.oneUpload){//TODO:针对活动只有一个资源发布时先清除click事件
                t.options.caseBtn.off("click");
            }
            this.options.caseBtn.on("click",function(e){
                //if (!t.options.top) {
                var tTop = $(document).scrollTop();
                t.options.top = tTop +(tTop!=0?50:80);
                t.options.left = ($(window).width() - 713) / 2;
                //}
                var $this=$(this);
                if($(this).attr("on")=="true"){
                    $(this).attr("on",false);
                    if(t.options.needAuth){
                        user.login({
                            callback:function(){
                                //t.options.indexLogin&& t.options.indexLogin();
                                t.imgLen=0;
                                t.videoLen=0;
                                t.caseId="";
                                $.ajax({
                                    url:t.path.caseCreate,
                                    type: "post",
                                    dataType:"json",
                                    success: function (data) {
                                        $this.attr("on",true);
                                        if(data.responseObject.responseStatus){
                                            t.htmlInit();
                                            t.caseId=data.responseObject.responsePk;
                                            t.uploadImg();
                                            //$(".more_case_cont").hide();
                                            t.caseSupplement();
                                            t.uploadVideo("#Ev_uploadVideo");
                                            t.uploadVideo("#uploadify_vcon");
                                            $("#publish_case").off("click").on("click",function(){
                                                if(!t.videoUped){//视频已上传完成后才能发布
                                                    return false;
                                                }
                                                t.publish();
                                            });
                                        }else{
                                            $.topTip({mark:"warn",content:"未创建成功，请稍后再试！"});
                                        }
                                    },
                                    error: function(XMLHttpRequest, textStatus, errorThrown){

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
                            scene:privilegeSceneConst.eSceneTypePublic,
                            t:t
                        })
                    }else{
                        //user.login({
                        //callback:function(){
                        t.imgLen=0;
                        t.videoLen=0;
                        t.caseId="";
                        $.ajax({
                            url:t.path.caseCreate,
                            type: "post",
                            dataType:"json",
                            success: function (data) {
                                $this.attr("on",true);
                                if(data.responseObject.responseStatus){
                                    t.htmlInit();
                                    t.caseId=data.responseObject.responsePk;
                                    t.uploadImg();
                                    //$(".more_case_cont").hide();
                                    t.caseSupplement();
                                    t.uploadVideo("#Ev_uploadVideo");
                                    t.uploadVideo("#uploadify_vcon");
                                    $("#publish_case").off("click").on("click",function(){
                                        if(!t.videoUped){//视频已上传完成后才能发布
                                            return false;
                                        }
                                        t.publish();
                                    });
                                }else{
                                    $.topTip({mark:"warn",content:"未创建成功，请稍后再试！"});
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown){

                            }
                        });
                        //},operateType : "auth",
                        //t:t
                        //})
                    }
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"发布",
                    refId:t.options.propertyIdList,
                    keyword:t.options.propertyIdList?document.title.split("－")[0]:"发布病例",
                    actionId: t.options.propertyIdList?34:33
                });
                e.preventDefault();
                return false;
            });
        },
        htmlInit:function(){
            var t=this;
            t.options.container.css("position","relative");

            comm.LightBox.show(95,"#3c3c3d");
            comm.LightBox.setZIndex(8);
            //comm.LightBox.element.addClass("bgblur");
            t.options.container.append(t.template.caseTem({
                top:t.options.top,
                left: t.options.left,
                userImg:t.options.userImg,
                imgPath:t.config.imgPath,
                editBtn:t.options.editBtn
            }));
            $('.al-mainInner').css('height',$('#case').offset().top+80+$('#case').outerHeight());
            t.options.callback&& t.options.callback();//回调函数
            //t.getXuezu();

            /*var html="";
             var tagList= t.options.property?t.options.property.property_1:[];
             if(tagList.length>0){
             $.each(tagList,function(i,val){
             $.each($("#areaExp li"),function(j,em){
             if($(this).text()==val.propertyName){
             $("#areaTitle").css("top",20);//所属专业上浮
             t.createSelectedItem(val.propertyName,'',1);
             $(this).addClass("disable").attr("select-status","true").attr("no-change","true");
             }
             });
             });
             }*/
            //t.tagInput();
            $("#age").on("keyup",function(){
                t.ageFocus($(this).val());
            })

            t.writeAge($("#age"));
            t.writeAge($("#month"));
            t.writeAge($("#day"));
            $("#uploadCase_remind").on("click",function(){
                $(".remind_input").focus();
            });
            $("#uploadCase_remind").replyRemind({
                upload:1,
                callback:function(){
                    t.customerIds="";
                    $(".remind_name span","#uploadCase_remind").each(function(i,em){
                        t.customerIds+=$(em).attr("customerid")+",";
                    });
                    //alert(t.customerIds);
                    $('.al-mainInner').css('height',$('#case').offset().top+80+$('#case').outerHeight());
                },  //回调函数
                addDomCallback:function(){
                    $('.al-mainInner').css('height',$('#case').offset().top+$('#case').outerHeight()+$('.Ev_reCon').outerHeight());
                },
                closeDomCallback:function(){
                    $('.al-mainInner').css('height',$('#case').offset().top+80+$('#case').outerHeight());
                }
            });
            $("#case").find("input[placeholder], textarea[placeholder]").placeholder();	// 表单默认值 插件
            t.publishCancel();
            comm.textChange({"$tex":$("#case_name"),"$num":$(".name_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#main_narrate"),"$num":$(".narrate_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#illness_history"),"$num":$(".history_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#professional_checking"),"$num":$(".checking_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#discussion"),"$num":$(".discussion_num"),"minTop":14,"noJudgmentCE":1});

        },
        ageFocus:function(str){
            if(str!=""&&str==0){
                $(".text").addClass("publish_nl_text_hover");
                $("#month").attr("disabled",false).addClass("focus");
                $("#day").attr("disabled",false).addClass("focus");
            }else if(str!=""&&str>0&&str<=5){
                $("#day").attr("disabled",true).val("").removeClass("focus");
                $("#day").next().removeClass("publish_nl_text_hover");
                $("#month").next().addClass("publish_nl_text_hover");
                $("#month").attr("disabled",false).addClass("focus");
            }else{
                $("#month").attr("disabled",true).val("").removeClass("focus");
                $("#month").next().removeClass("publish_nl_text_hover");
                $("#day").attr("disabled",true).val("").removeClass("focus");
                $("#day").next().removeClass("publish_nl_text_hover");
            }
        },
        //年龄处理
        writeAge:function(obj){
            obj.keydown(change).keyup(change).change(change)
            obj[0].onpaste=change;
            function change(){
                obj.val(obj.val().replace(/[^\d]/g,''));
                if(obj.val().length!=0){
                    /*if($("#age").val()>120){
                     $("#age").val($("#age").val().substring(0,2));
                     }*/
                    if(obj.val()==0){
                        obj.val(0);
                    }
                }

            };
        },
        //上传图片处理插件
        uploadImg:function(){
            var t=this;
            $("#uploadify").uploadify({
                'swf'             : t.config.swf,//uploadify.swf文件的路径。
                'uploader'        : t.path.caseAttCreate,
                'formData'        : {'caseId':t.caseId},
                'auto'            : true,
                'width'           : 308,
                'height'          : 141,
                'buttonImage'     : t.config.uploadImg,
                'fileObjName'     : 'uploadify',
                'fileTypeExts'    : '*.jpg;*.png;*.jpeg',//上传文件类型
                'fileTypeDesc'    : 'Web Image Files (.JPG, .PNG, .JPEG)',
                'fileSizeLimit'   : 5120,//单个文件允许大小
                'uploadLimit'     : t.config.imgLen,//允许你设置同时上传文件的最大数量。
                'removeTimeout'   : 0.5,
                //'removeCompleted' : false,//自动移除队列中已经完成上传的项目设置
                'onSelect':function(){//每选择一个文件触发
                    t.uploadImgStatus=false;//上传图片的状态：正在上传中
                },
                'onQueueComplete' :function(){
                    t.uploadImgStatus=true;//上传图片的状态：上传完成
                    $("#uploadify").animate({opacity:0,height:0},200,function(){
                        $(".add_img").hide();
                        $(".add_video").hide();
                        $("#uploadify").hide();
                        $("#uploadify").css({height:141,opacity:1});
                    });
                    t.getImgList();
                    //t.conUpload();
                },
                'onFallback'     :function(){//针对safari没有flash安全权限时触发
                    $("#uploadify").hide();
                    $(".add_content").eq(0).html('您还没有安装flash播放器，请点击<br><a href="//www.adobe.com/go/getflash" target="_blank" style="color:red">这里</a>安装');
                }

            });
        },
        //继续上传
        conUpload:function(){
            var t=this;
            var maxNum=this.config.imgLen-this.imgLen;
            $(".is_num").text(maxNum);
            $("#uploadify_con").uploadify({
                'swf'             : t.config.swf,//uploadify.swf文件的路径。
                'uploader'        : t.path.caseAttCreate,
                'formData'        : {"caseId":t.caseId},
                'auto'            : true,
                'width'           : 200,
                'height'          : 200,
                'buttonImage'     : t.config.conUpload,
                'fileObjName'     : 'uploadify',
                'fileTypeExts'    : '*.jpg;*.png;*.jpeg',//上传文件类型
                'fileTypeDesc'    : 'Web Image Files (.JPG, .PNG, .JPEG)',
                'fileSizeLimit'   : 5120,//单个文件允许大小
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
                    $("#uploadify_con").hide();
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
            t.videoUped=1;//视频上传成功参数
            t.uploadStatrus=true;//允许上传
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: obj.substring(1),
                container: $(obj).parent().attr("id"),
                drop_element: $(obj).parent().attr("id"),
                max_file_size: '80mb',
                multi_selection: false,
                flash_swf_url: '/js/third-party/plupload/Moxie.swf',
                //dragdrop: false,
                chunk_size: '4mb',
                uptoken_url: PC_CALL+"qiniu/storage/getQiniuToken/",
                domain: "/",
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
                            html='<li class="publish_img_list Ev-videoList" style="height:285px">'+
                                '<img class="pic" src="'+ t.config.imgPath+'images/default_img.jpg"><div class="pubilc_default_mask"><div class="ct"><div class="outer"></div><div class="pie"></div></div></div>'+
                                '<div class="topic_close removeico"><img src="'+ t.config.imgPath+'images/close_tc.png" /></div>'+
                                '<div class="shoushu_zt">'+
                                '<ul>'+
                                '<li class="active" case_category_id="1">治疗前</li>'+
                                '<li case_category_id="2">治疗中</li>'+
                                '<li style="margin-right:0;" case_category_id="3">治疗后</li>'+
                                '<div class="clear"></div>'+
                                '</ul>'+
                                '</div>'+
                                '</li>';
                            $("#case_img_queue").append(html);
                            t.videoLen= $("#case_img_queue .Ev-videoList").length;
                            $.each($("#case_img_queue .Ev-videoList"),function(i,em){
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
                                t.setVideoStyle();
                                t.setStyle();
                                if($(".add_content").eq(0).text().indexOf("flash")>-1){
                                    $("#uploadify").hide();
                                }
                            });
                            $(".Ev-videoList .pic").attr("src","//img10.allinmd.cn/default/qiniu196_196.jpg");
                            t.uploadVideo(obj);//重新获取token
                        }
                        $('.al-mainInner').css('height',$('#case').offset().top+80+$('#case').outerHeight());
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
                        //$(obj).parent().find(".moxie-shim").remove();
                        $(".Ev-videoList .removeico").on("click",function(){
                            $(".Ev-videoList").remove();
                            t.setVideoStyle();
                            t.setStyle();
                            t.uploadVideo(obj);//重新获取token
                        });
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
        //重置视频上传按钮
        setVideoStyle:function(){
            var t=this;
            t.setStyle();
            t.videoLen=$("#case_img_queue .Ev-videoList").length;
            $(".is_videoNum").text(t.config.videoLen- t.videoLen);
            if(t.videoLen>0){
                $(".add_video").hide();
                $(".add_video_con").show();
                $(".add_img").hide();
                $(".add_img_a").show();
            }
            if(t.videoLen<t.config.videoLen){
                $(".add_video_con").show();
            }else{
                $(".add_video_con").hide();
            }
            if(t.imgLen==0 && t.videoLen==0){
                $("#uploadify").show();
                $(".add_img").show();
                $(".add_img_a").hide();
                $(".add_video").show();
                $(".add_video_con").hide();
            }
        },
        //获取上传图片列表
        getImgList:function(){
            var t=this;
            var data={};
            data.caseId= t.caseId;
            data.attUseFlag= AttUseFlag.g;
            data.uploadFlag=1;
            $.ajax({
                url: t.path.caseAttList,
                type: "post",
                data: data,
                //dataType:"json",
                async:false,
                success: function (data) {
                    var html1="";
                    if(data.responseObject.responseData&&data.responseObject.responseData.data_list){
                        var rows=data.responseObject.responseData.data_list;
                        $.each(rows,function(i,val){
                            if(i>t.imgLen-1||t.imgLen==0){//只加载最新添加的图片
                                html1+='<li class="publish_img_list Ev-imgList" listId="'+val.id+'">'+
                                    '<img class="pic" src="'+val.attUrl+'">'+
                                    '<div class="publish_topic_close_black publish_big_btn"><img src="'+ t.config.imgPath+'images/img_fangda.png"/></div>'+
                                    '<div class="topic_close removeico"><img src="'+ t.config.imgPath+'images/close_tc.png" /></div>'+
                                    '<div class="shoushu_zt">'+
                                    '<ul>'+
                                    '<li '+(val.caseCategoryId==1?'class="active"':'')+' case_category_id="1">治疗前</li>'+
                                    '<li '+(val.caseCategoryId==2?'class="active"':'')+' case_category_id="2">治疗中</li>'+
                                    '<li '+(val.caseCategoryId==3?'class="active"':'')+' style="margin-right:0;" case_category_id="3">治疗后</li>'+
                                    '<div class="clear"></div>'+
                                    '</ul>'+
                                    '</div>'+
                                    '<div class="shoushu_jj"><input class="case_att_name" type="text" placeholder="添加图片描述" value="'+val.caseAttName+'" max="100"/></div>'+
                                    '</li>';
                            }
                        });

                    }
                    $("#case_img_queue").append(html1);
                    $('.al-mainInner').css('height',$('#case').offset().top+80+$('#case').outerHeight());
                    $('input, textarea').placeholder();
                    t.setStyle();
                    t.imgLen=rows.length?rows.length:0;
                    $(".is_videoNum").text(t.config.videoLen- t.videoLen);
                    if(t.len>0){
                        $(".add_img").hide();	//上传图片按钮隐藏
                    }
                    $.each($("#case_img_queue .publish_img_list"),function(i,em){
                        /*$(".pic",$(em)).on("mouseover",function(){
                         $(".publish_big_btn",$(em)).show();
                         })
                         $(".pic",$(em)).on("mouseout",function(){
                         $(".publish_big_btn",$(em)).hide();
                         })
                         $(".publish_big_btn",$(em)).on("mouseover",function(){
                         $(this).show();
                         })
                         $(".publish_big_btn",$(em)).on("mouseout",function(){
                         $(this).hide();
                         });*/
                        //状态选择
                        $("li",$(em)).each(function(j,val){
                            $(this).live("click",function(){
                                $("li",$(em)).removeClass("active");
                                $(this).addClass("active");
                            });
                        });
                        comm.textChange({"$tex":$(".case_att_name",$(em)),noTop:1,"noJudgmentCE":1});
                    });

                    t.conUpload();//继续添加图片
                    t.removeImg();
                    //t.viewBigpic();
                    if(t.imgLen>0){
                        $(".add_img").hide();	//上传图片按钮隐藏
                        $(".add_video").hide(); //上传视频按钮隐藏
                    }
                    if(t.imgLen>0&&t.imgLen< t.config.imgLen){
                        $(".add_img_a").show();
                    }else{
                        $(".add_img_a").hide();
                    }
                    if(t.imgLen>0&&t.videoLen<t.config.videoLen){
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
            $.each($(".Ev-imgList .removeico"),function(){
                $(this).live("click",function(){
                    var removeLi=$(this).parents("li");
                    $(".publish_mask").show();
                    var data={};
                    var param={};
                    data.id=$(this).parents("li").attr("listId");
                    param.paramJson= $.toJSON(data);
                    $.ajax({
                        url: t.path.caseAttDelete,
                        type: "post",
                        data: param,
                        dataType:"json",
                        success:function(data){
                            $(".publish_mask").hide();
                            if(data.responseObject.responseStatus){
                                removeLi.remove();
                                $('.al-mainInner').css('height',$('#case').offset().top+80+$('#case').outerHeight());
                                t.setStyle();
                                t.imgLen=$("#case_img_queue .Ev-imgList").length;
                                if(t.imgLen< t.config.imgLen){
                                    $(".add_img_a").show();
                                }
                                if(t.videoLen<t.config.videoLen){
                                    $(".add_video_con").show();
                                }
                                if(t.imgLen==0 && t.videoLen==0){
                                    if($(".add_content").text().lastIndexOf("flash")<=-1){
                                        $("#uploadify").show();
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
            var list=$("#case_img_queue .publish_img_list");
            list.css("marginRight","16px");
            list.each(function(i,em){
                if(i%3===2){
                    $(em).css("marginRight","0");
                }
            });
            if(list.length%3==2){
                $(".add_video_con").css("marginLeft","0");
            }else{
                $(".add_video_con").css("marginLeft","16px");
            }
            /*if(list.length%3==0){
             $(".add_img_a").css("height","auto");
             }else{
             $(".add_img_a").css("height","285px");
             }*/
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

                    $("#areaExp").html(html);
                    t.selectXuezu();
                }
            });
        },
        //选择学组
        selectXuezu:function(){
            var t=this;
            $(".xuezu_x","#case").bind("click",function(){
                clearTimeout(t.timer);
                $(".publish_zy_position","#case").css("bottom",-$(".publish_zy_position","#case").outerHeight());
                $(".publish_zy_position","#case").show();
                t.mouse=true;
            });
            $(".xuezu_x","#case").bind("mouseover",function(){
                if(t.mouse){
                    clearTimeout(t.timer);
                    $(".publish_zy_position", "#case").show();
                }
            });
            $(".xuezu_x","#case").bind("mouseout",function(){
                if(t.mouse){
                    t.timer=setTimeout(function(){
                        $(".publish_zy_position","#case").hide();
                        t.mouse=false;
                    },500);

                }
            });
            //下拉学组鼠标移入
            $(".publish_zy_position li","#case").live("mouseover",function(){
                if($(this).attr("select-status")===undefined || $(this).attr("select-status")==="false") {//未选择
                    $(".publish_zy_position li", "#case").removeClass("active");
                    $(this).addClass("active");
                }
                return false;
            });
            //下拉学组鼠标移出
            $(".publish_zy_position li","#case").live("mouseout",function(){
                $(".publish_zy_position li","#case").removeClass("active");
                return false;
            });
            //下拉学组鼠标点击
            $(".publish_zy_position li","#case").die("click").live("click",function(){
                var tagName=$(this).text();
                var tagId=$(this).attr("tagId");
                if(!$(this).attr("no-change")){
                    if($(this).attr("select-status")===undefined || $(this).attr("select-status")==="false"){//未选择
                        $(this).addClass("disable");
                        $(this).attr("select-status","true");
                        t.createSelectedItem(tagName,tagId);
                    }else{                                   //已选择
                        $(this).removeClass("disable");
                        $(this).attr("select-status","false");
                        t.clearTag(tagName,tagId);
                    }
                }

            });
        },
        // 选中后添加关键词
        createSelectedItem:function(keyName,tagId,no){
            var t = this;
            $("#areaTitle").css("top",20);//所属专业上浮
            var el = $("<li><div class='tab_text tagName' tagId="+tagId+">"+keyName+"</div>"+
                "<div class='tc_close' "+(no?"no-change='true'":"")+"><img src='"+t.config.imgPath+"images/close.png' /></div>"+
                "</li>");

            el.find(".tc_close").click(function(){
                if(!$(this).attr("no-change")) {
                    t.clearTag(keyName, tagId);
                    t.clearDownSelector(el.find(".tagName"));
                    return false;
                }
            });

            $("#areaSel").append(el);
        },
        // 清除标签
        clearTag:function(keyName,tagId){
            $.each($("#areaSel li"),function(i,em){
                if($(em).find(".tagName").text()==keyName){//$(em).find(".tagName").attr("tagId")==tagId
                    $(em).remove();
                }
            });
            if($("#areaSel li").length===0){
                $("#areaTitle").css("top",26);
            }
        },
        // 取消下拉学组的其中一个选中状态
        clearDownSelector:function(obj){
            $.each($("#areaExp li"),function(i,em){
                if($(em).text()===obj.text()){//$(em).attr("tagId")===obj.attr("tagId")
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
                        $("#tagSel").append(html);
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
                        $("#tagSel").append(html);
                        $(this).val("");
                    }
                }else{
                    if($("#tagSel li").length===0){
                        $(".default_name_new").hide();
                        $(this).addClass("mr_input");
                        $(this).attr("placeholder","标签（多个用逗号或者回车分隔）");
                    }
                }
            });
            $("#tagSel .tc_close").live("click",function(){
                $(this).parent().remove();
                if($("#tagSel li").length===0){
                    $(".default_name_new").hide();
                    $("#tag_input").addClass("mr_input");
                    $("#tag_input").attr("placeholder","标签（多个用逗号或者回车分隔）");
                }
            })
        },
        //发布取消
        publishCancel:function(){
            var t=this;
            $("#cancel_case").on("click",function(){
                if($("#case input").val()==''&&$("#case textarea").val()==''&&$("#case_img_queue li").length==0&&!$("input[name='sex_id']").attr("checked")){
                    $("#case")[0].innerHTML="";
                    $("#case").remove();
                    $('.al-mainInner').css('height','');
                    comm.LightBox.hide();
                }else{
                    $("#case .cancel_mask").show();
                    $("#case .upload_end").show();
                    var scrollTop=$(window).scrollTop();
                    if(scrollTop> t.options.top){//当滚动高度大于弹层top值
                        var top=($("#case").height()-(scrollTop-t.options.top))/2+(scrollTop-t.options.top);
                        $("#case .upload_end").css({"top":top});
                    }else{
                        $("#case .upload_end").css({top:50+'%'});
                    }
                    /*if($(".upload_end","#case").height>window.innerHeight){
                     var top=(window.innerHeight-$("#case .upload_end").height())/2+$(document).scrollTop();
                     $("#case .upload_end").css({"top":top});
                     }else{
                     $("#case .upload_end").css({top:50+'%'});
                     }*/
                    $("#case .continue_edit").off("click").on("click",function(){
                        $("#case .cancel_mask").hide();
                        $("#case .upload_end").hide();
                    });
                    $("#case .cancel_pub").off("click").on("click",function(){
                        $(".select_tc").remove();
                        $("#firstStep").remove();
                        $("#secondStep").remove();
                        $("#case")[0].innerHTML="";
                        $("#case").remove();
                        $('.al-mainInner').css('height','');
                        comm.LightBox.hide();
                        if(t.caseId && t.options.caseBtn){
                            $.ajax({
                                type : "post",
                                url : t.path.caseDelete,
                                data : {paramJson:$.toJSON({"caseId":t.caseId})},
                                dataType : "json",
                                success : function(rep){
                                    if(rep.responseObject.responseStatus){}
                                },
                                error:function(){}
                            });
                        }
                    });
                }
                t.options.indexLogin&& t.options.indexLogin();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"病例发布取消",
                    browType:83,
                    actionId:45
                });
            });
        },
        publish:function(){
            //主要信息
            var t=this;
            var params1={};
            var data1={};
            //var position=$("#areaExp li");
            //var tagList='';
            //for(var i=0; i<position.length; i++){
            //    if(position.eq(i).attr("select-status")=="true"){
            //        tagList+=position.eq(i).attr("tagId")+'_'+position.eq(i).text()+',';
            //    }
            //};
            var sexId=0;
            var sex=$("input[name='sex_id']");
            for(var i=0; i<sex.length; i++){
                if(sex[i].checked){
                    sexId=sex[i].value;
                }
            }
            var caseAttachmentParam='';
            var imgList;
            if(t.options.editBtn){//编辑病例
                imgList=$("#case_img_queue .publish_img_list");
            }else{//发布病例
                imgList=$("#case_img_queue .Ev-imgList");
            }
            $.each(imgList,function(i,em){
                var case_category_id='';
                var case_att_name='';
                var _this=$(this);
                $.each($("li",$(this)),function(j,val){
                    if($(this).attr("class")=="active" && _this.attr("listId")){
                        case_category_id=_this.attr("listId")+"_"+$(this).attr("case_category_id");
                        if($(".case_att_name",_this).val()){
                            case_att_name="_"+$(".case_att_name",_this).val();
                        };
                        case_category_id+=case_att_name;
                        caseAttachmentParam+=case_category_id+",";
                    }
                });
            });
            if(t.options.editBtn) {//修改
                data1.moidfyTime=1;
            }else{
                //TODO 活动ID
                data1.activityId= t.options.activityId?t.options.activityId:"";
            }
            data1.caseId= t.caseId;
            data1.isValid=1;
            data1.caseName=$("#case_name").val();
            data1.age=$("#age").val();
            data1.ageMonth=$("#month").val();
            data1.ageDay=$("#day").val();
            data1.mainNarrate=$("#main_narrate").val();
            data1.illnessHistory=$("#illness_history").val();
            data1.mainNarrate=$("#main_narrate").val();
            data1.professionalChecking=$("#professional_checking").val();
            data1.discussion=$("#discussion").val();
            data1.platformId= $("#sesDepartment").val();
            //data1.tagList=tagList.substring(0,tagList.length-1);
            //data1.areasExpertise=tagList.substring(0,tagList.length-1);
            if(t.options.propertyIdList){
                data1.propertyIdList= t.options.propertyIdList;//从标签专题页带过来的标签id;
            }
           
            data1.sexId=sexId;
            data1.caseAttachmentParam=caseAttachmentParam.substring(0,caseAttachmentParam.length-1);
            if(t.videoListId){
                data1.deleteVideoIds=t.videoListId.substring(0,t.videoListId.length-1);
            }
            if(t.customerIds){
                data1.refCustomerIdList= t.customerIds.substring(0,t.customerIds.length-1);
            }
            //TODO 新版活动报名添加赛区和类别的参数
            if(t.options.property){
                data1.property= t.options.property;//JSON.stringify(t.options.property);
            }
            if(t.options.property_area){
                data1.property_area= t.options.property_area;//JSON.stringify(t.options.property_area);
            }
            params1.paramJson= $.toJSON(data1);
            //更多信息
            //if(t.options.editBtn){
            var params={};
            var data={};
            data.id=$("#id").val();
            data.caseId= t.caseId;
            data.pastHistory=$("#past_history").val();
            data.personalHistory=$("#personal_history").val();
            data.familyHistory=$("#family_history").val();
            data.auxiliaryInfo=$("#auxiliary_info").val();
            data.diagnosisInfo=$("#diagnosis_info").val();
            data.treatmentRecord=$("#treatment_record").val();
            data.operationName=$("#operation_name").val();
            data.intraoperativeInfo=$("#intraoperative_info").val();
            data.productInfo=$("#product_info").val();
            params.paramJson= $.toJSON(data);
            //}
            if(!data1.mainNarrate){
                alert("请填写主诉!");
                return;
            }
            if(!data1.discussion){
                alert("请填写讨论!");
                return;
            }
            if(!data1.caseName){
                alert("请填写标题!");
                return;
            }

            if(!data1.sexId){
                alert("请选择性别!");
                return;
            }
            if(data1.age==""){
                alert("请填写年龄!");
                return;
            }
            if(data1.age==0&&!data1.ageDay){
                alert("病人年龄中天数必填!");
                return;
            }
            if(data1.age>120||data1.age<0){
                alert("病人年龄在0~120岁之间!");
                return;
            }
            if(data1.age>=0&&data1.age<=5){
                if(data1.ageMonth<0||data1.ageMonth>12){
                    alert("病人年龄中月在0~12月之间!");
                    return;
                }
                if((data1.ageDay<1||data1.ageDay>28)&&data1.ageDay){
                    alert("病人年龄中天数在1~28天之间!");
                    return;
                }
            }
            if(data1.ageMonth==""){
                data1.ageMonth=0;
            };
            if(data1.ageDay==""){
                data1.ageDay=0;
            };
            //if(t.options.editBtn){//修改
            $(".publish_mask").show();
            $(".sup_mask").show();
            //}else{//发布
            // $(".publish_mask").show();
            // }
            if(t.videoLen>0 && t.key>0){
                var params2 = {};
                var data2 = {};
                data2.key= t.key;
                data2.persistentId= t.persistentId;
                data2.videoName= t.videoName;
                data2.refType=7;
                data2.caseId= t.caseId;
                $.each($(".Ev-videoList li"),function(i,em){
                    if($(this).attr("class")=="active"){
                        data2.caseCategoryId=$(this).attr("case_category_id");
                    }
                })
                data2.platformId= $("#sesDepartment").val();
                params2.paramJson = $.toJSON(data2);
                $.ajax({
                    type : "post",
                    url : t.path.videoInfo,
                    data : params2,
                    dataType : "json",
                    success : function(rep){
                        t.options.indexLogin&& t.options.indexLogin();
                        if(!(rep&&rep.responseObject.responseStatus)){
                            $(".publish_mask").hide();
                            if(rep.responseObject.responseMessage){//没数据的时候不做提示
                                $.topTip({mark:"warn",content:rep.responseObject.responseMessage});
                            }
                            return false;
                        }else{
                            //主要信息提交
                            $.ajax({
                                url: t.path.caseUpdate,
                                type: "post",
                                data: params1,
                                dataType:"json",
                                success:function(json){

                                    if(json.responseObject.responseStatus){
                                        if(json.responseObject.responseData.case_baseinfo){
                                            url=json.responseObject.responseData.case_baseinfo.pageStoragePath;
                                        }else{
                                            url="/";
                                        }
                                        //if(t.options.editBtn){//修改
                                        if($("#case_sup").html()==undefined){//没有更多信息
                                            //判断页面是否生成
                                            //comm.ajaxExistHtml(url,function(){
                                            $(".publish_mask").hide();
                                            $(".select_tc").remove();
                                            $("#firstStep").remove();
                                            $("#secondStep").remove();
                                            $("#case")[0].innerHTML="";
                                            $("#case").remove();
                                            comm.LightBox.hide();
                                            if(t.options.editBtn) {//修改
                                                $.topTip({mark:"success",content:"成功更新病例信息！"});
                                                t.options.updateBack&&t.options.updateBack();
                                                $('.al-mainInner').css('height','');
                                            }else{
                                                $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});
                                                if(t.options.publishBack){
                                                    t.options.publishBack();
                                                    $('.al-mainInner').css('height','');
                                                }else{
                                                    g_sps.jump(null,url);
                                                }
                                            }
                                            //});

                                        }else{//有更多信息
                                            //更多信息提交
                                            $.ajax({
                                                url: t.path.caseSupSave,
                                                type: "post",
                                                data: params,
                                                dataType:"json",
                                                success:function(data){
                                                    $(".sup_mask").hide();
                                                    if(data.bo&&data.bo.responseStatus){
                                                        //判断页面是否生成
                                                        //comm.ajaxExistHtml(url,function(){
                                                        $(".publish_mask").hide();
                                                        $(".select_tc").remove();
                                                        $("#firstStep").remove();
                                                        $("#secondStep").remove();
                                                        $("#case")[0].innerHTML="";
                                                        $("#case").remove();
                                                        $("#case_sup").remove();
                                                        comm.LightBox.hide();
                                                        if(t.options.editBtn) {//修改
                                                            $.topTip({mark:"success",content:"成功更新病例信息！"});
                                                            t.options.updateBack&&t.options.updateBack();
                                                            $('.al-mainInner').css('height','');
                                                        }else{
                                                            $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});
                                                            if(t.options.publishBack){
                                                                t.options.publishBack();
                                                                $('.al-mainInner').css('height','');
                                                            }else{
                                                                g_sps.jump(null,url);
                                                            }
                                                        }
                                                        //});

                                                    }else{
                                                        $(".publish_mask").hide();
                                                        $.topTip({mark:"warn",content:"未发布成功，请稍后再试！"});
                                                    }

                                                }
                                            });
                                        }
                                        /*}else{//发布
                                         $("#case").remove();
                                         comm.LightBox.hide();
                                         $.topTip({mark:"success",content:"成功发布病例！"});
                                         if(t.options.publishBack){
                                         t.options.publishBack();
                                         }else{
                                         window.open(url);
                                         }
                                         }*/
                                    }else{
                                        $(".publish_mask").hide();
                                        $.topTip({mark:"warn",content:"未发布成功，请稍后再试！"});
                                    }

                                }
                            });
                        }
                    },
                    error:function(){}
                });
            }else{
                //主要信息提交
                $.ajax({
                    url: t.path.caseUpdate,
                    type: "post",
                    data: params1,
                    dataType:"json",
                    success:function(json){

                        if(json.responseObject.responseStatus){
                            if(json.responseObject.responseData.case_baseinfo){
                                url=json.responseObject.responseData.case_baseinfo.pageStoragePath;
                            }else{
                                url="/";
                            }
                            //if(t.options.editBtn){//修改
                            if($("#case_sup").html()==undefined){//没有更多信息
                                //判断页面是否生成
                                //comm.ajaxExistHtml(url,function(){
                                $(".publish_mask").hide();
                                $(".select_tc").remove();
                                $("#firstStep").remove();
                                $("#secondStep").remove();
                                $("#case")[0].innerHTML="";
                                $("#case").remove();
                                comm.LightBox.hide();
                                if(t.options.editBtn) {//修改
                                    $.topTip({mark:"success",content:"成功更新病例信息！"});
                                    t.options.updateBack&&t.options.updateBack();
                                    $('.al-mainInner').css('height','');
                                }else{
                                    $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});
                                    if(t.options.publishBack){
                                        t.options.publishBack();
                                        $('.al-mainInner').css('height','');
                                    }else{
                                        g_sps.jump(null,url);
                                    }
                                }
                                //});

                            }else{//有更多信息
                                //更多信息提交
                                $.ajax({
                                    url: t.path.caseSupSave,
                                    type: "post",
                                    data: params,
                                    dataType:"json",
                                    success:function(data){
                                        $(".sup_mask").hide();
                                        if(data.bo&&data.bo.responseStatus){
                                            //判断页面是否生成
                                            //comm.ajaxExistHtml(url,function(){
                                            $(".publish_mask").hide();
                                            $(".select_tc").remove();
                                            $("#firstStep").remove();
                                            $("#secondStep").remove();
                                            $("#case")[0].innerHTML="";
                                            $("#case").remove();
                                            $("#case_sup").remove();
                                            comm.LightBox.hide();
                                            if(t.options.editBtn) {//修改
                                                $.topTip({mark:"success",content:"成功更新病例信息！"});
                                                t.options.updateBack&&t.options.updateBack();
                                                $('.al-mainInner').css('height','');
                                            }else{
                                                $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});
                                                if(t.options.publishBack){
                                                    t.options.publishBack();
                                                    $('.al-mainInner').css('height','');
                                                }else{
                                                    g_sps.jump(null,url);
                                                }
                                            }
                                            //});

                                        }else{
                                            $(".publish_mask").hide();
                                            $.topTip({mark:"warn",content:"未发布成功，请稍后再试！"});
                                        }

                                    }
                                });
                            }
                            /*}else{//发布
                             $("#case").remove();
                             comm.LightBox.hide();
                             $.topTip({mark:"success",content:"成功发布病例！"});
                             if(t.options.publishBack){
                             t.options.publishBack();
                             }else{
                             window.open(url);
                             }
                             }*/
                        }else{
                            $(".publish_mask").hide();
                            $.topTip({mark:"warn",content:"未发布成功，请稍后再试！"});
                        }

                    }
                });
            }

        },
        //编辑病例
        editCase:function(){
            var t=this;
            this.options.editBtn.die("click").live("click",function(){
                //if (!t.options.top) {
                var tTop = $(document).scrollTop();
                t.options.top = tTop +(tTop!=0?50:80);
                t.options.left = ($(window).width() - 713) / 2;
                //}
                var $this=$(this);
                if($(this).attr("on")=="true"||$(this).attr("on")==undefined){
                    $(this).attr("on",false);
                    t.imgLen=0;
                    t.videoLen=0;
                    t.caseId=$(this).attr("caseId");
                    t.htmlInit();
                    //上传图片
                    t.uploadImg();
                    var data={};
                    var param={};
                    data.caseId=t.caseId;
                    data.logoUseFlag=UseFlag.c;
                    data.attUseFlag=AttUseFlag.g;
                    param.paramJson= $.toJSON(data);
                    $.ajax({
                        url: t.path.caseInfo,
                        type: "post",
                        data:param,
                        dataType:"json",
                        success: function (data) {
                            $this.attr("on",true);
                            if(data.responseObject.responseData&&data.responseObject.responseData.data_list.length>0){
                                t.getData(data.responseObject.responseData.data_list);
                                var list=data.responseObject.responseData.data_list[0];
                                var videoCont=[];var caseCont=[];
                                videoCont=list.case_video_url_list_1.concat(list.case_video_url_list_2).concat(list.case_video_url_list_3);
                                caseCont=list.case_att_url_list_1.concat(list.case_att_url_list_2).concat(list.case_att_url_list_3);
                                t.uploadVideo("#Ev_uploadVideo");
                                t.uploadVideo("#uploadify_vcon");
                                t.getNewImgList(caseCont);
                                t.getVideo(videoCont);
                                t.caseSupplement(list.case_supplement);

                                $("#publish_case").die("click").live("click",function(){
                                    if(!t.videoUped){//视频已上传完成后才能发布
                                        return false;
                                    }
                                    t.publish();	//发布
                                });
                            }
                        }

                    });
                }

            });
        },
        //编辑时获取图片
        getNewImgList:function(data){
            var t=this;
            var html1="";
            if(data.length>0){
                $.each(data,function(i,val){
                    if(i>t.imgLen-1||t.imgLen==0){//只加载最新添加的图片
                        html1+='<li class="publish_img_list Ev-imgList" listId="'+val.id+'">'+
                        '<img class="pic" src="'+val.attUrl+'">'+
                        '<div class="publish_topic_close_black publish_big_btn"><img src="'+ t.config.imgPath+'images/img_fangda.png"/></div>'+
                        '<div class="topic_close removeico"><img src="'+ t.config.imgPath+'images/close_tc.png" /></div>'+
                        '<div class="shoushu_zt">'+
                        '<ul>'+
                        '<li '+(val.caseCategoryId==1?'class="active"':'')+' case_category_id="1">治疗前</li>'+
                        '<li '+(val.caseCategoryId==2?'class="active"':'')+' case_category_id="2">治疗中</li>'+
                        '<li '+(val.caseCategoryId==3?'class="active"':'')+' style="margin-right:0;" case_category_id="3">治疗后</li>'+
                        '<div class="clear"></div>'+
                        '</ul>'+
                        '</div>'+
                        '<div class="shoushu_jj"><input class="case_att_name" type="text" placeholder="添加图片描述" value="'+val.caseAttName+'" max="100"/></div>'+
                        '</li>';
                    }
                });

            }
            $("#case_img_queue").append(html1);
            $('input, textarea').placeholder();
            t.setStyle();
            t.imgLen=data.length?data.length:0;
            $(".is_videoNum").text(t.config.videoLen- t.videoLen);
            if(t.len>0){
                $(".add_img").hide();	//上传图片按钮隐藏
            }
            $.each($("#case_img_queue .publish_img_list"),function(i,em){
                //状态选择
                $("li",$(em)).each(function(j,val){
                    $(this).live("click",function(){
                        $("li",$(em)).removeClass("active");
                        $(this).addClass("active");
                    });
                });
                comm.textChange({"$tex":$(".case_att_name",$(em)),noTop:1,"noJudgmentCE":1});
            });

            t.conUpload();//继续添加图片
            t.removeImg();
            //t.viewBigpic();
            if(t.imgLen>0){
                $(".add_img").hide();	//上传图片按钮隐藏
                $(".add_video").hide(); //上传视频按钮隐藏
            }
            if(t.imgLen>0&&t.imgLen< t.config.imgLen){
                $(".add_img_a").show();
            }else{
                $(".add_img_a").hide();
            }
            if(t.imgLen>0&&t.videoLen<t.config.videoLen){
                $(".add_video_con").show();
            }else{
                $(".add_video_con").hide();
            }
        },
        //编辑是获取视频的数据
        getVideo:function(data){
            var t=this;
            var html="";
            t.videoListId="";
            if(data.length==0){
                return false;
            }
            $.each(data,function(i,val){
                var attUrl=val.logoUrl;
                var play_icon='<div class="publish_play_icon"><img src="'+ t.config.imgPath+'images/play.png" /></div>';
                if(attUrl.lastIndexOf("default")>0){
                    attUrl="//img10.allinmd.cn/default/qiniu196_196.jpg";
                    play_icon="";
                }
                html+='<li class="publish_img_list Ev-videoList" listId="'+val.attId+'" style="height:285px">'+
                    '<img class="pic" src="'+attUrl+'">'+
                    play_icon+
                        /*'<div class="publish_topic_close_black publish_big_btn"><img src="'+ t.config.imgPath+'images/img_fangda.png"/></div>'+*/
                    '<div class="topic_close removeico"><img src="'+ t.config.imgPath+'images/close_tc.png" /></div>'+
                    '<div class="shoushu_zt">'+
                    '<ul>'+
                    '<li '+(val.caseCategoryId==1?'class="active"':'')+' case_category_id="1">治疗前</li>'+
                    '<li '+(val.caseCategoryId==2?'class="active"':'')+' case_category_id="2">治疗中</li>'+
                    '<li '+(val.caseCategoryId==3?'class="active"':'')+' style="margin-right:0;" case_category_id="3">治疗后</li>'+
                    '<div class="clear"></div>'+
                    '</ul>'+
                    '</div>'+
                    '</li>';
            });
            $("#case_img_queue").append(html);
            t.setVideoStyle();
            $.each($("#case_img_queue .Ev-videoList"),function(i,em){
                //状态选择
                $("li",$(em)).each(function(j,val){
                    $(this).live("click",function(){
                        $("li",$(em)).removeClass("active");
                        $(this).addClass("active");
                    });
                });

            });
            $.each($(".Ev-videoList .removeico"),function(){
                $(this).on("click",function(){
                    if($(this).parent().attr("listId")){
                        t.videoListId+=$(this).parent().attr("listId")+',';
                        $(this).parent().remove();
                        t.setVideoStyle();
                    }
                })
            })
        },
        //填充数据
        getData:function(data){
            var t=this;
            caseCon=data[0].case_baseinfo;
            $("#case_name").val(caseCon.caseName);
            $("#age").val(caseCon.age);
            $("#month").val(caseCon.ageMonth?caseCon.ageMonth:"");
            $("#day").val(caseCon.ageDay>0?caseCon.ageDay:"");
            $("#main_narrate").val(caseCon.mainNarrate);
            $("#illness_history").val(caseCon.illnessHistory);
            $("#professional_checking").val(caseCon.professionalChecking);
            $("#discussion").val(caseCon.discussion);
            $.each($(".input_write01"),function(i,em){
                if($(this).find("input").val()!==''){
                    $(this).css("top",34);
                    $(this).prev().show();
                }
            });
            if($("#discussion").val()!==""){
                $("#discussion").parent().css("top",34);
                $("#discussion").parent().prev().show();
            }
            t.ageFocus(caseCon.age);

            var sexId=caseCon.sexId;
            var sex=$("input[name='sex_id']");
            $.each(sex,function(i,em){
                sex[i].checked=false;
                if($(this).attr("value")==sexId){
                    sex[i].checked=true;
                }
            });

            //var tagList=data[0].case_tag_list;
            //var html="";
            //if(tagList.length>0){
            //    $("#areaTitle").css("top",20);//所属专业上浮
            //    $.each(tagList,function(i,n){
            //        t.createSelectedItem(tagList[i].tagName,tagList[i].tagId);
            //        $.each($("#areaExp li"),function(j,em){
            //            if($(this).attr("tagid")==tagList[i].tagId){
            //                $(this).addClass("disable").attr("select-status","true");
            //            }
            //        });
            //    });
            //}

        },
        //继续完善病例
        caseSupplement:function(data){
            var t=this;
            $("#addMore").die("click").live("click",function(){

                $("#case").hide();
                if($("#case").attr("addmore")=="true"){
                    $("#case_sup").show();
                }else{
                    t.options.container.append(t.template.caseSupTem({
                        top:t.options.top,
                        left: t.options.left,
                        userImg:t.options.userImg,
                        imgPath:t.config.imgPath
                    }));
                }
                if(t.options.editBtn){
                    if($("#case").attr("addmore")=="true"){//已经取过值

                    }else{//未取过值
                        /*$.ajax({
                         url: t.path.caseSupInfo,
                         type: "post",
                         data:{"caseId": t.caseId},
                         dataType:"json",
                         success: function (data) {*/
                        if(!data||comm.isEmptyObject(data)){
                            $("#id").val(0);
                        }else{
                            $("#id").val(data.id);
                            $("#past_history").val(data.pastHistory);
                            $("#personal_history").val(data.personalHistory);
                            $("#family_history").val(data.familyHistory);
                            $("#auxiliary_info").val(data.auxiliaryInfo);
                            $("#diagnosis_info").val(data.diagnosisInfo);
                            $("#treatment_record").val(data.treatmentRecord);
                            $("#operation_name").val(data.operationName);
                            $("#intraoperative_info").val(data.intraoperativeInfo);
                            $("#product_info").val(data.productInfo);
                            $.each($(".input_write01"),function(i,em){
                                if($(this).find("input").val()!=''){
                                    $(this).css("top",34);
                                    $(this).prev().show();
                                }
                            });
                        }
                        /*}
                         });*/
                    }
                }
                $("#case_sup").find("input[placeholder], textarea[placeholder]").placeholder();	// 表单默认值 插件
                $(".fixed").css("top",0);
                $("#publish_sup").die("click").live("click",function(){
                    t.publish();	//发布
                });
                t.caseSupBtn();
            });

        },
        //完善病例的一些事件处理
        caseSupBtn:function(){
            var t=this;
            comm.textChange({"$tex":$("#past_history"),"$num":$(".past_num"),"noJudgmentCE":1});

            comm.textChange({"$tex":$("#personal_history"),"$num":$(".personal_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#family_history"),"$num":$(".family_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#auxiliary_info"),"$num":$(".aux_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#diagnosis_info"),"$num":$(".diag_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#treatment_record"),"$num":$(".record_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#operation_name"),"$num":$(".ope_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#intraoperative_info"),"$num":$(".intra_num"),"noJudgmentCE":1});
            comm.textChange({"$tex":$("#product_info"),"$num":$(".pro_num"),"noJudgmentCE":1});
            $("#cancel_sup").bind("click",function(){//完善病例取消
                $("#case_sup .cancel_mask").show();
                $("#case_sup .upload_end").show();

                $("#case_sup .continue_edit").bind("click",function(){
                    $("#case_sup .cancel_mask").hide();
                    $("#case_sup .upload_end").hide();
                });
                $("#case_sup .cancel_pub").bind("click",function(){
                    comm.LightBox.hide();
                    $("#case_sup").remove();
                    $("#case")[0].innerHTML="";
                    $("#case").remove();
                    $("#case").show().attr("addmore","");
                    $('.al-mainInner').css('height','');
                });
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"取消",
                    browType:83,
                    actionId:45
                });
            });
            $(".back").bind("click",function(){//返回上一页
                $("#case_sup").hide();
                $("#case").show().attr("addmore","true");
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"返回",
                    browType:83,
                    actionId:41
                });
            });

            var top=$(".fixed").offset().top;
            var maxTop=$(".t_but_case_bottom").offset().top;
            $(window).bind("scroll",function(){
                var scrollTop=$(document).scrollTop();
                if($("#case_sup").length>0){
                    if(scrollTop>top){
                        if(scrollTop>maxTop){
                            $(".fixed").css("top",maxTop-$("#case_sup").offset().top-$(".fixed").height());
                        }else{
                            $(".fixed").css("top",scrollTop-top);
                        }
                    }else{
                        $(".fixed").css("top",0);
                    }
                }

            });
        }
    }

    controller.init(obj);
};
