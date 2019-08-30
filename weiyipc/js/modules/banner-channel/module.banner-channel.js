/**
 * 功能描述：大首页和频道页幻灯片图片的追加
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/05/03.
 */

module.bannerChannel=function(Obj){
    var defaults= {
        containerImg: '',//图片容器
        containerNum: '',//数字容器,首页不传
        pathUrl: PC_CALL + 'ad/position/profile/getMapList/',//请求地址
        firstResult: 0,
        maxResult: 100,
        visitSiteId:1,//pc 1  h52
        channelId:68, //channelId:''//113-病例 78-视频 81-文库 114-话题  68-首页
        isIndex:''//是否是首页,首页传1，频道页不传值
    };

    var options= $.extend(defaults,Obj);

    var controller={
        path:{

        },

        addBanner:{
            bannerImg:function(data){
                return '<li>'+
                '<a href="'+data.linkUrl+'" target="_blank">'+
                    '<img  alt="'+data.adAttName+'" src="'+data.adAttUrl+'" /></a>'+
                '</li>';
            },

            bannerNum:function(num){
                return  '<li >'+num+ '. </li>';
            },

            indexBannerImg:function(i,kv){
                return   '<li class="item1" '+(i>0?'style="display:none"':'')+'>'+
                '<a href="'+kv.linkUrl+'" target="_blank" style="background-image: url('+kv.adAttUrl+')">'+
                    '<div class="wrapper"></div>'+
                    '</a>'+
                    '</li>';
            }
        },

        init:function(Obj) {
            var t=this;
            t.loadData();
        },
        loadData:function(){
          var t=this;
            $.ajax({
                url:options.pathUrl,
                type:'POST',
                data: {paramJson: $.toJSON({
                    firstResult:options.firstResult,
                    maxResult:options.maxResult,
                    visitSiteId:options.visitSiteId,
                    channelId:options.channelId
                })},
                dataType:"json",
                success:function(data){
                    if($.isEmptyObject(data)||$.isEmptyObject(data.responseObject.responseData)){ return false;}
                    var items = data.responseObject.responseData.data_list[0].ad_profile_attachment;
                    var html = "",html2="";
                    $.each(items,function(i,el){
                        if(options.isIndex==1){
                            html+= t.addBanner.indexBannerImg(i,el);
                        }else{
                            html+= t.addBanner.bannerImg(el);
                            html2+=t.addBanner.bannerNum(i+1);
                        }

                    });

                    if(options.isIndex==1){//大首页
                        $(options.containerImg).html(html);
                        module.indexBanner();
                    }else{
                        $(options.containerImg).html(html);
                        $(options.containerNum).html(html2).find("li:last").css("border","none");
                        module.bannerCarousel();    // 幻灯片
                    }

                }
            });
        }


    };
    controller.init(Obj);


};