<template>
  <section class="patientNoteCon" :class="{'patientHidden':isHidden,' patient-table':isTable}">
    <header>
      <h1 class="headerTitle">{{nodeDetail.manualName}}</h1>
      <p class="headerInfo" v-if="!isTable">
        <span class="headerNum">{{nodeDetail.totalBrowseNum}}浏览</span>
      </p>
    </header>
   <section v-if="!isTable">
     <section class="noteContent">
       <!--适应人群-->
       <article class="noteItem" v-if="nodeDetail.adaptCrowd">
         <h2 class="itemTitle"><span class="itemMidd">适应人群</span></h2>
         <div class="itemDesc">
           <p class="itemdescCon">
             {{nodeDetail.adaptCrowd}}
           </p>
         </div>
       </article>
       <!--专家说-->
       <article class="noteItem" v-if="nodeDetail.expertsSay">
         <h2 class="itemTitle"><span class="itemMidd">专家说</span></h2>
         <div class="itemDesc">
           <p class="itemdescCon">
             {{nodeDetail.expertsSay}}
           </p>
         </div>
       </article>
       <!--推荐专家-->
       <article class="noteItem" v-if="nodeDetail.recommenderList&&nodeDetail.recommenderList.length">
         <h2 class="itemTitle"><span class="itemMidd">推荐专家</span><span class="doctorTip">(点击头像咨询)</span></h2>
         <ul class="itemDesc doctorList">
           <li class="doctorItem" v-for="(item,index) in nodeDetail.recommenderList" @click="showWarm(item,'recommend',index)" :key="index">
             <img :src="item.logoUrl"/>
             <div class="doctorInfo">
               <p class="doctorName"><span>{{item.fullName}}</span></p>
               <p class="doctorDesc"><span class="doctorMed" v-if="item.medicalTitle">{{item.medicalTitle}}&nbsp;&nbsp;</span><span class="doctorCom">{{item.hospital}}</span></p>
             </div>
           </li>
         </ul>
       </article>
       <!--内容-->
       <article class="noteItem" v-if="totalNum">
         <h2 class="itemTitle"><span class="itemMidd">{{totalNum}}个内容</span></h2>
         <figure class="contentCon" v-for="(item,index) in contentList" :key="index">
           <h3 class="contentTitle" v-if="item.contentTypeName"><span>{{item.contentTypeName}}</span></h3>
           <ul>
             <li class="contentItem" v-for="(itemC,indexC) in item.contentList" :key="indexC" :class="{'itemVideo':itemC.educationContentType==5,'itemContentDesc':itemC.educationContentType!=5}">
               <div v-if="itemC.educationContentType==5"  @click="gotoVideo(itemC)">
                 <div class="videoPic">
                   <img :src="itemC.videoMap.imgUrl"/>
                   <span class="iconPlay"></span>
                   <span class="timeContaier">{{itemC.playTime}}</span>
                 </div>
                 <div class="videoInfo">
                   <p class="videoTitle">{{itemC.educationName}}</p>
                   <p class="repetition">{{itemC.tipsContent}}</p>
                 </div>
               </div>
               <!--<div class="itemContainer" v-if="itemC.educationContentType==0" @click="gotoNoteDetail(itemC)">-->
               <div class="itemContainer" v-else @click="gotoNoteDetail(itemC)">
                 <p class="itemConTitle">{{itemC.educationName}}</p>
                 <p class="itemConDesc"><span class="browseNum">{{itemC.browseNum}}个浏览</span><span class="creatTime">{{itemC.webCreateTime}}</span></p>
               </div>
             </li>
           </ul>
         </figure>
       </article>
     </section>
     <footer class="btnFooter">
       <button class="shareSend wx-contact-text"  open-type='share'><i class="iconShare"></i><span class="shareSend">转发</span></button>
       <button class="shareBtn wx-contact-text" @click="shareImg"><i class="iconShare"></i><span class="shareText">分享</span></button>
     </footer>
   </section>
    <section class="node-nodata" v-if="isTable">
      <figure class="nodata-tip">
        <img src="https://m.allinmed.cn/static/image/mp/index/1.1.7/none_conten.png"/>
        <p class="tip-text">手册内没有内容</p>
      </figure>
    </section>
    <div class="doctorInvite" v-if="isShowInvite" @click="showWarm({'customerId':doctorInfo.doctorId,'fullName':doctorInfo.doctorName},'shareDoctor',0)">
      <i class="closeDoctor" @click.stop="closeInvite"></i>
      <p class="doctorName"><span class="doctorText">{{doctorName}}医生</span><br/>邀您阅读</p>
    </div>
    <share-node v-if="isShowShare" @shareClose="shareClose" :manualId="manualId" :doctorId="doctorId"></share-node>
    <normalLoading v-if="loading.length"></normalLoading>
    <BackIndex v-if="backIndexShow"></BackIndex>
    <BlackList></BlackList>
    <authorization></authorization>
  </section>
