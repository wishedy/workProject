<template>
  <div class="hospitalRoot">
    <div :class="ifSingleStyle | singleStyle('hospital singleStyle_hospital', 'hospital')">
      <div class="hospital_left">
        <span :class="ifSingleStyle | singleStyle('singleStyle_hName', '')">
          医院<i v-show="!ifSingleStyle"></i>
        </span>
        <div class="text"
             @click.stop="clickItem('company')"
             :class="companyStyle">
          <input :class="ifSingleStyle | singleStyle('singleStyle_input', '')" readonly="readonly" type="text"
                 v-model="hName"/>
        </div>
      </div>

      <div>
        <div class='approved' v-show='ifModeFollowForm'>
          <span>已验证</span>
        </div>
        <div class='addHospital' @click.stop='addHospital' v-show='!ifModeFollowForm'>
          <span>添加医院</span>
        </div>
      </div>
    </div>

    <div class='hospital_search' v-if='ifSearchHospital'>
      <div :class='ifSingleStyle | singleStyle("search_result singleStyle_search", "search_result")'>
        <div class='search_icon'>
          <img src='/static/images/icons/icon-search.png' alt=''>
        </div>
        <div class='search_input'>
          <input type='text' placeholder='输入要查找的医院'
                 @input.stop='searchHospital'
                 v-model='fillSearchHospital'>
        </div>
        <ul v-if='ifSearchNullValue'>
          <li v-for='item in hospitalItems'
              :key='item.id'
              @click='pickSearchHospital(item)'
              v-html='item.hospitalName'></li>
        </ul>
      </div>
    </div>

    <div v-if='ifPopupWindow'>
      <div class='cloak'></div>
      <div class='popupWindow'>
        <div class='el-message-box'>
          <div class='el-message-box__header'>
            <button type='button' aria-label='Close' class='el-message-box__headerbtn' @click='closePopupWindow'>
              <i class='el-message-box__close el-icon-close'></i>
            </button>
          </div>
          <div class='title'>添加医院</div>
          <div class='el-message-box__content'>
            <ul>
              <li>
                <div class='LiLabel'>
                  <div class='requireFlag'>*</div>
                  <div>医院名称</div>
                </div>
                <div class='el-input'>
                  <input type='text' class='el-input__inner' v-model='fillHospitalName'>
                </div>
              </li>
              <li>
                <span class='noFlagLiLabel'>医院别称<i></i></span>
                <div class='el-input'>
                  <input type='text' class='el-input__inner' v-model='fillHospitalAliasName'>
                </div>
              </li>
              <li>
                <div class='LiLabel'>
                  <div class='requireFlag'>*</div>
                  <div>所处省市</div>
                </div>
                <div class='el-input provinceWrap'>
                  <div class='province'>
                    <input type='text' readonly='readonly' class='el-input__inner' @click='getRegion("province")'
                           v-model='fillProvince'>
                    <ul v-if='ifProvince'>
                      <li v-for='item in provinceItems' :key="item.id" @click='pickRegion("province", item)'>{{item.regionName}}</li>
                    </ul>
                  </div>

                  <div class='city'>
                    <input type='text' readonly='readonly' class='el-input__inner' @click='getRegion("city")'
                           v-model='fillCity'>
                    <ul v-if='ifCity'>
                      <li v-for='item in cityItems' :key="item.id" @click='pickRegion("city", item)'>
                        {{item.regionName}}
                      </li>
                    </ul>
                  </div>

                  <div class='county'>
                    <input type='text' readonly='readonly' class='el-input__inner'
                           @click='getRegion("county")'
                           v-model='fillCounty'>
                    <ul v-if='ifCounty'>
                      <li v-for='item in countyItems' :key="item.id" @click='pickRegion("county", item)'>
                        {{item.regionName}}
                      </li>
                    </ul>
                  </div>

                </div>
              </li>
              <li>
                <div class='LiLabel'>
                  <div class='requireFlag'>*</div>
                  <div>医院等级</div>
                </div>
                <div class='el-input hospitalLevel'>
                  <input type='text' readonly='readonly' class='el-input__inner'
                         @click='getHospitalLevel'
                         v-model='fillHospitalLevel'>
                  <ul v-if='ifHospitalLevel'>
                    <li v-for='item in hospitalLevelItems' :key="item.id"
                        @click='pickHospitalLevel(item)'>{{item.hospitalLevel}}
                    </li>
                  </ul>
                </div>
              </li>
              <li style='margin-top: 65px;'>
                <div class='noFlagLiLabel'><span>资质照片</span></div>
                <div class='el-input photoWrap'>
                  <HospitalPicturePart v-for='(item,index) in uploadComponents' :key='index'/>
                </div>
              </li>
            </ul>
          </div>
          <div class='el-message-box__btns'>
            <button type='button' class='submit_hospital' @click='setHospital'>
              <span>确认添加</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
   * 医院组件
   * @module Hospital.vue
   * @desc 实现医院输入框后带添加医院/已验证功能，具体功能如下
   *        1.输入框实现自动联想现有医院
   *        2.添加医院会弹出窗口，用于添加医院所属信息
   *        3.添加完成会回显到输入框
   *        HospitalPicturePart组件是用于辅助图片陈列
   * @author qiaoliang
   * @date 2019/1/17 0017 下午 2:56
   * @example 调用示例
   *    调用的地方需要更改后再进行处理,暂不处理。需要考虑所有调用
   */

