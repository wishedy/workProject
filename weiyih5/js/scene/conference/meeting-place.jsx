$(function () {

	if (typeof comm.getpara() != null && !$.isEmptyObject(comm.getpara())) {
		var conId = comm.getpara().conId;
		var result = null;
		$.ajax({
			url: "/mcall/conference/index/getConferenceSubList/",
			type: "POST",
			dataType: "json",
			data: {paramJson: $.toJSON({pageIndex: 1, pageSize: 200, conId: conId})},
			async: false,
			success: function (data) {
				if (data != null && data != undefined && data.responseObject && data.responseObject.responseStatus) {
					result = data.responseObject;
				}
			}
		});
		var data = result.responseMessage;
		var info = result.responseData;
		// data = commdata.getData("getConferenceSubList",{pageIndex:1,pageSize:200,conId:conId});
		var conName = comm.getpara().conName;
		$(".new_case_title").text(conName.length > 11 ? conName.substring(0, 12) : conName);
		if (data.length == 1) {
			var val = data[0];
			var href = "";

            switch(val.isOnline){
                case 1://直播
                    href = '/pages/conference/live-wrap.html?conSubId='+ val.id +'&conId='+ conId +'&liveId='+ val.liveId + "&token=" + val.authcode + '&title='+val.conSubName+ '-' + conName;
                    break;
                case 2://回播
                    href = '/pages/conference/live.html?conSubId='+ val.id +'&title='+val.conSubName+ '-' + conName;
                    break;
                default://结束
                    href = '/pages/conference/schedule.html?conSubId='+ val.id +'&conId='+ conId +'&conSubName='+val.conSubName;

            }

      g_sps.jump(null,href);
			return;
		}
		var MeetingList = React.createClass({
			componentDidMount:function(){
				var _text;
				if($(window).width()<=640){

					$('.meeting_revise_l').each(function(){
						_text = $(this).text();
						if(_text.length>=17){
							$(this).html(_text.substring(0,16)+"...");
						}
					});
				}else if($(window).width()<=750){
					$('.meeting_revise_l').each(function(){
						_text = $(this).text();
						if(_text.length>=26){
							$(this).html(_text.substring(0,24)+"...");
						}
					});
				}
				$('.meeting_revise_l').css('textAlign','left');
			},
			render: function () {
				var playbackPicStyle= {
					height: "5.5em",
					width: "4.125em",
					background: "url(//img50.allinmd.cn/meeting/playback_icon.png) no-repeat center right",
					backgroundSize: "4.125em 1.625em",
					float: "right"
				};

				var list;
				if (data.length > 0) {
					list = this.props.data.map(function (val) {
                        //console.log("isOnline:"+val.isOnline);
						conSubName=comm.getLength(val.conSubName)>38?comm.cutstr(val.conSubName,38)+'...':val.conSubName;
						if (val.isOnline == 1) {//直播
							var liveBtn="l_jointMOff";
							var href = "/pages/conference/schedule.html?conSubId=" + val.id + "&conId=" + conId + "&conSubName=" + val.conSubName + "";
							if(val.isValid == 5){//直播
								liveBtn="l_jointMOn";
								href = "/pages/conference/live-wrap.html?conSubId=" + val.id + "&conId=" + conId + "&liveId=" + val.liveId + "&token=" + val.authcode + "&title=" + val.conSubName + "-" + conName + "";
							}
							return (
								<li>
									<a href={href} data-ajax="false" con-name={val.conSubName}>
										<div className="m_d_r_content">
											<div className="meeting_revise_l">{conSubName}</div>
											<div className={liveBtn}></div>
										</div>
									</a>
								</li>
							)
						} else if(val.isOnline == 2) {//回播 --应该是指天坛医院那次
							var href = '/pages/conference/live.html?conSubId='+ val.id +'&title='+val.conSubName;
							return (
								<li>
									<a href={href} data-ajax="false" con-name={val.conSubName}>
										<div className="m_d_r_content">
											<div className="meeting_revise_l">{conSubName}</div>
											<div className="l_jointMOff"></div>
										</div>
									</a>
								</li>
							)
						}else if( val.isOnline == 3){ //回播
							var href = '/pages/conference/live-wrap.html?conSubId='+ val.id +'&conId='+ val.conId +'&playBackId='+val.playBackId+'&token='+val.authcode+'&title='+val.conSubName;
							return (
								<li>
									<a href={href} data-ajax="false" con-name={val.conSubName}>
										<div className="m_d_r_content">
											<div className="meeting_revise_l">{conSubName}</div>
											<div style={playbackPicStyle}></div>
										</div>
									</a>
								</li>
							)
						}else{//结束
                            var href = "/pages/conference/schedule.html?conSubId=" + val.id + "&conId=" + conId + "&conSubName=" + val.conSubName + "";
                            return (
                                <li>
                                    <a href={href} data-ajax="false" con-name={val.conSubName}>
                                        <div className="m_d_r_content">
                                            <div className="meeting_revise_l">{conSubName}</div>
                                            <div className="l_jointMOff"></div>
                                        </div>
                                    </a>
                                </li>
                            )
                        }
					})


				} else {
					return (
						list = <li>本次会议暂无相关信息，请检查</li>
					)

				}

				return (
					<ul>
						{list}
					</ul>
				)

			}
		});
		React.render(
			<MeetingList data={data}/>,
			document.getElementById("meeting_list")
		);
	} else {
		alert("无相关数据");
	}

});



