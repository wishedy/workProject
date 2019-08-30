/**
 * 功能描述： 发现——标签关注者列表
 * 使用方法:
 * 注意事件：	
 * 引入来源：  作用：
 *
 * Created by QiangKaiLiang on 2016/08/29.
 */
$(function() {
    var TagFollowList = function() {
        var that = this;

        this.XHRList = {
            followList: '/mcall/recommend/tag/resource/json_customers/',
        };
    };
    TagFollowList.prototype = {
        init: function() {
            this.followUserList();
            this.dataWaterfall();
            this.backToTagSeminar();
            this.setSeo();
        },
        followUserList: function() {
            var data = {
                    tagId: comm.getpara("?").tId,
                    pageIndex: 1,
                    pageSize: 20,
                    customerId: localStorage.getItem('userId'),
                    scene: 2,
                },
                fTemplate = '';
            $.ajax({
                    url: this.XHRList.followList,
                    type: 'get',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON(data)
                    },
                })
                .done(function(data) {
                    var fList = data.responseObject.responseData.data_list;
                    $(fList).each(function(index, ele) {
                        var t = module.listTemplate({ tempName: "userList" })({
                            cid: ele.customerId, //用户id
                            customerId: localStorage.getItem('userId'), //当前人ID
                            userName: ele.customerName, //用户名
                            logoUrl: ele.logoUrl.split("|")[0], //头像
                            state: ele.state, //认证状态
                            medicalTitle: comm.cutLine(comm.cutDoctorTitle(ele.medicalTitle),"_",","), //职称
                            company: ele.company, //医院
                            relationship: ele.relationship //关注关系
                        });
                        $(".al-doctorRecommend").append(t);
                    });

                })
                .fail(function() {
                    throw("error");
                })
                .always(function() {

                });
        },
        // 数据瀑布流加载
        dataWaterfall: function() {
            var that = this;
            var num = 2;
            var data = {
                tagId: getpara().tId,
                pageIndex: num,
                pageSize: 20,
                customerId: localStorage.getItem('userId'),
                scene: 2,
            };

            $('.al-doctorRecommend').off("scroll").scrollPagination({
                'contentPage': that.XHRList.followList,
                'contentData': $.extend(data, {
                    pageIndex: function() {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 50,
                'delaytime': 0,
                'type': "get",
                'beforeLoad': function() {
                    comm.loading.show();
                },
                'afterLoad': function() {
                    comm.loading.hide();
                },
                'loader': function(res) {

                    if ($.isEmptyObject(res)) {
                        $(".al-doctorRecommend").attr('scrollPagination', 'disabled');
                        return false;
                    } else {
                        if ($.isEmptyObject(res.responseObject.responseData) || (res.responseObject.responseData.data_list && res.responseObject.responseData.data_list.length === 0)) {

                            $(".al-doctorRecommend").attr('scrollPagination', 'disabled');
                            return false;
                        } else {
                            var fList = res.responseObject.responseData.data_list;
                            $(fList).each(function(index, ele) {
                                var t = module.listTemplate({ tempName: "userList" })({
                                    cid: ele.customerId, //用户id
                                    customerId: localStorage.getItem('userId'), //当前人ID
                                    userName: ele.customerName, //用户名
                                    logoUrl: ele.logoUrl, //头像
                                    state: ele.state, //认证状态
                                    medicalTitle: comm.cutDoctorTitle(ele.medicalTitle), //职称
                                    company: ele.company, //医院
                                    relationship: ele.relationship //关注关系
                                });

                                $(".al-doctorRecommend").append(t);
                            });

                            
                        }
                    }

                }
            });
        },
        backToTagSeminar:function(){
        	$(".EV-backToTagSeminar").on('click',function(e){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
        		window.history.go(-1);
        	});
        },
        setSeo:function(){
            document.title="关注"+comm.getpara("?").title+"标签的人－唯医,allinmd";
        }
    };

    var tagFollowList = new TagFollowList();
    tagFollowList.init();
});
