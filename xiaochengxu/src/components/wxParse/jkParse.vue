<!--**
 * author: F-loat <chaimaoyuan@foxmail.com>
 *
 * github地址: https://github.com/F-loat/mpvue-wxParse
 *
 * for: Mpvue框架下 微信小程序富文本解析
 */-->

<template>
  <!--基础元素-->
  <div class="wxParse" :class="className" v-if="!loading">
    <section v-for="(item,index) of dataArr" :key="index">
      <!-- 文本 -->
      <p class="p" v-if="item.type=='text'">{{item.content}}</p>
      <!-- 图片 -->
      <img
        :lazy-load="lazyLoad"
        class="img image"
        mode="widthFix"
        v-if="item.type=='img'"
        :src="item.content"
        alt
        @click="preview(item.content,$event)"
      >
      <!-- 视频 -->
      <!--<section >-->
      <!--<video class="_video videoPlayBox video-video video" controls  :src="item.content" :poster="item.poster"></video>-->
      <!--</section>-->
      <jk-video v-if="item.type=='video'" :item="item"></jk-video>
      <!-- br -->
      <text v-if="item.type=='br'">\n</text>
    </section>
  </div>
</template>

<script>
import HtmlToJson from "./libs/html2json";
import jkVideo from "./components/jkParseVideo";
import { mapState, mapActions } from "vuex";
export default {
  name: "wxParse",
  components: {
    jkVideo
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    noData: {
      type: String,
      default: '<div style="color: red;">数据不能为空</div>'
    },
    startHandler: {
      type: Function,
      default() {
        return node => {
          node.attr.class = null;
          node.attr.style = null;
        };
      }
    },
    endHandler: {
      type: Function,
      default: null
    },
    charsHandler: {
      type: Function,
      default: null
    },
    imageProp: {
      type: Object,
      default() {
        return {
          mode: "aspectFit",
          padding: 0,
          lazyLoad: true,
          domain: ""
        };
      }
    }
  },
  data() {
    return {
      imageUrls: [],
      system: "",
      nodes: [],
      dataArr: [],
      lazyLoad: true,
      number: 0
    };
  },
  onLoad() {
    this.clearData();
    this.setVideoDefaultNum(0);
    // 数据重组初始化
    this.dataFormate();
  },
  onUnload() {
    this.clearData();
    this.setVideoDefaultNum(0);
  },
  computed: {
    ...mapState(["videoNum"])
  },
  methods: {
    ...mapActions(["setVideoDefaultNum"]),
    clearData() {
      this.imageUrls = [];
      this.system = "";
      this.nodes = [];
      this.dataArr = [];
    },
    dataFormate() {
      let _this = this;
      console.log(`---------wxparse数据重组-----------`);
      let _nodesInit = this.getNodes();
      _this.dataCall(_nodesInit);
    },
    dataCall(_data) {
      let _this = this;
      _data.forEach(element => {
        if (element.nodes && element.nodes.length > 0) {
          _this.dataCall(element.nodes);
        } else {
          _this.dataSelect(element);
        }
      });
    },
    dataSelect(_data) {
      let _this = this;
      switch (_data.node) {
        case "text":
          _this.dataArr.push({
            type: _data.node,
            content: _data.text
          });
          break;
        case "element":
          switch (_data.tag) {
            case "img":
              _this.dataArr.push({
                type: _data.tag,
                content: _data.attr.src
              });
              break;
            case "video":
              _this.dataArr.push({
                type: _data.tag,
                content: _data.attr.src,
                poster: _data.attr.poster
              });
              break;
            case "br":
              _this.dataArr.push({
                type: _data.tag
              });
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    },
    navigate(href, $event) {
      this.$emit("navigate", href, $event);
    },
    preview(src, $event) {
      if (!this.imageUrls.length) return;
      wx.previewImage({
        current: src,
        urls: this.imageUrls
      });
      this.$emit("preview", src, $event);
    },
    getNodes() {
      const {
        content,
        noData,
        imageProp,
        startHandler,
        endHandler,
        charsHandler
      } = this;
      const parseData = content || noData;
      const customHandler = {
        start: startHandler,
        end: endHandler,
        chars: charsHandler
      };
      const results = HtmlToJson(parseData, customHandler, imageProp, this);
      this.imageUrls = results.imageUrls;
      return results.nodes;
    },
    removeImageUrl(src) {
      const { imageUrls } = this;
      imageUrls.splice(imageUrls.indexOf(src), 1);
    },
    // 循环获取 video 让其暂停；
    videoPause(num = 0) {
      if (this.videoNum > num) {
        wx.createVideoContext(`videoTag${num}`).pause();
        return this.videoPause(++num);
      } else {
        return false;
      }
    }
  }
};
</script>
