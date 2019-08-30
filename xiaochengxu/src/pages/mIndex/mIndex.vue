<template>
  <section class="mHome">
    <section class="Home">
      <!--<div v-show="finish">-->
      <!--<NormalLoading></NormalLoading>-->
      <!--</div>-->
      <section class="searchDocOut">
        <section class="searchDoc" @click="goIndexSearch">搜索医生、康复日记</section>
      </section>
      <!-- 预约挂号 -->
      <button class="registered" open-type="getUserInfo" @getuserinfo="goDepartment">
        <img src="https://m1.allinmed.cn/static/image/mp/index/1.5.0/order_door.png">
      </button>
      <section class="indexBox">
        <button class="halfPart1" open-type="getUserInfo" @getuserinfo="Searchdoctor"><img
          src="https://m1.allinmed.cn/static/image/mp/index/1.5.0/index_found_doctor.png"></button>
        <button class="halfPart2" open-type="getUserInfo" @getuserinfo="goConsult"><img
          src="https://m1.allinmed.cn/static/image/mp/index/1.5.0/index_quick_visits.png"></button>
      </section>
      <!--常见疾病模块V1.1.4版本取消-->
      <!--<section class="quickSearch">-->
        <!--<h1>常见疾病</h1>-->
        <!--<button class="quickSearchItem" v-for="(item,index) in quickSearchList" :key="index" open-type="getUserInfo"-->
                <!--@getuserinfo="goSearchdoctor" @click="getTransferParam(item)">{{item}}-->
        <!--</button>-->
      <!--</section>-->
      <section class="AIminiProgram" v-if="AIminiProgramStatus" @click="jumpToMini()">
        <img src="https://m.allinmed.cn/static/image/mp/index/bannerNew.jpg" alt="">
        <MiniProgram :propClass="'AIminiProgram-item'" :miniProgramParam='miniParams'></MiniProgram>
      </section>
      <!-- 健康卡 因需求暂停 -->
      <section class="health-card" v-if="isCoverCity&&!hasCard" @click="goToHealthCard()">
      </section>
      <section class="middle-box"></section>
      <figure class="history">
        <header>
          <form action="" @submit="formSubmit" report-submit="true">
            <h3 class="journalTitle">康复日记</h3>
            <button class="addJournal" open-type="getUserInfo" type="submit" formType="submit" @getuserinfo="goPersonal">
              <img class="addIcon" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/write.png">
              <span class="addText">我也要写</span>
            </button>
          </form>
        </header>
        <ul class="journalClassifyList">
          <li class="journalClassifyItem"
              :class="{selected: partSelected == -1}"
              @click="partSelectedFun(-1)">
            全部
          </li>
          <li class="journalClassifyItem"
              :class="{selected: partSelected == index}"
              @click="partSelectedFun(index)"
              v-for="(item, index) in partList"
              :key="index">
            {{item.propertyName}}
          </li>
        </ul>
        <recureJournal :journalData="recureJournalList" @FromChild="jumpToDiary"
                       @clickCallback="rjTrack"></recureJournal>
        <section class="extraLine" v-show="recureJournalList.length>0">{{toBottom?'正在加载..':'--到底了--'}}</section>
      </figure>

      <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
      <BlackList></BlackList>
    </section>
    <customizedTabbar :selected=1 @FromChild="jumpToUrl" @goToMessage="jumpToMessage" :checkedPhone="mobileOnOff"></customizedTabbar>
    <authorization></authorization>
  </section>
