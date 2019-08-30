/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/12
 * @author: sunhaibin
 */
$(function(){
    var ctrl={
        path:{
            url:PC_CALL+ "cms/theme/getMapList/",
            suggest:PC_CALL+'customer/suggestion/create/',       //专题反馈
            getShareContent:PC_CALL+'comm/data/share/getMapList3/'
        },
        commParam:{
            sortType:5,
            pageIndex:1,
            pageSize:20,
            themeType:0
        },
        init:function(){
            var t=this;
            t.commSearch();
            t.commResponse();
        },
        commSearch:function(){
            var t=this;
            var pageClick = function(o){
                t.commParam.pageIndex=o;
                t.getRes(function(n){
                    $('.pager').pager({pagenumber:o,pagecount:n,buttonClickCallback: pageClick});
                })
            };
            t.getRes(function(n){
                $('.pager').pager({pagenumber:1,pagecount:n,buttonClickCallback: pageClick});
            });
        },
        getRes:function(fn){
            var t=this;
            comm.LightBox.showloading();
            $.ajax({
                url: t.path.url,
                type:"post",
                data:{paramJson: $.toJSON(t.commParam)},
                dataType:'json',
                success:function(data){
                    if(data&&data.responseObject.responseData&&!$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list.length){
                        comm.LightBox.hideloading();
                        var item =data.responseObject.responseData.data_list;
                        var arr=[];
                        var lis ='';
                        $.each(item,function(i,e){
                            lis = t.listTemplate({
                                isLiving: e.isLiving,
                                isHot: e.isHot,
                                isNew: e.isNew,
                                themeStoragePath: e.themeStoragePath,
                                themeLogoUrl: e.themeLogoUrl,
                                themeName: e.themeName
                            })
                            arr.push(lis);
                        });

                        arr=arr.join("");
                        $('.ev_subjectWrap').html(arr);
                        var pageCount = Math.ceil(data.responseObject.responseData.total_count/ t.commParam.pageSize);
                        //分页
                        fn&&fn(pageCount);
                        t.shareAction(t.commParam);
                    }else{
                        comm.LightBox.hideloading();
                        $('.ev-shareContainer').hide();
                    }
                }

            })
        },
        shareAction:function(param){
            var t=this;
            var o = $.extend(param,{"sceneType":getShareContentSense.by_subject});
            var sinaTitle="";var qqTitle="";var qZoneTitle="";
            module.share({
                container:$ ( ".ev-shareContainer" ),// 存放分享组件的父级
                type:2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                url:document.location.href,// 分享链接， 默认取当前页链接
                h5Url: '',//h5页面的链接会生成微信二维
                title: "",// 分享标题
                shareTrend: 0,//0: 不需要站内动s态分享  1 ：需要站内动态分享
                trendUrl: '',// 分享到站内动态的接口
                data: {},// 分享到站内动态的接口参数
                callback: function () {},// 分享到站内动态成功后回调函数
                triggerRequest:function(content){//事件点击
                    $.ajax({
                        url: t.path.getShareContent,
                        type: "post",
                        data: {paramJson: $.toJSON(o)},
                        dataType: 'json',
                        async:false,
                        success: function (d) {
                            if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                var item = d.responseObject.responseData.data_list[0];
                                content.pic = item.share_comm.shareImageUrl;
                                content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                $.each(item.share_channel,function(i,el){
                                    if(el.shareChannel=='Sina'){
                                        sinaTitle=content.sinaTitle=el.shareDesc;
                                    }else if(el.shareChannel=="QQFriend"){
                                        qqTitle=content.qqTitle = el.shareTitle;
                                        content.qqSummary = el.shareDesc;
                                    }else if(el.shareChannel=="QZone"){
                                        qZoneTitle=content.qqZoneTitle=el.shareTitle;
                                        content.qqZoneSummary = el.shareDesc;
                                    }
                                });
                            }
                        }

                    });
                },
                shareSinaSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:shareSenceConst.discover_by_subject,
                        shareChannel:3,
                        shareContent:sinaTitle
                    });
                },
                shareQQSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:shareSenceConst.discover_by_subject,
                        shareChannel:2,
                        shareContent:qqTitle
                    });
                },
                shareQzoneSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: "",
                        refId: "",
                        shareSence:shareSenceConst.discover_by_subject,
                        shareChannel:1,
                        shareContent:qZoneTitle
                    });
                }
            });
        },
        listTemplate:function(kv){
            var _hotT = "";
            if(kv.isLiving==1){
                _hotT ='<i class="al-discover_SMC_LiveIcon"></i>';
            }else{
                if(kv.isHot==1){
                    _hotT ='<i class="al-discover_SMC_HotIcon"></i>';
                }else if(kv.isNew==1){
                    _hotT ='<i class="al-discover_SMC_NewIcon"></i>';
                }
            }
            var html = '<section class="al-discover_subMainContent">'+
                       '     <figure>'+
                            _hotT+
                       '     <a href="'+kv.themeStoragePath+'"><img src="'+kv.themeLogoUrl+'" alt=""/></a>'+
                       '     </figure>'+
                       '     <p><a href="'+kv.themeStoragePath+'">'+kv.themeName+'</a></p>'+
                       '</section>';
            return html;
        },
        commResponse:function(){
            var t=this;
            $('.ev_writeDown').click(function(){
                if($('#sesCustomerId').val()!=undefined&&$('#sesCustomerId').val()!=""){//已登录
                    $('.al-responseEntry').hide();
                    $('.al-dis_subSideBar').show();
                    $('#ev_textArea').val($.cookie('sub_suggest')!=undefined? $.cookie('sub_suggest'):'');
                }else{
                    user.login({
                        callback:function(){
                            $('.al-responseEntry').hide();
                            $('.al-dis_subSideBar').show();
                            $('#ev_textArea').val($.cookie('sub_suggest')!=undefined? $.cookie('sub_suggest'):'');
                        },
                        scene:privilegeSceneConst.eSceneTypeLogin
                    })
                }
            });
            //提交
            $('.ev_submit').click(function(){
                if($(this).attr('disable')=='true'){
                    return false;
                }else{

                    var _val = $.trim($('#ev_textArea').val());
                    if(_val==""){
                        $('#ev_textArea').focus();
                        if(comm.browser.isIe8()){
                            $('#ev_textArea').css('paddingLeft',"13px");
                        }
                        return false;
                    }else{
                        $(this).attr('disable','true');
                        var param={
                            customerId:$('#sesCustomerId').val(),
                            suggestion:_val,
                            siteId:1,
                            customerName:$('#sesCustomerId').data('name')!=""?$('#sesCustomerId').data('name'):$('#sesCustomerId').data('userName'),
                            suggestionType:2   //1-系统意见反馈;2-专题反馈
                        };
                        comm.LightBox.showloading()
                        $.ajax({
                            url: t.path.suggest,
                            type:"post",
                            data:{paramJson: $.toJSON(param)},
                            dataType:'json',
                            success:function(data){
                                $('.ev_submit').attr('disable','false');
                                comm.LightBox.hideloading();
                                if(data&&data.responseObject.responseStatus){
                                    $.topTip({mark:"success",showTime:2,content:"感谢您的反馈！我们会尽快处理"});
                                    $.removeCookie('sub_suggest');
                                    $('.al-responseEntry').show();
                                    $('.al-dis_subSideBar').hide();
                                }
                            },
                            error:function(){
                                comm.LightBox.hideloading();
                                $('.ev_submit').attr('disable','false');
                            }
                        })
                    }
                }

            });
            //取消
            $('.ev_cancelSubmit').click(function(){
                $('.ev_submit').attr('disable','false');
                if($('#ev_textArea').is(':visible')&&$.trim($('#ev_textArea').val())!=""){
                    $.makeSurePopup({
                        title:"放弃编辑",//弹窗标题
                        content01:"确定放弃当前编辑的内容吗？",//弹窗内容字体会加粗 (可不传)
                        content:"",//弹窗内容
                        url:"",//ajax请求接口（可不传，不传就不发请求）
                        param:"",//ajax请求参数(可不传)
                        toJSON:1,//传参是否为paramJSPN 0或1，默认为1
                        callback:function(){
                            $.topTip({mark:"success",showTime:2,content:"您的申请信息已被保存，下次可以继续编辑"});
                            $.cookie('sub_suggest', $.trim($('#ev_textArea').val()), {expires: 365});
                            setTimeout(function(){
                                $('.al-responseEntry').show();
                                $('.al-dis_subSideBar').hide();
                            },1000);
                        },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                        error:function(){}//ajax请求失败后执行的方法(可不传)
                    });
                }else{
                    $.removeCookie('sub_suggest');
                    $('.al-responseEntry').show();
                    $('.al-dis_subSideBar').hide();
                }


            });
            $('body').on('click','a:not(.al-discover_subjectSideBar a, .al-release a)',function(){
                var self =this;
                $('.ev_submit').attr('disable','false');
                if($('#ev_textArea').is(':visible')&& $.trim($('#ev_textArea').val())!=""){
                    $.makeSurePopup({
                        title:"放弃编辑",//弹窗标题
                        content01:"确定放弃当前编辑的内容吗？",//弹窗内容字体会加粗 (可不传)
                        content:"",//弹窗内容
                        url:"",//ajax请求接口（可不传，不传就不发请求）
                        param:"",//ajax请求参数(可不传)
                        toJSON:1,//传参是否为paramJSPN 0或1，默认为1
                        callback:function(){
                            $.topTip({mark:"success",showTime:2,content:"您的申请信息已被保存，下次可以继续编辑"});
                            $.cookie('sub_suggest', $.trim($('#ev_textArea').val()), {expires: 365});
                            setTimeout(function(){
                                var href = $(self).attr('href');
                                g_sps.jump(null,href);
                            },1000);
                        },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                        error:function(){}//ajax请求失败后执行的方法(可不传)
                    });
                    return false;
                }

            });
            //字数提示
            comm.textChange({"$tex":$("#ev_textArea"),"$num":$(".ev_numTip"),"noTop":1});
        }
    } ;
    ctrl.init();
});
