/**
 * 功能描述：ajax调用
 * 使用方法: comm.ajax.sync(url,params) 同步获取数据
 comm.ajax.async(url,params,callback) 异步获取数据
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by QiaoLiang on 2015-3-20.
 */
/*
 双斜杠注释的部分可以不用传
 * comm.ajax.request({
     port: config.ajaxPort.courseType,
     //noLoading:1,默认有loading 不需要loading传1
     //get:true,默认是post方式，除非特别传参指名要get方式。
     postData: {},上传参数，json形式即可
     success: function (req) {},成功的回调
     failed: function () {},失败的回调
     //diyCheck:function(req){}自定义用来判断返回值是成功还是失败，如果返回失败，return true,返回成功，return false
   });
 *
 * */
comm.ajax = {
    request: function(options){
        var postType = (options.get) ? "GET" : "POST";//默认是post方式，除非特别传参指名要get方式。
        var async = (options.async)?false:true;
        var postData = {"paramJson": $.toJSON(options.postData)};
        var loading = options.noLoading ? 0 : 1;
        var hasData = function(r){
            if(r){
                if($.isEmptyObject(r.responseObject)){
                    return false;
                }else{
                    if($.isEmptyObject(r.responseObject.responseData)){
                        return false;
                    }else{
                        return true;
                    }
                }
            }else{
                return false;
            }
        };
        $.ajax({
            url: options.port,    //请求的url地址
            dataType: "json",   //返回格式为json
            async:async, //请求是否异步，默认为异步，这也是ajax重要特性
            data: postData,    //参数值
            type: postType,   //请求方式
            beforeSend: function () {
                //请求前的处理
                if(loading){
                    comm.LightBox.showloading();
                }
            },
            success: function (data) {
                //请求成功时处理
                var hasOnOff = hasData(data);
                if(loading) {
                    comm.LightBox.hideloading();
                }
                if(hasOnOff){
                    var diyOnOff = false;
                    if(options.diyCheck){
                        diyOnOff = options.diyCheck(data);
                    }
                    var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                    var realStatus = data.responseObject.responseStatus;
                    var len  =(data.responseObject.responseData.data_list)?(data.responseObject.responseData.data_list.length==0):true;
                    if (realNoData || !realStatus||len||diyOnOff) {
                        options.failed && options.failed(data);
                    } else {
                        options.success && options.success(data);
                    }
                }else{
                    options.failed && options.failed(data);
                }


            },
            complete: function () {
                //请求完成的处理
            },
            error: function () {
                //请求出错处理
                options.failed && options.failed();
            }
        });
    },
    sync : function(url,params){ //同步获取数据
        var dataJson = {};
        comm.LightBox.showloading();
        $.ajax({
            url : url,
            type : "POST",
            data : params,
            async : false,
            time : 5000,
            success : function(data){
                comm.LightBox.hideloading();
                dataJson = data;
            },
            error : function(){
                comm.LightBox.hideloading();
            }
        })
        return dataJson;
    },
    async : function(url,params,callback,loadingState,errorCallback,getMethod){ // 异步获取数据
        var methodType = getMethod?getMethod:"POST";
        if(!(loadingState&&loadingState=="true")){comm.LightBox.showloading();}
        $.ajax({
            url : url,
            type : methodType,
            dataType : "json",
            data : params,
            success : function(data){
                if(!(loadingState&&loadingState=="true")){comm.LightBox.hideloading();}
                callback&&callback(data);
            },
            error : function(data){
                if(!(loadingState&&loadingState=="true")){comm.LightBox.hideloading();}
                errorCallback&&errorCallback(data);
            }
            //mode : "abort"
        });
    }
};