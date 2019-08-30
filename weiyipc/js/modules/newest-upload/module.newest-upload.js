/**
 * 功能描述： 最新上传模块 对元素进行按天的分组
 * 使用方法:  页面上应具有 list-data 节点， 里面包含 具有日期属性publishTime的元素列表。
 * 注意事件： 将日期分组后添入到 days-list 元素里。
 * 引入来源：
 *
 * Created by LiuYuTao on 2015/3/26.
 */
module.newestUpload = function(Obj){
    var defaults = {
        container:".news_sc"
    };

    var today = comm.date.local_time(new Date());
    var options = $.extend(defaults,Obj);
	var controller = {

	      config : {},
          el:{
              container:$(options.container),
              data:$(options.container).find(".list-data")
          },

	      path : {

	      },
	      template : {
              day: function (day) {
                  return '<div class="day-item"> <div class="video_right_top">' +
                          '    <div class="video_detail_right_time"><span></span>'+day+'</div>' +
                          '   <div class="clear"></div>' +
                          '</div>' +
                      '<div class="video_right_bottom">' +
                      '        <div class="video_detail_right">' +
                      '            <ul></ul>' +
                      '        </div>' +
                      '        <div class="clear"></div>' +
                      '   </div>' +
                      '</div>';
              }
	      },

	      init : function(Obj){
              var t = this;
              var lis = t.el.data.find("li");
              var l = lis.size();
              var tempDay="";
              var itemDay;
              var dayDomEl,ulDomEl,tempObj,tempStr;
              for (var i = 0; i < l; i++) {
                  var obj = lis.eq(i);
                  if($(obj).attr("publishTime")){
                      itemDay = $(obj).attr("publishTime");
                      if(tempDay!==""){
                          if(!comm.date.isSameDay(tempDay,itemDay)){   // 非同日的
                              tempDay = itemDay;
                              append();
                          }
                      }else{    // 初始化
                          tempDay = $(obj).attr("publishTime");
                          append();
                      }
                      tempObj = obj.clone();
                      tempStr = tempObj.find(".videoName a").text();
                      tempObj.find(".videoName a").text(comm.getStrLen(tempStr,30));
                      tempObj.appendTo(ulDomEl);
                  }
              }

              function append() {
                  dayDomEl = $(t.template.day(comm.date.diffDay_one(tempDay,today)));
                  ulDomEl = dayDomEl.find("ul");
                  dayDomEl.appendTo($(t.el.container.find(".days-list")));
              }
	      }


	};

	controller.init(Obj);

};