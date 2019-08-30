<template>
  <section class="patientEduContent">
    <div class="TopTitle">患教手册管理后台 > 手册编辑页</div>
    <section class="patientEduDesc">
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormCon" label-width="100px" class="demo-ruleForm"
               @submit.native.prevent>

        <el-form-item label="手册名称" prop="name">
          <el-input v-model="ruleForm.name"  placeholder="手册名称（最多20字）" class="width300"></el-input>
        </el-form-item>

        <el-form-item label="适应人群" prop="people">
          <el-input v-model="ruleForm.people" placeholder="适应人群（最多100字）" class="width300"></el-input>
        </el-form-item>

        <el-form-item label="专家说" prop="expert">
          <el-input type="textarea" v-model="ruleForm.expert" placeholder="专家说（最多100字）"></el-input>
        </el-form-item>

        <el-form-item label="添加内容" prop="addDesc" class="addDesc">
          <el-input type="hidden" v-model="ruleForm.addDesc" style="display:none;"></el-input>
          <button @mousedown.stop="chooseTxt" class="el-icon-plus" v-show="chooseTypeBtn">选择类型</button>
          <button class="el-icon-plus" v-show="createTypeBtn" @click="creatTypeBtn">创建分类</button>
        </el-form-item>

       <el-form-item label="" v-show="showTypeList&&item.manualList" v-for="(item,index) in creTypeArr"
                      :key="index">
          <div class="addClassContent">
            <span class="triangleUp"></span>
            <div class="addClassTop">
              <el-input type="input" placeholder="填写分类" class="addClass" v-show="createTypeBtn"
                        v-model="item.parentName" :disabled="item.parentNameSave?true:false"></el-input>
              <span class="editBtn" v-show="createTypeBtn&&item.parentNameSave" @click.stop="cliEditBtn(index)"></span>
              <button v-show="createTypeBtn&&!item.parentNameSave" @click.stop="cliSaveBtn(index)" :data-val="item.parentName">保存</button>
              <span class="el-icon-delete" v-show="createTypeBtn" @click.stop="deleTypeBtn(index)">删除分类</span>
              <span class="el-icon-plus" @click.stop="addTypeBtnCli(index)">添加内容</span>
            </div>
            <div class="tabContent">
              <el-table
                ref="multipleTable"
                :data="item.manualList"
                style="width: 956px;"
              >
                <el-table-column prop="nodeNum" label="序号" width="60"></el-table-column>
                <el-table-column prop="educationName" label="资源名称" width="280"></el-table-column>
                <el-table-column prop="educationId" label="患教ID" width="136"></el-table-column>
                <el-table-column prop="authNameList" label="作者" width="100"></el-table-column>
                <el-table-column prop="sortId" label="顺序号" width="80">
                  <template slot-scope="scope">
                    <el-input type="input" placeholder="" class="tip sortId"
                              @input="inputIdFn(index,scope.$index,scope.row,$event)"
                              v-model="scope.row.sortId"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="tipsContent" label="重复提示" width="200">
                  <template slot-scope="scope">
                    <el-input type="textarea" class="tip" placeholder="重复提示"
                              @input="inputTipFn(index,scope.$index,scope.row,$event)"
                              maxlength="20"
                              v-model="scope.row.tipsContent"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" prop="delete">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row, index)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="专业" prop="major" class="addDesc">
          <el-input type="hidden" v-model="ruleForm.major" style="display: none;"></el-input>
          <button class="el-icon-plus" @click.stop="showMajorFn">选择专业</button>
          <ul class="addDescContent" v-if="ShowMajCho" >
            <span class="triangleUp"></span>
            <li class="descItem" v-for="(item,index) in major" v-bind:key="index">{{item.labelName}}</li>
          </ul>
        </el-form-item>
        <el-form-item label="疾病阶段" prop="illness" class="addDesc">
          <el-input type="hidden" v-model="ruleForm.illness" style="display:none;"></el-input>
          <button class="el-icon-plus" @click.stop="showIllnessFn">选择标签</button>
          <ul class="addDescContent" v-if="ShowIllCho">
            <span class="triangleUp"></span>
            <li class="descItem" v-for="(item,index) in illness" v-bind:key="index">{{item.labelName}}</li>
          </ul>
        </el-form-item>

        <el-form-item label="手册专家" prop="peopleId">
          <el-input v-model="ruleForm.peopleId" placeholder="填写用户id，多个用户以“,”隔开" class="width300"></el-input>
          <span class="tipTxt">(不填则默认为官方)</span>
        </el-form-item>

        <el-form-item label="封面" prop="coverImg">
          <upload-img @imgpk="imgpk01" :formData="paramData01" :imgData="imgData01"></upload-img>
        </el-form-item>

        <el-form-item label="属性" prop="property">
          <el-radio-group v-model="ruleForm.property">
            <el-radio label="1">公开</el-radio>
            <el-radio label="2">隐私(不允许被搜索)</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="ruleForm.state">
            <el-radio label="2">下架</el-radio>
            <el-radio label="1">上架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button class="submitBtn" @click="submitForm('ruleFormCon')" v-text="manualId?'保存':'创建手册'">保存</el-button>
          <el-button class="cancleBtn" @click="resetForm('ruleFormCon')">返回</el-button>
        </el-form-item>
      </el-form>
    </section>
    <!--选择专业弹层-->
    <section class="selectBox" v-show="isShowMajor">
      <section class="selectMajorCon">
        <i class="closeBtn" @click.stop="chooseMajor(false)"></i>
        <h3 class="title">选择专业</h3>
        <ul class="majorList">
          <li v-for="(item,i) in majorArrList" @click.stop="majorCli(i)" :labelId="item.labelId"
              :class="{active:item.isExist==1}" v-bind:key="i">{{item.labelName}}
          </li>
        </ul>
        <p :class="{'sureBtn':true,'ev-majorBtn':true,'active':majorToSubmit}" @click.stop="majorSub">确认</p>
      </section>
    </section>
    <!--选择专业结束-->
    <!--选择疾病阶段-->
    <section class="selectBox" v-show="isShowIllness">
      <section class="selectDiseaseCon">
        <i class="closeBtn" @click.stop="chooseIllness(false)"></i>
        <h3 class="title">选择疾病阶段</h3>
        <ul class="diseaseList">
          <li v-for="(item,i) in illArrList" @click.stop="illnessCli(i)" :class="{active:item.isExist==1}" v-bind:key="i">
            {{item.labelName}}
          </li>
        </ul>
        <p :class="{'sureBtn':true,'ev-illnessBtn':true,'active':illnessToSubmit}" @click.stop="illnessSub">确认</p>
      </section>
    </section>
    <!--选择疾病阶段结束-->
    <!--选择类型-->
    <section class="selectBox" v-if="isShowType">
      <section class="selectTypeCon">
        <i class="closeBtn" @click.stop="showTypeFn(false)"></i>
        <h3 class="title">选择类型</h3>
        <p class="tips">(确定后无法修改)</p>
        <aside class="selectBtn"><p @click.stop="typeCho(0)" :class="{'active':isClass}">分类</p>
          <p @click.stop="typeCho(-1)" :class="{'active':isNoClass}">不分类</p></aside>
        <p :class="{'sureBtn':true,'ev-majorBtn':true,'active':isClass||isNoClass}" @click.stop="chooseSub">确认</p>
      </section>
    </section>
    <!--选择类型结束-->
    <!--选择内容弹层-->
    <section class="selectBox" v-show="isShowAdd">
      <section class="selectConBox">
        <i class="closeBtn" @click.stop="showAddFn(false)"></i>
        <h3 class="title">选择内容</h3>
        <!--筛选开始-->
        <aside class="screeningBox">
          <el-form :model="ruleForm" ref="ruleForm" label-width="68px" class="contentName">
            <el-form-item label="查询患教" prop="paEduName">
              <el-input v-model="ruleForm.paEduName" class="conInput" placeholder="患教名称"></el-input>
            </el-form-item>
            <el-form-item label="患教ID" prop="paEduId">
              <el-input v-model="ruleForm.paEduId" class="conInput" placeholder="患教ID"></el-input>
            </el-form-item>
            <p class="queryBtn" @click.stop="searchAddList">查询</p>
          </el-form>
        </aside>
        <!--筛选结束-->
        <!--表单部分开始-->
        <el-table
          :data="typeListArr"
          width="100%"
          height="500"
          class="ev-table"
        >
          <el-table-column prop="educationName" label="患教标题" width="297"></el-table-column>
          <el-table-column prop="educationContentType" label="患教内容类型" width="128"
                           :formatter="forType"></el-table-column>
          <el-table-column prop="true" label="是否有效" width="100" :formatter="forVal">有效</el-table-column>
          <el-table-column prop="isReprint" label="是否转载" width="181" :formatter="forRep"></el-table-column>
          <el-table-column prop="isExist" label="操作">
            <template slot-scope="scope">
              <p :class="{addBtn:true,active:typeListArr[scope.$index].isExist==1}"
                 @click="addCliFn(scope.$index,typeListArr)"
                 v-text="typeListArr[scope.$index].isExist==1?'已添加':'添加'"></p>
            </template>
          </el-table-column>
        </el-table>
        <!--表单部分结束-->
        <!--列表分页开始-->
        <div class="block ev-pages" v-if="totalCount>10">
          <el-pagination
            class="al-bs-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30,50,100]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper, sizes"
            :total="totalCount">
          </el-pagination>
        </div>
        <!--列表分页结束-->
      </section>
    </section>
    <!--选择内容弹层结束-->
  </section>
