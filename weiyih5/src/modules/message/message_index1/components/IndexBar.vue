<template>
    <section>
        <section class="al-personalBrowsedPart" data-alcode-mod="445">
            <router-link tag="section" to="/messageFollow" class="al-personalBrowsedItem">
                <a href="javascript:;" class="icon-msgRemind">关注提醒<i
                        class="Ev-mesTipNoReadNum al-newsNum" v-if="messageNumList.focusRemindNoReadCount&&messageNumList.focusRemindNoReadCount>0" v-text="(messageNumList.focusRemindNoReadCount<100)?messageNumList.focusRemindNoReadCount:'...'"></i></a>
            </router-link>
            <router-link tag="section" to="/messageReview" class="al-personalBrowsedItem">
                <a href="javascript:;" class="icon-msgComment">评论我的<i
                        class="Ev-mesTipNoReadNum al-newsNum"  v-if="messageNumList.reviewNoReadCount&&messageNumList.reviewNoReadCount>0"  v-text="(messageNumList.reviewNoReadCount<100)?messageNumList.reviewNoReadCount:'...'"></i></a>
            </router-link>
            <!--<section class="al-personalBrowsedItem">-->
                <!--<a href="/pages/message/message_review.html" class="icon-msgComment">评论我的<i-->
                        <!--class="Ev-mesTipNoReadNum al-newsNum"  v-if="messageNumList.reviewNoReadCount&&messageNumList.reviewNoReadCount>0"  v-text="(messageNumList.reviewNoReadCount<100)?messageNumList.reviewNoReadCount:'...'"></i></a>-->
            <!--</section>-->
            <router-link tag="section" class="al-personalBrowsedItem" to="/messageRemind">
                <a href="javascript:;" class="icon-msgFollow">提醒我看<i
                        class="Ev-mesTipNoReadNum al-newsNum"  v-if="messageNumList.remindNoReadCoun&&messageNumList.remindNoReadCoun>0"  v-text="(messageNumList.remindNoReadCoun<100)?messageNumList.remindNoReadCoun:'...'"></i></a>
            </router-link>
            <router-link tag="section" class="al-personalBrowsedItem" to="/messagePraise">
                <a href="javascript:;" class="icon-msgLike">赞了我的<i
                        class="Ev-mesTipNoReadNum al-newsNum"  v-if="messageNumList.preferNoReadCount&&messageNumList.preferNoReadCount>0"  v-text="(messageNumList.preferNoReadCount<100)?messageNumList.preferNoReadCount:'...'"></i></a>
            </router-link>
        </section>
        <!-- 消息通知 -->
        <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']" @infinite-scroll="infiniteScroll" :distance="100">
            <section class="al-msgRemindPart Ev-mesSystemAppList" data-alcode-mod="446" scrollpagination="enabled">
                <section class="al-msgRemindItem Ev-mesSysListBox" data-isre="53" data-resurl="" data-mesid="295993," rel="loaded" v-for="(item,index) in messageList"  @click="skip(item.id,item.isRead,item.opType,index,item.webStoragePath,item.refUrlWebStoragePath,item.refName,item.refReviewId,item.customer_review,item.refId,item.resourceType)">
                    <figure class="al-msgRemindIcon">
                        <i class="icon-mailbox"></i>
                        <i class="icon-newTips" v-if="item.isRead!=1"></i>
                    </figure>
                    <article class="al-msgRemindContent">
                        <h2 class="al-msgRemindTitle">{{item.messageName|filterHtml}}
                            <span class="al-msgRemindTime">{{item|messageSrcTime}}</span>
                        </h2>
                        <p class="al-msgRemindContentTextHide Ev-mesCheckDetailBtn" v-if="item.readDetail" @click="teamStateUpdate(item.refId,item.messageBody,item.opType)" id="Ev-mesCheckDetailBtn" v-html="messageDetail(item.messageBody,item.opType)"></p>
                        <p class="al-msgRemindContentText"  v-if="!item.readDetail" @click="teamStateUpdate(item.refId,item.messageBody,item.opType)">
                            <a :href="item.webStoragePath?item.webStoragePath:'javascript:;'">{{item.messageBody,item.opType,item.webStoragePath|judge}}</a>
                        </p>
                    </article>
                </section>
            </section>
        </vue-data-loading>
        <MonoLayer :confirmOption="propOption" @ensureClickEvent="ensureClick" @cancelClickEvent="cancelClick"></MonoLayer>
        <loading v-show="loading"></loading>
    </section>
