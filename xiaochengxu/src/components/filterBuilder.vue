<template>
  <section class="filter-inner">
    <section class="filter-bar">
      <article class="filter-item"
               :class="{'on':listShow||selectItem!==-1||selectMItem!==-1||pageInitial,'arrowRotate':listShow}"
               @click="showFilterBar">
        <span>{{param.changeTitle.length>0?selectTitle:param.title}}</span>
        <i class="icon-filter-arrow" v-if="param.index!==3"></i>
        <i class="icon-filter-hospital" v-if="param.index===3"></i>
      </article>
    </section>
    <transition name="fadeDown">
      <section class="filter-list-inner" data-alcode-mod='760' data-alcode-item-selector=".filter-list-item"
               v-if="param.index!==3" v-show="listShow&&selectIndex==param.index && maskerShow"
               @click.stop="">
        <section class="filter-list">
          <article class="filter-list-item" :class="{'on':selectItem===index}" @click.stop="selectFilter(item,index)"
                   v-for="(item,index) in param.dataList" :sps-data="getLocationId(item,index)" :key="index">
            <span>{{item[param.itemName]}}</span>
            <i class="icon-selected-item"></i>
          </article>
        </section>
      </section>
      <section class="filter-list-mulit-inner" v-if="param.index===3" v-show="listShow&&selectIndex==param.index">
        <section class="filter-list-mulit-box">
          <p class="filter-list-mulit-title">
            <span>医生级别（可多选）</span>
          </p>
          <ul class="filter-list-mulit">
            <li class="filter-list-mulit-item" :class="{'on':item.selected}" v-for="(item,index) in param.dataList"
                @click.stop="selectMulitItem(item,index)" :key="index">
              <span>{{item[param.itemName]}}</span>
            </li>
          </ul>
        </section>
        <section class="filter-list-mulit-box">
          <p class="filter-list-mulit-title">
            <span>医院级别</span>
          </p>
          <ul class="filter-list-mulit">
            <li class="filter-list-mulit-item" :class="{'on':selectItem===index}"
                v-for="(item,index) in param.levelList" @click.stop="selectItem=index;computedKeyword()" :key="index">
              <span>{{item.itemName}}</span>
            </li>
          </ul>
        </section>
        <section class="submit-button-box" data-alcode-mod='763'>
          <button class="submit-button" data-alcode='e179' :sps-data="keyword" @click.stop="ensureMulitFilter">确认
          </button>
        </section>
      </section>
    </transition>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/3/26.
   */
  export default {
    data() {
      return {
        listShow: false,
        selectItem: -1,
        selectMItem: -1,
        selectTitle: "",
        keyword: '',// 确认按钮需要的埋点数据
        pageInitial: false //小程序onShow时候确保所有页面样式初始化
      }
    },
    computed: {},
    methods: {
      // 埋点中获取 locationId 数据
      getLocationId(item, index) {
        return `Location_id:${index + 1};keyword:${item[this.param.itemName]}`
      },
      // 计算keyword
      computedKeyword() {
        let keywordArray = [];
        this.param.dataList.forEach((element, index) => {
          if (element.selected) {
            keywordArray.push(element.refValue);
          }
        });
        this.param.levelList.forEach((element, index) => {
          if (this.selectItem === index) {
            keywordArray.push(element.itemName);
          }
        });
        this.keyword = `keyword:${keywordArray.join("_")}`;
      },
      selectFilter(item, index) {
        this.$emit('selectFilter', {
          item,
          type: this.param.type
        });
        this.listShow = false;
        this.selectItem = index;
        this.selectTitle = item[this.param.itemName];
      },
      showFilterBar() {
        this.listShow = !this.listShow;
        this.$emit("filterShowCallback");
      },
      selectMulitItem(item, index) {
        if (item.type === "default") {
          this.param.dataList.forEach((element, index) => {
            if (element.type !== "default") {
              element.selected = false;
            }
          })
        } else {
          this.param.dataList.forEach((element, index) => {
            if (element.type === "default") {
              element.selected = false;
            }
          })
        }
        item.selected = !item.selected;
        this.selectMItem = index;
        this.computedKeyword();
      },
      ensureMulitFilter() {
        let result = {
          majorTitle: "",
          hospitalLevel: ""
        };
        let keywordArray = [];
        let majorArr = [];
        this.param.dataList.forEach((element, index) => {
          if (element.selected) {
            keywordArray.push(element.refValue);
            switch (element.refId) {
              case 1:
                majorArr.push(0);
                break;
              case 2:
                majorArr.push(10);
                break;
              case 3:
                majorArr.push(30);
                break;
              case 4:
                majorArr.push(60);
                break;
            }
          }
        });
        result.majorTitle = majorArr.join(",");
        this.param.levelList.forEach((element, index) => {
          if (this.selectItem === index) {
            result.hospitalLevel = element.itemType;
            keywordArray.push(element.itemName);
          }
        });
        this.keyword = `keyword:${keywordArray.join("_")}`;
        this.$emit('selectFilter', {
          item: result,
          type: this.param.type
        });
        this.listShow = false;
      }
    },
    mounted() {
      this.selectTitle = this.param.changeTitle;
    },
    onShow() {
    },
    onUnload() {
      this.selectTitle = this.param.changeTitle;
      this.selectItem = -1;
      this.pageInitial = false
    },
    watch: {
      listShow(flag) {
        if (this.selectIndex === this.param.index) {
          this.$emit("update:maskerShow", flag);
        }
      },
      selectIndex(index) {
        if (index !== this.param.index) {
          this.listShow = false;
        }
      },
      maskerShow(flag) {
        console.log(flag)
        if (!flag) {
          this.listShow = false;
        }
      }
    },

    props: {
      maskerShow: {
        default: false,
        type: Boolean
      },
      selectIndex: {
        default: -1,
        type: Number
      },
      param: {
        default() {
          return {};
        },
        type: Object
      }
    }

  }
