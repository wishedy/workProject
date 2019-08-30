<template>
  <section class="nodesDescCon">
    <section class="nodesDescTop" v-show="nodeState==0">
      <div>本次剩余<span>{{nodesCount}}</span>条</div>
      <button @click="isEndCli" v-show="nodeState==0&&nodesCount!=0">退出审核</button>
    </section>
    <section class="nodesDesc">
      <div v-show="(nodeState==0&&nodesCount!=0)||(nodeState==1&&nodesCount!=0)||(nodeState==2&&nodesCount!=0)">
        <span class="isShield" v-show="nodeState==2">屏蔽</span>
        <span  class="isPass" v-show="nodeState==1">通过</span>
        <article class="descTop">
          <span>{{dataList.nodeTime|timeFil}}</span>
          <span :data-picUrl="dataList.attUrl" @mouseover="overShow" @mouseout="outHide"></span>
          <span>{{dataList.createTime|timeFilter}}</span>
        </article>
        <article class="descTxt">{{dataList.nodeDesc}}</article>
        <article class="descBot">
          <div>
            <div>用户ID:<span>{{dataList.refCustomerId}}</span></div>
            <div>内容ID:<span>{{dataList.nodeId}}</span></div>
            <div class="videoName">内容标题:《<span>{{dataList.videoName}}</span>》</div>
          </div>
          <div v-show="nodeState==1||nodeState==2">
            <div>审核人:<span>{{dataList.opUserName}}</span></div>
            <div>审核时间:<span>{{dataList.updateTime|timeFilter}}</span></div>
          </div>
          <div v-show="nodeState==2" class="isShieldTxt">
            <div>屏蔽原因：<span>{{dataList.reason}}</span></div>
          </div>
        </article>
      </div>
      <div class="examineEnd" v-show="nodeState==0&&nodesCount==0">
        本次审核任务已完成
      </div>
      <div class="examineEnd" v-show="nodeState==1&&nodesCount==0">
        暂无已通过笔记内容
      </div>
      <div class="examineEnd" v-show="nodeState==2&&nodesCount==0">
        暂无已屏蔽笔记内容
      </div>
      <div class="leftRightBtn" v-show="nodeState!=0&&nodesCount!=0">
        <button @click="leftRightBtn(1)"></button>
        <button @click="leftRightBtn(2)"></button>
      </div>
    </section>
    <section class="nodesBot">
      <div class="examineBegBtn" v-show="nodeState==0&&nodesCount!=0">
        <button @click="updataState(3,dataList.nodeId)">屏蔽</button>
        <button @click="updataState(1,dataList.nodeId)">通过</button>
      </div>
      <div class="examineEndBtn" v-show="nodeState==0&&nodesCount==0">
        <button @click="backList">返回</button>
      </div>
      <div class="examineEndBtn" v-show="nodeState==1&&nodesCount==0">
        <button @click="backList">返回</button>
      </div>
      <div class="examineEndBtn" v-show="nodeState==2&&nodesCount==0">
        <button @click="backList">返回</button>
      </div>
      <div class="isShieldBtn" v-show="nodeState==1&&nodesCount!=0">
        <button @click="updataState(3,dataList.nodeId)">屏蔽</button>
      </div>
      <div class="isPassBtn" v-show="nodeState==2&&nodesCount!=0">
        <button @click="updataState(6,dataList.nodeId)">通过</button>
      </div>
    </section>
    <article class="endPopup" v-show="isEnding">
      <div>
        <i @click="exitCan"></i>
        <span class="exitTit">退出审核</span>
        <span class="exitQue">是否要终止审核？</span>
        <button class="exitCan" @click="exitCan">取消</button>
        <button class="exitEur" @click="exitEur">确认</button>
      </div>
    </article>
    <article class="endPopup shieldPopup" v-show="isShield">
      <div>
        <i @click="updataState(4,dataList.nodeId)"></i>
        <span class="exitTit">屏蔽原因</span>
        <textarea name="屏蔽原因" id="resaon"></textarea>
        <button class="exitCan" @click="updataState(4,dataList.nodeId)">取消</button>
        <button class="exitEur" @click="updataState(5,dataList.nodeId)">确认</button>
      </div>
    </article>
    <div class="imgContent" v-show="isShowImg">
      <img :src="dataList.attUrl" alt="">
      <!--<img src="http://img05.allinmd.cn/public1/M00/1D/B8/wKgBL1vGzxSAPRspAA-78AWFHw4196_c.jpg" alt="">-->
    </div>
  </section>
