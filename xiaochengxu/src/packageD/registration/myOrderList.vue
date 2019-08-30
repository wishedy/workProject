<template>
  <section class="order-list-main" :class="{'order-list-tip':!orderList.length}">
    <section class="order-top">
      <figure class="select-out">
        <form  @submit="formSubmit" report-submit="true">
          <button
            type="submit"
            formType="submit"
            class="select-text"
            @click="selectHandle"
          >
            <span>{{currentSelect}}</span>
            <i class="select-down" :class="{'active':isShowSelect}"></i>
          </button>
        </form>
        <ul class="select-container" v-show="isShowSelect">
          <li
            v-for="(item,index) in typeSelect"
            :key="index"
            class="select-item"
            :class="{'active':item===currentSelect}"
            @click="itemHandle(item,index)"
          >
            <form  @submit="formSubmit" report-submit="true">
            <button
              type="submit"
              formType="submit"
            >{{item}}</button>
          </form>
          </li>
        </ul>
      </figure>
      <form  @submit="formSubmit" report-submit="true">
        <button
          type="submit"
          formType="submit"
          class="rule-btn"
          @click="goOrderRule"
        ><img class="order-img" src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_rule.png">预约须知</button>
      </form>
    </section>
    <article class="order-list" v-if="orderList.length">
     <figure class="order-list-item" v-for="(item,index) in orderList" :key="index" @click="gotoDetail(item.id)">
       <p class="list-item-top">
         <span class="item-name">{{item.patientName}}</span>
         <span class="item-state" :class="{'active': item.visitState==2}">{{item.visitState==2?'已就诊':(item.visitState==1?'待就诊':'')}}</span>
       </p>
       <section class="item-content-con">
         <p class="list-item-content">
           <span class="content-title">就诊时间：</span>
           <span class="content-text">{{item.registDate+'&nbsp;'+item.clinicDuration}}</span>
         </p>
         <p class="list-item-content">
           <span class="content-title">科室：</span>
           <span class="content-text">{{item.deptName}}</span>
         </p>
         <p class="list-item-content">
           <span class="content-title">医生：</span>
           <span class="content-text">{{item.doctorName+'&nbsp;'+item.doctorTitle}}</span>
         </p>
       </section>
     </figure>
    </article>
    <section class="no-order-list" v-if="!orderList.length">
        <figure class="no-tip-con">
          <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/no-order.png" class="tip-img"/>
          <p class="tip-text">暂无预约挂号</p>
        </figure>
    </section>
    <back-index v-if="backIndexShow"></back-index>
  </section>
</template>

