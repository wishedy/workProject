<template>
  <div class="container">
    <section class="slider">
      <section class="slider-stick__wrap" @click="tap">
        <p class="slider-stick slider-stick__unselected"></p>
        <!--<p class="slider-stick slider-stick__selected" :style="{width:left+'rpx'}"></p>-->
        <p class="slider-block" @touchmove.prevent="move(0,$event)" :style="{left:left+'rpx'}"></p>
      </section>
      <!--<span class="slider-value font-14">{{value}}</span>-->
    </section>
    <ul class="value-list">
      <li>0</li>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
      <li>7</li>
      <li>8</li>
      <li>9</li>
      <li>10</li>
    </ul>
    <section class="bg-helper"></section>
  </div>

</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/7/18.
   */
  export default {
    data() {
      return {
        ratio: '',
        left: '',
        startX: '',
        endX: '',
        width: '',
        circle: '',
        left1: '',
        left2: ''
      }
    },
    computed:{
      stickLeft () {
        if (this.type !== 'single') {
          return Math.min(this.left1, this.left2)
        }
      },
      stickWidth () {
        if (this.type !== 'single') {
          return Math.abs(this.left1 - this.left2)
        }
      },
      valueMin () {
        if (this.type !== 'single') {
          return Math.min(this.value[0], this.value[1])
        }
      },
      valueMax () {
        if (this.type !== 'single') {
          return Math.max(this.value[0], this.value[1])
        }
      }

    },
    props: {
      type: {
        type: String,
        default: 'single'
      },
      componentId: {
        type: String,
        default: ''
      },
      value: {
        type: Number,
        default:0
      },
      max: {
        type: Number,
        default: 10,
      },
      min: {
        type: Number,
        default: 0,
      }
    },
    methods: {
      tap(e) {
        this.count(e.mp.detail.x, 'tap')
      },
      move(index, e) {
        const endX = e.mp.touches[0].clientX
        this.count(endX, 'move', Number(index))
      },

      count(endX, eventName, index) {
        let distance = endX - this.startX
        if (distance > this.width) {
          distance = this.width
        }
        if (distance < 0) {
          distance = 0
        }
        if (this.type === 'single') {
          this.left = this.countLeft(distance)
          this.value = this.countValue(distance)
        } else {
          if (eventName === 'tap') {
            if ((this.left1 < this.left2 && this.left2 < distance) || (distance < this.left2 && this.left2 < this.left1) || (this.left2 < this.left1 && distance < this.left1)) {
              this.left2 = this.countLeft(distance)
              this.value[1] = this.countValue(distance)
            } else {
              this.left1 = this.countLeft(distance)
              this.value[0] = this.countValue(distance)
            }
          } else {
            if (index === 0) {
              this.left1 = this.countLeft(distance)
            } else {
              this.left2 = this.countLeft(distance)
            }
            this.value[index] = this.countValue(distance)
          }
        }
      },

      countLeft(distance) {
        return distance - this.circle / 2
      },

      countValue(distance) {
        return Math.round(distance / this.ratio) + this.min
      },


    },
    mounted() {
      wx.createSelectorQuery().select('.slider .slider-stick__wrap').boundingClientRect((res) => {
        this.width = res.width
        this.startX = res.left
        wx.createSelectorQuery().select('.slider .slider-block').boundingClientRect((res) => {
          this.circle = res.width
          this.ratio = this.width / (this.max - this.min)
          if (this.type === 'single') {
            this.left = this.ratio * (this.value - this.min) - this.circle / 2
          } else {
            this.left1 = this.ratio * (this.value[0] - this.min) - this.circle / 2
            this.left2 = this.ratio * (this.value[1] - this.min) - this.circle / 2
          }
        }).exec()
      }).exec()
    },
  }
</script>

<style lang="scss" scoped>
  .slider{
    position: relative;
    top: 40px;
  }

  .value-list{
    font-size: 0;
    width: 682px;
    position: absolute;
    left: 70px;
    li{
      display: inline-block;
      vertical-align: middle;
      font-size: 24px;
      margin-right: 40px;
      color: rgb(144, 144, 144);
    }
  }
  .bg-helper{
    height:116px;
    width: 682px;
    margin: 0 auto;
    margin-top: 50px;
    background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/scale00@2x.png") no-repeat center center;
    background-size: contain;
  }
  .slider-stick__wrap {
    position: relative;
    height: 2px;
    width: 591px;
    margin: 0 auto;
    background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/scale00@2x.png") no-repeat center center;
    background-size: contain;
    .slider-stick {
      position: absolute;
      top: 0;
      left: 0;
      height: 2px;
      /*background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/scale00@2x.png") no-repeat center center;*/
      /*background-size: contain;*/
    }
    .slider-stick__unselected {
      width: 100%;
      background-color: #ccc;
    }
    .slider-stick__selected {
      background-color: #4b0;
    }
    .slider-block {
      position: absolute;
      top: 0;
      left: 0;
      width: 160px;
      height: 160px;
      background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression00@2x.png") no-repeat center center;
      background-size: contain;
      border-radius: 100%;

      box-sizing: border-box;
    }
  }
  .slider-value {
    width: 62px;
    text-align: right;
  }

  .slider-container {
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 20px;
    box-sizing: border-box;
    width: 100%;

  }
</style>
