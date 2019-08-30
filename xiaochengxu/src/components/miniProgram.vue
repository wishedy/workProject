<template>
    <!-- <navigator :class="propClass" target='miniProgram' :app-id='appId' :version='version' :path='path' :extra-data='extraData'>

        <span v-if="propText.length">{{propText}}</span>
    </navigator> -->
    <section :class="propClass" @click="navigateFn()">

    </section>
</template>

 <script>
 /**
  * 使用场景：   小程序跳转
  * 引入使用：   <MiniProgram :propClass="'item'" :miniProgramParam='miniParams'></MiniProgram>
  * 参数格式:
  *             miniParams:{
                    name:'智能咨询',      //名字
                    path:'',             //指定小程序页面
                    extraData:{
                        a:'1',
                        b:'2',
                        c:'3'
                    }
                }
  *
*/
export default {
  data() {
    return {
      appId: "",
      appIdList: ["wxa188055d5e77a7fb"], //app-id list
      version: "release",                  //develop（开发版），trial（体验版），release（正式版）
      extraData: {},                     //参数
      path: "",                          //指定小程序页面
      propText:'',                       //文本
    };
  },
  onLoad() {
    console.log(this.miniProgramParam);
    let _this = this;
    const _propData = _this.miniProgramParam;
    //指定appId
    switch (_propData.name) {
      case "智能咨询":
        this.appId = this.appIdList[0];
        break;
      case "AIReadCard":
        this.appId = this.appIdList[0];
    }
    //指定参数
    if (_propData.extraData&&_propData.extraData.length>0) {
      this.extraData = _propData.extraData;
    }
    //指定页面
    if (_propData.path && _propData.path.length > 0) {
      this.path = _propData.path;
    }
  },
  methods:{
    navigateFn(){
      let _this = this;
      wx.navigateToMiniProgram({
        appId: _this.appId,
        path: _this.path,
        extraData: _this.extraData,
        envVersion: _this.version,
        success(res) {
          // 打开成功
          console.log(res)
        }
      })
    }
  },
  props: {
    miniProgramParam: {
      type: Object,
      default: {}
    },
    propClass: {
      type: String
    }
  }
};
</script>
