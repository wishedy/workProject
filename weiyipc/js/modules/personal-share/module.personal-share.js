/**
 * 功能描述：
 * 使用方法:   module.personalShare({selector:".xxx"})
 * 注意事件：
 * 引入来源：  作用：分享和二维码
 *
 * Created by LiChunHui on 2015/4/14.
 */
module.personalShare=function(Obj){
    var controller = {
        config : {
            imgPath: "//modules.allinmd.cn/personal-share/"
        },
        el : {
            weixingBtn:".weixin_ico",
            erweima:".personal_erweima"
        },
        template : {
            relation : function(option){
                return '<div class="personal_fx_bg">'+
                    '<ul id="hr_share">'+
                    '<li class="weixin_ico"><img src="'+option.imgPath+'images/wx.png" /><div class="personal_erweima"><img src="'+option.imgPath+'images/erweima_img.png" /></div></li>'+ //
                    '<li class="share_ico_tsina"><img src="'+option.imgPath+'images/wb.png" /></li>'+
                    '<li class="share_ico_tqq"><img src="'+option.imgPath+'images/qq.png" /></li>'+
                    '<li class="share_ico_qzone"><img src="'+option.imgPath+'images/kj.png" /></li>'+
                    '<div class="clear"></div>'+
                    '</ul>'+
                    '</div>';
            }
        },
        init : function(Obj){
            var t = this;
            t.options={};
            var o={
                title:document.title,
                url:window.location.href
            };
            t.options= $.extend(o,Obj);

            var opts = t.options;
            $(opts.selector).append(t.template.relation({imgPath: t.config.imgPath}));
            t.options.url= "http:"+location.href.split(":")[1];
            t.shareIco = {
                "tsina"	:"http://service.weibo.com/share/share.php?title=" + encodeURIComponent(t.options.title) + "&url=" + encodeURIComponent(t.options.url) + "&source=bookmark&appkey=2992571369",
                "tqq"	:"http://connect.qq.com/widget/shareqq/index.html?title="+ encodeURIComponent(t.options.title) +"&url=" + encodeURIComponent(t.options.url),
                "qzone"	:"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(t.options.url) + "&title=" + encodeURIComponent(t.options.title)+"&summary="+encodeURIComponent(t.options.content),
            };
            t.shareClick();
            t.share();
            t.weixingClick();
        },
        //分享点击
        shareClick:function(){
            var t=this;
            var up=0;
            $(t.options.selector).on("click",function(){
                if(up===0) {
                    $(t.options.selector).find(".personal_fx_bg").animate({height: 68}, 200, function () {
                        up = 1;
                        $(this).css("overflow","visible");
                    });
                }else{
                    $(t.el.erweima).css("height",0);
                    t.weixingup=0;
                    $(t.options.selector).find(".personal_fx_bg").animate({height:0},200,function(){
                        up=0;
                        $(this).css("overflow","hidden");
                    });
                }
            });
        },
        //微信点击
        weixingClick:function(){
            var t=this;
            this.weixingup=0;
            $(this.el.weixingBtn).on("click",function(){
                if(t.weixingup===0){
                		  
                		  //获取cid
                		  var params="",cid = $.getUrlParam("cid");
                		  if(cid != "") params = "?cid="+cid;
                		  
	                	  if(!comm.equipment.IsPC()){ //非pc端时 PDF
	                    	  address = "//m.allinmd.cn/allin/personal/app/#/index"+params;
	                	  }else{
	                		  address = location.hostname+location.pathname;
	                		  
	                		  if(address == PC_CALL+"customer/unite/customer_info/"){
	                			  var cid = $("#sesCustomerId").val(); //如果是动态无id的编辑资料时
	                			  address = "/pages/personal/home.html?cid="+cid;
	                		  }
	                	  }
	                	  
                       // 是否支持canvas
		               if(!!document.createElement('canvas').getContext){  
		            		  $(t.el.erweima).animate({height:191},300,function(){
		            			  t.weixingup=1;
		                    }).qrcode({
		            			  text : address
		            		  });
		            		  
		            		  $("canvas").css({"padding":"42px 16px 16px 16px","position":"absolute","width":"138px","height":"138px","left":"0"});
		            	  }else{  
		            		  $(t.el.erweima).animate({height:191},300,function(){
		            			  t.weixingup=1;
		                    }).find(".qrcodeTable").qrcode({
			                			render	: "table",
			                			text : address
		          			});
		                    $(".qrcodeTable").css({"padding":"42px 16px 16px 16px","position":"absolute","width":"138px","height":"138px","left":"0"});
		                    
		            	  }  
                }else{
                    $(t.el.erweima).animate({height:0},300,function(){
                        t.weixingup=0;
                        var ele = $(this).find("table");
                        if(ele.length>0){
                        		ele.remove();
                        		$(".qrcodeTable").removeAttr("style");
                        }else{
                        		$("canvas").remove();
                        }
                        
                    });
                }
                return false;
            });
            $(document).bind("click",function(){
                $(t.el.erweima).animate({height:0},300,function(){
                    t.weixingup=0;
                });
            });
        },
        share : function(){
            var t=this;
            function eFunction(str){
                return function(){
                    window.open(formatmodel(t.shareIco[str],{title: t.options.title, url: t.options.url}));
                    //window.showModalDialog(formatmodel(t.shareIco[str],{title: t.options.title, url: t.options.url}), new Object(), 'dialogWidth=700px;dialogHeight=400px');
                };
                return false;
            }
            
            function formatmodel(str,model){
                for(var k in model){
                    var re = new RegExp("{"+k+"}","g");
                    str = str.replace(re,model[k]);
                }
                return str;
            }
            
            for(var si in t.shareIco){
                $("#hr_share .share_ico_"+si).on('click',eFunction(si));
            }
            
        }
    };
    controller.init(Obj);
};
