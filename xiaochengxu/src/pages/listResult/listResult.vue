<template>
  <section class="main" style="height: 100vh; overflow:hidden">
    <transition name="fade">
      <section class="masker" v-if="maskerShow" @click.stop="maskerClickCb"></section>
    </transition>
    <section class="header">
      <section class="input-box">
        <div class="sd_searchGroup" data-alcode-mod='759'>
          <img class="search-icon" src="https://m.allinmed.cn/static/image/img00/DrList/search.png"
               :class="{'change':!indexShow}">
          <input class="sd_searchInput" data-alcode='e174' type="text" v-model.trim="searchVal"
                 placeholder="输入医院、医生、疾病关键词搜索">
          <img class="sd_delete_icon"
               src="https://m.allinmed.cn/static/image/mp/personal/delet.png" @click.stop="cleanContent"
               v-if="searchVal.length>0">
          <span class="sd_searchBtn" data-alcode='e175' @click="getSearchResult(1)">搜索</span>
        </div>
        <transition name="fade">
          <toast :content="errorMsg" v-if="errorShow"></toast>
        </transition>
      </section>
    </section>
    <scroll-view v-if="indexShow" class="main-inner1" scroll-y="true"
                 @scrolltolower="loadMore">
      <img class="noResult-img" v-show="noResult&&indexShow"
           src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/default.png">
      <p class="Noresult" v-show="noResult&&indexShow">未找到符合条件的结果</p>
      <DoctorItem :organization="doctorList" @FromChild="getErrMsg" @clickCallback="trackCallback"></DoctorItem>
      <span class="no-more" v-if="extraShow&&doctorList.length!=0&&toBottom">--到底了--</span>
      <span class="no-more" v-if="extraShow&&doctorList.length>20&&!toBottom">正在加载...</span>
    </scroll-view>
    <NormalLoading v-if="finish"></NormalLoading>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：医生搜寻术
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by YuxiYang on 2018/3/26.
   */
  import api from 'common/js/util/util';
  import FilterBuilder from "components/filterBuilder/";
  import DoctorItem from "components/doctorItem";
  import NormalLoading from 'components/loading';
  import getAreaList from "common/js/HttpRequest/getAreaList";
  import getMajorTitleList from "common/js/HttpRequest/getMajorTitleList";
  import getMajorList from "common/js/HttpRequest/getMajorList";
  import getHotWord from "common/js/HttpRequest/getHotWord"
  import getDoctorFilterList from "common/js/HttpRequest/getDoctorFilterList";
  import toast from "../../components/toast";
  import confirm from 'components/confirm';
  import CheckLogin from "common/js/auth/checkLogin";
  import createHistoryRecord from 'common/js/HttpRequest/createHistoryRecord';
  import dataLog from "dataLog";
  export default {
    data() {
      return {
        extraShow: false,//最下面那个加载中/到底了
        toBottom: false,//上拉显示更多时的判断
        counter: 0,
        selectItem1: -2,
        hotWord: [],
        loadingFlag: false,//true的话会禁止一切点击事件
        doctorCustomerId: '',
        indexShow: true,//主页面
        noResult: false,//无结果的提示
        searchVal: '',//显示在输入框里的文字
        organizationNavs: [],//传数据到医生名片
        historyInfo: [],
        finish: false,//用来判断loading
        areaList: [],
        majorList: [],
        majorTitleList: [],
        maskerShow: false,
        allReady: false,
        doctorList: [],
        selectedFilterIndex: -1,
        errorShow: false,
        errorMsg: '',
        confirmShow: false,
        allMsgGot: false,
        page: 0,
        clickLimit:true,
        currentLocation: '',
        defaultTitle: {
          title: "",
          index: -1
        },
        defaultMajor: {
          title: "全部专科",
          index: -1
        },
        defaultArea: {
          title: "全国",
          index: -1
        },
        HttpParams: {
          firstResult: 0,
          maxResult: 20,
          logoUseFlag: 3,
          indexType: "customer",
          solrContent: "",  //搜索关键字
          searchSortType: 1,  //综合排序 1综合2从低到高
          areasExpertise: "",  //专业
          searchRegion: "",    //地区
          searchHospitalLevel: "",   //医院级别
          searchTitleLevel: ""   //职称级别
        },
      }
    },
    filters: {},
    components: {
      FilterBuilder,
      NormalLoading,
      toast,
      confirm,
      CheckLogin,
      DoctorItem
    },
    watch: {
      value(newVal) {
        this.inputValue = newVal
      },
      inputValue(newVal) {
        this.$emit('input', newVal)
      },
    },
    onShow(){
      dataLog.enterBrowse();
      wx.setNavigationBarTitle({
        title:'找名医',
      });
      this.HttpParams.firstResult = 0;
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    mounted() {
      const query = this.$root.$mp.query;
      this.doctorList = [];
      this.HttpParams.solrContent = query.searchItem ? query.searchItem : '';
      this.searchVal = query.searchItem ? query.searchItem : '';
      this.getDoctorList();
    },
    methods: {
      trackCallback(obj) {
        dataLog.createTrack({
          actionId: 14142,
          pushMessageId: obj.item.diaryId ? obj.item.diaryId : obj.item.customerId,
          keyword: obj.item.diaryName ? obj.item.diaryName : obj.item.fullName,
          locationId:obj.index
        });
      },
      loadMore() {
        if (!this.allMsgGot) {
          clearTimeout(this.debounce);
          this.debounce = setTimeout(() => {
            this.page += 1;
            this.HttpParams.firstResult = this.page * this.HttpParams.maxResult;
            this.getDoctorList();
          }, 100)
        }
      },
      getErrMsg(data) {
        this.errorMsg = data.msg;
        this.errorShow = data.state;
        setTimeout(() => {
          this.errorShow = false;
        }, 2000);
      },
      cleanContent() {
        this.searchVal = '';
        this.selectItem1 = -1;
      },
      cancelEvent() {
        this.confirmShow = false;
      },
      ensureEvent() {
        this.confirmShow = false;
        deleteHistoryRecord().then((res) => {
          if (res && res.responseObject.responseStatus) {
            this.historyInfo = [];
          }
        })
      },
      //获取过滤后的医生数据

      getDoctorList() {
        if (this.toBottom) {
          this.finish = true;
        }
        this.allMsgGot = false;
        getDoctorFilterList(this.HttpParams).then(data => {
          this.extraShow = true;
          if (data.responseObject.responseData) {
            let dataList = data.responseObject.responseData.dataList;
            this.finish = false;
            if (dataList && dataList.length !== 0) {
              dataList.forEach((element) => {
                this.doctorList.push(element);
                this.loadingFlag = true;
              });
              this.noResult = false;
            }
            else {
              this.toBottom = true;
              if (this.page === 0) {
                this.noResult = true;
              } else {
                this.allMsgGot = true;
              }
            }
          } else {
            this.errorMsg = '当前网络不可用，请检查网络设置'
            this.errorShow = true;
            setTimeout(() => {
              this.finish = false;
              this.errorShow = false;
            }, 2000);
          }
        }).catch(() => {
          this.finish = false;
        });
      },
      getSearchResult() {
        this.loadingFlag = true;
        this.indexShow = true;
            if (this.searchVal.length > 0) {
              if(this.clickLimit) {
                this.clickLimit = false;
                this.HttpParams.firstResult = 0;
                this.page = 0;
                this.doctorList = [];
                this.$set(this.HttpParams, "solrContent", this.searchVal);
                this.createHistoryRecord();
                this.getDoctorList();
                this.HttpParams.firstResult += this.HttpParams.maxResult;
                setTimeout(()=>{
                  this.clickLimit = true;
                },1000)
              }
            } else{
              this.errorMsg = '请输入关键词'
              this.errorShow = true;
              setTimeout(() => {
                this.errorShow = false;
              }, 2000)
            }
      },
      getSelectFilter(filter) {
        // document.body.style.position = 'inherit'
        this.loadingFlag = true;
        this.HttpParams.firstResult = 0;
        this.finish = true;
        switch (filter.type) {
          case "major":
            if (filter.item.tagName === "全部专科") {
              this.HttpParams.areasExpertise = "";
            } else {
              this.HttpParams.areasExpertise = filter.item.tagName.includes("&") ? filter.item.tagName.replace("&", ",") : filter.item.tagName;
            }
            this.finish = false;
            break;
          case "area":
            if (filter.item.regionName === "全国") {
              this.HttpParams.searchRegion = "";
            } else {
              this.HttpParams.searchRegion = filter.item.regionName;
            }
            this.finish = false;
            break;
          case "sort":
            this.HttpParams.searchSortType = filter.item.sortType;
            this.finish = false;
            break;
          case "hospital":
            this.HttpParams.searchHospitalLevel = filter.item.hospitalLevel;
            this.HttpParams.searchTitleLevel = filter.item.majorTitle;
            this.finish = false;
            break;
          default:
            break;
        }
        this.doctorList = [];
        this.page = 0;
        this.getDoctorList();
        this.HttpParams.firstResult = 0;
      },
      maskerClickCb() {
        this.maskerShow = false;
      },
      //获取筛选数据，传递至js文件
      getFilterCondition() {
        Promise.all([getMajorList({
          treeLevel: 2,
          firstResult: 0,
          maxResult: 9999,
        }), getAreaList({
          parentId: "",
          level: 2
        }),
          getMajorTitleList({
            typeId: 1,
            firstResult: 0,
            maxResult: 999,
          })]).then(allData => {
          // console.log(allData)
          allData.forEach((element, index) => {
            if (element.responseObject.responseData) {
              let data = element.responseObject.responseData;
              switch (index) {
                case 0://专科
                  this.majorList = data.data_list;
                  this.majorList.unshift({
                    tagName: "全部专科",
                    type: "default"
                  });
                  break;
                case 1://地区
                  this.areaList = data.dataList;
                  this.areaList.unshift({
                    regionName: "全国",
                    type: "default"
                  });
                  break;
                default:
                  break;
              }
            }
          });
          getHotWord().then(data => {
            let dataList = data.responseObject.responseData.dataList;
            this.hotWord = dataList.split(",");
          })
        });
      },
      filterShowCallback(index) {
        this.selectedFilterIndex = index;
      },
      //搜索历史记录处理
      createHistoryRecord() {
        createHistoryRecord({
          searchType: "1",
          keyWord: this.searchVal,
          siteId: api.getSiteId()
        }).then((res) => {
          if (res && res.responseObject.responseStatus) {
            console.log("创建历史记录成功");
          }
        }).catch(err => {
          this.finish = false;
        });
      },
    }
  }
</script>
<style lang="scss" scoped="">
  html, body {
    width: 100%;
    min-height: 100%;
  }

  .navBar {
    padding-left: 36px;
    font-size: 0;
    display: flex;
    align-items: center;
    background: white;
    padding-bottom: 5px;
  }

  .main {
    width: 750px;
    height: 100%;
    box-sizing: border-box;
    background: #F2F4F7;
    overflow: hidden;
    .noResult-img {
      width: 320px;
      height: 320px;
      position: relative;
      left: 30%;
      top: 55px;
    }
    .Noresult {
      width: 100%;
      box-sizing: border-box;
      padding-left: 120px;
      padding-bottom: 80px;
      font-size: 28px;
      color: #a0a8b3;
      letter-spacing: 0;
      &:before {
        top: 50px;
        position: relative;
        display: inline-block;
        width: 112px;
        height: 96px;
        background-size: contain;
        content: "";
      }
    }
    .main-inner1 {
      position: relative;
      width: 100%;
      height: 94%;
      overflow: scroll;
      margin-top: 15px;
    }
  }

  .header {
    position: relative;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 5;
    border-bottom: solid 1px #f0f0f0;
    background: white 100%;
    padding-bottom: 15px;
    .search-icon {
      position: absolute;
      width: 28px;
      height: 28px;
      z-index: 3;
      background-size: contain;
      top: 55px;
      left: 48px;
      &.change {
        left: 91px;
      }
    }
    .input-box {
      .sd_searchGroup {
        @include clearfix();
        float: left;
        border-radius: 8px;
        box-sizing: border-box;
        .sd_searchInput {
          float: left;
          width: 460px;
          background: #F2F4F7;
          background-size: 28px 28px;
          font-size: 30px;
          color: #333333;
          border: none;
          outline: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-radius: 10px 0 0 10px;
          padding: 14px 60px 15px 60px;
          &.search-on {
            width: 528px;
          }
          @include placeholder {
            color: #2B3752;
            opacity: 0.3;
          }
        }
        .sd_delete_icon {
          position: absolute;
          width: 36px;
          height: 36px;
          z-index: 3;
          background-size: contain;
          top: 46px;
          right: 161px;

        }
        .sd_searchBtn {
          float: left;
          width: 100px;
          height: 70px;
          line-height: 70px;
          font-size: 30px;
          color: #29A3A3;
          border-radius: 0 10px 10px 0;
          text-align: right;
        }
      }
      @include clearfix();
      padding-top: 28px;
      margin: 0 30px;
      box-sizing: border-box;
    }
  }

  .quickSearch {
    /*padding-top: 15px;*/
    padding-bottom: 15px;
    padding-left: 29px;
    margin-top: 16px;
    .quickSearch-item {
      padding: 13px 13px 13px 13px;
      margin-right: 28px;
      font-size: 28px;
      background: #2EA9FE;
      color: white;
      display: inline-block;
      &.active {
        background: #2EA9FE;
      }
    }
  }

  .masker {
    position: fixed;
    top: 284.5px;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #000;
    opacity: .8;
    z-index: 3;
  }

  .dr_searchHistory {
    min-height: 100%;
    padding: 52px 30px 0;
    background: #fff;
    figcaption {
      font-size: 34px;
      color: #444444;
      font-weight: bold;
    }
    .dr_searchList {
      margin-top: 24px;
      .history-item {
        max-width: 654px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        margin-top: 10px;
        color: #5A5A5A;;
        font-size: 28px;
        background: #F2F4F7;
        padding: 11px 14px 11px 14px;
        margin-right: 12px;
        border-radius: 8px;
      }
    }
  }

  .dr_deleteBtnIcon {
    float: right;
    width: 30px;
    height: 30px;
    margin-top: 6px;
    background: url("https://m.allinmed.cn/static/image/mp/index/dele.png") no-repeat;
    background-size: 100% 100%;
  }

  .clean {
    float: left;
    margin-top: 15px;
    margin-right: 10px;
    width: 30px;
    height: 40px;
    background-size: 100% 100%;
  }

  .no-more {
    display: block;
    text-align: center;
    font-size: 26px;
    margin: 20px 0;
    color: #BDBDBD;
  }
</style>
