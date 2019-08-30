<template>
<section>
  <canvas-creator :params="params"
                  ref="canvas" v-if="isshow" @success="onCreateSuccess" @fail="onFail">

  </canvas-creator>
  <img :src="shareImg" alt="">
  <button @click="saveImg">保存图片</button>
</section>
</template>

<script>
  import CanvasCreator from "components/canvasCreator/canvasCreator2";
    export default {
      data(){
        return{
          isshow:false,
          params:{},
          shareImg:'',
          doctor:{
            fullName:'ds'
          }
        }
      },
      methods:{
        onCreateSuccess(e) {
          wx.hideLoading();
          this.shareImg = e;
        },
        onFail(e){

        },
        saveImg(){
          let t=this;
          if (!this.doctor.fullName) {
            this.params = {
              width: 628,
              height: 642,
              backgroundColor: '#fff',
              debug: false,
              texts: [
                {
                  x: 90,
                  y: 52,
                  baseLine: 'middle',
                  text: '北京解放军总医院就医指南医南南院就医指南南',
                  lineNum: 2,
                  fontSize: 38,
                  width: 494,
                  color: 'white',
                  lineHeight: 44,
                  zIndex: 1
                },
                {
                  x: 46,
                  y: 212,
                  baseLine: 'middle',
                  text: '10个内容',
                  fontSize: 34,
                  width: 532,
                  color: '#333333',
                  lineHeight: 34,
                  fontWeight:'bold',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 280,
                  baseLine: 'middle',
                  text: '- 如何挂专家号，其实并不难',
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 338,
                  baseLine: 'middle',
                  text: '- 外地就医，医保是否可以转入',
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 382,
                  baseLine: 'middle',
                  text: '…',
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 204,
                  y: 520,
                  baseLine: 'middle',
                  text: '微信中识别上方小程序码 ',
                  fontSize: 26,
                  color: '#818181',
                  zIndex: 1
                },
                {
                  x: 204,
                  y: 555,
                  baseLine: 'middle',
                  text: '免费查看所有内容',
                  fontSize: 26,
                  color: '#818181',
                  zIndex: 1
                },
              ],
              images: [
                {
                  width: 628,
                  height: 642,
                  x: 0,
                  y: 0,
                  url: 'https://m.allinmed.cn/static/image/mp/index/1.1.5/bg_paint_small.png',
                  zIndex: 0,
                  backgroundColor: '#000000'
                },
                {
                  width: 126,
                  height: 126,
                  x: 44,
                  y: 476,
                  url: "https://img05.allinmd.cn/public1/M01/1B/F4/wKgBL1uYuT6ATsTaAACLw8VTixw111_c_p_100_100.JPG",
                  zIndex: 1,
                },
              ]
            };
          } else{
            this.params = {
              width: 628,
              height: 862,
              backgroundColor: '#fff',
              debug: false,
              texts: [
                {
                  x: 90,
                  y: 52,
                  baseLine: 'middle',
                  text: '北京解放军总医院就医指南医南南院就医指南南',
                  lineNum: 2,
                  fontSize: 38,
                  width: 494,
                  color: 'white',
                  lineHeight: 44,
                  zIndex: 1
                },
                {
                  x: 46,
                  y: 212,
                  baseLine: 'middle',
                  text: '10个内容',
                  fontSize: 34,
                  width: 532,
                  color: '#333333',
                  lineHeight: 34,
                  fontWeight:'bold',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 280,
                  baseLine: 'middle',
                  text: '- 如何挂专家号，其实并不难',
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 338,
                  baseLine: 'middle',
                  text: '- 外地就医，医保是否可以转入',
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 48,
                  y: 382,
                  baseLine: 'middle',
                  text: '…',
                  fontSize: 32,
                  color: '#777777',
                  zIndex: 1
                },
                {
                  x: 44,
                  y: 452,
                  baseLine: 'middle',
                  text: '来自',
                  fontSize: 34,
                  color: '#333333',
                  zIndex: 1
                },
                {
                  x: 168,
                  y: 540,
                  baseLine: 'middle',
                  text: '主诊医生: 陶惠人',
                  fontSize: 32,
                  color: '#333333',
                  zIndex: 1
                },
                {
                  x: 168,
                  y: 586,
                  baseLine: 'middle',
                  text: '主任医师 深圳大学总医院附属',
                  fontSize: 26,
                  color: '#888888',
                  zIndex: 1
                },
                {
                  x: 204,
                  y: 738,
                  baseLine: 'middle',
                  text: '微信中识别上方小程序码 ',
                  fontSize: 26,
                  color: '#818181',
                  zIndex: 1
                },
                {
                  x: 204,
                  y: 770,
                  baseLine: 'middle',
                  text: '免费查看所有内容',
                  fontSize: 26,
                  color: '#818181',
                  zIndex: 1
                },
              ],
              images: [
                {
                  width: 628,
                  height: 862,
                  x: 0,
                  y: 0,
                  url: 'https://m.allinmed.cn/static/image/mp/index/1.1.5/bg_paint_big.png',
                  zIndex: 0,
                  backgroundColor: '#000000'
                },
                {
                  width: 88,
                  height: 88,
                  x: 64,
                  y: 520,
                  url: 'https://img05.allinmd.cn/public1/M01/1B/F4/wKgBL1uYuT6ATsTaAACLw8VTixw111_c_p_100_100.JPG',
                  circle:1,
                  zIndex: 1,
                },
                {
                  width: 126,
                  height: 126,
                  x: 44,
                  y: 696,
                  url: "https://img05.allinmd.cn/public1/M01/1B/F4/wKgBL1uYuT6ATsTaAACLw8VTixw111_c_p_100_100.JPG",
                  zIndex: 1,
                },
              ]
            };
          }

          t.isshow=true;
          this.$nextTick(() => {
            this.$refs.canvas.onCreate();
          })
        }
      },
      mounted(){
      },
      components: {
        CanvasCreator
      }
    }
</script>

<style scoped>
  img{
    display: block;
    margin: auto;
    width: 628px;
    height: 862px;
  }

</style>
