/**
 * 功能描述：名片
 * 使用方法:  module.nameCard({
 *              selector : ".name-card"
 *          });
 * 注意事件： 在 要显示名片的元素上 加上样式 .nmae-card 此元素上需保证有属性 customerId 用于查找名片信息
 * 引入来源：  作用：
 * 依赖 ui-card plugin
 * Created by LiuYuTao on 2015/3/12.
 */
module.nameCard = function (Obj) {

    var defaults = {
        selector : ".name-card"
    };

    var options = $.extend(defaults,Obj);
    var timeout;

    function template(kv) {
        var dom = $('<div class="name-card-box">' +

            '            <div class="info_left"><a href="/pages/personal/home.html?cid='+ kv.customerId +'" target="_blank"><img src="'+ kv.img +'" /></a></div>' +
            '            <div class="info_right">' +
            '                <div class="info_name"><a href="/pages/personal/home.html?cid='+ kv.customerId +'" target="_blank">' + kv.name+ '</a></div>' +
            '                <div class="info_zhiwei">'+
                        comm.getStrLen(comm.strHandle.cutDoctorTitle(comm.cutLine(kv.medicalTitle)) + " &nbsp;" + kv.company,24)+''+
            '</div>' +
            '                <div class="info_jh">' +
            '                    <div class="info_gz " style="padding-left:0;">关注<span class="follow">'+ kv.followNum +'</span></div>' +
            '                    <div class="info_gz ">粉丝<span class="info_num followed">'+ kv.followedNum+'</span></div>' +
            '                    <div class="info_gz " style="border:none;">动态<span class="info_num activity">'+  kv.activityNum+'</span></div>' +
            '                    <div class="clear"></div>' +
            '                </div>' +
            '            </div>' +
            '            <div class="clear"></div>' +
            '</div>');

        if(kv.followNum > 0){
            dom.find(".follow").addClass("info_num").wrap("<a href='/pages/personal/home.html?cid="+
                kv.customerId+"&action=follow'></a>");
        }
        if(kv.followedNum > 0){
            dom.find(".followed").addClass("info_num").wrap("<a href='/pages/personal/home.html?cid="+
                kv.customerId+"&action=fans'></a>");
        }
        if(kv.activityNum > 0){
            dom.find(".activity").addClass("info_num").wrap("<a href='/pages/personal/home.html?cid="+
                kv.customerId+"&action=trends'></a>");
        }
        return dom;
    }

    $(options.selector).each(function(){
        if($(this).attr("customerId")){

            var customerId = $(this).attr("customerId");
            $(this).showCard({
                content: function () {
                    var s = "";
                    $.ajax({
                       url:PC_CALL+"customer/unite/json_info/",
                        data:{paramJson:$.toJSON({customerId:customerId})},
                        async:false,
                        success: function (data) {
                            s = data.responseObject.responseData.data_list[0];
                        }
                    });
                        return template({
                            customerId: s.customer_auth.customerId,
                            name: s.customer_auth.lastName + s.customer_auth.firstName,
                            medicalTitle:s.customer_auth.medicalTitle,
                            company:s.customer_auth.company,
                            img:s.customer_att.logoUrl,
                            // followNum:s.customer_statistic.followpeopleNum,
                            followNum:s.customer_statistic.followOrgNum?s.customer_statistic.followOrgNum:s.customer_statistic.followpeopleNum,
                            followedNum:s.customer_statistic.fansNum,
                            activityNum:s.customer_statistic.trendsNum
                        });
                }
            });
        }else{
            console.warn("存在某名片未添加 customerId 属性，无法获取名片信息");
        }
    });
};