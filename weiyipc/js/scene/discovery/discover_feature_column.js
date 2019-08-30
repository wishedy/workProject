/**
 * 功能描述：  发现——特色栏目页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：发现页改版
 *
 * Created by zhangheng on 2017/10/9.
 */
$(document).ready(function () {
    var specialColumn = {
        path:{
            list:"/call/special/getSpecialList/"
        },
        parameter:{
            platformId: $('#sesDepartment').val() == undefined ? 1 : $('#sesDepartment').val(),
            customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
            pageIndex:0,
            pageSize:30
        },
        el:{
            specialColumnContainer:$(".columnList")
        },
        init:function(){
            var t = this;
            // comm.Log.createBrowse({href:window.location.href,id:217,name:'改版发现页的特色栏目入口页面'});
            t.registerHandel().exhibitionList();
        },
        templateColumn:function(d){
            var t = this;
            var myTemplate = Handlebars.compile($("#al-tpl-specialColumn").html());
            t.el.specialColumnContainer.html(myTemplate(d));
            return t;
        },
        filterData:function(d){
          var t = this;
          var originalData = JSON.parse(JSON.stringify(d));
          var newData = [];
          $.each(originalData.data_list,function(i,v){
             if(v.specialId){
                 newData.push(v);
             }
          });
          return {
              data_list:newData
          };
        },
        exhibitionList:function(){
            var t = this;
            var param = {
                "customerId": t.parameter.customerId,
                sortType: "1",
                isValid: "1",
                firstResult:t.parameter.pageIndex*t.parameter.pageSize,
                maxResult:t.parameter.pageSize,
                platformId:t.parameter.platformId
            };
            var callBack = function(d){
                if(d.responseObject.responseData.data_list.length){
                    t.templateColumn(t.filterData(d.responseObject.responseData));
                }
            };
            var options = {
                postData: param,
                success: callBack,
                port: t.path.list
            };
            comm.ajax.request(options);
            return t;
        },
        registerHandel:function(){
            var t = this;
            Handlebars.registerHelper("showTime",function(nowTime){
                if(nowTime){
                    return comm.date.thirdRule(nowTime,comm.date.local_time())
                }
            });
            Handlebars.registerHelper("ellipsis",function(v,len){
                return comm.getStrLen(v, len);
            });
            return t;
        }
    };
    specialColumn.init();
});