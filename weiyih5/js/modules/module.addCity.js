/**
 * 功能描述：  城市选择
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/18.
 */
module.addCity=function(obj){
    var container={};
    container={
        init:function(options){
            this.options={};
            var o = {callback:function(){}};
            this.options = $.extend(o,options);
            this.getProvince();
            $(".ev-backToMain").on("click",function(){
                setTimeout(function(){
                    $(".ev-mainInner").show();
                    $(".ev-cityInner").hide();
                    $(".ev-sProvince").show();
                    $(".ev-sCity").hide();
                },500);
            });
            //返回
            $("#cityBack").on("click",function(){
                $(".ev-sProvince").show();
                $(".ev-sCity").hide();
            });
        },
        getProvince:function(){
            var t=this;
            var data={};
            data.treeLevel=2;
            data.pageIndex=1;
            data.pageSize=100;
            $.ajax({
                type:'POST',
                url:"/mcall/comm/data/region/json_list/",
                data:data,
                dataType:"json",
                timeout:10000,
                success : function(rep) {
                    var html="";
                    if(rep&&rep.responseObject.responseData.data_list){
                        $.each(rep.responseObject.responseData.data_list,function(i,val){
                            html+='<article class="al-searchResultItem" regionid="'+val.regionId+'">'+val.regionName+'<i class="icon-selected"></i></article>';
                        })
                    }
                    $("#sProvince").html(html);
                    t.getCity();
                }
            });
        },
        //获取市
        getCity:function(){
            var t=this;
            $("#sProvince article").on("click",function(){
                $("#sProvince article").removeClass("selected");
                $(this).addClass("selected");
                var title=$(this).text();
                var data={};
                //data.treeLevel=2;
                data.parentId=$(this).attr("regionid");
                data.pageIndex=1;
                data.pageSize=100;
                comm.loading.show();
                $.ajax({
                    type:'POST',
                    url:"/mcall/comm/data/region/json_list/",
                    data:data,
                    dataType:"json",
                    timeout:10000,
                    success : function(rep) {
                        comm.loading.hide();
                        var html="";
                        if(rep&&rep.responseObject.responseData.data_list){
                            $(".ev-sProvince").hide();
                            $(".ev-sCity").show();
                            $(".icon-backArrow").show();
                            $(".ev-sCity .backTitle").text(title);
                            $.each(rep.responseObject.responseData.data_list,function(i,val){
                                html+='<article class="al-searchResultItem" regionid="'+val.regionId+'">'+val.regionName+'<i class="icon-selected"></i></article>';
                            });
                        }
                        $("#sCity").html(html);
                        t.cityClick();
                    }
                });
            });
        },
        //城市点击
        cityClick:function(){
            var t=this;
            $("#sCity article").on("click",function(){
                $("#sProvince article").removeClass("selected");
                $(this).addClass("selected");
                $(".ev-mainInner").show();
                $(".ev-cityInner").hide();
                $(".ev-sProvince").show();
                $(".ev-sCity").hide();
                t.options.container.css("color","#333").attr("city",$(this).text()).text($(this).text());
                t.options.cityId.val($(this).attr("regionid"));
            })
        }
    }
    container.init(obj);
}
