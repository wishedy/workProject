$(function () {
    $(".case_fh").on("vclick", function () {    // 返回会议列表页
       g_sps.jump(null,"/html/wap/index/meeting_home.html");
    });

    if(TempCache.getItem("userInfo")!=undefined && TempCache.getItem("userInfo")!=""){
        var userInfo = $.parseJSON(TempCache.getItem("userInfo"));
        if(!$.isEmptyObject(userInfo)){
            $("#firstName").val(userInfo.firstName);
            $("#lastName").val(userInfo.lastName);
            $("#company").val(userInfo.company);
            if(userInfo.areasExpertise!="" ){
                var arr = userInfo.areasExpertise.split(",");
                $("#areasExpertise").val(arr);
                var mySelect = $("#areasExpertise");
                //mySelect.selectmenu("refresh");
            }
        }


    }

    $("form").validate({
        submitHandler : function() {
            saveSubmit();
        },
        rules : {
            "firstName" : {
                "required" : true,
                "rangelength" : [ 1, 50 ]
            },
            "lastName" : {
                "required" : true,
                "rangelength" : [ 1, 50 ]
            },
            "company" : {
                "required" : true
            },
            "areasExpertise":{
                "required" : true
            }
        },
        messages : {
            "lastName" : {
                "required" : "您贵姓？",
                "rangelength" : "最大长度50个字符！",
                "isChinese":"您贵姓？"
            },
            "firstName" : {
                "required" : "你的大名是？",
                "rangelength":"最大长度50个字符！",
                "isChinese":"你的大名是？"
            },
            "company" : {
                "required" : "请填写医院。"
            },
            "areasExpertise":{
                "required" : "请选择学组。"
            }
        },
        errorPlacement:function(error,element){
            var con = $(element).parents(".v3-input_parent").find(".l_warning");
            con.html(error).show();
            $(element).parents(".input_error").addClass("input_error");
        },
        success:function(element){
            $(element).parents(".v3-input_parent").removeClass("input_error");
            $(element).parent().empty();
            var con = $(element).parents(".input_error").find(".l_warning");
            con.hide();
        },
        onkeyup:false

    });

    function saveSubmit() {
        var param = {
            firstName:$('#firstName').val(),
            lastName:$('#lastName').val(),
            company:$('#company').val(),
            areasExpertise :$('#areasExpertise').val().toString()
        };

        $.ajax({
            url: '/mcall/customer/auth/save/',
            cache: false,
            data:{paramJson: $.toJSON(param)},
            dataType:'json',
            type:"POST",
            success: function(data){
                var result = data.responseObject;
                if(!result.responseStatus){  // 保存失败

                }else{           // 保存成功。
                    TempCache.removeItem("userInfo");
                    var fromPage = TempCache.getItem("fromPage");
                    if(fromPage!=undefined && fromPage!=""){
                        swal("保存成功");
                        TempCache.removeItem("fromPage");
                        comm.redirect(fromPage+$('#lastName').val()+$('#firstName').val());
                    }else{
                      g_sps.jump(null,"/html/wap/index/meeting_home.html");
                    }
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {

            }
        });
    }

    $("#loginBtn").on("vclick", function () {
        $("form").submit();
        return false;
    });

})