</template>
<style lang="scss">
  @import "./components/sass/patientEduDesc";
</style>
<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
import uploadImg from '@/components/common/upload/uploadImgPatient';
import {getPageOperation} from '@/assets/js/utils/auth';
export default {
  name: 'patientEduDesc',
  data() {
    // 检查手册名字输入
    let checkNameLen = (rule, value, callback) => {
      if (value && comm.getByteLen(value) > 20) {
        this.ruleForm.name = this.ruleForm.name.substring(0, 20);
      }
      callback();
    };
      // 适应人群（最多100字限制）
    let checkPeoLen = (rule, value, callback) => {
      if (value && comm.getByteLen(value) > 100) {
        this.ruleForm.people = this.ruleForm.people.substring(0, 100);
      }
      callback();
    };
    let checkExpertLen = (rule, value, callback) => {
      if (value && comm.getByteLen(value) > 100) {
        this.ruleForm.expert = this.ruleForm.expert.substring(0, 100);
      }
      callback();
    };
    let checkPeoId = (rule, value, callback) => {
      if (value) {
        this.ruleForm.peopleId = this.ruleForm.peopleId.replace(/[^\d|,|，]/g, '');
      }
      callback();
    };
    return {
      // 编辑的时候给上传图片传参
      paramData01: {
        visitSiteId: 25,
        extName: '',
        fileContent: '',
        attType: 6,
        fileName: ''
      },
      // 编辑的时候给上传图片传参封面
      imgData01: {
        src: '',
        id: ''
      },
      ruleForm: {
        name: '', // 手册名称
        people: '', // 适应人群
        expert: '', // 专家说
        addDesc: '', // 添加内容
        peopleId: '', // 手册专家
        major: '', // 专业
        illness: '', // 疾病阶段
        coverImg: '', // 上传图片
        property: '1', // 属性
        state: '2', // 状态
        paEduName: '' // 患教名称
      },
      rules: {
        name: [
          {required: true, message: '请填写患教手册名称', trigger: ''},
          {validator: checkNameLen}
        ],
        people: [
          {required: false, message: '请填写适应人群', trigger: 'blur'},
          {validator: checkPeoLen}
        ],
        expert: [
          {required: false, message: '请填写专家说', trigger: 'blur'},
          {validator: checkExpertLen}
        ],
        addDesc: [
          {required: true, message: '请添加内容', trigger: 'change'}
        ],
        major: [
          {required: true, message: '请添加专业', trigger: 'change'}
        ],
        illness: [
          {required: true, message: '请添加疾病阶段', trigger: 'change'}
        ],
        peopleId: [
          {required: false, message: '请填写手册专家', trigger: 'change'},
          {validator: checkPeoId}
        ],
        coverImg: [
          {required: true, message: '请上传封面图片', trigger: 'change'}
        ],
        property: [
          {required: true, message: '请选择属性', trigger: 'change'}
        ],
        state: [
          {required: true, message: '请选择状态', trigger: 'change'}
        ]
      },
      isShowAddFlag: false, // 添加内容按钮点击，展示添加内容弹层
      addCliFlag: false, // 选择了添加内容按钮。
      majorArrList: [], // 专业列表数据
      majorOldArrList: [], // 专业列表获取到的数据
      majorNewArrList: [], // 当前选中的数据
      majorActiveList: '', // 专业列表选中的专业id
      major: [], // 列表中展示的专业
      isShowMajor: false, // 是否显示选择专业弹层
      ShowMajCho: false, // 是否显示已经选择的专业名称
      choMajor: [], // 已经选择的专业名称
      illOldArrList: [], // 疾病阶段获取到的数据
      illNewArrList: [], // 疾病阶段最新选择的数据
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
      illnessActiveList: '', // 已经选择的疾病阶段id
      ShowIllCho: false, // 是否显示已经选择的疾病阶段
      choIllness: [], // 已经选择的疾病阶段
      illness: [], // 已经选择的疾病阶段
      chooseTypeBtn: true, // 选择分类按钮
      createTypeBtn: false, // 创建分类
      isShowType: false, // 显示选择分类弹层
      showTypeList: false, // 必填项中分类列表是否显示（不是弹层）
      typeState: 0, // 选择分类，默认选择分类
      isShowAdd: false, // 是否显示添加内容弹层
      typeListArr: [], // 选择类型列表弹层数据
      creTypeArr: [], // 创建分类后所有分类数组（会有很大的数据量，加油~）
      creTypeOldArr: [],
      creDeletObj: {}, // 删除的对象
      creSubmitArr: [], // 存放所有提交的数据
      creDeletAll: [], // 存放删除分类的数据
      creLoadingFlag: false, // 因为选择分类数据量大所以单独为其加一个loading状态，当选择分类数据加载完成后隐藏loading
      addTypeInd: '', // 选择添加类型的索引，标示是添加在哪个列表里
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页数据条数
      totalCount: 0, // 数据总数
      isClassify: comm.getpara().isClassify, // 获取是否分类
      manualId: comm.getpara().manualId, // 手册id
      idNum: comm.getpara().idNum, // 列表的id
      isAdmin: false, // 列表的id
      educationName: '', // 患教名称
      majorToSubmit: false, // 选择专业是否可以提交
      illnessToSubmit: false, // 选择疾病阶段是否可以提交
      isClass: false, // 点击分类
      isNoClass: false// 点击不分类
    };
  },
  components: {
    uploadImg
  },
  methods: {
    // 封面图片
    imgpk01(val) {
      let t = this;
      t.imgData01.src = val.attUrl;
      t.imgData01.attWidth = val.attWidth;
      t.imgData01.attHeight = val.attHeight;
      t.imgData01.attSize = val.attSize;
      t.imgData01.attName = val.attName;// 附件说明
      t.imgData01.sendUrl = val.sendUrl;
      t.imgData01.attFormat = val.attFormat;
      if (val.attUrl) {
        this.ruleForm.coverImg = true;
      }
      else {
        this.ruleForm.coverImg = '';
      }
    },
    // 提交按钮点击
    submitForm(formName) {
      let t = this;
      // 提交时进行判断添加内容是否是空
      if (t.creTypeArr.length > 0) {
        t.ruleForm.addDesc = 1;
      }
      else {
        t.ruleForm.addDesc = '';
      }
      if (t.imgData01.src) {
        this.ruleForm.coverImg = true;
      }
      else {
        this.ruleForm.coverImg = '';
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          t.submitInfoFn();// 提交患教手册信息
        }
        else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 提交内容
    submitInfoFn() {
      let t = this, param = {};
      param.manualName = t.ruleForm.name;// 手册名称
      param.adaptCrowd = t.ruleForm.people;// 适应人群
      param.expertsSay = t.ruleForm.expert;// 专家说
      param.openState = t.ruleForm.property;// 属性
      param.state = t.ruleForm.state;// 状态
      param.recommender = t.ruleForm.peopleId.replace(/，/g, ',');// 手册专家idList
      param.manualId = t.manualId ? t.manualId : undefined;// 手册id
      param.isValid = 1;// 是否有效
      param.manualLabelList = [];// 专业
      // param.attUrl = t.imgData01.src;//图片地址
      param.attUrl = t.imgData01.sendUrl;// 图片地址
      param.attId = t.imgData01.id ? t.imgData01.id : undefined;// 图片id
      param.attName = t.imgData01.attName ? t.imgData01.attName : undefined;// 图片附件说明
      param.attWidth = t.imgData01.attWidth ? t.imgData01.attWidth : undefined;
      param.attSize = t.imgData01.attSize ? t.imgData01.attSize : undefined;
      param.attType = 6;// 附件类型：1-图片，2-视频,4-视频缩略图,5-语音,6-封面图片7-普通二维码8-小程序二维码
      param.attFormat = t.imgData01.attFormat;//
      param.attHeight = t.imgData01.attHeight;//
      param.isClassify = t.isClassify;
      // param.id = t.idNum;//添加id用来修改基础信息
      t.creSubmitArr = [];
      t.illNewArrList = [];
      t.majorNewArrList = [];
      // ---------此处开始
      // 循环所有项如果已经添加则进行追加，并将id置0，方便以后修改。
      for (let i in t.majorArrList) {
        if (t.majorArrList[i].isExist === 1) {
          t.majorNewArrList.push({
            'labelName': t.majorArrList[i].labelName,
            'labelType': '1',
            'labelId': t.majorArrList[i].labelId,
            'id': '',
            'manualId': t.manualId ? t.manualId : '', // 手册id
            'isValid': 1
          });
        }
      }
      // 循环旧项和新项如果能对应上则没有删除，将id置为原来id；如果没有isvalid置0
      let manualLabelList = [];
      for (let m = 0; m < t.majorOldArrList.length; m++) {
        for (let n = 0; n < t.majorNewArrList.length; n++) {
          if (t.majorOldArrList[m].labelId === t.majorNewArrList[n].labelId) {
            t.majorNewArrList[n].id = t.majorOldArrList[m].id;
            break;
          }
          // 将删除的项isValid置为0
          if (n === t.majorNewArrList.length - 1) {
            manualLabelList.push({
              'labelName': t.majorOldArrList[m].labelName,
              'labelType': '1',
              'labelId': t.majorOldArrList[m].labelId,
              'id': t.majorOldArrList[m].id,
              'manualId': t.manualId ? t.manualId : '', // 手册id
              'isValid': 0
            });
          }
        }
      }
      for (let i in t.majorNewArrList) {
        if (t.manualId) { // 如果是编辑状态
          if (t.majorNewArrList[i].id) { // 循环所有的项如果id存在则表示以前已经选择过
            manualLabelList.push({
              'labelName': t.majorNewArrList[i].labelName,
              'labelType': '1',
              'labelId': t.majorNewArrList[i].labelId,
              'id': t.majorNewArrList[i].id ? t.majorNewArrList[i].id : '',
              'manualId': t.manualId ? t.manualId : '', // 手册id
              'isValid': t.majorNewArrList[i].id ? 1 : ''
            });
          }
          else {
            manualLabelList.push({
              'labelName': t.majorNewArrList[i].labelName,
              'labelType': '1',
              'labelId': t.majorNewArrList[i].labelId,
              'manualId': t.manualId ? t.manualId : ''// 手册id
            });
          }
        }
        else {
          manualLabelList.push({
            'labelName': t.majorNewArrList[i].labelName,
            'labelType': '1',
            'labelId': t.majorNewArrList[i].labelId
          });
        }
      }
      // 将已经选择的进行追加
      for (let j in t.illArrList) {
        if (t.illArrList[j].isExist === 1) {
          t.illNewArrList.push({
            'labelName': t.illArrList[j].labelName,
            'labelType': '2',
            'labelId': t.illArrList[j].labelId,
            'id': '',
            'manualId': t.manualId ? t.manualId : '', // 手册id
            'isValid': 1
          });
        }
      }
      // 循环旧项和新项如果能对应上则没有删除，将id置为原来id；如果没有isvalid置0
      for (let m1 = 0; m1 < t.illOldArrList.length; m1++) {
        for (let n1 = 0; n1 < t.illNewArrList.length; n1++) {
          if (t.illOldArrList[m1].labelId === t.illNewArrList[n1].labelId) {
            t.illNewArrList[n1].id = t.illOldArrList[m1].id;
            break;
          }
          // 将删除的项isValid置为0
          if (n1 === t.illNewArrList.length - 1) {
            manualLabelList.push({
              'labelName': t.illOldArrList[m1].labelName,
              'labelType': '2',
              'labelId': t.illOldArrList[m1].labelId,
              'id': t.illOldArrList[m1].id,
              'manualId': t.manualId ? t.manualId : '', // 手册id
              'isValid': 0
            });
          }
        }
      }
      for (let i in t.illNewArrList) {
        if (t.manualId) { // 如果存在则表示是编辑，则传入manualId
          if (t.illNewArrList[i].id) {
            manualLabelList.push({
              'labelName': t.illNewArrList[i].labelName,
              'labelType': '2',
              'labelId': t.illNewArrList[i].labelId,
              'id': t.illNewArrList[i].id ? t.illNewArrList[i].id : '',
              'manualId': t.manualId ? t.manualId : '', // 手册id
              'isValid': t.illNewArrList[i].id ? 1 : ''
            });
          }
          else {
            manualLabelList.push({
              'labelName': t.illNewArrList[i].labelName,
              'labelType': '2',
              'labelId': t.illNewArrList[i].labelId,
              'manualId': t.manualId ? t.manualId : ''// 手册id
            });
          }
        }
        else { // 如果没有，则表示创建不传入manualId
          manualLabelList.push({
            'labelName': t.illNewArrList[i].labelName,
            'labelType': '2',
            'labelId': t.illNewArrList[i].labelId
          });
        }
      }
      param.manualLabelList = JSON.stringify(manualLabelList);
      // ---------此处结束
      if (t.creDeletAll.length) { // 判断如果有删除分类的场景
        for (let a in t.creDeletAll) {
          t.creDeletAll[a].isValid = 0;
        }
        t.creSubmitArr = t.creSubmitArr.concat(t.creDeletAll);// 将删除的分类进行追加
      }
      for (let k in t.creTypeArr) {
        if (t.creTypeArr[k].manualList) { // 容错
          if (t.creDeletObj.hasOwnProperty(k)) { // 如果存在单条删除
            t.creSubmitArr.push({
              manualList: t.creTypeArr[k].manualList.concat(t.creDeletObj[k].manualList),
              parentId: t.creTypeArr[k].parentId,
              parentName: t.creTypeArr[k].parentNameSave,
              sortId: k,
              id: t.creDeletObj[k].id,
              isValid: 1
            });
          }
          else { // 如果没有进行单条删除
            t.creTypeArr[k].sortId = k;
            t.creTypeArr[k].id = t.creTypeArr[k].id ? t.creTypeArr[k].id : '';
            t.creTypeArr[k].isValid = t.creTypeArr[k].id ? 1 : '';
            t.creTypeArr[k].parentId = t.isClassify;
            t.creTypeArr[k].parentName = t.creTypeArr[k].parentNameSave;
            // t.creTypeArr[k].parentName = t.creTypeArr[k].parentNameSave ? t.creTypeArr[k].parentNameSave : '';/
            // delete(t.creTypeArr[k]["parentNameSave"]);
            t.creSubmitArr = t.creSubmitArr.concat(t.creTypeArr[k]);
          }
        }
      }
      // console.log(t.creSubmitArr);
      param.dataList = JSON.stringify(t.creSubmitArr);// 选择内容列表
      function callback(res) {
        if (res && res.data && res.data.responseObject) {
          if (window.history.length <= 1) {
            t.$router.push({path: 'patientEduList'});
            return false;
          }
          else {
            t.$router.go(-1);
          }
        }
      }
      // console.log(param)
      t.getListAxios(apiConfig.submitInfo.url, param, callback, apiConfig.submitInfo.type);
    },
    // 返回历史页面
    resetForm(formName) {
      let t = this;
      t.$refs[formName].resetFields();
      if (window.history.length <= 1) {
        t.$router.push({path: '/'});
        return false;
      }
      else {
        t.$router.go(-1);
      }
    },
    // 编辑时获取基础数据
    getBaseInfo() {
      let t = this;
      let param = {
        isValid: 1,
        manualId: t.manualId
      };
      let callback = (res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          let data = res.data.responseObject.responseData.dataList[0];
          t.ruleForm.name = data.manualName;// 手册名称
          t.ruleForm.people = data.adaptCrowd;// 适应人群
          t.ruleForm.expert = data.expertsSay;// 专家说
          t.ruleForm.peopleId = data.recommender;// 患教id
          t.ruleForm.property = data.openState;// 属性
          t.ruleForm.state = data.state;// 状态
          t.imgData01.src = data.attUrl;// 图片照片
          t.imgData01.id = data.attId;// 图片id
          t.imgData01.attWidth = data.attWidth;
          t.imgData01.attHeight = data.attHeight;
          t.imgData01.attSize = data.attSize;
          t.imgData01.attName = data.fileName ? data.fileName.substring(0, data.fileName.indexOf('.')) : '';// 附件说明
          t.imgData01.sendUrl = data.attUrls;
          t.imgData01.attFormat = data.attFormat;
          t.isClassify = data.isClassify;
        }
      };
      t.getListAxios(apiConfig.manualBaseInfo.url, param, callback, apiConfig.manualBaseInfo.type);
    },
    // 编辑时获取分类列表数据,
    typeContentFn() {
      let t = this;
      t.creLoadingFlag = true;
      let param = {
        isValid: 1,
        firstResult: 0,
        maxResult: 20,
        manualId: t.manualId,
        isClassify: t.isClassify,
        sortType: 3
      };
      function callback(res) {
        t.creLoadingFlag = false;
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          let data = res.data.responseObject.responseData.dataList;
          for (let i in data) {
            for (let j in data[i].manualList) {
              // data[i].manualList[j].nodeNum = data[i].manualList[j].id;
              data[i].manualList[j].nodeNum = parseInt(j) + 1;
            }
            data[i].parentNameSave = JSON.parse(JSON.stringify(data[i].parentName));
          }
          t.creTypeArr = t.creTypeArr.concat(data);
          t.creTypeOldArr = JSON.parse(JSON.stringify(t.creTypeOldArr.concat(data)));// 将获取到的数据进行保存
          // if (data.length > 0) {
          //   t.typeState = data[0].parentId;
          //   if (t.typeState == 0) {//表示是创建分类
          //     t.createTypeBtn = true;//创建分类按钮
          //   } else {
          //     t.createTypeBtn = false;//创建分类按钮
          //   }
          //   t.showTypeList = true;//下方展示的列表项
          //   t.chooseTypeBtn = false;//选择分类按钮
          // }
        }
        if (t.manualId) { // 表示是编辑
          t.typeState = t.isClassify;
          if (t.typeState === 0) { // 表示是创建分类
            t.createTypeBtn = true;// 创建分类按钮
          }
          else {
            t.createTypeBtn = false;// 创建分类按钮
          }
          t.showTypeList = true;// 下方展示的列表项
          t.chooseTypeBtn = false;// 选择分类按钮
        }
      }
      t.getListAxios(apiConfig.getConUrl.url, param, callback, apiConfig.getConUrl.type);
    },
    // 获取专业列表
    majorArrFn() {
      let t = this;
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
          t.majorArrList = t.majorArrList.concat(data);// 将专业列表进行追加
          if (t.manualId) { // 如果存在则表示是编辑状态，则进行请求已添加的标签
            let paramIsExist = {
              manualId: t.manualId,
              isValid: 1,
              firstResult: 0,
              maxResult: 20,
              labelType: 1 // 标签类型：1专业2疾病
            };
            let callbackIs = (resIs) => {
              if (resIs && resIs.data && resIs.data.responseObject && resIs.data.responseObject.responseData && resIs.data.responseObject.responseData.dataList) {
                let dataIs = resIs.data.responseObject.responseData.dataList;
                t.majorOldArrList = t.majorOldArrList.concat(dataIs);// 将已经选择的专业编辑时的列表进行备份，以后比较是否是删除了
                if (dataIs.length > 0) { // 表示有已经选择的专业数据
                  for (let i in data) { // 与原来的进行匹配，是否存在经选择的数据项
                    for (let it in dataIs) {
                      if (dataIs[it].labelId === data[i].labelId.toString()) {
                        t.ShowMajCho = true;
                        t.ruleForm.major = 1;
                        data[i].isExist = 1;
                        t.majorToSubmit = true;
                        t.major.push(dataIs[it]);// 将已经选择的专业进行存储
                      }
                    }
                  }
                }
              }
            };
            t.getListAxios(apiConfig.getLabelUrl.url, paramIsExist, callbackIs, apiConfig.getLabelUrl.type);
          }
        }
      }
      t.getListAxios(apiConfig.getLabelListNew.url, param, callback, apiConfig.getLabelList.type);
    },
    // 获取疾病列表
    illArrFn() {
      let t = this;
      let param = {
        manualId: t.manualId,
        isValid: 1,
        firstResult: 0,
        maxResult: 20,
        labelType: 2
      };

      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          let data = res.data.responseObject.responseData.dataList;
          t.illOldArrList = t.illOldArrList.concat(data);
          for (let i in t.illArrList) { // 获取数据进行对比
            for (let j in t.illOldArrList) {
              if (t.illOldArrList[j].labelId === t.illArrList[i].labelId) { // 如果id相等
                t.illArrList[i].isExist = 1;
                t.ShowIllCho = true;
                t.ruleForm.illness = 1;
                t.illnessToSubmit = true;
                t.illness.push(t.illOldArrList[j]);
              }
            }
          }
        }
      }

      t.getListAxios(apiConfig.getLabelUrl.url, param, callback, apiConfig.getLabelUrl.type);
    },
    // 点击选择专业按钮
    showMajorFn() {
      let _this = this;
      _this.isShowMajor = true;
      _this.majorToSubmit = false;
      for (let i in _this.majorArrList) {
        _this.majorArrList[i].isExist = 0;
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
      // 以前代码begin
      // for (let i = 0; i < $('.majorList li').length; i++) {
      //   if ($('.majorList li').eq(i).hasClass('active')) {
      //     $('.ev-majorBtn').addClass('active');
      //   }
      // }
      // for (let k = 0; k < t.majorArrList.length; k++) {
      //   if (t.majorArrList[k].isExist == 1) {
      //     $('.majorList li').eq(k).addClass('active')
      //   } else {
      //     $('.majorList li').eq(k).removeClass('active')
      //   }
      // }
      // 以前代码end
    },
    // 专业列表项点击
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
        if (parseInt(i) === parseInt(_this.majorArrList.length - 1)) { // 当循环到最后一项也没有找到已经点击的数据则将按钮不可点击
          _this.majorToSubmit = false;
        }
      }
      // 以前代码begin
      // let t = this, majroArr = '';//定义局部变量用来标示是否确定按钮可以点击
      // if ($('.majorList li').eq(i).hasClass('active')) {
      //   $('.majorList li').eq(i).removeClass('active');
      // } else {
      //   $('.majorList li').eq(i).addClass('active');
      // }
      // for (let k = 0; k < $('.majorList li').length; k++) {
      //   if ($('.majorList li').eq(k).hasClass('active')) {
      //     majroArr += $('.majorList li').eq(k).attr("labelId") + ',';
      //   }
      // }
      // 确定按钮可以点击
      // if (majroArr.length <= 0) {
      //   $('.ev-majorBtn').removeClass('active');
      // } else {
      //   $('.ev-majorBtn').addClass('active');
      // }
      // 以前代码end
    },
    // 点击选择专业确定按钮
    majorSub() {
      let t = this;
      if (t.majorToSubmit) {
        t.majorActiveList = '';
        t.choMajor = [];
        t.majorNewArrList = [];
        // for (let k = 0; k < $('.majorList li').length; k++) {
        //   if ($('.majorList li').eq(k).hasClass('active')) {
        //     t.majorArrList[k].isExist = 1;
        //   } else {
        //     t.majorArrList[k].isExist = 0;
        //   }
        // }
        t.major = [];
        for (let i in t.majorArrList) {
          if (t.majorArrList[i].isExist === 1) {
            t.major.push(t.majorArrList[i]);
          }
        }
        t.isShowMajor = false;
        t.ShowMajCho = true;
        t.ruleForm.major = 1;
      }
    },
    // 点击疾病阶段按钮
    showIllnessFn() {
      let _this = this;
      _this.isShowIllness = true;
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
      // for (let i = 0; i < $('.diseaseList li').length; i++) {
      //   if ($('.diseaseList li').eq(i).hasClass('active')) {
      //     $('.ev-illnessBtn').addClass('active');
      //   }
      // }
      // for (let k = 0; k < t.illArrList.length; k++) {
      //   if (t.illArrList[k].isExist == 1) {
      //     $('.diseaseList li').eq(k).addClass('active')
      //   } else {
      //     $('.diseaseList li').eq(k).removeClass('active')
      //   }
      // }
    },
    // 疾病列表项点击
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
        if (parseInt(i) === parseInt(_this.illArrList.length - 1)) { // 当循环到最后一项也没有找到已经点击的数据则将按钮不可点击
          _this.illnessToSubmit = false;
        }
      }

      // let t = this, IllnessArr = '';//定义局部变量用来标示是否确定按钮可以点击
      // if ($('.diseaseList li').eq(i).hasClass('active')) {
      //   $('.diseaseList li').eq(i).removeClass('active');
      // } else {
      //   $('.diseaseList li').eq(i).addClass('active');
      // }
      // for (let k = 0; k < $('.diseaseList li').length; k++) {
      //   if ($('.diseaseList li').eq(k).hasClass('active')) {
      //     IllnessArr += $('.diseaseList li').eq(k).attr("state") + ',';
      //   }
      // }
      // //确定按钮可以点击
      // if (IllnessArr.length <= 0) {
      //   $('.ev-illnessBtn').removeClass('active');
      // } else {
      //   $('.ev-illnessBtn').addClass('active');
      // }
    },
    // 疾病阶段确定按钮点击
    illnessSub() {
      let _this = this;
      if (_this.illnessToSubmit) {
        _this.ShowIllCho = true;
        _this.isShowIllness = false;
        _this.ruleForm.illness = 1;
        _this.illness = [];
        for (let i in _this.illArrList) {
          if (_this.illArrList[i].isExist === 1) {
            _this.illness.push(_this.illArrList[i]);
          }
        }
      }

      // let t = this;
      // if ($('.ev-illnessBtn').hasClass('active')) {
      //   t.illnessActiveList = '';
      //   t.choIllness = [];
      //   for (let k = 0; k < $('.diseaseList li').length; k++) {
      //     if ($('.diseaseList li').eq(k).hasClass('active')) {
      //       t.illArrList[k].isExist = 1;
      //     } else {
      //       t.illArrList[k].isExist = 0;
      //     }
      //   }
      //   t.isShowIllness = false;
      //   t.ShowIllCho = true;
      //   t.ruleForm.illness = 1;
      // }
    },
    // 选择类型项点击
    typeCho(type) {
      let _this = this;
      if (type === 0) {
        _this.isClass = true;
        _this.isNoClass = false;
      }
      else {
        _this.isClass = false;
        _this.isNoClass = true;
      }

      // if (type == 0) {//分类
      //   if ($('.selectBtn p').eq(0).hasClass('active')) {
      //     $('.selectBtn p').eq(0).removeClass('active');
      //     $('.ev-chooseBtn').removeClass('active')
      //   } else {
      //     $('.selectBtn p').eq(1).removeClass('active');
      //     $('.selectBtn p').eq(0).addClass('active');
      //     $('.ev-chooseBtn').addClass('active')
      //   }
      // } else {//不分类
      //   if ($('.selectBtn p').eq(1).hasClass('active')) {
      //     $('.selectBtn p').eq(1).removeClass('active');
      //     $('.ev-chooseBtn').removeClass('active')
      //   } else {
      //     $('.selectBtn p').eq(0).removeClass('active');
      //     $('.selectBtn p').eq(1).addClass('active');
      //     $('.ev-chooseBtn').addClass('active')
      //   }
      // }
      this.isClassify = type;
    },
    // 选择分类确定点击
    chooseSub() {
      let t = this;
      t.ruleForm.addDesc = 1;
      if (t.isClass || t.isNoClass) {
        t.isShowType = false;
        t.chooseTypeBtn = false;
        t.showTypeList = true;
        t.creTypeArr.push({manualList: []});// 追加一条空数据
        t.typeState = t.isClassify;// 将类型进行存储
        if (t.typeState === 0) { // 表示选择分类
          t.createTypeBtn = true;
        }
        else {
          t.createTypeBtn = false;// 创建分类按钮
        }
      }

      // t.ruleForm.addDesc=1;
      // if ($('.ev-chooseBtn').hasClass('active')) {
      //   t.isShowType = false;
      //   t.chooseTypeBtn = false;
      //   t.showTypeList = true;
      //   t.creTypeArr.push({manualList: []});//追加一条空数据
      //   t.typeState = $('.selectBtn p[class=active]').index();//将类型进行存储
      //   if (t.typeState == 0) {//表示选择分类
      //     t.createTypeBtn = true;
      //   } else {
      //     t.createTypeBtn = false;//创建分类按钮
      //   }
      //
      // }
    },
    // 点击创建分类
    creatTypeBtn() {
      let t = this;
      t.showTypeList = true;
      // 点击创建后，追加一条数据
      t.creTypeArr.push({manualList: []});
    },
    // 点击添加内容
    addTypeBtnCli(index) {
      let t = this;
      t.currentPage = 1;
      t.addTypeBtn(index);
    },
    // 点击添加内容,获取类型列表数据
    addTypeBtn(index) {
      let t = this;
      t.isShowAdd = true;
      if (index || index === 0) { // 如果传入了id代表是点击了添加内容进行请求，而不是分页/改变整页条数请求
        t.addTypeInd = index;// 将需要添加到的列表的索引保存
      }
      let param = {
        isValid: 1,
        firstResult: (t.currentPage - 1) * t.pageSize,
        maxResult: t.pageSize,
        educationId: t.ruleForm.paEduId ? t.ruleForm.paEduId : undefined,
        educationNameLike: t.ruleForm.paEduName ? t.ruleForm.paEduName : undefined,
        manualId: t.manualId ? t.manualId : undefined,
        parentId: t.creTypeArr[index].id
      };

      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          let data = res.data.responseObject.responseData.dataList;
          t.typeListArr = [];
          t.totalCount = res.data.responseObject.responseData.totalNum;
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              let _data = data[i];
              let dataJson = {
                educationId: _data.educationId,
                educationName: _data.educationName,
                isReprint: _data.isReprint,
                educationContentType: _data.educationContentType,
                isValid: 0,
                // isExist: _data.isExist,
                isExist: 0,
                refCustomerId: _data.refCustomerId,
                authNameList: _data.authNameList,
                isValided: _data.isValid
              };
                // 进行循环已经添加过的数据，如果有匹配项则将其置为已添加
                // for(let i = 0;i<t.creTypeArr.length;i++){
              if (t.creTypeArr[index]) {
                if (t.creTypeArr[index].manualList) {
                  for (let j = 0; j < t.creTypeArr[index].manualList.length; j++) {
                    if (t.creTypeArr[index].manualList[j].educationId === _data.educationId) {
                      dataJson.isExist = 1;// 标识已添加
                      break;
                    }
                    else {
                      dataJson.isExist = 0;// 标识已添加
                    }
                  }
                }
              }
              // }
              t.typeListArr.push(dataJson);
            }
          }
        }
        else {
          t.typeListArr = [];
          t.currentPage = 1;
          t.totalCount = 0;
        }
      }

      t.getListAxios(apiConfig.getEducationList.url, param, callback, apiConfig.getEducationList.type);
    },
    // 点击查询按钮
    searchAddList() {
      let t = this;
      t.currentPage = 1;
      t.addTypeBtn(t.addTypeInd);
    },
    // 添加类型分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.addTypeBtn(this.addTypeInd);
    },
    // 添加类型当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.addTypeBtn(this.addTypeInd);
    },
    // 点击分类列表的编辑按钮，将input框置为可输入
    cliEditBtn(index) {
      document.getElementsByClassName('addClass')[index].getElementsByTagName('input')[0].removeAttribute('disabled');
      document.getElementsByClassName('addClass')[index].classList.remove('is-disabled');
      document.getElementsByClassName('addClassTop')[index].getElementsByTagName('button')[0].setAttribute('style', 'display:inline-block');
      document.getElementsByClassName('addClassTop')[index].getElementsByClassName('editBtn')[0].setAttribute('style', 'display:none');

      // $('.addClass').eq(index).find('input').removeAttr("disabled");
      // $('.addClass').eq(index).removeClass('is-disabled');
      // $('.addClassTop').eq(index).find('button').show();
      // $('.addClassTop').eq(index).find('.editBtn').hide();
    },
    // 点击列表中的添加按钮
    addCliFn(index, row) {
      let t = this;
      if (row[index].isExist !== 1) { // 表示没有被添加
        row[index].isExist = 1;
        row[index].sortId = parseInt(t.creTypeArr[t.addTypeInd].manualList.length + 1);
        row[index].nodeNum = parseInt(t.creTypeArr[t.addTypeInd].manualList.length + 1);
        // 进行循环已经添加过的数据，如果有匹配项则说明是以前添加过的数据则将isValid置1，并将id添加
        // for(let i = 0;i<t.creTypeOldArr.length;i++){
        if (t.creTypeOldArr[t.addTypeInd]) {
          if (t.creTypeOldArr[t.addTypeInd].manualList) {
            for (let j = 0; j < t.creTypeOldArr[t.addTypeInd].manualList.length; j++) {
              if (t.creTypeOldArr[t.addTypeInd].manualList[j].educationId === row[index].educationId) {
                row[index].isValid = 1;
                row[index].id = t.creTypeOldArr[t.addTypeInd].manualList[j].id;
                break;
              }
              if (j === t.creTypeOldArr[t.addTypeInd].manualList.length - 1) {
                row[index].id = '';
                row[index].isValid = '';
              }
            }
          }
        }
        // }
        t.creTypeArr[t.addTypeInd].manualList.push(row[index]);
      }
    },
    // 点击分类列表的保存按钮,将input框置为不可输入,将分类名称进行保存
    cliSaveBtn(index) {
      document.getElementsByClassName('addClass')[index].getElementsByTagName('input')[0].setAttribute('disabled', 'disabled');
      document.getElementsByClassName('addClassTop')[index].getElementsByTagName('input')[0].setAttribute('data-val', document.getElementsByClassName('addClass')[index].getElementsByTagName('input')[0].value);
      document.getElementsByClassName('addClassTop')[index].getElementsByTagName('button')[0].setAttribute('style', 'display:none');
      document.getElementsByClassName('addClassTop')[index].getElementsByClassName('editBtn')[0].setAttribute('style', 'display:inline-block');
      document.getElementsByClassName('addClassTop')[index].getElementsByTagName('input')[0].setAttribute('data-val', document.getElementsByClassName('addClassTop')[index].getElementsByTagName('input')[0].value);
      this.creTypeArr[index].parentNameSave = document.getElementsByClassName('addClassTop')[index].getElementsByTagName('input')[0].value;

      // $('.addClass').eq(index).find('input').attr('disabled', 'disabled');
      // $('.addClassTop').eq(index).find('button').attr('data-val', $('.addClass').eq(index).find('input').val());
      // $('.addClassTop').eq(index).find('button').hide();
      // $('.addClassTop').eq(index).find('.editBtn').css('display', 'inline-block');
      // $('.addClassTop').eq(index).find('button').attr('data-val', $('.addClassTop').eq(index).find('input').val());
      // this.creTypeArr[index].parentNameSave = $('.addClassTop').eq(index).find('input').val();
    },
    // 点击删除整个分类
    deleTypeBtn(index) {
      let t = this;
      this.$allin_confirm({
        title: '提示',
        content: '确定要删除吗？',
        done: function() {
          let deletIndex = t.creTypeArr[index];
          t.creTypeArr.splice(index, 1, []);
          if (t.creTypeOldArr[index]) {
            for (let i in deletIndex.manualList) {
              deletIndex.manualList[i].isValid = 0;
            }
            t.creDeletAll.push(deletIndex);
          }
        }
      });
    },
    // 分类列表点击删除当前行
    handleDelete(index, item, parIndex) {
      let t = this;
      this.$allin_confirm({
        title: '提示',
        content: '确定要删除吗？',
        done: function() {
          t.creTypeArr[parIndex].manualList.splice(index, 1);// 将当前项进行删除
          item.isValid = 0;
          if (t.creTypeOldArr[parIndex]) {
            for (let j in t.creTypeOldArr[parIndex].manualList) {
              if (item.educationId === t.creTypeOldArr[parIndex].manualList[j].educationId) {
                if (!t.creDeletObj.hasOwnProperty(parIndex)) {
                  t.creDeletObj[parIndex] = {manualList: []};
                }
                t.creDeletObj[parIndex].id = t.creTypeArr[parIndex].id;
                t.creDeletObj[parIndex].manualList.push(item);
                // t.creDeletObj[parIndex].id = item.id;
              }
            }
          }
          for (let i = 0; i < t.creTypeArr[parIndex].manualList.length; i++) {
            t.creTypeArr[parIndex].manualList[i].nodeNum = i + 1;
          }
        }
      });
    },
    // 分类列表类型数据转换
    forType(val) {
      if (val.educationContentType === 1) {
        return '视频';
      }
      else if (val.educationContentType === 2) {
        return '语音';
      }
      else if (val.educationContentType === 3) {
        return '图片';
      }
      else if (val.educationContentType === 4) {
        return '综合';
      }
      else if (val.educationContentType === 5) {
        return '纯视频';
      }
      else {
        return '文章';
      }
    },
    // 分类列表是否有效数据转换
    forVal(val) {
      return '有效';
      // if(val.isValid == '1 ')
      // {return "有效"}
      // else if (val.isValid == '0')
      // {return "无效"}
      // else
      // {return "有效"}
    },
    // 分类列表是否能转载数据转换
    forRep(val) {
      if (val.isReprint === '1 ') {
        return '能转载';
      }
      else if (val.isReprint === '0') {
        return '不能转载';
      }
      else {
        return '能转载';
      }
    },
    // 分类列表序列号输入
    inputIdFn(parentIndex, rowI, row, e) {
      this.creTypeArr[parentIndex].manualList[rowI].sortId = e;
    },
    // 分类列表提示语句输入
    inputTipFn(parentIndex, rowI, row, e) {
      this.creTypeArr[parentIndex].manualList[rowI].tipsContent = e;
    },
    // 根据eslint规范2019/3/26进行修改将原文中的function抽离出单独的方法
    // 点击选择内容的某一项后
    chooseTxt() {
      this.isShowType = true;
      this.isClass = false;
      this.isNoClass = false;
    },
    // 选择专业弹层右上角关闭按钮
    chooseMajor(flag) {
      this.isShowMajor = flag;
    },
    // 选择疾病阶段弹层右上角关闭按钮
    chooseIllness(flag) {
      this.isShowIllness = flag;
    },
    // 选择类型点击右上角关闭按钮
    showTypeFn(flag) {
      this.isShowType = flag;
    },
    // 选择内容弹层右上角关闭按钮
    showAddFn(flag) {
      this.isShowAdd = flag;
    },
    // 获取数据公共方法
    getListAxios(path, params, callback, type, errorCallback) {
      let t = this;
      comm.openLoading('加载中...');
      if (type === 'post') {
        axios({
          method: 'post',
          url: path,
          data: params
        }).then((res) => {
          callback && callback(res);
          if (!t.creLoadingFlag) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          if (!t.creLoadingFlag) {
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
          if (!t.creLoadingFlag) {
            comm.closeLoading();
          }
        }).catch((e) => {
          comm.closeLoading();
          errorCallback && errorCallback();
          if (!t.creLoadingFlag) {
            comm.closeLoading();
          }
          console.log('获取数据失败：', e);
        });
      }
    }
  },
  filters: {
  },
  mounted() {
    let t = this;
    let pageOperation = getPageOperation('/patientEduList');// 获取权限
    t.isAdmin = pageOperation === 721;
    if (t.isAdmin) { // 是否是管理员
      t.majorArrFn();// 获取专业列表数据
      if (t.manualId) { // 如果是编辑转台
        t.typeContentFn();// 获取已选择的列表内容
        t.illArrFn();// 获取疾病阶段已经选择的列表
        t.getBaseInfo();// 获取基础信息
      }
    }
    else { // 跳转到列表页
      t.$router.push({path: 'patientEduList'});
    }
  },
  // 离开当前页面后执行
  destroyed: function() {
    comm.goBack();
  }
};
</script>
