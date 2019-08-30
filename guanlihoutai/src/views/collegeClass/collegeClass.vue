<template>
    <section class="class-contanier">
      <h1 class="code-title">唯医学院课</h1>
      <section class="college-main-contanier">
        <section class="collegeContent">
          <div class="info-share">
            <i class="icon-bg"></i>
            <span class="share-title">模块信息</span>
          </div>
          <section class="code-button newCollegesBtn code-addItem-btn">
            <el-button class="el-icon-circle-plus creat-button" @click="creatCollege"> 新增学院模块</el-button>
          </section>
          <section class="college-item" v-for="(item,index) in collegeItem" :key="index">
            <div class="add-from" v-if="item.isShowInput">
              <i class="icon-must"><i>*</i> 模块名称</i>
              <el-input
                placeholder="请输入名称"
                class="content-input"
                v-model.trim="item.themeName"
                maxlength="12"
              ></el-input>
              <span class="college-button college-button-name active" v-show="item.oldName" @click="nameSaveCancle(item.themeName,index)">取消</span>
            </div>
            <div class="add-from-title" v-if="!item.isShowInput">
              <i class="icon-must"><i>*</i> 模块名称</i>
              <span class="content-text">{{item.themeName}}</span>
              <span class="college-button"  @click="nameEdit(index)">编辑</span>
            </div>
            <span class="collegeDeleteAllBtn" v-show="collegeItem.length > 1" @click="collegeDeleteAllFn(index, item)">删除</span>
            <section class="code-button">
              <i class="icon-must"><i>*</i> 模块名称</i>
              <el-button class="el-icon-circle-plus creat-button add-content-btn" @click="addCollege(index)"> 添加课程</el-button>
            </section>

            <!--列表-->
            <section>
              <el-table
                ref="multipleTable"
                :data="item.courseList"
                style="width: 90%;margin: 0 auto"
                :key="index"
              >
                <!--展示数据时显示-->
                <el-table-column
                  prop=""
                  label="序号"
                  width="50"
                  type="index"
                >
                </el-table-column>
                <el-table-column
                  prop="themeName"
                  label="内容名称"
                  width="300"
                >
                  <template slot-scope="scope">
                    <div style="float:left;width:60px;">
                      <img :src="getAtturl(scope.row)" style="width:52px; height:40px;">
                    </div>
                    <div style="float:left;width:200px;">
                      {{ scope.row.courseName }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="coursePriceElement"
                  label="售价"
                  width="100"
                  :formatter="coursePriceFor"
                >
                </el-table-column>
                <el-table-column
                  prop="courseTeacherVOList"
                  label="作者"
                  width="150"
                  :formatter="classTeacherFor"
                >
                </el-table-column>
                <el-table-column
                  prop="courseState"
                  label="上架状态"
                  width="80"
                  :formatter="groundingStateFor"
                >
                </el-table-column>
                <el-table-column
                  prop="courseState"
                  label="课程状态"
                  width="100"
                  :formatter="classStateFor"
                >
                </el-table-column>
                <el-table-column
                  prop="totalNum"
                  label="视频数"
                  width="70"
                  :formatter="totalNumFor"
                >
                </el-table-column>
                <el-table-column
                  prop="opUser"
                  label="添加人"
                  width="90"
                >
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="添加时间"
                  width="170"
                >
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="200"
                  class="delateBtn"
                  fixed="right"
                  style="text-align: center"
                >
                  <template slot-scope="scope">
                    <el-button
                      @keydown.native.prevent
                      @click.stop="changeDown(index,scope.row,scope.$index)"
                      class="changeStateBotton"
                      v-show="scope.$index !== item.courseList.length - 1"
                    >
                      下移
                    </el-button>
                    <el-button
                      @keydown.native.prevent
                      @click.stop="changeUp(index,scope.row,scope.$index)"
                      class="changeStateBotton"
                      v-show="scope.$index !== 0"
                    >
                      上移
                    </el-button>
                    <el-button
                      @keydown.native.prevent
                      @click.stop="deleteItemFn(index,scope.row,scope.$index)"
                      class="changeStateBotton"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </section>
          </section>
        </section>
        <section class="college-footer">
          <div class="info-share">
            <i class="icon-bg"></i>
            <span class="share-title">分享信息</span>
          </div>
          <figure class="share-img-con">
            <span class="share-img-info icon-must"><i>*</i> 分享海报</span>
            <article class="upload-con">
              <upload-img
                @imgDataList="imgInfo"
                :dafaultImg="themeUrl"
              ></upload-img>
            </article>
            <p class="upload-tip">建议宽度为1125px，高度不限，支持.jpeg、.jpg、.png后缀格式，图片小于5M</p>
          </figure>
        </section>
        <section class="footer-botton-con">
          <!--<div class="college-button" @click="saveSubmit(1)">保存</div>-->
          <div class="college-button" @click="saveSubmit(2)">发布</div>
        </section>
        <add-content v-if="showAdd" @closeDalog="closeDalog" @addContent="contentAdd" :defaultData="collegeItemData"></add-content>
      </section>
    </section>
</template>

<script>
/**
   * CRM 管理后台，运营配置——唯医学院管理
   * 产品版本：新后台系统v1.8.0（大版本3.8）
   * 功能信息：
   *  1，列表展示
   *  2，列表筛选展示
   *  3，添加学院，修改名称，移除学院，课程列表添加、移除、上移、下移。
   *  注意：
   *  1，学院列表、学院列表仅剩一项时不能进行删除
   */
import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';
import addContent from './components/AddContent';
import uploadImg from './components/uploadImg';
export default {
  data() {
    return {
      showAdd: false,
      collegeItemIndex: '',
      collegeItemData: [],
      themeUrl: '',
      themeUrlId: '',
      teacherArr: '', // 导师姓名
      collegeItem: [
        {
          id: '',
          isShowInput: true,
          themeName: '',
          courseList: [],
          deletCourse: []
        }
      ]
    };
  },
  methods: {
    // 添加课程
    addCollege(index) {
      this.showAdd = true;
      this.collegeItemIndex = index;
      this.collegeItemData = JSON.stringify(this.collegeItem[index].courseList);
    },
    // 关闭弹窗
    closeDalog() {
      this.showAdd = false;
    },
    // 添加课程回传的值
    contentAdd(data) {
      let _this = this,
        isShowTip = false;
      _this.showAdd = false;
      data.reverse();// 数组倒叙
      // let per=_this.collegeItem[_this.collegeItemIndex].courseList;
      let perItem = _this.collegeItem, per = [];
      for (let itemI = 0; itemI < perItem.length; itemI++) {
        if (perItem[itemI].courseList.length) {
          per = per.concat(perItem[itemI].courseList);
        }
      }
      for (let i = 0; i < data.length; i++) {
        let index = 0;
        for (let j = 0; j < per.length; j++) {
          if (per[j].id === JSON.parse(data[i]).id) {
            isShowTip = true;
            break;
          }
          else {
            index++;
          }
        }
        if (index === per.length) {
          _this.collegeItem[this.collegeItemIndex].courseList.unshift(JSON.parse(data[i]));
        }
      }
      if (isShowTip) {
        _this.$allin_confirm({
          title: '提示',
          type: 'notice',
          content: '课程重复选择'
        });
      }
    },
    // 图片信息
    imgInfo(data) {
      let _this = this, attUrl = data.attUrl;
      if (attUrl.indexOf('//img05.allinmd.cn/') === -1) {
        _this.themeUrl = '//img05.allinmd.cn/' + attUrl;
      }
      else {
        _this.themeUrl = attUrl;
      }
    },
    // 上移下移课程
    changeMove(index, indexC) {
      if (indexC === 0) { // 下移一位
        let tempOption = this.collegeItem[index].courseList[indexC + 1];
        this.$set(this.collegeItem[index].courseList, indexC + 1, this.collegeItem[index].courseList[indexC]);
        this.$set(this.collegeItem[index].courseList, indexC, tempOption);
      }
      else { // 上移一位
        let tempOption = this.collegeItem[index].courseList[indexC - 1];
        this.$set(this.collegeItem[index].courseList, indexC - 1, this.collegeItem[index].courseList[indexC]);
        this.$set(this.collegeItem[index].courseList, indexC, tempOption);
      }
    },
    // 移除课程
    deleteCollege(index, indexC) {
      let _this = this;
      _this.$confirm('是否确认移除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let dele = {
          id: _this.collegeItem[index].courseList[indexC].id,
          isValid: false,
          sortId: 1
        };
        if (!_this.collegeItem[index].deletCourse) {
          _this.collegeItem[index].deletCourse = [];
        }
        _this.collegeItem[index].deletCourse.push(dele);
        _this.collegeItem[index].courseList.splice(indexC, 1);
        // _this.$set(this.collegeItem[index].courseList, indexC, dele)
      }).catch(() => {
      });
    },
    //  取消保存名字
    nameSaveCancle(themeName, index) {
      if (this.collegeItem[index].oldName) {
        this.collegeItem[index].isShowInput = false;
        this.collegeItem[index].themeName = this.collegeItem[index].oldName;
        this.$forceUpdate();
      }
    },
    //  编辑名字
    nameEdit(index) {
      this.collegeItem[index].isShowInput = true;
      this.$forceUpdate();
    },
    // 保存
    saveSubmit(type) {
      let _this = this;
      let argumentInfo = _this.argumentInfo();
      if (!argumentInfo) {
        return false;
      }
      else {
        this.$allin_confirm({
          title: '提示',
          content: '提交后，学院频道信息将同步更新，是否确认？',
          done: function() {
            let courseThemeList = argumentInfo;
            let param = {
              id: _this.themeUrlId,
              themeUrl: _this.themeUrl,
              courseThemeList: courseThemeList,
              publishState: type
            };
            comm.openLoading('加载中...');
            axios({
              method: apiConfig.addOrUpdateTheme.type,
              url: apiConfig.addOrUpdateTheme.url,
              data: param
            }).then((res) => {
              comm.closeLoading();
              if (
                res &&
                res.data &&
                res.data.responseObject &&
                res.data.responseObject.responseStatus
              ) {
                _this.$allin_confirm({title: '提示', content: '发布成功', type: 'notice'});
                _this.getThemeCourseList();
              }
              else {
                _this.$allin_confirm({title: '提示', content: '发布失败', type: 'notice'});
              }
            }).catch((e) => {
              comm.closeLoading();
              this.$allin_confirm({title: '提示', content: '发布失败', type: 'notice'});
              console.log('获取数据失败：', e);
            });
          }
        });
      }
    },
    //  处理保存的参数
    argumentInfo() {
      let courseThemeList = [], _this = this;
      for (let i = 0; i < _this.collegeItem.length; i++) {
        if (!_this.collegeItem[i].themeName) {
          _this.$alert('请输入栏目名称', '提示', {
            confirmButtonText: '确定',
            callback: action => {

            }
          });
          return false;
        }
        if (_this.collegeItem[i].courseList && _this.collegeItem[i].courseList.length) {
          let courseList = [];
          for (let j = 0; j < _this.collegeItem[i].courseList.length; j++) {
            courseList.push({
              id: _this.collegeItem[i].courseList[j].id,
              sortId: j + 1
            });
          }
          if (_this.collegeItem[i].deletCourse) {
            courseList = courseList.concat(_this.collegeItem[i].deletCourse);
          }
          courseThemeList.push({
            id: _this.collegeItem[i].id,
            themeName: _this.collegeItem[i].themeName,
            courseList: courseList
          });
        }
        else {
          _this.$alert('请添加课程', '提示', {
            confirmButtonText: '确定',
            callback: action => {

            }
          });
          return false;
        }
      }
      if (_this.collegeItem.length <= 0) {
        _this.$alert('模块名称不能为空', '提示', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
        return false;
      }
      if (!_this.themeUrl) {
        _this.$alert('分享海报不能为空', '提示', {
          confirmButtonText: '确定',
          callback: action => {

          }
        });
        return false;
      }
      return courseThemeList;
    },
    //  添加栏目
    creatCollege() {
      // let _this = this;
      // if (_this.collegeItem[0].isShowInput) {
      //   _this.$message.error('请保存栏目名称');
      //   return false;
      // }
      // if (!_this.collegeItem[0].courseList.length) {
      //   _this.$message.error('请选择课程');
      //   return false;
      // }
      this.collegeItem.unshift({
        id: '',
        isShowInput: true,
        themeName: '',
        courseList: [],
        deletCourse: []
      });
    },
    //  获取学院课信息
    getThemeCourseList() {
      let _this = this, param = {
        firstResult: 0,
        maxResult: 999
      };
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getThemeCourseList.type,
        url: apiConfig.getThemeCourseList.url,
        params: param
      }).then((res) => {
        comm.closeLoading();
        if (
          res &&
              res.data &&
              res.data.responseObject &&
              res.data.responseObject.responseData &&
              res.data.responseObject.responseData.courseThemeList &&
              res.data.responseObject.responseData.courseThemeList.length
        ) {
          _this.collegeItem = res.data.responseObject.responseData.courseThemeList;
          if (_this.collegeItem.length > 0) { // 保存编辑之前的名字用于取消保存操作
            for (let i in _this.collegeItem) {
              _this.collegeItem[i].oldName = _this.collegeItem[i].themeName;
            }
          }
          _this.themeUrl = res.data.responseObject.responseData.themeUrl;
          _this.themeUrlId = res.data.responseObject.responseData.id;
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('获取数据失败：', e);
      });
    },
    // 改变上架状态
    groundingStateFor(val) {
      if (val.courseType === 1) { // 1-预告，2-售卖
        return '预告';
      }
      else {
        return '售卖';
      }
    },
    // 课程状态在
    classStateFor(val) {
      if (val.courseState === 1) { //  1-已上架，2-未上架
        return '已上架';
      }
      else {
        return '未上架';
      }
    },
    // 视频数
    totalNumFor(val) {
      if (val.courseType === 1) {
        return '-';
      }
      else {
        return val.totalNum;
      }
    },
    // 课程售价
    coursePriceFor(val) {
      if (val.courseType === 1) {
        return '-';
      }
      else {
        if (val.coursePriceElementStr) {
          return '￥' + val.coursePriceElementStr;
        }
        else {
          return '-';
        }
      }
    },
    // 讲师列表
    classTeacherFor(val) {
      if (val.courseType === 1) {
        return '-';
      }
      else {
        if (val.courseTeacherVOList.length > 0) {
          if (val.courseTeacherVOList.length < 2) {
            return val.courseTeacherVOList[0].customerName;
          }
          else if (val.courseTeacherVOList.length === 2) {
            return val.courseTeacherVOList[0].customerName + ',' + val.courseTeacherVOList[1].customerName;
          }
          else if (val.courseTeacherVOList.length >= 2) {
            return val.courseTeacherVOList[0].customerName + ',' + val.courseTeacherVOList[1].customerName + '等';
          }
          else {
            return '-';
          }
        }
        else {
          return '-';
        }
      }
    },
    // 删除一个学院课程item
    collegeDeleteAllFn(index, item) {
      let _this = this;
      if (this.collegeItem.length > 1) {
        this.$allin_confirm({
          title: '提示',
          content: '模块删除后，该模块信息将在前台下架，且不可恢复，是否确认删除？',
          done: function() {
            // 利用oldName来判断是新增项还是原来已有的项当是新增项时不走入接口，直接删除
            if (item.oldName) {
              axios({
                method: apiConfig.deleteThemeById.type,
                url: apiConfig.deleteThemeById.url,
                data: {
                  id: parseInt(item.id)
                }
              }).then((res) => {
                comm.closeLoading();
                if (
                  res &&
                  res.data &&
                  res.data.responseObject &&
                  res.data.responseObject.responseStatus
                ) {
                  _this.collegeItem.splice(index, 1);
                }
                else {
                  _this.$allin_confirm({title: '提示', content: '删除失败', type: 'notice'});
                }
              }).catch((e) => {
                comm.closeLoading();
                this.$allin_confirm({title: '提示', content: '保存失败', type: 'notice'});
                console.log('获取数据失败：', e);
              });
            }
            else {
              _this.collegeItem.splice(index, 1);
            }
          }
        });
      }
      // 理论此处不会进入，因为如果只存在一项时删除按钮消失，没有入口
      else {
        this.$message({
          message: '该模块是唯一模块不可进行删除',
          type: 'warning'
        });
      }
    },
    // 上移
    changeUp(Ind, row, index) {
      if (this.collegeItem[Ind].courseList[index - 1]) {
        let tempOption = this.collegeItem[Ind].courseList[index - 1];
        this.$set(this.collegeItem[Ind].courseList, index - 1, this.collegeItem[Ind].courseList[index]);
        this.$set(this.collegeItem[Ind].courseList, index, tempOption);
      }
    },
    // 下移
    changeDown(Ind, row, index) {
      if (this.collegeItem[Ind].courseList[index + 1]) {
        let tempOption = this.collegeItem[Ind].courseList[index + 1];
        this.$set(this.collegeItem[Ind].courseList, index + 1, this.collegeItem[Ind].courseList[index]);
        this.$set(this.collegeItem[Ind].courseList, index, tempOption);
      }
    },
    // 移除
    deleteItemFn(Ind, row, index) {
      let _this = this;
      if (_this.collegeItem[Ind].courseList.length > 1) {
        this.$allin_confirm({
          title: '提示',
          content: '移除后，此课程将在学院频道下架，是否确认？',
          done: function() {
            let dele = {
              id: _this.collegeItem[Ind].courseList[index].id,
              isValid: false,
              sortId: 1
            };
            if (!_this.collegeItem[Ind].deletCourse) {
              _this.collegeItem[Ind].deletCourse = [];
            }
            _this.collegeItem[Ind].deletCourse.push(dele);
            _this.collegeItem[Ind].courseList.splice(index, 1);
          }
        });
      }
      else {
        this.$message({
          message: '当前课程为当前模块下唯一内容，不支持移除',
          type: 'warning'
        });
      }
    },
    // 学院课图片
    getAtturl(val) {
      if (val.collegeCourseAttachmentVOList && val.collegeCourseAttachmentVOList[0]) {
        return val.collegeCourseAttachmentVOList[0].attUrl;
      }
    }
  },
  mounted() {
    this.getThemeCourseList();
  },
  components: {
    uploadImg,
    addContent
  }
};
</script>

