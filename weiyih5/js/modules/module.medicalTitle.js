/**
 * 功能描述：  职称选择
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/15.
 */
module.medicalTitle=function(obj){
    //Log.createBrowse(132,'职称选择页');
    var controller = {
        path : {
            medical:M_CALL+"comm/data/medicalTitle/json_list/"
        },
        init : function(options){
            var t=this;
            this.options={};
            var o = {callback:function(){}};
            this.options = $.extend(o,options);
            html='<!-- 选择职称  -->'+
            '<section class="al-selectorBarMask ev-medBox">'+
            '<section class="al-selectorBar">'+
            '<header class="al-selectorBarTitle">'+
            '<figure class="al-selectorBarTitleItem al-selectorBarCancel">'+
            '<a href="javascript:void(0)" class="ev-medCancel">取消</a>'+
            '</figure>'+
            '<figure class="al-selectorBarTitleItem">'+
            '<h2>选择职称</h2>'+
            '</figure>'+
            '<figure class="al-selectorBarTitleItem">'+
            '<a href="javascript:void(0)" class="ev-medSave">完成</a>'+
            '</figure>'+
            '</header>'+
            '<section class="al-selectorBarList" id="ev-medical01">'+

            '</section>'+
            '<section class="al-selectorBarList" id="ev-medical02">'+

            '</section>'+
            '<section class="al-selectorBarList" id="ev-medical03">'+

            '</section>'+
            '</section>'+
            '</section>';
            if($('.ev-medBox').length==0){$("body").append(html);}/*else{$('.ev-medBox').addClass('on')};*/
            this.getData();
            t.options.container.parents("article").on("click",function(){
                if($('.ev-medBox').length==0){$("body").append(html);}else{$('.ev-medBox').addClass('on')};
            });
        },
        getData:function(){
            var t=this;
            var html1="",html2="",html3="";
            $.ajax({
                type : "post",
                url : t.path.medical,
                async: false,
                data:{pageIndex:1,pageSize:20,identity:t.options.identityFlag},
                dataType : "json",
                success : function(rep){
                    if(rep&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
                        $.each(rep.responseObject.responseData.data_list,function(i,val){
                            // if(val.medicalTitleId==1){
                                html1+='<section class="al-selectorBarItem" select="no">'+
                                '<figure class="al-selectorBarItemIcon"></figure>'+
                                '<figcaption class="al-selectorBarItemName" medicalid="'+val.id+'">'+val.medicalTitle+'</figcaption>'+
                                '</section>';
                            /*}else if(val.medicalTitleId==2){
                                html2+='<section class="al-selectorBarItem" select="no">'+
                                '<figure class="al-selectorBarItemIcon"></figure>'+
                                '<figcaption class="al-selectorBarItemName" medicalid="'+val.id+'">'+val.medicalTitle+'</figcaption>'+
                                '</section>';
                            }else{
                                html3+='<section class="al-selectorBarItem" select="no">'+
                                '<figure class="al-selectorBarItemIcon"></figure>'+
                                '<figcaption class="al-selectorBarItemName" medicalid="'+val.id+'">'+val.medicalTitle+'</figcaption>'+
                                '</section>';
                            }*/
                        });
                        $("#ev-medical01").html(html1);
                        $("#ev-medical02").html(html2);
                        $("#ev-medical03").html(html3);
                        t.listAction();
                    }

                }
            });
        },
        listAction:function(){
            var t=this;
            var html="";
            var str="";
            $(".al-selectorBarList",".ev-medBox").each(function(i,em){
                $(".al-selectorBarItem",$(em)).each(function(j,obj){
                    $(obj).on("click",function(){
                        html="";
                        str="";
                        if($(this).attr("select")=="no"){
                            $(".al-selectorBarItem",$(em)).attr("select","no");
                            $(".al-selectorBarItem",$(em)).removeClass("selected");
                            $(this).addClass("selected");
                            $(this).attr("select","yes");
                        }else{
                            $(this).removeClass("selected");
                            $(this).attr("select","no");
                        }

                    });
                });
            });
            $(".ev-medSave").on("click",function(){
                var html="";
                var str="";
                $(".al-selectorBarItem",".ev-medBox").each(function(n,val){
                    if($(val).attr("select")=="yes"){
                        html+=$("figcaption",$(val)).text()+"、";
                        str+=$("figcaption",$(val)).attr("medicalid")+"_"+$("figcaption",$(val)).text()+",";
                    }
                });
                if(t.options.wordLen){
                    t.options.container.text(comm.getStrLen(html.substring(0,html.length-1),t.options.wordLen));
                }else{
                    t.options.container.text(html.substring(0,html.length-1));
                }
                if($("#ev-medical01 section[select=yes]").length){  //如果有一级职称
                    t.options.container.attr('medFirstClass',1);
                }else{
                    t.options.container.attr('medFirstClass',0);
                }
                t.options.container.attr("medicalTitle",str.substring(0,str.length-1)).attr("nowVal",str.substring(0,str.length-1));
                if(html){
                    t.options.container.css("color","#333");
                }else{
                    t.options.container.css("color","#aaa").text("请选择");
                }
                t.options.fn&&t.options.fn();
                $(".al-selectorBarMask").removeClass('on');
            });
            $(".ev-medCancel").on("click",function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:'专业领域选择取消',
                    actionId:45
                });
                $(".al-selectorBarMask").removeClass('on');
                $('.ev-medBox .al-selectorBarItem').removeClass('selected').removeAttr('select');
            })
        }
    };
    controller.init(obj);
};
