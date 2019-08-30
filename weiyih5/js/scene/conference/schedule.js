$(function(){
    if(intransit)return;    //  正在跳转中

    comm.bindNav(4,false);


    if(typeof comm.getpara()!=null && !isEmptyObject(comm.getpara())){
        var conId = comm.getpara().conId;
        var conSubId = comm.getpara().conSubId;
        var data = commdata.getData("getAgendaVideoList",{pageIndex:1,pageSize:10000,conSubId:conSubId,conId:conId});
        var nickname;
        if(TempCache.getItem("email")!="" && TempCache.getItem("email")!=null){
            nickname= TempCache.getItem("email");
        }else{
            if(TempCache.getItem("nickname")!="" && TempCache.getItem("nickname")!=null){
                nickname = TempCache.getItem("nickname");
            }else{
                nickname = "游客"+Math.floor(Math.random()*10000%10000);
            }
        }
        /*if(conId=="1407222383186"){    // 需要直播的会场
         var authority = commdata.getData("getConferenceSubList",{pageIndex:1,pageSize:200,conId:conId})[0].authority;     //直播的权限
         TempCache.setItem("fromPage",window.location.href);
         if(authority==1){
         comm.redirect("http://allinmd.gensee.com/webcast/site/entry/join-236c9e05bb6a4823a588352243d6a876?sec=md5&token=25f29f7c0da64c8af4d151769b835a73&nickName="+ nickname);
         }
         if(authority==2){
         user.login("jump","http://allinmd.gensee.com/webcast/site/entry/join-236c9e05bb6a4823a588352243d6a876?sec=md5&token=25f29f7c0da64c8af4d151769b835a73&nickName="+ nickname);

         }
         if(authority==3){
         var auth = user.checkAuth();
         if(auth){
         comm.redirect("http://allinmd.gensee.com/webcast/site/entry/join-236c9e05bb6a4823a588352243d6a876?sec=md5&token=25f29f7c0da64c8af4d151769b835a73&nickName="+ nickname);
         }
         }


         } */

        var dates = getDateArr(data);

        if(dates.length){
        	resourceCount+=data.length;
            var datesStr = "<nav data-role='navbar' id='navBar'><ul>";
            for(var i = 0 ; i< dates.length;i++){
                datesStr += '<li><a href="#">'+dates[i].getFullYear()+"-"+(dates[i].getUTCMonth()+1) +"-" + dates[i].getDate() +'</a></li>';
                //alert(dates[i].toLocaleDateString());
            }
            datesStr+="</ul></nav>";
            $("[data-role=page]").append(datesStr);
            $("#navBar").navbar();

            $("[data-role=page]").append('<div id="listCon"></div>');

            $("#navBar li").on("vclick",function(e){
                var i = $(this).index();
                select(i);
            });

            //$("#navBar li:eq(0)").trigger("click");


            function select(i){
                var date = dates[i];
                var videoArr = [],temp;
                for(var j = 0 ; j<data.length;j++){
                    temp =  new Date(data[j].startTime.replace(/-/g,"/"));
                    if(temp>date && temp<add(date,1)){
                        videoArr.push(data[j]);
                    }
                }


                $("#listCon").html(buildStr(videoArr));
            }
            $("nav a:eq(0)").addClass("ui-btn-active");
            select(0);
        }


        /*var str = '<ul data-role="listview" data-theme="g" class="listv">';
         if(data.length){
         for(var i = 0 ; i< data.length;i++){
         str += '<li><a href="/html/pages/conference/schedule.html?subConId='+ data[i].id +'" data-ajax="false" >'+ data[i].conSubName +'</a></li>';

         }
         }else{
         str = "本会场暂无相关信息，请检查";
         }
         str += "</ul>";*/


    }else{
        alert("无相关数据");
    }

    function getDateArr(data){
        var arr = [], d,datearr;
        for(var i = 0 ;i<data.length;i++){
            datearr = data[i].startTime.split(" ");
            if(data[i].startTime!="" && !isEmptyObject(data[i].startTime)){
                console.log(datearr[0]);
                d = new Date(""+datearr[0].replace(/-/g,"/"));
                console.log("d"+d);
                //alert(data[i].startTime) ;
                arr.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(),0,0,0));
            }
        }
        arr = unique(arr);
        return arr;
    }


    function unique(arr) {
        var ret = []
        var hash = {}

        for (var i = 0; i < arr.length; i++) {
            var item = arr[i]
            var key = typeof(item) + item
            if (hash[key] !== 1) {
                ret.push(item)
                hash[key] = 1
            }
        }

        return ret
    }


    function add(d,n) {
        if (d == "Invalid Date") {
            alert("非日期");
            return;
        }
        //当前日期的毫秒数 + 天数 * 一天的毫秒数
        var n = d.getTime() + 1 * 24 * 60 * 60 * 1000;
        var result = new Date(n);
        //alert(result.getFullYear() + "-" + (result.getMonth() + 1) + "-" + result.getDate());
        return result;
    }


    function buildStr(list){
        var str = '<ul class="time-list">';
        var item,url;
        for(var j = 0,n = list.length;j<n;j++){
            item = list[j];
            if(item.videoUrl!="" && !isEmptyObject(item.videoUrl)){
                url = "/html/m" + item.videoUrl;
            }else{
                url = "#";
            }
            str += '<a  href="'+url +'" data-ajax="false"><li>'+
                '<div class="time">' + item.startTime.split(" ")[1].substr(0,5) + '</div>'+
                '<div class="bg-time-arrow"></div>'+
                '<div class="title '+((item.videoId!=undefined && item.videoId!="")?"play":"") + '"><div class="'+ ((item.videoId!=undefined && item.videoId!="")?"video":"") +'">'+
                (($.trim(item.lecturer)!="" && $.trim(item.lecturer)!=null)? '<span class="author">'+(item.lecturer.length>80?(item.lecturer.substring(0,80)+'...'):item.lecturer) +'：</span>':"")+
                '<span class="grey" videoKey="'+ (item.videoId!=undefined?item.videoId:"") +'">' +
                (item.conName.length>80?(item.conName.substring(0,80)+'...'):item.conName) +
                // ((item.videoId!=undefined && item.videoId!="")?'<img src="/images/img50010.png" alt="" style="width:1.8em;"/>':'') +
                '</span>'+
                '</div></div>'+
                "<div class='clear'></div>"+
                '</li></a>';
        }
        str += "</ul>";
        return str;
    }



    initShareWeixin(conId);
});

