<template>
  <section style="width:100%;height: 100%;overflow: hidden">
    <input v-model="newName" placeholder="请填写昵称">
    <img class="cleanUp" src="https://m.allinmed.cn/static/image/mp/personal/delet.png"
         v-show="newName.length>0" @click="newName=''">
    <p class="tips">提示</p>
    <p class="tips">· 默认使用微信昵称</p>
    <p class="tips">· 修改昵称需输入1～20个字，不包含特殊符号 </p>
    <button class="save" @click="saveData">保存</button>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="ensureEvent"></ensureConfirm>
  </section>
</template>
<script type="text/ecmascript-6">
  import ensureConfirm from "components/ensure";
  import uploadAvator from "common/js/HttpRequest/uploadAvator";
  import api from "common/js/util/util"
  import localStorage from "localStorage";

  export default {
    data() {
      return {
        newName: '',
        ensureShow: false,
        saveFinish: false,
        ensureParams: {
          content: "",
          ensure: "我知道了",
        },
      };
    },
    components: {
      ensureConfirm
    },
    methods: {
      saveData() {
        if (this.newName.length > 20) {
          this.showConfirm('昵称需输入1～20个字', '我知道了');
        } else if (this.newName.length == 0) {
          this.showConfirm('请输入需要修改的昵称', '我知道了');
        } else if (this.newName.indexOf("<") > -1 || this.newName.indexOf(">") > -1 || this.newName.indexOf("/") > -1) {
          this.showConfirm('输入内容不能含有特殊符号', '我知道了');
        }
        else {
          //这里就用了传头像的接口，所以并不是传avator
          uploadAvator({
            customerId: localStorage.getItem("userId"),
            nickName: this.newName,
            attType: 1,
            visitSiteId: api.getSiteId(),
            sortId: "1",
          }).then((data) => {
            if (data.responseObject.responseStatus) {
              this.saveFinish = true;
              localStorage.setItem("nickName", this.newName);
              this.showConfirm('保存成功', '我知道了');
            } else {
              this.showConfirm('保存失败...', '我知道了');
            }
          }).catch(err => {
            console.log(err);
            this.showConfirm('网络错误，请稍后再试', '我知道了');
          });
        }
      },
      ensureEvent() {
        this.ensureShow = false;
        if (this.saveFinish && this.newName.length != 0) {
          wx.reLaunch({
            url: "/pages/personal/personal"
          });
        }
      },
      showConfirm(content, ensure) {
        this.ensureShow = true;
        this.ensureParams = {
          content,
          ensure
        }
      }
    },
    onShow(){
      this.ensureShow = false
    },
    mounted() {
      this.saveFinish = false;
      this.newName = this.$root.$mp.query.name;
      wx.setNavigationBarTitle({
        title: '修改昵称',
      });
    },

  }
</script>
<style lang="scss">
  .cleanUp {
    position: absolute;
    width: 32px;
    height: 32px;
    top: 65px;
    right: 52px;
    z-index: 3;
  }

  input {
    margin: 50px;
    padding-right: 50px;
    font-size: 28px;
    height: 40px;
  }

  .tips {
    margin-top: 10px;
    margin-left: 50px;
    font-size: 30px;
    color: #909090;
    letter-spacing: 0;
    line-height: 40px;
  }

  .save {
    margin-top: 80px;
    text-align: center;
    width: 520px;
    // height: 96px;
    background: #2EA9FE;
    border-radius: 100px;
    color: white;
    font-size: 36px;
    // font-weight: bold
  }
</style>