</script>

<style lang="scss">

  .filter-inner {
    display: inline-block;
    vertical-align: middle;
    padding-top: 15px;
    background-color: #fff;
    margin-right: 56px;
    margin-bottom: 15px;
  }

  .filter-item {
    /*padding: 0 22.5px;*/
    text-align: center;
    font-size: 0;
    & > span {
      font-size: 30px;
      color: #222222;
      display: inline-block;
      vertical-align: middle;
      transition: all 0.2s linear;
      font-weight: bold
    }
    &.arrowRotate {
      .icon-filter-arrow {
        transform: rotate(180deg);
      }
    }
    &.on {
      & > span {
        color: #2EA9FE;
        font-weight: bold;
      }
      // .icon-filter-arrow {
      //   // opacity: 0.5;
      // }
      .icon-filter-hospital {
        background: url("/static/images/DrList/filter_on.png") no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }

  .icon-filter-arrow {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    @include triangle(20px, #222222, down);
    opacity: 0.7;
    position: relative;
    top: 5px;
    transform-origin: 50% 25%;
    transition: all 0.2s linear;

  }

  .icon-filter-hospital {
    margin-top: 6px;
    width: 24px;
    height: 24px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    background: url("/static/images/DrList/filter_off.png") no-repeat center center;
    background-size: 100% 100%;
  }

  .filter-list-inner {
    position: fixed;
    left: 0;
    right: 0;
    /*top: 271.5rpx;*/
    background-color: #fff;
    max-height: 820px;
    z-index: 5;
    text-align: left;
    overflow: auto;
    -webkit-transform: translateZ(0px); /*HELPS THE ABOVE WORK IN IOS5*/
    -webkit-transform: translate3d(0, 0, 0); /*HELPS THE ABOVE WORK IN IOS8*/
    -webkit-perspective: 1000; /*HELPS THE ABOVE WORK IN IOS8*/
    /*-webkit-overflow-scrolling: touch;*/
    & > .filter-list {
      border-top: solid 1px #f0f0f0;
      box-sizing: border-box;
      padding-left: 50px;
      min-height: calc(100% + 1px);
      & > .filter-list-item {
        padding: 30px 0;
        border-bottom: 1px solid #F5F5F5;
        &.on {
          position: relative;
          & > span {
            font-size: 30px;
            color: #29a3a3;
          }
          .icon-selected-item {
            width: 26px;
            height: 20px;
            position: absolute;
            top: 50%;
            right: 52px;
            margin-top: -10px;
            // background: url("http://m.allinmed.cn/static/image/mp/DrList/selected.png") no-repeat center center;
            background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/right.png") no-repeat center center;
            
            background-size: 100% 100%;
          }
        }
        & > span {
          font-size: 30px;
          color: #444444;
        }
      }
    }
  }

  .filter-list-mulit-inner {
    position: fixed;
    left: 0;
    right: 0;
    top: 180px;
    background-color: #fff;
    max-height: 700px;
    z-index: 5;
    box-sizing: border-box;
    padding: 0 53px;
    padding-right: 25px;
    border-top: solid 1px #f0f0f0;
    overflow: auto;
    .filter-list-mulit-box {
      margin: 50px 0;
      text-align: left;
      .filter-list-mulit-title {
        font-size: 30px;
        color: #909090;
      }
      .filter-list-mulit {
        font-size: 0;

        .filter-list-mulit-item {
          display: inline-block;
          vertical-align: middle;
          width: 200px;
          height: 72px;
          opacity: .8;
          background: #f5f6f9;
          border-radius: 8px;
          font-size: 28px;
          text-align: center;
          line-height: 72px;
          color: #5a5a5a;
          margin-right: 24px;
          margin-top: 28px;
          &.on {
            background-color: #2EA9FE;
            color: #ffffff;
          }
        }
      }
    }
  }

  .submit-button-box {
    text-align: center;
    margin: 60px 0;
    .submit-button {
      background-image: linear-gradient(-216deg, #33CCA6 0%, #33A6CC 100%);
      box-shadow: 0 3px 8px 0 rgba(51, 174, 196, 0.51);
      border-radius: 9999px;
      font-size: 36px;
      width: 570px;
      height: 88px;
      line-height: 88px;
      color: #ffffff;

    }
  }

  .fadeDown-enter-active,
  .fadeDown-leave-active {
    transition: all ease-in-out 0.5s;
  }

  .fadeDown-enter,
  .fadeDown-leave-to {
    opacity: 0;
    transform: translateY(-50%);
  }


</style>
