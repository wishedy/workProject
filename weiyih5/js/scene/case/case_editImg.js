$(function(){
	var editImg={};
	editImg={
		init:function(){
			var t=this;
			para=comm.getpara();
			this.id=para.id;
			this.add=para.add;
			this.draft=para.draft;
			if(this.draft){
				this.parDraft="&draft=1";
			}else{
				this.parDraft="";
			}
			if(this.add){
				this.len=1;
			}else{
				this.len=0;
			};
			this.getImg();
			this.selectStage();
			this.getLocalStorage();
			$("#attName").textareaAutoHeight();
			this.textChange($("#attName"));
			
			this.uploadImg();
			if(this.len>=40){
				$("#uploadify").parent().hide();
			}
			this.save();
			//TempCache.removeItem("imgStorage");
		},
		//初始化图片信息
		getImg:function(){
			var t=this;
			var data=customer.execute("getImg",{id:t.id,attUseFlag:7}).responseData;
			if(data.data_list){
				imgInfo=data.data_list[0];
				$("#attUrl").attr("src",imgInfo.attUrl);
			}
			
		},
		//保存
		save:function(){
			var t=this;
			$("#save").attr("on","no");
			$("#save").on("vclick",function(){
				if($(this).attr("on")=="no"){
					$(this).attr("on","yes");
					if(!t.hasUpdate){
						t.setLocalStorage();
					}
					t.hasUpdate=1;
					if(localStorage.getItem("caseStorage2")){
						var caseCon=JSON.parse(localStorage.getItem("caseStorage2"));
						var caseId=caseCon.caseId;
						//window.location.href=pageurl.urlList.toCaseUpload.url+"?caseId="+caseId+t.parDraft;    TODO: 回退
						goBack(pageurl.urlList.toCaseUpload.url+"?caseId="+caseId+t.parDraft);
					}else{
						//window.location.href=pageurl.urlList.toCaseUpload.url  TODO: 回退
						goBack(pageurl.urlList.toCaseUpload.url);
					}
				}
			});
		},
	    //所处阶段选择
	    selectStage:function(){
	    	$("#stage li").on("vclick",function(){
	    		$("#stage li").removeClass("tag_li_hover");
	    		$(this).addClass("tag_li_hover");
	    		$("#categoryId").val($(this).attr("val"));
	    	});
	    },
	    //setLocalStorage
	    setLocalStorage:function(){
	    	var t=this;
	    	var imgCon={};
	    	if(localStorage.getItem("imgStorage")){//已经存在imgStorage
	    		imgCon=JSON.parse(localStorage.getItem("imgStorage"));
	    		$.each(imgCon.imgInfor,function(i,val){
	    			if(val.id==t.id){//有这条记录就往修改这条记录
	    				val.attName=$("#attName").val();
	    				val.height=$("#attName").height();
	    				val.categoryId=$("#categoryId").val();
	    				val.imgUrl=$("#attUrl").attr("src");
	    				return false;
	    			}
	    		});
	    		if(t.add){//没有这条记录就往imgStorage添加
	    			imgCon.imgInfor.push({
			    		id:t.id,
			    		attName:$("#attName").val(),
			    		height:$("#attName").height(),
			    		categoryId:$("#categoryId").val(),
			    		imgUrl:$("#attUrl").attr("src")
			    	});
	    		}
	    	}else{//不存在imgStorage
		    	imgCon.imgInfor=[];
		    	imgCon.imgInfor.push({
		    		id:t.id,
		    		attName:$("#attName").val(),
		    		height:$("#attName").height(),
		    		categoryId:$("#categoryId").val(),
		    		imgUrl:$("#attUrl").attr("src")
		    	});
	    	}
	    	
	    	localStorage.setItem("imgStorage", JSON.stringify(imgCon));
	    },
	    //getLocalStorage
	    getLocalStorage:function(){
	    	var t=this;
	    	if(localStorage.getItem("imgStorage")){//已经存在imgStorage
	    		imgCon=JSON.parse(localStorage.getItem("imgStorage"));
	    		$.each(imgCon.imgInfor,function(i,val){
	    			if(val.id==t.id){
	    				$("#attName").val(val.attName);
	    				$("#attName").height(val.height);
	    				$("#categoryId").val(val.categoryId);
	    				$("#attUrl").attr("src",val.imgUrl);
	    				if($("#attName").val()!=''){
	    					$("#attName").parent().css("top","3.2em");
	    					$("#attName").parent().next().show();
	    				}
	    				$("#attName").parents(".case_title").css("height",$("#attName").parent().next().outerHeight(true)+$("#attName").height()+5);
	    				$("#stage li").removeClass("tag_li_hover");
	    				$.each($("#stage li"),function(i,em){
	    					if($(em).attr("val")==val.categoryId){
	    						$(em).addClass("tag_li_hover");
	    					}
	    				});
	    				$("#attName").height(document.getElementById("attName").scrollHeight);
	    				return;
	    			}
	    		});
	    		this.len+=imgCon.imgInfor.length;
	    	}
	    },
	    //上传图片
		uploadImg:function(){
			var t=this;
			if(localStorage.getItem('caseStorage')){
				var caseCon=JSON.parse(localStorage.getItem('caseStorage'));
				this.caseId=caseCon.caseId;
			}
			if(localStorage.getItem('caseStorage2')){
				var caseCon=JSON.parse(localStorage.getItem('caseStorage2'));
				this.caseId=caseCon.caseId;
			}
			$("#uploadify").attr("on","no");
			$("#uploadify").on("vclick",function(){
				if($(this).attr("on")=="no"){
					$(this).attr("on","yes");
					if(!t.hasUpdate){
						t.setLocalStorage();
					}
					t.hasUpdate=1;
				}
			});
			czyx.uploadReplace('#uploadify',{
		        url:'/mcall/case/attachment/create/', //文件处理的URL,
		        data:{caseId:t.caseId},
		        uploadReplaceCss:{
		            //设置上传按钮图片
		            background:'url(//img50.allinmd.cn/case/bc_sc.jpg) center no-repeat',
		            backgroundSize:'100%',
		            width:"100%",             //上传按钮的宽度
		            height:"7.25em"              //上传按钮的高度
		        },
		        uploadInputCss:{
		            width:"100%",             //上传按钮的宽度
		            height:"100%"             //上传按钮的高度
		        },
		        uploadBefore:function(){
		            if(!/\.((JPEG)|(jpeg)(jpg)|(JPG)|(png)|(PNG))$/i.test(this.value)){
		                popup('只允许上传.jpg .jpeg .png类型的图片文件');
		                return false ;
		            }
					if(comm.getFileSize(document.getElementById("uploadify"))>1048576*10){
						popup('图片不能大于10M');
						$(this).val("");
						return false ;
					}
					$.mobile.loading("show");
		        },
		        uploadEnd:function(serverJson){//上传完毕后调用
		            try{
		            	serverJson = $.parseJSON($(serverJson).html());
		                if(serverJson.responseObject.responseStatus) {
		                	//popup('上传成功');
                            
		                    //setTimeout(function(){
                      g_sps.jump(null,pageurl.urlList.toEditImg.url+serverJson.responseObject.responsePk+"&add=1"+t.parDraft);
		                    //},2000)
		                    
		                }
		            }catch(e){
		                popup('上传失败');
		                return ;
		            }
		        }
		    });
		},
	    //文本框改变检索
		textChange:function($text){
		    var ie = jQuery.support.htmlSerialize; //是否ie 
			var nowNum = 0; //非汉字个数
			
			//文本框字数计算和提示改变 
			if(ie){ 
				$text.bind("input",function(){changeNum($text)}); 
			}else{ 
				$text.bind("propertychange",function(){changeNum($text)}); 
			}  
		  
			changeNum = function($text){  
		        nowNum=$text.val().length;
		        var maxNum = $text.attr("max"); //最大字符数
		        if(nowNum==0){
		        	$text.parent().parent().find(".case_mr_title").hide();
		        	$text.parent().css("top","2em");		
				}else{
					$text.parent().parent().find(".case_mr_title").show();
					$text.parent().css("top","3.2em");		
				}
		        if(nowNum<maxNum || nowNum == maxNum){//未超出
		        	
		        }else{//超出
		        	$text.val($text.val().substring(0,maxNum));
		        }
		        
		    }  
		}
	}
	
	editImg.init();
	
})