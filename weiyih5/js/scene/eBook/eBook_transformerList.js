/**
 * Created by ALLIN on 2016/11/21.
 */
$(function(){
    FastClick.attach(document.body);
    //Log.createBrowse(163,'译者列表页');
    var transformerList={
        path:{
            transformer:'/mcall/cms/doc/getMapAuthorList/'
        },
        init:function(){
            var t=this;
            t.authorType=0;
            t.book=comm.getpara().bookId;
            t.getData();
            t.backBtnClick();
            t.style();
        },
        style:function(){
            var t=this;
            $(".al-eBookContentWrapper").attr("data-active-role", $(".al-eBookContentChangeItem.active").attr("data-role"));
            $(".al-eBookContentWrapper").height($(".al-eBookItemContent[data-role='" + $(".al-eBookContentChangeItem.active").attr('data-role') + "']").height());
            $(".al-eBookContentChangeItem").off("click").on("click", function() {
                var role = $(this).attr("data-role");
                $(this).addClass('active').siblings().removeClass('active');
                $(".al-eBookContentWrapper").attr("data-active-role", role);
                $(".al-eBookContentWrapper").height($(".al-eBookItemContent[data-role='" + role + "']").height());
            });
            $(".al-personalContributionSelector h2").off("click").on("click", function() {
                if ($(".al-personalContributionSelector").hasClass('al-personalSelectorOn')) {
                    $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
                } else {
                    $(".al-personalContributionSelector").addClass('al-personalSelectorOn');
                }
            });
            $(".al-personalContributionSelectorItem").off("click").on("click", function() {
                $(this).addClass('active').siblings().removeClass('active');
                $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
                $(".al-personalContributionSelector h2").text($(this).text());
                t.authorType=$(this).data('id');
                $('.al-content').empty();
                $(".al-content").attr("scrollPagination", "enabled");
                comm.creatEvent({
                    triggerType:'书籍-译者筛选项',
                    trigger_name:"译者筛选项",
                    keyword:$(this).text(),
                    actionId:71
                });
                t.getData();
            });
            $(".ev-noAllinDoctor").off("click").on("click", function () {
                popup("该用户尚未注册唯医");
            });
        },
        getData:function(){
            var t=this;
            var data={};
            data.docId=t.book;  //传书籍id,在主页接口获取书籍id
            data.logoUseFlag=4;   //传图片大小
            data.visitSiteId=2;  //访问途径
            data.pageIndex=1;
            data.pageSize=99;
            data.authorType=t.authorType;    //译者列表筛选:0-全部,2-主译,6-副主译,7-参与人员
            data.customerId=localStorage.getItem('userId')?localStorage.getItem('userId'):"";    //译者列表筛选:0-全部,2-主译,6-副主译,7-参与人员
            t.data=data;
            var cBack=function(rep){
                if(comm.hasResponseData(rep)){
                    var items=rep.responseObject.responseData;
                    var _authType="",twoAuthTypeNum=0;
                    if(items.authorType){//判断类型进行检测，显示筛选项
                        _authType=items.authorType.split(",");
                        $.each(_authType,function (i,e) {
                            $(".al-personalContributionSelectorItem[data-id=0]").show();//全部按钮
                            $(".al-personalContributionSelectorItem[data-id="+e+"]").show();
                        });
                    }
                    //列表请求
                    if(rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length) {
                        var data_list = rep.responseObject.responseData.data_list;
                        var html="",html2="",arrHT=[];
                        $.each(data_list,function (i,e) {
                            var _v=e.authorType;//排除不属于书籍的状态
                            if (_v!=1&&_v!=3&&_v!=4&&_v!=5&&_v!=12&&_v!=13) {
                                t.dataProcessing(arrHT,e.data_list);
                            }else{
                                twoAuthTypeNum+=e.data_list.length;
                            }
                        });
                        $('.al-content').append(arrHT);
                        if (items.total_count && items.total_count.length > 99) {
                            t.scrollPage();
                        }
                    }
                    //总数有多少
                    if(t.authorType==0&&items.total_count){
                        var total_count=items.total_count-twoAuthTypeNum;
                        $(".contributionNum").text(total_count);//数目
                    }
                    t.style();
                }else{
                    $('.al-content').empty();
                    $('.al-content').append('<div class="al-eBookNoContent"><img src="//img50.allinmd.cn/pages/eBook/eBookNoContentImg.png" alt=""/></div>');
                    $('.al-personalContributionTitle .contributionNum').text(0);
                    $('.al-personalContributionSelector').hide();
                }

            };
            comm.ajax.async(t.path.transformer,{paramJson: $.toJSON(data)},cBack);
        },
        dataProcessing:function(arrHT,data){
            var t=this;
            for(var i=0;i<data.length;i++){
                var dataItem=data[i];
                arrHT.push(module.listTemplate({ tempName: "userList" })({
                    cid: dataItem.customerId, //用户id
                    customerId: localStorage.getItem('userId')?localStorage.getItem('userId'):"", //当前人ID
                    userName: dataItem.authorName, //用户名
                    logoUrl: dataItem.url, //头像
                    state: dataItem.state, //认证状态
                    medicalTitle: comm.cutLine(comm.cutDoctorTitle(dataItem.medicalTitle),"_",","), //职称
                    company: dataItem.company, //医院
                    relationship: dataItem.relationship, //关注关系
                    terminalFlag:1
                }));
            }
           return arrHT;
        },
        backBtnClick:function(){
            $(".al-indexHeaderItem img").on("click", function() {
                if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                  g_sps.jump(null,"/");
                } else {
                    history.back();
                }
                return false;
            })
        },
        //译者列表瀑布流
        scrollPage:function () {
            var t = this;
            var num = 2;
            var params = t.data;
            params.pageIndex = num;
            $(".al-content").off("scroll").scrollPagination({
                'contentPage': t.path.transformer,
                'contentData': $.extend(params, {
                    pageIndex: function () {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 0,
                'type': "POST",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".al-content").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".al-content").attr("scrollPagination", "disabled");
                            return false;
                        }
                        else {
                            var result = data.responseObject.responseData.data_list;
                            var arrHT=[];
                            $.each(result,function (i, e) {
                                t.dataProcessing(arrHT,e.data_list);
                            });
                            $(".al-content").append(arrHT);
                        }
                    }
                }
            });
        }
    };
    transformerList.init();
});