<template>
  <section>
    <div class="popupWindow-cloak"></div>
    <div class="popupWindow-popupWindow">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <button type="button" aria-label="Close" class="el-message-box__headerbtn"
                  @click="close">
            <i class="el-message-box__close el-icon-close"></i>
          </button>
        </div>
        <div class="popupWindow-popupWindow-title"><h6>请选择你要修改的位置</h6></div>
        <div class="el-message-box__content">
            <ul>
              <li v-for="(item,index) in imgCfgList"
                  :key="item.id"
                  :class="item.seleted?'popupWindow-popupWindow-itemChoose':'popupWindow-popupWindow-item'"
                  @click="choose(index)"
              >
                {{item.title}}
              </li>
            </ul>
        </div>
        <div class="el-message-box__btns">
          <button type="button"
                  :class="imgCfgSeleted?'popupWindow-popupWindow-submitDefault':'popupWindow-popupWindow-submit'"
                  @click="into">
            <span>进入</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/**
   * 选择图片配置弹出入口
   * @module ChooseImgCfgWindow.vue
   * @desc 首页图片配置弹出窗口，弹出窗口，选择图片类型，然后设置回调
   * @author qiaoliang
   * @date 2019/2/11 0011 上午 10:49
   * @event {click} [close] - 关闭当前弹窗事件 状态= false;
   * @event {click} [setImgCfgType] - 设置首页图片配置结果，与父值一致
   * @example 调用示例
     <keep-alive>
        <ChooseImgCfgWindow v-if="showChooseImgCfgWindow"
           @setImgCfgType="setImgCfgType"
          />
     </keep-alive>
   */
// 定义入口列表  1.首页背景图、2.tab背景图、4.活动专题入口图、5.会议入口图 6.菁英会
import comm from '@/assets/js/utils/comm';
const ImgCfgList = [
  {id: 1, seleted: false, title: '首页顶部背景图'},
  {id: 5, seleted: false, title: '会议入口图'},
  {id: 4, seleted: false, title: '活动专题入口图'},
  {id: 6, seleted: false, title: '菁英会'}
  // 已开发完成，v3.4开发，后产品表示暂不上，注掉这个功能
//    {id: 2, seleted: false, title: 'tab背景图'}
];
const ChooseImgCfgWindow = {
  data() {
    return {
      imgCfgSeleted: false,
      imgCfgList: comm.deepCopy(ImgCfgList)
    };
  },
  destroyed() {
    this.imgCfgSeleted = false;
    this.imgCfgList = comm.deepCopy(ImgCfgList);
  },
  methods: {
    // 关闭回退到菜单列表页
    close() {
      this.$router.push({path: './home'});
    },
    choose(index) {
      for (const item of this.imgCfgList) {
        if (item.seleted) item.seleted = false;
      }
      this.imgCfgList[index].seleted = true;
      this.imgCfgSeleted = true;
    },
    into() {
      for (const item of this.imgCfgList) {
        if (item.seleted) {
          this.imgCfgList = item;
          this.$emit('setImgCfgType', this.imgCfgList);
          break;
        }
      }
    }
  }
};
export default ChooseImgCfgWindow;
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .popupWindow-cloak{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      opacity: 0.7;
      background: #000000;
  }

  .popupWindow-popupWindow{
      z-index: 11;
      position: fixed;
      left: 0%;
      top: 25%;
      bottom: 0;
      right: 0;
      text-align: center;

      .popupWindow-popupWindow-title{
          color: #222222;
          letter-spacing: 0;
          line-height: 24px;
          text-align: center;
      }
      .popupWindow-popupWindow-item{
          border: 1px solid #cad1ed;
          border-radius: 3px;
          text-align: center;
          width: 110px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          color: #4B67D6;
          float: left;
          margin: 10px;
          padding: 5px;
          cursor: pointer;
      }
      .popupWindow-popupWindow-itemChoose{
          border: 1px solid #cad1ed;
          border-radius: 3px;
          text-align: center;
          width: 110px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          color: #ffffff;
          float: left;
          margin: 10px;
          padding: 5px;
          cursor: pointer;
          background: #4B67D6;
      }
      .el-message-box{
          width:380px;
          height: 300px;

          .el-message-box__btns{
              padding-top: 100px;
              text-align:center;
              .popupWindow-popupWindow-submitDefault{
                  cursor: pointer;
                  width:160px;
                  height: 41px;
                  background: #4B67D6;
                  border-radius: 3px;
                  font-family: PingFangSC-Regular;
                  font-size: 15px;
                  color: #FFFFFF;
                  letter-spacing: 0;
                  text-align: center;
                  line-height: 15px;
                  margin-top: 20px;
              }
              .popupWindow-popupWindow-submit{
                  cursor: pointer;
                  width:160px;
                  height: 41px;
                  background: #b5b8c3;
                  border-radius: 3px;
                  font-family: PingFangSC-Regular;
                  font-size: 15px;
                  color: #FFFFFF;
                  letter-spacing: 0;
                  text-align: center;
                  line-height: 15px;
                  margin-top: 20px;
              }
          }
          .el-message-box__content {
              position: relative;
              padding: 28px 45px;
              color: #606266;
              font-size: 14px;
          }

      }
  }

</style>
