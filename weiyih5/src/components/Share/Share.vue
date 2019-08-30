<template>
    <section data-alcode-mod="406" class="al-scrollShareBtn" v-show="hasShareData">
        <i data-alcode="e46" class="icon-scrollShare"></i>分享
    </section>
</template>
<script>
    /**
     * @Desc：公共页面右下角分享
     * @Usage: 组件绑定自定义属性:<Share :shareConfig.sync="shareConfig" @click.native="share" v-show="shareOnOff"></Share>
     *  shareConfig是初始化data内的数据，字符串类型，在点击的时候出发函数share，在share里组织好shareConfig的参数，最后用shareConfig = JSON.stringify({
     *  //分享参数，视具体交互需求
     *  })
     * @Notify：
     * @Depend：
     *
     * Created by zhangheng on 17/12/1.
     *
     */
    import user from 'static/js/module.user'
    import axios from "axios"
    import comm from 'static/js/comm'
    export default {
        data(){
          return {
              localShareConfig:"",
			  hasShareData:true,
              ajaxing:false
          }
        },
        mounted(){
          let t = this;
           t.localShareConfig = t.shareConfig ;
        },
        watch:{
            shareConfig(){
                let t = this;
                var shareObj = {};
                // var initShareData = (JSON.parse(t.shareConfig)).initData;
                var initShareData = t.shareConfig.initData;
                shareAll({
                    trendUrl:initShareData.trendUrl?initShareData.trendUrl:'',
					noPJ:initShareData.noPJ?initShareData.noPJ:0,
                    url:initShareData.url?initShareData.url:location.href,
                    title:initShareData.title?initShareData.title:document.title,
                    pic:initShareData.pic?initShareData.pic:'',
                    data:initShareData.data?initShareData.data:{},
					noSelfInit:initShareData.noSelfInit?initShareData.noSelfInit:false,
					noWXShare:initShareData.noWXShare?initShareData.noWXShare:false,
					triggerEventFn:initShareData.triggerEventFn?initShareData.triggerEventFn:'',
					noTriggerRequestData:initShareData.noTriggerRequestData||false,
					fnMessageSuc: function () {
                       comm.shareLog({
                           shareType: "",
                           resourceId: "",
                           resourceType: "",
                           refId: "",
                           isValid: 1,
                           shareSence:"",
                           shareChannel: 4,
                           shareContent: shareObj.wxTitle
                       });
                   },
                   fnTimelineSuc: function () {
                       comm.shareLog({
                           shareType: "",
                           resourceId: "",
                           resourceType: "",
                           refId: "",
                           isValid: 1,
                           shareSence: "",
                           shareChannel: 5,
                           shareContent: shareObj.timeLineTitle
                       });
                   },
                   qShareLog: function (x) {
                       if (x === 'qzone') {
                           comm.shareLog({
                               shareType: "",
                               resourceId: "",
                               resourceType: "",
                               refId: "",
                               isValid: 1,
                               shareSence: "",
                               shareChannel: 1,
                               shareContent: shareObj.summary
                           });
                       } else if (x === 'sina') {
                           comm.shareLog({
                               shareType: "",
                               resourceId: "",
                               resourceType: "",
                               refId: "",
                               isValid: 1,
                               shareSence: "",
                               shareChannel: 3,
                               shareContent: shareObj.sinaTitle
                           });
                       }
                   },
                   triggerRequest:function(){
						// if(initShareData.noTriggerRequestData){
                    		// shareObj = initShareData.triggerRequestData;
                        // }else{

                            // if($.isEmptyObject(t.shareTitles)) {
                                if(!t.ajaxing){
                                	t.ajaxing = true;
								    $.ajax({
									url: "/mcall/comm/data/share/getMapList3/",
									data: {
										paramJson: JSON.stringify(t.shareConfig.shareData)
									},
									type: 'POST',
									async: false,
									dataType: "json",
									success: function (data) {
										t.ajaxing = false;
										if (comm.hasResponseData(data)) {
											t.hasShareData = true;
											var sList = data.responseObject.responseData.data_list[0].share_channel;
											shareObj = {
												title: '',
												summary: '',
												sinaTitle: '',
												wxTitle: '',
												wxDesc: '',
											};
											shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
											$(sList).each(function (index, element) {
												if (element.shareChannel === 'QZone') {
													shareObj.title = element.shareTitle;
													shareObj.summary = element.shareDesc;
												}
												if (element.shareChannel === 'Sina') {
													shareObj.sinaTitle = element.shareDesc;
												}
												if (element.shareChannel === 'WechatFriend') {
													shareObj.wxTitle = element.shareTitle;
													shareObj.wxDesc = element.shareDesc;
												}
												if (element.shareChannel === 'WechatTimeline') {
													shareObj.timeLineTitle = element.shareTitle;
												}

											});
											t.shareTitles = shareObj;
										}else{
											t.hasShareData = false;
										}
									}
								});
								}
							// }else{
                            // 	shareObj = t.shareTitles;
                            // }
                        // }
                       return shareObj;
                   }
               }, false, $('.al-scrollShareBtn'));
                if(initShareData.triggerClick){
					$('.al-scrollShareBtn').trigger("click");
                }
            }
        },
        props:["shareConfig"]
    }
</script>
<style lang="scss" scoped>

</style>