<template>
  <div style="height:100%;position:absolute;top:0;left:0;right:0;bottom:0">
    <Loading v-if="finish"></Loading>
    <section class="main-inner select-part" :class="{'full-screen':isFullScreen}" @click="secondShow=false;currentThreeLevel=0;imgArray=[]">
      <!--<header class="part-select-title">-->
        <!--<h3 v-if="!secondShow || loading">点选最不适位置</h3>-->
      <!--</header>-->
      <section class="main-inner-content" v-show="allReady">
        <section class="body-picture body-picture-f" :class="pointClassObject">
          <figure class="body-picture-content">
            <img class="body-picture-img" :src="patientBody">
            <img v-for="(item,index) in imgArray" :key="index" :src="item">
            <section class="pain-point-box">
              <div class="pain-point" v-for="(item , pIndex) in pointList.front" :key="pIndex"
                   @click="selectPartToSecond(pIndex,'show')"></div>
            </section>
          </figure>
        </section>
      </section>
    </section>
    <section class="sex-select-box">
      <ul class="sex-box">
        <li :class="ladyActive" @click="sexSelect('woman')">
          <button class="lady"></button> <span>女</span>
        </li>
        <li :class="manActive" @click="sexSelect('man')">
          <button class="man"></button> <span>男</span>
        </li>
        <li :class="childActive" @click="sexSelect('kid')">
          <button class="child"></button> <span>儿童</span>
        </li>
      </ul>
    </section>
    <div class="overturnBox" @click="turnDirection" :class="{'isIPad':isIPad}">
      <button class="body-picture-overturn"></button>
      <span class="overturnText">点击转身</span>
    </div>

    <section class="part-choice-box" :class="clickDirection" v-if="secondShow && !loading">
      <ul class="part-box" @click.stop="secondShow=true">
        <li class="btnBox-btn" :class="{'on':index == currentThreeLevel}" v-for="(item,index) in secondList"
            :key="index" @click="ensurePart(index)"><div class="btn-box">{{item.partNameAlias}}</div>
        </li>
      </ul>
      <form @submit="formSubmit" report-submit="true">
        <button class="part-choice-ensure" @click='surePart' formType="submit">确定</button>
      </form>
    </section>
    <NormalLoading v-if="loading"></NormalLoading>
    <Toast :content="toastContent" v-if="toastShow"></Toast>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：部位选择
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang/lichenyang on 2017/7/20.
   */
  import api from "common/js/util/util";
  import localStorage from "localStorage"
  import {createNamespacedHelpers} from "vuex";
  import NormalLoading from "components/loading";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import Toast from "components/toast";
  import dataLog from "dataLog";
  const {mapMutations,mapActions, mapState,mapGetters} = createNamespacedHelpers('consult');
  const XHRList = {
    partList: api.httpEnv() + "/mcall/comm/data/part/v1/getMapSearchList/"
  };
  const app = getApp();
  export default {
    data() {
      return {
        isFullScreen : false, // 判断是不是全面屏；
        isIPad:false, // 判断是不是 IPad 的屏幕
        finish:false,
        loading:false, // 控制页面 loading 组件
        allReady: false,
        clickDirection: "right",//用户点击的方向
        bodyImg: { //人体图像集合
          man: {
            front: 'https://m.allinmed.cn/static/image/mp/index/man_front.png',
            back: 'https://m.allinmed.cn/static/image/mp/index/man_back.png',
          },
          woman: {
            front: 'https://m.allinmed.cn/static/image/mp/index/woman_front.png',
            back: 'https://m.allinmed.cn/static/image/mp/index/woman_back.png',
          },
          kid: {
            front: 'https://m.allinmed.cn/static/image/mp/index/child_front.png',
            back: 'https://m.allinmed.cn/static/image/mp/index/child_back.png',
          }
        },
        pointList: {   //点集合...显示热区
          front: [
            '1502686180415',//1
            '1502686180415',//2
            '1502689695935',//3
            '1502689695935',//4
            '1502690198521',//5
            '1502690198521',//6
            '1502690439371',//7
            '1502690439371',//8
            '1502691077056',//9
            '1502691077056',//10
            '1502692059718',//11
            '1502692059718',//12
            '1502692884775',//13
            '1502692884775',//14
            '1502693114216',//15
            '1502693114216',//16
            '1502695666392',//17
            '1502695666392',//18
            '1502691850294',//19
            '1502691850294',//20
            '1502698164071',//21
            '1502698288786',//22
            '1502698892280',//23
          ],
          back: [
            '1502686180415',//1
            '1502686180415',//2
            '1502689695935',//3
            '1502689695935',//4
            '1502690198521',//5
            '1502690198521',//6
            '1502690439371',//7
            '1502690439371',//8
            '1502691077056',//9
            '1502691077056',//10
            '1502692059718',//11
            '1502692059718',//12
            '1502692884775',//13
            '1502692884775',//14
            '1502693114216',//15
            '1502693114216',//16
            '1502695666392',//17
            '1502695666392',//18
            '1502698288786',//19
            '1502698475475',//20
            '1502698641492',//21
            '1502698756885',//22
            '1502699009330',//23
          ],
        },
        imgArray: [],//选择部位热点图片数组
        direction: "back", //人体朝向...驱动点位切换
        currentType: "",//当前患者类型
        currentTwoLevel: -1,//当前二级部位
        currentThreeLevel: 0,//当前三级部位
        currentPindex: -1,//当前显示热区点
        secondShow: false,//二级问题显示状态钩子
        secondList: [] //二级问题数据集合
      }
    },
    onLoad () {
      this.isFullScreen = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth > 2 ? true : false ;
      this.isIPad = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth < 1.5 ? true : false ;
      this.allReady = true;
      // this.currentType = this.patientType();
      this.imgArray = [];//选择部位热点图片数组
      this.direction="back"; //人体朝向...驱动点位切换
      this.currentTwoLevel=-1;//当前二级部位
      this.currentThreeLevel=0;//当前三级部位
      this.currentPindex=-1;//当前显示热区点
      this.secondShow=false;//二级问题显示状态钩子
      this.secondList=[] //二级问题数据集合
      try {
        let grade = wx.getStorageSync('gender');
        switch (parseInt(grade)) {
          case 1:
            this.currentType = "man";
            break;
          default:
            this.currentType = "woman";
        }
      } catch (e) {}

    },
    methods: {
      ...mapMutations(["showLoading","hideLoading","showToast",]),
      ...mapActions(["setPatientMessage"]),
      /** 发送formId */
      formSubmit(e) { sendFormId(e.target.formId); },
      patientType() { //患者基本类型
        return this.currentType;
      },
      turnDirection() { //翻转图片
        dataLog.createTrack({
          actionId: 14160,
        });
        this.secondShow = false;
        this.imgArray = [];
        if (this.direction === "front") {
          this.direction = "back";
        } else {
          this.direction = "front";
        }
      },
      //获取用户点击屏幕左右还是右侧
      leftRightClick() {
        let frontFlag = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];//根据正面可点区域的顺序总结的；
        let backFlag = [1, 3, 5, 7, 9, 11, 13, 15, 17];//根据背面可点区域的顺序总结的；
        switch (this.direction) {
          case "front":
            frontFlag.indexOf(this.currentPindex) === -1 ? this.clickDirection = "right" : this.clickDirection = "left";
            break;
          case "back":
            backFlag.indexOf(this.currentPindex) === -1 ? this.clickDirection = "right" : this.clickDirection = "left";
            break;
          default:
            break;
        }
      },
      //获取左侧还是右侧部位
      leftRightPart() {
        let result = "0";//默认都需要传双侧；
        let frontFlag = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];//根据正面可点区域的顺序总结的；
        let backFlag = [1, 3, 5, 7, 9, 11, 13, 15, 17];//根据背面可点区域的顺序总结的；
        switch (this.direction) {
          case "front":
            if (frontFlag.indexOf(this.currentPindex) === -1) {
              return result + ",2"
            } else {
              return result + ",1"
            }
            break;
          case "back":
            if (backFlag.indexOf(this.currentPindex) === -1) {
              return result + ",1"
            } else {
              return result + ",2"
            }
            break;
          default:
            break;
        }
      },
      selectPartToSecond(index, type) {//抓取二级部位数据
        const that = this;
        that.loading = true;
        let result = "";
        if (type === "show") {
          this.currentPindex = index;
          this.currentHindex = -1;
          result = this.pointList[this.direction][this.currentPindex];
        } else {
          this.currentPindex = -1;
          this.currentHindex = index;
          result = this.hidePoint[this.direction][this.currentHindex];
        }
        that.leftRightClick();
        console.log('select ---> ')
        api.ajax({
          url: XHRList.partList,
          method: "POST",
          data: {
            parentId: result,
            isValid: "1",
            firstResult: "0",
            maxResult: "9999",
            directionId: that.direction === "front" ? "0" : "1",//string方向0-正面1-反面
            positionIdList: that.leftRightPart(),//	string位置0-双侧1-左侧2-右侧
          },
          done(data) {
            console.log('data --> ',)
            that.secondShow = true;
            that.loading = false;
            if (data.responseObject.responseData) {
              let dataList = data.responseObject.responseData.dataList;
              if (dataList && dataList.length !== 0) {
                that.secondList = dataList;
                that.partImg();
              }
            }
          },
          fail(err) {

          }
        })
      },
      partImg() {
        let that = this;
        that.imgArray = [];
        //之后的思路，默认第一个展示
        that.imgArray = ['https://m.allinmed.cn/static/image/img00/patientConsult/' + that.currentType + '/' + that.direction + '/' + that.secondList[0].partId + ".png"];
      },
      ensurePart(index) { //二级部位选取...路由数据驱动症状选择启动加载...
        let that = this;
        that.currentThreeLevel = index;
        that.imgArray = ['https://m.allinmed.cn/static/image/img00/patientConsult/' + that.currentType + '/' + that.direction + '/' + that.secondList[index].partId + ".png"];
      },
      surePart() {
        localStorage.removeItem("PCIMLinks");
        this.setPatientMessage({
          partId: this.secondList[this.currentThreeLevel].partId,
          partName : this.secondList[this.currentThreeLevel].partName,
        });
        dataLog.createTrack({ actionId: 14161 });
        this.$emit("selectPartCb", {
          partId: this.secondList[this.currentThreeLevel].partId,
          partName : this.secondList[this.currentThreeLevel].partName,
          sex: this.currentType
        });
      },
      sexSelect(sexType) {
        this.secondShow = false;
        this.imgArray = [];
        this.currentType = sexType;
        this.bodyImg[sexType][this.direction];
      }
    },
    computed: {
      ...mapGetters(['customerId', 'loading', 'toastContent', 'toastShow','patientMessage']),
      patientBody() {   //反应数据驱动...获取人体性别年龄
        return this.bodyImg[this.currentType][this.direction];
      },
      pointClassObject() {//反应数据驱动...热区点位定位
        let result = "";
        if (this.direction === "front") {
          if (this.patientType() === "man") {
            result = "man-front front"
          } else if (this.patientType() === "woman") {
            result = "woman-front front"
          } else if (this.patientType() === "kid") {
            result = "kid-front front"
          }
        } else if (this.direction === "back") {
          if (this.patientType() === "man") {
            result = "man-back back"
          } else if (this.patientType() === "woman") {
            result = "woman-back back"
          } else if (this.patientType() === "kid") {
            result = "kid-back back"
          }
        }

        return result;
      },
      ladyActive() { return this.currentType == "woman" ? "active" : ""; },
      manActive() { return this.currentType == "man" ? "active" : ""; },
      childActive() { return this.currentType == "kid" ? "active" : ""; },
    },
    components: {
      NormalLoading,
      Toast
    }
  }

