<template>
    <section>
        <!-- 头部信息 -->
        <header class="al-indexHeader">
            <figure class="al-indexHeaderItem">
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>{{config.name=="content"?"正文":"讨论"}}</h1>
            </figure>
            <figure class="al-indexHeaderItem">
                <a class="al-timelineContentItemDelete ev-deleteShow" style="position: static;" v-if="showDelPar" @click="delParClick" v-show="reviewStatus!==3">···
                    <section class="al-detailsDeleteBox ev-delete" style="right:0.1rem;" v-show="showDelete" @click="deleteReview">
                        <i class="icon-detailsDelete"></i>删除
                    </section>
                </a>
            </figure>
        </header>
        <section class="al-timelineContent">
            <header class="al-timelineTitle">
                <h2 class="ev-title" style="width: 7.0rem;">
                    <a :href="para.refUrl">《{{refName}}》</a>
                </h2>
                <a href="javascript:;" class="btn-primary al-timelineFollow ev-follow" v-show="showFollow" @click="followCreate">关注</a>
            </header>
            <section class="al-timelineContentItemBox">
                <i class="al-timeline" :style="{'height':timeLineHeight+'px'}"></i>
                <section class="ev-list">
                    <ReviewList v-for = "(item,key) in upList" v-bind:item ="item" :key="key"></ReviewList>
                </section>
            </section>
            <footer class="al-timelineFooter" v-if="para.state!='delete'" v-for="(item,i) in lastUpList">
                <article class="al-timelineFooterBtn ev-review" @click="goReview({'username':item.username,'refCustomerId':item.refCustomerId,'refType':item.refType,'parentId':item.reviewId,'refCustomerId':item.refCustomerId})">
                    <i class="icon-detailsComment"></i><span>{{item.reviewNum}}</span>
                </article>
                <article class="al-timelineFooterBtn ev-collect" :class="{'al-timelineContentCollected':item.collectState == 1}" @click="collect({refId:item.reviewId})">
                    <i class="icon-detailsCollect"></i><span class="ev-collectNum">{{item.collectNum}}</span>
                </article>
                <article class="al-timelineFooterBtn al-timelineShareBtn ev-reprint" :reprint-refCustomerId="item.customerId" :reprint-refId="item.reviewId">
                    <i class="icon-detailsShare"></i><span>{{item.reprintNum}}</span>
                </article>
                <article class="al-timelineFooterBtn ev-prefer" :class="{'al-timelineContentLiked':item.preferState == 1}" @click="prefer({refId:item.reviewId})">
                    <i class="icon-detailsLike"></i><span class="ev-preferNum">{{item.upNum}}</span>
                </article>
            </footer>
        </section>
        <section class="ev-downStairs al-timelineContent al-replayComment" v-if="downList.length>0">
            <ReviewList v-for = "(item,key) in downList" v-bind:item ="item" :key="key"></ReviewList>
        </section>
        <a class="al-detailsBackToIndex ev-goBack" @click="back">
            <img src="//img50.allinmd.cn/pages/details/backToIndex.png" alt="">
        </a>
        <Loading v-show="ajaxing"></Loading>
        <PopupLayer :popup-config="popupConfig"></PopupLayer>
    </section>
</template>

