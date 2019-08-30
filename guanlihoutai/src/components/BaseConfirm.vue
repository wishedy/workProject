<template>
    <section class="baseConfirm" v-if="visible" id="allin_confirm">
      <div class="baseConfirm-cloak"></div>
      <div class="baseConfirm-popupWindow">
        <div class="el-message-box">
          <div class="el-message-box__header">
            <button type="button" aria-label="Close" class="el-message-box__headerbtn"
                    @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </button>
          </div>
          <div v-if="title"><h6>{{title}}</h6></div>
          <div class="el-message-box__content">
              <div :class="contentStyle">{{content}}</div>
          </div>
          <div class="baseConfirm-popupWindow-singleButton" v-if="type">
              <div class="baseConfirm-popupWindow-decided" @click="decided">{{btnName}}</div>
          </div>
          <div class="baseConfirm-popupWindow-doubleButton" v-if="!type">
              <div class="baseConfirm-popupWindow-close" @click="close">取消</div>
              <div class="baseConfirm-popupWindow-decided" @click="decided">确定</div>
          </div>
        </div>
      </div>
    </section>
</template>
<script>
/**
   * 确认框
   * @module BaseConfirm.vue
   * @desc 用于确认框弹出场景，可以进行标题、按钮、内容、按钮名称，回调等自定义
   * @author qiaoliang
   * @date 2019/1/15 0015 下午 4:18
   * @param {String} [type]    - 通知类型：String值为notice为单按钮，其它为双按钮
   * @param {String} [btnName] - 按钮名称： 默认取消/确定 可自定义为知道了
   * @param {String} [title] -   通知标题： 默认没有，如提示
   * @param {String} [content] - 通知内容： 默认没有，如确定清楚了吗？
   * @param {Function} [done] -  通知回调： 默认没有，用于在双按钮时，如果确定再操作某事
   * @param {Function} [cancel] -  取消操作的回调： 默认没有，用于在双按钮时，如果取消再操作某事
   * @example 调用示例
   * this.$allin_confirm({title: '提示', content:  "上线到外网失败",btnName: "知道了", type: "notice"});
   */
import comm from '@/assets/js/utils/comm';
export default{
  data() {
    return {
      visible: false,
      type: '', // notice为通知，其它为双选
      btnName: '', // 按钮名称 单按钮场景时有
      title: '', // 标题
      content: '', // 正文
      done: null, // 确定回调,
      cancel: null// 关闭回调
    };
  },
  mounted() {
    this._initBaseConfirm();
  },
  computed: {
    // 内容样式
    contentStyle() {
      return comm.getByteLen(this.content) < 48
        ? 'baseConfirm-popupWindow-centerContent'
        : 'baseConfirm-popupWindow-content';
    }
  },
  methods: {
    _initBaseConfirm() {
      // 按钮类别 notice为单按钮，否则双按钮
      this.type = this.type === 'notice';
      this.btnName = !this.btnName ? '确定' : this.btnName;
      this.title = !this.title ? '' : this.title;
      this.content = !this.content ? '' : this.content;
      if (comm.toRawType(this.done) !== 'Function') {
        this.done = null;
      }
      if (comm.toRawType(this.cancel) !== 'Function') {
        this.cancel = null;
      }
    },
    decided() {
      this.done && this.done();
      this.$el.parentNode.removeChild(this.$el);
    },
    close() {
      this.cancel && this.cancel();
      this.visible = false;
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>

<style lang="scss" scoped rel='stylesheet/scss'>
  .baseConfirm{
      .baseConfirm-cloak{
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          opacity: 0.7;
          background: #000000;
      }
      .baseConfirm-popupWindow {
          z-index: 10000;
          position: fixed;
          left: 0%;
          top: 25%;
          bottom: 0;
          right: 0;
          text-align: center;
          h6{
              text-align: center;
              font-size: 20px;
              color: #2C343A;
              margin-top: 5px;
          }
          .baseConfirm-popupWindow-content{
             font-family: PingFangSC-Medium;
             font-size: 15px;
             color: #6C7492;
             letter-spacing: 0;
             padding-left: 12px;
             padding-right: 5px;
             margin-top: 8px;
             line-height: 20px;
           }
          .baseConfirm-popupWindow-centerContent{
              font-family: PingFangSC-Medium;
              font-size: 15px;
              color: #6C7492;
              letter-spacing: 0;
              padding-left: 12px;
              padding-right: 5px;
              margin-top: 8px;
              line-height: 20px;
              text-align:center;
          }
          .baseConfirm-popupWindow-doubleButton{
              margin: 0 auto;
              width: 240px;
              margin-top: 36px;
              padding-bottom: 62px;
              .baseConfirm-popupWindow-close{
                  cursor: pointer;
                  width: 110px;
                  height: 41px;
                  background: #A1A8C0;
                  border-radius: 3px;
                  font-family: PingFangSC-Regular;
                  font-size: 15px;
                  color: #FFFFFF;
                  letter-spacing: 0;
                  text-align: center;
                  line-height: 41px;
                  float:left;
              }
              .baseConfirm-popupWindow-decided{
                  cursor: pointer;
                  width: 110px;
                  height: 41px;
                  background: #4B67D6;
                  border-radius: 3px;
                  font-family: PingFangSC-Regular;
                  font-size: 15px;
                  color: #FFFFFF;
                  letter-spacing: 0;
                  text-align: center;
                  line-height: 41px;
                  margin-left: 20px;
                  float:left;
              }
          }
          .baseConfirm-popupWindow-singleButton{
              width: 110px;
              height: 41px;
              margin:0 auto;
              margin-bottom: 22px;
              cursor:pointer;
              .baseConfirm-popupWindow-decided{
                  margin-top: 48px;
                  background: #4B67D6;
                  border-radius: 3px;
                  font-family: PingFangSC-Regular;
                  font-size: 15px;
                  color: #FFFFFF;
                  letter-spacing: 0;
                  text-align: center;
                  line-height: 41px;
              }
          }
      }
  }
</style>