</template>

<script type="text/ecmascript-6">
    import comm from 'static/js/comm';
    import commdate from 'static/js/comm.date';
    import axios from "axios";
    import TempCache from 'static/js/tempcache';
    import VueDataLoading from 'components/scroll/vue-data-loading.vue';
    import loading from "components/Loading/Loading.vue";
    import MonoLayer from 'components/MonoLayer/MonoLayer.vue';
    import Vue from 'vue';
    const xhrUrl = {
        messageNum:"/mcall/customer/message/getSpecialCount/",
        messageList:'/mcall/customer/message/json_grouplist3/',
        getMapListByTeamId:"/mcall/caseFolder/team_member/getMapListByTeamId/",//病历夹 获取团队下面的成员
        updateTeamState:"/mcall/caseFolder/team_member/updateState/"//病历夹 接受团队邀请
    };
    export default  {
        data(){
            return {
                userId:TempCache.getItem("userId")!="null"?TempCache.getItem("userId"):0,
                messageNumList:{},
                messageList:[],
                pageIndex:1,
                pageSize:10,
                completed: false,
                loading:false,
                propOption:{},//显示弹窗标题
                memberId:0 //团队主键ID
            }
        },
        components:{
            VueDataLoading,loading,MonoLayer
        },
        methods:{
            'messageDetail'(messageBody,opType){
                if(opType==69){//团队邀请type
                    return messageBody;
                }else{
                    return '查看详情<i class="icon-messageMore"></i>';
                }
            },
            'changeReadDetail'(index,teamId,messageBody){
                this.teamStateUpdate(teamId,messageBody);
            },
            "infiniteScroll"(){
                let t = this;
                t.loading = true;
                t.pageIndex++;
                setTimeout(() => {
                    t.getMessageList();//获取当前的消息列表
                }, 1000)
            },
            assembleList(list,pageIndex){
                let t = this;
                if(pageIndex===1){
                    t.messageList = list;
                }else{
                    t.messageList = t.messageList.concat(list);
                }
            },
            skip(id,isRead,opType,i,webStoragePath,refUrlWebStoragePath,refName,refReviewId,customer_review,refId,resourceType){
                let t=this;
                let dataReUrl = '';
                if(opType==60){//运营消息
                    if(!$.isEmptyObject(webStoragePath)&& $.trim(webStoragePath)){
                        dataReUrl = webStoragePath;
                    }
                }else if(opType==66){//引用消息
                    let refUrl=!$.isEmptyObject(refUrlWebStoragePath)?refUrlWebStoragePath:"";
                    let refReview = refReviewId&&!$.isEmptyObject(refReviewId)?refReviewId:"";
                    if(customer_review&&!$.isEmptyObject(customer_review)&&customer_review.parentId!=0){//跳转到讨论页面
                        dataReUrl='/dist/personal/details_discuss.html?refId='+refId+'&refType='+resourceType+'&reviewId='+refReview+'&refName='+refName+'&refUrl='+refUrl;
                    }else{//父层是资源，跳转到正文页面
                        dataReUrl='/dist/personal/details_content.html?refId='+refId+'&refType='+resourceType+'&reviewId='+refReview+'&refName='+refName+'&refUrl='+refUrl;
                    }
                }else if(opType==72){
                    if((!localStorage.getItem('auth'))||(localStorage.getItem('auth')&&JSON.parse(localStorage.getItem('auth')).state==-1)){
                        dataReUrl='//m.allinmd.cn/pages/passport/auth/auth.html'
                    }else {
                        dataReUrl="javascript:;";
                    }
                } else{
                    dataReUrl="javascript:;";
                }
                g_sps.jump(null,dataReUrl);
                let messageId = (id.toString().lastIndexOf(",")>-1)?id:id+",";
                //if(opType ==60||opType ==66||opType ==69){//66引用消息，60运营推送消息
                    if(isRead!=1){
                        axios({
                            url: "/mcall/customer/message/update3/",//删除操作和未读变成已读   该请求还要用于changeReadDetail
                            method: "POST",
                            data: {
                                opTypeRules: 2,
                                messageIdList:messageId,
                                isRead:1
                            },
                            transformRequest: [function(data) {
                                return "paramJson=" + JSON.stringify(data);
                            }],
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            timeout: 30000
                        }).then(function(res){
                            if(res.data&&res.data.responseObject&&res.data.responseObject.responseStatus){
                                //t.messageList = t.messageList[i].isRead == 1;
                                t.messageList[i].isRead = 1;
                                t.messageList[i].readDetail = false;
                            }
                        });
                    }

                //}
            },
            getMessageList(){
              let t = this;
              let param = {
                  "dataFlag":2,
                  "pageIndex":t.pageIndex,
                  "pageSize":t.pageSize,
                  "logoUseFlag":3,
                  "sortType":2
              };
              t.loading = true;
              axios({
                  url: xhrUrl.messageList,
                  method: "POST",
                  data: param,
                  transformRequest: [function(data) {
                      return "paramJson=" + JSON.stringify(data);
                  }],
                  headers: {
                      'X-Requested-With': 'XMLHttpRequest'
                  },
                  timeout: 30000
              }).then(function(res){
                  t.loading = false;
                  if(comm.hasResponseData(res.data)){
                      let arrList = res.data.responseObject.responseData.data_list;

                      for(let num = 0;num<arrList.length;num++){
                          let item = arrList[num];
                          if(item.isRead!=1){
                              if(item.opType==60 || item.opType==66){
                                  item.readDetail = false;
                              }else{
                                  item.readDetail = true;
                              }
                          }else{
                              item.readDetail = false;
                          }
                      }
                      t.assembleList(arrList,t.pageIndex);
                  }
                  t.completed = (t.messageList.length===res.data.responseObject.responseData.total_count);
              });
            },
            //病历夹 团队邀请消息确认修改状态
            teamStateUpdate(teamId,messageBody,opType){
                let t =this;
                if(opType==69){//病历夹邀请信息类型
                    comm.ajax2({
                        type:"post",
                        url:xhrUrl.getMapListByTeamId,
                        data:{paramJson: JSON.stringify({teamId: teamId, customerId: t.userId, isValid: 1})},
                        success:function(data){
                            if (data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length>=1) {
                                let dataList = data.responseObject.responseData.data_list[0];
                                if(dataList.teamState==2){
                                    t.propOption = JSON.stringify({title:messageBody.substring(0,messageBody.length-5),ensureTitle:'加入'});
                                    t.memberId = dataList.memberId;
                                }
                            }
                        }
                    })
                }
            },
            //确认按钮
            ensureClick(){
                let t =this;
                comm.ajax2({
                    type:"post",
                    url:xhrUrl.updateTeamState,
                    data:{paramJson: JSON.stringify({memberIdList:t.memberId,stateType:2})},
                    success:function(data){
                        t.propOption = "0";
                    }
                })
            },
            //取消
            cancelClick(){
                this.propOption="0";
            }
        },
        filters:{
            filterHtml(v){
              return v.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
            },
            messageSrcTime(e){
                return e.messageSrcTime&&!$.isEmptyObject(e.messageSrcTime)?commdate.diffDay_one(e.messageSrcTime.substr(0,19),commdate.local_time()):"";
            },
            judge(messageBody,opType,e){
                let messageBodyText = messageBody;
                if(opType==60){
                    if(!$.isEmptyObject(e)&& $.trim(e)){
                        return messageBodyText;
                    }
                }else if(opType==66){
                    return messageBodyText;
                }else{
                    return messageBodyText;
                }
            }
        },
        watch:{
            "$store.state.acceptData"(){
                this.messageNumList = this.$store.state.acceptData;
            },
        },
        mounted(){
            this.getMessageList();//获取当前的消息列表
        }
    }
</script>