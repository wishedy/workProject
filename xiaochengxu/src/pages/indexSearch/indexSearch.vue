<template>
  <section class="main" id="contain">
    <section :style="{'height':'100vh'}">
      <section class="header">
        <section class="input-box">
          <div class="sd_searchGroup">
            <img class="search-icon" src="https://m.allinmed.cn/static/image/img00/DrList/search.png"
                 @click="cleanContent">
            <input class="sd_searchInput" type="text" v-model.trim="searchVal"
                   placeholder="搜索医生、康复日记" @click="gogogo">
            <img class="sd_delete_icon" src="https://m.allinmed.cn/static/image/mp/personal/delet.png"
                 v-show="searchVal.length>0" @click.stop="searchVal=''" @confirm="getSearchResult">
            <span class="sd_searchBtn" @click="getSearchResult">搜索</span>
          </div>
          <transition name="fade">
            <toast :content="errorMsg" v-if="errorShow"></toast>
          </transition>
        </section>
      </section>
      <p class="traderText">
        为您找到以下<span style="color:#02B5AC">{{HttpParams.searchParam}}</span>相关结果
      </p>
      <section>
        <div class="_box" v-if="doctorList1.length>0||majorList.length>0||majorListAll.length>0">
          <span v-for="(item,index) in tabsName" :key="index"><a class="tab-link" @click="searchTabClick(index)"
                                                                 :class="{active:isActive===index}">{{item.name}}</a></span>
        </div>
      </section>
      <!--全部-->
      <section v-if="isActive==0">
        <p class="all-title doctor-title" v-if="doctorList1.length>0">医生</p>
        <DoctorItem :organization='doctorList1' @FromChild="getErrMsg" @clickCallback="trackCallback"></DoctorItem>
        <button class="showMore" @click='MoreDoctor' v-if="doctorList1.length>1">
          <span>查看更多相关医生</span>
        </button>
        <p class="all-title" v-if="majorList.length>0">康复日记</p>
        <recureJournal :journalData="majorList" @FromChild="goSetting" @clickCallback="trackCallback"></recureJournal>
        <span class="no-more" v-if="moreFinish">正在加载...</span>
        <span class="no-more" v-if="!moreFinish&&allDiaryGot">--到底了--</span>

        <img class="noResult-img" v-show="!finish&&majorList.length===0&&doctorList1.length===0"
             src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/default.png">
        <p class="Noresult" v-show="!finish&&majorList.length===0&&doctorList1.length===0">未找到符合条件的结果</p>
      </section>
      <!--医生-->
      <section v-if="indexShow&&isActive==1" class="main-inner">
        <DoctorItem :organization="doctorList" @FromChild="getErrMsg" @clickCallback="trackCallback"></DoctorItem>
        <span class="no-more" v-if="moreFinish">正在加载...</span>
        <span class="no-more" v-if="!moreFinish&&allMsgGot">--到底了--</span>
        <!-- 无搜索结果 -->
        <img class="noResult-img" v-show="!finish&&doctorList.length===0"
             src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/default.png">
        <p class="Noresult" v-show="!finish&&doctorList.length===0">未找到符合条件的结果</p>
      </section>

      <!--康复日记-->
      <section v-if="isActive==2">
        <recureJournal :journalData="majorListAll" @FromChild="goSetting"
                       @clickCallback="trackCallback"></recureJournal>
        <span class="no-more" v-if="moreFinish">正在加载...</span>
        <span class="no-more" v-if="!moreFinish&&allDiaryGot">--到底了--</span>
        <!-- 无搜索结果 -->
        <img class="noResult-img" v-show="!finish&&majorListAll.length===0"
             src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/default.png">
        <p class="Noresult" v-show="!finish&&majorListAll.length===0">未找到符合条件的结果</p>
      </section>
      <NormalLoading v-if="finish"></NormalLoading>
    </section>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
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
  import DoctorItem from "components/doctorItem";
  import recureJournal from "components/recureJournal";
  import NormalLoading from "components/loading";
  import getDoctorFilterList from "common/js/HttpRequest/indexSearch";
  import toast from "../../components/toast";
  import ensureConfirm from "components/ensure";
  import confirm from "components/confirm";
  import CheckLogin from "common/js/auth/checkLogin";
  import createHistoryRecord from "common/js/HttpRequest/createHistoryRecord";
  import dataLog from "dataLog";
  import miniLogin from "common/js/miniUtil/miniLogin";

  export default {
    data() {
      return {
        inputFocus: false,
        //tab switch
        tabsName: [{
          name: "全部"
        }, {
          name: "医生"
        }, {
          name: "康复日记"
        }],
        pageUrl: "",
        timing: "",
        isActive: -1,
        counter: 0,
        hotWord: [],
        loadingFlag: false,   //true的话会禁止一切点击事件
        doctorCustomerId: "",
        showMoreFlag: false,//更多医生展示
        indexShow: true,      //主页面
        noResult: false,      //无结果的提示
        noResult1: false,      //无tab结果的提示
        searchVal: "",        //显示在输入框里的文字
        organizationNavs: [], //传数据到医生名片
        historyInfo: [],
        finish: false,        //用来判断loading
        moreFinish: false,
        areaList: [],
        majorList: [],        //日记列表
        majorListAll: [],
        maskerShow: false,
        allReady: false,
        doctorList: [],      //医生列表
        doctorList1: [],     //医生列表1
        selectedFilterIndex: -1,
        errorShow: false,
        errorMsg: "",
        firstTag: true,//控制首页列表只拉一次的anchor
        confirmShow: false,
        allMsgGot: false,
        allDiaryGot: false,
        indexJournalPage: 0,
        activeType: '',//跳转到该页面带的页面类型
        authPage: 0,
        majorPage: 0,
        HttpParams: {
          searchParam: "",       //	string	是	搜索关键词
          solrType: 1,          //	string	是	1-全部列表 2-医生列表 3-日记列表
          visitSiteId: 24,       //	string	是	站点
          imgUseFlag:2,
          firstResult: "0",      //	string	是	分页参数
          maxResult: "20"       //	string	是	分页参数
        },
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
        ensureShow: false
      };
    },
    components: {
      NormalLoading,
      toast,
      confirm,
      CheckLogin,
      DoctorItem,
      recureJournal,
      ensureConfirm
    },
    mounted() {
      // this.$forceUpdate();
      const query = this.$root.$mp.query;
      this.HttpParams.searchParam = query.searchItem ? query.searchItem : '';
      this.searchVal = query.searchItem ? query.searchItem : '';
      this.activeType = query.activeType;
      switch (parseInt(query.activeType)) {
        case 1:
          this.isActive = 0;
          break;
        case 2:
          this.isActive = 1;
          this.HttpParams.solrType = 2;
          break;
        case 3:
          this.isActive = 2;
          this.HttpParams.solrType = 3;
          break;
        default:
          this.isActive = 0;
          break;
      }
      this.getDoctorList();
      this.getCurrentTime();
      this.getCurrentPageUrl();
      if (this.activeType == 2) {
        this.specialDiary()
      }
    },
    onLoad() {
      this.doctorList = [];
      this.doctorList1 = [];
      this.majorList = [];
      this.majorListAll = [];
    },
    onShow() {
      console.log(this.inputFocus)
      dataLog.enterBrowse();
      this.init()
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    onReachBottom() {
      this.loadMore()
    },
    methods: {
      specialDiary() {
        this.HttpParams.solrType = 3;
        this.getJournalList();
      },
      trackCallback(obj) {
        dataLog.createTrack({
          actionId: 14141,
          pushMessageId: obj.item.diaryId ? obj.item.diaryId : obj.item.customerId,
          keyword: obj.item.diaryName ? obj.item.diaryName : obj.item.fullName,
          locationId: obj.index
        });
        if (obj.item.diaryContentType) {
          wx.navigateTo({
            url: "/packageF/journalDetail/journalDetail?rId=" + obj.item.diaryId + "&aId=" + obj.item.authorId + "&from=search"
          });
        }
      },
      goSetting(e) {
        if (e.desc) {
          this.ensureShow = false;
          miniLogin({
            successCallBack: (res) => {
              console.log(res)
            }
          });
        } else {
          this.finish = false;
          this.ensureShow = true;
        }
      },
      //data initialization
      init() {
        this.moreFinish = false;
        this.authPage = 0;
        this.majorPage = 0;
        this.ensureShow = false;
        this.HttpParams.solrType = 1;
        this.loadingFlag = false;
        this.HttpParams.firstResult = 0;
        this.firstTag = true;
        this.allMsgGot = false;
        this.allDiaryGot = false;
        this.inputFocus = false;
      },
      //更多医生功能
      MoreDoctor() {
        this.doctorList = [];
        this.doctorList1 = [];
        this.HttpParams.firstResult = 0;
        this.noResult1 = false;
        this.isActive = 1;
        this.HttpParams.solrType = 2;
        this.getDoctorList();
      },
      searchTabClick(index) {
        this.isActive = index;
        this.moreFinish = false;
        this.allMsgGot = false;
        this.allDiaryGot = false;
        switch (index) {
          case 0:
            this.noResult = false;
            break;
          case 1:
            this.noResult = false;
            if (this.doctorList.length === 0) {
              this.noResult1 = true
            } else {
              this.noResult1 = false
            }
            break;
          case 2:
            this.noResult = false;
            if (this.majorListAll.length === 0) {
              this.noResult1 = true
            } else {
              this.noResult1 = false
            }
            break;
        }
        if (this.isActive == 0) {
          this.noResult = false;
        }
        if (this.isActive == 1) {
          this.doctorList = [];
          this.HttpParams.solrType = 2;
          this.HttpParams.firstResult = this.authPage * this.HttpParams.maxResult;
          this.getDoctorList();
        }
        if (this.isActive == 2) {
          this.majorListAll = this.majorList;
          // this.HttpParams.solrType = 3;
          // this.HttpParams.firstResult = this.authPage * this.HttpParams.maxResult;
          // this.getDoctorList();
        }
      },
      getCurrentTime() {
        let timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        let n = timestamp * 1000;
        let date = new Date(n);
        let Y = date.getFullYear();
        let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
        let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        this.Timing = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
      },
      getCurrentPageUrl() {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        this.pageUrl = currentPage.route;
      },
      //加载更多
      loadMore() {
        let _this = this;
        _this.noResult = false;
        _this.noResult1 = false;
        if ((!_this.allMsgGot && !_this.allDiaryGot) && _this.isActive >= 0) {
          _this.HttpParams.solrType = _this.isActive == 1 ? 2 : 3;
          clearTimeout(_this.debounce);
          _this.debounce = setTimeout(() => {
            if (_this.isActive == 1) {
              _this.authPage += 1;
              _this.HttpParams.firstResult = _this.authPage * _this.HttpParams.maxResult;
            } else {
              _this.majorPage += 1;
              _this.HttpParams.firstResult = _this.majorPage * _this.HttpParams.maxResult;
            }
            _this.getDoctorList1();
          }, 100);
        }
      },
      getErrMsg(data) {
        this.errorMsg = data.msg;
        this.errorShow = data.state;
        setTimeout(() => {
          this.errorShow = false;
        }, 2000);
      },
      showChinese(item) {
        let itemValue = item.areasExpertise;
        if (itemValue != null && itemValue != "") {
          let reg = /[\u4e00-\u9fa5,]/g;
          let str = itemValue.match(reg).join("");
          let val = str.replace(/,/g, "、");
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
        });
      },
      //获取日记数据（从快速搜索来）
      getJournalList() {
        this.majorList = [];
        this.majorListAll = [];
        getDoctorFilterList(this.HttpParams).then(data => {
          if (data && data.responseObject && data.responseObject.responseData) {
            let dataList = data.responseObject.responseData;
            if (dataList.diaryList && dataList.diaryList.length > 0) {
              dataList.diaryList.forEach((element) => {
                element.patientAgeShow = this.getAge(element.patientAge);
                this.majorList.push(element);//全部搜索日记列表
                this.majorListAll.push(element);      //日记tab列表
              });
            }
          }
        })
      },
      //获取列表数据
      getDoctorList() {
        console.log('-----')
        console.log(this.doctorList1)
        console.log('-----')
        let _this = this;
        _this.finish = true;
        _this.allMsgGot = false;
        getDoctorFilterList(_this.HttpParams).then(data => {
          _this.loadingFlag = false;
          if (data && data.responseObject && data.responseObject.responseData) {
            let dataList = data.responseObject.responseData;
            _this.finish = false;
            _this.noResult = false;
            //日记数据
            if (dataList.diaryList && dataList.diaryList.length > 0) {
              _this.noResult1 = false;
              _this.noResult = false;
              dataList.diaryList.forEach((element) => {
                element.patientAgeShow = this.getAge(element.patientAge);
                if (_this.firstTag) {
                  _this.majorList.push(element);//全部搜索日记列表
                }
                _this.majorListAll.push(element);      //日记tab列表
              });
              _this.firstTag = false;
            } else {
              if (_this.majorList.length == 0 && _this.isActive !== 1) {
                _this.noResult1 = true;     //无结果
              } else if (!dataList.authMapList) {
                _this.allDiaryGot = true;     //无更多
              }
            }
            //医生数据
            if (dataList.authMapList && dataList.authMapList.length > 0) {
              _this.noResult1 = false;
              _this.noResult = false;
              if (dataList.authMapList.length > 2) {
                _this.showMoreFlag = true
              }
              dataList.authMapList.forEach((element) => {
                _this.doctorList.push(element);
              });
              if (!_this.doctorList1.length > 0) {
                _this.doctorList1.push(dataList.authMapList[0]);   //全部搜索医生第一条数据
                if (dataList.authMapList.length > 1) {
                  _this.doctorList1.push(dataList.authMapList[1]);   //全部搜索医生第二条数据
                }
              }
              _this.noResult = false;
            } else {
              if (_this.doctorList.length == 0 && _this.isActive == 1) {
                _this.noResult1 = true;      //无结果
              } else if (!dataList.diaryList) {
                _this.allMsgGot = true;      //无更多
              }
            }
            // if(_this.activeType ==2){
            //   _this.HttpParams.solrType = 3;
            //   _this.getDoctorList1();
            //   _this.isActive = 1;
            // }
          } else {
            _this.errorMsg = "网络连接失败";
            _this.errorShow = true;
            setTimeout(() => {
              _this.finish = false;
              _this.errorShow = false;
            }, 2000);
          }
        }).catch(() => {
          _this.finish = false;
        });
      },
      //loadingMore 不能改变其他tag的东西，所以请求要分开
      getDoctorList1() {
        let _this = this;
        _this.moreFinish = true;
        _this.allMsgGot = false;
        _this.allDiaryGot = false;
        getDoctorFilterList(_this.HttpParams).then(data => {
          _this.loadingFlag = false;
          if (data && data.responseObject && data.responseObject.responseData) {
            let dataList = data.responseObject.responseData;
            _this.moreFinish = false;
            //日记数据
            if (dataList.diaryList && dataList.diaryList.length > 0) {
              dataList.diaryList.forEach((element) => {
                element.patientAgeShow = this.getAge(element.patientAge);
                if (_this.isActive == 2) {
                  _this.majorListAll.push(element);      //日记tab列表
                } else if (_this.isActive == 0) {
                  _this.majorList.push(element);      //全部搜索日记列表
                }
              });
            } else {
              if (_this.majorList.length == 0 && _this.isActive !== 1) {
                // _this.isActive = -1;
              } else if (!dataList.authMapList && _this.majorPage > 0) {
                _this.allDiaryGot = true;     //无更多
              }
            }
            //医生数据
            if (dataList.authMapList && dataList.authMapList.length > 0) {
              dataList.authMapList.forEach((element) => {
                _this.doctorList.push(element);
              });
              if (!_this.doctorList1.length > 0) {
                _this.doctorList1.push(dataList.authMapList[0]);   //全部搜索医生第一条数据
                if (dataList.authMapList.length > 1) {
                  _this.doctorList1.push(dataList.authMapList[1]);   //全部搜索医生第二条数据
                }
              }
            } else {
              if (_this.doctorList.length == 0 && _this.isActive == 1) {
                // _this.isActive = -1;
              } else if (!dataList.diaryList) {
                _this.allMsgGot = true;      //无更多
              }
            }

          } else {
            _this.errorMsg = "网络连接失败";
            _this.errorShow = true;
            setTimeout(() => {
              _this.moreFinish = false;
              _this.errorShow = false;
            }, 2000);
          }
        }).catch(() => {
          _this.moreFinish = false;
        });
      },
      //搜索按钮的特殊性
      getDoctorList2() {
        let _this = this;
        _this.allMsgGot = false;
        _this.allDiaryGot = false;
        _this.finish = false;
        _this.HttpParams.firstResult = 0;
        getDoctorFilterList(_this.HttpParams).then(data => {
          _this.loadingFlag = false;
          if (data && data.responseObject && data.responseObject.responseData) {
            let dataList = data.responseObject.responseData;
            _this.finish = false;
            _this.noResult = true;
            _this.doctorList1 = [];//清空tabbar用的东西
            _this.majorList = [];
            _this.majorListAll = [];
            //日记数据
            if (dataList.diaryList && dataList.diaryList.length > 0) {
              _this.noResult1 = false;
              _this.noResult = false;
              _this.isActive = 0;
              dataList.diaryList.forEach((element) => {
                element.patientAgeShow = this.getAge(element.patientAge);
                _this.majorList.push(element);          //全部搜索日记列表
              });
            } else {
              _this.isActive = 0
            }
            //医生数据
            if (dataList.authMapList && dataList.authMapList.length > 0) {
              _this.noResult1 = false;
              _this.noResult = false;
              dataList.authMapList.forEach((element) => {
                _this.doctorList.push(element);
              });
              if (!_this.doctorList1.length > 0) {
                _this.doctorList1.push(dataList.authMapList[0]);   //全部搜索医生第一条数据
                if (dataList.authMapList.length >= 2) {
                  _this.doctorList1.push(dataList.authMapList[1]);
                }
              }
              _this.isActive = 0;
              _this.noResult = false;
            } else {
              _this.isActive = 0
            }

          } else {
            _this.errorMsg = "网络连接失败";
            _this.errorShow = true;
            setTimeout(() => {
              _this.finish = false;
              _this.errorShow = false;
            }, 2000);
          }
        }).catch(() => {
          _this.finish = false;
        });
      },
      //点击事件触发搜索
      getSearchResult() {
        this.inputFocus = false
        if (this.finish == false) {
          this.authPage = 0;
          this.majorPage = 0;
          this.HttpParams.firstResult = 0;
          this.HttpParams.areasExpertise = "";
          this.HttpParams.searchRegion = "";
          //搜索框
          if (this.searchVal.length > 0) {
            this.isActive = -1;
            this.loadingFlag = true;
            this.HttpParams.solrType = 1;     //全局搜索
            this.indexShow = true;
            // 清空数据
            this.doctorList = [];
            this.doctorList1 = [];
            this.majorList = [];
            this.majorListAll = [];
            this.$set(this.HttpParams, "searchParam", this.searchVal);
            this.createHistoryRecord();
            this.getDoctorList2();
          } else {
            this.HttpParams.searchParam = "";
            this.errorMsg = "请输入关键词";
            this.errorShow = true;
            setTimeout(() => {
              this.finish = false;
              this.errorShow = false;
            }, 2000);
          }
        }
      },
      getAge (num) {
        let firstNum = parseInt(num/10);
        let twoNum = num % 10;
        if (firstNum) {
          if (twoNum <= 5) {
            if(twoNum == 0) {
              if(firstNum == 1){
                return `${num}岁`
              } else {
                return `${firstNum-1}5岁以上`
              }
            }else{
              return `${firstNum}0岁以上`
            }
          } else {
            return `${firstNum}5岁以上`
          }
        } else {
          return `${twoNum}岁`
        }
      },
      filterShowCallback(index) {
        this.selectedFilterIndex = index;
      },
      //搜索历史记录处理
      //创建历史记录
      createHistoryRecord() {
        createHistoryRecord({
          searchType: "4",
          keyWord: this.searchVal,
          pageUrl: this.pageUrl,
          createTime: this.timing
        }).then((res) => {
          if (res && res.responseObject.responseStatus) {
            console.log("创建历史记录成功");
          }
        }).catch(err => {
          this.finish = false;
        });
      }
    }
  };