</script>
<style lang="scss" rel="stylesheet/scss" scoped>

  .part-choice-box {
    position: absolute;
    top: 128px;
    &.left {
      left: 30px;
    }
    &.right {
      right: 30px;
    }
    .part-box {
      max-width: 214px;
      box-sizing: border-box;
      border: 1px solid #EDF1F4;
      border-radius: 4px;
      background: #FFFFFF;
      .btnBox-btn.on + .btnBox-btn{
        .btn-box:before{
          display: none;
        }
      }
      .btnBox-btn {
        padding: 24px 16px;
        display: block;
        width: 100%;

        font-size: 28px;
        box-sizing:border-box;
        color: #2EA9FE;
        .btn-box{
          padding-right: 38px;
          box-sizing: border-box;
        }
        &.on {
          .btn-box {
            background: url("https://m.allinmed.cn/static/image/mp/consult/selectedPart.png") no-repeat right 12px;
            background-size: 24px 17px;
            &::before {
              display: none !important;
            }
          }
          background: #F6F8FA;
        }
      }
      .btnBox-btn + .btnBox-btn{
        .btn-box {
          position: relative;
          &::before {
            display: block;
            content: "";
            position: absolute;
            width: 100%;
            height: 1px;
            opacity: 0.2;
            margin-top: -24px;
            background: #2EA9FE;
          }
        }
      }
    }
    .part-choice-ensure {
      display: block;
      width: 100%;
      margin-top: 20px;
      height: 72px;
      line-height: 72px;
      text-align: center;
      font-size: 28px;
      background: #2EA9FE;
      border-radius: 8px;
      color: #ffffff;
    }
  }

  .main-inner {
    height: 100%;
    .select-part { background-color: #fff; }
  }
  .fade-enter-active, .fade-leave-active { transition: opacity .5s; }
  .fade-enter, .fade-leave-to { opacity: 0;}
  section.main-inner-content {
    border: none;
    display: block;
    height: 1334px;
    position: relative;
    top: -190px;
    overflow: hidden;
  }
  .full-screen .main-inner-content { top:0px; }

    /*.part-select-title {*/
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 30px;*/
    /*background: #ebebeb;*/
    /*border-top-right-radius: 9999px;*/
    /*border-bottom-right-radius: 9999px;*/
    /*z-index: 9;*/
    /*h3 {*/
      /*padding: 20px 30px;*/
      /*font-size: 32px;*/
      /*color: #666666;*/
      /*font-weight: normal;*/
    /*}*/
  /*}*/

  .body-picture {
    height: 100%;
    &.front {
      background: url("https://m.allinmed.cn/static/image/img00/patientConsult/bg_front.png") no-repeat  center 300px;
      background-size: cover;
    }
    &.back {
      background: url("https://m.allinmed.cn/static/image/img00/patientConsult/bg_behind.png") no-repeat center 300px;
      background-size: cover;
    }
    &-content {
      position:relative;
      border:none;
      height:100%;
      // top:70px;
      & > img {
        position: absolute;
        bottom: 0;
        height: 100%;
        width: 100%;
      }
    }
  }
  .sex-select-box {
    position: absolute;
    bottom:120px;
    left: 20px;
    .sex-box {
      width: 220px;
      margin: 10px;
      li {
        width: 160px;
        height: 60px;
        margin: 24px;
        overflow: hidden;
        button {
          position: absolute;
          // float: left;
          width: 72px;
          height: 72px;
          margin: 0;
          border: 2px solid #DDD;
          border-radius: 50%;
          padding: 2px;
        }
        span {
          position: absolute;
          display: none;
          // float: left;
          left: 120px;
          font-size: 32px;
          line-height: 72px;
          color: #2EA9FE;
        }
        .lady {
          background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/lady.png") no-repeat;
          background-size: 100% 100%;
        }
        .man {
          background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/man.png") no-repeat;
          background-size: 100% 100%;
        }
        .child {
          background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/child.png") no-repeat;
          background-size: 100% 100%;
        }
        &.active {
          button {
            border: 2px solid #2EA9FE;
            box-shadow: 0 0 16px #2EA9FE;
          }
          .lady {
            background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/lady_active.png") no-repeat;
            background-size: 100% 100%;
          }
          .man {
            background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/man_active.png") no-repeat;
            background-size: 100% 100%;
          }
          .child {
            background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/child_active.png") no-repeat;
            background-size: 100% 100%;
          }
          span {
            display: inherit;
          }
        }
      }
    }
  }
  .overturnBox {
    position: absolute;
    right: 80px;
    bottom: 140px;
    &.isIPad {
      right: 40px;
      bottom: 40px;
    }
    .body-picture-overturn {
      display: block;
      width: 72px;
      height: 72px;
      margin: 0 auto;
      border-radius: 50%;
      // background: url("https://m.allinmed.cn/static/image/img00/findDoctor/turn.png") no-repeat;
      background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/turn.png") no-repeat;
      background-size: 100% 100%;
      &:active{
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/turn_click.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    .overturnText {
      display: block;
      letter-spacing: 0;
      margin-top: 12px;
      font-size: 26px;
      color: #555555;
    }
  }

  .pain-point-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .pain-point, .hide-point {
    @include circle(80px, transparent);
    /*background-color: red;*/
    position: absolute;
    -webkit-appearance: none;

  }

  //男 正面
  .man-front {
    .body-picture-content { width: 100%; }
    .pain-point {
      &.on {
        background: transparent url("https://m.allinmed.cn/static/image/img00/patientConsult/body_activation@2x.png") no-repeat;
        background-size: contain;
      }
      &:nth-child(1) {
        left: 225px;
        bottom: 840px;
      }
      &:nth-child(2) {
        right: 225px;
        bottom: 840px;
      }
      &:nth-child(3) {
        left: 205px;
        bottom:772px;
        width:75px;
        height:75px;
      }
      &:nth-child(4) {
        right: 205px;
        bottom:772px;
        width:75px;
        height:75px;
      }
      &:nth-child(5) {
        left: 190px;
        width:60px;
        height:60px;
        bottom:719px;
      }
      &:nth-child(6) {
        right: 190px;
        width:60px;
        height:60px;
        bottom:719px;
      }
      &:nth-child(7) {
        left: 155px;
        bottom:645px;
      }
      &:nth-child(8) {
        right: 155px;
        bottom:645px;
      }
      &:nth-child(9) {
        left: 99px;
        width:110px;
        height:118px;
        bottom:531px;

      }
      &:nth-child(10) {
        right: 99px;
        width:110px;
        height:118px;
        bottom:531px;
      }
      &:nth-child(11) {
        left: 285px;
        height: 142px;
        bottom: 427px;
      }
      &:nth-child(12) {
        right: 285px;
        height: 142px;
        bottom: 427px;
      }
      &:nth-child(13) {
        left: 285px;
        bottom: 345px;
      }
      &:nth-child(14) {
        right: 285px;
        bottom: 345px;
      }
      &:nth-child(15) {
        left: 285px;
        height:171px;
        bottom:173px;
      }
      &:nth-child(16) {
        right: 285px;
        height:171px;
        bottom:173px;
      }
      &:nth-child(17) {
        left: 265px;
        bottom:81px;
        width:90px;
        height:90px;
      }
      &:nth-child(18) {
        right: 265px;
        bottom:81px;
        width:90px;
        height:90px;
      }
      &:nth-child(19) {
        left: 266px;
        bottom:568px;
        width:70px;
        height:70px;
      }
      &:nth-child(20) {
        right: 266px;
        bottom:568px;
        width:70px;
        height:70px;
      }
      &:nth-child(21) {
        left: 50%;
        margin-left: -40px;
        bottom: 600px;
      }
      &:nth-child(22) {
        left: 50%;
        margin-left: -55px;
        bottom:894px;
        width:110px;
      }
      &:nth-child(23) {
        left: 50%;
        margin-left: -75px;
        bottom: 682px;
        width: 150px;
        height: 201px;
      }
    }
  }

  //男 反面
  .man-back {
    .body-picture-content {
      width: 100%;
    }
    .pain-point {
      &.on {
        background: transparent url("https://m.allinmed.cn/static/image/img00/patientConsult/body_activation@2x.png") no-repeat;
        background-size: contain;
      }
      &:nth-child(1) {
        left: 225px;
        bottom: 840px;
      }
      &:nth-child(2) {
        right: 225px;
        bottom: 840px;
      }
      &:nth-child(3) {
        left: 205px;
        bottom:772px;
        width:75px;
        height:75px;
      }
      &:nth-child(4) {
        right: 205px;
        bottom:772px;
        width:75px;
        height:75px;
      }
      &:nth-child(5) {
        left: 190px;
        width:60px;
        height:60px;
        bottom:719px;
      }
      &:nth-child(6) {
        right: 190px;
        width:60px;
        height:60px;
        bottom:719px;
      }
      &:nth-child(7) {
        left: 155px;
        bottom:645px;
      }
      &:nth-child(8) {
        right: 155px;
        bottom:645px;
      }
      &:nth-child(9) {
        left: 99px;
        width:110px;
        height:118px;
        bottom:531px;

      }
      &:nth-child(10) {
        right: 99px;
        width:110px;
        height:118px;
        bottom:531px;
      }
      &:nth-child(11) {
        left: 285px;
        height:117px;
        bottom:427px;
      }
      &:nth-child(12) {
        right: 285px;
        height:117px;
        bottom:427px;
      }
      &:nth-child(13) {
        left: 285px;
        bottom: 343px;
      }
      &:nth-child(14) {
        right: 285px;
        bottom: 343px;
      }
      &:nth-child(15) {
        left: 285px;
        height: 168px;
        bottom:170px;

      }
      &:nth-child(16) {
        right: 285px;
        height: 168px;
        bottom:170px;

      }
      &:nth-child(17) {
        left: 277px;
        bottom:83px;
        width:85px;
        height:85px;
      }
      &:nth-child(18) {
        right: 277px;
        bottom:83px;
        width:85px;
        height:85px;
      }
      &:nth-child(19) {
        left: 50%;
        margin-left: -40px;
        bottom: 935px;
      }
      &:nth-child(20) {
        left: 50%;
        margin-left: -75px;
        bottom: 732px;
        width:150px;
        height:109px;

      }
      &:nth-child(21) {
        left: 50%;
        margin-left: -75px;
        bottom: 664px;
        width:150px;
        height:65px;
      }
      &:nth-child(22) {
        left: 50%;
        margin-left:-85px;
        bottom:539px;
        width:170px;
        height:126px;
      }
      &:nth-child(23) {
        left: 50%;
        margin-left: -75px;
        bottom: 842px;
        width:150px;
        height:90px;
      }
    }
  }

  //女正面
  .woman-front {
    .body-picture-content { width: 100%; }
    .pain-point {
      &.on {
        background: transparent url("https://m.allinmed.cn/static/image/img00/patientConsult/body_activation@2x.png") no-repeat;
        background-size: contain;
      }
      &:nth-child(1) {
        left: 240px;
        bottom: 847.5px;
      }
      &:nth-child(2) {
        right: 240px;
        bottom: 847.5px;
      }
      &:nth-child(3) {
        left: 225px;
        bottom: 780px;
      }
      &:nth-child(4) {
        right: 225px;
        bottom: 780px;
      }
      &:nth-child(5) {
        left: 202px;
        width: 70px;
        height: 70px;
        bottom: 725px;
      }
      &:nth-child(6) {
        right: 202px;
        width: 70px;
        height: 70px;
        bottom: 725px;
      }
      &:nth-child(7) {
        left: 172px;
        height: 95px;
        bottom: 635px;
      }
      &:nth-child(8) {
        right: 172px;
        height: 95px;
        bottom: 635px;
      }
      &:nth-child(9) {
        left: 120px;
        width: 115px;
        height: 115px;
        bottom: 520px;
      }
      &:nth-child(10) {
        right: 120px;
        width: 115px;
        height: 115px;
        bottom: 520px;
      }
      &:nth-child(11) {
        left: 285px;
        height: 155px;
        bottom:408px;

      }
      &:nth-child(12) {
        right: 285px;
        height: 155px;
        bottom:408px;

      }
      &:nth-child(13) {
        left:292px;
        bottom:337px;
        width:70px;
        height:70px;

      }
      &:nth-child(14) {
        right:292px;
        bottom:337px;
        width:70px;
        height:70px;

      }
      &:nth-child(15) {
        left: 292.5px;
        height: 165px;
        bottom: 172.5px;
      }
      &:nth-child(16) {
        right: 292.5px;
        height: 165px;
        bottom: 172.5px;
      }
      &:nth-child(17) {
        left: 275px;
        bottom:71px;
        width:100px;
        height:100px;

      }
      &:nth-child(18) {
        right: 275px;
        bottom:71px;
        width:100px;
        height:100px;

      }
      &:nth-child(19) {
        left: 265px;
        bottom: 562px;
        width:60px;
        height:60px;

      }
      &:nth-child(20) {
        right: 265px;
        bottom: 562px;
        width:60px;
        height:60px;

      }
      &:nth-child(21) {
        left: 50%;
        margin-left:-65px;
        bottom:590px;
        width:130px;
        height:100px;

      }
      &:nth-child(22) {
        left: 50%;
        margin-left:-75px;
        bottom:900px;
        width:150px;

      }
      &:nth-child(23) {
        left: 50%;
        margin-left: -67.5px;
        bottom:695px;
        width:135px;
        height:205px;
      }
    }
  }

  //女 反面
  .woman-back {
    .body-picture-content { width: 100%; }
    .pain-point {
      &.on {
        background: transparent url("https://m.allinmed.cn/static/image/img00/patientConsult/body_activation@2x.png") no-repeat;
        background-size: contain;
      }
      &:nth-child(1) {
        left: 240px;
        bottom: 847.5px;
      }
      &:nth-child(2) {
        right: 240px;
        bottom: 847.5px;
      }
      &:nth-child(3) {
        left: 225px;
        bottom: 780px;
      }
      &:nth-child(4) {
        right: 225px;
        bottom: 780px;
      }
      &:nth-child(5) {
        left: 202px;
        width: 70px;
        height: 70px;
        bottom: 725px;
      }
      &:nth-child(6) {
        right: 202px;
        width: 70px;
        height: 70px;
        bottom: 725px;
      }
      &:nth-child(7) {
        left: 172px;
        height: 95px;
        bottom: 635px;
      }
      &:nth-child(8) {
        right: 172px;
        height: 95px;
        bottom: 635px;
      }
      &:nth-child(9) {
        left: 120px;
        width: 115px;
        height: 115px;
        bottom: 520px;
      }
      &:nth-child(10) {
        right: 120px;
        width: 115px;
        height: 115px;
        bottom: 520px;
      }
      &:nth-child(11) {
        left: 285px;
        height: 145px;
        bottom: 412.5px;
      }
      &:nth-child(12) {
        right: 285px;
        height: 145px;
        bottom: 412.5px;
      }
      &:nth-child(13) {
        left: 292px;
        bottom:335px;

      }
      &:nth-child(14) {
        right: 292px;
        bottom:335px;
      }
      &:nth-child(15) {
        left: 293px;
        height:150px;
        bottom:180.5px;
      }
      &:nth-child(16) {
        right:293px;
        height:150px;
        bottom:180.5px;
      }
      &:nth-child(17) {
        left: 295px;
        bottom: 100px;
      }
      &:nth-child(18) {
        right: 295px;
        bottom: 100px;
      }
      &:nth-child(19) {
        left: 50%;
        margin-left: -40px;
        bottom: 928px;
      }
      &:nth-child(20) {
        left: 50%;
        margin-left: -75px;
        bottom:720px;
        width:150px;
        height:125px;
      }
      &:nth-child(21) {
        left: 50%;
        margin-left: -75px;
        bottom: 671px;;
        width: 150px;
        height: 50px;
      }
      &:nth-child(22) {
        left: 50%;
        margin-left: -95px;
        bottom:555px;
        width:190px;
        height:120px;
      }
      &:nth-child(23) {
        left: 50%;
        margin-left: -67.5px;
        bottom: 847px;
        width: 135px;
      }
    }
  }

  //儿童 正面
  .kid-front {
    .body-picture-content { width: 100%; }
    .pain-point {
      height: 60px;
      &.on {
        background: transparent url("https://m.allinmed.cn/static/image/img00/patientConsult/body_activation@2x.png") no-repeat;
        background-size: contain;
      }
      &:nth-child(1) {
        left: 232.5px;
        bottom: 705px;
      }
      &:nth-child(2) {
        right: 232.5px;
        bottom: 705px;
      }
      &:nth-child(3) {
        left: 210px;
        bottom: 645px;
      }
      &:nth-child(4) {
        right: 217.5px;
        bottom: 645px;
      }
      &:nth-child(5) {
        left: 195px;
        bottom: 595px;
        height:55px;
      }
      &:nth-child(6) {
        right: 195px;
        bottom: 595px;
        height:55px;
      }
      &:nth-child(7) {
        left: 172.5px;
        bottom: 532.5px;
      }
      &:nth-child(8) {
        right: 172.5px;
        bottom: 532.5px;
      }
      &:nth-child(9) {
        left: 127px;
        width:105px;
        height:126px;
        bottom:413px;
      }
      &:nth-child(10) {
        right: 127px;
        width:105px;
        height:126px;
        bottom:413px;
      }
      &:nth-child(11) {
        left: 253px;
        width:112px;
        height:95px;
        bottom:360px;
      }
      &:nth-child(12) {
        right: 253px;
        width:112px;
        height:95px;
        bottom:360px;
      }
      &:nth-child(13) {
        left: 247px;
        width:110px;
        bottom:306px;
      }
      &:nth-child(14) {
        right: 247px;
        width:110px;
        bottom:306px;
      }
      &:nth-child(15) {
        left: 255px;
        height: 79px;
        bottom:224px;
      }
      &:nth-child(16) {
        right: 255px;
        height: 79px;
        bottom:224px
      }
      &:nth-child(17) {
        left: 200px;
        width:120px;
        height:93px;
        bottom:132px;
      }
      &:nth-child(18) {
        right: 200px;
        width:120px;
        height:93px;
        bottom:132px;
      }
      &:nth-child(19) {
        left: 253px;
        bottom:455px;
      }
      &:nth-child(20) {
        right: 253px;
        bottom:455px;
      }
      &:nth-child(21) {
        left: 50%;
        margin-left: -75px;
        width:150px;
        bottom:493px;
      }
      &:nth-child(22) {
        left: 50%;
        margin-left: -80px;
        bottom:750px;
        width:160px;
      }
      &:nth-child(23) {
        left: 50%;
        margin-left: -75px;
        bottom: 558px;
        width:150px;
        height:191px;
      }
    }
  }

  //儿童 反面
  .kid-back {
    .body-picture-content { width: 100%; }
    .pain-point {
      height: 60px;
      &.on {
        background: transparent url("https://m.allinmed.cn/static/image/img00/patientConsult/body_activation@2x.png") no-repeat;
        background-size: contain;
      }
      &:nth-child(1) {
        left: 224px;
        bottom: 705px;
      }
      &:nth-child(2) {
        right: 224px;
        bottom: 705px;
      }
      &:nth-child(3) {
        left: 210px;
        bottom: 645px;
      }
      &:nth-child(4) {
        right: 217.5px;
        bottom: 645px;
      }
      &:nth-child(5) {
        left: 195px;
        bottom: 595px;
        height:55px;
      }
      &:nth-child(6) {
        right: 195px;
        bottom: 595px;
        height:55px;
      }
      &:nth-child(7) {
        left: 172.5px;
        bottom: 532.5px;
      }
      &:nth-child(8) {
        right: 172.5px;
        bottom: 532.5px;
      }
      &:nth-child(9) {
        left: 127px;
        width:105px;
        height:126px;
        bottom:413px;
      }
      &:nth-child(10) {
        right: 127px;
        width:105px;
        height:126px;
        bottom:413px;
      }
      &:nth-child(11) {
        left: 253px;
        width:112px;
        height:95px;
        bottom:360px;
      }
      &:nth-child(12) {
        right: 253px;
        width:112px;
        height:95px;
        bottom:360px;
      }
      &:nth-child(13) {
        left: 247px;
        width:110px;
        bottom:306px;
      }
      &:nth-child(14) {
        right: 247px;
        width:110px;
        bottom:306px;
      }
      &:nth-child(15) {
        left: 255px;
        height: 79px;
        bottom:224px;
      }
      &:nth-child(16) {
        right: 255px;
        height: 79px;
        bottom:224px
      }
      &:nth-child(17) {
        left: 200px;
        width:120px;
        height:93px;
        bottom:132px;
      }
      &:nth-child(18) {
        right: 200px;
        width:120px;
        height:93px;
        bottom:132px;
      }
      &:nth-child(19) {
        left: 50%;
        margin-left: -40px;
        height: 60px;
        bottom: 772.5px;
      }
      &:nth-child(20) {
        left: 50%;
        margin-left: -75px;
        bottom: 585px;
        width: 150px;
        height: 105px;
      }
      &:nth-child(21) {
        left: 50%;
        margin-left: -90px;
        bottom: 525px;
        width: 180px;
        height: 60px;
      }
      &:nth-child(22) {
        left: 50%;
        margin-left: -105px;
        bottom: 450px;
        width: 210px;
        height: 82.5px;
      }
      &:nth-child(23) {
        left: 50%;
        margin-left: -67.5px;
        bottom: 690px;
        width: 135px;
        height: 85px;
      }
    }
  }

</style>