</template>
<script type="text/ecmascript-6">
  import NormalLoading from "components/loading";
  import ensureConfirm from "components/ensure";
  import authorization from "components/authorization/authorization";
  import MiniProgram from "components/miniProgram";
  import api from "common/js/util/util";
  import recureJournal from "components/recureJournal";
  import miniLogin from "common/js/miniUtil/miniLogin";
  import customizedTabbar from "components/customizedTabbar";
  import getRecureJournal from "common/js/HttpRequest/getRecureJournal";
  import getPartList from "common/js/HttpRequest/getPartList";
  import getAIStatus from "common/js/HttpRequest/toolbarConfig";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import getPhoneAuthorization from 'common/js/miniUtil/GetPhoneAuthorization';
  import dataLog from "dataLog";
  import localStorage from "localStorage";
  import getHealthCardList from "common/js/HttpRequest/getHealthCardList";
  import BlackList from "components/BlackList";
  import {mapGetters} from 'vuex';
  export default {
    data() {
      let mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      return {
        toBottom: true,//判断显示加载中还是加载完毕
        selected: 1,//用于给定tabbar的样式
        page: 0,
        loadMoreFlag: true,//避免重复多次触底加载
        quickSearch: '',
        clickLimit: true,
        ensureShow: false,
        journalList: [],
        mobileOnOff:mobileOnOff,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
        finish: false,
        indicatorDots: true,
        recureJournalList: [],
        pathObj: {},
        // quickSearchList: [],
        clickFlag: true,
        AIminiProgramStatus:false,
        miniParams:{
          name:'AIReadCard',
          path:'',
          extraData:{
            a:'1',
            b:'2',
            c:'3'
          }
        },
        partList:[], // 部位列表
        partSelected: -1, // 部位选中列表
        partIdIn:'',
        isCoverCity:false,  // 定位 默认不在范围内
        hasCard:true,   // 有健康卡
      };
    },
    watch:{
      partSelected : function(newVal,oldVal){
        this.partIdIn = newVal == -1 ? '' : this.partList[newVal].propertyId;
        this.page = 0;
        this.loadMoreFlag = true;
        this.getRecureJournal();
      },
      userInfoEnd(newVal,oldVal){
        console.log(newVal);
        console.log('获取到信息');
        let _this = this;
        _this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      }
    },
    onPullDownRefresh() {
      this.getRecureJournal();
    },
    onReachBottom() {
      this.loadMore();
    },
    //转发事件
    onShareAppMessage(res) {
      if (res.from === 'button') {
        console.log(res.target)
      }
      let _path = `/pages/mIndex/mIndex?from=share`;
      let _sharTitle = `唯医骨科 | 找骨科三甲名医>>骨科问题 就问唯医`;
      return {
        title: _sharTitle,
        path: _path
      }
    },
    computed:{
      ...mapGetters(['userInfoEnd'])
    },
    components: {
      NormalLoading,
      recureJournal,
      ensureConfirm,
      miniLogin,
      customizedTabbar,
      MiniProgram,
      BlackList,
      authorization
    },
    methods: {
      // 获取健康卡列表
      getHealthCardList(){
        let _this = this;
        getHealthCardList({

        }).then((res)=>{
          console.log(res)
          if (res) {
            // 账号下有健康卡
            _this.hasCard = true;
          } else {
            // 账号下无健康卡
            _this.hasCard = false;
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      // 首页的跳转初始化
      navigateInit (option) {
        // console.log(option);
        if (option.from === 'shareFriend') {
          let result=[];
          for (let i in option){
            if (i !== 'from' && i !== 'path')
            result.push(`${i}=${option[i]}`);
          }
          let navigatePath = option['path'] + (result.length? `?${result.join("&")}` : '');
          wx.navigateTo({
            url: navigatePath
          });
          console.log('navigatePath:' + navigatePath)
        }
      },
      // 获取部位列表
      getPartFun () {
        getPartList({
          isValid:1,	//string	是	是否有效		1
          firstResult:0,	//string	是	分页参数		0
          maxResult:100,	//string	是	分页参数		100
          propertyTypeId:16,
        }).then( res => {
          if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            this.partList = res.responseObject.responseData.dataList;
            console.log(this.partList);
          } else {
            console.log('获取部位列表失败');
          }
        })
      },
      // 部位切换
      partSelectedFun (index) {
        this.partSelected = index;
      },
      getTransferParam(item) {
        this.quickSearch = item
      },
      // HotWordResource() {
      //   getHotWord({
      //     flag: 1
      //   }).then(data => {
      //     let dataList = data.responseObject.responseData.dataList;
      //     this.quickSearchList = dataList.split(",");
      //   })
      // },
      rjTrack(obj) {
        dataLog.createTrack({
          actionId: 14124,
          pushMessageId: obj.item.diaryId,
          keyword: obj.item.diaryName
        });
      },
      // 跳转小程序埋点
      jumpToMini () {
        dataLog.createTrack({
          actionId: 14198,
        });
      },
      loadMore() {
        if (this.loadMoreFlag) {
          this.finish = true;
          let result = this.page += 1;
          getRecureJournal({
            isValid:1,
            sortType: 2,
            visitSiteId: api.getSiteId(),
            firstResult: result * 20,
            maxResult: 20,
            imgUseFlag:2,
            partIdIn:this.partIdIn,
          }).then((res) => {
            if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
              let dataList = res.responseObject.responseData.dataList;
              // dataList.forEach(element => {
              //   this.recureJournalList.push(element)
              // })
              this.finish = false;
              this.recureJournalList = this.recureJournalList.concat(dataList);
            } else {
              this.finish = false;
              this.toBottom = false;
              this.loadMoreFlag = false;
            }

          })
        }
      },
      getRecureJournal() {
        wx.showLoading({
          title: "正在加载..."
        });
        getRecureJournal({
          isValid: 1,
          sortType: 5,
          visitSiteId: api.getSiteId(),
          firstResult: 0,
          maxResult: 20 * (this.page + 1),
          imgUseFlag:2,
          partIdIn:this.partIdIn,
        }).then((res) => {
          wx.stopPullDownRefresh();
          if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            let dataList = res.responseObject.responseData.dataList;
            this.recureJournalList = dataList;
            wx.hideLoading();
          } else {
            this.loadMoreFlag = false;
            wx.hideLoading();
          }
        })
      },
      jumpToDiary(e) {
        if (!this.clickFlag) return false;
        this.clickFlag = false;
        this.pathObj = {
          path: "diary",
          obj: e.obj
        };
        if (e.desc) {
          this.ensureShow = false;
          this.clickFlag = true;
          wx.navigateTo({
            url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId+"&from=home"
          });
          // miniLogin({
          //   successCallBack: (res) => {
          //   },
          //   failCallBack: (err) => {
          //   }
          // });
        } else {
          this.clickFlag = true;
          this.ensureShow = true;
        }
      },
      //健康卡领取
      goToHealthCard(){
        let _this = this;
        if (true) {
          wx.navigateTo({
            url:`/packageD/healthCard/healthCardRecognition?from=mIndex`
          })
        } else {
          // 去登陆 from == 3 (待修改)
          wx.navigateTo({
            url: '/pages/login/login?from=3&needSession=1'
          });
        }
      },
      //写日记跳转到个人中心
      goPersonal(e){
        this.pathObj = {
          path: "personal",
          obj: ""
        };
        if (!this.clickLimit) return;
        if (e.target.userInfo) {
          wx.redirectTo({
            url: '/pages/personal/personal'
          });
          miniLogin({
            successCallBack: (res) => {
            },
            failCallBack: (res) => {
              this.finish = true;
              setTimeout(() => {
                this.finish = false
              }, 2000)
            }
          });
        } else {
          this.ensureShow = true;
        }
      },
      //跳转到我的医生列表
      jumpToMessage(e) {
        if (e.desc) {
          wx.redirectTo({
            url: '/pages/myConsult/myConsult'
          });
          miniLogin({
            successCallBack: (res) => {
            },
            failCallBack: (res) => {
              this.finish = true;
              setTimeout(() => {
                this.finish = false
              }, 2000)
            }
          });
        } else {
          this.ensureShow = true;
        }
      },
      //跳转到个人中心
      jumpToUrl(e) {
        if (e.desc) {
          wx.redirectTo({
            url: '/pages/personal/personal'
          });
          miniLogin({
            successCallBack: (res) => {
            },
            failCallBack: (res) => {
              this.finish = true;
              setTimeout(() => {
                this.finish = false
              }, 2000)
            }
          });
        } else {
          this.ensureShow = true;
        }
      },
      //找医生流程
      Searchdoctor(e) {
        this.pathObj = {
          path: "findDoctor",
          obj: {}
        };
        if (this.clickLimit) {
          this.clickLimit = false;
          dataLog.createTrack({
            actionId: 14122,
          });
          if (e.target.userInfo) {
            this.ensureShow = false;
            wx.navigateTo({
              url: '/pages/doctorList/doctorList'
            });
            miniLogin({
              successCallBack: (res) => {

              },
              failCallBack: (res) => {

              }
            });
          } else {
            this.ensureShow = true;
          }
        }
      },
      //快速搜索
      goSearchdoctor(e) {
        this.pathObj = {
          path: "searchDoctor",
          obj: this.quickSearch
        };
        if (this.clickLimit) {
          dataLog.createTrack({
            actionId: 14123,
            pushMessageId: this.quickSearch
          });
          this.clickLimit = false;
          if (e.target.userInfo) {
            this.ensureShow = false;
            wx.navigateTo({
              url: '/pages/indexSearch/indexSearch?activeType=2&searchItem=' + this.quickSearch
            });
            miniLogin({
              successCallBack: (res) => {
              }
            });
          } else {
            this.ensureShow = true;
          }
        }

      },
      //首页搜索
      goIndexSearch() {
        dataLog.createTrack({
          actionId: 14137,
        });
        wx.navigateTo({
          url: "/pages/indexHistory/indexHistory"
        });
      },
      //轻咨询流程
      goConsult(e) {

        this.pathObj = {
          path: "consult",
          obj: ""
        };
        if (this.clickLimit) {
          this.clickLimit = false;
          dataLog.createTrack({
            actionId: 14121,
          });
          if (e.target.userInfo) {
            this.ensureShow = false;
            wx.navigateTo({
              url: '/packageB/consultIntro/consultIntro'
            });
            miniLogin({
              successCallBack: (res) => {

              }
            });
          } else {
            this.ensureShow = true;
          }
        }

      },
      goToSetting(e) {
        if (e.mp.detail.authSetting.scoped.userInfo) {
          this.ensureShow = false;
          switch (this.pathObj.path) {
            case "consult":
              wx.navigateTo({
                url: '/packageB/consultIntro/consultIntro'
              });
              break;
            case "findDoctor":
              wx.navigateTo({
                url: '/pages/doctorList/doctorList'
              });
              break;
            case "diary":
              wx.navigateTo({
                url: "/packageF/journalDetail/journalDetail?resourceId=" + this.pathObj.obj.diaryId + "&authorCustomerId=" + this.pathObj.obj.authorId + "&doctorCustomerId=" + this.pathObj.obj.attendCustomerId + "&from=home"
              });
              break;
            case "searchDoctor":
              wx.navigateTo({
                url: '/pages/indexSearch/indexSearch?activeType=2&searchItem=' + this.pathObj.path.obj
              });
            case "personal":
              wx.redirectTo({
                url: '/pages/personal/personal'
              });
              break;
          }
          miniLogin({
            successCallBack: (res) => {
            }
          });
        } else {
          this.ensureShow = true;
        }
      },
      AIReadCardShow(){
        let _this = this;
        getAIStatus().then((res)=>{
          // console.log(res)
          if (res.responseObject.responseData) {
            let dataList = res.responseObject.responseData.dataList;
            if (dataList) {
              dataList.forEach((element, index) => {
                if (element.state == 1) {
                  switch (parseInt(element.toolType)) {
                    case 10:
                      _this.AIminiProgramStatus = true;
                      break;
                  }
                }else{
                  switch (parseInt(element.toolType)) {
                    case 10:
                      _this.AIminiProgramStatus = false;
                      break;
                  }
                }
              });
            }
          }else{
            _this.AIminiProgramStatus = false
          }
        }).catch((err)=>{
          console.log(err)
          _this.AIminiProgramStatus = false
        })
      },
      // 预约挂号
      goDepartment (e) {
        console.log(1)
        this.pathObj = {
          path: "department",
          obj: ""
        };
        if (this.clickLimit) {
          this.clickLimit = false;
          dataLog.createTrack({
            actionId: 14241,
          });
          if (e.target.userInfo) {
            this.ensureShow = false;
            wx.navigateTo({
              url: '/packageD/registration/orderDepartment'
            });
            miniLogin({
              successCallBack: (res) => {

              }
            });
          } else {
            this.ensureShow = true;
          }
        }
      }
    },
    mounted() {

    },
    onHide() {
      dataLog.leaveBrowse();
    },
    onUnload() {
    },
    onLoad (option) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      this.recureJournalList=[];
      wx.removeStorageSync("backIndex");
      this.getRecureJournal();
      this.getPartFun();
      // this.HotWordResource();
      this.AIReadCardShow();
      this.navigateInit(option);
      this.clickLimit = true;
      wx.onNetworkStatusChange((res) => {
        this.finish = false;
        if (res && !!res.isConnected) {
          // this.HotWordResource();
          // this.getRecureJournal();
        } else {
          wx.showToast({
            title: "网络中断，请检查您的网络状态",
            icon: "none",
            duration: 2000,
            mask: true,
          });
        }
      });
    },
    onShow() {
      console.log('index=====', localStorage.getItem('mobile'));

      let _this = this;
      wx.setNavigationBarTitle({
        title: '唯医骨科',
      });
      this.finish = false;
      this.ensureShow = false;
      this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      if (localStorage.getItem("bindFinish") && localStorage.getItem("cacheObj")) {
        const obj = JSON.parse(localStorage.getItem("cacheObj"));
        wx.navigateTo({
          url: "/packageF/journalDetail/journalDetail?rId=" + obj.diaryId + "&acId=" + obj.authorId + "&from=home"
        });
        localStorage.removeItem("cacheObj");
        localStorage.removeItem("bindFinish");
      }
      localStorage.removeItem("PCIMLinks");
      localStorage.removeItem("patientInfo");

      // 清除医生主页、患教手册、患教详情页的缓存；
      localStorage.removeItem("patientInfo");
      localStorage.removeItem("patientInfo");
      localStorage.removeItem("patientInfo");

      this.quickSearch = '';
      dataLog.enterBrowse();
      this.clickLimit = true;
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          const location = {
            latitude: res ? res.latitude : "", //经度
            longitude: res ? res.longitude : "", //纬度
            speed: res ? res.speed : "" //移动速度
          };
          localStorage.setItem("location", JSON.stringify(location));
        },
        fail: (err) => {
          console.log("用户拒绝授权，无法获取位置信息");
        }
      });
      api
      .getLocationCity({
        name: "北京市"
      })
      .then(res => {
        console.log(res);
        if ((!res.isfail&&res.isCover)) {
          // 定位城市在 所属范围
          _this.isCoverCity = true;  // 定位城市
          // _this.getHealthCardList(); // 获取健康卡列表
        }
      });
    },

  };
