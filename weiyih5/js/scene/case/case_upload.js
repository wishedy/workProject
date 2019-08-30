$(function(){
	//user.privLogin();  //未登录跳转
	//Log.createBrowse(83,"病例编辑页");
	var upload={};
	upload={
		init:function(){
			this.loadHref();
			var t=this;
			//编辑病例
			para=comm.getparaNew();
			this.propertyIdList=para.tId;//从标签专题页带过来的标签Id
			this.caseId=para.caseId;
			this.edit=para.caseId;
			this.draftEdit=para.draft;
			this.deleteAttIds="";
			if(this.caseId){//修改
				if(!TempCache.getItem("prevCaseHref")){
					TempCache.setItem("prevCaseHref", document.referrer);//记录上传病例的来源页，以后用作返回依据
				}
				$(".new_case_title").text("编辑病例");
				document.title="编辑病例";
				if(t.draftEdit){//草稿箱编辑
					$("#delete").show();
					this.deleteCase();
				}
				if(localStorage.getItem('caseStorage2')){//有本地存储
					var caseCon=JSON.parse(localStorage.getItem('caseStorage2'));
					if(t.caseId==caseCon.caseId){//非第一次进编辑页
						t.getLocalStorage('caseStorage2');
						t.uploadSubmit(1);
					}else{//第一次进编辑页
						t.getCase();
						t.uploadSubmit(1);
					}

				}else{
					t.getCase();
					t.uploadSubmit(1);
				}

			}else{//创建
				if(!TempCache.getItem("prevCaseHref")){
					TempCache.setItem("prevCaseHref", document.referrer);//记录上传病例的来源页，以后用作返回依据
				}
				TempCache.removeItem("caseStorage2");
				if(localStorage.getItem('caseStorage')){
					this.getLocalStorage('caseStorage');
					this.uploadSubmit();
				}else{
					TempCache.removeItem("imgStorage");
					$(":text").val("");
					$("textarea").val("");
					uploadCase=customer.execute("uploadCase",{});//创建一条病例
					if(uploadCase&&uploadCase.responseStatus){
						t.caseId=uploadCase.responsePk;
						//this.getTagstorage();
						this.uploadImg();
						this.uploadSubmit();
						this.setLocalStorage('caseStorage');
					}else{
						popup("创建病例失败");
					}
				}
			}
			t.prevCaseHref=TempCache.getItem("prevCaseHref");
			this.ageFocus();
			$("textarea").each(function(i,em){
				$(em).textareaAutoHeight();
				t.textChange($(em));
			});
			$("input").each(function(i,em){
				t.textChange($(em));
			});
			
			/*$(".case_tag").on("vclick",function(){
				if(t.edit){
					t.setLocalStorage("caseStorage2");
				}else{
					t.setLocalStorage("caseStorage");
				}
				
				window.location.href=pageurl.urlList.toEditTag.url;
			});*/
			
			$(".remind").on("vclick",function(){
				if(t.edit){
					t.setLocalStorage("caseStorage2");
				}else{
					t.setLocalStorage("caseStorage");
				}
        g_sps.jump(null,pageurl.urlList.toRemind.url+"case");
			});
			//返回按钮处理
			$("#back").on("vclick",function(){
				//if(t.prevCaseHref.indexOf("pages/upload-select.html")>0){
					//t.prevCaseHref=localStorage.getItem('prevHref');
				//}
				//埋点
				comm.creatEvent({
					triggerType:'全站功能按钮点击',
					keyword:"返回",
					actionId:41,
					async:false
				});
				if(t.edit){//编辑
					if(t.draftEdit){//编辑修改病例草稿箱
						t.saveOrNoDraft();
					}else{//编辑修改病例
						//t.setLocalStorage("caseStorage2");
						t.removePrevHref();//清楚来源页
						//页面跳转
						goBack(t.prevCaseHref);
					}
				}else{
					t.saveOrNoDraft();
					//history.go(-1);
					//t.setLocalStorage("caseStorage");
				}

			});
			this.writeAge($("#age"));
			this.writeAge($("#month"));
			this.writeAge($("#day"));
			this.sexChange();
			this.moreCaseContent();
		},
		loadHref:function(){
			if(localStorage.getItem("src")=="caseTag"){
				localStorage.removeItem("src");
				history.go(0);
			}
		},
		//删除草稿
		deleteCase:function(){
			var t=this;
			$("#delete").on("vclick",function(){
				comm.loading.show();
				var data={caseId:t.caseId,deleteFlag:1};
				var param={};
				param.paramJson= $.toJSON(data);
				$.ajax({
				    type : "post",
				    url : "/mcall/case/baseinfo/update/",
				    data : param,
				    dataType : "json",
				    success : function(rep){
						comm.loading.hide();
						if(rep.responseObject.responseStatus){
							popup("删除成功");
              g_sps.jump(null,TempCache.getItem("prevCaseHref"));
							TempCache.removeItem("caseStorage");
							TempCache.removeItem("caseStorage2");
							TempCache.removeItem("tagStorage");
							TempCache.removeItem("imgStorage");
							TempCache.removeItem("caseAttStorage");
						}else{
							popup("删除失败");
						}
				    },
				    error:function(){}
				});
			})
		},
		removePrevHref:function(){//清楚发布病例来源页
			TempCache.removeItem("prevCaseHref");
		},
		//保存草稿箱
		saveOrNoDraft:function(){
			var t=this;
			if($(".case_content input").val()||$(".case_content textarea").val()||$("#img_list .case_sc").length>0||$(".tag_li li").length>0||$(".rem_list li").length>0){
				comm.draftAttention($(".case_content"),"是否要保存该病例至草稿箱？");
				$("#no_save_dra").on("vclick",function(){//不保存
					t.removePrevHref();
					TempCache.removeItem("activity");     //清楚活动的缓存
          g_sps.jump(null,t.prevCaseHref);  //TODO: 回退
					//goBack(t.prevCaseHref,-2);
				});
				$("#save_dra").attr("on","true");
				$("#save_dra").on("vclick",function(){//保存
					if(localStorage.getItem("userId")){
						if($(this).attr("on")=="true"){
							$(this).attr("on","false");
							t.save(2);
						}
					}else{
            g_sps.jump(null,"/");
					}
				})
			}else{
				TempCache.removeItem("activity");     //清楚活动的缓存
				history.go(-1);
			};
		},
		ageFocus:function(){
			$("#age").on("keyup",function(){
				if($(this).val()!=""&&$(this).val()>=0&&$(this).val()<=5){
					$(".input_age").addClass("focus");
					$("#month").attr("disabled",false);
					$("#day").attr("disabled",false);
				}else{
					$("#month").attr("disabled",true).val("");
					$("#month").parents(".input_age").removeClass("focus");
					$("#day").attr("disabled",true).val("");
					$("#day").parents(".input_age").removeClass("focus");
				}
			})
		},
		//编辑获取病例信息
		getCase:function(){
			var t=this;
			var data={caseId:t.caseId,attUseFlag:7};
			var param={};
    		param.paramJson= $.toJSON(data);
			$.ajax({
				url:"/mcall/case/baseinfo/info/",
				type : 'POST',
				data : param,
				dataType:"json",
				async: false,
				success:function(rep){
					if(rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
						if(rep.responseObject.responseData.data_list.length>0){
							TempCache.removeItem("caseStorage2");
							caseCon=rep.responseObject.responseData.data_list[0].case_baseinfo;
							caseSup=rep.responseObject.responseData.data_list[0].case_supplement;
							t.webStoragePath=rep.responseObject.responseData.data_list[0].case_baseinfo.webStoragePath;
							
							t.uploadImg();
							$("#case_name").val(caseCon.caseName);
							$("#sex_id").val(caseCon.sexId);
							$("#age").val(caseCon.age);
							$("#month").val(caseCon.ageMonth?caseCon.ageMonth:"");
							$("#day").val(caseCon.ageDay>0?caseCon.ageDay:"");
							if(caseCon.age!=""&&caseCon.age==0){
								$(".input_age").addClass("focus");
								$("#month").attr("disabled",false);
								$("#day").attr("disabled",false);
							}else if(caseCon.age!=""&&caseCon.age>0&&caseCon.age<=5){
								$("#month").parent(".input_age").addClass("focus");
								$("#month").attr("disabled",false);
							}else{
								$("#month").val("");
								$("#day").val("");
							}
							
							$("#main_narrate").val(caseCon.mainNarrate);
							$("#illness_history").val(caseCon.illnessHistory);
							$("#professional_checking").val(caseCon.professionalChecking);
							$("#discussion").val(caseCon.discussion);
							
							$("#past_history").val($.isEmptyObject(caseSup.pastHistory)?"":caseSup.pastHistory);
							$("#personal_history").val($.isEmptyObject(caseSup.personalHistory)?"":caseSup.personalHistory);
							$("#family_history").val($.isEmptyObject(caseSup.familyHistory)?"":caseSup.familyHistory);
							
							$("#auxiliary_info").val($.isEmptyObject(caseSup.auxiliaryInfo)?"":caseSup.auxiliaryInfo);
							$("#diagnosis_info").val($.isEmptyObject(caseSup.diagnosisInfo)?"":caseSup.diagnosisInfo);
							$("#treatment_record").val($.isEmptyObject(caseSup.treatmentRecord)?"":caseSup.treatmentRecord);
							$("#operation_name").val($.isEmptyObject(caseSup.operationName)?"":caseSup.operationName);
							$("#intraoperative_info").val($.isEmptyObject(caseSup.intraoperativeInfo)?"":caseSup.intraoperativeInfo);
							$("#product_info").val($.isEmptyObject(caseSup.productInfo)?"":caseSup.productInfo);
							$(".radio").attr("src","//img50.allinmd.cn/case/radio_mr.png");
							$.each($(".radio"),function(i,em){
								if(caseCon.sexId==$(em).attr("val")){
									$(em).attr("src","//img50.allinmd.cn/case/radio_click.png");
								}	 
							});
							if($("#past_history").val()||$("#personal_history").val()||$("#family_history").val()||$("#auxiliary_info").val()||$("#diagnosis_info").val()||$("#treatment_record").val()||$("#operation_name").val()||$("#intraoperative_info").val()||$("#product_info").val()){
								$(".more_case_xx").hide();
								$("#more").show();
							}
							$.each($(".input_title"),function(i,em){
								if($(this).find("input").val()!=''&&$(this).find("textarea").val()!=''){
									$(this).css("top","3.2em");
									$(this).next().show();	
								}	
							});
							$("textarea").each(function(i,em){
								if($(em).val()!=''){
									$(this).height(this.scrollHeight);
									$(this).parents(".case_title").css("height",$(this).parent().next().outerHeight(true)+$(this).height()+12);
									$(this).parents(".case_title_more_p").css("height",$(this).parent().next().outerHeight(true)+$(this).height()+12);
								}
							});
							//上传的图片
							var imgList;
							imgList1=rep.responseObject.responseData.data_list[0].case_att_url_list_1;
							imgList2=rep.responseObject.responseData.data_list[0].case_att_url_list_2;
							imgList3=rep.responseObject.responseData.data_list[0].case_att_url_list_3;
							if(!$.isEmptyObject(imgList1)){
								imgList=imgList1.concat(imgList2).concat(imgList3);
							}else
							if(!$.isEmptyObject(imgList2)){
								imgList=imgList2.concat(imgList3);
							}else
							if(!$.isEmptyObject(imgList3)){
								imgList=imgList3;
							}
							if(imgList&&imgList.length>0){
								TempCache.removeItem("imgStorage");
								html="";
								t.imgCon={};
								t.imgCon.imgInfor=[];
								if(imgList.length>=40){
									$("#uploadify").parent().hide();
								}
								$.each(imgList,function(i,val){
									t.imgCon.imgInfor.push({
							    		id:val.id,
							    		attName:val.caseAttName,
							    		height:"",
							    		categoryId:val.caseCategoryId,
							    		imgUrl:val.attUrl
							    	});
									html+="<div class='case_sc'><div class='img_con'><img class='img_view' src='"+val.attUrl+"' imgid='"+val.id+"'/></div><div class='case_close' imgid='"+val.id+"'><img src='//img50.allinmd.cn/case/close.png'/></div></div>";
								});

								$("#img_list").html(html);
								$(".img_con").each(function(i,em){
									$(em).css("height",$(em).width());
								});
								t.imgHandle();
							}
							//标签
							/*tagContent=rep.responseObject.responseData.data_list[0].case_tag_list;
							if(tagContent.length>0){
								TempCache.removeItem("tagStorage");
			            		
								html="";
								t.tag={};
								t.tag.tagContent=[];
								$.each(tagContent,function(i,val){
									$("#tag_title").hide();
									$("#showTitle").show();
									t.tag.tagContent.push([val.tagId,val.tagName]);
									html+="<li><div class='tag_text' tagid="+val.tagId+">"+val.tagName+"</div></li>";
								});
								//localStorage.setItem("tagStorage", JSON.stringify(t.tag));
								$(".tag_li").show().html(html+="<div class='clear'></div>");
							}*/
							//提醒谁看
							attContent=rep.responseObject.responseData.data_list[0].case_remind_list;
							if(attContent&&attContent.length>0){
								TempCache.removeItem("caseAttStorage");
								html="";
								t.attention={};
								t.attention.attContent=[];
								$.each(attContent,function(i,val){
									$("#rem_title").hide();
									$("#rem_show").show();
									name=val.lastName+val.firstName;
									t.attention.attContent.push([val.customerId,name]);
									html+="<li customerid="+val.customerId+">"+name+"，</li>";
									
								});
								html+='<div class="clear"></div>';
								$(".rem_list").show().append(html);
								//localStorage.setItem("caseAttStorage", JSON.stringify(attention));
							}
						}else{
							popup("获取信息失败");
							t.removePrevHref();//清楚来源页
              g_sps.jump(null,t.prevCaseHref);
						}
					}else{
						popup("获取信息失败");
						t.removePrevHref();//清楚来源页
            g_sps.jump(null,t.prevCaseHref);
					}
				}
			})
		},
		//存储localStorage
		setLocalStorage:function(Storage){
			var caseCon={};
			//设置caseStorage
			caseCon.caseId=this.caseId;
			caseCon.caseName=$("#case_name").val();
			caseCon.sexId=$("#sex_id").val();
			caseCon.age=$("#age").val();
			caseCon.ageMonth=$("#month").val();
			caseCon.ageDay=$("#day").val();
			caseCon.mainNarrate=$("#main_narrate").val();
			caseCon.illnessHistory=$("#illness_history").val()+"_"+$("#illness_history").height();
			caseCon.professionalChecking=$("#professional_checking").val()+"_"+$("#professional_checking").height();
			caseCon.discussion=$("#discussion").val()+"_"+$("#discussion").height();
			caseCon.pastHistory=$("#past_history").val()+"_"+$("#past_history").height();
			caseCon.personalHistory=$("#personal_history").val()+"_"+$("#personal_history").height();
			caseCon.familyHistory=$("#family_history").val()+"_"+$("#family_history").height();
			caseCon.auxiliaryInfo=$("#auxiliary_info").val()+"_"+$("#auxiliary_info").height();
			caseCon.diagnosisInfo=$("#diagnosis_info").val()+"_"+$("#diagnosis_info").height();
			caseCon.treatmentRecord=$("#treatment_record").val()+"_"+$("#treatment_record").height();
			caseCon.operationName=$("#operation_name").val()+"_"+$("#operation_name").height();
			caseCon.intraoperativeInfo=$("#intraoperative_info").val()+"_"+$("#intraoperative_info").height();
			caseCon.productInfo=$("#product_info").val()+"_"+$("#product_info").height();
			caseCon.propertyIdList= this.propertyIdList;//从标签专题页带过来的标签id;
			caseCon.deleteAttIds= this.deleteAttIds;//存储删除的照片
			if(this.edit){
				caseCon.webStoragePath=this.webStoragePath;
			}
			localStorage.setItem(Storage, JSON.stringify(caseCon));
			if(this.imgCon){
				localStorage.setItem("imgStorage", JSON.stringify(this.imgCon));
			}
			/*if(this.tag){
				localStorage.setItem("tagStorage", JSON.stringify(this.tag));
			}*/
			if(this.attention){
				localStorage.setItem("caseAttStorage", JSON.stringify(this.attention));
			}
		},
		//获取localStorage
		getLocalStorage:function(Storage){
			//caseStorage
			if(localStorage.getItem(Storage)){
				var caseCon=JSON.parse(localStorage.getItem(Storage));
				this.caseId=caseCon.caseId;
				this.propertyIdList=caseCon.propertyIdList;//从标签专题页带过来的标签id;
				this.deleteAttIds=caseCon.deleteAttIds;//存储删除的照片
				this.uploadImg();
				if(this.edit){//编辑时删除本地存储
					TempCache.removeItem(Storage);
					this.webStoragePath=caseCon.webStoragePath;
				}
				if(caseCon.age!=""&&caseCon.age==0){
					$(".input_age").addClass("focus");
					$("#month").attr("disabled",false);
					$("#day").attr("disabled",false);
				}else if(caseCon.age!=""&&caseCon.age>0&&caseCon.age<=5){
					$("#month").parent(".input_age").addClass("focus");
					$("#month").attr("disabled",false);
				}
				$("#case_name").val(caseCon.caseName);
				$("#sex_id").val(caseCon.sexId);
				$("#age").val(caseCon.age);
				$("#month").val(caseCon.ageMonth);
				$("#day").val(caseCon.ageDay);
				$("#main_narrate").val(caseCon.mainNarrate);
				$("#illness_history").val(caseCon.illnessHistory.split("_")[0]).height(caseCon.illnessHistory.split("_")[1]);
				$("#professional_checking").val(caseCon.professionalChecking.split("_")[0]).height(caseCon.professionalChecking.split("_")[1]);
				$("#discussion").val(caseCon.discussion.split("_")[0]).height(caseCon.discussion.split("_")[1]);
				$("#past_history").val(caseCon.pastHistory.split("_")[0]).height(caseCon.pastHistory.split("_")[1]);
				$("#personal_history").val(caseCon.personalHistory.split("_")[0]).height(caseCon.personalHistory.split("_")[1]);
				$("#family_history").val(caseCon.familyHistory.split("_")[0]).height(caseCon.familyHistory.split("_")[1]);
				
				$("#auxiliary_info").val(caseCon.auxiliaryInfo.split("_")[0]).height(caseCon.auxiliaryInfo.split("_")[1]);
				$("#diagnosis_info").val(caseCon.diagnosisInfo.split("_")[0]).height(caseCon.diagnosisInfo.split("_")[1]);
				$("#treatment_record").val(caseCon.treatmentRecord.split("_")[0]).height(caseCon.treatmentRecord.split("_")[1]);
				$("#operation_name").val(caseCon.operationName.split("_")[0]).height(caseCon.operationName.split("_")[1]);
				$("#intraoperative_info").val(caseCon.intraoperativeInfo.split("_")[0]).height(caseCon.intraoperativeInfo.split("_")[1]);
				$("#product_info").val(caseCon.productInfo.split("_")[0]).height(caseCon.productInfo.split("_")[1]);
				$(".radio").attr("src","//img50.allinmd.cn/case/radio_mr.png");
				$.each($(".radio"),function(i,em){
					if(caseCon.sexId==$(em).attr("val")){
						$(em).attr("src","//img50.allinmd.cn/case/radio_click.png");
					}	 
				});
				if($("#past_history").val()||$("#personal_history").val()||$("#family_history").val()||$("#auxiliary_info").val()||$("#diagnosis_info").val()||$("#treatment_record").val()||$("#operation_name").val()||$("#intraoperative_info").val()||$("#product_info").val()){
					$(".more_case_xx").hide();
					$("#more").show();
				}
				$.each($(".input_title"),function(i,em){
					if($(this).find("input").val()!=''&&$(this).find("textarea").val()!=''){
						$(this).css("top","3.2em");
						$(this).next().show();	
					}	
				});
				$("textarea").each(function(i,em){
					if($(em).val()!=''){
						$(this).parents(".case_title").css("height",$(this).parent().next().outerHeight(true)+$(this).height()+12);
						$(this).parents(".case_title_more_p").css("height",$(this).parent().next().outerHeight(true)+$(this).height()+12);
					}
				});
			}
			//tagStorage
			//this.getTagstorage();
			//imgStorage
			if(localStorage.getItem("imgStorage")){
				var html="";
				this.imgCon=JSON.parse(localStorage.getItem("imgStorage"));
				if(this.edit) {
					TempCache.removeItem("imgStorage");
				}
				imgList=this.imgCon.imgInfor;
				if(imgList.length>=40){
					$("#uploadify").parent().hide();
				}
				$.each(imgList,function(i,val){
					html+="<div class='case_sc'><div class='img_con'><img class='img_view' src='"+val.imgUrl+"' imgid='"+val.id+"'/></div><div class='case_close' imgid='"+val.id+"'><img src='//img50.allinmd.cn/case/close.png'/></div></div>";
				});
				$("#img_list").html(html);
				$(".img_con").each(function(i,em){
					$(em).css("height",$(em).width());
				});
				this.imgHandle();
			};
			//caseAttStorage
			if(localStorage.getItem("caseAttStorage")){
				$("#rem_title").hide();
				$("#rem_show").show();
				this.attention=JSON.parse(localStorage.getItem("caseAttStorage"));
				if(this.edit) {
					TempCache.removeItem("caseAttStorage");
				}
				attContent=this.attention.attContent;
				var html="";
				$.each(attContent,function(i,n){
					html+="<li customerid="+attContent[i][0]+">"+attContent[i][1]+"，</li>";
				});
				html+="<div class='clear'></div>";
				$(".rem_list").show().append(html);
			}
		},
		getTagstorage:function(){
			if(localStorage.getItem("tagStorage")){
				var html="";
				this.tag=JSON.parse(localStorage.getItem("tagStorage"));
				if(this.edit){
					TempCache.removeItem("tagStorage");
				}
				tagContent=this.tag.tagContent;
				$.each(tagContent,function(i,n){
					$("#tag_title").hide();
					$("#showTitle").show();
					html+="<li><div class='tag_text' tagid="+tagContent[i][0]+">"+tagContent[i][1]+"</div></li>";
				});
				$(".tag_li").show().html(html+="<div class='clear'></div>");
			}
		},
		moreCaseContent:function(){
			$(".more_case_xx").on("vclick",function(){
				$(this).hide();
				$("#more").show();
			});
			
		},
		sexChange:function(){
			$(".radio").each(function(i,em){
				$(em).on("vclick",function(){
					$(".radio").attr("src","//img50.allinmd.cn/case/radio_mr.png");
					$(em).attr("src","//img50.allinmd.cn/case/radio_click.png");
					$("#sex_id").val($(em).attr("val"));
				})
			});
		},
		//年龄处理
		writeAge:function(obj){ 
			obj.keydown(change).keyup(change).change(change)
			obj[0].onpaste=change;
			function change(){
				obj.val(obj.val().replace(/[^\d]/g,''));
				if(obj.val().length!=0){
					/*if($("#age").val()>120){
						$("#age").val($("#age").val().substring(0,2));	
					}*/
					if(obj.val()==0){
						obj.val(0);	
					}
				}
								
			};	
		},
		//文本框改变检索
		textChange:function($text){
		    var ie = jQuery.support.htmlSerialize; //是否ie
			var str = 0;//汉字的个数
			var abcnum = 0; //非汉字个数
			var maxNum = maxNum; //最大字符数
			//文本框字数计算和提示改变
			if(ie){
				$text.bind("input",function(){changeNum($text)});
			}else{
				$text.bind("propertychange",function(){changeNum($text)});
			}

			changeNum = function($text){
				//汉字的个数
				//str = ($text.val().replace(/\w/g,"")).length;
				////非汉字的个数
				//abcnum = $text.val().length-str;
				//var total=str+abcnum;
				//maxNum = $text.attr("max")*2;
				var total = $text.val().length;
				maxNum = $text.attr('max');
		        if(total==0){
		        	$text.parent().parent().find(".case_mr_title").hide();
		        	$text.parent().css("top","2em");
				}else{
					$text.parent().parent().find(".case_mr_title").show();
					$text.parent().css("top","3.2em");
				}
				if(maxNum){
					if(total<maxNum || total == maxNum){//未超出

					}else{//超出
						$text.val($text.val().substring(0,maxNum));
					}
				}

		    }
		},
		//上传图片
		uploadImg:function(){
			var t=this;
			czyx.uploadReplace('#uploadify',{
		        url:'/mcall/case/attachment/create/', //文件处理的URL,
		        data:{caseId:t.caseId},
		        uploadReplaceCss:{
		            //设置上传按钮图片
		            background:'url(//img50.allinmd.cn/case/xin_photo.png) center no-repeat',
		            backgroundSize:'100%',
		            width:"10.625em",             //上传按钮的宽度
		            height:"10.625em",              //上传按钮的高度
		            float:'left',
		            top:'1.875em',
		            marginBottom:'1.875em'
		        },
		        uploadInputCss:{
		            width:"100%",             //上传按钮的宽度
		            height:"100%"             //上传按钮的高度
		        },
		        uploadBefore:function(){
					comm.loading.show();
		            if(!/\.((JPEG)|(jpeg)(jpg)|(JPG)|(png)|(PNG))$/i.test(this.value)){
						comm.loading.hide();
						$(this).val("");
		                popup('只允许上传.jpg .jpeg .png类型的图片文件');
		                return false ;
		            }
					if(comm.getFileSize(document.getElementById("uploadify"))>1048576*10){
						comm.loading.hide();
						popup('图片不能大于10M');
						$(this).val("");
						return false ;
					}
		        },
		        uploadEnd:function(serverJson){//上传完毕后调用
					comm.loading.hide();
		            try{
		                serverJson = $.parseJSON($(serverJson).html());
		                if(serverJson.responseObject.responseStatus) {
							draftPar="";
		                	if(t.edit){
		    					t.setLocalStorage("caseStorage2");
		    				}else{
		    					t.setLocalStorage("caseStorage");
		    				}
							if(t.draftEdit){
								draftPar="&draft=1";
							}
                      g_sps.jump(null,pageurl.urlList.toEditImg.url+serverJson.responseObject.responsePk+"&add=1"+draftPar);
		                    
		                }else{
							popup('上传失败');
							return ;
						}
		            }catch(e){
		                popup('上传失败');
		                return ;
		            }
		        }
		    });
		},
		//已上传图片的点击和删除按钮的点击
		imgHandle:function(){
			var t=this;
			draftPar="";
			$(".img_view").on("vclick",function(){
				if(t.edit){
					t.setLocalStorage("caseStorage2");
				}else{
					t.setLocalStorage("caseStorage");
				}
				if(t.draftEdit){
					draftPar="&draft=1";
				}
        g_sps.jump(null,pageurl.urlList.toEditImg.url+$(this).attr("imgid")+draftPar);
			});
			$(".case_close").on("vclick",function(){//删除
				if($(this).attr("on")!="true"){
					$(this).attr("on","true");
					var $parent=$(this).parents(".case_sc");
					var id=$(this).attr("imgid");
					/*comm.loading.show();
					var deleteImg=customer.execute("deleteImg", {id:id});
					if(deleteImg&&deleteImg.responseStatus){
						comm.loading.hide();
						popup("删除图片成功!");*/
					    t.deleteAttIds+=id+",";
						$parent.remove();
						if($(".case_sc").length<40){
							setTimeout(function(){
								$("#uploadify").parent().show();
							},300);
						}
						if(t.imgCon.imgInfor.length>0){
							$.each(t.imgCon.imgInfor,function(i,val){
								if(val.id==id){
									t.imgCon.imgInfor.splice(i,1);
									return false;
								}
							});
						}
						if(localStorage.getItem("imgStorage")){
							var html="";
							var imgCon=JSON.parse(localStorage.getItem("imgStorage"));
							imgList=imgCon.imgInfor;
							$.each(imgList,function(i,val){
								if(val.id==id){
									imgList.splice(i,1);
									return false;
								}
							});
							t.imgCon=imgCon;
							localStorage.setItem("imgStorage", JSON.stringify(imgCon));
						}
					/*}else{
						comm.loading.hide();
						$(this).attr("on","false");
						popup("删除图片失败!");
					}*/
				}
				return false;
			});
		},
		//点击发布按钮
		uploadSubmit:function(update){
			var t=this;
			$("#upload_btn").attr("on","true");
			$("#upload_btn").on("vclick",function(){
				if(localStorage.getItem("userId")){
					if($(this).attr("on")=="true"){
						t.save(update);
					}
				}else{
          g_sps.jump(null,"/");
				}
			});
		},
		save:function(update){
			var t=this;
			var tagList='';
			$(".tag_li li div").each(function(i,em){
				tagname=$(em).attr("tagid")+'_'+$(em).text()+",";
				tagList+=tagname;
			});
			var data={};
			data.platformId = TempCache.getItem('department');
			data.caseId=t.caseId;
			data.isValid=1;
			data.opType=1;
			data.isDraft=0;
			if(update==1){//修改病例
				data.moidfyTime=1;
			}else if(update==2){//草稿箱
				data.isValid=0;
				data.isDraft=1;
			}
			data.caseName=$("#case_name").val();
			data.sexId=$("#sex_id").val();
			data.age=$("#age").val();
			data.ageMonth=$("#month").val();
			data.ageDay=$("#day").val();

			data.mainNarrate=$("#main_narrate").val();
			data.illnessHistory=$("#illness_history").val();
			data.mainNarrate=$("#main_narrate").val();
			data.professionalChecking=$("#professional_checking").val();
			data.discussion=$("#discussion").val();
			data.pastHistory=$("#past_history").val();
			data.personalHistory=$("#personal_history").val();
			data.familyHistory=$("#family_history").val();
			data.auxiliaryInfo=$("#auxiliary_info").val();
			data.diagnosisInfo=$("#diagnosis_info").val();
			data.treatmentRecord=$("#treatment_record").val();
			data.operationName=$("#operation_name").val();
			data.intraoperativeInfo=$("#intraoperative_info").val();
			data.productInfo=$("#product_info").val();
			data.propertyIdList= this.propertyIdList;//从标签专题页带过来的标签id;
			//data.tagList=tagList.substring(0, tagList.length-1);
			//TODO 新版活动增加参数
			var activity=JSON.parse(localStorage.getItem("activity"));
			if(activity&&(!update||update==2)){//第一次创建时或者保存草稿
				data.activityId= activity.activityId;          //是否活动上传  不传表示普通上传
				data.property= activity.property;//JSON.stringify(activity.property);              //新版活动类别
				data.property_area= activity.property_area;//JSON.stringify(activity.property_area);    //新版活动赛区参数
			}

			if(update!=2){//非草稿箱保存时执行;
				if(!data.caseName){
					comm.attention("请填写标题!",$(".case_content"));
					return;
				}
				if(!data.mainNarrate){
					//popup("请填写主诉或讨论内容!");
					comm.attention("请填写主诉!",$(".case_content"));
					return;
				}
				if(!data.illnessHistory){
					comm.attention("请填写现病史!",$(".case_content"));
					return;
				}
				if(!data.professionalChecking){
					comm.attention("请填写体格检查!",$(".case_content"));
					return;
				}
				if(!data.sexId){
					comm.attention("请选择性别!",$(".case_content"));
					return;
				}
				if(data.age==""){
					comm.attention("请填写年龄!",$(".case_content"));
					return;
				}
				if(data.age==0){//年龄为0,天数必填
					if(data.ageDay==''){
						comm.attention("病人年龄中天数必填!",$(".case_content"));
						return;
					}else if(data.ageDay<1||data.ageDay>28){
						comm.attention("病人年龄中天数在1~28天之间!",$(".case_content"));
						return;
					}
					if(data.ageMonth&&(data.ageMonth<0||data.ageMonth>12)){
						comm.attention("病人年龄中月在0~12月之间!",$(".case_content"));
						return;
					}
				}
				if(data.age>0&&data.age<=5){
					if(data.ageMonth==''){
						comm.attention("病人年龄中月数必填!",$(".case_content"));
						return;
					}else if(data.ageMonth<0||data.ageMonth>12){
						comm.attention("病人年龄中月在0~12月之间!",$(".case_content"));
						return;
					}
					if((data.ageDay<1||data.ageDay>28)&&data.ageDay){
						comm.attention("病人年龄中天数在1~28天之间!",$(".case_content"));
						return;
					}
				}
				if(data.age>120||data.age<0){
					comm.attention("病人年龄在0~120岁之间!",$(".case_content"));
					return;
				}
				if(data.ageMonth==""){
					data.ageMonth=0;
				}
				if(data.ageDay==""){
					data.ageDay=0;
				}
				if(data.age==0&&data.ageMonth==0&&age.ageDay==0){
					comm.attention("请输入病人的年龄!",$(".case_content"));
					return;
				}
			}
			if(update!=2){
				$("#upload_btn").attr("on","false");
			}
			comm.loading.show();
			var attention,attContent;
			//提醒
			if(localStorage.getItem("caseAttStorage")){
				attention=JSON.parse(localStorage.getItem("caseAttStorage"));
			}
			if(this.attention){
				attention=this.attention;
			}
			if(attention){
				attContent=attention.attContent;
				var idList="";
				$.each(attContent,function(i,n){
					idList+=attContent[i][0]+",";
				});
				data.refCustomerIdList=idList.substring(0,idList.length-1);
			}
			var caseAttachmentParam="";
			if(t.imgCon && t.imgCon.imgInfor && t.imgCon.imgInfor.length>0){
				$.each(t.imgCon.imgInfor,function(i,val){
					caseAttachmentParam+=val.id+"☆"+val.categoryId+"☆"+val.attName+",";
				});
				data.caseAttachmentParam=caseAttachmentParam.substring(0,caseAttachmentParam.length-1);
			}
			t.deleteAttIds && (data.deleteAttIds= t.deleteAttIds.substring(0,t.deleteAttIds.length-1));
			//updateCase=customer.execute("updataCase",data);
			$.ajax({
			    type : "post",
			    url : "/mcall/case/baseinfo/update/",
			    data : {paramJson: $.toJSON(data)},
			    dataType : "json",
			    success : function(rep){
					$("#upload_btn").attr("on","true");
					updateCase=rep.responseObject;
					comm.loading.hide();
					if(updateCase&&updateCase.responseStatus){
						//t.removePrevHref();
						//置空localStorage
						TempCache.removeItem("caseStorage");
						TempCache.removeItem("caseStorage2");
						//TempCache.removeItem("tagStorage");
						TempCache.removeItem("imgStorage");
						TempCache.removeItem("caseAttStorage");
						TempCache.removeItem("activity");              //清楚活动的缓存
						if(updateCase.responseData.case_baseinfo&&updateCase.responseData.case_baseinfo.webStoragePath){
							t.webStoragePath = updateCase.responseData.case_baseinfo.webStoragePath.replace("https:","");
						}
						var da={caseId:t.caseId};
						var param={};
						param.paramJson= $.toJSON(da);
						if(update==2){//2:保存草稿箱成功
							$("#save_dra").attr("on","true");
							popup("病例草稿箱保存成功!");
              g_sps.jump(null,t.prevCaseHref);   //TODO: 回退
							//goBack(t.prevCaseHref,-2);
							return;
						}
						if(t.edit){//编辑
							popup("保存成功!");
							var date=local_time().replace(new RegExp("-","gm"),"/");
							var newDate=(new Date(date)).getTime();
              g_sps.jump(null,t.webStoragePath+"?"+newDate);
							return;
						}
						popup("发布病例成功!");
						$.ajax({
							url:"/mcall/case/baseinfo/info/",
							data:{paramJson:$.toJSON(da)},
							type:"post",
							dataType:"json",
							success:function(rep){
                g_sps.jump(null,rep.responseObject.responseData.data_list[0].case_baseinfo.webStoragePath.replace("https:",""));
							}
						});
					}else{
						if(update==2) {//2:保存草稿箱失败
							$("#atten").hide();
							$("#save_dra").attr("on","true");
							popup("病例草稿箱保存失败!");
							return;
						}
						popup("发布病例失败!");
					}
			    },
			    error:function(){}
			});

		}
			
	};
	
	user.privExecute({
		operateType:'auth',
		callback:function(){
			upload.init();
		}
	});
	
});
