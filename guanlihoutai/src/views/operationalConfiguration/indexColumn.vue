<template>
  <section class='indexColumn'>
    <h3>首页栏目排序</h3>
    <div class='indexColumn-sort'>
      <ul>
        <li v-for='(item,index) in list' :key='index'>
          <div class='indexColumn-columnUpPart'>
            <div class='indexColumn-columnUpPart-left'>{{index+1}}.</div>
            <div class='indexColumn-columnUpPart-right'>
              <span @click='movePrevious(item)'><i class='el-icon-caret-left'></i><i>上移</i></span>
              <span @click='moveNext(item)'><i>下移</i><i class='el-icon-caret-right'></i></span>
            </div>
          </div>
          <div class='indexColumn-columnDownPart'>
            <div class='indexColumn-columnDownPart-up'><h6>{{item.columnName}}</h6></div>
            <div class='indexColumn-columnDownPart-middleLine'></div>
            <div class='indexColumn-columnDownPart-down'>
              <div @click='stick(item)'>{{item.isHeader==1?'取消置顶':'置顶'}}</div>
              <div class='indexColumn-columnDownPart-vertical'></div>
              <div @click='directiveHref(item)'>详情</div>
              <div class='indexColumn-columnDownPart-vertical'></div>
              <div @click='remove(item)'>下架</div>
            </div>
          </div>
        </li>
        <li @click='setColumnBtnCallPopupWindow'>
          <div class='indexColumn-columnAdd'>
            <div><i class='el-icon-circle-plus'></i><i>添加</i></div>
            <div>1个栏目到首页显示</div>
          </div>
        </li>
      </ul>
      <div class='indexColumn-publish'>
        <div class='indexColumn-publish-btn'
             @click='publishColumnSort'>上线
        </div>
      </div>
    </div>

    <div class='indexColumn-cloak' v-show='isPopupWindow'></div>
    <div class='indexColumn-popupWindow' v-show='isPopupWindow'>
      <div class='el-message-box' :style='popupWindowStyle'>
        <div class='el-message-box__header'>
          <button type='button' aria-label='Close' class='el-message-box__headerbtn'
                  @click='closePopupWindow'>
            <i class='el-message-box__close el-icon-close'></i>
          </button>
        </div>
        <div class='indexColumn-popupWindow-title'><h6>添加栏目到首页展示</h6></div>
        <div class='el-message-box__content'>
          <div>
            <div class='indexColumn-popupWindow-left' v-if='popupLeftList.length'>
              <div class='indexColumn-popupWindow-subhead'>可选栏目</div>
              <ul>
                <li v-for='item in popupLeftList'
                    :key='item.columnId'
                    @click='chooseColumn(item)'>
                  <div class='indexColumn-popupWindow-iconSelected'>
                    <img
                      :src='!item.selected?selectedIcon.unselected:selectedIcon.selected'/>
                  </div>
                  <div class='indexColumn-popupWindow-columnName'>{{item.columnName}}</div>
                </li>
              </ul>
              <div class='indexColumn-popupWindow-chooseBtn'
                   @click='setColumn'>保存
              </div>
            </div>
            <div class='indexColumn-popupWindow-separateLine' v-if='popupLeftList.length'></div>
            <div class='indexColumn-popupWindow-right' :style='popupWindowRightStyle'>
              <div class='indexColumn-popupWindow-subhead'>全部栏目</div>
              <ul>
                <li v-for='item in popupRightList'
                    :key='item.columnId'>
                  <div class='indexColumn-popupWindow-dot'></div>
                  <div class='indexColumn-popupWindow-columnName'>{{item.columnName}}
                    {{item.showType==1?'(已在首页)':'(测试网)'}}
                  </div>
                </li>
              </ul>
              <router-link :to='{path:"/columnManager",query:{}}' class='indexColumn-popupWindow-around'>
                <div class='indexColumn-popupWindow-chooseBtn'>去栏目后台新增一个栏目</div>
              </router-link>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import comm from '@/assets/js/utils/comm';
