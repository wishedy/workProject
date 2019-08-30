<template>
	<li data-is="true" :class='{ev_liveOrBack:(kv.isOnline==3)||((kv.isOnline==1||kv.isOnline==2)&&(kv.isValid==5||kv.isValid==4))}'>
		<div :class="{listName:true,halfLineHeight:kv.conSubName.length>20,isLiveOrPlayBackMeeting:(kv.isOnline==3)||((kv.isOnline==1||kv.isOnline==2)&&(kv.isValid==5||kv.isValid==4))}"
			 @click.stop="meetingListCli(kv.id,kv.isOnline,kv.playBackId,kv.authcode,kv.id,(kv.isOnline==1||kv.isOnline==2)&&(kv.isValid==5||kv.isValid==4)?kv.startTime:'',kv.conSubRoom,kv.liveId,kv.authority)">
			{{kv.conSubName}}
			<i :class="{playBackMeeting:kv.isOnline==3,liveMeeting:((kv.isOnline==1||kv.isOnline==2)&&(kv.isValid==5||kv.isValid==4)),active:showIng && hasData}"></i>
		</div>
		<div class="scheduleListWrap" v-show="showIng && hasData">
			<aside class="scheduleList">
				<list-li v-for="(value,key) in listData" :obj="{key:key,value:value}" :key="key"></list-li>
			</aside>
		</div>
	</li>
</template>

