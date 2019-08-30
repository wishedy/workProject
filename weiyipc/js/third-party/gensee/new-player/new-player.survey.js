
/*
 * ====================================================
 * 问卷
 */
var Channel = Channel||GS.createChannel();

(function(window){
	
	//准备
	Channel.bind("onVote", loadSurvey);
	Channel.bind("onVoteResult", loadSurveyResult);
	
	//
	function loadSurvey(evt){
		if((typeof skipVoteAndSurvey != "undefined") && "true" == skipVoteAndSurvey)return;
		
		var survey = evt.data;
		popupSurvey(survey);
		$("#bar-survey-btn").show();
		$("#bar-survey-btn").bind("click",function(){
			$(".survey").show();
		});
	}
	function loadSurveyResult(evt){
		if((typeof skipVoteAndSurvey != "undefined") && "true" == skipVoteAndSurvey)return;
		
		var survey = evt.data;
		popupSurveyResult(survey);
		$("#bar-survey-btn").show();
		$("#bar-survey-btn").bind("click",function(){
			$(".survey").show();
		});
	}
	
	window.closeSurvey = function(eleId){//全局
		$(eleId).hide();
		$(Channel).trigger("survey-close");//点播时，触发点播继续
	};
	
	//
	function popupSurvey(survey){
		if($("#gs-survey-"+survey.id).length>0){
			$("#gs-survey-"+survey.id).show();
			return;
		}
		var sSurvey = '<div id="gs-survey-'
			+survey.id
			+'" class="vote-container survey drag-level-2">'
			+'<div class="comm-title">'
			+'<span>'+i18n("survey.title.survey")+'</span>'
			+'<div class="s-btn">'
			+'<a class="close-icon tran" href="###"  onClick="closeSurvey(\'#gs-survey-'+survey.id+'\');"></a>'
			+'</div>'
			+'</div>'
			+'<div class="vote-body">'
			+'<div class="vote-main">'
			+'<h3>'
			+survey.subject
			+'</h3>';
		$.each(survey.questions, function(i,data){
			var question = this;
			var sItem = '<dl class="vote-item" id="gs-survey-question-'+question.id+'">';
			if(question.type=="single"||question.type=="multi"){
				sItem += '<dt><span class="histogram-icon"></span>'+Util.escapeHTML(this.subject)+'</dt>';
				$.each(question.items, function(i,data){
					var item = this;
					var sOption = '<dd><label class="'+(question.type=="single"?"radio":"checkbox")+'">'
						+'<input option-id="gs-survey-option-'+item.id+'" type="'+(question.type=="single"?"radio":"checkbox")+'" name="gs-survey-question-'+question.id+'">'
						+Util.escapeHTML(item.option)
						+'</label>'
						+(item.correct=="true"?'<span class="right-ans"></span>':'')
						+'</dd>';
					sItem += sOption;
				});
			}else if(question.type=="text"){
				sItem += '<dt><span class="answer-icon"></span>'+Util.escapeHTML(this.subject)+'</dt>';
				var sOption = '<dd><textarea class="vote-textarea"></textarea></dd>';
				sItem += sOption;
			}
			sItem +='</dl>';
			sSurvey+=sItem;
		});
		sSurvey += '<div class="vote-submit">'	
			+'<a href="###" class="green-btn"><span class="right-icon tran"></span><span id="vote-submit-value">'+i18n("core.button.submit")+'</span></a>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'</div>';
		
		var $survey = $(sSurvey);
		var $closeBtn = $survey.find(".close-icon");
		$closeBtn.bind("click", function(){$("gs-survey"+survey.id).hide();});
		if(survey.skip == "false")$closeBtn.hide();
		
		$submit = $survey.find(".vote-submit a");
		$submit.bind("click", function(evt){submitSurvey(evt, survey);});
		$("body").append($survey);
		
		$survey.draggable({
			containment: ".web",
			stack: ".drag-level-2",
			handle: ".comm-title",
			cursor: "move"
		});
	}
	
	function submitSurvey(evt, survey){
		if(survey.skip=="false"){
			if(!allAnswered(survey)){
				alert(i18n("survey.check.allquestionneed"));
				return false;
			}
		}else{
			if(!oneAnswered(survey)){
				alert(i18n("survey.check.onequestionneed"));
				return false;
			}
		}
		
		for(var i in survey.questions){
			var question = survey.questions[i];
			var $qEle = $("#gs-survey-question-"+question.id);
			
			$qEle.find(":radio").each(function(){
				if($(this)[0].checked){
					setSelectedValue(question, $(this).attr("option-id"));
				}
				$(this).attr("disabled", "disabled");
			});
			
			$qEle.find(":checkbox").each(function(){
				if($(this)[0].checked){
					setSelectedValue(question, $(this).attr("option-id"));
				}
				$(this).attr("disabled", "disabled");
			});
			
			$qEle.find("textarea").each(function(){
				question.text = $(this).val();
				$(this).attr("disabled", "disabled");
			});
			
		}
		
		var $survey = $("#gs-survey-"+survey.id);
		$survey.find(".close-icon").show();
		var $submit = $survey.find(".vote-submit a");
		$submit.unbind("click");
		$submit.attr("disabled", "disabled");
		$submit.find("#vote-submit-value").text(i18n("survey.button.submited"));
		$survey.find(".right-ans").text(i18n("survey.item.correct"));
		Channel.send("submitVote", survey);
	}
	
	function setSelectedValue(question, selectedId){
		for(var i in question.items){
			var item = question.items[i];
			if("gs-survey-option-"+item.id==selectedId){
				item.selected = "true";
			}
		}
	}
	
	function popupSurveyResult(result){
		if($("#gs-survey-result-"+result.id).length>0){
			$("#gs-survey-result-"+result.id).show();
			return;
		}
		var sResult = '<div id="gs-survey-result-'
			+ result.id
			+'" class="vote-result-container survey drag-level-2">'
			+'<div class="comm-title">'
			+'<span>'+i18n("survey.title.result")+'</span>'
			+'<div class="s-btn">'
			+'<a class="close-icon tran" href="###"  onClick="closeSurvey(\'#gs-survey-result-'+result.id+'\');"></a>'
			+'</div>'
			+'</div>'
			+'<div class="vote-body">'
			+'<div class="vote-main">'
			+'<h3>'
			+Util.escapeHTML(result.subject)
			+'</h3>';
		
		$.each(result.questions, function(i,data){
			var question = this;
			var ticketNum = 0;
			$.each(question.items, function(i,data){
				var item = this;
				if(isNaN(item.total))item.total=0;
				ticketNum += Number(item.total);
			});
			var sItem = '<dl class="vote-item">'
				+'<dt><span class="histogram-icon"></span>'+Util.escapeHTML(this.subject)+'</dt>';
				$.each(question.items, function(i,data){
					var item = this;
					var sOption = '<dd class="clearfix">'
						+'<div class="vote-ans">'
						+Util.escapeHTML(item.option)
						+'</div>'
						+'<div class="vote-count">'
						+'<div class="vote-progress-bar">'
						+'<span style="width:'
						+Util.calcPercent(item.total, ticketNum)
						+'%;"></span>'
						+'</div>'
						+'<div class="num">'
						+item.total
						+' <span>('
						+Util.calcPercent(item.total, ticketNum)
						+'%)</span></div>'
						+'</div>'
						+'</dd>';
					sItem += sOption;
				});
			sItem +='</dl>';
			sResult+=sItem;
		});
		sResult += '</div></div></div>';
		
		var $result = $(sResult);
		$("body").append($result);
		$result.draggable({
			containment: ".web",
			stack: ".drag-level-2",
			handle: ".comm-title",
			cursor: "move"
		});
	}

	function allAnswered(survey){
		for(var i in survey.questions){
			var question = survey.questions[i];
			var $qEle = $("#gs-survey-question-"+question.id);
			var answered = true;
			$qEle.find(":radio").each(function(){
				answered = false;
				if($(this)[0].checked){
					answered = true;
					return false;
				}
			});
			if(!answered)return false;
			$qEle.find(":checkbox").each(function(){
				answered = false;
				if($(this)[0].checked){
					answered = true;
					return false;
				}
			});
			if(!answered)return false;
			
			$qEle.find("textarea").each(function(){
				if(Util.isEmpty($(this).val())){
					answered = false;
					return false;
				}
			});
			if(!answered)return false;
			
		}
		return true;
	}

	function oneAnswered(survey){
		for(var i in survey.questions){
			var question = survey.questions[i];
			var $qEle = $("#gs-survey-question-"+question.id);
			var answered = false;
			$qEle.find(":radio").each(function(){
				if($(this)[0].checked){
					answered = true;
					return false;
				}
			});
			if(answered)return true;
			$qEle.find(":checkbox").each(function(){
				if($(this)[0].checked){
					answered = true;
					return false;
				}
			});
			if(answered)return true;
			
			$qEle.find("textarea").each(function(){
				if(Util.isNotEmpty($(this).val())){
					answered = true;
					return false;
				}
			});
			if(answered)return true;
			
		}
		return false;
	}

})(window);