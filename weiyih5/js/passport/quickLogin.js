/**
 * @name:
 * @desc: 快捷登录，输入手机号
 * @example:
 * @depend:
 * @date: 2017/4/17
 * @author: sunhaibin
 */

$(function(){
   var input = $('input[name=phoneNumber]');
    var val = input.val();
    var phoneReg = /^1\d{10}$/;
    input.on('input propertyChange',function(){
        val = input.val();
        if(phoneReg.test(val)){
            $('.alLoginBtn').removeClass('disabled').off('click').on('click',function(){
                $.ajax({
                    url:M_CALL+'customer/unite/isExist/',
                    data:{paramJson:$.toJSON({siteId:2,account:val})},
                    dataType:'json',
                    type:'post',
                    success:function(data){
                        if(data&&data.responseObject&&data.responseObject.responseStatus){
                            var cid ="";
                            if(data.responseObject.responseData&&data.responseObject.responseData.customerUnite){
                                cid = data.responseObject.responseData.customerUnite.customerId;
                            }
                          g_sps.jump(null,'/pages/passport/quickLoginCode.html?account='+val+"&cid="+cid);
                        }else{
                            if(data.responseObject.responseMessage){
                                popup(data.responseObject.responseMessage);
                            }else{
                                popup('error');
                            }

                        }
                    }

            });

            });
        }else{
            $('.alLoginBtn').addClass('disabled').off('click');
        }
    }).on('focus',function(){
      $(this).siblings('span').addClass('icon-mobileOn').removeClass('icon-mobile');
    }).on('blur',function(){
        $(this).siblings('span').addClass('icon-mobile').removeClass('icon-mobileOn');
    });
    //window.onload = Log.createBrowse(76, '手机验证-输入手机号');
});