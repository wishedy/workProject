$(function(){
	var selectTag={};
	selectTag={
		init:function(){
			this.getTag();
			this.bindReturnBtn();
			TempCache.setItem("prevCaseHref", document.referrer);//记录上传病例的来源页，以后用作返回依据
		},
		//取消
		bindReturnBtn: function () {
            var t = this;

			$(".quxiao").on("vclick",function(){
				img=caseAtt=caseName=age=mainNarrate=illnessHistory=professionalChecking=discussion=pastHistory=personalHistory=familyHistory=auxiliaryInfo=diagnosisInfo=treatmentRecord=operationName=intraoperativeInfo=productInfo="";
				if(localStorage.getItem('caseStorage')){
					var caseCon=JSON.parse(localStorage.getItem('caseStorage'));
					caseName=caseCon.caseName;
					sexId=caseCon.sexId;
					age=caseCon.age;
					mainNarrate=caseCon.mainNarrate;
					illnessHistory=caseCon.illnessHistory.split("_")[0];
					professionalChecking=caseCon.professionalChecking.split("_")[0];
					discussion=caseCon.discussion.split("_")[0];
					pastHistory=caseCon.pastHistory.split("_")[0];
					personalHistory=caseCon.personalHistory.split("_")[0];
					familyHistory=caseCon.familyHistory.split("_")[0];
					
					auxiliaryInfo=caseCon.auxiliaryInfo.split("_")[0];
					diagnosisInfo=caseCon.diagnosisInfo.split("_")[0];
					treatmentRecord=caseCon.treatmentRecord.split("_")[0];
					operationName=caseCon.operationName.split("_")[0];
					intraoperativeInfo=caseCon.intraoperativeInfo.split("_")[0];
					productInfo=caseCon.productInfo.split("_")[0];
				}
				if(localStorage.getItem("imgStorage")){
					img=true;
				}
				if(localStorage.getItem("caseAttStorage")){
					caseAtt=true;
				}
				if(img||caseAtt||caseName||age||mainNarrate||illnessHistory||professionalChecking||discussion||pastHistory||personalHistory||familyHistory||auxiliaryInfo||diagnosisInfo||treatmentRecord||operationName||intraoperativeInfo||productInfo){
					$("#cancel_mask").show();
				}else{
					goback();
					return false;
				}
				
			});
			$(".jix_l").on("vclick", function () {
				goback();
				return false;
            });
			$("#continue_pub").on("vclick",function(){
				setTimeout(function(){
					$("#cancel_mask").hide();
				},400);
			});
			function goback(){
				t.prevCaseHref=TempCache.getItem("prevCaseHref");
				if(t.prevCaseHref.indexOf("/personal/app/")>0){
					t.prevCaseHref="/allin/personal/app/#/cases?cid="+localStorage.getItem('userId');//localStorage.getItem('fromPage');
				}else
				if(t.prevCaseHref.indexOf("pages/upload-select.html")>0){
					t.prevCaseHref=localStorage.getItem('prevHref');
				}
				//置空localStorage
				TempCache.removeItem("prevCaseHref");
				TempCache.removeItem("caseStorage");
				TempCache.removeItem("caseStorage2");
				TempCache.removeItem("tagStorage");
				TempCache.removeItem("imgStorage");
				TempCache.removeItem("caseAttStorage");

				//window.location.href=t.prevCaseHref;   TODO: 回退
				goBack(t.prevCaseHref);
				
			}
        },
		//数据初始化
		getTag:function(){
			var t=this;
			var html="";
			var data={};
			data.treeLevel=2;
			data.pageIndex=1;
			data.pageSize=100;
			//var param={};
			//param.paramJson= $.toJSON(data);
			comm.loading.show();
			$.ajax({
				url:"/mcall/comm/data/tag/json_list/",
				data : data,
				type:"get",
				dataType:"json",
				timeout:10000,
				success : function(rep){
					comm.loading.hide();
					if(rep&&rep.responseObject.responseStatus){
						$.each(rep.responseObject.responseData.data_list,function(i,val){
							html+='<li tagid="'+val.id+'"><div class="text" >'+val.tagName+'</div></li>';
						});
						
					}
					$("#expertList").html(html);
					$("#expertList li").height( $("#expertList li:eq(0)").width());
					t.tagOnclick();
					t.getLocalStorage();
					t.setLocalStorage();
				}
			});
			
			
		},
	    tagOnclick:function(){
	    	$("#expertList li").attr("select","no");
	    	$("#expertList li").on("vclick",function(){
	    		var $this=$(this);
    			if($this.attr("select")=="no"){
    				setTimeout(function(){
	    				$this.attr("select","yes");
	    				$this.addClass("active");
    				},300);
	    		}else{
	    			setTimeout(function(){
		    			$this.attr("select","no");
		    			$this.removeClass("active");
	    			},300);
	    		}
	    	});
	    },
	    //下一步and设置LocalStorage
	    setLocalStorage:function(){
			var tag={};
			tag.tagContent=[];
			$("#success").on("vclick",function(){
				
				$("#expertList li").each(function(i,em){
					if($(em).attr("select")=="yes"){
						var tagId=$(em).attr("tagid");
						var tagName=$(em).find("div").text();
						tag.tagContent.push([tagId,tagName]);
					}
				});
				localStorage.setItem("tagStorage", JSON.stringify(tag));
				//跳转到上传页
				if(tag.tagContent.length>0){
          g_sps.jump(null,pageurl.urlList.toCaseUpload.url);
				}else{
					popup("请选择专业!");
				}
				
			});
			
		},
		//获取localStorage
		getLocalStorage:function(){
			var t=this;
			if(localStorage.getItem("tagStorage")){
				var tag=JSON.parse(localStorage.getItem("tagStorage"));
				tagContent=tag.tagContent;
				$.each(tagContent,function(i,n){
					$.each($("#expertList li"),function(j,em){
						if(tagContent[i][0]==$(em).attr("tagid")){
							$(em).attr("select","yes");
							$(em).addClass("active");
						}
					})
				})
			}
		}
	
	};
	
	selectTag.init();
})
