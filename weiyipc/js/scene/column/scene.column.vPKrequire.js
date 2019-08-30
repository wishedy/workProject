/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/10/30.
 */
$(function(){
	
    module.videoPKShare({
        //pic:"//img10.allinmd.cn/common/header/logo.png"
    });
    function getPara(){
        var url=document.URL;
        var param={};
        var str,item;
        if(url.lastIndexOf("#")>0)
        {
            str=url.substring(url.lastIndexOf("?")+1,url.length);
            var arr=str.split("&");
            for(var i=0;i<arr.length;i++)
            {
                item =  arr[i].split("=");
                param[item[0]] = decodeURI(item[1]);
            }
        }
        return param;
    }
    var para=getPara();
    
    $("#ev_tabBtn li").each(function(i,em){
        $(em).on("click",function(){
            $("#ev_tabBtn li div").removeClass("on");
            $(this).find("div").addClass("on");
            $(".ev_tadCont").hide();
            $(".ev_tadCont").eq(i).show();

            var a = window.location.pathname + location.search;
            if (a.indexOf("#") < 0) {
                a += "#";
            }
            if(i==0){
                g_sps.jump(null,a+"&tab=video");
            }else{
                g_sps.jump(null,a+"&tab=case");
            }
        })
    });
    if(para.tab=="case"){
    	$("#ev_tabBtn li").eq(1).click();
    }
    $("#ev_zk").attr("on","up");
    $("#ev_zk").on("click",function(){
        if($(this).attr("on")=="up"){//展开
            $("#ev_zk").text("收起全部");
            $(this).addClass("open_m_text_close");
            $(".zy_sh_list").animate({height:"2500px"},1500,function(){
                $("#ev_zk").attr("on","down");
            });
        }
        if($(this).attr("on")=="down"){//收起
            $("#ev_zk").text("展开更多");
            $(this).removeClass("open_m_text_close");
            $(".zy_sh_list").animate({height:"530px"},1500,function(){
                $("#ev_zk").attr("on","up");
            });
        }
    })
})
