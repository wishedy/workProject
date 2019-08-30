<template>
    <div class="container-invite">
        <!--<div class="inviter-name">
          <p class="inner-inviter-name">
              {{inviterName}}
          </p>
        </div>-->
        <p class="hospital-name">{{hospitalName}}</p>
        <hospital-infoinvite :authNum="authNum" :assistanceNum="assistanceNum" :assistanceList="assistanceList" :newAuthNum="newAuthNum" :unAssistanceList="unAssistanceList" v-if="renderHospital"></hospital-infoinvite>
        <button type="button" class="btn btn-invite" ref="evShare" @click="appShare" v-if="appPort"></button>
        <button type="button" class="btn btn-invite" ref="evShare"  v-if="!appPort"></button>
        <rank-list :customerId="invitateCustomerId" v-if="renderRankList" ></rank-list>
        <rule-list></rule-list>
        <tip-msg ref="tips"></tip-msg>
    </div>
</template>

<script type="text/ecmascript-6">
    import loading from "components/Loading/Loading"
    import hospitalInfoinvite from "./hospitalInfo_invite"
    import rankList from "./rankList"
    import ruleList from "./ruleList"
    import tipMsg from "./tipMsg"
    import qs from 'qs'
    import axios from "axios"
    const  $ =  require('jquery')
    import comm from 'static/js/comm.js'
    import TempCache from "static/js/tempcache.js";
    function parseQuery() {
        let obj ={}
        let search = location.search.slice(1).split('&')
        for (let i = 0; i < search.length; i++) {
            let arr = search[i].split('=')
            let key = arr[0]
            let value = arr[1]
            if (!obj[key]) {
                obj[key] = value
            }
        }
        return obj

    }
    var storeSession = {
        checkInvalid: function (val) {
            if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
                return true;
            } else {
                return false;
            }
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        loginInit: function () {
            var webdomain = '//' + location.host;
            var appId = 'wx8d4a2df6fdc13658';
            var searchParam = '';
            var searchUrlOnOff = storeSession.checkInvalid(location.search);
            var loginOnOff = false;
            if (searchUrlOnOff) {
                loginOnOff = true;
                searchParam = "?redirectNum=1";
            } else {
                var redirectNum = storeSession.getQueryString('redirectNum');
                var loginNumRight = !storeSession.checkInvalid(redirectNum);
                if (loginNumRight && parseInt(redirectNum, 10) === 1) {
                    loginOnOff = false;
                } else {
                    searchParam = location.search + "&redirectNum=1";
                    loginOnOff = true;
                }
            }
            var href = location.origin + location.pathname + searchParam;
            var toUrl = 'http:' + webdomain + '/mcall/wx/allin/interact/viewVideo/?url=' + encodeURIComponent(href);
            if (loginOnOff) {
                var weixinLoginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(toUrl) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                window.location.href = weixinLoginUrl;
            } else {
            }
        }
    };
    export default {
        components: {
            tipMsg,
            hospitalInfoinvite,
            rankList,
            ruleList
        },
        data(){
            return {
                shareObj:{
                    title: '',
                    summary: '',
                    sinaTitle: '',
                    wxTitle: '',
                    wxDesc: '',
                    shareUrl:''
                },
                inviterName:'',
                renderHospital: false,
                renderRankList: false,
                customerId: '0',
                invitateCustomerId: '',
                authNum: 0,
                newAuthNum:0,
                assistanceNum: 0,
                assistanceList: [],
                unAssistanceList: [],
                hospitalName: ''
            }
        },
        created () {

            /*if(storeSession.checkInvalid(TempCache.getItem('userId'))&&storeSession.checkInvalid(_this.customerId)){
                let url = '/dist/caosCheer/caosCheer.html?invitateCustomerId='+_this.invitateCustomerId+'#/share';
               location.href = url;
            }*/
        },
        watch:{
            invitateCustomerId(n){
                if(n){
                    let url = '/mcall/customer/unite/getMapById/';
                    let Data = {
                        paramJson: JSON.stringify({
                            "customerId": n,
                            "logoUseFlag": 4,
                            "isCustomer": 1,
                            "vFlag": 3
                        })
                    };
                    let that = this;
                    axios.post(url, qs.stringify(Data)).then(function (datas) {
                        let dataList = datas.data.responseObject.responseData && datas.data.responseObject.responseData.data_list && datas.data.responseObject.responseData.data_list[0]
                        if (dataList) {
                            let customerAuth = dataList.customer_auth;
                            var str = (customerAuth.lastName + customerAuth.firstName);
                            let strArr = str.split('');
                            console.log(strArr);
                            that.inviterName = strArr[strArr.length-2]+strArr[strArr.length-1];
                        }
                    })
                }

            }
        },
        mounted () {
            let _this = this;
            let query = parseQuery();
            console.log('kaishi')
            if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                //app内
                _this.customerId = query.customerId?query.customerId:(appjs && appjs.getAuthorCustomerId());

            }else{
                _this.customerId = query.customerId?query.customerId:TempCache.getItem("userId");
            }

            _this.invitateCustomerId = query.invitateCustomerId;
            if (this.invitateCustomerId){
                this.renderRankList = true
            }
            console.log('进入');
            console.log(TempCache.getItem('userId'),storeSession.checkInvalid(TempCache.getItem('userId')));
            let joined = window.localStorage.getItem('joined')
            if(joined){
                //this.$refs.tips.showTips('助力成功')
                window.localStorage.removeItem('joined')
            }
            this.getCustomerInfo();
            this.getCustomerList();
            this.getShareInfo();
            setTimeout(()=>{
                if(!_this.appPort){
                    _this.share();
                }
            },2000);
        },
        computed:{
          appPort(){
              let _this = this;
              if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                  return true;
              }else{
                  return  false;
              }
          }
        },
        methods: {
          getShareInfo () {
              let _this = this;
              let cid =  _this.customerId ? _this.customerId : '';
              let json = {
                  sceneType: 103,
                  customerId: cid,
                  invitateCustomerId: _this.invitateCustomerId
              }
              $.ajax({
                  url: "/mcall/comm/data/share/getMapList3/",
                  data: {
                      paramJson: JSON.stringify(json)
                  },
                  type: "POST",
                  async:false,
                  dataType:"JSON",
                  success:function(data){
                      if(comm.hasResponseData(data)){
                          var sList = data.responseObject.responseData.data_list[0].share_channel;
                          _this.shareObj = {
                              title: '',
                              summary: '',
                              sinaTitle: '',
                              wxTitle: '',
                              wxDesc: '',
                          };
                          _this.shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                          _this.shareObj.shareUrl = data.responseObject.responseData.data_list[0].share_comm.shareUrl;
                          $(sList).each(function (index, element) {
                              if (element.shareChannel === 'QZone') {
                                  _this.shareObj.title = element.shareTitle;
                                  _this.shareObj.summary = element.shareDesc;
                              }
                              if (element.shareChannel === 'Sina') {
                                  _this.shareObj.sinaTitle = element.shareDesc;
                              }
                              if (element.shareChannel === 'WechatFriend') {
                                  _this.shareObj.wxTitle = element.shareTitle;
                                  _this.shareObj.wxDesc = element.shareDesc;
                              }
                              if (element.shareChannel === 'WechatTimeline') {
                                  _this.shareObj.timeLineTitle = element.shareTitle;
                              }
                              if (element.shareChannel === 'SMS') {
                                  _this.shareObj.messageContent = element.shareDesc;
                              }

                          });

                      }

                      return _this.shareObj;
                  }
              });
          },
          appShare () {
              let _this = this;
              appjs.share(JSON.stringify({
                      "url":_this.shareObj.shareUrl,
                      "imgUrl":_this.shareObj.pic,
                      "sinaContent":_this.shareObj.sinaTitle,
                      "qqTitle":_this.shareObj.title,
                      "qqContent":_this.shareObj.summary,
                      "messageContent":_this.shareObj.messageContent,
                      "wxTitle": _this.shareObj.wxTitle, //微信朋友圈title,
                      "emailTitle": _this.shareObj.EmailTitle, //qq微信title,
                      "emailContent": _this.shareObj.emailContent //邮箱
                  })
              );
              /*if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) { //app内

              } else {

                  $(".btn-invite").trigger("click");
              }*/

          },
          getCustomerInfo () {
                let url = '/mcall/customer/unite/getMapById/';
                let Data = {
                    paramJson: JSON.stringify({
                        "customerId": this.invitateCustomerId,
                        "logoUseFlag": 4,
                        "isCustomer": 1,
                        "vFlag": 3
                    })
                }
                let that = this;
                axios.post(url, qs.stringify(Data)).then(function (datas) {
                    let dataList = datas.data.responseObject.responseData && datas.data.responseObject.responseData.data_list && datas.data.responseObject.responseData.data_list[0]
                    if (dataList) {
                        let customerAuth = dataList.customer_auth
                        //that.hospitalName = customerAuth.company
                    }
                })
            },
          getCustomerList () {
              let _this = this;
              let that = this;
              let url = '/mcall/customer/invitation/getInvitationCustomerList/';
              let cid = this.customerId ? _this.customerId : "";
              let invitateCustomerId = _this.customerId ? _this.customerId : _this.invitateCustomerId;
              axios({
                  url: url,
                  method: "POST",
                  data: {
                      "customerId": cid,
                      "invitateCustomerId": invitateCustomerId
                  },
                  transformRequest: [function(data) {
                      return "paramJson=" + JSON.stringify(data);
                  }],
                  headers: {
                      'X-Requested-With': 'XMLHttpRequest'
                  },
                  timeout: 30000
              }).then(function(datas){
                  if(datas&& datas.data&&datas.data.responseObject&&datas.data.responseObject.responseData&&datas.data.responseObject.responseData.dataList){
                      let Data = datas.data.responseObject.responseData.dataList;
                      if (Object.prototype.toString.call(Data).slice(8,-1) == 'Array' && Data.length > 0){
                          let data = Data[0];
                          that.assistanceList = data.assistanceList;
                          that.unAssistanceList = data.unAssistanceList;
                          that.authNum = data.authNum;
                          that.assistanceNum = data.assistanceNum;
                          that.newAuthNum = data.newAuthNum;
                          that.hospitalName = data.hospitalName;
                          that.renderHospital = true
                      }
                  }
              });
            },
          share () { //分享
            let t = this;
            let shareObj ={};
            console.log('diaoyong',t.appPort,$(t.$refs.evShare));
              $(t.$refs.evShare).off("click");
            shareAll({
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
                    $.ajax({
                        url: "/mcall/comm/data/share/getMapList3/",
                        data: {
                            paramJson: JSON.stringify(t.createShareData())
                        },
                        type: "post",
                        async:false,
                        dataType:"json",
                        success:function(data){
                            if(comm.hasResponseData(data)){
                                var sList = data.responseObject.responseData.data_list[0].share_channel;
                                shareObj = {
                                    title: '',
                                    summary: '',
                                    sinaTitle: '',
                                    wxTitle: '',
                                    wxDesc: '',
                                };
                                shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                                shareObj.url = data.responseObject.responseData.data_list[0].share_comm.shareUrl;
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

                            }
                        }
                    });
                    return shareObj;
                }
            }, false, $(t.$refs.evShare));
          },
          createShareData(){
            let cid =  this.customerId ? this.customerId : ''
            let json = {
              sceneType: 103,
              customerId: cid,
              invitateCustomerId: this.invitateCustomerId
            }
            return json;
          }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>


