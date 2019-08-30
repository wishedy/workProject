<template>
  <section>
    <li :class="propClass" @click="upLoadImg()" v-if="allFinish&&isReadyLoad&&imgUrl.length<paramObj.limit"></li>
  </section>
</template>

<script>
  /**
   * @Desc：上传图片公共组件
   * @Usage:  <template
   :imgList="imgUrl"
   :paramObj="{
                limit:9,          //图片总数量限制
                singleNum:9,      //每次上传选择数量
                maxSize:10,       //最大图片大小
                overSingleTips:'一次最多上传9张图片',
                overSizeTips:'图片不能超过10M',
                compressRatio:0.8
              }"
   @beforeUpload="beforeUploadFn"  //上传前回调
   @uploadDone="uploadDoneFn"      //上传后回调
   ></template>
   * @Notify：版本_1.0
   * @Depend：upLoadComm.js//util.js
   *
   * Created by Jukun on 2018/7/18.
   */
  import updateLoad from "../../common/js/upLoadPic/upLoadComm";
  import util from "common/js/util/util";
  import {mapMutations, mapState} from "vuex";
  // const { mapMutations, mapState } ;

  const xhr = {
    caseUrl:util.httpEnv() + "/mcall/customer/patient/case/attachment/v1/createPicture/",
    journalUrl:util.httpEnv() + "/mcall/rehabilitative/diary/attachment/v1/uploadPicture/"
  }
  export default {
    name: "uploadPic",
    data() {
      return {
        upLoadDetail: true,
        tempFilePaths: "",
        imgUrl: [],
        upLoadIndex: 0,
        reload: false,
        isReadyLoad: true, //是否无上传失败图片
        allFinish: true
      };
    },
    methods: {
      ...mapMutations(["setQueryObject", "setScene"]),
      // 选取图片
      upLoadImg(e) {
        let _this = this;
        _this.upLoadIndex = 0;
        _this.setScene("1");
        this.getDefaultData(); //缓存数据
        wx.chooseImage({
          count: (_this.paramObj.limit-_this.imgList.length) || 9, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            _this.allFinish = false;
            // _this.$forceUpdate();
            _this.tempFilePaths = res.tempFilePaths;
            _this.upLoadPic(0);
            if (_this.imgUrl.length+_this.tempFilePaths.length>_this.paramObj.limit) {
              wx.showToast({
                title:`最多上传${_this.paramObj.limit}张图片`,
                icon:'none'
               })
            }
          },
          complete: function (res) {
          }
        });
      },
      // 上传图片
      upLoadPic(index) {
        let _this = this;
        let num = index;
        let _files = [];
        _files = _this.tempFilePaths;
        if (_this.order) {
          _this.imgUrl.push({
            blob: _this.tempFilePaths[index],
            imgId: "",
            uploading: true,
            fail: false
          });
        }else{
          _this.imgUrl.unshift({
            blob: _this.tempFilePaths[index],
            imgId: "",
            uploading: true,
            fail: false
          });
        }
        if (_this.adviceId && _this.adviceId.length > 0) {
          _this.$emit("beforeUpload", {
            imgUrl: {
              blob: _this.tempFilePaths[index],
              imgId: "",
              uploading: true,
              fail: false
            },
            failParam: _files[num],
            adviceId: _this.adviceId
          });
        } else {
          _this.$emit("beforeUpload", {
            imgUrl: _this.imgUrl,
            failParam: _files[num]
          });
        }
        _this.upLoadDetail = false;
        let _xhr = _this.loadTypeObj.loadType=='1'?xhr.journalUrl:xhr.caseUrl;
        let _defaultData = {
          caseCategoryId: "", //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
          imageType: "0",     //	string	是	资源类型		1-上传资料图片
          visitSiteId: "24"
        }
        let _formData = _this.loadTypeObj.loadType=='1'?_this.loadTypeObj.paramData:_defaultData;
        console.log(_formData)
        const uploadTask = wx.uploadFile({
          url: _xhr,
          filePath: _files[num],
          name: "file",
          formData: _formData,
          success: function (res) {
            console.log(res);
            var _data = JSON.parse(res.data);
            console.log(_data);
            // 接口返回成功
            if (_data.responseObject.responsePk > 0) {
              if (_this.order) {
                _this.imgUrl[_this.imgUrl.length-1].imgId = _data.responseObject.responsePk;
                _this.imgUrl[_this.imgUrl.length-1].uploading = false;
                _this.imgUrl[_this.imgUrl.length-1].fail = false;
                _this.imgUrl[_this.imgUrl.length-1].finish = true;
              }else{
                _this.imgUrl[0].imgId = _data.responseObject.responsePk;
                _this.imgUrl[0].uploading = false;
                _this.imgUrl[0].fail = false;
                _this.imgUrl[0].finish = true;
              }
              if (_this.adviceId && _this.adviceId.length > 0) {
                _this.$emit("uploadDone", {
                  imgId: _data.responseObject.responsePk,
                  adviceId: _this.adviceId,
                  isFail: false
                });
              }
              //ID存储
              var value = wx.getStorageSync("attIds");
              if (value != "") {
                let _keys = value + "," + _data.responseObject.responsePk;
                wx.setStorageSync("attIds", _keys);
              } else {
                wx.setStorageSync("attIds", _data.responseObject.responsePk);
              }
              //是否有上传失败图片
              _this.isExistUpLoadFail();
              //上传下一张
              if (!_this.reload) {
                if (
                  index < _this.tempFilePaths.length - 1 &&
                  _this.imgUrl.length < _this.paramObj.limit
                ) {
                  _this.upLoadPic(index + 1);
                } else {
                  _this.allFinish = true;
                  // console.log("fin");
                  //异步祖组件控制
                  if (_this.isShowOnce) {
                    _this.$emit("uploadDone", {
                      allFinish: true
                    });
                  }
                }
              } else {
                _this.reload = false;
              }
            } else {
              // 接口返回失败
              // console.log(`=================${_data.responseObject.responsePk}===================`)
              if (_this.adviceId && _this.adviceId.length > 0) {
                _this.imgUrl[0].uploading = false;
                _this.imgUrl[0].fail = true; //上传失败标识
                _this.imgUrl[0].finish = true;
                _this.$emit("uploadDone", {
                  imgId: "",
                  adviceId: _this.adviceId,
                  isFail: true
                });
              } else {
                // 正序
                if (_this.order) {
                  _this.imgUrl[_this.imgUrl.length-1].uploading = false;
                  _this.imgUrl[_this.imgUrl.length-1].fail = true; //上传失败标识
                  _this.imgUrl[_this.imgUrl.length-1].finish = true;
                }else{
                  _this.imgUrl[0].uploading = false;
                  _this.imgUrl[0].fail = true; //上传失败标识
                  _this.imgUrl[0].finish = true;
                }
              }
              if (
                index < _this.tempFilePaths.length - 1 &&
                _this.imgUrl.length < _this.paramObj.limit
              ) {
                _this.upLoadPic(index + 1);
              }else{
                _this.allFinish = true;
                // console.log("fin");
                //异步祖组件控制
                if (_this.isShowOnce) {
                  _this.$emit("uploadDone", {
                    allFinish: true
                  });
                }
              }
            }
          },
          fail: function (err) {
            //微信接口调用失败
            if (_this.adviceId && _this.adviceId.length > 0) {
              _this.imgUrl[0].uploading = false;
              _this.imgUrl[0].fail = true; //上传失败标识
              _this.imgUrl[0].finish = true;
              _this.$emit("uploadDone", {
                imgId: "",
                adviceId: _this.adviceId,
                isFail: true
              });
            } else {
              // 正序
                if (_this.order) {
                  _this.imgUrl[_this.imgUrl.length-1].uploading = false;
                  _this.imgUrl[_this.imgUrl.length-1].fail = true; //上传失败标识
                  _this.imgUrl[_this.imgUrl.length-1].finish = true;
                }else{
                  _this.imgUrl[0].uploading = false;
                  _this.imgUrl[0].fail = true; //上传失败标识
                  _this.imgUrl[0].finish = true;
                }
            }
            if (
              index < _this.tempFilePaths.length - 1 &&
              _this.imgUrl.length < _this.paramObj.limit
            ) {
              _this.upLoadPic(index + 1);
            }else{
              _this.allFinish = true;
              // console.log("fin");
              //异步祖组件控制
              if (_this.isShowOnce) {
                _this.$emit("uploadDone", {
                  allFinish: true
                });
              }
            }
          },
          complete: function () {
            //微信接口调用结束
            _this.setScene("0");
          }
        });
        //上传进度
        uploadTask.onProgressUpdate(res => {
          // console.log("上传进度", res.progress);
          // console.log("已经上传的数据长度", res.totalBytesSent);
          // console.log("预期需要上传的数据总长度", res.totalBytesExpectedToSend);
        });
      },
      //重传图片
      upLoadReload(index) {
        let _this = this;
        _this.reload = true;
        _this.upLoadPic("", index);
      },
      //是否存在上传失败图片
      isExistUpLoadFail() {
        let _this = this,
          _failNum = 0;
        this.imgUrl.forEach((item, index) => {
          if (item.fail) {
            _failNum++;
          }
        });
        if (this.isFailToast) {
          localStorage.setItem("failUploadNum",_failNum)
        }else if(localStorage.getItem("failUploadNum")){
          localStorage.removeItem("failUploadNum")
        }

        if (_failNum > 0) {
          _this.isReadyLoad = false;
        } else {
          _this.isReadyLoad = true;
        }
      },
      getDefaultData() {
        let _this = this;
        let _keys = "";
        if (this.imgList && this.imgList.length > 0) {
          _this.imgUrl = _this.imgList;
        }
      },
      //上传列表数组初始化
      getUploadList() {
        this.uploadList = this.upload;
        this.uploadList.forEach((element, index) => {
          this.$set(this.imageList, element.adviceId, []);
          this.$set(this.failImgList, element.adviceId, []);
        });
      }
    },
    mounted() {
      console.log(this.propClass)
    },
    computed: {
      ...mapState(["queryObject", "scene"])
    },
    watch: {
      imgUrl: {
        handler(newName, oldName) {
          this.isExistUpLoadFail();
        },
        deep: true
      },
      reloadBtnShow(status){
        let _this = this;
        if (status&&_this.imgUrl.length) {
        console.log( `=============`)
        console.log(this.reloadIndex)
          _this.imgUrl[_this.imgUrl.length-_this.reloadIndex-1].fail = false;
        }
      }
    },
    components: {},
    props: {
      propClass: {
        type: String,
        default: ""
      },
      uploadType: {
        type: String
      },
      paramObj: {
        type: Object
      },
      imgList: {
        type: Object,
        default: ""
      },
      adviceId: {
        type: String,
        default: ""
      },
      imageList: {
        type: Array,
        default: []
      },
      isFailToast:{
        type: Boolean,
        default:false
      },
      isShowOnce:{
        type:Boolean,
        default:false
      },
      loadTypeObj:{
        type:Object,
        default:{}
      },
      reloadBtnShow:{
        type:Boolean,
        default:false
      },
      order:{
        type:Boolean,
        default:false
      }
    }
  };
</script>

<style lang="scss">
</style>

