/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/3/1
 * @author: sunhaibin
 */
$(function(){
    user.privExecute({
        operateType: 'login',   //'login','auth','conference'
        callback: function () {

        }
    });
    //window.onload = Log.createBrowse(36, "朋友圈"); //	�����־
    TempCache.setItem("readTrendTime",comm.date.local_time());
    $(".al-commentRelease").on("click", function(e) {
        // e.preventDefault();
        var amChannel = comm.getpara()._amChannel;
        comm.newReleaseBox({
            imgPath:"/images/img50/case/release.png",
            title:"发布内容需使用唯医骨科App",
            solidBtnTitile:"立即使用",
            authNoneTitle:"暂不发布",
            data:{
                el: ".solidBtn",
                ios: "allinmdios://app.allinmd.cn/applinks.html?scene=11&type=7" +(amChannel?"&_amChannel="+amChannel:''),
                ios9: "http://app.allinmd.cn/applinks.html?scene=11&type=7" +(amChannel?"&_amChannel="+amChannel:''),
                android: "allin://com.allin.social:75235?data={scene:11,type:51"+ (amChannel?",_amChannel:"+amChannel:'')+ "}"
            }
        });
        //2017/12/22朋友圈左上角发布已注Ding
        // $('.al-commentReleaseMask').addClass('show');
        //
        // $(".al-commentReleaseCancel").on("click", function() {
        //     $('.al-commentReleaseMask').removeClass('show');
        //
        // });
    });
    $(".ev-uploadBtn").on("click",function(){
        var $this=$(this);
        var href=$(this).attr("_href");
        user.privExecute({
            operateType: 'auth',   //'login','auth','conference'
            callback: function () {
                g_sps.jump($this,href);
            }
        });

    });
    $('.ev_back').click(function(){
      g_sps.jump(null,'/pages/discover/discover_index.html');
    });
});