import comm from '@/assets/js/utils/comm';
import HospitalPicturePart from './HospitalPicturePart';

export default {
  name: 'Hospital',
  components: {
    'HospitalPicturePart': HospitalPicturePart
  },
  props: {
    selected: {type: String}, // 作用于当前选中的样式
    hName: {type: String}, // 医院名称  新旧时用 调用者加hName newHName
    hNameId: {type: String}, // 医院名称ID
    ifSingleStyle: {type: Boolean}, // true为单体样式
    ifModeFollowForm: {type: Number} // 医院  初使显示1已验证/ 0添加医院
  },
  filters: {
    singleStyle(state, clazz, reverseClazz) {
      return state ? clazz : reverseClazz;
    }
  },
  computed: {
    // 作用于选择激活
    companyStyle() {
      if (!this.ifSingleStyle && this.selected !== 'company') {
        return '';
      }
      else if (this.ifSingleStyle && this.selected !== 'company') {
        return 'singleStyle_inputText';
      }
      else if (!this.ifSingleStyle && this.selected === 'company') {
        return 'active';
      }
      else if (this.ifSingleStyle && this.selected === 'company') {
        return 'active singleStyle_inputText';
      }
    }
  },
  data: function() {
    return {
      loading: null,
      lockStyle: 'is-component el-popup-parent--hidden', // 弹出时锁屏
      ifPopupWindow: false, // 是否弹出添加医院
      ifSearchHospital: false, // 搜索激活
      ifSearchNullValue: false, // 搜索有值
      ifProvince: false, // 省
      ifCity: false, // 市
      ifCounty: false, // 区
      ifHospitalLevel: false, // 医院等级

      fillSearchHospital: '', // 搜索框
      fillHospitalName: '',
      fillHospitalAliasName: '',
      fillProvince: '', // 空
      fillCity: '',
      fillCounty: '',
      fillHospitalLevel: '',

      uploadComponents: [1],
      hospitalItems: [], // 联想医院
      hospitalLevelItems: [], // 医院级别 province等未定义未报错...

      base64HandleInfo: [], // base64处理完的信息
      uploadImageInfo: [] // 上传完图返回的信息
    };
  },

  methods: {
    // 初始化医院级别
    initHospitalLevel() {
      if (this.hospitalLevelItems.length > 0) {
        return false;
      }

      const promise = comm.sendAxios('getHospitalLevel', {
        firstResult: 0,
        maxResult: 20
      });

      promise.then((res) => {
        this.hospitalLevelItems = res.responseData.dataList;
      });

      //        this.$nextTick(() => {
      //          this.$on('closeSearch', () => {
      //            this.ifSearchHospital = false;
      //          })
      //        })
    },
    searchHospital(el) {
      if (!el.target.value) this.ifSearchNullValue = false;
      else this.ifSearchNullValue = true;

      // 设定时间来执行
      this.clearTimer();
      if (el.target.value && el.target.value.length > 0) {
        this.timer = setTimeout(() => {
          if (el.target.value !== '') {
            const promise = comm.sendAxios('getHospital', {
              firstResult: 0,
              maxResult: 20,
              hospitalName: el.target.value
            });
            promise.then((res) => {
              if (comm.isEmptyObject(res.responseData)) {
                this.ifSearchNullValue = false;
                this.$emit('setModeFollowForm', 0);
                this.hospitalItems = [];
              }
              else {
                this.ifSearchNullValue = true;
                this.$emit('setModeFollowForm', 1);
                this.searchChangeColor(el.target.value, res.responseData.data_list);
              }
            });
          }
        }, 500);
      }
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    searchChangeColor(queryKey, resultsList) {
      resultsList.map((item, index) => {
        if (queryKey && queryKey.length > 0) {
          let replaceReg = new RegExp(queryKey, 'g');
          let replaceString = '<span class="search_text">' + queryKey + '</span>';
          resultsList[index].hospitalNameBackup = item.hospitalName;
          resultsList[index].hospitalName = item.hospitalName.replace(replaceReg, replaceString);
        }
      });
      this.hospitalItems = resultsList;
    },
    pickSearchHospital(item) {
      this.ifSearchHospital = false;
      this.ifSearchNullValue = false;
      this.fillSearchHospital = '';

      //        if (this.$attrs.side == 'new') { // new形式的没用了
      //          if (!this.ifSingleStyle) {
      //            this.$parent.newHName = item.hospitalNameBackup;
      //            this.$parent.hNameId = item.id
      //          }
      //        } else {
      this.$emit('setHospitalName', item.hospitalNameBackup, item.id);
      // this.$parent.hNameId = item.id;
      //        }
    },
    addHospital() {
      document.body.setAttribute('class', this.lockStyle);

      // 预填充添加医院
      if (this.fillSearchHospital.length > 0) this.fillHospitalName = this.fillSearchHospital;
      else this.fillHospitalName = this.hName;

      this.ifPopupWindow = true;
      this.ifSearchHospital = false;
      this.uploadComponents = [1]; // 重置
    },
    closePopupWindow() {
      this.ifPopupWindow = false;
      this.$root.$el.removeAttribute('class');
    },
    clickItem(key) {
      this.$parent.selected = this.selected !== key ? key : '';
      this.ifSearchHospital = true;
      this.$parent.showStateGender = false;
      this.$parent.showStateMedical = false;
    },
    uploadQualification(el) {
      this.tools().setPhotoOrder(el);
      setTimeout(() => {
        let obj = {};
        obj.fileContent = this.base64HandleInfo.fileContent.split(',')[1];
        obj.extName = this.base64HandleInfo.extName.split('/')[1];
        comm.openLoading('上传中...');
        const promise = comm.sendAxios('uploadQualification', obj);
        promise.then((res) => {
          comm.closeLoading();
          if (res.responseStatus) {
            this.uploadImageInfo = res.responseData;
            this.$message.info('上传资质照片成功！');
          }
          else {
            this.$message.error('上传资质照片失败！');
          };
        });
      }, 100);
    },
    setHospital() {
      let obj = {};
      obj.hospitalLevelId = this.fillHospitalLevelId;// 医院等级
      obj.hospitalName = this.fillHospitalName; // 医院名称
      obj.hospitalOthername = this.fillHospitalAliasName; // 医院别名
      obj.provinceId = this.fillProvinceId; // 省id
      obj.province = this.fillProvince; // 省
      obj.cityId = this.fillCityId; // 市id
      obj.city = this.fillCity; // 市
      obj.districtId = this.fillCountyId; // 区id
      obj.district = this.fillCounty; // 区
      obj.isValid = 1; // 是否有效（0-无效；1-有效）
      Object.assign(obj, this.uploadImageInfo);
      obj = this.tools().requireHospitalInfo(obj);
      if (!obj) {
        return false;
      }

      const promise = comm.sendAxios('submitHospital', obj);
      promise.then((res) => {
        if (res.responseMessage === '该医院已存在！') {
          this.$allin_confirm({title: '提示', content: '该医院已存在！', type: 'notice'});
        }
        else if (!res.responseCode && res.responseMessage !== '该医院已存在！') {
          this.ifPopupWindow = false;
          this.$message.info('添加医院成功！');
          document.body.removeAttribute('class');

          this.$emit('setHospitalName', this.fillHospitalName, res.responsePk);
          if (!this.ifSingleStyle) {
            this.$parent.hName = this.fillHospitalName;
            this.$parent.hNameId = res.responsePk;
          }

          this.fillSearchHospital = ''; // 搜索框
          this.fillHospitalName = '';
          this.fillHospitalAliasName = '';
          this.fillProvince = ''; // 空
          this.fillCity = '';
          this.fillCounty = '';
          this.fillHospitalLevel = '';
          this.$parent.ifModeFollowForm = 1;
          // }
        }
        else {
          this.$message.error('添加医院失败！');
        }
      });
    },
    pickHospitalLevel(item) {
      this.ifHospitalLevel = false;
      this.fillHospitalLevelId = item.id;
      this.fillHospitalLevel = item.hospitalLevel;
    },
    // 获取医院等级
    getHospitalLevel() {
      this.initHospitalLevel();
      this.ifHospitalLevel = true;
      this.ifProvince = false;
      this.ifCounty = false;
      this.ifCity = false;
    },
    pickRegion(region, item) {
      this.ifProvince = false;
      this.ifCity = false;
      this.ifCounty = false;
      switch (region) {
        case 'province':
          this.fillProvince = item.regionName;
          this.fillProvinceId = item.regionId;
          this.fillCity = '';
          this.fillCityId = '';
          this.fillCounty = '';
          this.fillCountyId = '';
          break;
        case 'city':
          this.fillCity = item.regionName;
          this.fillCityId = item.regionId;
          this.fillCounty = '';
          this.fillCountyId = '';
          break;
        case 'county':
          this.fillCounty = item.regionName;
          this.fillCountyId = item.regionId;
          break;
      }
    },
    getRegion(region = 'province') {
      this.ifHospitalLevel = false;

      // provice只需提取一次
      if (region === 'province' && this.provinceItems && this.provinceItems.length > 0) {
        this.ifProvince = true;
        this.ifCity = false;
        this.ifCounty = false;
        return false;
      }

      let treeLevel = 2; // 2-省；3-市；4-区
      let parentId = 0; // 查市/区时上一级的regionId字段
      switch (region) {
        case 'province':
          if (this.provinceItems && this.ifProvince && this.provinceItems.length > 0) return false;
          treeLevel = 2;
          parentId = 0;
          break;
        case 'city':
          if (this.fillProvince === '') return false;
          if (this.cityItems && this.ifCity && this.cityItems.length > 0) return false;
          treeLevel = 3;
          parentId = this.fillProvinceId;
          break;
        case 'county':
          if (this.fillCity === '') return false;
          if (this.countyItems && this.ifCounty && this.countyItems.length > 0) return false;
          treeLevel = 4;
          parentId = this.fillCityId;
          break;
      }

      let regionParams = {
        firstResult: 0,
        maxResult: 50,
        isValid: 1,
        treeLevel: treeLevel
      };
      if (parentId) {
        regionParams.parentId = parentId;
      }
      const promise = comm.sendAxios('getRegion', regionParams);
      promise.then((rep) => {
        if (rep.responseStatus) {
          switch (region) {
            case 'province':
              this.ifProvince = true;
              this.ifCity = false;
              this.ifCounty = false;
              this.provinceItems = rep.responseData.dataList;
              break;
            case 'city':
              this.ifProvince = false;
              this.ifCity = true;
              this.ifCounty = false;
              this.cityItems = rep.responseData.dataList;
              break;
            case 'county':
              this.ifProvince = false;
              this.ifCity = false;
              this.ifCounty = true;
              this.countyItems = rep.responseData.dataList;
              break;
          }
        }
        else {
          console.log('err:未找到数据!');
        }
      });
    },
    tools() {
      return {
        _superThis: this,
        setPhotoOrder(el) {
          const file = el.target.files[0];
          const imageType = /image.*/;
          if (file.type.match(imageType)) {
            const reader = new FileReader();
            reader.onload = () => {
              // 区分上传还是替换  TODO:
              let img = new Image();
              img.className = 'uploadImg';
              img.src = reader.result;
              this._superThis.base64HandleInfo = {extName: file.type, fileContent: img.src};

              this._superThis.$children[0].isDeletePhoto = true;
              if (el.target.parentNode.getAttribute('class') === 'hospitalGroupPicture-groupPhoto-replacerPhoto') { // 替换
                el.target.parentElement.previousSibling.previousSibling.childNodes[2].remove();
                el.target.parentElement.previousSibling.previousSibling.append(img);
              }
              else { // 添加
                // this._superThis.base64HandleInfo.push({extName: file.type, fileContent: img.src});
                el.target.parentElement.append(img);
                el.target.parentElement.nextSibling.nextSibling.removeAttribute('hidden');
                el.target.nextSibling.nextSibling.remove(); // 移除+号
                // this._superThis.isDeletePhoto= true;
                // this._superThis.uploadComponents.push(1);  TODO:可以显示添加多个图操作的功能.
              }
            };
            reader.readAsDataURL(file);
          }
          else {
            this._superThis.$message.info('不支持非图片类型');
          }
        },
        requireHospitalInfo(obj) {
          let content = '';
          if (!obj.hospitalName) {
            content = '医院名称不能为空';
          }
          else if (!obj.province) {
            content = '医院所属省、直辖市不能为空';
          }
          else if (!obj.city) {
            content = '医院所属市不能为空';
          }
          else if (!obj.district) {
            content = '医院所属区、县不能为空';
          }
          else if (!obj.hospitalLevelId) {
            content = '医院等级不能为空';
          }
          else {
            return obj;
          }
          this._superThis.$allin_confirm({
            title: '提示',
            content: content,
            type: 'notice',
            btnName: '确定'
          });
          return false;
        }
      };
    }

  }
};
</script>

<style lang='scss' rel='stylesheet/scss'>
  .hospitalRoot{
    float: left;
    margin: 0 0 22px 0;
    font-size: 14px;
    color: #555555;
    width: 285px;
  }

  .popupWindow {
    z-index: 1009;
    position: fixed;
    /*top: 0;*/
    /*left: 0;*/
    left: 0%;
    top: 25%;
    bottom: 0;
    right: 0;
    text-align: center;
    .uploadImg {
      position: absolute;
      width: 98px;
      height: 73.7px;
    }
    .el-icon-close {
      font-size: 23px;
    }

    .hospitalLevel {
      margin-right: 11px;
      float: left;

      ul {
        position: fixed;
        z-index: 1001;
        border-radius: 4px;
        background: #FFFFFF;
        box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.10);
        margin-top: 7px;
        height: 238px;
        overflow-x: auto;

        li {
          width: 187px;
          height: 40px;
          cursor: pointer;
          margin-bottom: 0px;
          line-height: 40px;
          padding: 0 8px;
        }

        li:hover {
          background: #EDF1FF;
          font-family: PingFangSC-Regular;
          color: #4B67D6;
          letter-spacing: 0;
        }

      }
    }
    .province, .city, .county {
      width: 66px;
      margin-right: 11px;
      float: left;

      ul {
        position: fixed;
        z-index: 1001;
        border-radius: 4px;
        background: #FFFFFF;
        box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.10);
        margin-top: 7px;
        max-height: 238px;
        overflow-x: auto;

        li {
          /*width: 66px;*/
          height: 40px;
          cursor: pointer;
          margin-bottom: 0px;
          line-height: 40px;
          padding: 0 8px;
        }

        li:hover {
          background: #EDF1FF;
          font-family: PingFangSC-Regular;
          color: #4B67D6;
          letter-spacing: 0;
        }

      }
    }
    .noFlagLiLabel {
      width: 94px;
      padding-right: 19px;
      padding-left: 15px;

      span {
        float: left;
        height: 100px;
        line-height: 100px;
      }

    }
    .LiLabel {
      width: 94px;
      float: left;
      text-align: center;

      div {
        float: left;
        padding-top: 10px;
      }

      .requireFlag {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #EB3B46;
        letter-spacing: 0;
        line-height: 14px;
        vertical-align: middle;
        width: 15px;
        height: 15px;
        padding-top: 13px;
      }

    }
    ul li {
      margin-bottom: 20px;
    }

    .el-input {
      width: 222px;

      .el-input__inner {
        height: 36px;
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
        line-height: 14px;
        padding: 0 10px;
      }

    }
    .provinceWrap {
      width: 235px;
    }

    .photoWrap {
      width: 228px;
      margin-left: 22px;
    }
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      margin-top: 2px;
      margin-bottom: 19px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 24px;
      text-align: center;
    }

    .submit_hospital {
      background: #4B67D6;
      border-radius: 100px;
      width: 160px;
      height: 41px;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 15px;
      cursor: pointer;
    }

    .el-message-box {
      width:381px;
      max-height: 508px;
      overflow-y: auto;
    }

    .el-message-box__btns {
      padding: 5px 15px 0;
      text-align: center;
      margin-bottom: 20px;
    }

  }

  .cloak {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1009;
    opacity: 0.7;
    background: #000000;
  }

  .singleStyle_search {
    left: 23px;
  }

  .hospital_search {
    position: relative;
    z-index: 1008;
    left: 60px;
    background: #FFFFFF;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.10);
    border-radius: 4px;

    .search_result {
      position: absolute;
      top: 40px;
      background: #fff;
      border-radius: 4px;
      -webkit-box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
      min-width: 140px;

      .search_text {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4B67D6;
        letter-spacing: 0;
        line-height: 14px;
      }

      ul {
        max-height: 250px;
        overflow-y: auto;

        li {
          height: 40px;
          line-height: 40px;
          padding-left: 10px;
          cursor: pointer;
          font-size: 14px;
        }

        li:hover {
          background: #EDF1FF;
        }

      }
    }

    .search_icon {
      left: 7px;
      top: 12.9px;
      position: relative;
      width: 19px;
      height: 19px;
      float: left;
    }

    .search_input {
      position: relative;
      left: 8px;
      width: 400px;

      input::-webkit-input-placeholder {
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #BCC2CC;
        letter-spacing: 0;
        line-height: 13px;
      }

      input {
        width: 360px;
        box-sizing: border-box;
        height: 40px;
        border: 0px;
        font-size: 14px;
      }

    }

  }

  .hospital {
    float: left;
    margin: 0;
    font-size: 14px;
    color: #555555;
    width: 305px;

    .hospital_left {
      float: left;

      .singleStyle_hName {
        float: left;
        padding-left: 40px;
        width: 28px;
      }

      input {
        width: 113px;
        padding: 0px;
        border: 0px;
      }

    }
    .addHospital {
      /*margin-left: 15px;*/
      /*width: 88px;*/
      margin-left: 5px;
      width: 70px;
      height: 39px;
      border-radius: 4px;
      background: #EDF1FF;
      border-radius: 4px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4B67D6;
      letter-spacing: 0;
      line-height: 16px;
      float: left;
      cursor: pointer;

      span {
        width: 70px;
        text-align: center;
      }

    }
    .approved {
      margin-left: 5px;
      width: 74px;
      height: 39px;
      opacity: 0.8;
      background: #E9F7E9;
      border-radius: 4px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #52CC64;
      letter-spacing: 0;
      line-height: 16px;
      float: left;

      span {
        width: 74px;
        text-align: center;
      }

    }
    span {
      display: inline-block;
      margin-right: 15px;
      width: 42px;
      margin-top: 11px;
      text-align: justify;
      vertical-align: bottom;

      i {
        display: inline-block;
        width: 100%;
      }

    }
    .text {
      background: #F7F9FC;
      border-radius: 4px;
      height: 36px;
      padding: 0 12px;
      color: #111111;
      width: 114px;
      display: inline-block;
      border: 1px solid #E6E6E8;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #111111;
      letter-spacing: 0;
      line-height: 14px;
      cursor: pointer;

      &.active {
        border: 1px solid #4B67D6;
      }

    }
    .singleStyle_inputText {
      width: 185px;
      background: #fff;

      .singleStyle_input {
        width: 185px;
        border-radius: 4px;
        height: 36px;
        background: #fff;
        color: #111111;

        &.active {
          border: 1px solid #c0c4cc;
        }

      }
    }
    input {
      background: #F7F9FC;
      border-radius: 4px;
      height: 36px;
      padding: 0 12px;
      color: #111111;
      width: 140px;
      border: 1px solid #E6E6E8;

      &
      .active {
        border: 1px solid #4B67D6;
      }

    }
    .email-send {
      margin-left: 12px;
      width: 35px;
      height: 35px;
    }

  }

  .singleStyle_hospital {
    width: 420px;
  }

</style>