<script type="text/ecmascript-6">
  import comm from "static/js/comm.js";
  import TempCache from "static/js/tempcache.js";
  import user from "static/js/module.user.js";
  import app from "static/js/comm.app.js";
  import Loading from "components/Loading/Loading";
  import PopupLayer from "components/PopupLayer/PopupLayer";
  import ReviewList from "./ReviewList";

  const path = {
    followResource:'/mcall/customer/follow/resource/info/',
    followCreate:"/mcall/customer/follow/resource/create/",
    reviewList:"/mcall/customer/review/json_list/",
    deleteReview:"/mcall/customer/review/delete/",
    createCollect:"/mcall/customer/collection/create/",
    deleteCollect:"/mcall/customer/collection/delete/",
    createPrefer:"/mcall/customer/prefer/create/",
    deletePrefer:"/mcall/customer/prefer/delete/"
  };
  export default {
    data(){
      return {
        para:comm.getpara(),
        refName:'',
        reviewStatus:-1,
        ajaxing:false,
        showFollow:false,
        showDelPar:false,
        showDelete:false,
        popupConfig:{},
        upList:[],
        lastUpList:[],
        downList:[],
        timeLineHeight:0
      }
    },
    props:['config'],
    methods: {
      returnBack(){
        if (!this.para || !this.para.reviewId || !this.para.refId) {
            g_sps.jump(null,'/');
        }
      },
      //返回
      back(){
        let t=this;
        if(t.config="content"){//正文
          history.back();
        }else{
          history.back();
        }

      },
      //打开app
      appWakeUp(){
        let t=this;
        let amChannel = comm.getpara()._amChannel;
        let callAppOptions = {
          ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=8&sourceId=" + t.para.refId + "&replyId=" + t.para.reviewId + "&resourceType=" + t.para.refType + (amChannel?"&_amChannel="+amChannel:''),
          android: "allin://com.allin.social:75235?data={scene:3,type:8,sourceId:" + t.para.refId + ",replyId:" + t.para.reviewId + ",resourceType:" + t.para.refType + (amChannel?",_amChannel:"+amChannel:'')+ "}",
          ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=8&sourceId=" + t.para.refId + "&replyId=" + t.para.reviewId + "&resourceType=" + t.para.refType + (amChannel?"&_amChannel="+amChannel:''),
          runAtOnce: false
        };
        app.appWakeUp("btn", callAppOptions);//下载app层
      },
      //正文名
      getRefName(){
        let _refName = this.para.refName.replace(/@\+@/g, "%");//标题中有% getpara会报错，%用@+@替换下，再换回来
        let updateTitle = _refName.substring(_refName.indexOf("《") + 1, _refName.lastIndexOf("》"));
        this.refName=updateTitle != '' ? comm.cutstr(updateTitle,24,true) : comm.cutstr(_refName,24,true);
      },
      //是否关注过 是自己资源时
      followStatus(){
        let t=this;
        comm.ajax2({
          url: path.followResource,
          data: {
            paramJson: JSON.stringify({
              refId: t.para.refId,
              followType: t.para.refType,
              customerId: TempCache.getItem("userId")!=null?TempCache.getItem("userId"):""
            })
          },
          type: 'POST',
          success: function (data) {
            if (data && data.responseObject.responseStatus && data.responseObject.responseData.data_list[0].relationShip == 0) {
              let refCustomerId = data.responseObject.responseData.data_list[0].customer_follow_resource.customerId;
              if (refCustomerId == TempCache.getItem('userId')) {
                t.showFollow = false;
              } else {
                t.showFollow = true;
              }

            }
          }
        });
      },
      //关注资源
      followCreate(){
        let t = this;
        comm.ajax2({
          url: path.followCreate,
          data: {paramJson: JSON.stringify({refId: t.para.refId, dataFlag: 2, followType: 7})},
          type: 'POST',
          success: function () {
            t.popupConfig=JSON.stringify({
              'msg':'已成功关注',
              'seen':true,
              'time':3000
            });
              setTimeout(function () {
                  t.popupConfig = JSON.stringify({
                      "msg":"已成功关注",
                      "seen":false,
                      "time":3000      //这里可以设置多少毫秒消失
                  });
              },100);
            t.showFollow = false;
          }
        })
      },
      //显示右上角...
      deleteStatus(){
        if (this.para.state == "delete") {
          this.showDelPar = false;
        }
      },
      //右上角...点击
      delParClick(){
        this.showDelete = !this.showDelete;
      },
      //获取数据
      ajaxAsyncHandle(scene){
        let t=this;
        let params = {};
        if (scene == "up") {
          params = {
            dataFlag: 3,
            useFlag: 1,
            attUseFlag: 3,
            logoUseFlag: 3,
            scene: 2,
            pageIndex: 1,
            pageSize: 100,
            refId: t.para.refId,
            currentReviewId: t.para.reviewId,
          };
        } else {
          params = {
            dataFlag: 3,
            useFlag: 1,
            attUseFlag: 3,
            logoUseFlag: 3,
            sortType: 1,
            scene: 2,
            isCurrentRow: 0,
            pageIndex: 1,
            pageSize: 100,
            refId: t.para.refId,
            parentId: t.para.reviewId
          }
        }
        t.ajaxing=true;
        comm.ajax2({
          url: path.reviewList,
          data: params,
          type: 'POST',
          success: function (res) {
            let options = {
              success(res){
                t.ajaxing=false;
                let item =res.responseObject.responseData.data_list;
                for(let i=0;i<item.length;i++) {
                  let json = {};
                  json.refUrl = item[i].customer_review.refUrlWap;
                  json.refType = item[i].customer_review.reviewType;
                  json.parentId = item[i].customer_review.parentId;
                  json.reviewId = item[i].customer_review.id;
                  json.customerId = item[i].customer_review.customerId;
                  json.refCustomerId = item[i].customer_review.refCustomerId;
                  json.logoUrl = item[i].customer_att.logoUrl;
                  json.username = item[i].customer_auth.lastName + item[i].customer_auth.firstName;
                  if (item[i].customer_review.parentId == 0) {
                    json.parentUsername = "";
                  } else {
                    json.parentUsername = !item[i].parent_customer_auth ? item[i].customer_auth.lastName + item[i].customer_auth.firstName : item[i].parent_customer_auth.lastName + item[i].parent_customer_auth.firstName
                  }
                  json.company = item[i].customer_auth.company;
                  json.publishTime = item[i].customer_review.publishTime;
                  t.reviewStatus = parseInt(item[i].customer_review.reviewStatus,10);
                  json.content = item[i].customer_review.reviewContent.replace(/&lt;br\/&gt;/g, '<br/>').replace(/<(\/*?[b-z].*?)>/g, "&lt;$1&gt;").replace(/&lt;br\/&gt;/g, '<br/>').replace(/@@/g, "@").replace(/href=/g, "style='color:#2899e6;' href=/dist/personal/others_index.html?cid="),
                  json.upUsername = !item[i].parent_customer_auth ? '' : '回复给' + item[i].parent_customer_auth.lastName + item[i].parent_customer_auth.firstName + '：';
                  json.upContent = comm.htmlToString(item[i].parent_review_insite.reviewContent).replace(/&lt;br\/&gt;/g, '<br/>');
                  json.reviewNum = item[i].customer_review.reviewNum;
                  json.collectNum = item[i].customer_collection.isValid ? (item[i].customer_review.collectionNum == 0 ? 1 : item[i].customer_review.collectionNum) : item[i].customer_review.collectionNum;
                  json.upNum = item[i].customer_prefer.isValid ? (item[i].customer_review.upNum == 0 ? 1 : item[i].customer_review.upNum) : item[i].customer_review.upNum;
                  json.reprintNum = item[i].customer_review.reprintNum;
                  json.imgsListArr = item[i].customer_review_insite_attachment;
                  json.quoteType = t.getValue(item[i].customer_quote, 'refQuoteType');
                  json.refQuoteName = comm.cutstr(comm.htmlToString(t.getValue(item[i].customer_quote, 'refQuoteName')), 26, true);
                  json.quoteUrl = t.getValue(item[i].customer_quote, 'web_storage_path');
                  json.videoSrcUrl = t.getValue(item[i].customer_review_insite_attachment_video, 'attUrl');
                  json.videoLogoUrl = t.getValue(item[i].customer_review_insite_attachment_video, 'attLogoUrl');
                  json.playTime = t.getValue(item[i].customer_review_insite_attachment_video, 'playTime');
                  json.preferState = item[i].customer_prefer.isValid;
                  json.reprintState = item[i].customer_reprint.isValid;
                  json.collectState = item[i].customer_collection.isValid;
                  if(t.config.name=="discuss"){
                    json.configName="discuss";
                  }
                  if (scene == "up"){
                    t.upList.push(json);
                  }else{
                    t.downList.push(json);
                  }
                }
                if (scene == "up"){
                  //是否显示...删除
                  t.lastUpList[0] = t.upList[t.upList.length - 1];
                  if (TempCache.getItem("userId") == t.lastUpList[0].customerId){
                    t.showDelPar = true;
                  }
                }
              },
              failed(){
                t.ajaxing=false;
              }
            };
            comm.successRequest(res,options);
          }
        });
      },
      getValue(kv, props){ //有时候不存在，有时候是空数组...
        if (!kv) {
          return ''
        }
        if (kv.length === 0) {
          return ''
        }
        ;
        return kv[0][props];
      },
      //评论删除
      deleteReview(){
        let t = this;
        comm.ajax2({
          url: path.deleteReview,
          data: {
            paramJson: JSON.stringify({id: t.para.reviewId, reviewStatus: 3})
          },
          success: function () {
              g_sps.jump(null,location.href + '&state=delete');
          }
        })
      },
      getHeight(){
        let listCountHeight = $(".ev-list").outerHeight();
        let listLen = $(".ev-list").children().length;
        let lastItemHeight = $($(".ev-list").children()[listLen - 1]).outerHeight();
        this.timeLineHeight = listCountHeight - lastItemHeight;
      },
      share(){
        let refTitle = this.para.refName.replace(/@\+@/g, "%");
        let refUrl = this.para.refUrl;

        let reprintParams = {
          "dataFlag": 2,
          "attUseFlag": 3,
          "refId": $("[reprint-refId]").attr("reprint-refId"), //
          "trendsId": 0,
          "logoUseFlag": 3,
          "refCustomerId": $("[reprint-refCustomerId]").attr("reprint-refCustomerId"),
          "pageIndex": 1,
          "pageSize": 7,
          "reprintType": 8
        };

        shareAll({
          title: refTitle,
          url: refUrl,//不传默认取当前地址
          pic: $(".ev-reprint").attr('data-pic'),//分享图片
          trendUrl: "/mcall/customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
          noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
          data: reprintParams,//分享动态传给后台的参数
          callback: function () {
          },//分享动态后成功后的回调函数
          wxTitle: refTitle,//微信分享标题
          wxDesc: $(".ev-reprint").attr('data-desc'),//微信分享描述
          timeLineTitle: 'timelIne',
          sinaTitle: refTitle,//新浪title
          desc: $(".ev-reprint").attr('data-desc'),//新浪的描述
          qzoneTitle: refTitle,//qq空间title
          summary: $(".ev-reprint").attr('data-desc'),//qq空间的描述
          qShareLog: function (x) {    //分享新浪，空间成功与否都执行
            comm.shareLog({
              shareType: refType,
              resourceId: refId,
              resourceType: refType,
              refId: refId,
              isValid: 1,
              shareSence: '',
              shareChannel: x == 'sina' ? 3 : 1,
              shareContent: refTitle,
              refCustomerId: TempCache.getItem('userId') || 0
            });
          },
          fnMessageSuc: function () {
            comm.shareLog({
              shareType: refType,
              resourceId: refId,
              resourceType: refType,
              refId: refId,
              isValid: 1,
              shareSence: '',
              shareChannel: 4,
              shareContent: refTitle,
              refCustomerId: TempCache.getItem('userId') || 0
            });
          },      //分享好友成功回调
          fnTimelineSuc: function () {
            comm.shareLog({
              shareType: refType,
              resourceId: refId,
              resourceType: refType,
              refId: refId,
              isValid: 1,
              shareSence: '',
              shareChannel: 5,
              shareContent: refTitle,
              refCustomerId: TempCache.getItem('userId') || 0
            });
          }      //分享朋友圈成功回调
        }, false, $(".ev-reprint"), 1);
      },
      goReview(data){
        if(TempCache.getItem('customerRole') === "14" ||
          TempCache.getItem('customerRole') === "15" ||
          TempCache.getItem('customerRole') === "13"){
          comm.toastFactoryAuth(null);
        }else{
          let t=this;
          if (TempCache.getItem('customerRole') == 2 || TempCache.getItem('customerRole') == 3 || TempCache.getItem('customerRole') == 4) {
            t.popupConfig=JSON.stringify({
              'msg':'该用户没有操作权限',
              'seen':true,
              'time':3000
            });
              setTimeout(function () {
                  t.popupConfig = JSON.stringify({
                      "msg":"该用户没有操作权限",
                      "seen":false,
                      "time":3000      //这里可以设置多少毫秒消失
                  });
              },100);
            return false;
          }
          let refId = t.para.refId; //资源id
          TempCache.setItem('commentFromPage', window.location.href);
          let url = '/pages/common/comment.html?resourceId=' + refId + '&username=' + data.username + '&type=' + data.refType + '&parentId=' + data.parentId + '&refCustomerId=' + data.refCustomerId;
            g_sps.jump(null,url);
        }
      },
      //收藏
      collect(data){
        // 厂商未认证去认证
        if(TempCache.getItem("customerRole") === "14"){
          // 审核与二次认证
          if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
            comm.alertBox({
              "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
              "ensure":"知道了",
            });
          }else{
            // 厂商未认证时,直接去APP认证,认证后可以看
            let androidParam = `{}`;
            let iosParam = ``;
            comm.newReleaseBox({
              imgPath:"/images/img50/case/release.png",
              title:"厂商认证需使用唯医骨科App",
              solidBtnTitile:"立即使用",
              authNoneTitle:"暂不使用",
              data:{
                el: ".solidBtn",
                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                android: "allin://com.allin.social:75235?data="+androidParam
              }
            });
          }
        }else {
          let t = this;
          user.privExecute({
            operateType: 'auth',   //'login','auth','conference'
            noNeedBack: true,
            callback: function () {
              let collectUrl = path.createCollect;
              if (t.lastUpList[0].collectState == 0) {//未收藏
                collectUrl = path.createCollect;
              } else {
                collectUrl = path.deleteCollect;
              }
              let collectParams = {
                paramJson: JSON.stringify({
                  customerId: TempCache.getItem("userId"),
                  collectionType: 8,//'类型（1-视频，2-文库，3-会议，4-话题 ,5-笔记  6-人 7-病例）',"+
                  refId: data.refId
                })
              }
              comm.ajax2({
                url: collectUrl,
                data: collectParams,
                success: function (res) {
                  if (res && res.responseObject && res.responseObject.responseStatus) {
                    if (t.lastUpList[0].collectState == 0) {
                      t.lastUpList[0].collectState = 1;
                      t.lastUpList[0].collectNum += 1;
                    } else {
                      t.lastUpList[0].collectState = 0;
                      t.lastUpList[0].collectNum -= 1;
                      if (t.lastUpList[0].collectNum <= -1) {
                        t.lastUpList[0].collectNum = 0;
                      }
                    }
                  }
                }
              })
            }
          });
        }
      },
      //点赞
      prefer(data){
        // 厂商未认证去认证
        if(TempCache.getItem("customerRole") === "14"){
          // 审核与二次认证
          if(user.getRenZhengInfo().state === 0 || user.getRenZhengInfo().state === 1){
            comm.alertBox({
              "title":"认证资料审核将在1-3个工作日内完成，请耐心等待 ",
              "ensure":"知道了",
            });
          }else{
            // 厂商未认证时,直接去APP认证,认证后可以看
            let androidParam = `{}`;
            let iosParam = ``;
            comm.newReleaseBox({
              imgPath:"/images/img50/case/release.png",
              title:"厂商认证需使用唯医骨科App",
              solidBtnTitile:"立即使用",
              authNoneTitle:"暂不使用",
              data:{
                el: ".solidBtn",
                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                android: "allin://com.allin.social:75235?data="+androidParam
              }
            });
          }
        }else {
          let t = this;
          user.privExecute({
            operateType: 'auth',
            noNeedBack: true,
            callback: function () {
              let collectUrl = path.createPrefer;
              let upDownType = 0;
              if (t.lastUpList[0].preferState == 0) {//未收藏
                collectUrl = path.createPrefer;
                upDownType = 1;
              } else {
                collectUrl = path.createPrefer;
                upDownType = 0;
              }
              let collectParams = {
                paramJson: JSON.stringify({
                  customerId: TempCache.getItem('userId'),//opts.customerId,
                  usefulType: 8,//'类型（1-视频，2-文库，3-会议，4-话题 ,5-笔记  6-人 7-病例）',"+
                  upDownType: upDownType, //0-cai 1-zan
                  refId: data.refId //  资源ID
                })
              }
              comm.ajax2({
                url: collectUrl,
                data: collectParams,
                success: function (res) {
                  if (res && res.responseObject && res.responseObject.responseStatus) {
                    if (t.lastUpList[0].preferState == 0) {
                      t.lastUpList[0].preferState = 1;
                      t.lastUpList[0].upNum += 1;
                    } else {
                      t.lastUpList[0].preferState = 0;
                      t.lastUpList[0].upNum -= 1;
                      if (t.lastUpList[0].upNum <= -1) {
                        t.lastUpList[0].upNum = 0;
                      }
                    }
                  }
                }
              })
            }
          });
        }
      }
    },
    mounted(){
      this.returnBack();
      this.appWakeUp();
      this.getRefName();
      this.followStatus();
      this.deleteStatus();
      this.ajaxAsyncHandle("up");//正文
      if(this.config.name == "discuss"){//上下文
        this.ajaxAsyncHandle("down");
      }
    },
    //dom加载完执行
    updated(){
      this.getHeight();
      this.share();
    },
    components:{
      PopupLayer,
      Loading,
      ReviewList
    },

  }
</script>