<style lang="scss">
  .class-contanier{
    width: 1200px;
    margin: 20px auto;
    .code-title{
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin: 32px 0 0;
      padding-bottom: 25px;
      /*border-bottom: 1px solid #ccc;*/
    }
  }
  .college-main-contanier{
    padding: 20px 0 40px;
    background: #fff;
    .college-item{
      margin: 30px;
      padding: 60px 0;
      background-color: rgba(237, 241, 255, 0.6);
      position: relative;
    }
    .collegeContent{
      margin-left: 50px;
      margin-bottom: 70px;
      .el-table th > .cell{
        font-weight: 600;
        color: #111111;
      }
      .changeStateBotton{
        &.el-button{
          padding: 10px;
        }
      }
    }
    .info-share{
      .icon-bg{
        background: #0687FF;
        width: 3px;
        display: inline-block;
        vertical-align: middle;
        height: 16px;
        border-radius: 1px;
        margin-right: 5px;
      }
      .share-title{
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;
        color: #333;
        font-weight: 600;
      }
    }
    .icon-must{
      margin-right: 20px;
      font-size: 14px;
      i{
        color: red;
      }
    }
    .code-button{
      margin: 30px 50px;
      .creat-button{
        color: #4B67D6;
        border: 1px solid #4B67D6;
        border-radius: 3px;
        /*margin-left: 20px;*/
        /*width: 470px;*/
        &.add-content-btn{
          width: 150px;
          /*margin-left: 20px;*/
        }
      }
      &.newCollegesBtn{
        margin-left: 30px;
      }
      /*&.college-button{*/
        /*.creat-button{*/
          /*margin-left: 20px;*/
          /*width: 470px;*/
        /*}*/
      /*}*/

    }
    .add-from{
      margin-left: 50px;
      .icon-bg{
        background: #55B8D9;
        width: 2px;
        height: 40px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }
      .content-input{
        width: 240px;
      }
    }
    .add-from-title{
      margin-left: 50px;
      .icon-bg{
        background: #55B8D9;
        width: 2px;
        height: 40px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
      }
      .content-text{
        width: 240px;
        line-height: 40px;
        background: #F7F9FB;
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        padding: 0 20px;
        font-size: 14px;
      }
    }
    .collegeDeleteAllBtn{
      color: red;
      cursor: pointer;
      position: absolute;
      right: 60px;
      top: 20px;
      line-height: 32px;
    }
    .college-class-con{
      /*margin-left: 20px;*/
      .college-class-item{
        margin-top: 20px;
        margin-left: 50px;
        .college-class-info{
          display: inline-block;
          vertical-align: middle;
          border: 1px solid #ccc;
          width: 450px;
          padding: 10px;
        }
        .college-icon{
         font-size: 40px;
          vertical-align: middle;
        }
        .college-title{
          display: inline-block;
          vertical-align: middle;
          line-height: 20px;
        }
        .college-name{
          white-space: nowrap;
          max-width: 400px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .college-total{
            text-align: left;
        }
        .college-operate{
          display: inline-block;
          vertical-align: middle;
          line-height: 40px;
          margin-left: 20px;
          cursor: pointer;
          .operate-delete{
             color: red;
            margin-right: 10px;
          }
          .operate-move{
            color: #4B67D6;
          }
        }
      }
    }
    .college-button{
      width: 80px;
      height: 32px;
      /*background: #3846dc;*/
      border-radius: 3px;
      line-height: 32px;
      font-size: 14px;
      font-weight: 500;
      /*color: white;*/
      color: #3846dc;
      margin-left: 30px;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      &.college-button-name{
        color: #cccccc;
        font-size: 14px;
        &.active{
          color: #3846dc;
        }
      }
    }
    .college-footer{
      margin-left: 50px;
      .info-share{
        .icon-bg{
          background: #0687FF;
          width: 3px;
          display: inline-block;
          vertical-align: middle;
          height: 16px;
          border-radius: 1px;
          margin-right: 5px;
        }
        .share-title{
          display: inline-block;
          vertical-align: middle;
          font-size: 16px;
          color: #333;
        }
      }
      .share-img-con{
        margin-top: 20px;
      }
      .share-img-info{
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        font-size: 14px;
      }
      .upload-con{
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
      }
      .upload-tip{
        display: inline-block;
        vertical-align: middle;
        color: #cccccc;
        width: 600px;
        line-height: 20px;
      }
    }
    .footer-botton-con{
      margin-top: 60px;
      text-align: center;
      .college-button{
        width: 100px;
        height: 32px;
        background: #3846dc;
        border-radius: 3px;
        line-height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: white;
        margin-left: 30px;
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
      }
    }
  }
  /*弹窗提示文字居中样式*/
  .baseConfirm-popupWindow-content{
    text-align: center;
  }
  .el-button+.el-button{
    margin-left: 0;
  }
  .collegeContent .el-table td:nth-child(2) .cell{
    width: auto;
  }
</style>
