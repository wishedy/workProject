<template>
  <section class="userPatEduContent">
    <div class="TopTitle">用户患教手册 > 手册编辑页</div>
    <!--页面整体显示内容-->
    <section class="userPatEduDesc">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormCon" label-width="100px" class="demo-ruleForm"
               @submit.native.prevent>

        <el-form-item label="手册名称" prop="name">
          <el-input v-model="ruleForm.name" maxlength="20"  placeholder="手册名称" class="width300"></el-input>
        </el-form-item>

        <el-form-item label="创建者" prop="authorName">
          <el-input v-model="ruleForm.authorName" placeholder="" class="width300" disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item label="创建者ID" prop="authorId">
          <el-input v-model="ruleForm.authorId" placeholder="" class="width300" disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item label="浏览量" prop="browseNum">
          <el-input v-model="ruleForm.browseNum" placeholder="" class="width300" disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item label="收录量" prop="collectionNum">
          <el-input v-model="ruleForm.collectionNum" placeholder="" class="width300" disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item label="专业" prop="major" class="chooseBtn">
          <el-input type="hidden" v-model="ruleForm.major" style="display: none;"></el-input>
          <button class="el-icon-plus" @click.stop="popupShowOrHide(1,1)">选择专业</button>
          <ul class="addDescContent" v-if="ShowMajCho">
            <span class="triangleUp"></span>
            <li class="descItem" v-for="(item,index) in major" v-bind:key="index">{{item.labelName}}</li>
          </ul>
        </el-form-item>

        <el-form-item label="疾病阶段" prop="illness" class="chooseBtn">
          <el-input type="hidden" v-model="ruleForm.illness" style="display:none;"></el-input>
          <button class="el-icon-plus" @click.stop="popupShowOrHide(1,2)">选择标签</button>
          <ul class="addDescContent" v-if="ShowIllCho">
            <span class="triangleUp"></span>
            <li class="descItem" v-for="(item,index) in illness" v-bind:key="index">{{item.labelName}}</li>
          </ul>
        </el-form-item>

        <el-form-item label="属性"  prop="property">
          <el-radio-group v-model="ruleForm.property">
            <el-radio label="1" v-if="ruleForm.property==1">公开</el-radio>
            <el-radio label="2" v-if="ruleForm.property==2">隐私(不允许被搜索)</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="主页显示" prop="isViewFlag">
          <el-radio-group v-model="ruleForm.isViewFlag">
            <el-radio label="0">不显示</el-radio>
            <el-radio label="1">显示(指是否在患者端医生主页显示)</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="更新时间" prop="operatorTime">
          <el-input placeholder="" class="width300" v-model="ruleForm.operatorTime" disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item label="操作人" prop="operatorName">
          <el-input v-model="ruleForm.operatorName" placeholder="" class="width300" disabled="disabled"></el-input>
        </el-form-item>

        <el-form-item label="操作列表" prop="addDesc">
          <div class="viewClassContent" v-for="(item,i) in handleListData" v-bind:key="i">
            <div class="addClassTop">{{item.parentName}}</div>
            <div class="tabContent">
              <el-table
                :data="item.manualList"
                style="width: 956px;"
              >
                <el-table-column type="index" label="序号" width="60" ></el-table-column>
                <el-table-column prop="educationName" label="资源名称" width="320"></el-table-column>
                <el-table-column prop="educationId" label="患教ID" width="145"></el-table-column>
                <el-table-column prop="authNameList" label="作者" width="120"></el-table-column>
                <el-table-column prop="webStoragePath" label="h5地址" width="310">
                  <template slot-scope="scope">
                    <a :href="scope.row.webStoragePath"
                       target="_blank"
                       class="jumpUrlA">{{scope.row.webStoragePath}}</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="手册图" prop="coverImg">
          <upload-img @imgpk="imgpk" :formData="paramData" :imgData="imgData"></upload-img>
        </el-form-item>

        <el-form-item>
          <el-button class="submitBtn" @click="submitForm">提交修改</el-button>
          <el-button class="cancleBtn" @click="goBackFn">返回</el-button>
        </el-form-item>
      </el-form>
    </section>
    <!--页面整体显示内容结束-->
    <!--选择专业弹层-->
    <section class="selectBox" v-show="isShowMajor">
      <section class="selectMajorCon">
        <i class="closeBtn" @click.stop="popupShowOrHide(2,1)"></i>
        <h3 class="title">选择专业</h3>
        <ul class="majorList">
          <li v-for="(item,i) in majorArrList" @click="majorCli(i)" :class="{active:item.isExist==1}" v-bind:key="i">
            {{item.labelName}}
          </li>
        </ul>
        <p :class="{'sureBtn':true,'active':majorToSubmit}" @click.stop="majorSub">确认</p>
      </section>
    </section>
    <!--选择专业结束-->
    <!--选择疾病阶段-->
    <section class="selectBox" v-show="isShowIllness">
      <section class="selectDiseaseCon">
        <i class="closeBtn" @click.stop="popupShowOrHide(2,2)"></i>
        <h3 class="title">选择疾病阶段</h3>
        <ul class="diseaseList">
          <li v-for="(item,i) in illArrList" @click.stop="illnessCli(i)" :class="{active:item.isExist==1}" v-bind:key="i">
            {{item.labelName}}
          </li>
        </ul>
        <p :class="{'sureBtn':true,'active':illnessToSubmit}" @click.stop="illnessSub">确认</p>
      </section>
    </section>
    <!--选择疾病阶段结束-->
    <!--选择主页是否显示-->
    <section class="selectBox" v-if="isShowType">
      <section class="selectTypeCon">
        <i class="closeBtn" @click.stop="popupShowOrHide(2,3)"></i>
        <h3 class="title">是否在主页显示</h3>
        <aside class="selectBtn"><p @click.stop="typeCho(0)">不显示</p>
          <p @click.stop="typeCho(-1)">显示</p></aside>
        <p class="sureBtn ev-chooseBtn" @click.stop="chooseSub">确认</p>
      </section>
    </section>
    <!--选择主页是否显示结束-->
  </section>
