/**
 * 功能描述：  个人中心简介
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/13.
 */
$(function(){
    //window.onload = Log.createBrowse(8,'我的资料页面');
    var customerInfo={
        init:function(){
            this.customerId=TempCache.getItem("userId");
            if(!this.customerId){
               return;
            }
            this.getBase();
            this.getAuthProcess();
        },
        //获取基本信息
        getBase:function(){
            var unit=responseData.customer_unite;
            var baseInfo=responseData.customer_baseinfo;
            var auth=responseData.customer_auth;
            var csc=responseData.customer_statistic;
            var att=responseData.customer_att;

            //1.这是个人详细信息
            var name="";
            if(auth.lastName){
                name=comm.getStrLen((auth.lastName+auth.firstName),12)+" ";
            }
            var sex="";
            if (baseInfo.sexId == "1") {
                sex="男 ";
            }
            if (baseInfo.sexId == "2") {
                sex="女 ";
            }
            var birth="";
            var birthday=auth.birthYear||baseInfo.birthday;
            if(birthday&&!$.isEmptyObject(birthday)){
                birth=birthday.substring(0,4)+"-"+birthday.substring(5,7)+"-"+birthday.substring(8,10);
            }
            $(".info").html('<span>'+name+'</span><span>'+sex+'</span><span>'+birth+'</span>');

            //2.这是医生单位
            var company = "";
            if(auth.company){
                company = auth.company;
            }else if(auth.schoolName){
                company = auth.schoolName
            }
            $('.company').text(company);

            //3.这是获取医生职称
            var medicalTitle = "";
            if(auth.medicalTitle){
                medicalTitle = comm.cutLine(auth.medicalTitle, "_", "、");
            }
            $('.medicalTitle').text(medicalTitle);

            //4.这是显示标签，截取
            var area = auth.areasExpertise;
            var area1 = area.split(",");
            var areaHtml = "";
            $.each(area1, function (i, val) {
                if (val) {
                    if (val.split("_")[1]) {
                        areaHtml+='<li>' + val.split("_")[1] + '</li>';
                    }
                }
            });
            $(".tagList").html(areaHtml);

            //5.这是判断用户是否认证，或者是二次认证显示或者隐藏对应模块！
            var _role = TempCache.getItem('customerRole');
            if(_role!=2&&_role!=3&&_role!=4) {//非厂商用户
                switch (auth.state) {
                    case 2:  //已认证
                    case 8:
                    case 9:
                        $('.authCont').show();
                        $('.otherMsg').show();
                        $('.title').show();
                        $('.change').show();
                        break;
                    case 3://拒绝
                        $('.ev-againAuth').show();
                        $('.otherMsg').show();
                        break;
                    case -1: //未认证
                        $('.authNone').show();
                        $('.otherMsg').show();
                        break;
                    case 0:   //二次认证
					case 1:
                        $('.ev-authProcessing').show();
                        $('.otherMsg').show();
                        break;
                    case 7:   //审核中
                        $('.authCont').show();
                        $('.otherMsg').show();
                        $('.ev-hasAuth').show();
                        $('.title').show();
                        $('.title p').show().attr('class', 'changing').html('审核中...').off('click');
                        break;
                }
            }else{
                switch (auth.state){

                    case 2:
                    case 9:
                    case 8:
                    case 7:
                        $('.authCont').show();
                        $('.otherMsg').show();
                        $('.title').show();
                        $('.change').show();
                        $('.change').remove();
                        break;
                    case 3://拒绝
                    case -1:
                        $('.ev-name').hide();
                        break;
					// case 1:break;
                }
                $('.certificatesMsg').remove();
            }
            $('.change').on('click',function(){
                if(auth.state==8){
					comm.confirmBox({
						title: "<span style='font-size: 0.4rem;margin-bottom: 0.266rem;font-weight: bold;display: inline-block;'>变更审核期间您可以正常使用唯医，但无法在唯医骨科执医</span>审核将在3个工作日内完成",
						ensure: '<span style="font-weight:normal;">继续</span>',
						cancel: "放弃变更",
						ensureCallback:function(){
                            if(comm.isApp()){
                                comm.callAppAuth();
                            }else{
                                if(g_sps){
                                    g_sps.jump(null,"/pages/passport/auth/auth.html?reAuth=reAuth");
                                }else{
                                    window.location.href = "/pages/passport/auth/auth.html?reAuth=reAuth";
                                }

                            }
              //g_sps.jump(null,"/pages/passport/auth/auth.html?reAuth=reAuth");
						},
						cancelCallback:function(){

						}
					});
                }else{
                  //g_sps.jump(null,"/pages/passport/auth/auth.html?reAuth=reAuth");
                    if(comm.isApp()){
                        comm.callAppAuth();
                    }else{
                        if(g_sps){
                            g_sps.jump(null,"/pages/passport/auth/auth.html?reAuth=reAuth");
                        }else{
                            window.location.href = "/pages/passport/auth/auth.html?reAuth=reAuth";
                        }

                    }
                }
            });
        },
        getAuthProcess:function(){
            var t=this;
            $.ajax({
                url:M_CALL+"customer/revise/auth/getMapList/",
                type:"post",
                data:{paramJson:$.toJSON({customerId:TempCache.getItem('userId')})},
                dataType:'json',
                success:function(res){
                    if(res&&res.responseObject&&res.responseObject.responseData&&!$.isEmptyObject(res.responseObject.responseData)){
                        $('.title p').show().attr('class','changing').html('审核中...').off('click');
                    }
                }
            })
        }
    };
    customerInfo.init();

});