<script>
	import listLi from './listLi.vue';
	import comm from 'static/js/comm.js';
	export default {
		data(){
			return{
                param:{
                    conId:comm.getpara().conId,
                },
				hasData:false,
				listData:[],
				showIng:false,
				loading:false,
                startTime:'',
				isAl:false,
			}
		},
		props:['kv'],
		components:{
			listLi
		},
		methods:{
		    //JQ判断是否只有一条数据
			hasOnlyOne:function () {
				let t = this;
				if($('.meetingList ul').find('li').length==1&&$('.meetingList ul').find('li').attr('class')!='ev_liveOrBack'){
				    $('.listName').click();
				}
            },
			meetingListCli(id,isOnline,playBack,authcode,conSubId,startTime,conSubRoom,liveId,authority){
				let t = this;
				//判断有无直播，有直播开始去直播页，有直播未开始弹提示层，没有直播加载分会数据
				if(isOnline==3 && playBack!=''){//回播
                    let liveUrl = '/pages/conference/conference_live.html?conSubId=' + conSubId + '&conId=' + t.param.conId + '&userId=0438CD3A0AB20794&roomId=' + conSubRoom + '&back=1&recordId='+playBack+'&liveId='+liveId+'&authority='+authority;
					g_sps.jump(null, liveUrl);
				}else if(startTime){//有直播
					if(t.timeCompare(startTime)){//当前时间大于直播开始时间，去直播页
						//isOnline 判断是否在线直播(0-不直播、1-展视互动-直播、2-厂商-直播、3-展视互动-回播；)'
						let liveUrl = '';
						// console.log(conSubRoom);
						switch (parseInt(isOnline)) {
							case 1:
							case 2:
								// liveUrl = '/pages/conference/live-wrap.html?conSubId=' + conSubId + '&conId=' + t.param.conId + '&liveId=' + liveId + '&token=' + authcode;
                                liveUrl = '/pages/conference/conference_live.html?conSubId=' + conSubId + '&conId=' + t.param.conId + '&userId=0438CD3A0AB20794&roomId=' + conSubRoom + '&back=0&authority='+authority;
								break;
							//case 2:
							//    liveUrl = '/pages/conference/live.html?conSubId=' + conSubId + '&title=' + $this.text();
							//    break;
							case 3:
                                liveUrl = '/pages/conference/conference_live.html?conSubId=' + conSubId + '&conId=' + t.param.conId + '&userId=0438CD3A0AB20794&roomId=' + conSubRoom + '&back=1&recordId='+playBack+'&liveId='+liveId+'&authority='+authority;
								break;
						}
						if (liveUrl) {
							g_sps.jump(null, liveUrl);
						}
					}else{
                        comm.alertBox({
							title: "直播将于" + startTime + "开始",
							ensure: "知道了",
							ensureCallback:function(){
								$('.al-alertModalMask').remove();
							}
						});
					}
				}else{
					if((!comm.isEmptyObject(t.listData))||t.isAl){ //listData不为空对象，有数据了
						t.showIng = !t.showIng;
					}else{
						if(t.loading){
							return false;
						}else {
							t.loading = true;
							comm.ajax2({
								type: "post",
								url: '/mcall/conference/index/getAgendaVideoList/',
								data: {
									paramJson: JSON.stringify({
										pageIndex: 1,
										pageSize: 100,
										conSubId: id,
										conId: comm.getpara().conId
									})
								},
								success: function (req) {
									if (req && req.responseObject && req.responseObject.responseStatus) {
										let dd = t.pretreatmentData(req.responseObject.responseMessage);
										if(comm.isEmptyObject(dd)){//如果数据不存在
											t.hasData = false;
											t.showIng = false;
											t.isAl = true;
										}else{
											t.listData = dd; //object
											t.hasData = true;
											t.showIng = true;
                                            t.isAl = true;
										}
									}
									t.loading = false;
								}
							});
						}
					}
				}
			},
			/*分会数据预处理*/
			pretreatmentData: function (data) {
				let returnData = {};
				let changeTimeStyle = function (time) {
					return time.split(" ")[0];
				};
				for (let i = 0; i < data.length; i++) {
					if (returnData[changeTimeStyle(data[i].startTime)]) {
						returnData[changeTimeStyle(data[i].startTime)].push(data[i]);
					} else {
						returnData[changeTimeStyle(data[i].startTime)] = [];
						returnData[changeTimeStyle(data[i].startTime)].push(data[i]);
					}
				}
				return returnData
			},
			//滚动事件，用的JQ，置顶操作。
			scrollTop:function () {
                let t = this;
                let headH = $('.al-headFilterBox').outerHeight();
                let arr = [];
                let scrollTop = 0;
                $(window).on('scroll touchmove', function () {
                    if ($(window).scrollTop() > 0) {
                        $('.ev_consubName').html(comm.getStrLen($('.meIntroTitle').text(), 20));//JQ控制顶部显示会议名称
                        if($(window).scrollTop()>$('.meetingIntroduction p').height()-$('.meetingIntroduction p').offset().top){
                            if ($('.meetingIntroduction span').attr('data-flag') == 1) {
                                $('.meetingIntroduction span').click();
                            }
                        }
                    } else {
                        $('.ev_consubName').html('');
                    }
                    scrollTop = $(window).scrollTop() + headH;
                    arr = [];
                    for(let j = 0;j<$('.meetingList li:not(.ev_liveOrBack)').length;j++){
                        arr.push($('.meetingList li:not(.ev_liveOrBack)').eq(j).offset().top);
					}
                    $('.ev-fixedArea').html("").removeAttr('liIndex');
                    for(let i = 0;i<arr.length;i++){
                        if (scrollTop > arr[i] && (arr[i + 1] ? scrollTop < arr[i + 1] : true)) {
                            $('.ev-fixedArea').html($('.meetingList li:not(.ev_liveOrBack)').eq(i).find('.listName').clone()).attr('liIndex', i);
                        }
					}
                });
                $('.ev-fixedArea').click(function () {
                    $('.meetingList li:not(.ev_liveOrBack)').eq($(this).attr('liIndex')).find('.listName').click();
                });
            },
            timeCompare: function (x) {//比较与当前时间的关系
                let _stime = Date.UTC(x.substring(0, 4), parseInt(x.substring(5, 7)) - 1, x.substring(8, 10), parseInt(x.substring(11, 13)) - 8, x.substring(14, 16), 0);
                let _now = new Date().getTime();
                if (_now > _stime) { //当前时间大干比较时间
                    return true;
                } else {
                    return false;
                }
            },
		},
        mounted() {
            let t = this;
            t.scrollTop();
            t.hasOnlyOne();
		}
	}
</script>

<style scoped>

</style>