</template>
<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
import uploadImg from '@/components/common/upload/uploadImgPatient';
import {getPageOperation} from '@/assets/js/utils/auth.js';
export default {
  name: 'userPatientEduEdit',
  data() {
    return {
      ruleForm: {
        name: '', // 手册名称
        major: '', // 专业
        illness: '', // 疾病阶段
        operatorTime: '', // 更新时间
        coverImg: '', // 上传图片
        property: '1', // 属性
        state: '2', // 状态
        paEduName: '', // 患教名称
        authorName: '', // 创建者名称
        isViewFlag: '0'// 主页是否显示
      },
      rules: {},
      // 编辑的时候给上传图片传参
      paramData: {
        visitSiteId: 25,
        extName: '',
        fileContent: '',
        attType: 6,
        fileName: ''
      },
      // 编辑的时候给上传图片传参封面
      imgData: {
        src: '',
        id: ''
      },
      majorArrList: [], // 专业列表数据
      majorOldArrList: [], // 专业列表获取到的数据
      isShowType: false,
      typeState: 0, // 选择分类，默认选择分类
      isShowAdd: false, // 是否显示添加内容弹层
      isShowMajor: false, // 是否显示选择专业弹层
      ShowMajCho: false, // 是否显示已经选择的专业名称
      majorToSubmit: false, // 专业是否可点击
      major: [], // 列表中展示的专业
      illOldArrList: [], // 疾病阶段获取到的数据
      illArrList: [{
        'labelId': '1',
        'labelName': '疾病科普',
        'isExist': 0
      },
      {
        'labelId': '2',
        'labelName': '疾病自查',
        'isExist': 0
      },
      {
        'labelId': '3',
        'labelName': '保守治疗',
        'isExist': 0
      },
      {
        'labelId': '4',
        'labelName': '手术前',
        'isExist': 0
      },
      {
        'labelId': '5',
        'labelName': '手术中',
        'isExist': 0
      },
      {
        'labelId': '6',
        'labelName': '手术后',
        'isExist': 0
      },
      {
        'labelId': '7',
        'labelName': '疾病康复',
        'isExist': 0
      }], // 疾病阶段列表数据
      isShowIllness: false, // 是否显示疾病阶段弹层
      illnessToSubmit: false, // 疾病阶段确定是否可点击
      illness: [], // 列表中展示的疾病阶段
      ShowIllCho: false, // 是否显示已经选择的疾病阶段
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页数据条数
      totalCount: 0, // 数据总数
      isClassify: -1, // 编辑状态始终不分类
      manualId: comm.getpara().manualId, // 手册id
      isAdmin: false, // 是否具有权限判断
      educationName: '', // 患教名称
      handleListData: [], // 操作列表
      axiosNum: 0, // 请求的个数，用来控制loading是否显示
      authorName: '', // 创建者
      authorId: '', // 创建者id
      browseNum: 0, // 浏览量
      collectionNum: 0, // 收藏量
      operatorId: localStorage.getItem('userId'), // 操作者id
      operatorName: localStorage.getItem('userRealName')// 操作者
    };
  },
  components: {
    uploadImg
  },
  methods: {
    // 返回历史页面
    goBackFn() {
      let t = this;
      if (window.history.length <= 1) {
        t.$router.push({path: '/'});
        return false;
      }
      else {
        t.$router.go(-1);
      }
    },
    // 提交内容
    submitForm() {
      let _this = this;
      let params = {};// 传参数据
      params.manualId = _this.manualId;// 手册id
      params.manualName = _this.ruleForm.name;// 手册名称
      params.coverUrl = _this.imgData.sendUrl;// 手册名称
      params.attId = _this.imgData.id;// 手册名称
      params.isViewFlag = _this.ruleForm.isViewFlag;// 是否显示
      params.operatorId = _this.operatorId;// 操作者id
      params.operatorName = _this.operatorName;// 操作者
      params.labelList = [];// 专业列表
      params.illnessNameList = [];// 疾病列表
      // 循环专业列表
      for (let i in _this.major) {
        let majorItem = {};
        majorItem = {
          'labelId': _this.major[i].labelId,
          'labelName': _this.major[i].labelName
        };
        params.labelList.push(majorItem);
      }
      // 循环疾病列表
      for (let j in _this.illness) {
        let illnessItem = {};
        illnessItem = {
          'labelId': _this.illness[j].labelId,
          'labelName': _this.illness[j].labelName
        };
        params.illnessNameList.push(illnessItem);
      }
      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
          if (window.history.length <= 1) {
            _this.$router.push({path: 'userPatientEduList'});
            return false;
          }
          else {
            _this.$router.go(-1);
          }
        }
      }
      _this.getListAxios(apiConfig.userSubmitInfo.url, params, callback, apiConfig.userSubmitInfo.type);
      // console.log(params)
    },
    // 封面图片
    imgpk(val) {
      let _this = this;
      _this.imgData.src = val.attUrl;
      _this.imgData.attWidth = val.attWidth;
      _this.imgData.attHeight = val.attHeight;
      _this.imgData.attSize = val.attSize;
      _this.imgData.attName = val.attName;// 附件说明
      _this.imgData.sendUrl = val.sendUrl;
      _this.imgData.attFormat = val.attFormat;
    },
    // 编辑时获取基础数据
    getBaseInfo() {
      let _this = this;
      let param = {
        isValid: 1,
        manualId: _this.manualId
      };
      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          let data = res.data.responseObject.responseData.dataList[0];
          _this.ruleForm.name = data.manualName;// 手册名称
          _this.ruleForm.peopleId = data.recommender;// 患教id
          _this.ruleForm.property = data.openState;// 属性
          _this.ruleForm.state = data.state;// 状态
          _this.ruleForm.authorName = data.authorName;// 创建者
          _this.ruleForm.authorId = data.authorId;// 作者id
          _this.ruleForm.browseNum = data.browseNum;// 浏览量
          _this.ruleForm.collectionNum = data.collectionNum;// 收录量
          _this.ruleForm.operatorTime = data.operatorTime.substring(0, data.operatorTime.length - 5);// 更新时间
          _this.ruleForm.isViewFlag = data.isViewFlag;// 是否显示
          _this.ruleForm.operatorName = data.operatorName;// 操作人
          _this.imgData.src = data.attUrl;// 图片照片
          _this.imgData.id = data.attId;// 图片id
          _this.isClassify = data.isClassify;// 是否分类，用来获取操作列表
        }
      }
      _this.getListAxios(apiConfig.manualBaseInfo.url, param, callback, apiConfig.manualBaseInfo.type);
    },
    // 获取内容
    getContent() {
      let _this = this;
      let param = {
        manualId: _this.manualId,
        isValid: 1,
        firstResult: 0,
        maxResult: 20,
        labelType: 2,
        isClassify: _this.isClassify// 默认传入-1表示不分类
      };
      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          _this.handleListData = res.data.responseObject.responseData.dataList;
        }
        else {
          _this.handleListData = [];
        }
      }
      _this.getListAxios(apiConfig.getConUrl.url, param, callback, apiConfig.getConUrl.type);
    },
    // 显示选择专业疾病列表展示或隐藏
    popupShowOrHide(type, cliType) { // type:1显示/2隐藏。cliType：1专业/2疾病/3是否显示
      let _this = this;
      if (type === 1) {
        switch (cliType) {
          case 1:// 表示是显示专业列表
            _this.isShowMajor = true;
            for (let i in _this.majorArrList) {
              _this.majorArrList[i].isExist = 0;
              _this.majorToSubmit = false;
              for (let j in _this.major) {
                if (_this.majorArrList[i].labelId === _this.major[j].labelId) {
                  _this.majorArrList[i].isExist = 1;
                  _this.majorToSubmit = true;
                  break;
                }
                if (j === _this.major.length - 1) {
                  _this.majorArrList[i].isExist = 0;
                }
                // 利用set方法更新dom，参数1；要改变的数组。参数2：参数索引。参数3：改变成的值
                this.$set(_this.majorArrList, i, _this.majorArrList[i]);
              }
            }
            break;
          case 2:// 表示是显示疾病列表
            _this.isShowIllness = true;
            _this.illnessToSubmit = false;
            for (let i in _this.illArrList) {
              _this.illArrList[i].isExist = 0;
              for (let j in _this.illness) {
                if (_this.illArrList[i].labelId === _this.illness[j].labelId) {
                  _this.illArrList[i].isExist = 1;
                  _this.illnessToSubmit = true;
                  break;
                }
                if (j === _this.illness.length - 1) {
                  _this.illArrList[i].isExist = 0;
                }
              }
            }
            break;
        }
      }
      else {
        switch (cliType) {
          case 1:// 表示是显示专业列表
            _this.isShowMajor = false;
            break;
          case 2:// 表示是显示疾病列表
            _this.isShowIllness = false;
            break;
        }
      }
    },
    // 疾病阶段item项点击
    illnessCli(index) {
      let _this = this;
      if (_this.illArrList[index].isExist === 0) {
        _this.illArrList[index].isExist = 1;
      }
      else {
        _this.illArrList[index].isExist = 0;
      }
      for (let i in _this.illArrList) {
        if (_this.illArrList[i].isExist === 1) {
          _this.illnessToSubmit = true;
          break;
        }
        if (i === _this.illArrList.length - 1) { // 当循环到最后一项也没有找到已经点击的数据则将按钮不可点击
          _this.illnessToSubmit = false;
        }
      }
    },
    // 疾病阶段提交按钮点击
    illnessSub() {
      let _this = this;
      if (_this.illnessToSubmit) {
        _this.ShowIllCho = true;
        _this.isShowIllness = false;
        _this.illness = [];
        for (let i in _this.illArrList) {
          if (_this.illArrList[i].isExist === 1) {
            _this.illness.push(_this.illArrList[i]);
          }
        }
      }
    },
    // 专业item项点击
    majorCli(index) {
      let _this = this;
      if (_this.majorArrList[index].isExist === 0) {
        _this.majorArrList[index].isExist = 1;
      }
      else {
        _this.majorArrList[index].isExist = 0;
      }
      // 利用set方法更新dom，参数1；要改变的数组。参数2：参数索引。参数3：改变成的值
      this.$set(_this.majorArrList, index, _this.majorArrList[index]);
      for (let i in _this.majorArrList) {
        if (_this.majorArrList[i].isExist === 1) {
          _this.majorToSubmit = true;
          break;
        }
        if (i === _this.majorArrList.length - 1) { // 当循环到最后一项也没有找到已经点击的数据则将按钮不可点击3
          _this.majorToSubmit = false;
        }
      }
    },
    // 专业弹层提交按钮点击
    majorSub() {
      let _this = this;
      if (_this.majorToSubmit) {
        _this.ShowMajCho = true;
        _this.isShowMajor = false;
        _this.major = [];
        for (let i in _this.majorArrList) {
          if (_this.majorArrList[i].isExist === 1) {
            _this.major.push(_this.majorArrList[i]);
          }
        }
      }
    },
    // 获取专业列表
    majorArrFn() {
      let _this = this;
      let param = {
        isValid: 1,
        firstResult: 0,
        maxResult: 99,
        labelType: 0,
        treeLevel: 1
      };
      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.items) {
          let data = res.data.responseObject.items;
          _this.majorArrList = _this.majorArrList.concat(data);// 将专业列表进行追加
          if (_this.manualId) { // 如果存在则表示是编辑状态，则进行请求已添加的标签
            let paramIsExist = {
              manualId: _this.manualId,
              isValid: 1,
              firstResult: 0,
              maxResult: 20,
              labelType: 1// 标签类型：1专业2疾病
            };
            let callbackIs = (resIs) => {
              if (resIs && resIs.data && resIs.data.responseObject && resIs.data.responseObject.responseData && resIs.data.responseObject.responseData.dataList) {
                let dataIs = resIs.data.responseObject.responseData.dataList;
                _this.majorOldArrList = _this.majorOldArrList.concat(dataIs);// 将已经选择的专业编辑时的列表进行备份，以后比较是否是删除了
                if (dataIs.length > 0) { // 表示有已经选择的专业数据
                  for (let i in data) { // 与原来的进行匹配，是否存在经选择的数据项
                    for (let it in dataIs) {
                      if (dataIs[it].labelId === data[i].labelId) {
                        _this.ShowMajCho = true;
                        _this.majorToSubmit = true;
                        data[i].isExist = 1;
                        _this.ruleForm.major = 1;
                        _this.major.push(dataIs[it]);
                      }
                    }
                  }
                }
              }
            };
            _this.getListAxios(apiConfig.getLabelUrl.url, paramIsExist, callbackIs, apiConfig.getLabelUrl.type);
          }
        }
      }
      _this.getListAxios(apiConfig.getLabelListNew.url, param, callback, apiConfig.getLabelList.type);
    },
    // 获取疾病列表
    illArrFn() {
      let _this = this;
      let param = {
        manualId: _this.manualId,
        isValid: 1,
        firstResult: 0,
        maxResult: 20,
        labelType: 2
      };
      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          let data = res.data.responseObject.responseData.dataList;
          _this.illOldArrList = _this.illOldArrList.concat(data);
          for (let i in _this.illArrList) { // 获取数据进行对比
            for (let j in _this.illOldArrList) {
              if (_this.illOldArrList[j].labelId === _this.illArrList[i].labelId) { // 如果id相等
                _this.illArrList[i].isExist = 1;
                _this.ShowIllCho = true;
                _this.ruleForm.illness = 1;
                _this.illnessToSubmit = true;
                _this.illness.push(_this.illOldArrList[j]);
              }
            }
          }
        }
      }
      _this.getListAxios(apiConfig.getLabelUrl.url, param, callback, apiConfig.getLabelUrl.type);
    },
    // 获取数据公共方法
    getListAxios(path, params, callback, type, errorCallback) {
      let _this = this;
      comm.openLoading('加载中...');
      _this.axiosNum++;
      if (type === 'post') {
        axios({
          method: 'post',
          url: path,
          data: params
        }).then((res) => {
          _this.axiosNum--;
          callback && callback(res);
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          _this.axiosNum--;
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
          console.log('获取数据失败：', e);
        });
      }
      else {
        axios({
          method: 'get',
          url: path,
          params: params
        }).then((res) => {
          callback && callback(res);
          _this.axiosNum--;
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          _this.axiosNum--;
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
          console.log('获取数据失败：', e);
        });
      }
    }
  },
  mounted() {
    let _this = this;
    let pageOperation = getPageOperation('/userPatientEduList');// 获取权限
    _this.isAdmin = pageOperation === 721;
    if (_this.isAdmin) { // 是否是管理员
      _this.getBaseInfo();// 基本数据
      _this.majorArrFn();// 专业
      _this.illArrFn();// 疾病阶段
      _this.getContent();// 获取操作列表
    }
    else { // 跳转到列表页
      _this.$router.push({path: 'userPatientEduList'});
    }
  },
  // 离开当前页面后执行
  destroyed: function() {
    comm.goBack();
  }
};
</script>
<style lang="scss">
  @import "../../assets/scss/pages/userPatientEducationBook/patientEduDesc";
</style>