</template>

<script>
  import shareNode from './components/shareNode'
  import normalLoading from "components/loading";
  import api from 'common/js/util/util';
  import BackIndex from "components/backIndex"; // 返回首页组件
  import {createNamespacedHelpers} from 'vuex';
  import dataLog from "dataLog";
  import getPagesParam from "common/js/getPagesParam/getPagesParam";
  import BlackList from "components/BlackList";
  import authorization from "components/authorization/authorization";
  let noteUrl={
    getManualDetail:api.httpEnv() +'/mcall/cms/patienteducation/v1/getManualBase/',//手册详情--基本信息
    getContentList:api.httpEnv() +'/mcall/cms/patienteducation/v1/getManualList/',//手册详情--内容列表
    getDoctorTip:api.httpEnv() +'/mcall/cms/patienteducation/v1/getDoctorTip/',//手册详情--医生悬浮窗提示
  };
  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('patientNote');
  export default {
    data() {
      return {
        manualId:'',
        nodeDetail:{},
        contentList:[],
        totalNum:'',
        isShowInvite:true,
        isShowShare:false,
        pageIndex:1,
        nodata:false,
        loading:[],
        isHidden:false,
        doctorId:'',
        isTable:false,
        backIndexShow:false,
        doctorInfo:{

        }
      }
    },
    created() {

    },
    computed:{
      doctorName(){
        return this.getStrByteLength(this.doctorInfo.doctorName)
      }
    },
    onShareAppMessage () {
      wx.pageScrollTo({
        scrollTop:  0,
        duration: 100
      });
      dataLog.createTrack({
        actionId: 14206,
        keyword: this.nodeDetail.manualName
      });
      let path = `/pages/mIndex/mIndex?from=shareFriend&manualId=${this.manualId}&path=/packageF/patientNote/patientNote`;
      if(this.doctorId){
         path = `/pages/mIndex/mIndex?from=shareFriend&manualId=${this.manualId}&shareDoctorId=${this.doctorId}&path=/packageF/patientNote/patientNote`;
      }
      return {
        title: this.nodeDetail.manualName,
        path: path,
      }
    },
    onReachBottom(){//分页
      // let t=this;
      // if(!t.loading&&!t.nodata&&t.totalNum>20){
      //   // t.getContentList();
      // }
    },
    methods: {
      ...mapMutations(['setVideoMap']),
      //判断是否显示为空
      jugeNodata(){
        if(
          this.nodeDetail.adaptCrowd
          ||this.nodeDetail.expertsSay
          ||(this.nodeDetail.recommenderList&&this.nodeDetail.recommenderList.length)
          ||this.totalNum
        ){
          this.isTable=false;
          // this.isTable=true;
        }else {
          this.isTable=true;
        }
      },
      getStrByteLength(item){
        if(item){
          if(api.getByteLen(item)>8){
            return  api.getStrByteLength(item,3)+'...'
          }else {
            return item;
          }
        }else {
          this.isShowInvite=false;
        }


      },
      //患教详情
      gotoNoteDetail(item){
        dataLog.createTrack({
          actionId: 14205,
          pushMessageId: item.educationId,
          keyword: item.educationName
        });
        let pagesParam= getPagesParam.getPageInfo('healthKnowledgeDetail');
        let webUrl=item.webStoragePath+'?educationId='+item.educationId;
        if(pagesParam.hasName){//有相同的
          wx.setStorageSync('knowledgeDetailUrl', webUrl);
          wx.navigateBack({
            delta: pagesParam.backNum
          })
        }else {//没有相同的历史
          wx.navigateTo({
            url:`/pages/healthKnowledgeDetail/healthKnowledgeDetail?url=${encodeURIComponent(webUrl)}`
          })
        }

      },
      //关闭分享卡片
      shareClose(data){
        this.isHidden=false;
        this.isShowShare=false;
      },
      //分享卡片
      shareImg(){
        dataLog.createTrack({
          actionId: 14207,
        });
        this.isHidden=true;
        this.isShowShare=true;
      },
      //去医生主页
      showWarm(item,type,index){
        let doctorId=item.customerId;
        if(type=='shareDoctor'){
          dataLog.createTrack({
            actionId: 14208,
            pushMessageId: doctorId,
            keyword: item.fullName,
            locationId:index
          });
        }else {
          dataLog.createTrack({
            actionId: 14204,
            pushMessageId: doctorId,
            keyword: item.fullName,
            locationId:index
          });
        }
        let pagesParam= getPagesParam.getPageInfo('doctorMain');
        if(pagesParam.hasName){//有相同的
          wx.setStorageSync('nodeDoctorId', doctorId);
          wx.navigateBack({
            delta: pagesParam.backNum
          })
        }else {//没有相同的历史
          wx.navigateTo({
            url:`/pages/doctorMain/doctorMain?doctorCustomerId=${doctorId}&from=patientNote`
          })
        }

      },
      //关闭邀请医生
      closeInvite(){
        this.isShowInvite=false;
        dataLog.createTrack({
          actionId: 14209,
        });
      },
      gotoVideo(item){
        // item.videoMap.tipsContent=item.tipsContent;
        // item.videoMap.educationId=item.educationId;
        // this.setVideoMap(JSON.stringify(item.videoMap));
        dataLog.createTrack({
          actionId: 14205,
          pushMessageId: item.educationId,
          keyword: item.educationName
        });
        wx.navigateTo({
          url:`/packageF/patientNote/detailVideo?educationId=${item.educationId}&manualId=${this.manualId}&id=${item.id}`
        })
      },
      //手册详情--基本信息
      getManualDetail(){
        let t=this;
        t.loading.push('1');
        api.ajax({
          url:noteUrl.getManualDetail,
          method: 'post',
          data: {
            manualId:t.manualId,
            visitSiteId:api.getSiteId(),
            customerId:wx.getStorageSync('userId')||''
          },
          timeout: 30000,
          done(response) {
            t.loading.pop();
            if(response&&response.responseObject&&response.responseObject.responseData&&response.responseObject.responseData.dataList){
              console.log(response.responseObject.responseData.dataList[0])
              t.nodeDetail=response.responseObject.responseData.dataList[0];
              t.jugeNodata();
            }
          }
        })
      },
      //手册详情--医生悬浮窗提示
      getDoctorTip(){
        let t=this;
        t.loading.push('1');
        api.ajax({
          url:noteUrl.getDoctorTip,
          method: 'post',
          data: {
            doctorId:t.doctorId
          },
          timeout: 30000,
          done(response) {
            t.loading.pop();
            if(response&&response.responseObject&&response.responseObject.responseData&&response.responseObject.responseData.dataList){
              let dataList=response.responseObject.responseData.dataList;
              if(dataList.length){
                t.doctorInfo=dataList[0];
                t.isShowInvite=true;
              }
            }
          }
        })
      },
      //手册详情--内容列表
      getContentList(){
        let t=this;
        t.loading.push('1');
        api.ajax({
          url:noteUrl.getContentList,
          method: 'post',
          data: {
            manualId:t.manualId,
            visitSiteId:api.getSiteId(),
            customerId:wx.getStorageSync('userId')||'',
            // firstResult:(t.pageIndex-1)*20,
            // maxResult:20,
            resultType:'1',
            videoAttSpec:8
          },
          timeout: 30000,
          done(response) {
            t.loading.pop();
            // t.pageIndex++;
            if(response&&response.responseObject&&response.responseObject.responseData&&response.responseObject.responseData.dataList){
              let dataList=response.responseObject.responseData.dataList;
              if(dataList.length){
                t.nodata=false;
                t.contentList=dataList;
                // if(t.contentList.length){
                //   //新数据与旧数据最后一个id一致拼接到最后一个数组的contentList
                //   if (t.contentList[t.contentList.length - 1].contentId == dataList[0].contentId) {
                //     t.contentList[t.contentList.length - 1].contentList=t.contentList[t.contentList.length - 1].contentList.concat(dataList[0].contentList);
                //     dataList.splice(0,1);
                //     t.contentList=t.contentList.concat(dataList);
                //   }else {
                //     t.contentList=t.contentList.concat(dataList)
                //   }
                // }else {
                //   //第一次
                //   t.contentList=dataList;
                // }
                // let contentLen=t.getContentLen(dataList);
                // if(contentLen<20){
                //   // 下一页没有数据
                //   t.nodata=true;
                // }else {
                //   t.nodata=false;
                // }
              }else {
                // 没数据
                t.nodata=true;
              }


            }
            if(response&&response.responseObject&&response.responseObject.responseData&&response.responseObject.responseData.totalNum){
              t.totalNum=response.responseObject.responseData.totalNum;
            }
            t.jugeNodata();
          }
        })
      },
      //  判断当前content的长度
      getContentLen(content){
        let num=0;
        for(let i=0;i<content.length;i++){
          num+=content[i].contentList.length
        }
        return num
      }
    },
    onShow(){
      dataLog.enterBrowse({
        browseType:"135",
        opDesc:"专家指南详情页-小程序"
      })
      let pages = getCurrentPages(); //页面栈
     if(pages.length==1){
       this.backIndexShow=true;
     }else {
       this.backIndexShow=false;
     }
      if(wx.getStorageSync('nodeManualId')){
        this.manualId=wx.getStorageSync('nodeManualId');
        wx.removeStorageSync('nodeManualId')
        this.getManualDetail();
        this.getContentList();
      }
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onLoad(option){
      this.manualId='';
      this.nodeDetail={};
      this.contentList=[];
      this.totalNum='';
      this.doctorId='';
      this.doctorInfo={};
      this.isShowInvite=true;
      this.isShowShare=false;
      this.loading=[];
      this.isHidden=false;
      this.isTable=false;
      // // 扫码进来只能拼接 scene 参数，对此做判断
      if (option.scene) {
        if(option.scene.indexOf('_')!=-1){
          this.manualId = option.scene.split('_')[0]; //手册ID
          this.doctorId = option.scene.split('_')[1]; //医生ID
        }else {
          this.manualId=option.scene;
        }

      }else {
        if(option.manualId){
          this.manualId=option.manualId;
        }
        if(option.shareDoctorId){
          this.doctorId=option.shareDoctorId
        }
      }

    },
    mounted() {
      if(this.doctorId){
        this.getDoctorTip();
      }
      this.getManualDetail();
      this.getContentList();
    },
    components: {
      shareNode,
      normalLoading,
      BackIndex,
      BlackList,
      authorization
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .patientNoteCon{
    &.patientHidden{
      height: 100%;
      overflow: hidden;
    }
    &.patient-table{
      display: -webkit-flex; /* Safari */
      display: flex;
      height: 100%;
      overflow: hidden;
      flex-direction: column ;
    }
    header{
      padding: 46px 30px 62px 30px;
      background:linear-gradient(360deg,rgba(0,209,181,1) 0%,rgba(0,185,173,1) 100%);
      box-shadow:0px 12px 22px 0px rgba(210,228,227,1);
      h1{
        font-size:44px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:#fff;
        line-height:50px;
        margin-bottom: 26px;
      }
      .headerInfo{
        font-size: 0;
        .headerNum{
          font-size:26px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#fff;
          display: inline-block;
          vertical-align: middle;
          line-height: 26px;
        }
      }
    }
    .noteContent{
      background:rgba(255,255,255,1);
      border-radius:16px 16px 0px 0px;
      margin-top: -16px;
      padding: 0 30px 120px;
      .noteItem{
        .itemTitle{
          padding-top: 56px;
          .itemMidd{
            display: inline-block;
            vertical-align: middle;
            font-size:36px;
            font-family:PingFangSC-Medium;
            font-weight:bold;
            color:#000;
            line-height:36px;
          }

          &:before{
            content: '';
            display: inline-block;
            vertical-align: middle;
            width: 6px;
            height: 30px;
            background:rgba(7,182,172,1);
            border-radius:3px;
            margin-right: 12px;
          }
          .doctorTip{
            display: inline-block;
            margin-left: 14px;
            font-size:32px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#25324D;
            line-height:30px;
            vertical-align: middle;
          }
        }
        .itemDesc{
          .itemdescCon{
            margin-top: 2px;
            margin-left: 18px;
            padding: 20px 0 40px;
            font-size:32px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#333;
            line-height:44px;
            border-bottom: 1px solid #E3E5E9;
          }
          &.doctorList{
            margin: 40px 0 0 18px;
            border-bottom: 1px solid #E3E5E9;
          }
        }
        .doctorItem{
          margin-bottom: 48px;
          img{
            width: 100px;
            height: 100px;
            vertical-align: middle;
            border-radius: 50%;
          }
          .doctorInfo{
            display: inline-block;
            vertical-align: middle;
            width: 524px;
            margin-left: 24px;
            .doctorName{
              font-size:38px;
              font-family:PingFangSC-Medium;
              font-weight: bold;
              color:#25324D;
              line-height:52px;
            }
            .doctorDesc{
              font-size:28px;
              font-family:PingFangSC-Regular;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-weight:400;
              color:#25324D;
              line-height:40px;
            }
          }
        }
        .contentCon{
          margin-left: 12px;
          .contentTitle{
            font-size:32px;
            font-weight:bold;
            color:#000;
            line-height:44px;
            padding-bottom: 12px;
            border-bottom: 1px solid #E3E5E9;
            margin-top: 40px;
            margin-left: 0px;
            span{
              display: inline-block;
              vertical-align: middle;
              width: 640px;
            }
            &:before{
              display: inline-block;
              vertical-align: top;
              content: '';
              width: 26px;
              height: 26px;
              background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/tittle_icon.png") center center no-repeat;
              background-size: contain;
              margin-right: 12px;
              margin-top: 10px;
            }
          }
          .contentItem{
            padding: 32px 0;
            border-bottom: 1px solid #E3E5E9;
            &:last-child{
              border-bottom: none;
            }
            &.itemVideo{
              font-size: 0;
              .videoPic{
                position: relative;
                width:210px;
                height:140px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 30px;
                img{
                  width: 100%;
                  height: 100%;
                }
                .iconPlay{
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%,-50%);
                  background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/playButtom.png") center center no-repeat;
                  background-size: contain;
                  width: 84px;
                  height: 84px;
                }
                .timeContaier{
                  position: absolute;
                  right: 0px;
                  bottom:0px;
                  font-size:22px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:#FFF;
                  line-height:40px;
                  height:40px;
                  background:linear-gradient(180deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,.3) 100%);
                  border-radius:0px 0px 6px 6px;
                  width: 100%;
                  text-align: right;
                  padding-right: 10px;
                  box-sizing: border-box;
                }
              }
              .videoInfo{
                width: 416px;
                height: 140px;
                display: inline-block;
                vertical-align: middle;
                position: relative;
                .videoTitle{
                  font-size:32px;
                  font-family:PingFangSC-Medium;
                  font-weight:bold;
                  color:#333333;
                  line-height:44px;
                  text-overflow: -o-ellipsis-lastline;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .repetition{
                  font-size:26px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:#999;
                  line-height:36px;
                  /*margin-top: 16px;*/
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  /*width: 502px;*/
                  overflow: hidden;
                  width: 100%;
                  position: absolute;
                  bottom: 0;
                  left: 0;
                }

              }

            }
            &.itemContentDesc{
              .itemContainer{
                .itemConTitle{
                  font-size:32px;
                  font-family:PingFangSC-Medium;
                  font-weight:bold;
                  color:#333333;
                  line-height:44px;
                  text-overflow: -o-ellipsis-lastline;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .itemConDesc{
                  margin-top: 12px;
                  font-size:26px;
                  font-family:PingFangSC-Regular;
                  font-weight:400;
                  color:#999;
                  line-height:36px;
                  .browseNum{
                    margin-right: 30px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .btnFooter{
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 4;
      background:rgba(255,255,255,1);
      box-shadow:0px -6px 22px 0px rgba(0,0,0,0.1);
      button{
        width: 50%;
        height:98px;
        /*height:166px;*/
        text-align: center;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(80,108,133,1);
        line-height: 98px;
        background: #fff;
        @include iphoneX() {
          height:166px;
        }
        span{
          display: inline-block;
          vertical-align: middle;
          line-height:28px;
        }
        .iconShare{
          display: inline-block;
          vertical-align: middle;
          background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/send.png") center center no-repeat;
          background-size: contain;
          width: 36px;
          height: 36px;
          margin-right: 14px;
        }
        &.shareBtn{
          position: relative;
          &:before{
            position: absolute;
            content: '';
            width:1px;
            height:42px;
            background:rgba(240,240,240,1);
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          .iconShare{
            background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/share.png") center center no-repeat;
            background-size: contain;
            width: 32px;
            height: 32px;
          }
        }
      }
    }
    .doctorInvite{
      position: fixed;
      bottom: 138px;
      right: 40px;
      width:192px;
      height: 154px;
      background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/qipao.png") center center no-repeat;
      background-size: contain;
      .closeDoctor{
        position: absolute;
        top: -16px;
        right: -16px;
        width: 52px;
        height: 52px;
        background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/claose.png") center center no-repeat;
        background-size: contain;
      }
      .doctorName{
        width:176px;
        font-size:26px;
        text-align: center;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:32px;
        text-shadow:0px 4px 8px rgba(0,161,155,0.6);
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%,-50%);
        .doctorText{
          display: inline-block;
          font-weight: bold;
          margin-bottom: 2px;
          font-size:29px;
        }
      }
    }
    .wx-contact-text{
      padding-left:0;
      padding-right:0;
      box-sizing:border-box;
      border-radius:0;
      border: none;
      outline: none;
      display: inline-block;
      &:after {
        border: 0;
      }
    }
    .node-nodata{
      background:rgba(255,255,255,1);
      border-radius:16px 16px 0 0;
      margin-top: -16px;
      height: 100%;
      position: relative;
      .nodata-tip{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        img{
          width: 264px;
          height: 224px;
        }
        .tip-text{
          margin-top: 40px;
          font-size:34px;
          text-align: center;
          font-family:PingFangSC-Regular;
          font-weight:600;
          color:#222;
          line-height:36px;
        }
      }

    }
  }

</style>