</template>
<style lang="scss">
  .nodesDescCon{
    width: 822px;
    margin: 80px auto 0;
    background: #F6F7FA;
    .nodesDescTop{
      font-size: 18px;
      color: #A7A9AC;
      margin-bottom: 32px;
      position: relative;
      div{
        display: inline-block;
        span{
          color: #FF7E4D;
        }
      }
      button{
        width: 98px;
        height: 33px;
        border: 1px solid #4B67D6;
        background-color: #F6F7FA;
        border-radius: 100px;
        font-size: 14px;
        color: #4B67D6;
        display: inline-block;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
      }
    }
    .nodesDesc{
      width: 758px;
      min-height: 183px;
      background-color: #ffffff;
      padding: 56px 32px;
      position: relative;
      .isShield{
        width: 57px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        background: rgba(249,178,183,.6);
        text-align: center;
        line-height: 30px;
        font-size: 15px;
        color: #EB3B46;
      }
      .isPass{
        width: 57px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        background: rgba(212,252,218,.8);
        text-align: center;
        line-height: 30px;
        font-size: 15px;
        color: #4FC260;
      }
      .descTop{
        font-size: 0;
        position: relative;
        span{
          display: inline-block;
          &:first-child{
            width: 54px;
            height: 23px;
            margin-right: 32px;
            font-size: 15px;
            color: #FFFFFF;
            background: #6483E9;
            border-radius: 3px;
            text-align: center;
            line-height: 23px;
            vertical-align: top;
          }
          &:nth-child(2){
            width: 25.6px;
            height: 22px;
            background: url("./components/images/smallPic.png") no-repeat center;
            background-size: inherit;
            cursor: pointer;
          }
          &:last-child{
            position: absolute;
            right: 0;
            top: 0;
            font-size: 14px;
            color: #333333;
          }
        }
      }
      .descTxt{
        margin: 32px 0 48px;
        font-size: 16px;
        color: #111111;
        line-height: 24px;
      }
      .descBot{
        &>div{
          display: block;
          margin-bottom: 12px;
          div{
            font-size: 14px;
            color: #333333;
            display: inline-block;
            margin-right: 56px;
            &:last-child{
              margin-right: 0;
            }
          }
        }
        .videoName{
          span{
            line-height: 21px;
          }
        }
        .isShieldTxt{
          span{
            line-height: 21px;
          }
        }
      }
      .examineEnd{
        text-align: center;
        vertical-align: middle;
        margin-top: 82px;
      }
      .leftRightBtn{
        button{
          width: 35px;
          height: 52px;
          cursor: pointer;
          &:first-child{
            background: url("./components/images/leftBtn.png");
            position: absolute;
            left: -124px;
            top: 50%;
          }
          &:last-child{
             background: url("./components/images/rightBtn.png");
            position: absolute;
            right: -124px;
            top: 50%;
           }
        }
      }
    }
    .nodesBot{
      text-align: center;
      margin: 72px 0;
      font-size: 16px;
      .examineBegBtn{
        button{
          border-radius: 3px;
          width: 105px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          color: #ffffff;
          cursor: pointer;
          &:first-child{
            background: #EB3B46;
            box-shadow: 0 5px 16px 0 rgba(254,143,166,0.54);
            margin-right: 104px;
          }
          &:last-child{
            background: #52CC64;
            box-shadow: 0 5px 16px 0 rgba(152,246,166,0.77);
          }
        }
      }
      .examineEndBtn{
        button{
          width: 160px;
          height: 41px;
          text-align: center;
          line-height: 36px;
          cursor: pointer;
          background: #4B67D6;
          box-shadow: 0 5px 16px 0 rgba(157,176,252,0.55);
          border-radius: 3px;
          color: #ffffff;
        }
      }
    }
    .isShieldBtn{
      button{
        width: 160px;
        height: 41px;
        background: #EB3B46;
        box-shadow: 0 5px 16px 0 rgba(254,143,166,0.54);
        border-radius: 3px;
        color: #ffffff;
        cursor: pointer;
      }
    }
    .isPassBtn{
      button{
        width: 160px;
        height: 41px;
        background: #52CC64;
        box-shadow: 0 5px 16px 0 rgba(152,246,166,0.77);
        border-radius: 3px;
        color: #ffffff;
        cursor: pointer;
      }
    }
    .endPopup{
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.7);
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      font-size: 0;
      div{
        width: 381px;
        height: 240px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background: #FFFFFF;
        border-radius: 4px;
        text-align: center;
        i{
          display: inline-block;
          width: 26px;
          height: 26px;
          background: url("./components/images/close.png") no-repeat;
          background-size: initial;
          position: absolute;
          right: 6px;
          top: 6px;
          cursor: pointer;
        }
        span{
          display: block;
          &.exitTit{
            font-size: 20px;
            color: #2C343A;
            margin: 32px auto 0;
            font-weight: bold;
          }
          &.exitQue{
            font-size: 15px;
            color: #6C7492;
            margin: 48px auto;
          }
        }
        button{
          width: 110px;
          height: 41px;
          font-size: 15px;
          color: #FFFFFF;
          text-align: center;
          line-height: 41px;
          border-radius: 3px;
          cursor: pointer;
          &.exitCan{
            background: #A1A8C0;
            margin-right: 20px;
          }
          &.exitEur{
            background: #4B67D6;
          }
        }
      }

    }
    .shieldPopup{
      div{
        height: 343px;
      }
      textarea{
        resize: none;
        margin: 32px auto;
        padding: 12px;
        display: block;
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 4px;
        width: 297px;
        height: 126px;
        font-size: 14px;
        color: #333333;
        line-height: 21px;
      }
    }
    .imgContent{
      background: rgba(0,0,0,.92);
      box-shadow: 0 5px 16px 0 rgba(20,38,95,0.27);
      border-radius: 3px;
      display: inline-block;
      width: 375px;
      min-height: 375px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      vertical-align: middle;
      line-height:200px;
      img{
        display: inline-block;
        width: 375px;
        position: absolute;
        left:50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
</style>
<script>
// const axios = require('axios');
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
// import { Loading } from 'element-ui';
export default {
  name: 'videoNodesDesc',
  data() {
    return {
      dataList: [],
      isEnding: false,
      nodeState: 0,
      nodesCount: '',
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userRealName'),
      isShield: false,
      isShowImg: false,
      param: {
        nodeId: this.$route.query.nodeId, // 用来获取导航参数
        nodeState: this.$route.query.nodeState, // 笔记类型
        sortType: this.$route.query.sortType, // 排序类型
        keyWord: this.$route.query.keyWord// 关键字
      },
      preNodeId: '', // 上一个nodeId
      afterNodeId: '', // 下一个nodeId
      isLoading: false
    };
  },
  filters: {
    timeFil(date) { // 时间过滤器
      // return (date.substring(date.indexOf(' '),date.length)).substring(0,date.substring(date.indexOf(' '),date.length).lastIndexOf(':'))
      if (date) {
        let minite = parseInt(date / 60);// 截取多少分钟
        let seconds = parseInt(date % 60);// 截取多少秒
        return (minite >= 10 ? minite : '0' + minite) + ':' + (seconds >= 10 ? seconds : '0' + seconds);
      }
    },
    timeFilter(date) {
      if (date) {
        return (date.substring(0, date.indexOf(' ')).split('-').join('/')) + ' ' + (date.substring(date.indexOf(' ') + 1, date.length - 5));
      }
    }
  },
  methods: {
    isEndCli() { // 点击退出审核
      this.isEnding = true;
    },
    exitCan() { // 取消退出审核
      this.isEnding = false;
    },
    exitEur() { // 确定退出审核
      let t = this;
      t.isEnding = false;
      let params = {
        userId: t.userId
      };
      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
          t.$router.push({name: 'videoNodesExamine'});
        }
      }
      t.getDataAxios(apiConfig.finishVerify.url, params, callback, apiConfig.finishVerify.type);
    },
    leftRightBtn(type) { // 左右按钮点击事件
      let t = this;
      if ((type === 1 && t.preNodeId) || (type === 2 && t.afterNodeId)) {
        if (type === 1) { // 表示按左侧按钮
          t.param.nodeId = t.preNodeId;
        }
        else { // 表示按右侧按钮
          t.param.nodeId = t.afterNodeId;
        }
        t.getDescFn();// 获取详情页数据
      }
    },
    getDescFn() { // 获取笔记详情
      let t = this;
      let params = {
        keyWord: t.param.keyWord,
        nodeId: t.param.nodeId,
        sortType: t.param.sortType,
        nodeState: t.param.nodeState,
        userId: t.userId
      };
      let callback = (res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          t.dataList = res.data.responseObject.responseData.dataList[0];
          t.nodeState = res.data.responseObject.responseData.dataList[0].nodeState;// 0-未审核，1-已通过，2-已屏蔽
          t.nodesCount = res.data.responseObject.responseData.nodeNum;
          t.preNodeId = t.dataList.preNodeId;
          t.afterNodeId = t.dataList.afterNodeId;
        }
      };
      this.getDataAxios(apiConfig.getVideoNodesDetail.url, params, callback, apiConfig.getVideoNodesDetail.type);
    },
    updataState(state, nodeId) { // 审核通过/拒绝笔记
      let t = this;
      let nodeState = '';
      if (state === 5) {
        nodeState = 2;
      }
      else if (state === 6) {
        nodeState = 1;
      }
      else {
        nodeState = state;
      }
      if (state === 5 && document.getElementById('resaon').value === '') {
        this.$message({
          message: '请填写屏蔽原因',
          type: 'error',
          center: true
        });
      }
      else if ((state === 2 && document.getElementById('resaon').value !== '') || (state === 5 && document.getElementById('resaon').value !== '') || state === 1 || state === 6) { // 表示是屏蔽/通过笔记
        let reason = document.getElementById('resaon').value;
        let params = {
          nodeId: nodeId,
          opUserName: t.userName,
          reason: (state === 2 || state === 5) ? reason : '',
          nodeState: nodeState,
          userId: t.userId
        };
        let callback = (res) => {
          if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) { // 屏蔽操作成功
            t.isShield = false;
            document.getElementById('resaon').value = '';
            if (t.afterNodeId) {
              t.leftRightBtn(2);// 选择屏蔽后点击
            }
            else { // 如果下一个id不存在并且待审核笔记总数是1，则表示只剩下一个则表示下一步进入显示没有待审核笔记样式
              if (t.preNodeId) {
                if (state === 5 || state === 6) {
                  t.leftRightBtn(1);// 选择屏蔽后点击
                }
              }
              else if (t.nodesCount === 1) {
                t.nodesCount--;
              }
            }
          }
          else {
            t.$message.error('操作失败,请重试!');
          }
        };
        this.getDataAxios(apiConfig.updateNodeState.url, params, callback, apiConfig.updateNodeState.type);
      }
      else if (state === 3) { // 表示点击屏蔽按钮，弹出屏蔽提示框即屏蔽原因
        t.isShield = true;
      }
      else if (state === 4) { // 表示点击屏蔽按钮，弹出屏蔽提示框即屏蔽原因后点击取消按钮
        t.isShield = false;
        document.getElementById('resaon').value = '';
      }
    },
    getDataAxios(path, params, callback, type, errorCallback) { // 获取数据公共方法
      // let loadingInstance = Loading.service(Loading);//loading显示
      let t = this;
      comm.openLoading('加载中...');
      t.isLoading = true;
      if (type === 'post' || type === 'put') {
        axios({
          method: type,
          url: path,
          data: params
        }).then((res) => {
          // loadingInstance.close();
          comm.closeLoading();
          t.isLoading = false;
          callback && callback(res);
        }).catch((e) => {
          comm.closeLoading();
          t.isLoading = false;
          errorCallback && errorCallback();
          console.log('获取数据失败：', e);
        });
      }
      else {
        axios({
          method: 'get',
          url: path,
          params: params
        }).then((res) => {
          comm.closeLoading();
          t.isLoading = false;
          callback && callback(res);
        }).catch((e) => {
          comm.closeLoading();
          t.isLoading = false;
          errorCallback && errorCallback();
          console.log('获取数据失败：', e);
        });
      }
    },
    overShow() { // 鼠标划入展示图
      this.isShowImg = true;
    },
    outHide() { // 鼠标画出
      this.isShowImg = false;
    },
    // 返回列表页
    backList() {
      this.$router.go(-1);
    }
  },
  mounted() {
    let t = this;
    t.getDescFn();
    document.onkeydown = function(event) {
      let e = event || window.event;
      if (!t.isLoading && !t.isShield) { // 当加载数据时或填写屏蔽原因时不能切换
        if (e && e.keyCode === 37) { // 左
          t.param.nodeId = t.preNodeId;
          if (t.preNodeId) {
            t.getDescFn();// 获取详情页数据
          }
        }
        if (e && e.keyCode === 39) { // 右
          t.param.nodeId = t.afterNodeId;
          if (t.afterNodeId) {
            t.getDescFn();// 获取详情页数据
          }
        }
      }
    };
  },
  // 离开当前页面后执行
  destroyed: function() {
    comm.goBack();
  }
};
</script>