</script>
<style lang="scss" scoped="">
  html, body {
    width: 100%;
    min-height: 100%;
  }

  .all-title {
    font-size: 30px;
    color: #777777;
    letter-spacing: 0;
    line-height: 30px;
    margin-left: 30px;
    margin-top: 40px;
    &.doctor-title {
      margin-bottom: 40px;
      margin-top: 66px;
    }
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

  .noResult-img {
    width: 320px;
    height: 320px;
    position: relative;
    left: 30%;
    top: 100px;
  }

  .Noresult {
    position: relative;
    margin-top: 100px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    font-size: 28px;
    color: #a0a8b3;
    letter-spacing: 0;
  }

  .showMore {
    padding-top: 20px;
    width: 100%;
    font-size: 28px;
    color: #02B5AC;
    letter-spacing: 0;
    line-height: 28px;
    text-align: center;
    padding-left: 20px;
    padding-bottom: 20px;
    background-color: white;
    img {
      width: 30px;
      height: 30px;
      position: relative;
      top: 4px;
    }
  }

  ._box {
    margin-top: 60px;
    .tab-link {
      padding-bottom: 28px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 50px;
      margin-left: 40px;
      font-size: 30px;
      color: #555555;
      position: relative;
      transition: 0.2s ease-in-out all;
      &:before {
        display: block;
        content: '';
        position: absolute;
        bottom: 0;
        left: 100%;
        width: 0;
        border-bottom: 6px solid #00B9AD;
        transition: 0.2s ease-in-out all;
      }
      &.active {
        font-size: 34px;
        font-weight: bold;
        color: #333333;
        &:before {
          width: 32px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      &.active ~ .comment-navBar-item:before {
        left: 0;
      }
    }
  }

  .main {
    width: 750px;
    height: 100%;
    box-sizing: border-box;
    .main-inner {
      position: relative;
      padding-top: 20px;
      width: 100%;
      height: 84%;
      overflow: scroll;
      background: #F5F5F5;
    }
  }

  .traderText {
    padding-top: 10px;
    padding-left: 35px;
    font-size: 30px;
    color: #777777;
    letter-spacing: 0;
    line-height: 30px;
  }

  .header {
    position: relative;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 5;
    padding-bottom: 15px;
    .search-icon {
      position: absolute;
      width: 28px;
      height: 28px;
      z-index: 3;
      background-size: contain;
      top: 50px;
      left: 48px;
    }
    .sd_delete_icon {
      position: absolute;
      width: 36px;
      height: 36px;
      z-index: 3;
      background-size: contain;
      top: 46px;
      right: 145px;
    }
    .input-box {
      .sd_searchGroup {
        @include clearfix();
        float: left;
        border-radius: 8px;
        box-sizing: border-box;
        .sd_searchInput {
          float: left;
          width: 470px;
          height: 70px;
          background: #F5F5F5;
          background-size: 28px 28px;
          font-size: 30px;
          color: #333333;
          padding-left: 60px;
          padding-right: 60px;
          border: none;
          outline: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-radius: 10px 0 0 10px;
          &.search-on {
            width: 528px;
          }
          @include placeholder {
            color: #2B3752;
            opacity: 0.3;
          }
        }
        .sd_searchClear {
          width: 90px;
          height: 70px;
          position: absolute;
          margin-left: -90px;
          background: #F5F5F5;
          background-size: 30px 30px;
          .sd_delete_icon {
            width: 36px;
            height: 36px;
            margin-left: 32px;
            margin-top: 16px;
          }
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
    margin-right: 40px;
  }

  .clean {
    float: left;
    margin-top: 15px;
    margin-right: 10px;
    width: 30px;
    height: 40px;
    background-size: 100% 100%;
  }

  .main-search {
    box-sizing: border-box;
    width: 100%;
    .btn {
      width: 100px;
      height: 70px;
      background-color: #5d9cec;
    }
  }

  .no-more {
    display: block;
    text-align: center;
    font-size: 30px;
    margin: 20px 0;
    color: #BDBDBD;
    padding-bottom: 40px;
  }
</style>
