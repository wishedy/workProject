<template>
  <section class="main">
    <transition name="fade">
      <section class="masker" v-if="maskerShow" @click.stop="maskerClickCb"></section>
    </transition>
    <section class="header">
      <section class="input-box">
        <div class="sd_searchGroup" data-alcode-mod='759'>
          <img class="search-icon" src="https://m1.allinmed.cn/static/image/mp/index/1.5.0/index_search.png"
               :class="{'change':!indexShow}">
          <section class="sd_searchInput" data-alcode='e174' v-model.trim="searchVal"
                   @click="getHistoryRecord()">输入医院、医生、疾病关键词搜索
          </section>
          <img class="sd_delete_icon"
               src="https://m.allinmed.cn/static/image/mp/personal/delet.png" @click.stop="cleanContent"
               v-if="searchVal.length>0">
        </div>
        <transition name="fade">
          <toast :content="errorMsg" v-if="errorShow"></toast>
        </transition>
      </section>
      <!--<section class="quickSearch"><span v-for="(item,index) in hotWord" class="quickSearch-item"-->
      <!--@click="quickSearch(item,index)"-->
      <!--:class="{'active':selectItem1===index}" :key="index">{{item}}</span>-->
      <!--</section>-->
    </section>
    <section class="navBar" style="font-size:0"
             v-show="indexShow">
      <FilterBuilder :param="{
        dataList:majorList,
        title:'全部专科',
        itemName:'tagName',
        type:'major',
        index:0,
        changeTitle:'全部专科'
      }" :maskerShow.sync="maskerShow" @selectFilter="getSelectFilter"
                     :selectItem.sync="defaultMajor.index"
                     :selectTitle.sync="defaultMajor.title"
                     @filterShowCallback="filterShowCallback(0)" :selectIndex="selectedFilterIndex"
                     ref="filterBuilder"></FilterBuilder>
      <FilterBuilder :param="{
          dataList:areaList,
          title:'全国',
          itemName:'regionName',
          type:'area',
          index:1,
          changeTitle:'全国'
        }" :maskerShow.sync="maskerShow" @selectFilter="getSelectFilter" :selectItem.sync="defaultArea.index"
                     :selectTitle.sync="defaultArea.title"
                     @filterShowCallback="filterShowCallback(1)" :selectIndex="selectedFilterIndex"
                     ref="filterBuilder"></FilterBuilder>
    </section>
    <section v-if="indexShow" class="main-inner1">
      <img class="noResult-img" v-show="noResult&&indexShow"
           src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/default.png">
      <p class="Noresult" v-show="noResult&&indexShow">未找到符合条件的结果</p>
      <DoctorItem :organization="doctorList" @FromChild="getErrMsg" @clickCallback="trackCallback"
                  @authEvent="authEvent"></DoctorItem>
      <span class="no-more" v-if="extraShow&&(doctorList.length>0&&toBottom)">--到底了--</span>
      <span class="no-more" v-else-if="extraShow&&(doctorList.length>0&&!toBottom)">正在加载...</span>
    </section>
    <NormalLoading v-if="finish"></NormalLoading>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
    <figure class="dr_searchHistory" v-if="!indexShow && historyInfo.length>0">
      <figcaption>历史记录<i class="dr_deleteBtnIcon" @click.stop="confirmShow = true"></i></figcaption>
      <ul class="dr_searchList">
        <span v-for="(item,index) in historyInfo" class="history-item" @click="getSearchResult(2,item)" :key="index">{{item.keyWord}}</span>
      </ul>
      <transition name="fade">
        <confirm
          :confirmParams="{
          'ensure':'确认',
          'cancel':'取消',
          'content':'确认删除全部历史记录吗?'
          }" v-if="confirmShow" @cancelClickEvent="cancelEvent" @ensureClickEvent="ensureEvent">
        </confirm>
      </transition>
    </figure>
    <BackIndex v-if="backIndexShow"></BackIndex>
    <BlackList></BlackList>
    <authorization></authorization>
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
  import dataLog from "dataLog";
  import ensureConfirm from "components/ensure";
  import deleteHistoryRecord from 'common/js/HttpRequest/deleteHistoryRecord';
  import createHistoryRecord from 'common/js/HttpRequest/createHistoryRecord';
  import BackIndex from "components/backIndex"; // 返回首页组件
  import BlackList from "components/BlackList";
  import authorization from "components/authorization/authorization";
  export default {
    data() {
      return {
        backIndexShow:false,
        scrollTop: 0,
        clickAble: true,
        dataClean: false,
        extraShow: true,//最下面那个加载中/到底了
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
        ensureShow: false,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
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
      DoctorItem,
      ensureConfirm,
      BackIndex,
      BlackList,
      authorization
    },
    watch: {
      value(newVal) {
        this.inputValue = newVal
      },
      inputValue(newVal) {
        this.$emit('input', newVal)
      },
    },
    onReachBottom() {
      this.loadMore();

    },
    onUnload() {
      this.dataClean = false;
      this.doctorList = [];
      this.HttpParams.firstResult = 0;
    },
    onShow() {
      let pages = getCurrentPages(); //页面栈
      if(pages.length==1){
        this.backIndexShow=true;
      }else {
        this.backIndexShow=false;
      }
      dataLog.enterBrowse();
      this.clickAble = true;
      this.searchVal = '';
      this.maskerShow = false
      wx.setNavigationBarTitle({
        title: "找名医"
      });
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    mounted() {
      this.dataClean = true;
      this.doctorList = [];
      // const query = this.$root.$mp.query;
      // this.HttpParams.solrContent = query.searchItem ? query.searchItem : '';
      // this.searchVal = query.searchItem ? query.searchItem : '';
      this.HttpParams.areasExpertise = '';
      this.HttpParams.searchRegion = '';
      this.page = 0;
      this.allMsgGot = false;
      this.toBottom = false;
      this.getDoctorList();
      this.getFilterCondition();
    },
    //转发事件
    onShareAppMessage(res) {
      if (res.from === 'button') {
        console.log(res.target)
      }
      // let _path = `/${getCurrentPages()[1].route}`;
      let _path = `/pages/mIndex/mIndex?from=shareFriend&path=/pages/doctorList/doctorList`;
      let _sharTitle = `唯医骨科 | 找骨科三甲名医`;
      console.log(_path)
      return {
        title: _sharTitle,
        path: _path
      }
    },
    methods: {
      getTop(e) {
        console.log(e)
        this.scrollTop = e.mp.detail.scrollTop
      },
      authEvent(obj) {
        console.log(obj)
        if (obj.desc) {
          this.ensureShow = false;
        } else {
          this.ensureShow = true;
        }
      },
      goToSetting(e) {
        console.log(e.mp.detail.errMsg === "openSetting:ok")
        if (e.mp.detail.errMsg === "openSetting:ok") {
          this.ensureShow = false;
        } else {
          this.ensureShow = true;
        }
      },
      trackCallback(obj) {
        dataLog.createTrack({
          actionId: 14146,
          pushMessageId: obj.item.customerId,
          keyword: obj.item.fullName,
          locationId: obj.index
        });
      },
      loadMore() {
        console.log(456456)
        if (!this.allMsgGot) {

          clearTimeout(this.debounce);
          this.extraShow = true;
          this.debounce = setTimeout(() => {
            // wx.pageScrollTo({
            //   scrollTop: 10000,
            //   duration: 0
            // })
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
//快速搜索
      quickSearch(item, index) {
        this.page = 0;
        this.loadingFlag = true;
        this.HttpParams.firstResult = 0;
        this.doctorList = [];
        this.indexShow = true;
        this.maskerShow && (this.maskerShow = false);
        if (this.selectItem1 == index) {
          this.HttpParams.solrContent = ''
          this.selectItem1 = '';
          this.searchVal = '';
          this.getDoctorList();
        } else {
          this.selectItem1 = index;
          this.searchVal = item;
          this.HttpParams.solrContent = item;
          this.getDoctorList();
          this.HttpParams.solrContent = ''
        }
      },
      showChinese(item) {
        let itemValue = item.areasExpertise;
        if (itemValue != null && itemValue != "") {
          let reg = /[\u4e00-\u9fa5,]/g;
          let str = itemValue.match(reg).join("");
          let val = str.replace(/,/g, '、')
          return val;
        }
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
        // if (this.toBottom) {
          this.finish = true;
        // }
        getDoctorFilterList(this.HttpParams).then(data => {
          if (data.responseObject.responseData) {
            this.extraShow = false;
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
              this.extraShow = true;
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
      getSearchResult(type, obj) {
        this.loadingFlag = true;
        this.maskerShow = false;
        this.HttpParams.firstResult = 0;
        this.page = 0;
        this.doctorList = [];
        this.indexShow = true;
        if (this.finish == false) {
          this.HttpParams.areasExpertise = "";
          this.HttpParams.searchRegion = "";
          this.defaultMajor = {
            title: "全部专科",
            index: -1
          };
          this.defaultArea = {
            title: "全国",
            index: -1
          };
          if (type == 1) {
            if (this.searchVal.length > 0) {
              this.$set(this.HttpParams, "solrContent", this.searchVal);
              this.createHistoryRecord();
              this.getDoctorList();
              this.HttpParams.firstResult += this.HttpParams.maxResult;
            } else {
              this.HttpParams.solrContent = '';
              this.getDoctorList();
            }
          } else {
            this.HttpParams.solrContent = obj.keyWord;
            this.searchVal = obj.keyWord;
            this.createHistoryRecord();
            this.getDoctorList();
            this.HttpParams.firstResult += this.HttpParams.maxResult;
          }
        }
      },
      getSelectFilter(filter) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        });
        // document.body.style.position = 'inherit'
        this.loadingFlag = true;
        this.HttpParams.firstResult = 0;
        this.scrollTop = 0;
        this.finish = true;
        this.toBottom = false;
        this.allMsgGot = false;
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
          getHotWord({
            flag: 0
          }).then(data => {
            let dataList = data.responseObject.responseData.dataList;
            this.hotWord = dataList.split(",");
          })
        });
      },
      filterShowCallback(index) {
        this.selectedFilterIndex = index;
      },
      //搜索历史记录处理
      getHistoryRecord() {
        if (this.clickAble) {
          this.clickAble = false;
          dataLog.createTrack({
            actionId: 14138,
          });
          wx.navigateTo({
            url: "/pages/history/history"
          });
        }
      },
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
  .masker {
    z-index: 5;
  }

  .navBar {
    padding-left: 36px;
    font-size: 0;
    display: flex;
    align-items: center;
    background: white;
    padding-bottom: 5px;
    position: fixed;
    top: 110px;
    left: 0;
    right: 0;
    z-index: 6;
  }

  .main {
    width: 750px;
    min-height: 100%;
    box-sizing: border-box;
    background: #F2F4F7;
    /*overflow: hidden;*/
    .noResult-img {
      width: 320px;
      height: 320px;
      position: relative;
      left: 32%;
      top: 155px;
    }
    .Noresult {
      width: 100%;
      box-sizing: border-box;
      padding-left: 138px;
      padding-top: 80px;
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
      padding-top: 160px;
      box-sizing: border-box;
      height: 100%;
    }
  }

  .header {
    top: 0px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 5;
    // border-bottom: solid 1px #f0f0f0;
    background: white 100%;
    padding-bottom: 15px;
    .search-icon {
      position: absolute;
      width: 34px;
      height: 34px;
      z-index: 3;
      background-size: contain;
      top: 46px;
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
          width: 700px;
          height: 70px;
          background: #F5F5F5;
          background-size: 28px 28px;
          font-size: 30px;
          color: #999999;
          padding-left: 60px;
          box-sizing: border-box;
          border: none;
          outline: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-radius: 10px;
          padding-top: 16px;
          &.search-on {
            width: 528px;
          }
          // @include placeholder {
          //   color: #2B3752;
          //   opacity: 0.3;
          // }
        }
        .placeHolderStyle {
          color: red;
          font-size: 28px;
        }
        .sd_delete_icon {
          position: absolute;
          width: 36px;
          height: 36px;
          z-index: 3;
          background-size: contain;
          top: 46px;
          right: 50px;

        }
        .sd_searchBtn {
          float: left;
          width: 100px;
          height: 70px;
          line-height: 70px;
          font-size: 30px;
          color: #fff;
          border-radius: 0 10px 10px 0;
          background: #218E88;
          text-align: center;
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
    color: #BDBDBD;
    padding-bottom: 60px;
  }
</style>