/**
 * 微信分享
 */
var resourceCount=0;
function initShareWeixin(conId){
	var weiXinTitle="";
	var weiXinDesc="";
	WeixinJSApi.title=function(){
		var conSubName=comm.getpara()&&comm.getpara().conSubName;
		var scheduleName=$(".time-list .grey:eq(0) ").text();
		if(conSubName && conSubName!=null){
			if(conSubName.length>30){conSubName=conSubName.substr(0,30)+"..."}
			weiXinTitle=conSubName;	
		}
		return weiXinTitle;
	};
	WeixinJSApi.desc=function(){
		var scheduleName=$(".time-list .grey:eq(0) ").text();
		if(scheduleName && scheduleName!=null && resourceCount>0){
			if(scheduleName.length>52){scheduleName=scheduleName.substr(0,52)+"..."}
			weiXinDesc=scheduleName.trim()+"等"+resourceCount+"条视频。";
		}
		return weiXinDesc;
	};
    WeixinJSApi.appSuc = function(){
        comm.shareLog({
            shareType: 3,
            resourceId:conId ,
            resourceType: 3,
            refId: conId,
            isValid: 1,
            shareSence:24,
            shareChannel:4,
            shareContent:weiXinTitle
        });
    };
    WeixinJSApi.timeLineSuc = function(){
        comm.shareLog({
            shareType: 3,
            resourceId:conId ,
            resourceType: 3,
            refId: conId,
            isValid: 1,
            shareSence:24,
            shareChannel:5,
            shareContent:weiXinTitle
        });
    }
	WeixinJSApi.init();
}
