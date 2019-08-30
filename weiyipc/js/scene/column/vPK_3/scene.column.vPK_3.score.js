/**
 * 功能描述：  视频、例PK专家作品审核评分
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by sunhaibin on 2016/01/14.
 */
var pk_score = function(obj){
	var temData={};
		temData.scoreMapList=[];
		
	var t=this;
	var controller_in={
		config:{
			maplist:PC_CALL+"activity/score/getMapList/",
			saveInter:PC_CALL+'customer/score/save/'
		},
		init:function(){
			var t=this;
			$('#videoMask,#vPK_prof_score').show();

			t.scoreTem(obj);
			t.checkNumber();
			t.scoreClose();
		},
		scoreTem:function(){
			var t=this;
			t.ajaxFn({
				url:t.config.maplist,
				param:obj,
				async:false,
				fn:function(res){					
					if(res&&res.responseObject.treeMaps&&res.responseObject.treeMaps.length>0){
						temData.activityId = res.responseObject.activityId;
						temData.customerId = res.responseObject.customerId;
						temData.refId = res.responseObject.refId;
						temData.refCustomerId = res.responseObject.refCustomerId;
						temData.refType = res.responseObject.refType;
						temData.scoreType = res.responseObject.scoreType;
						temData.updateFlag = 1;   
						var data = res.responseObject.treeMaps,
							scoreValue = "",			
							html_sub="",		//内部评分项
							html_Array="",		//评分大项（一、二、三）
							desc="",			//描述
							comment="";			//评价
						for(var i=0;i<data.length;i++){
							html_sub="";
							var	item = data[i];
							//如果是初次评分updateStatus==0
							if(item.chilidTreeMaps){
								for(var j=0;j<item.chilidTreeMaps.length;j++){
									var noB="";
									desc="";
									if(j==item.chilidTreeMaps.length-1){noB="noB"};		//如果是最后一个子项，没有底边框
									if(item.chilidTreeMaps[j].configRemark!==""){		//是否有说明
										desc='<div class="pingfen_mian_bg">'+
												'<div class="pingfen_mian_bg02"></div>'+
				                        		'<div class="pingfen_mian_text">'+item.chilidTreeMaps[j].configRemark+'</div>'+
				                        		'<div class="clear"></div>'+
				                    		'</div>';
									}
									if(res.responseObject.updateStatus==1&&item.chilidTreeMaps[j].customerScore!==""){
										scoreValue = item.chilidTreeMaps[j].customerScore;
									}									
									html_sub+=
										'<div class=\"pingfen_mian01_z '+noB+'\">'+
											'<div class=\"mian01_z_l\">'+item.chilidTreeMaps[j].configName+'(0-'+item.chilidTreeMaps[j].scoreTotal+')</div>'+										
											'<input class="scoreNumber mian01_z_r02" data={"maxVal":'+item.chilidTreeMaps[j].scoreTotal+',\"scoreId\":'+item.chilidTreeMaps[j].scoreId+'} value="'+scoreValue+'">'+
											'<div class=\"clear\"></div>'+desc+
										'</div>';																	
								}
							}
							if(item.scoreTermType===1){	//评价
								comment='<li>'+
											'<div class="pingfen_mian01 pingfen_mian02">'+
				                        		'<div class="pingfen_mian01_s">'+item.configName+'(不少于'+item.scoreTotal+'字)</div>'+
				                        		'<div class="pingfen_bottom">'+
				                            		'<textarea name="" id="ev_comment_content" scoreId='+item.scoreId+' minLen='+item.scoreTotal+'>'+(res.responseObject.updateStatus==1?item.customerRemark:"")+'</textarea>'+
				                        		'</div>'+
				                    		'</div>'+
				                    	'</li>';
							}
							if(item.scoreTermType===0){//评分
							html_Array+='<li dataIndex="'+i+'">'+
										'<div class=\"pingfen_mian01\">'+
										'<div class=\"pingfen_mian01_s\">'+
										item.configName+(item.chilidTreeMaps.length>1?'(共'+item.scoreTotal+
										'分)':"")+'</div>'+
											(html_sub!==''?("<div class=\"pingfen_listcon\">"+html_sub+"</div>"):'')+
										'</div>'+
									'</li>';
							}
						}
						html_wrap='<div class="pingfen_mian">'+
									'<ul>'+
									html_Array+comment+
									'</ul>'+
									'</div>'+
									'<div class="pingfen_tijiao">'+
										'<a href="javascript:;" id="score_submit" class="gray">提交</a>'+
									'</div>';
						$('.videoT_playBox_inn').html(html_wrap);						
						t.checkNumber();
						t.scoreClose();						
						if(res.responseObject.updateStatus===1){
							var valNumber="",nIndex,dataConfig,dataObj_score={},dataObj_comment={};
							$.each($('.scoreNumber'),function(i,el){
								valNumber = $(el).val();
								dataConfig = $.secureEvalJSON($(el).attr('data'));  			//把data字符串解析成对象		
			       				if(valNumber!=parseInt(valNumber)||valNumber<0||valNumber>parseInt(dataConfig.maxVal)){
			       					$(el).addClass('mian01_z_r01').removeClass('mian01_z_r02 mian01_z_r03 correct');
			       				}else{
			       					$(el).addClass('mian01_z_r02 correct').removeClass('mian01_z_r01 mian01_z_r03');
			       					
			       					dataObj_score = {
			       						score:parseInt(valNumber),
			       						scoreTermType:0,
			       						scoreId:dataConfig.scoreId
			       					}
									temData.scoreMapList.push(dataObj_score);					
			       				}
							});
							dataObj_comment={
								score:0,
								scoreTermType:1,
								scoreId:$('#ev_comment_content').attr('scoreId'),
								scoreRemark:$('#ev_comment_content').val()
							}
							temData.scoreMapList.push(dataObj_comment);			
						}
						t.checkFinished();						
					}
				}				
			})
		},
		ajaxFn:function(opt){
     		comm.LightBox.showloading();
        	var o=opt;
        	$.ajax({
        		url:o.url,
        		type:'post',
        		data:{paramJson:$.toJSON(o.param)},
        		dataType:'json',
        		success:function(data){
      				comm.LightBox.hideloading();
        			if(data){
	      				o.fn(data)
					}
        		},
          		error:function(XMLHttpRequest,textStatus,errorThrown){
          			comm.LightBox.hideloading();
//      			alert(textStatus+" "+errorThrown);
//					alert('加载数据失败！请稍后重试！');
					if(opt.err_fn){
						opt.err_fn();
					}
          		}
        	})
       },
       checkNumber:function(){
       		var t=this,valNumber,nIndex,dataConfig,dataObj_score={},dataObj_comment={},scoreId;       		
       		if($('.scoreNumber').length>0){
       			$('.scoreNumber').on('load blur',function(){
       				$(this).parent().find('.pingfen_mian_bg01').addClass('pingfen_mian_bg02').removeClass('pingfen_mian_bg01');
       				valNumber = $(this).val();
       				dataConfig = $.secureEvalJSON($(this).attr('data'));  			//把data字符串解析成对象		
       				if(valNumber!=parseInt(valNumber)||valNumber<0||valNumber>parseInt(dataConfig.maxVal)){
       					$(this).addClass('mian01_z_r01').removeClass('mian01_z_r02 mian01_z_r03 correct');
       				}else{
       					$(this).addClass('mian01_z_r02 correct').removeClass('mian01_z_r01 mian01_z_r03');
       					dataConfig = $.secureEvalJSON($(this).attr('data'));  			//把data字符串解析成对象		
       					scoreId= dataConfig.scoreId;
						dataObj_score={
							score:parseInt(valNumber),
							scoreTermType:0,
							scoreId:scoreId
						};
						var flag=true;
						if(temData.scoreMapList.length>0){
							for(var i=0,l=temData.scoreMapList.length;i<l;i++){
								flag=true;
								if(temData.scoreMapList[i].scoreId==scoreId){
									temData.scoreMapList[i].score = valNumber;
									flag=true;
									break;
								}else{
									flag=false;								
								}
							}
							if(flag==false){
								temData.scoreMapList.push(dataObj_score);
							}
						}else{
							temData.scoreMapList.push(dataObj_score);
						}						
       				}
       			t.checkFinished();	
       			}).focus(function(){
       				$(this).addClass('mian01_z_r03').removeClass('mian01_z_r02 mian01_z_r01');
					$(this).parent().find('.pingfen_mian_bg02').addClass('pingfen_mian_bg01').removeClass('pingfen_mian_bg02');
       			});
       		}
       		
       		if($('#ev_comment_content').length>0){
       			var scoreId_comment = $('#ev_comment_content').attr('scoreId'),
       				commentVal = $('#ev_comment_content').val();
       			$('#ev_comment_content').on("propertychange input keyup paste",function(){     
       				commentVal = $('#ev_comment_content').val();
					if(commentVal.length>9999){
						commentVal = commentVal.substring(0,9999);
						$(this).val(commentVal);
					}
					dataObj_comment={
						score:0,
						scoreTermType:1,
						scoreId:scoreId_comment,
						scoreRemark:commentVal
					};
					var flag_c = true;
					if(temData.scoreMapList.length>0){
							for(var j=0,n=temData.scoreMapList.length;j<n;j++){
								flag_c=true;
								if(temData.scoreMapList[j].scoreId==scoreId_comment){
									temData.scoreMapList[j].scoreRemark = commentVal;
									flag_c=true;
									break;
								}else{
									flag_c=false;								
								}
							}
							if(flag_c==false){
								temData.scoreMapList.push(dataObj_comment);
							}
						}else{
							temData.scoreMapList.push(dataObj_comment);
						}
       				t.checkFinished();
       			});
       		}
       },
       
       checkFinished:function(){
       		var t=this;
       		var done = true;
       		var commVal = $('#ev_comment_content').length>0?$('#ev_comment_content').val():"";
       		$.each($('.scoreNumber'),function(i,el){
       			if(!$(el).hasClass('correct')){
       				done=false;
       			}
       		});
       		if(commVal==""||comm.getByteLen(commVal)<(parseInt($('#ev_comment_content').attr('minLen'))*2)){	//评论字数限制100字，200字节
       			done=false;
       		}
       		if(done){
       			$('#score_submit').removeClass('gray').off('click').on('click',function(){       				
					$('#vPK_prof_score').hide();
					$('#videoMask').show();
					t.submitPop();	
       			});
       		}else{
       			$('#score_submit').addClass('gray').off('click');
       		}
       },
       getTotalScore:function(){
       		var total=0;
       		for(var i=0,l=temData.scoreMapList.length;i<l;i++){
       			total+=parseInt(temData.scoreMapList[i].score);
       		}
       		return total;
       },
      
       submitPop:function(){		//提交弹层，显示总分
       		var t=this,
       			html="";
       			html='<div class="videoT_playBox font_yahei" id="score_sub_pop">'+					
						'<div class="videoT_Pop" >'+
						'<div class="videoT_Pop_title">'+
							'<div class="videoT_Popword">提示</div>'+
							'<div class="videoT_PcloseBtn">'+
								'<a href="javascript:;">'+
									'<img src="//img00.allinmd.cn/column/videoPK/pk_v3/videopk_Cbtn.png" alt=""></a>'+
							'</div>'+
							'<div class="clear"></div>'+
						'</div>'+
						'<div class="videoT_Pop_con">'+
							'<div class="videoT_Pop_conword">'+
								'<div class="videoTth"><img src="//img00.allinmd.cn/column/videoPK/pk_v3/pingfen_mian_bg01.png" alt="" width="20" height="20"></div>'+
								'<div class="videoTp">当前总分为<span>'+t.getTotalScore()+'</span>分</div>'+
								'<div class="clear"></div>'+
							'</div>'+
							'<div class="videoT_Pop_conRemark">90分以上为优秀，80分以上为良好，70分以上为中，60分以上为差，60分以下为不合格</div>'+
							'<div class="videoT_Pop_con_btns">'+
								'<div class="videoT_PopSub" id="ev_videoT_PopSub">提交</div>'+
								'<div id="modify_score">修改评分</div>'+
								'<div class="clear"></div>'+
							'</div>'+
						'</div>'+
					'</div>';
				$('body').append(html);
				$('#score_sub_pop').css('top',$(window).scrollTop()+100);
				t.scoreSubmitOrCancel();
       },
       scoreSubmitOrCancel:function(){						//提交
       		var t=this;
       		$('#videoPlayer').css('visibility','hidden');
       		$('#ev_videoT_PopSub').click(function(){		//提交成功后，返回作品审核页，并刷新当前页
       			t.ajaxFn({
       				url:t.config.saveInter,
       				param:temData,
       				fn:function(){
//     					$('#score_sub_pop').remove();
                        g_sps.jump(null,window.location.href);
       				},
       				err_fn:function(){
       					alert('上传数据出现错误，请稍后重新提交');
       					$('#vPK_prof_score').show();
						$('#videoPlayer').css('visibility','hidden');
						$('#score_sub_pop').remove();
       				}
       			})			
       		})
			$('#modify_score,.videoT_PcloseBtn').click(function(){
				$('#vPK_prof_score').show();
				$('#videoPlayer').css('visibility','hidden');
				$('#score_sub_pop').remove();
				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"视频PK活动专家评分关闭",
					actionId:43
				});
			})
        },
        scoreClose:function(){		//关闭评分弹层
        	var t=this;
        	var html='<div class="videoT_playBox font_yahei" id="close_conform">'+
        				'<div class="videoT_Pop"  style="display: block;">'+
							'<div class="videoT_Pop_title">'+
								'<div class="videoT_Popword">提示</div>'+
								'<div class="videoT_PcloseBtn" id="close_conform_clsBtn">'+
									'<a href="javascript:;"><img src="//img00.allinmd.cn/column/videoPK/pk_v3/videopk_Cbtn.png" alt=""></a>'+
								'</div>'+
								'<div class="clear"></div>'+
							'</div>'+
							'<div class="videoT_Pop_con">'+
								'<div class="videoT_Pop_conword videoT_PopSend ">'+
									'<div class="videoTth  endWord"><img src="//img00.allinmd.cn/column/videoPK/pk_v3/pingfen_mian_bg01.png" alt="" width="20" height="20"></div>'+
									'<div class="videoTp">确定终止评分吗？</div>'+
									'<div class="clear"></div>'+
								'</div>'+
								'<div class="videoT_Pop_con_btns">'+
									'<div class="videoT_PopSub newp" id="ev_continue_score">继续评分</div>'+
									'<div class="videoT_PopSub newp bgG nom" id="ev_stop_score">终止</div>'+
									'<div class="clear"></div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';
			
			
        	$('.videoTpk_btn a,.case_pk_btn a').off('click').on('click',function(){        		
        		var flag=false;        		
        		if($('.scoreNumber').length>0){        			
        			for(var i=0;i<$('.scoreNumber').length;i++){
						if($('.scoreNumber')[i].value!==""){
							flag=true;
							break;
						}			
					}
        		}
        		if($('#ev_comment_content').length>0&&$('#ev_comment_content').val()!==""){
        			flag = true;
        		}
        		$('#vPK_prof_score').hide();
        		if(flag){//如果评分里有数据则弹层提示，确定后清空cookie
        			if($('body').find('#close_conform').length>0){return false;}else{
        				$('body').append(html);
        				$('#close_conform').css('top',$(window).scrollTop()+100);
        				$('#videoPlayer').css('visibility','hidden');
	        			t.closeOrContinueScore();
        			}
        		}else{
        			$('#videoPlayer').hide().removeClass('ev_scoring');
        			$('#videoMask').hide();
        			$('#score_sub_pop').remove();
        			$('.videoT_playBox_inn').empty();
        			
        		}			
        	});
        },
        closeOrContinueScore:function(){				//关闭评分弹层 事件
        	var t=this;
        	$('#ev_continue_score,#close_conform_clsBtn').off('click').on('click',function(){
        		$('#close_conform').remove();
        		$('#vPK_prof_score').show();
        		$("#videoPlayer .vPlay").removeClass('cur');
				$('#videoPlayer').css('visibility','hidden');
				//事件埋点
				comm.creatEvent({
					triggerType:"全站功能按钮点击",
					keyword:"视频PK活动专家评分关闭",
					actionId:43
				});
        	});
        	$('#ev_stop_score').off('click').on('click',function(){			//终止评分：清空确认层，提交层
        		
        		$('#close_conform').remove();
        		$('#score_sub_pop').remove();
        		$('.videoT_playBox_inn').empty();
        		$('#videoPlayer').css('visibility','visible').hide();
        		$("#videoPlayer .vPlay").addClass('cur');
        		$('#videoMask').hide();
			});
        }
	};
	controller_in.init();
	
};