</script>
<style lang="scss" rel="stylesheet/scss">
  .indexBox {
    width: 100%;
    /*height: 241px;*/
    margin: 32px 0 56px;
    @include clearfix();
    .halfPart1 {
      float: left;
      width: 334px;
      height: 300px;
      padding: 0;
      margin-left: 30px;
      // background:linear-gradient(315deg,rgba(84,129,252,1) 0%,rgba(61,110,245,1) 100%);
      // box-shadow:0px 12px 32px 0px rgba(99,139,224,0.3);
      background:linear-gradient(315deg,rgba(192,233,255,1) 0%,rgba(113,166,245,1) 100%);
      box-shadow:0px 10px 20px 0px rgba(145,185,248,0.3);
      border-radius:8px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .halfPart2 {
      float: right;
      width: 334px;
      height: 300px;
      padding: 0;
      margin-right: 30px;
      // background:linear-gradient(314deg,rgba(255,189,35,1) 0%,rgba(255,150,13,1) 100%);
      // box-shadow:0px 12px 30px 0px rgba(219,162,77,0.34);
      background:linear-gradient(314deg,rgba(253,213,187,1) 0%,rgba(244,118,137,1) 100%);
      box-shadow:0px 10px 20px 0px rgba(193,116,127,0.3);
      border-radius:8px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .registered {
    width: 690px;
    height: 200px;
    margin: 32px 30px;
    margin-bottom: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    background-color: #fff;
    border: 2px solid rgb(246, 246, 247);
    box-shadow: 0 6px 20px rgba(7, 113, 170, 0.11);
    img {
      width: 690px;
      height: 200px;
    }
  }
  .quickSearch {
    margin: 0 30px 50px;
    h1 {
      font-size: 30px;
      color: #777777;
      letter-spacing: 0;
      line-height: 30px;
      margin-bottom: 40px;
      &:before {
        display: inline-block;
        content: "";
        width: 4px;
        height: 26px;
        margin-right: 10px;
        background: #02B5AC;
        border-radius: 100px;
        vertical-align: -2px;
      }
    }
    .quickSearchItem {
      font-size: 28px;
      color: #02B5AC;
      line-height: 56px;
      border: 1px solid rgba(2, 181, 172, 0.6);
      display: inline-block;
      background: #ffffff;
      border-radius: 4px;
      margin-right: 24px;
      margin-bottom: 18px;
      padding: 0 20px;
    }
  }

  .mHome {
    background-color: #ffffff;
  }

  .searchDocOut {
    padding: 10px 30px;
    margin-top: -2px;
    // border: 1px solid red;
  }

  .searchDoc {
    height: 76px;
    line-height: 76px;
    background: #F6F6F6;
    border-radius: 8px;
    font-size: 28px;
    color: #999999;
    box-sizing: border-box;
    &:before {
      width: 38px;
      height: 38px;
      display: inline-block;
      margin-left: 20px;
      content: "";
      margin-right: 8px;
      margin-top: -5px;
      // background: url("https://m.allinmed.cn/static/image/mp/index/serch_moren.png") no-repeat;
      background: url("https://m1.allinmed.cn/static/image/mp/index/1.5.0/index_search.png") no-repeat;
      background-size: contain;
      vertical-align: middle;
    }
  }

  .input-box {
    .search {
      padding-left: 50px;
      font-size: 30px;
      width: 650px;
      outline: none;
      border: none;
      border-radius: 100px;
      color: black;
      height: 70px;
      z-index: 5;
      background-color: #F6F6F6;
      @include placeholder() {
        color: #7A8585;
        text-align: center;
      }
    }
  }
  .AIminiProgram{
    // width: 100%;
    position: relative;
    height: 140px;
    margin: 0 30px 30px 30px;
    border-radius: 6px;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
    }
    .AIminiProgram-item{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .health-card{
    width: 100%;
    height: 128px;
    background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/banner.png") no-repeat center;
    background-size: 100% 100%;
    margin-bottom: 26px;
  }
  .middle-box{
    height:16px;
    background:rgb(242,242,242);
  }
  .history {
    padding-bottom: 150px;
    header {
      padding: 44px 30px 32px;
      @include clearfix();
      .journalTitle {
        display: inline-block;
        font-size: 30px;
        color: #777777;
        letter-spacing: 0;
        line-height: 30px;
        &:before {
          display: inline-block;
          content: "";
          width: 4px;
          height: 26px;
          margin-right: 10px;
          background: #2EA9FE;
          border-radius: 100px;
          vertical-align: -2px;
        }
      }
      .addJournal{
        float: right;
        text-align: left;
        height: 56px;
        /*line-height: 56px;*/
        display: flex;
        align-content: center;
        padding: 0;
        margin: 0;
        background-color: rgba(186,186,186,0.1);
        border-radius:100px 0px 0px 100px;
        .addIcon{
          width: 56px;
          height: 56px;
          /*vertical-align: middle;*/
        }
        .addText{
          font-size: 28px;
          line-height: 56px;
          margin: 0 12px;
          color: #2EA9FE;
        }
      }
    }
    .journalClassifyList{
      line-height: 88px;
      height: 88px;
      white-space:nowrap;
      overflow-x: scroll;
      overflow-y: hidden;
      border-bottom: 2px solid #EBEDF0;
      .journalClassifyItem{
        display: inline-block;
        padding: 5px 25px;
        font-size: 30px;
        color: rgb(85,85,85);
        &.selected {
          font-size: 38px;
          font-weight: bold;
          color: rgb(51,51,51);
          position: relative;
          &:after{
            position: absolute;
            display: block;
            content: '';
            width: 32px;
            height: 6px;
            background: #2EA9FE;
            bottom: 8px;
            left: 50%;
            margin-left: -16px;
            border-radius: 99px;
          }
        }
      }
    }
    .extraLine {
      display: block;
      text-align: center;
      font-size: 26px;
      color: #BDBDBD;
      margin-top: 50px;
    }
  }

</style>