<script>
  /*
   * @Desc:我的预约列表
   * @Usage:
   * @Notify：
   * @Depend：
   * Created by zh on  2019/5/27
   *
   */
  import dataLog from 'common/js/dataLog/dataLog'
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import api from 'common/js/util/util';
  import BackIndex from "components/backIndex"; // 返回首页组件
  const orderList = {
    getOrderList: api.httpEnv() + '/mcall/tocure/register/basic/getMyAppointmentList/'
  };
  export default {
    data(){
      return {
        typeSelect:['全部','待就诊','已就诊'],
        currentSelect:'全部',
        isShowSelect:false,
        visitState:10,
        firstResult:0,
        maxResult:20,
        noMoreShow:false,
        orderList:[],
        patientCustomerId:'',
        backIndexShow:false
      }
    },
    components:{
      BackIndex
    },
    onReachBottom() {
      //分页加载
      // if (!this.noMoreShow&&this.orderList.length) {
      //   this.firstResult += this.maxResult;
      //   this.getOrderList();
      // }
    },
    methods:{
      //获取挂号列表
      getOrderList(){
        let _this=this;
        wx.showLoading({
          title: "正在加载..."
        });
        api.ajax({
          url: orderList.getOrderList,
          method: "post",
          data: {
            patientCustomerId: _this.patientCustomerId,
            visitState:_this.visitState,
            firstResult: _this.firstResult,
            maxResult: _this.maxResult,
          },
          done(response) {
            wx.hideLoading();
            if (
              response &&
              response.responseObject &&
              response.responseObject.responseData &&
              response.responseObject.responseData.dataList &&
              response.responseObject.responseData.dataList.length > 0) {
              let dataList = response.responseObject.responseData.dataList;
              _this.orderList=_this.orderList.concat(dataList);
              if(dataList.length<_this.maxResult){
                _this.noMoreShow=true;
              }
            }else {
              _this.noMoreShow=true;
            }
          }
        })
      },
      //跳转预约须知
      goOrderRule () {
        wx.navigateTo({
          url: '/packageD/registration/orderRule'
        })
      },
      //跳转到预约详情
      gotoDetail(id){
        dataLog.createTrack({
          actionId: 14258,
        });
        wx.navigateTo({
          url:`/packageD/registration/orderSuccess?registId=${id}`
        })
      },
      //显示下拉选项
      selectHandle(){
        this.isShowSelect=!this.isShowSelect;
      },
      //下拉选项点击
      itemHandle(item,index){
        this.isShowSelect=false;
        this.currentSelect=item;
        let actionId='';
        switch (index){
          case 0:
            actionId=14255;
            this.visitState=10;
            break;
          case 1:
            actionId=14256;
            this.visitState=1;
            break;
          case 2:
            actionId=14257;
            this.visitState=2;
            break;
        }
        dataLog.createTrack({
          actionId: actionId,
        });
        this.firstResult=0;
        this.orderList=[];
        this.noMoreShow=false;
        // wx.pageScrollTo({
        //   scrollTop: 0,
        //   duration: 0
        // });
        this.getOrderList();
      },
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onShow(){
      dataLog.enterBrowse();
      this.isShowSelect=false;
      let pages = getCurrentPages(); //页面栈
      if(pages.length==1){
        this.backIndexShow=true;
      }else {
        this.backIndexShow=false;
      }
    },
    onLoad(option){
      let userId=wx.getStorageSync('userId');
      if(!userId){
        this.patientCustomerId=option.customerId;
      }else {
        this.patientCustomerId=userId;
      }
      this.currentSelect='全部';
      this.firstResult=0;
      this.visitState=10;
      this.orderList=[];
      this.noMoreShow=false;
      this.getOrderList();
    }
  };
</script>

<style lang="scss" scoped>
.order-list-main{
  padding-top: 50px;
  background:rgba(242,245,247,1);
  width: 100%;
  min-height: 100%;
  line-height:1;
  box-sizing: border-box;
  &.order-list-tip{
    height: 100%;
    overflow: hidden;
  }
  .no-order-list{
    margin-top: 302px;
    .no-tip-con{
      text-align: center;
      .tip-img{
        width:144px;
        height:144px;
      }
      .tip-text{
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:30px;
        margin-top: 40px;
      }
    }
  }
  button{
    background: transparent;
    margin: 0;
    padding: 0;
    line-height: 1;
    border: none;
    outline: none;
    button::after {
      border: none;
    }
  }
  .order-top{
    @include clearfix();
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*background:rgba(242,245,247,1);*/
    /*padding-top: 60px;*/
    /*padding-bottom: 32px;*/
  }
  .select-out{
    position: relative;
    float: left;
    .select-text{
      font-size:0;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(46,169,254,1);
      line-height:32px;
      padding: 0 30px;
      span{
        font-size:32px;
        display:inline-block;
        vertical-align:middle;
        font-weight: bold;

      }
      .select-down{
        display:inline-block;
        vertical-align:middle;
        width:26px;
        height:26px;
        background: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/order_list_show.png") center center no-repeat;
        background-size: 26px 26px;
        margin-left: 6px;
        &.active{
          background: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/order_list_hide.png") center center no-repeat;
          background-size: 26px 26px;
        }
      }
    }
    .select-container{
      position: absolute;
      top: 62px;
      left: 22px;
      border-radius: 8px;
      padding:  14px 30px;
      background:rgba(254,254,254,1);
      box-shadow:0px 6px 30px 0px rgba(131,149,162,0.4);
      &:before{
        content: '';
        width: 0;
        height: 0;
        border-bottom: 20px solid #FEFEFE;
        border-left: 16px solid transparent;
        border-right: 16px solid transparent;
        position: absolute;
        top: -18px;
        left: 20px;
      }
      .select-item{
        padding: 34px 16px;
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        line-height:30px;
        white-space: nowrap;
        border-bottom: 2px solid #f2f2f2;
        text-align: center;
        button{
          color:rgba(51,51,51,1);
          font-size:30px;
        }
        &.active{
          button{
            color:rgba(46,169,254,1);
            font-weight: bold;
          }

        }
        &:last-child{
          border-bottom: none;
        }
      }
    }
  }
  .rule-btn{
    width: 124px;
    height: 24px;
    margin-right: 30px;
    line-height: 24px;
    font-size: 24px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    float: right;
    color:rgba(85,85,85,1);
    .order-img {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }
  .order-list{
    padding-bottom: 100px;
    /*margin-top:64px;*/
  }
  .order-list-item{
    margin: auto;
    width:710px;
    /*min-height:370px;*/
    background:rgba(254,254,254,1);
    box-shadow:0px 6px 18px 0px rgba(131,149,162,0.1);
    border-radius:8px;
    margin-top: 30px;
    .list-item-top{
      @include clearfix();
      padding: 32px 30px 26px;
      border-bottom: 2px solid #F2F2F2;
      .item-name{
        float: left;
        font-size:32px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:32px;
        max-width: 500px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item-state{
        float: right;
        font-size:30px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:30px;
        &.active{
          color:rgba(170,170,170,1);
        }
      }

    }
    .item-content-con{
      padding: 24px 30px 4px;
      .list-item-content{
        margin-bottom: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .content-title{
          width:128px;
          height:30px;
          font-size:30px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(119,119,119,1);
          line-height:30px;
          margin-right: 66px;
          display: inline-block;
          vertical-align: middle;
        }
        .content-text{
          font-size:32px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:32px;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
