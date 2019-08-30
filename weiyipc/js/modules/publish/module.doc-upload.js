/**
 * 功能描述：  发布文档
 * 使用方法:   module.docUpload({
 *                  editBtn:$(""),//编辑按钮
                    docBtn:$("#doc_upload"),//创建点击btn
                    container:$(".personal_content"),//存放弹层的外层
                    top:126,//弹层top值
                    userImg:"头像地址",//是否有用户头像
                    activityId:xxx,//活动ID 不传表示普通上传
                    property:{},//活动时选择的专业和术式
                    property_area:{}//新版活动赛区参数
                });
 * 注意事件：
 * 引入来源：引入第三方插件/third-party/ajaxfileupload.js  作用：ajax异步上传插件
 *
 * Created by LiChunHui on 2015/3/24.
 */
module.docUpload=function(obj){
    controller={
        config : {
            imgPath:"//modules.allinmd.cn/publish/",
            docImg:"//modules.allinmd.cn/publish/images/word02.png",
            pptImg:"//modules.allinmd.cn/publish/images/ppt02.png",
            pdfImg:"//modules.allinmd.cn/publish/images/pdf02.png",
            doc:"//modules.allinmd.cn/publish/images/word01.png",
            ppt:"//modules.allinmd.cn/publish/images/ppt01.png",
            pdf:"//modules.allinmd.cn/publish/images/pdf01.png",
            defaultImg:"//modules.allinmd.cn/publish/images/pdf02.png"
        },
        el : {

        },
        path : {
            getAreaExpertise: PC_CALL+"commdata/getAreaExpertise/",
            docAttCreate: PC_CALL+"doc_attachment/upload/",
            docUpdate: PC_CALL+"customer/doc/update/",
            docInfo: PC_CALL+"customer/doc/info/",
            artCreate: PC_CALL+"customer/doc/create/"
        },
        template : {
            //1.选择文档或文章
            select: function(option){
                var html="";
                html+='<div class="doc_tc al_publishCon" id="select_doc" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                '<div class="doc_tc_bg"></div>'+ 
                '<div class="doc_tc_content">'+
                '<div class="doc_tc_title font_yahei">选择你希望发布的方式</div>'+
                '<div class="doc_tc_upload">'+
                '<div class="doc_tc_l">'+
                '<a href="javascript:;" class="file_btn_new">'+
                //'<input type="file" name="file" id="upload_file"  style="width:100px;height:32px;"/>'+
                '</a>'+
                '<div class="doc_tc_img">' +
                '<a href="javascript:;" class="file_btn_big">'+
                '<input type="file" name="file" id="upload_file_big" />'+
                '</a>'+
                '</div>'+
                '<div class="doc_tc_but ev_inputBtn">'+
                /*'<a href="javascript:;" class="file_btn_new">'+
                '<input type="file" name="file" id="upload_file" />'+
                '</a>'+*/
                '</div>'+
                '<div class="doc_tc_text">支持PDF格式，大小20M之内</div>'+
                '</div>'+
                '<div class="doc_tc_r">'+
                '<div class="doc_tc_img"><img class="upload_art" src="'+option.imgPath+'images/bj_img.jpg" /></div>'+
                '<div class="doc_tc_but"><img id="upload_art"  src="'+option.imgPath+'images/bj_but.jpg" /></div>'+
                '<div class="doc_tc_text">支持文本编辑等多项操作</div>'+
                '</div>'+
                '<div class="clear"></div>'+
                '</div>'+
                '<div class="no_fabu" id="now_no">暂不发布</div>'+
                '</div>'+
                '</div>'
                return html;
            },
            //上传文档start
            docTem:function(option){
                var html="";
                html+='<div class="doc_tc al_publishCon" id="content_doc" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                '<!-- 发布遮罩 -->'+
                '<div class="publish_mask">'+
                '<img src="//modules.allinmd.cn/publish/images/loading6060.gif" />'+
                '</div>'+
                '<!-- 点击取消遮罩 -->'+
                '<div class="cancel_mask"></div>'+
                '<div class="upload_end">'+
                '<div class="upload_question"><span></span>接下来你想....</div>'+
                '<div class="bjfb_but">'+
                '<div><a href="javascript:;"><img class="continue_edit" src="//modules.allinmd.cn/publish/images/go_bj.png" /></a></div>'+
                '<div style="margin-left:25px;"><a href="javascript:;"><img class="cancel_pub" src="//modules.allinmd.cn/publish/images/qx_fb.png" /></a></div>'+
                '</div>'+
                '</div>'+
                (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                '<div class="fb_doc">'+
                '<div class="doc_tc_bg"></div>'+
                '<div class="upload_top">'+
                '<div class="upload_top_img">'+
                '<img id="file_icon" src="'+option.imgPath+'images/pdf02.png">'+
                '</div>'+
                '<div class="upload_top_center" '+(option.edit?'style="display:none"':'')+'>'+
                    '<div class="uploading">'+
                        '<div class="upload_icon_status"></div><div class="upload_status">正在上传文档</div> <div class="file_name"></div>'+
                        '<div class="clear"></div>'+
                        '</div>'+
                    '<div class="jdt_img" style="display: block;">'+
                        '<div class="jdt_content"></div>'+
                    '</div>'+
                    '<div class="upload_success" style="display: none;">唯医网的文档均需审核哦！</div>'+
                    /*'<div class="miao_text">剩余时间 12秒</div>'+*/
                    '</div>'+
                '<div class="upload_success_text font_yahei" '+(option.edit?'':'style="display:none"')+'></div>'+
                '<div class="upload_top_text">'+
                    '<a href="#" class="select_anew">'+
                        '<input type="file" name="file" id="upload_anew">'+
                            '</a>'+
                        '</div>'+
                    '<div class="clear"></div>'+
                '</div>'+
                '<div class="upload_center">'+
                '<div class="upload_title">'+
                '<div class="found_case_small">'+
                '<div class="default_name font_yahei">标题</div>'+
                '<div class="input_write01">'+
                '<input type="text" id="doc_title" placeholder="标题" class="font_yahei" max="50">'+
                '</div>'+
                '<div class="djs_num title_num">50</div>'+
                '</div>'+
                '</div>'+
                '<div class="upload_textarea">'+
                '<div class="default_name font_yahei">正文</div>'+
                '<div class="textarea_write">'+
                '<textarea placeholder="正文" id="abstract" class="font_yahei" max="1000" style="top: 14px"></textarea>'+
                '</div>'+
                '<div class="ds_text text_num">1000</div>'+
                '</div>'+
                /*'<div class="xuezu_x">'+
                '<div class="found_case_big">'+
                '<div class="default_name font_yahei" id="areaTitle" style="display:block;top:26px">所属专业</div>'+
                '<div class="input_write">'+
                '<ul class="tc_tab_list tc_tab_list11"></ul>'+//选中专业存放
                '</div>'+
                '</div>'+
                '<div class="clear"></div>'+
                '<div class="publish_zy_position">'+
                '<ul id="areaExp"></ul>'+//专业数据
                '</div>'+
                '</div>'+
                '<div class="clear"></div>'+*/
                '<div class="clear"></div>'+
                '<div class="radio_upload font_yahei">'+
                '<div><input type="radio" name="authorType" value="1">我是第一作者 </div>'+
                '<div><input type="radio" name="authorType" value="2">我是第一译者 </div>'+
                '<div><input type="radio" name="authorType" value="3">我是联合作者 </div>'+
                '<div><input type="radio" name="authorType" value="4">我是联合译者 </div>'+
                '<div><input type="radio" name="authorType" value="5">转载 </div>'+
                '</div>'+
                '</div>'+
                '<div class="t_but">'+
                '<div class="publish_t_fb can_fb" id="doc_save">发布</div>'+
                '<div class="publish_t_qx" id="doc_cancel">取消</div>'+
                ' </div>'+
                '</div>'+
                '</div>';
                return html;
            },
            //撰写文章
            articleTem:function(option){
                var html="";
                html='<div class="doc_tc al_publishCon" id="content_art" style="top:'+option.top+'px;'+(option.left?"left:"+option.left+"px":"")+'">'+
                '<!-- 发布遮罩 -->'+
                '<div class="publish_mask">'+
                '<img src="//modules.allinmd.cn/publish/images/loading6060.gif" />'+
                '</div>'+
                '<!-- 点击取消遮罩 -->'+
                '<div class="cancel_mask"></div>'+
                '<div class="upload_end">'+
                '<div class="upload_question"><span></span>接下来你想....</div>'+
                '<div class="bjfb_but">'+
                '<div><a href="javascript:;"><img class="continue_edit" src="//modules.allinmd.cn/publish/images/go_bj.png" /></a></div>'+
                '<div style="margin-left:25px;"><a href="javascript:;"><img class="cancel_pub" src="//modules.allinmd.cn/publish/images/qx_fb.png" /></a></div>'+
                '</div>'+
                '</div>'+
                (option.userImg?'<div class="tc_jiao"></div><div class="channel_right_user_img"><img src="'+option.userImg+'"/></div>':'')+
                '<div class="fb_doc">'+
                '<div class="doc_tc_bg"></div>'+
                '<div class="fb_doc_main">'+
                '<div class="found_case_small art_title">'+
                '<div class="default_name font_yahei">标题</div>'+
                '<div class="input_write01">'+
                '<input type="text" id="article_title" placeholder="标题" class="font_yahei" max="50">'+
                '</div>'+
                '<div class="djs_num artTitle_num">50</div>'+
                '</div>'+
                '<div class="chajian">' +
                '<div id="article_content">'+
                    '<textarea id="article_content_redactor" class="ckeditor" name="content"></textarea>'+
                '</div>'+
                '</div>'+
                /*'<div class="found_case_big write_topic_cont" style="margin-top:0">'+
                '<div class="default_name_new font_yahei default_art" >标签（多个用逗号或者回车分隔）</div>'+
                '<div class="input_write">'+
                '<ul class="tc_tab_list" id="tagSel_art" style="float:none"></ul>'+
                '<input type="text" id="tag_input_art" placeholder="标签（多个用逗号或者回车分隔）" class="mr_input font_yahei">'+
                '<div class="clear"></div>'+
                '</div>'+
                '</div>'+*/
                /*'<div class="xuezu_x" style="border-bottom:none;width:628px">'+
                '<div class="found_case_big">'+
                '<div class="default_name font_yahei" id="areaTitle" style="display:block;top:26px">所属专业</div>'+
                '<div class="input_write">'+
                '<ul class="tc_tab_list tc_tab_list12"></ul>'+//选中专业存放
                '</div>'+
                '</div>'+
                '<div class="clear"></div>'+
                '<div class="publish_zy_position">'+
                '<ul id="areaExp12"></ul>'+//专业数据
                '</div>'+
                '</div>'+
                '<div class="clear"></div>'+*/
                '<div class="clear"></div>'+

                '</div>'+
                '<div class="t_but">'+
                '<div class="publish_t_fb can_fb" id="art_save">发布</div>'+
                '<div class="publish_t_qx" id="art_cancel">取消</div>'+
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
            if(t.options.docBtn){
                this.selectDoc();
                t.options.docBtn.attr("on",true);
            }
            if(t.options.editBtn){
                this.editDoc();
                t.options.editBtn.attr("on",true);
            }
        },
        //点击文档弹出层
        selectDoc:function(){
            var t=this;
            if(t.options.oneUpload){//TODO:针对活动只有一个资源发布时先清除click事件
                t.options.docBtn.off("click");
            }
            t.options.docBtn.on("click",function(){
                //if (!t.options.top) {
                var tTop = $(document).scrollTop();
                t.options.top = tTop +(tTop!=0?50:80);
                t.options.left = ($(window).width() - 713) / 2;
                //}
                var $this=$(this);
                if($(this).attr("on")=="true") {
                    $(this).attr("on", false);
                    user.login({
                        callback: function () {
                            $this.attr("on",true);
                            t.options.indexLogin && t.options.indexLogin();
                            t.options.container.css("position", "relative");
                            comm.LightBox.show(95, "#3c3c3d");
                            comm.LightBox.setZIndex(8);
                            t.options.container.append(t.template.select({
                                top: t.options.top,
                                left: t.options.left,
                                userImg: t.options.userImg,
                                imgPath: t.config.imgPath
                            }));
                            t.cancelBtn();
                            t.fileChange("#upload_file");
                            t.fileChange("#upload_file_big");
							 $('.ev_inputBtn').click(function(){
							 	$('#upload_file_big').click();
							 });
                            t.uploadArticle();
                        },
                        onClose: function () {
                            $this.attr("on",true);
                            t.options.indexLogin && t.options.indexLogin();
                        },
                        onAuthCancel: function () {
                            $this.attr("on",true);
                            t.options.indexLogin && t.options.indexLogin();
                        },
                        scene: privilegeSceneConst.eSceneTypePublic
                    });
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "发布",
                        keyword: "发布文库",
                        actionId: 59
                    });
                    return false;
                }
            });
        },
        //点击取消
        cancelBtn:function(){
            var t=this;
            $("#now_no").bind("click",function(){
                comm.LightBox.hide();
                $("#select_doc").remove();
            });
        },
        //选中文件后触发
        fileChange:function(obj){
            var t=this;
            $(obj).bind("change",function() {
                t.widthNum = 0;
                var name = t.getName($(this));
                var fileName = name.length > 15 ? name.substring(0, 15) + '...' : name + '.' + t.getFileName($(this));

                if (t.getSuffixName($(this))) {
                    var fileSize = t.getFileSize(document.getElementById(obj.substring(1)));
                    if (fileSize > 20971520) {
                        alert("文件不能大于20M");
                        $(this).val("");
                        return false;
                    } else {
                        $("#select_doc").hide();
                        t.options.container.append(t.template.docTem({
                            top:t.options.top,
                            left: t.options.left,
                            userImg:t.options.userImg,
                            imgPath:t.config.imgPath
                        }));
                        $("#content_doc").find("input[placeholder], textarea[placeholder]").placeholder();	// 表单默认值 插件
                        t.getImgType($(this));
                        t.progressBar(t.widthNum);
                        $(".file_name").text("《"+fileName+"》");
                        $("#doc_title").val(name);
                        if (name) {
                            $("#doc_title").parent().css("top", 34);
                            $("#doc_title").parent().parent().find(".default_name").show();
                        }
                        comm.textChange({"$tex":$("#doc_title"),"$num":$(".title_num")});
                        comm.textChange({"$tex":$("#abstract"),"$num":$(".text_num"),"minTop":14});
                        t.par="#content_doc";
                        //t.getXuezu($("#areaExp"));

                        t.publishCancel();
                        t.uploadAnewChange($(this).val());
                    }
                } else {
                    alert("请选择pdf格式的文件");
                    $(this).val("");
                    return false;
                }

                //ajax异步上传文件的控件
                $.ajaxFileUpload({
                    type: 'POST',
                    url: t.path.docAttCreate,
                    secureuri: false,
                    fileElementId: obj.substring(1),//file控件id
                    dataType: '',
                    success: function (data, status) {
                        var dataJSON = eval("(" + data.body.innerHTML + ")");
                        if (dataJSON.responseStatus) {
                            t.docId = dataJSON.responsePk;
                            t.widthNum = 100;
                            clearInterval(t.timer);
                            $("#file_icon").attr("src",$("#file_icon").attr("suc_img"));
                            $(".jdt_content").animate({width: '100%'}, 200);
                            $(".jdt_img").hide();
                            $(".upload_success").show();
                            $(".upload_status").text("成功上传文档");
                            $(".upload_icon_status").addClass("success_upload_doc");
                            t.uploadStatus = true;
                            t.publish();
                            $("#select_doc").remove();
                        } else {
                            t.uploadFaild();
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        //t.uploadFaild();
                        //document.title=XMLHttpRequest+":"+textStatus+":"+errorThrown
                    }
                });
            })
        },
        //进度条
        progressBar:function(num){
            var t=this;
            clearInterval(t.timer);
            t.timer=setInterval(function(){
                num+=2;
                $(".jdt_content").animate({width:num+'%'},200);
                //$(".jd_bfb").text(num+"%");
                if(num==100||num>100){
                    clearInterval(t.timer);
                }
            },300);
        },
        //重新选择
        uploadAnewChange:function(oldFileName){
            var t=this;
            $("#upload_anew").die("change").live("change",function(){
                t.widthNum2=0;
                if(t.getSuffixName($("#upload_anew"))){
                    var fileSize =t.getFileSize(document.getElementById("upload_anew"));
                    if(fileSize>20971520){
                        alert("文件不能大于20M");
                        return false;
                    }else{
                        if(oldFileName!=$(this).val()){
                            t.uploadStatus=false;
                            oldFileName=$(this).val();
                            $(".upload_top_center").show();
                            $(".upload_success_text").hide();
                            var name=t.getName($(this));
                            var fileName=name.length>15?name.substring(0,15)+'...':name+'.'+t.getFileName($(this));
                            $("#doc_title").val(name);
                            clearInterval(t.timer);
                            t.widthNum=0;
                            $(".jdt_img").show();
                            $(".upload_success").hide();
                            $(".upload_icon_status").removeClass("success_upload_doc");
                            $(".jdt_content").css("width",0);
                            t.progressBar(t.widthNum2);
                            $(".upload_status").text("正在上传文档");
                            $(".file_name").text("《"+fileName+"》");
                            $.ajaxFileUpload({
                                type:'POST',
                                url: t.path.docAttCreate,
                                secureuri :false,
                                fileElementId :'upload_anew',//file控件id
                                dataType :'',
                                success: function(data,status){
                                    var dataJSON = eval("(" + data.body.innerHTML + ")");
                                    if(dataJSON.responseStatus){
                                        t.docId=dataJSON.responsePk;
                                        t.widthNum2=100;
                                        clearInterval(t.timer);
                                        $("#file_icon").attr("src",$("#file_icon").attr("suc_img"));
                                        $(".jdt_content").animate({width:'100%'},200);
                                        $(".jdt_img").hide();
                                        $(".upload_success").show();
                                        $(".upload_status").text("成功上传文档");
                                        $(".upload_icon_status").addClass("success_upload_doc");
                                        t.uploadStatus=true;
                                        t.publish();
                                    }else{
                                        t.uploadFaild();
                                    }
                                },
                                error:function (XMLHttpRequest, textStatus, errorThrown) {
                                    // t.uploadFaild();
                                }
                            });
                        }
                    }
                }else{
                    alert("请选择pdf格式的文件");
                    $(this).val("");
                    return false;
                }
            });
        },
        //获取文件后缀
        getFileName:function(obj){
            var path = obj.val();
            var pos1 = path.lastIndexOf(".");
            var pos = path.substring(pos1 + 1, path.length);
            return pos;
        },
        //获取文件名不包括后缀
        getName:function(obj){
            var path = obj.val();
            var pos1 = path.lastIndexOf('/');
            var pos2 = path.lastIndexOf("\\");
            var pos3=Math.max(pos1, pos2);
            var pos4 = path.lastIndexOf(".");
            var pos = path.substring(pos3 + 1,pos4);
            return pos;
        },
        //根据文件后缀名改变图标
        getSuffixName:function(obj){
            var path = obj.val();
            var pos1 = path.lastIndexOf(".");
            var pos = path.substring(pos1 + 1, path.length);
            //return /(pdf)|(doc)|(docx)|(ppt)|(pptx)$/i.test(pos);
            return /(pdf)$/i.test(pos);
        },
        getFileSize:function(target){
            var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
            var fileSize = 0;
            if(target){
                if (isIE && !target.files) {
    //            var filePath = target.value;
    //            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
    //
    //            if(!fileSystem.FileExists(filePath)){
    //               alert("附件不存在，请重新输入！");
    //               return;
    //            }
    //            var file = fileSystem.GetFile (filePath);
    //            fileSize = file.Size;
                } else {
                    fileSize = target.files[0].size;
                }
            }
            return fileSize  ;
        },
        getImgType:function(obj){
            var t=this;
            var path = obj.val();
            var pos1 = path.lastIndexOf(".");
            var pos = path.substring(pos1 + 1, path.length);

            switch(pos.toLowerCase()){
                case 'doc':
                    $("#file_icon").attr("src", t.config.docImg).attr("suc_img", t.config.doc);
                    break;
                case 'docx':
                    $("#file_icon").attr("src", t.config.docImg).attr("suc_img", t.config.doc);
                    break;
                case 'ppt':
                    $("#file_icon").attr("src", t.config.pptImg).attr("suc_img", t.config.ppt);
                    break;
                case 'pptx':
                    $("#file_icon").attr("src", t.config.pptImg).attr("suc_img", t.config.ppt);
                    break;
                case 'pdf':
                    $("#file_icon").attr("src", t.config.pdfImg).attr("suc_img", t.config.pdf);
                    break;
                default:
                    $("#file_icon").attr("src", t.config.defaultImg);
            };

        },
        //获取专业数据
        getXuezu:function(obj){
            var html='';
            var t=this;
            $.ajax({
                type: "POST",
                url: t.path.getAreaExpertise,
                dataType: "json",
                async:false,
                success: function(data){
                    $.each(data,function(i,n){
                        html+='<li tagId='+data[i].id+'>'+data[i].tagName+'</li>';
                    });

                    obj.html(html);
                    t.selectXuezu();
                }
            });
        },
        //选择学组
        selectXuezu:function(){
            var t=this;
            $(".xuezu_x",t.par).off("click").on("click",function(){
                clearTimeout(t.timer);
                $(".publish_zy_position",t.par).css("bottom",-$(".publish_zy_position",t.par).outerHeight());
                $(".publish_zy_position",t.par).show();
                t.mouse=true;
            });
            $(".xuezu_x",t.par).off("mouseover").on("mouseover",function(){
                if(t.mouse){
                    clearTimeout(t.timer);
                    $(".publish_zy_position", t.par).show();
                }
            });
            $(".xuezu_x",t.par).off("mouseout").on("mouseout",function(){
                if(t.mouse){
                    t.timer=setTimeout(function(){
                        $(".publish_zy_position",t.par).hide();
                        t.mouse=false;
                        clearTimeout(t.timer);
                    },500);

                }
            });
            //下拉学组鼠标移入
            $(".publish_zy_position li", t.par).live("mouseover",function(){
               if($(this).attr("select-status")===undefined || $(this).attr("select-status")==="false") {//未选择
                   $(".publish_zy_position li", t.par).removeClass("active");
                   $(this).addClass("active");
               }
               return false;
            });
            //下拉学组鼠标移出
            $(".publish_zy_position li", t.par).live("mouseout",function(){
                $(".publish_zy_position li", t.par).removeClass("active");
                return false;
            });
            //下拉学组鼠标点击
            $(".publish_zy_position li", t.par).die("click").live("click",function(){
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
            $("#areaTitle").css("top",20);//所属专业上浮
            var el = $("<li><div class='tab_text tagName' tagId="+tagId+">"+keyName+"</div>"+
            "<div class='tc_close'><img src='"+t.config.imgPath+"images/close.png' /></div>"+
            "</li>");

            el.find(".tc_close").click(function(){
                t.clearTag(keyName,tagId);
                t.clearDownSelector(el.find(".tagName"));
                return false;
            });

            $(".tc_tab_list", t.par).append(el);
        },
        // 清除标签
        clearTag:function(keyName,tagId){
            $.each($(".tc_tab_list li", this.par),function(i,em){
                if($(em).find(".tagName").attr("tagId")==tagId){
                    $(em).remove();
                }
            });
            if($(".tc_tab_list li").length===0){
                $("#areaTitle", this.par).css("top",26);
            }
        },
        // 取消下拉学组的其中一个选中状态
        clearDownSelector:function(obj){
            $.each($(".publish_zy_position li", this.par),function(i,em){
                if($(em).attr("tagId")===obj.attr("tagId")){
                    $(em).removeClass("disable");
                    $(em).attr("select-status","false");
                    return;
                }
            });

        },
        //发布取消
        publishCancel:function(){
            var t=this;
            $("#doc_cancel").bind("click",function(){
                if($("#doc_title").val()==''&&$("#abstract").val()==''&&!$("input[name='authorType']").attr("checked")){
                    $("#content_doc").remove();
                    comm.LightBox.hide();
                }else{
                    $(".cancel_mask").show();
                    $(".upload_end").show();
                    $(".continue_edit").bind("click",function(){
                        $(".cancel_mask").hide();
                        $(".upload_end").hide();
                    });
                    $(".cancel_pub").bind("click",function(){
                        $("#select_doc").remove();
                        $("#content_doc").remove();
                        comm.LightBox.hide();
                    });
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"文档发布取消",
                    browType:89,
                    actionId:45
                });
            });
        },
        uploadFaild:function(){
            //$(".jdt_img").show();
            $(".jdt_content").css("width",0);
            $(".upload_status").text("上传文档失败");
            $(".upload_icon_status").addClass("upload_error_img");
            clearInterval(this.timer);
            alert("上传失败!请稍后再试");
        },
        //发布
        publish:function(){
            var t=this;
            $("#doc_save").off("click").on("click",function(){
                if(TempCache.getItem("userId")){
                    if(t.uploadStatus){

                        var params={};
                        var data={};
                        var author=$("input[name='authorType']");
                        /*var position=$(".tc_tab_list11 .tagName");
                         var tagIdString='';
                         for(var i=0; i<position.length; i++){
                         tagIdString+=position.eq(i).attr("tagId")+',';

                         };*/
                        var authorType;
                        for(var i=0; i<author.length; i++){
                            if(author[i].checked){
                                authorType=author[i].value;
                            }
                        }
                        data.docId=t.docId;
                        if(t.options.docBtn){
                            data.tplPath=31;
                        }
                        data.docName=$("#doc_title").val();
                        data.docAbstract=$("#abstract").val();
                        data.platformId= $('#sesDepartment').val();
                        //data.tagIdString=tagIdString.substring(0,tagIdString.length-1);
                        data.authorType=authorType;
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

                        if(!data.docName){
                            alert("请填写文档标题！");
                            return;
                        }else if(!data.authorType){
                            alert("请选择版权信息！");
                            return;
                        }
                        t.uploadStatus=false;
                        $(".publish_mask").show();
                        $(".upload_title").css("border-color","");
                        $.ajax({
                            url: t.path.docUpdate,
                            type: "post",
                            dataType:"json",
                            data:params,
                            success: function (data) {
                                if(data&&data.responseObject.responseStatus){
                                    comm.creatEvent({
                                        triggerType: "发布",
                                        keyword: "发布",
                                        actionId: 32,
                                        browType:89//文档上传
                                    });
                                    //alert("发布成功");
                                    if(data.responseObject.responseData.cms_doc){
                                        url=data.responseObject.responseData.cms_doc.pageStoragePath;
                                    }else{
                                        url="";
                                    }
                                    //判断页面是否生成
                                    //comm.ajaxExistHtml(url,function(){
                                    $(".publish_mask").hide();
                                    $("#content_doc").remove();
                                    comm.LightBox.hide();
                                    if(t.options.editBtn){//修改
                                        $.topTip({mark:"success",content:"修改成功，我们会尽快审核！"});
                                        t.options.updateBack&&t.options.updateBack();
                                    }else{//发布
                                        $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});//发布成功，我们会尽快审核！详情请点击<a href='"+url+"' target='_blank'>发布的文档</a>！
                                        t.options.publishBack&&t.options.publishBack();
                                    }
                                    //});

                                }else{
                                    //alert("发布失败");
                                    $(".publish_mask").hide();
                                    t.uploadStatus=true;
                                    $.topTip({mark:"warn",content:"未发布成功，请稍后再试！"});
                                }
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown){
                                t.uploadStatus=true;
                                $(".publish_mask").hide();
                                $.topTip({mark:"warn",content:"未发布成功，请稍后再试！"});
                            }
                        });

                    }
                }else{
                    g_sps.jump(null,"/");
                }
            });
        },
        //文档编辑
        editDoc:function(){
            var t=this;
            t.options.editBtn.die("click").live("click",function(){
                //if (!t.options.top) {
                var tTop = $(document).scrollTop();
                t.options.top = tTop +(tTop!=0?50:80);
                t.options.left = ($(window).width() - 713) / 2;
                //}
                t.docId=$(this).attr("docId");
                $parent=$(this).parents(".article_list_show");
                $.ajax({
                    url: t.path.docInfo,
                    type: "post",
                    dataType:"json",
                    data:{"docId": t.docId},
                    success: function (data) {
                        if(data.rows!=null){
                            if(data.rows[0].doc.tplPath==="52"){//文章
                                t.options.container.css("position","relative");
                                comm.LightBox.show(95,"#3c3c3d");
                                comm.LightBox.setZIndex(8);
                                if($("#content_art").html()!=undefined){
                                    $("#content_art").show();
                                    $(".cancel_mask").hide();
                                    $(".upload_end").hide();
                                    $("#content_art #areaTitle").css("top",26);
                                    //$(".tc_tab_list12").empty();
                                }else{
                                    t.options.container.append(t.template.articleTem({
                                        top:t.options.top,
                                        left: t.options.left,
                                        userImg:t.options.userImg,
                                        imgPath:t.config.imgPath
                                    }));
                                    $(document).append('<script src="/js/third-party/ckeditor/ckeditor.js"></script>');
                                }
                                $("#content_art").find("input[placeholder], textarea[placeholder]").placeholder();	// 表单默认值 插件
                                if (data.rows[0].doc.docName) {
                                    $("#article_title").parent().css("top", 34);
                                    $("#article_title").parent().parent().find(".default_name").show();
                                }
                                $("#article_title").val(data.rows[0].doc.docName);
                                //$(".cke_editable","#content_art").html(data.rows[0].doc.docContent);
                                setTimeout(function(){CKEDITOR.instances.article_content_redactor.setData(data.rows[0].doc_content.docContent)},1000);
                                comm.textChange({"$tex":$("#article_title"),"$num":$(".artTitle_num")});
                                t.par="#content_art";
                                //t.getXuezu($("#areaExp12"));
                                /*var tagList=data.rows[0].doc_tag_list;
                                $.each(tagList,function(i,n){
                                    t.createSelectedItem(tagList[i].tagName,tagList[i].tagId);
                                    $.each($("#areaExp12 li"),function(j,em){
                                        if($(this).attr("tagid")==tagList[i].tagId){
                                            $(this).addClass("disable").attr("select-status","true");
                                        }
                                    });
                                });*/
                                t.cancelArt();
                                t.artSave();
                            }else{//文档
                                t.uploadStatus= true;
                                t.options.container.css("position","relative");
                                comm.LightBox.show(95,"#3c3c3d");
                                comm.LightBox.setZIndex(8);
                                t.options.container.append(t.template.docTem({
                                    top:t.options.top,
                                    left: t.options.left,
                                    userImg:t.options.userImg,
                                    imgPath:t.config.imgPath,
                                    edit:1
                                }));
                                $("#content_doc").find("input[placeholder], textarea[placeholder]").placeholder();	// 表单默认值 插件
                                t.par="#content_doc";
                                //t.getXuezu($("#areaExp"));
                                comm.textChange({"$tex":$("#doc_title"),"$num":$(".title_num")});
                                comm.textChange({"$tex":$("#abstract"),"$num":$(".text_num"),"minTop":14});
                                var docAttFormat=data.rows[0].doc_attachment?data.rows[0].doc_attachment.docAttFormat:'';
                                switch(docAttFormat){
                                    case 'doc':
                                        $("#file_icon").attr("src", t.config.doc);
                                        break;
                                    case 'docx':
                                        $("#file_icon").attr("src", t.config.doc);
                                        break;
                                    case 'ppt':
                                        $("#file_icon").attr("src", t.config.ppt);
                                        break;
                                    case 'pptx':
                                        $("#file_icon").attr("src", t.config.ppt);
                                        break;
                                    case 'pdf':
                                        $("#file_icon").attr("src", t.config.pdf);
                                        break;
                                    default:
                                        $("#file_icon").attr("src", t.config.pdf);
                                };
                                var fixName=docAttFormat?'.'+docAttFormat:''
                                var name=data.rows[0].doc.docName.length>15?data.rows[0].doc.docName.substring(0,15)+'...':data.rows[0].doc.docName+fixName;
                                if (name) {
                                    $("#doc_title").parent().css("top", 34);
                                    $("#doc_title").parent().parent().find(".default_name").show();
                                }
                                if(data.rows[0].doc.docAbstract){
                                    $("#abstract").parent().css("top", 34);
                                    $("#abstract").parent().parent().find(".default_name").show();
                                }
                                $(".upload_success_text").text("《"+name+"》");
                                $("#doc_title").val(data.rows[0].doc.docName);
                                $("#abstract").val(data.rows[0].doc.docAbstract);
                                /*var tagList=data.rows[0].doc_tag_list;
                                $.each(tagList,function(i,n){
                                    t.createSelectedItem(tagList[i].tagName,tagList[i].tagId);
                                    $.each($("#areaExp li"),function(j,em){
                                        if($(this).attr("tagid")==tagList[i].tagId){
                                            $(this).addClass("disable").attr("select-status","true");
                                        }
                                    });
                                });*/
                                var author=$("input[name='authorType']");
                                for(var i=0; i<author.length; i++){
                                    if(data.rows[0].doc_author&&author[i].value==data.rows[0].doc_author.authorType){
                                        author[i].checked=true;
                                        break;
                                    }
                                }
                                t.publish();
                                t.publishCancel();
                                t.uploadAnewChange("");
                            }

                        }
                    }
                });
            });
        },
        uploadArticle:function(){
            var t=this;
            $("#upload_art").bind("click",function(){
                t.artBtnclick();
            });
            $(".upload_art").bind("click",function(){
                t.artBtnclick();
            });
        },
        artBtnclick:function(){
            var t=this;
            $("#select_doc").remove();
            var tTop = $(document).scrollTop();
            t.options.top = tTop +(tTop!=0?50:80);
            t.options.left = ($(window).width() - 713) / 2;
            if($("#content_art").html()!=undefined){
                $("#content_art").show().css({"top": t.options.top,"left": t.options.left});
                $(".cancel_mask").hide();
                $(".upload_end").hide();
                $("#content_art #areaTitle").css("top",26);
                //$(".tc_tab_list12").empty();
            }else{
                t.options.container.append(t.template.articleTem({
                    top:t.options.top,
                    left: t.options.left,
                    userImg:t.options.userImg,
                    imgPath:t.config.imgPath
                }));
                $(document).append('<script src="/js/third-party/ckeditor/ckeditor.js"></script>');
            }
            comm.textChange({"$tex":$("#article_title"),"$num":$(".artTitle_num")});
            //t.tagInput();
            t.par="#content_art";
            //t.getXuezu($("#areaExp12"));
            t.cancelArt();
            t.artSave();
        },
        //文章取消
        cancelArt:function(){
            var t=this;
            $("#art_cancel").bind("click",function(){
                if($("#article_title").val()==''&&CKEDITOR.instances.article_content_redactor.getData()==''){
                    t.delEdit();
                }else{
                    $(".cancel_mask").show();
                    $(".upload_end").show();
                    $(".continue_edit").bind("click",function(){
                        $(".cancel_mask").hide();
                        $(".upload_end").hide();
                    });
                    $(".cancel_pub").bind("click",function(){
                        t.delEdit();
                    });
                }
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"文章发布取消",
                    browType:90,
                    actionId:45
                });
            })
        },
        tagInput:function(){
            var t=this;
            $("#tag_input_art").on("keyup",function(ev){//13:enter键,188:逗号,8:删除
                tagName=$(this).val();
                if(tagName!==""&&$("#tagSel_art li").length<10){
                    $(".default_art").show();
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
                        $("#tagSel_art").append(html);
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
                        $("#tagSel_art").append(html);
                        $(this).val("");
                    }
                }else{
                    if($("#tagSel_art li").length===0){
                        $(".default_art").hide();
                        $(this).addClass("mr_input");
                        $(this).attr("placeholder","标签（多个用逗号或者回车分隔）");
                    }
                }
            });
            $("#tagSel_art .tc_close").live("click",function(){
                $(this).parent().remove();
                if($("#tagSel_art li").length===0){
                    $(".default_art").hide();
                    $("#tag_input_art").addClass("mr_input");
                    $("#tag_input_art").attr("placeholder","标签（多个用逗号或者回车分隔）");
                }
            })
        },
        artSave:function(){
            var t=this;
            $("#art_save").off("click").on("click",function(){
                /*var Tags = "";
                $.each($(".tc_tab_list12 .tagName"),function(i,em){
                    Tags+=$(em).attr("tagId")+",";
                });*/
                if(TempCache.getItem("userId")){
                    var params={};
                    var data={};
                    if(t.options.editBtn){//修改
                        data.docId= t.docId;
                    }else{
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
                    }
                    data.tplPath=52;
                    data.docName = symbolToString($("#article_title").val());
                    //data.tagIdString=Tags.substring(0,Tags.length-1);
                    data.docContent = CKEDITOR.instances.article_content_redactor.getData();
                    if(!data.docName){
                        alert("请输入文章标题！");
                        return;
                    }else if(!data.docContent){
                        alert("请输入文章正文！");
                        return;
                    }/*else if(!data.tagIdString){
                     alert("请选择专业！");
                     return;
                     }*/
                    params.paramJson= $.toJSON(data);
                    $(".publish_mask").show();
                    $.ajax({
                        url : t.options.editBtn?t.path.docUpdate: t.path.artCreate,
                        data : params,
                        dataType:"json",
                        type:"post",
                        success:function (data) {
                            if(data.responseObject.responseStatus){
                                comm.creatEvent({
                                    triggerType: "发布",
                                    keyword: "发布",
                                    actionId: 32,
                                    browType:90//文章编写
                                });
                                if(data.responseObject.responseData.cms_doc){
                                    url=data.responseObject.responseData.cms_doc.pageStoragePath;
                                }else{
                                    url="";
                                }
                                //判断页面是否生成
                                //comm.ajaxExistHtml(url,function(){
                                t.delEdit();
                                $(".publish_mask").hide();
                                if(t.options.editBtn){//修改
                                    $.topTip({mark:"success",content:"修改成功，我们会尽快审核！"});
                                    t.options.updateBack&&t.options.updateBack();
                                }else{//发布
                                    $.topTip({mark:"success",content:"发布成功！审核通过后可在“我的-贡献”查看~"});//发布成功，我们会尽快审核！详情请点击<a href='"+url+"' target='_blank'>发布的文档</a>！
                                    t.options.publishBack&&t.options.publishBack();
                                }
                                //});
                            }else{
                                $(".publish_mask").hide();
                                $.topTip({mark:"warn",content:"发布失败！"});
                            }
                        }
                    });
                }else{
                    g_sps.jump(null,"/");
                }
            })
        },
        delEdit:function(){
            $("#content_art").hide();
            comm.LightBox.hide();
            $("#article_title").val("");
            $("#article_title").parent().css("top",20);
            $("#article_title").parent().prev().hide();
            //$("#tagSel_art").empty();
            $(".default_art").hide();
            $("#tag_input_art").addClass("mr_input");
            $("#tag_input_art").attr("placeholder","标签（多个用逗号或者回车分隔）");
            $(".artTitle_num").text("50").css("color","#c5c5c5");

            CKEDITOR.instances.article_content_redactor.setData('');
        }
    }

    controller.init(obj);
};