const IndexColumn = {
  data() {
    return {
      list: [], // 首页栏目列表
      popupLeftList: [], // 弹出左列表
      popupRightList: [], // 弹出右列表-全部
      isPopupWindow: false, // 弹出状态
      selectedIcon: {
        selected: require('../../../static/images/icons/icon-tick-selected.png'),
        unselected: require('../../../static/images/icons/icon-tick-unselected.png')
      }
    };
  },
  mounted() {
    this.init();
  },
  destroyed() {
    comm.goBack();
  },
  computed: {
    popupWindowStyle() {
      return this.popupLeftList.length && this.popupRightList.length
        ? {width: '650px'} : '';
    },
    popupWindowRightStyle() {
      return !this.popupLeftList.length
        ? {'margin-left': '64px'} : '';
    }
  },
  methods: {
    // 获取首页栏目排序 isShowType:1 显示位置1-首页栏目  isHeader是否置顶1-是0-否 sortId 排序
    init() {
      comm.openLoading('加载中...');
      const promise = comm.sendAxios('indexColumnList', {
        isValid: 1, // 是  有效无效 1-有效0-无效
        showType: 1, // 是 显示位置 1-在0-不在
        sortType: 2, // 是 排序类型1-按照创建时间倒叙2-先按是否置顶排序,再按sortId号排序
        firstResult: 0, // 是 分页参数 0
        maxResult: 50 // 是 分页参数 20
      });
      const _this = this;
      promise.then((res) => {
        comm.closeLoading();
        if (res.responseStatus && res.responseData.dataList.length > 0) {
          _this.list = res.responseData.dataList;
        }
        else {
          _this.$allin_confirm({title: '提示', content: '暂无数据', type: 'notice'});
        }
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
      });
    },
    // 跳转 1-课程聚合2-视频聚合3-直播聚合4-活动5-骨科会议
    directiveHref(item) {
      let url = '';
      switch (parseInt(item.columnType)) {
        case 1:
          url = 'courseTypeColumn';
          break;
        case 2:
          url = 'videoTypeColumn';
          break;
        case 3:
          url = 'liveTypeColumn';
          break;
        case 4:
          if (item.columnId === '1563551999999') {
            url = 'wphManage';
          }
          else {
            url = 'activityColumn';
          }
          break;
        case 5:
          window.open('//manager.allinmd.cn/allin_manager_platform/mallBackControlAction!login_index', '_blank');
          break;
        // case 6:
        //   url = 'wphManage';
        //   break;
        default:
          url = 'indexColumn';
      }

      if (url) {
        this.$router.push({path: url, query: {columnId: item.columnId, columnName: item.columnName}});
      }
    },
    publishColumnSort() {
      let _this = this;
      this.$allin_confirm({
        title: '提示',
        content: '确定将当前的首页栏目展示上线到外网么？',
        done: function() {
          comm.openLoading('发布中...');
          const promise = comm.sendAxios('publishColumn', {configList: JSON.stringify(_this.getDifferenceColumn())});
          promise.then((res) => {
            comm.closeLoading();
            if (res.responseStatus) {
              _this.$allin_confirm({title: '提示', type: 'notice', content: '已上线到外网', btnName: '知道了'});
            }
            else {
              _this.$allin_confirm({title: '提示', type: 'notice', content: '上线到外网失败', btnName: '知道了'});
            }
            ;
          }).catch((e) => {
            comm.closeLoading();
            if (!comm.axios.isCancel(e)) {
              _this.$allin_confirm({
                title: '提示',
                content: '上线到外网失败',
                btnName: '知道了',
                type: 'notice'
              });
            }
          });
        }
      });
    },
    chooseColumn(item) { // 选择可选栏目
      for (let x = 0; x < this.popupLeftList.length; x++) {
        if (this.popupLeftList[x].columnId === item.columnId) {
          if (!this.popupLeftList[x].selected) {
            this.$set(this.popupLeftList, x, Object.assign(this.popupLeftList[x], {'selected': true}));
          }
          else {
            this.$set(this.popupLeftList, x, Object.assign(this.popupLeftList[x], {'selected': false}));
          }
        }
      }
    },
    getDifferenceColumn() { // list/popupLeftList 将两者的合集取回全部发送
      let pushColumnItems = JSON.parse(JSON.stringify(this.list));
      return pushColumnItems.concat(this.popupLeftList);
    },
    closePopupWindow() {
      this.isPopupWindow = false;
    },
    setColumnBtnCallPopupWindow() {
      this.isPopupWindow = true;

      // 只允许请求一次
      if (this.popupLeftList.length > 0 || this.popupRightList.length > 0) return false;

      const leftPromise = comm.sendAxios('indexColumnList', {
        isValid: 1,
        showType: 0,
        sortType: 1,
        firstResult: 0,
        maxResult: 50
      });
      const rightPromise = comm.sendAxios('indexColumnList', {
        isValid: 1,
        sortType: 1,
        firstResult: 0,
        maxResult: 50
      });

      comm.openLoading('加载中...');
      const _this = this;
      comm.axios.all([leftPromise, rightPromise]).then(
        comm.axios.spread((left, right) => {
          comm.closeLoading();
          if (left.responseStatus) {
            _this.popupLeftList = !left.responseData.dataList ? [] : left.responseData.dataList;
          }
          if (right.responseStatus) {
            _this.popupRightList = !right.responseData.dataList ? [] : right.responseData.dataList;
          }
        })
      ).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) {
          _this.$allin_confirm({
            title: '提示',
            content: '查询失败',
            btnName: '知道了',
            type: 'notice'
          });
        }
      });
    },
    setColumn() { // 临时从可选的栏目装载到首页排序处
      for (let x = 0; x < this.popupLeftList.length; x++) {
        if (this.popupLeftList[x].selected) {
          delete this.popupLeftList[x].selected;
          this.popupLeftList[x].showType = 1;
          this.list.push(this.popupLeftList[x]); // 装载到首页列表里
          this.popupLeftList.splice(x, 1); // 被选中并装载到首页的删掉
          x = x - 1;
        }
      }
      this.ascSortId();
      this.closePopupWindow();
    },
    moveNext(item) {
      const subscript = this.getArrSubscript(item);
      if (subscript === this.list.length - 1 || (this.list[subscript].isHeader === '1' && this.list[subscript + 1].isHeader !== '1')) {
        return false;
      }
      else if (subscript !== null) {
        let tempSortId = this.list[subscript].sortId;
        this.list[subscript].sortId = this.list[subscript + 1].sortId;
        this.list[subscript + 1].sortId = tempSortId;
        this.list.splice(subscript, 1);
        this.list.splice(subscript + 1, 0, item);
      }
    },
    movePrevious(item) {
      const subscript = this.getArrSubscript(item);
      if (subscript === 0 || (this.list[subscript - 1].isHeader === '1' && this.list[subscript].isHeader !== '1')) {
        return false;
      }
      else if (subscript !== null) {
        let tempSortId = this.list[subscript].sortId;
        this.list[subscript].sortId = this.list[subscript - 1].sortId;
        this.list[subscript - 1].sortId = tempSortId;
        this.list.splice(subscript, 1);
        this.list.splice(subscript - 1, 0, item);
      }
    },
    stick(item) {
      const subscript = this.getArrSubscript(item);
      if (item.isHeader === '0') {
        if (subscript === 0) {
          return false;
        }
        else {
          this.list[subscript].isHeader = 1;
        }
      }
      else {
        this.list[subscript].isHeader = 0;
      }

      this.ascSortId();
    },
    remove(item) {
      const _this = this;
      this.$allin_confirm({
        title: '提示',
        content: '确定在首页展示下架此栏目吗？',
        done: function() {
          const subscript = _this.getArrSubscript(item);
          _this.list[subscript].showType = 0; // 下架.不显示在首页
          _this.list[subscript].isHeader = 0; // 下架时把原有置顶也取消
          _this.popupLeftList.push(item); // 下架同时追加到可选栏目中
          _this.list.splice(subscript, 1);
        }
      });
    },
    getArrSubscript(item) {
      for (let x = 0; x < this.list.length; x++) {
        if (this.list[x].columnId === item.columnId) {
          return x;
        }
      }
    },
    ascSortId() { // sortId isHeader
      this.list.sort((a, b) => {
        return a.sortId - b.sortId;
      });
      this.list.sort((a, b) => {
        return b.isHeader - a.isHeader;
      });
    }
  }
};
export default IndexColumn;
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
  .indexColumn {

    h3 {
      margin: 36px auto 25px auto;
      width: 880px;
    }

    .indexColumn-sort {
      width: 880px;
      min-height: 543px;
      overflow-y: auto;
      margin: 25px auto 25px auto;
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;

      .indexColumn-publish {
        float: right;
        position: relative;
        margin-top: 95px;
        margin-bottom: 41px;
        margin-right: 44px;

        .indexColumn-publish-btn {
          cursor: pointer;
          width: 140px;
          height: 32px;
          background: #3846DC;
          border-radius: 3px;
          text-align: center;
          line-height: 32px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #FFFFFF;
          letter-spacing: 0;
        }

      }
      .indexColumn-columnAdd {
        cursor: pointer;
        margin-top: 36px;
        width: 238px;
        height: 95px;
        border: 1px solid #4B67D6;
        opacity: 0.5;
        border-radius: 3px;
        text-align: center;

        .el-icon-circle-plus {
          color: #0d17d6;
        }

        i {
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #4B67D6;
          letter-spacing: 0;
          line-height: 16px;
        }

        div:first-child {
          margin-top: 34px;
        }

        div:nth-child(2) {
          margin-top: 8px;
          opacity: 0.6;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #4B67D6;
          letter-spacing: 0;
          line-height: 14px;
        }

      }
      ul {
        float: left;

        li {
          margin: 36px 35px 0 0;
          width: 240px;
          height: 133px;
          float: left;

          .indexColumn-columnUpPart {

            .indexColumn-columnUpPart-left {
              width: 35px;
              float: left;
              font-family: PingFangSC-Medium;
              font-size: 25px;
              color: #999999;
              letter-spacing: 0;
              line-height: 20px;
            }

            .indexColumn-columnUpPart-right {
              margin-top: 5px;
              float: right;
              width: 150px;
              font-family: PingFangSC-Regular;
              font-size: 10px;
              color: #a6a6a6;
              letter-spacing: 0;
              line-height: 10px;
              text-align: right;

              span {
                cursor: pointer;
              }

              span:nth-child(2) {
                margin-left: 15px;
              }

            }
          }
          .indexColumn-columnDownPart {
            margin-top: 16px;
            background: #F7F9FC;
            border-radius: 3px;
            height: 97px;
            float: left;
            width: 240px;

            .indexColumn-columnDownPart-up {
              height: 65px;
              text-align: center;
              color: #222222;
              letter-spacing: 0;
              line-height: 65px;
            }

            .indexColumn-columnDownPart-middleLine {
              border: 0.5px solid #6483E9;
              opacity: 0.1;
            }

            .indexColumn-columnDownPart-down {

              .indexColumn-columnDownPart-vertical {
                opacity: 0.1;
                width: 1px;
                height: 11px;
                background: #6483E9;
                float: left;
                margin-top: 10px;
              }

              div:nth-child(odd) {
                cursor: pointer;
                width: 78px;
                float: left;
                text-align: center;
                font-family: PingFangSC-Medium;
                font-size: 12px;
                color: #4B67D6;
                letter-spacing: 0;
                line-height: 31.5px;
              }

              div:nth-child(5) {
                color: #EB3B46;
              }

            }
          }
        }
        li:nth-child(3n+1) {
          margin-left: 44px;
        }

        li:nth-child(3n) {
          margin-right: 44px;
        }

      }

    }

  }

  .indexColumn-cloak {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    opacity: 0.7;
    background: #000000;
  }

  .indexColumn-popupWindow {
    z-index: 11;
    position: fixed;
    left: 0%;
    top: 25%;
    bottom: 0;
    right: 0;
    text-align: center;

    .indexColumn-popupWindow-title {
      color: #222222;
      letter-spacing: 0;
      line-height: 24px;
      text-align: center;
    }

    .el-message-box {
      height: 450px;

      .indexColumn-popupWindow-iconSelected {
        float: left;
        top: -2px;
      }

      .indexColumn-popupWindow-subhead {
        margin: 10px 0 6px 0;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #666666;
        letter-spacing: 0;
        line-height: 16px;
      }

      ul {
        height: 276px;
        overflow-y: auto;

        li {
          cursor: pointer;
          position: relative;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          color: #222222;
          letter-spacing: 0;
          height: 22px;
          float: left;
          width: 246px;
          margin: 10px 0px;
        }

      }
      .indexColumn-popupWindow-left {
        width: 264px;
        margin-left: 13px;
        float: left;

        li {

          .indexColumn-popupWindow-iconSelected {
            position: relative;
          }

          .indexColumn-popupWindow-columnName {
            margin-left: 27px;
          }

        }
        .indexColumn-popupWindow-chooseBtn {
          cursor: pointer;
          text-align: center;
          line-height: 41px;
          width: 264px;
          height: 41px;
          background: #4B67D6;
          border-radius: 3px;
          font-family: PingFangSC-Regular;
          font-size: 15px;
          color: #FFFFFF;
          letter-spacing: 0;
          margin: 0 auto;
        }

      }
      .indexColumn-popupWindow-separateLine {
        width: 0.5px;
        background: #E9EBED;
        margin: 10px 30px;
        float: left;
        height: 350px;
      }

      .indexColumn-popupWindow-right {
        width: 264px;
        float: left;

        li {

          .indexColumn-popupWindow-dot {
            width: 4px;
            height: 4px;
            background: #BBBBBB;
            float: left;
            position: relative;
            top: 6px;
          }

          .indexColumn-popupWindow-columnName {
            margin-left: 10px;
          }

        }
        .indexColumn-popupWindow-chooseBtn {
          cursor: pointer;
          text-align: center;
          line-height: 41px;
          width: 264px;
          height: 41px;
          background: #A1A8C0;
          border-radius: 3px;
          font-family: PingFangSC-Regular;
          font-size: 15px;
          color: #FFFFFF;
          letter-spacing: 0;
          margin: 0 auto;
        }

      }
    }
  }
</style>
