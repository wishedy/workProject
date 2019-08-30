<template>
  <div class="mergeDetail" @click="clearFocusBorder">
    <h3 v-if="isNoData">无待合并内容</h3>
    <div class="info-box" v-if="!isNoData">
      <section class="old user-box old">
        <h2>老帐号信息</h2>
        <div class="info">
          <div class="text-form">
            <div class="item left" @click="clickItem('mobile')">
              <span>手机号<i></i></span>
              <div class="text" v-bind:class="{active:selected=='mobile'}">{{mergeCustomerAuthMap.mobile}}</div>
              <radio name="mobile"
                     side="old"
                     :selected="selectedAccount.mobile"
                     @updateSelected="updateSelected"></radio>

            </div>
            <div class="item right" @click="clickItem('email')">
              <span>邮箱<i></i></span>
              <div class="text" v-bind:class="{active:selected=='email'}">{{mergeCustomerAuthMap.email}}</div>
              <radio name="email"
                     side="old"
                     :selected="selectedAccount.email"
                     @updateSelected="updateSelected"></radio>
              <!--<img src="/static/images/icons/icon-send.png" alt="" class="email-send">-->
            </div>
            <div class="item left" @click="clickItem('uniteNickname')">
              <span>微信<i></i></span>
              <div class="text" v-bind:class="{active:selected=='uniteNickname'}">
                {{mergeCustomerAuthMap.uniteNickname}}
              </div>
              <radio
                name="uniteNickname"
                side="old"
                :selected="selectedAccount.uniteNickname"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="item right listEditStyle" @click="clickItem('fullName')">
              <span>姓名<i></i></span>
              <input type="text" disabled v-bind:class="{active:selected=='fullName'}"
                     v-model="mergeCustomerAuthMap.fullName">
              <radio
                name="fullName"
                side="old"
                :selected="selectedAccount.fullName"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="item left" @click="clickItem('sex')">
              <span>性别<i></i></span>
              <div class="text sex" v-bind:class="{active:selected=='sex'}">{{mergeCustomerAuthMap.sex}}</div>
              <radio
                name="sex"
                side="old"
                :selected="selectedAccount.sex"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="item right" @click="clickItem('medicalTitle')">
              <span>职称<i></i></span>
              <div class="text" v-bind:class="{active:selected=='medicalTitle'}">{{mergeCustomerAuthMap.medicalTitle}}
              </div>
              <radio
                name="medicalTitle"
                side="old"
                :selected="selectedAccount.medicalTitle"
                @updateSelected="updateSelected"></radio>
            </div>

            <div class="item left" @click="clickItem('company')">
              <span>医院<i></i></span>
              <div class="company-input-wrap" v-bind:class="{active:selected=='company'}">
                <input :disabled="mergeMode" :value="mergeCustomerAuthMap.company">
              </div>
              <radio
                name="company"
                side="old"
                :selected="selectedAccount.company"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="item right" @click="clickItem('password')">
              <span>密码<i></i></span>
              <div class="text" v-bind:class="{active:selected=='password'}">{{mergeCustomerAuthMap.password}}</div>
              <radio
                name="password"
                side="old"
                :selected="selectedAccount.password"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="item left specB" @click="clickItem('role')">
              <span class="titleStyle">角色<i></i></span>
              <div class="titleListStyle role"
                   v-bind:class="{active:selected=='role'}">
                <span>{{mergeCustomerAuthMap.role}}</span>
              </div>
              <radio
                name="role"
                side="old"
                :selected="selectedAccount.role"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="num">
              <img src="/static/images/icons/icon-edit.png" alt="" width="15" height="14">
              <span>编号：{{oldImgObj.attCode}}</span>
            </div>
          </div>
          <div class="cert-pic-box">
            <CertImgShow :swiper-con-class="'.old'"
                         :imgList="oldImgList"
                         v-on:certImgSelected="oldCertImgSelected"
                         :selectedIndex="oldSelectedIndex"
                         @imgRadioClick="updateSelectedCertPic"
                         @showBigImg="showBigImgOnClick"

            ></CertImgShow>
          </div>
        </div>
      </section>
      <section class="new user-box new ">
        <h2>新帐号信息</h2>
        <div class="info">
          <div class="text-form">
            <div class="item left" @click="clickItem('mobile')">
              <span>手机号<i></i></span>
              <div class="text" v-bind:class="{active:selected=='mobile'}">{{mainCustomerAuthMap.mobile}}</div>
              <radio name="mobile"
                     side="new"
                     :selected="selectedAccount.mobile"
                     @updateSelected="updateSelected"></radio>
            </div>
            <div class="item right" @click="clickItem('email')">
              <span>邮箱<i></i></span>
              <div class="text" v-bind:class="{active:selected=='email'}">{{mainCustomerAuthMap.email}}</div>
              <radio name="email"
                     side="new"
                     :selected="selectedAccount.email"
                     @updateSelected="updateSelected"></radio>
              <!--<img src="/static/images/icons/icon-send.png" alt="" class="email-send">-->
            </div>
            <div class="item left" @click="clickItem('uniteNickname')">
              <span>微信<i></i></span>
              <div class="text" v-bind:class="{active:selected=='uniteNickname'}">
                {{mainCustomerAuthMap.uniteNickname}}
              </div>
              <radio name="uniteNickname"
                     side="new"
                     :selected="selectedAccount.uniteNickname"
                     @updateSelected="updateSelected"
              ></radio>
            </div>
            <div class="item right listEditStyle" @click="clickItem('fullName')">
              <span>姓名<i></i></span>
              <input type="text" v-bind:class="{active:selected=='fullName'}" :disabled="mergeMode"
                     v-model="mainCustomerAuthMap.fullName" class="fullName">
              <radio name="fullName"
                     side="new"
                     :selected="selectedAccount.fullName"
                     @updateSelected="updateSelected"></radio>
            </div>
            <div class="item left specB" @click="clickItem('sex')">
              <span class="titleStyle">性别<i></i></span>
              <div class="titleListStyle sex" v-bind:class="{active:selected=='sex'}" v-on:click.stop="listGender">
                <span>{{mainCustomerAuthMap.sex}}</span>
                <SelectedUI
                  v-if="!mergeMode"
                  :showState="showStateGender"
                  :selectedItems="genderItems"
                  :defaultValue="mainCustomerAuthMap.sex"
                  :matchKey="'gender'"
                  @refreshValue="refreshValueCallback"
                ></SelectedUI>
              </div>
              <radio
                name="sex"
                side="new"
                :selected="selectedAccount.sex"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="item right specB" @click="clickItem('medicalTitle')">
              <span class="titleStyle">职称<i></i></span>
              <div class="titleListStyle medicalTitle" v-bind:class="{active:selected=='medicalTitle'}"
                   v-on:click.stop="listMedicalTitle">
                <span> {{mainCustomerAuthMap.medicalTitle}}</span>
                <SelectedUI
                  v-if="!mergeMode"
                  :showState="showStateMedical"
                  :selectedItems="medicalTitleItems"
                  :defaultValue="mainCustomerAuthMap.medicalTitle"
                  :matchKey="'medicalTitle'"
                  @refreshValue="refreshValueCallback"
                ></SelectedUI>
              </div>
              <radio
                name="medicalTitle"
                side="new"
                :selected="selectedAccount.medicalTitle"
                @updateSelected="updateSelected"></radio>
            </div>

            <Hospital ref="hospital" :hNameId="hNameId"
                      :ifModeFollowForm="ifModeFollowForm"
                      v-if="!mergeMode"
                      @setModeFollowForm="setModeFollowForm"
                      @setHospitalName="setHospitalName"
                      :selected="selected"
                      :hName="hName"></Hospital>
            <div v-if="mergeMode" class="item left" @click="clickItem('company')">
              <span>医院<i></i></span>
              <div class="company-input-wrap" v-bind:class="{active:selected=='company'}"><input :disabled="mergeMode"
                                                                                                 :value="mainCustomerAuthMap.company">
              </div>
              <radio
                name="company"
                side="new"
                :selected="selectedAccount.company"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="item right" @click="clickItem('password')">
              <span>密码<i></i></span>
              <div class="text" v-bind:class="{active:selected=='password'}">{{mainCustomerAuthMap.password}}</div>
              <radio
                name="password"
                side="new"
                :selected="selectedAccount.password"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="item left specB" @click="clickItem('role')">
              <span class="titleStyle">角色<i></i></span>
              <div class="titleListStyle sex"
                   v-bind:class="{active:selected=='role'}"
                   v-on:click.stop="listRole">
                <span>{{mainCustomerAuthMap.role}}</span>
                <SelectedUI
                  v-if="!mergeMode"
                  :showState="showStateRole"
                  :selectedItems="roleItems"
                  :defaultValue="mainCustomerAuthMap.role"
                  :matchKey="'role'"
                  @refreshValue="refreshValueCallback"
                ></SelectedUI>
              </div>
              <radio
                name="role"
                side="new"
                :selected="selectedAccount.role"
                @updateSelected="updateSelected"></radio>
            </div>
            <div class="num">
              <img src="/static/images/icons/icon-edit.png" alt="" width="15" height="14">
              <span>编号:<input class="attCodeId" v-model="newImgObj.attCode"/></span>
            </div>
          </div>
          <div class="cert-pic-box">
            <CertImgShow :swiper-con-class="'.new'"
                         :imgList="newImgList"
                         v-on:certImgSelected="newCertImgSelected"
                         :selectedIndex="newSelectedIndex"
                         @imgRadioClick="updateSelectedCertPic"
                         @showBigImg="showBigImgOnClick"
                         :customerId="newCustomerId"
            ></CertImgShow>
          </div>
        </div>
      </section>
    </div>
    <div class="control-box" v-if="!isNoData">
      <!--认证状态(2-运营确认(v1通过)、3-认证拒绝 （v1拒绝）8-执业医师确认（v2通过） 9-执业医师拒绝（v2拒绝）-->
      <el-button type="primary" round @click="mergeAccount" v-if="!mergeMode&& !isChange">合并账号</el-button>
      <el-button type="primary" round v-if="mergeMode" @click="centerDialogVisible=true">确认合并</el-button>
      <el-button type="success" round v-if="!mergeMode" @click="updateAuthState(2)">V1通过</el-button>
      <el-button type="success" round v-if="!mergeMode && !isNurseRole && !isDoctorAssistRole"
                 @click="updateAuthState(8)">V2通过
      </el-button>
      <el-button type="danger" round v-if="!mergeMode && !isDoctorAssistRole" @click="v1RefuseOnClick">V1拒绝</el-button>
      <el-button type="danger" round v-if="!mergeMode  && !isNurseRole && !isDoctorAssistRole" @click="v2RefuseOnClick">
        V2拒绝
      </el-button>
    </div>
    <el-dialog class="dialog" :visible.sync="centerDialogVisible" width="800px" center>
      <section class="course-box reset-popup-box" v-if="mergeCourseList.length>0 || mainCourseList.length>0">
        <h5>付费课程合并</h5>
        <div class="merge-course-box">
          <h6>老帐号：</h6>
          <div class="course-button"
               :class="isSelectedCourse(course,'merge')?'selected':''"
               v-for="(course,index) in mergeCourseList"
               @click="selectMergeCourse(course)"
               :key="index"
          >
            {{course.courseName}}
          </div>
        </div>
        <div class="main-course-box">
          <h6>新帐号：</h6>
          <div class="course-button"
               :class="isSelectedCourse(course,'main')?'selected':''"
               v-for="(course,index) in mainCourseList"
               @click="selectMainCourse(course)"
               :key="index"
          >
            {{course.courseName}}
          </div>
        </div>
        <div class="divided"/>
      </section>

      <section class="course-box" v-if="mergeCouponList.length>0 || mainCouponList.length>0">
        <h5>优惠券合并</h5>
        <div class="merge-course-box">
          <h6>老帐号：</h6>
          <div class="coupon-button"
               :class="isSelectedCoupon(coupon,'merge')?'selected':''"
               v-for="(coupon,index) in mergeCouponList"
               @click="selectMergeCoupon(coupon)"
               :key="index"
          >
            <div class="coupon-type">{{coupon.couponType==0?'通用券':'商品券'}}
              <span>{{coupon.useCondition}}-{{coupon.couponDenomination}}</span>
            </div>
            <div class="course-name" v-if="coupon.couponType==1">
              《{{coupon.courseName}}》
            </div>
            <div class="time">
              有效期：
              {{coupon.startTime.split(' ')[0].replace(/-/g,'.')}}-{{coupon.endTime.split(' ')[0].replace(/-/g,'.')}}
            </div>
          </div>
        </div>
        <div class="main-course-box">
          <h6>新帐号：</h6>
          <div class="coupon-button"
               :class="isSelectedCoupon(coupon,'main')?'selected':''"
               v-for="(coupon,index) in mainCouponList"
               @click="selectMainCoupon(coupon)"
               :key="index"
          >
            <div class="coupon-type">{{coupon.couponType==0?'通用券':'商品券'}}
              <span>{{coupon.useCondition}}-{{coupon.couponDenomination}}</span>
            </div>
            <div class="course-name" v-if="coupon.couponType==1">
              《{{coupon.courseName}}》
            </div>
            <div class="time">
              有效期：
              {{coupon.startTime.split(' ')[0].replace(/-/g,'.')}}-{{coupon.endTime.split(' ')[0].replace(/-/g,'.')}}
            </div>
          </div>
        </div>
        <div class="divided"/>
      </section>

      <section class="wallet-box-wrap reset-popup-box">
        <h5>钱包合并</h5>
        <div> <!--  class="btn-box" -->
          <div class="wallet-box">
            <h6>老帐号：</h6>
            <div class="no-money" v-if="!oldIosWallet">iOS钱包：未开通</div>
            <div class="no-money" v-if="!oldAndroidWallet">安卓钱包：未开通</div>
            <div class="money" v-if="oldIosWallet">iOS钱包：{{oldIosWallet.balanceAmount}}唯币</div>
            <div class="money" v-if="oldAndroidWallet">安卓钱包：{{oldAndroidWallet.balanceAmount}}唯币</div>
          </div>
          <div class="wallet-box">
            <h6>新帐号：</h6>
            <div class="no-money" v-if="!newIosWallet">iOS钱包：未开通</div>
            <div class="no-money" v-if="!newAndroidWallet">安卓钱包：未开通</div>
            <div class="money" v-if="newIosWallet">iOS钱包：{{newIosWallet.balanceAmount}}唯币</div>
            <div class="money" v-if="newAndroidWallet">安卓钱包：{{newAndroidWallet.balanceAmount}}唯币</div>
          </div>
        </div>
        <div class="divided"/>
      </section>

      <section class="reset-popup-box">
        <h5>其他信息合并</h5>
        <div class="btn-box">
          <div class="dialog-button" @click="setBase('old')" :class="accountBase=='old'?'selected':''">老帐号为准</div>
          <div class="dialog-button" @click="setBase('new')" :class="accountBase=='new'?'selected':''">新帐号为准</div>
        </div>
        <p class="desc reset-popup-box">此选择主要影响到用户资源内容合并的来源帐号</p>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmClick" width="180" round>   确认   </el-button>
      </span>
    </el-dialog>
    <RefuseCertDialog :canShow="refuseData.canShow" :setTitle="refuseData.title"
                      :contentSelectList="refuseData.contentSelectList"
                      :questionSelectList="refuseData.questionSelectList"
                      @closeDialog="refuseData.canShow = false"
                      @confirmHandle="refuseConfirmHandle"
    ></RefuseCertDialog>
    <CertImgShowBig
      :src="showBigData.url"
      :isReadOnly="showBigData.isReadOnly"
      :title="showBigData.title"
      :visible="showBigData.visible"
      @closeShowBig="closeShowBigHandle"
      @switchPrevEvent="switchPrevEventHandle"
      @switchNextEvent="switchNextEventHandle">
    </CertImgShowBig>
  </div>
</template>
<script>
/*
  *
  *
  * */

import axios from '@/assets/js/utils/request';
import CertImgShow from '@/views/customRelation/components/CertImgShow';
import Hospital from '@/views/customRelation/components/Hospital/Hospital';
import SelectedUI from '@/views/customRelation/UI/selected.vue';
import api from '@/api/apiUrlConfig';
import RefuseCertDialog from '@/views/customRelation/components/RefuseCertDialog.vue';
import CertImgShowBig from '@/views/customRelation/components/ImgShowBig/CertImgShowBig.vue';

import tipMessage from '@/components/common/tipMessage/Message.js';
import Vue from 'vue';

Vue.use(tipMessage);
Vue.component('radio', {
  data() {
    return {
      mergeMode: false, // 是否是合并模式
      accountBase: 'old' // 合并时选择的帐户基准，默认是老帐户
    };
  },
  props: {
    side: { // 属于哪边，左侧或右侧，
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    selected: {
      type: String,
      required: true
    }
  },
  computed: {
    isSelected: function() {
      return this.selected === this.side;
    }
  },
  methods: {
    click() {
      let t = this;
      this.$emit('updateSelected', {key: t.name, val: t.side});
    }
  },
  template: '<b class="radio" @click="click" :class="{selected:isSelected}" v-if="this.$store.state.mergeMode"></b>'
});

export default {
  name: 'memberMerge',
  components: {
    CertImgShow,
    Hospital,
    RefuseCertDialog,
    CertImgShowBig,
    SelectedUI: SelectedUI
  },
  data: function() {
    let opUser = localStorage.getItem('userLoginName');
    let mergeMode, mergeType;
    if (this.$store.state.mergeMode != null) {
      localStorage.setItem('mergeMode', this.$store.state.mergeMode);
    }
    else {
      mergeMode = localStorage.getItem('mergeMode');
      this.$store.commit('setMergeMode', mergeMode);
    }

    if (this.$store.state.currentMergeRow.mergeType === undefined) {
      mergeType = localStorage.getItem('mergeType');
      this.$store.commit('setMergeType', mergeType);
    }

    return {
      inited: false, // 是否初始化，在判断roleId切换时有用
      currentMergeRow: this.$store.state.currentMergeRow,
      loading: null,
      ip: '',
      isNoData: false, // 没有新数据了
      selected: '', // 当前选中的文本框
      hName: '',
      hNameId: '',
      ifModeFollowForm: 0,
      isNurseRole: false, // 是否是护士角色 如果是的话,在用户发起的合并状态下,隐藏v2通过,与v2拒绝按钮.
      isDoctorAssistRole: false, // 是否是医助角色  如果是的话,在用户发起的合并状态下,隐藏v1拒绝，v2通过,与v2拒绝按钮.
      updateGender: '',
      updateMedicalTitle: '',
      updateRole: '',
      showStateMedical: false,
      showStateGender: false,
      showStateRole: false,
      medicalTitleItems: [
        {
          medicalTitle: '住院医师',
          id: '1'
        }, {
          medicalTitle: '主治医师',
          id: '2'
        }, {
          medicalTitle: '副主任医师',
          id: '3'
        }, {
          medicalTitle: '主任医师',
          id: '4'
        }, {
          medicalTitle: '护士',
          id: '11'
        }, {
          medicalTitle: '护师',
          id: '12'
        }, {
          medicalTitle: '主管护师',
          id: '13'
        }, {
          medicalTitle: '副主任护师',
          id: '14'
        }, {
          medicalTitle: '主任护师',
          id: '15'
        }, {
          medicalTitle: '医助',
          id: '17'
        }, {
          medicalTitle: '医学生',
          id: '10'
        }], // 职称数据列表
      roleItems: [
        {
          role: '医生',
          id: '6'
        }, {
          role: '护士',
          id: '12'
        }, {
          role: '医助',
          id: '13'
        }
      ],
      genderItems: [{sexId: 1, gender: '男'}, {sexId: 2, gender: '女'}],
      selectedIcon: {
        selected: require('../../../static/images/icons/icon-selected.png'),
        unselected: require('../../../static/images/icons/icon-unselected.png')
      },
      accountBase: 'old', // 合并时选择基础合并信息依据 默认旧帐号
      // 证件图片选择相关
      oldImgObj: {}, // 旧帐号当前选中的图片的信息，包括图片，num ，type
      newImgObj: {}, // 新帐号当前选中的图片的信息，包括图片，num ，type
      selectedCertImgType: {attType: '', attPositionType: ''}, // 当前旧帐号或新帐号选中的证件类型和正反面
      oldSelectedIndex: 0,
      newSelectedIndex: 0,
      /*  帐号选择相关 end */
      oldCustomerId: '',
      newCustomerId: '',
      newIosWallet: { // 新钱包
        walletId: null,
        customerId: null,
        walletType: null,
        balanceAmount: null
      },
      oldIosWallet: { // 旧钱包
        walletId: null,
        customerId: null,
        walletType: null,
        balanceAmount: null
      },
      newAndroidWallet: { // 新钱包
        walletId: null,
        customerId: null,
        walletType: null,
        balanceAmount: null
      },
      oldAndroidWallet: { // 旧钱包
        walletId: null,
        customerId: null,
        walletType: null,
        balanceAmount: null
      },
      mainCustomerAuthMap: { // 新帐号
        authAttMapList: []
      },
      mergeCustomerAuthMap: { // 旧帐号数据
        authAttMapList: []
      },
      mainCustomerAuthMapBackUp: { // 新帐号备份，为了与修改后的作比较，当不同时只能进行审核操作，不能进行合并，相同时，可以显示合并按钮，

      },
      /* 当前帐号相关 */
      centerDialogVisible: false,
      isChange: false, // 新帐号是否进行了编辑

      mergedAccountOptions: {
        mergeId: this.$store.state.currentMergeRow.id,
        mergeRemark: '',
        mergeState: '2',
        keepCustomerId: '',
        removeCustomerId: '',
        keepMobileId: '',
        keepEmailId: '',
        keepWxId: '',
        keepSexId: '',
        keepCustomerNameId: '',
        keepPwdId: '',
        keepMedicalTitleId: '',
        keepCompanyId: '',
        keepCardIdList: '',
        keepRoleId: '',
        keepWalletId: '', // 要保留的钱包ID
        keepMainCouponIdList: [], // 新账号选中的优惠券id  注意 提交时会将此字段改成字符串，后台不需要数组方式
        keepMergeCouponIdList: [], // 老账号选中的优惠券id  注意 提交时会将此字段改成字符串，后台不需要数组方式
        keepMainCourseIdList: [], // 新账号选中的课程id    注意 提交时会将此字段改成字符串，后台不需要数组方式
        keepMergeCourseIdList: [], // 老账号选中的课程id    注意 提交时会将此字段改成字符串，后台不需要数组方式
        opUser: opUser

      }, // 合并用户时要提交的参数
      // 当前radio标签选择的左右数据
      selectedAccount: {
        email: 'old',
        mobile: 'old',
        fullName: 'old',
        uniteNickname: 'old',
        sex: 'old',
        password: 'old',
        medicalTitle: 'old',
        company: 'old',
        role: 'old'
      },
      oldImgList: [], //  排序后的旧帐号图片列表
      newImgList: [], //  排序后的新帐号图片列表
      newImgListBackup: [], // 新几点号图片列表备份
      allSelectedCertImgObjs: [], // 所有选中的图片列表
      imgListGroup: { //  认证照片分组
        onlyInOld: [], //  只在老帐户中有
        inAllTwo: [], //  新老帐户中都有
        onlyInNew: [] //  只在新帐户中有
      },
      refuseData: { // 审核拒绝原因数据
        state: -1,
        canShow: false,
        title: '',
        contentSelectList: [],
        questionSelectList: []
      },
      showBigData: {
        url: '',
        isReadOnly: false,
        title: '',
        visible: false
      },
      showBigActiveSwiper: null,
      isNewDataFlag: false,
      mergeCouponList: [],
      mainCouponList: [],
      mergeCourseList: [],
      mainCourseList: []
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    mergeMode: {
      get() {
        return this.$store.state.mergeMode;
      },
      set() {
      }
    }
  },
  watch: {
    'currentMergeRow'() {
      this.init();
    },
    'isChange'(newVal, oldVal) {
      if (this.isChange) {
        this.$tipMessage(true, 'info', '审核通过后，修改信息将保存', this.$el.getAttribute('class'), 0);
      }
      else {
        this.$tipMessage(false, 'info', '审核通过后，修改信息将保存', this.$el.getAttribute('class'), 0);
      }
    },
    'mainCustomerAuthMap.fullName'() {
      this.stateChange('fullName');
    },
    'mainCustomerAuthMap.role'(value, oldValue) {
      if (value === '护士') {
        this.isNurseRole = true;
      }
      this.stateChange('role');
    },
    'hName'() {
      this.stateChange('company');
    },
    'newImgObj.attCode'() {
      this.checkAttCodeChanged();
    },
    'mainCustomerAuthMap.roleId': function(value, oldValue) {
      // console.log("changed")
      if (value === '13') {
        this.isDoctorAssistRole = true;
      }
      else {
        this.isDoctorAssistRole = false;
      }
      if (oldValue !== value) {
        let medicalTitleList = this.getMedicalTitleListByRole(value);
        if (this.inited) {
          this.$set(this.mainCustomerAuthMap, 'medicalTitle', medicalTitleList[0].medicalTitle);
        }
        this.inited = true;
      }
    }
  },
  beforeDestroy() {
    this.$store.commit('setMergeMode', false);
    localStorage.setItem('mergeMode', false);
  },
  methods: {
    init() {
      if (JSON.stringify(this.$store.state.currentMergeRow) !== '{}') {
        localStorage.setItem('currentMergeRow', JSON.stringify(this.$store.state.currentMergeRow));
      }
      else {
        this.$store.commit('setCurrentMergeRow', JSON.parse(localStorage.getItem('currentMergeRow')));
        this.mergedAccountOptions.mergeId = this.$store.state.currentMergeRow.id;
      }
      // 优先判currentMergeRow.mergeType
      if (Number(this.$store.state.currentMergeRow.mergeType) === 1) {
        this.mergeMode = true;
        console.log('用户发起 自动合并 直接进入确认界面');
        this.$store.commit('setMergeMode', true);
        localStorage.setItem('mergeMode', true);
        localStorage.setItem('mergeType', '1');
      }
      else if (Number(this.$store.state.currentMergeRow.mergeType) === 2) {
        this.mergeMode = false;
        this.$store.commit('setMergeMode', false);
        localStorage.setItem('mergeMode', false);
        console.log('运营发起，手动合并');
        localStorage.setItem('mergeType', '2');
      }
      else if (Number(this.$store.state.mergeType) === 1) {
        this.mergeMode = true;
        console.log('用户发起 自动合并 直接进入确认界面');
        this.$store.commit('setMergeMode', true);
        localStorage.setItem('mergeMode', true);
        localStorage.setItem('mergeType', '1');
      }
      else { // mergeType == 2
        this.mergeMode = false;
        this.$store.commit('setMergeMode', false);
        localStorage.setItem('mergeMode', false);
        console.log('运营发起，手动合并');
        localStorage.setItem('mergeType', '2');
      }
      this.getMergeAccount();
      this.getIp();
      // this.getMedicalTitle();  // 跟运红商量后。新加的职称不从后台取了。因为新增的职称要随角色变化，所以要分组，接口要改变很多。2019-3-18
      // 初始化职称分组，根据当前角色查出
      this.getMedicalTitleListByRole(this.mainCustomerAuthMap.roleId);
    },
    // 清除激活时的边框
    clearFocusBorder(el) {
      let activeList = document.querySelectorAll('.active');
      if (activeList.length !== 0) {
        for (let x = activeList.length - 1; x > -1; x--) {
          let className = activeList[x].getAttribute('class');
          className = className.replace('active', '');
          activeList[x].setAttribute('class', className);
        }
      }
      this.showStateGender = false;
      this.showStateMedical = false;
      this.showStateRole = false;
      if (!this.mergeMode) {
        this.$refs.hospital.$emit('closeSearch');
      }
    },
    //
    setModeFollowForm(state) {
      this.ifModeFollowForm = state;
    },
    setHospitalName(hName, hNameId) {
      this.hName = hName;
      this.hNameId = hNameId;
    },
    // 展开性别选择下拉
    listGender() {
      this.showStateMedical = false;
      this.showStateRole = false;
      this.showStateGender = true;
      if (!this.mergeMode) {
        this.$refs.hospital.ifSearchHospital = false;
      }
      this.selected = 'sex';
    },
    // 展开职称选择
    listMedicalTitle() {
      this.showStateGender = false;
      this.showStateRole = false;
      this.showStateMedical = true;
      if (!this.mergeMode) {
        this.$refs.hospital.ifSearchHospital = false;
      }
      this.selected = 'medicalTitle';
    },
    // 展开角色选择
    listRole() {
      this.showStateGender = false;
      this.showStateMedical = false;
      this.showStateRole = true;
      this.$refs.hospital.ifSearchHospital = false;
      this.selected = 'role';
    },

    refreshValueCallback(key, item) {
      let _this = this;
      console.log(key);
      if (key === 'gender') {
        this.mainCustomerAuthMap.sex = item.gender;
        this.mainCustomerAuthMap.sexId = item.sexId;
        this.updateGender = item.gender;
        this.stateChange('sex');
        setTimeout(function() {
          _this.showStateGender = false;
        }, 0);
      }
      else if (key === 'medicalTitle') {
        this.mainCustomerAuthMap.medicalTitle = item.medicalTitle;
        this.mainCustomerAuthMap.medicalTitleId = item.id;
        this.updateMedicalTitle = item.medicalTitle;
        this.stateChange('medicalTitleId');
        setTimeout(function() {
          _this.showStateMedical = false;
        }, 0);
      }
      else if (key === 'role') {
        this.mainCustomerAuthMap.role = item.role;
        this.mainCustomerAuthMap.roleId = item.id;
        if (item.role === '护士') {
          this.isNurseRole = true;
        }
        else {
          this.isNurseRole = false;
        }
        this.updateRole = item.role;
        this.stateChange('roleId');
        setTimeout(function() {
          _this.showStateRole = false;
        }, 0);
      }
    },
    // 获取职称列表   以后不用此函数了 2019-3-18 因接口不好适配刚刚新增的角色与新职称。因为要分组。就写死吧。
    getMedicalTitle() {
      let _this = this;
      axios({
        method: api.getMedicalTitle.type,
        url: api.getMedicalTitle.url
      }).then(function(data) {
        _this.medicalTitleItems = data.data.responseObject.responseData.data_list;
      });
    },
    getIp() {
      let t = this;
      axios({
        method: api.getIp.type,
        url: api.getIp.url
      }).then(function(data) {
        console.log(data.data);
        t.ip = data.data.visitorIP;
      });
    },
    // 检查新帐号的资料是否修改  但使用的地方，暂时不使用它了。
    checkAuthMapDiff() {
      let diffObj = {};
      let nowData = {
        fullName: this.mainCustomerAuthMap.fullName,
        medicalTitle: this.mainCustomerAuthMap.medicalTitle,
        medicalTitleId: this.mainCustomerAuthMap.medicalTitleId,
        company: document.querySelector('.new .hospital input').value,
        sex: this.mainCustomerAuthMap.sex,
        sexId: this.mainCustomerAuthMap.sexId
      };
      for (let key in nowData) {
        if (this.mainCustomerAuthMapBackUp[key] !== nowData[key]) {
          diffObj[key] = nowData[key];
        }
      }
      return diffObj;
    },
    // 审核时处理证书列表数据
    setParamsAttList() { // 传参时重置 并清除未改动的
      const attList = this.newImgList;
      const attListBackup = this.newImgListBackup;
      for (let x = attList.length; x > -1; x--) {
        let exist = false;
        for (let z in attListBackup) {
          if (Object.prototype.toString.call(attList[x]) === '[object Object]') {
            if (attListBackup[z].id === attList[x].id && attListBackup[z].attCode !== attList[x].attCode) {
              delete attList[x].attPath;
              delete attList[x].attPositionType;
              delete attList[x].attType;
              delete attList[x].index;
              delete attList[x].isFirst;
              exist = true;
            }
          }
        }
        if (!exist) {
          attList.splice(x, 1);
        }
      }
    },
    // v1,v2 通过 拒绝
    updateAuthState(state, refuseData) {
      let _this = this;
      this.setParamsAttList();

      // 5,6,11 都是医生角色
      if (this.mainCustomerAuthMap.roleId === '5' || this.mainCustomerAuthMap.roleId === '11') {
        this.mainCustomerAuthMap.roleId = '6';
      }
      let data = Object.assign( // _this.checkAuthMapDiff(),
        {
          userLoginName: localStorage.getItem('userLoginName'),
          fullName: this.mainCustomerAuthMap.fullName,
          medicalTitle: this.mainCustomerAuthMap.medicalTitleId + '_' + this.mainCustomerAuthMap.medicalTitle,
          medicalTitleId: this.mainCustomerAuthMap.medicalTitleId,
          company: document.querySelector('.new .hospital input').value,
          sex: this.mainCustomerAuthMap.sex,
          sexId: this.mainCustomerAuthMap.sexId,
          oldAttCodeList: this.newImgList, // this.attListBackup), //备份
          opIP: this.ip && this.ip.substring(7, this.ip.length),
          visitSiteId: 25,
          roleId: this.mainCustomerAuthMap.roleId,
          state: state,
          customerId: this.newCustomerId,
          mergeId: localStorage.getItem('mergeId')
        }, refuseData);
      axios({
        method: api.updateAuthState.type,
        url: api.updateAuthState.url,
        // visitSiteId string 是站点id默认：25
        // customerId string 是用户id
        // state  string 是认证状.态(2-运营确认(v1通过)、3-认证拒绝 （v1拒绝）8-执业医师确认（v2通过） 9-执业医师拒绝（v2拒绝）
        // supplement string 是拒绝理由（用于短信邮件话术内容）
        // reason string 是手动写的拒绝内容
        // refuseList string 是拒绝理由（用于记录具体拒绝内容）reg : [{"resoureId":"","resourceContent":"","resourceQuestion":""}]
        // fullName string 是姓名
        // medicalTitleId string 是职称id
        // medicalTitle string是职称
        // companyId string 是医院id
        // company string 是医院
        // sexId string 是性别id
        // sex string 是性别 如：男 女
        // userLoginName string 是当前登录后台用户名（必传）
        // opIP string 是当前电脑ip（必传）
        // oldAttIdList string 是被替换的 需要无效的附件id（暂不用）
        // attList string 是替换后的附件 reg: [{"attPath":"public1/M00/1B/02/wKgBMFuHZtWARUZAAAQq03yC7PA429.PNG","attType":"6","attCode":"123213223","isValid":"9","dynaHeigh":"","dynaWidth":"","attPositionType":"1"}]}（暂不用）
        // isRecord string 是备案状态0-未备案1-备案中2-已备案3-无需备案4-备案失败（二期）
        // recordReason string 是备案理由 （二期）
        //  mergeId
        data: data
      }).then((res) => {
        console.log(res);
        if (res.data.responseObject && res.data.responseObject.responseStatus) {
          _this.$message.info('操作成功');
        }
        else {
          _this.$message.info('操作失败');
        }
        _this.getNextData();
      });
    },
    // 点击某项
    clickItem(key) {
      if (this.$refs.hospital !== undefined) this.$refs.hospital.ifSearchHospital = 0;
      this.selected = this.selected !== key ? key : '';
    },
    // 获取拒绝原因
    getRefuseMapList() {
      const _this = this;
      // 获取拒绝问题数据
      axios({
        method: api.getRefuseMapList.type,
        url: api.getRefuseMapList.url,
        params: {
          scene: 3,
          customerId: _this.newCustomerId
        }
      }).then((res) => {
        const responseMessage = res.data.responseObject.responseMessage;
        const data = res.data.responseObject.responseData;
        if (!responseMessage && data && data.dataList && data.dataList.length > 0) {
          _this.refuseData.questionSelectList = data.dataList;
        }
      }).catch((e) => {
        console.log('获取拒绝问题数据失败：', e);
      });
      // 获取拒绝内容数据
      axios({
        method: api.getRefuseMapList.type,
        url: api.getRefuseMapList.url,
        params: {
          scene: 2,
          customerId: _this.newCustomerId
        }
      }).then((res) => {
        const responseMessage = res.data.responseObject.responseMessage;
        const data = res.data.responseObject.responseData;
        if (!responseMessage && data && data.dataList && data.dataList.length > 0) {
          _this.refuseData.contentSelectList = data.dataList;
        }
      }).catch((e) => {
        console.log('获取拒绝内容数据失败：', e);
      });
    },
    v1RefuseOnClick() {
      this.refuseData.canShow = true;
      this.refuseData.title = 'V1拒绝';
      this.refuseData.state = 3;
    },
    v2RefuseOnClick() {
      this.refuseData.canShow = true;
      this.refuseData.title = 'V2拒绝';
      this.refuseData.state = 9;
    },

    refuseConfirmHandle(data) {
      const state = this.refuseData.state;
      if (state !== -1 && data.refuseList.length > 0) {
        this.updateAuthState(state, data);
      }
      // 关闭拒绝弹窗
      this.refuseData.canShow = false;
    },
    // 从图片列表中获取编号
    getNum(attList) {
      let num = null;
      for (let i = 0; i < attList.length; i++) {
        const att = attList[i];
        if (att.attType === '') {
          num = att.attCode;
          break;
        }
      }
      return num;
    },
    getMedTitleById(id) {
      let Id = parseInt(id);
      let rst;
      switch (Id) {
        case 1:
          rst = '住院医师';
          break;
        case 2:
          rst = '主治医师';
          break;
        case 3:
          rst = '副主任医师';
          break;
        case 4:
          rst = '主任医师';
          break;
        case 5:
          rst = '讲师';
          break;
        case 6:
          rst = '副教授';
          break;
        case 7:
          rst = '教授';
          break;
        case 8:
          rst = '硕士生导师';
          break;
        case 9:
          rst = '博士生导师';
          break;
        case 10:
          rst = '医学生';
          break;
        case 11:
          rst = '护士';
          break;
        case 12:
          rst = '护师';
          break;
        case 13:
          rst = '主管护师';
          break;
        case 14:
          rst = '副主任护师';
          break;
        case 15:
          rst = '主任护师';
          break;
      }
      return rst;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
    // 获取要合并的新老帐户信息
    getMergeAccount() {
      let _this = this;
      let mergeId;
      if (_this.$store.state.currentMergeRow && _this.$store.state.currentMergeRow.id) {
        mergeId = _this.$store.state.currentMergeRow.id;
        localStorage.setItem('mergeId', mergeId);
      }
      else {
        if (localStorage.getItem('mergeId')) {
          mergeId = localStorage.getItem('mergeId');
        }
      }

      let param = {
        id: mergeId
      };

      axios({
        method: api.getMergeAccountDetail.type,
        url: api.getMergeAccountDetail.url,
        params: param,
        responseType: 'json',
        before: function() {
          // common.loading.show();
        }
      })
        .then(function(res) {
          _this.mainCustomerAuthMap = res.data.responseObject.responseData.dataList.mainCustomerAuthMap;
          _this.mainCustomerAuthMap.role = _this.getRoleByRoleId(_this.mainCustomerAuthMap.roleId);
          _this.mainCustomerAuthMap.medicalTitle = _this.getMedTitleById(_this.mainCustomerAuthMap.medicalTitleId);
          _this.mergeCustomerAuthMap = Object.assign({}, res.data.responseObject.responseData.dataList.mergeCustomerAuthMap);
          _this.mergeCustomerAuthMap.role = _this.getRoleByRoleId(_this.mergeCustomerAuthMap.roleId);
          _this.mergeCustomerAuthMap.medicalTitle = _this.getMedTitleById(_this.mergeCustomerAuthMap.medicalTitleId);
          _this.oldCustomerId = _this.mergeCustomerAuthMap.customerId;
          _this.newCustomerId = _this.mainCustomerAuthMap.customerId;
          _this.hName = _this.mainCustomerAuthMap.company;
          _this.hNameId = _this.mainCustomerAuthMap.companyId.toString();
          _this.ifModeFollowForm = _this.mainCustomerAuthMap.isVerify;
          if (_this.mainCustomerAuthMap.role === '护士') {
            _this.isNurseRole = true;
          }

          //
          _this.mainCustomerAuthMapBackUp = Object.assign({}, res.data.responseObject.responseData.dataList.mainCustomerAuthMap);
          if (_this.mergeCustomerAuthMap.authAttMapList.length > 0) {
            _this.oldImgObj = _this.mergeCustomerAuthMap.authAttMapList[0];
          }
          if (_this.mainCustomerAuthMap.authAttMapList.length > 0) {
            _this.newImgObj = _this.mainCustomerAuthMap.authAttMapList[0];
          }

          _this.imgListGrouping(); // 对图片进行分组  只属于老的，同属老新的，只属新的
          _this.certImgListInit();
          _this.getRefuseMapList();
          _this.initMergedAccountOptions();
          _this.getMergeCoupon(mergeId); // 获取要合并的优惠券
          _this.getMergeCourse(mergeId); // 获取要合并的课程
          _this.getMergeWallet(); // 获取要合并的钱包
        });
    },
    // 初始化合并结果的参数
    initMergedAccountOptions() {
      let t = this;
      t.mergedAccountOptions.keepCustomerId = t.oldCustomerId;
      t.mergedAccountOptions.keepMobileId = t.oldCustomerId;
      t.mergedAccountOptions.keepEmailId = t.oldCustomerId;
      t.mergedAccountOptions.keepWxId = t.oldCustomerId;
      t.mergedAccountOptions.keepSexId = t.oldCustomerId;
      t.mergedAccountOptions.keepCustomerNameId = t.oldCustomerId;
      t.mergedAccountOptions.keepPwdId = t.oldCustomerId;
      t.mergedAccountOptions.keepMedicalTitleId = t.oldCustomerId;
      t.mergedAccountOptions.keepCompanyId = t.oldCustomerId;
      t.mergedAccountOptions.keepRoleId = t.oldCustomerId;
      t.mergedAccountOptions.removeCustomerId = t.newCustomerId;

      // 过滤老帐号中不存在，而新帐号中存在的选项，在新帐号中将其选中
      if (t.mainCustomerAuthMap.mobile !== '' && t.mergeCustomerAuthMap.mobile === '') {
        t.mergedAccountOptions.keepMobileId = t.newCustomerId;
        t.selectedAccount.mobile = 'new';
      }
      if (t.mainCustomerAuthMap.email !== '' && t.mergeCustomerAuthMap.email === '') {
        t.mergedAccountOptions.keepEmailId = t.newCustomerId;
        t.selectedAccount.email = 'new';
      }
      if (t.mainCustomerAuthMap.uniteNickname !== '' && t.mergeCustomerAuthMap.uniteNickname === '') {
        t.mergedAccountOptions.keepWxId = t.newCustomerId;
        t.selectedAccount.uniteNickname = 'new';
      }
      if (t.mainCustomerAuthMap.fullName !== '' && t.mergeCustomerAuthMap.fullName === '') {
        t.mergedAccountOptions.keepCustomerNameId = t.newCustomerId;
        t.selectedAccount.fullName = 'new';
      }
      if (t.mainCustomerAuthMap.sex !== '' && t.mergeCustomerAuthMap.sex === '') {
        t.mergedAccountOptions.keepSexId = t.newCustomerId;
        t.selectedAccount.sex = 'new';
      }
      if (t.mainCustomerAuthMap.medicalTitle !== '' && t.mergeCustomerAuthMap.medicalTitle === '') {
        t.mergedAccountOptions.keepMedicalTitleId = t.newCustomerId;
        t.selectedAccount.medicalTitle = 'new';
      }
      if (t.mainCustomerAuthMap.company !== '' && t.mergeCustomerAuthMap.company === '') {
        t.mergedAccountOptions.keepCompanyId = t.newCustomerId;
        t.selectedAccount.company = 'new';
      }
      if (t.mainCustomerAuthMap.password !== '' && t.mergeCustomerAuthMap.password === '') {
        t.mergedAccountOptions.keepPwdId = t.newCustomerId;
        t.selectedAccount.password = 'new';
      }
      if (t.mainCustomerAuthMap.roleId !== '' && t.mergeCustomerAuthMap.roleId === '') {
        t.mergedAccountOptions.keepRoleIdId = t.newCustomerId;
        t.selectedAccount.roleId = 'new';
      }
      t.updateCertIdStr();
    },
    // 根据选择，设置基础帐号
    setBase(type) {
      if (type === 'new') {
        this.mergedAccountOptions.keepCustomerId = this.mainCustomerAuthMap.customerId;
        this.mergedAccountOptions.removeCustomerId = this.mergeCustomerAuthMap.customerId;
      }
      else {
        this.mergedAccountOptions.keepCustomerId = this.mergeCustomerAuthMap.customerId;
        this.mergedAccountOptions.removeCustomerId = this.mainCustomerAuthMap.customerId;
      }
      this.accountBase = type;
    },
    // 进入合并选择模式
    mergeAccount() {
      this.$store.commit('setMergeMode', true);
      localStorage.setItem('mergeMode', true);
    },
    // 确认合并弹窗
    confirmMerge() {
      this.dialogVisible = true;
    },
    // 弹窗中确认
    confirmClick() {
      let t = this;
      this.centerDialogVisible = false;
      t.openLoading();
      t.sendMergeRequest();
    },
    // 提交合并请求
    sendMergeRequest() {
      let t = this;
      this.mergedAccountOptions.keepMainCourseIdList = this.mergedAccountOptions.keepMainCourseIdList.join(',');
      this.mergedAccountOptions.keepMainCouponIdList = this.mergedAccountOptions.keepMainCouponIdList.join(',');
      this.mergedAccountOptions.keepMergeCourseIdList = this.mergedAccountOptions.keepMergeCourseIdList.join(',');
      this.mergedAccountOptions.keepMergeCouponIdList = this.mergedAccountOptions.keepMergeCouponIdList.join(',');

      axios({
        method: api.updateMergeState.type,
        url: api.updateMergeState.url,
        data: this.mergedAccountOptions
      }).then(function(res) {
        t.closeLoading();
        if (res.data.responseObject.responseStatus) {
          // 合并成功 取下一条
          t.$message.info('合并成功！');
          t.getNextData();
        }
        else {
          // 合并失败 显示提示信息
          t.$message.info('合并失败！');
        }
      });
    },
    // 获取下一条数据
    getNextData() {
      this.isChange = false;
      this.isNewDataFlag = true;
      let t = this;
      // 获取筛选参数
      let roleType = JSON.parse(localStorage.getItem('mergeListQueryParams')).roleType;
      if (roleType === 'OP721') {
        this.$router.push({
          path: '/memberMerge'
        });
      }
      else {
        if (localStorage.getItem('mergeListQueryParams')) {
          let params = JSON.parse(localStorage.getItem('mergeListQueryParams'));
          params.firstResult = parseInt(params.firstResult) + parseInt(localStorage.getItem('mergeListEditingIndex'));
          params.maxResult = 1;
          axios({
            method: api.getMergeAccountList.type,
            url: api.getMergeAccountList.url,
            params: params,
            data: params
          }).then((response) => {
            if (response.data && response.data.responseObject && response.data.responseObject.responseData.dataList) {
              t.tableData = response.data.responseObject.responseData.dataList;
              t.isChange = false;
              let originIndex = parseInt(localStorage.getItem('mergeListEditingIndex'));
              localStorage.setItem('mergeListEditingIndex', originIndex + 1);
              if (t.tableData.length > 0) { // 条数足够
                this.$store.commit('setCurrentMergeRow', t.tableData[0]);
                t.getMergeAccount(); // 重新获取帐户
              }
              else {
                t.$message.error('已经无待处理数据');
                t.isNoData = true;
              }
            }
            else {
              // t.$message.error("已到最后一条");
              t.isNoData = true;
            }
          });
        }
      }
    },
    // 选了老帐号的证件 ，更新新帐号
    oldCertImgSelected(img) {
      this.oldImgObj = img;
      this.oldSelectedIndex = img.index;
      let newSelectedIndex = this.getCorrespondingImgIndexFromNewByOld(img);
      if (newSelectedIndex >= 0) { // 找到有对应的证件，才变化
        this.newSelectedIndex = newSelectedIndex;
        this.newImgObj = this.mainCustomerAuthMap.authAttMapList[this.newSelectedIndex];
      }
    },
    // 选了新帐号的证件 ，更新老帐号
    newCertImgSelected(img) {
      this.newImgObj = img;
      this.findSameTypeCertNumber(); // 在认证图片列表中查相同类型证件的证件编号，直接添加到此证件上面
      this.newSelectedIndex = img.index;
      let oldSelectedIndex = this.getCorrespondingImgIndexFromOldByNew(img);
      if (oldSelectedIndex >= 0) { // 找到有对应的证件，才变化
        this.oldSelectedIndex = oldSelectedIndex;
        this.oldImgObj = this.mergeCustomerAuthMap.authAttMapList[this.oldSelectedIndex];
      }
    },
    // 在认证图片列表中查相同类型证件的证件编号，直接添加到此证件上面
    findSameTypeCertNumber() {
      for (let i = 0; i < this.newImgList.length; i++) {
        const newImg = this.newImgList[i];
        if (this.newImgObj.attType === newImg.attType && this.newImgObj.attPositionType !== newImg.attPositionType) {
          this.newImgObj.attCode = newImg.attCode;
        }
      }
    },
    // 从新帐号的证书图片中 找到与旧帐号的当前显示图片相对应的证书index.
    getCorrespondingImgIndexFromNewByOld(oldImg) {
      let t = this;
      let newImgList = t.mainCustomerAuthMap.authAttMapList;
      for (let i = 0; i < newImgList.length; i++) {
        const newImg = newImgList[i];
        if (newImg.attType === oldImg.attType && newImg.attPositionType === oldImg.attPositionType) {
          return i;
        }
      }
      return -1;
    },
    // 从旧帐号的证书图片中 找到与新帐号的当前显示图片相对应的证书index.
    getCorrespondingImgIndexFromOldByNew(newImg) {
      let t = this;
      let oldImgList = t.mergeCustomerAuthMap.authAttMapList;
      for (let i = 0; i < oldImgList.length; i++) {
        const oldImg = oldImgList[i];
        if (newImg.attType === oldImg.attType && newImg.attPositionType === oldImg.attPositionType) {
          return i;
        }
      }
      return -1;
    },
    // 帐号上面基础信息 radio 选中回调
    updateSelected(options) {
      let t = this;
      let v = options.val;
      let keepCustomerId = v === 'new' ? t.newCustomerId : t.oldCustomerId;
      this.selectedAccount[options.key] = options.val;
      switch (options.key) {
        case 'email':
          t.mergedAccountOptions.keepEmailId = keepCustomerId;
          break;
        case 'mobile':
          t.mergedAccountOptions.keepMobileId = keepCustomerId;
          break;
        case 'fullName':
          t.mergedAccountOptions.keepCustomerNameId = keepCustomerId;
          break;
        case 'uniteNickname':
          t.mergedAccountOptions.keepWxId = keepCustomerId;
          break;
        case 'sex':
          t.mergedAccountOptions.keepSexId = keepCustomerId;
          break;
        case 'password':
          t.mergedAccountOptions.keepPwdId = keepCustomerId;
          break;
        case 'medicalTitle':
          t.mergedAccountOptions.keepMedicalTitleId = keepCustomerId;
          break;
        case 'company':
          t.mergedAccountOptions.keepCompanyId = keepCustomerId;
          break;
        // TODO: cardId List  要保留的证件主键id串，以逗号隔开。
      }
    },
    // 图片列表 更新回调  若选
    updateSelectedCertPic(img) {
      //  1.旧证件无变化。 无需处理
      //  2.两个里面都有的话，互斥
      //  3.新证件可取消
      let t = this;
      let {onlyInNew, inAllTwo} = t.imgListGroup;
      for (let i = 0; i < inAllTwo.length; i++) { // 新老帐户中共有的证件需要互斥处理
        let two = inAllTwo[i];
        if (two.attType === img.attType &&
          two.attPositionType === img.attPositionType) { // 找到那个证件
          // 交换状态
          t.exchangeState(img);
          t.updateCertIdStr();
        }
      }
      for (let i = 0; i < onlyInNew.length; i++) {
        let inNew = onlyInNew[i];
        if (inNew.attType === img.attType &&
          inNew.attPositionType === img.attPositionType) { // 找到那个证件
          // 交换状态
          t.exchangeState(img);
          t.updateCertIdStr();
        }
      }
      t.$forceUpdate();
    },
    // 交换选中状态
    exchangeState(img) {
      let t = this;
      for (let i = 0; i < t.oldImgList.length; i++) {
        if (t.oldImgList[i].attType === img.attType &&
          t.oldImgList[i].attPositionType === img.attPositionType) { // 找到那个证件
          t.oldImgList[i].selected = !t.oldImgList[i].selected;
          t.$set(t.oldImgList, i, t.oldImgList[i]);
          break;
        }
      }
      for (let i = 0; i < t.newImgList.length; i++) {
        if (t.newImgList[i].attType === img.attType &&
          t.newImgList[i].attPositionType === img.attPositionType) { // 找到那个证件
          t.newImgList[i].selected = !t.newImgList[i].selected;
          t.$set(t.newImgList, i, t.newImgList[i]);
          break;
        }
      }
    },
    // 交换选中状态
    exchangeNewListState(img) {
      let t = this;
      console.log('exchanged-new');

      for (let i = 0; i < t.newImgList.length; i++) {
        if (t.newImgList[i].attType === img.attType &&
          t.newImgList[i].attPositionType === img.attPositionType) { // 找到那个证件
          t.newImgList[i].selected = !t.newImgList[i].selected;
          break;
        }
      }
      t.$set(t.newImgList, Object.assign({}, t.newImgList));
    },
    // 更新选中的证件Id串
    updateCertIdStr() {
      let str = '';
      let arr = this.oldImgList.concat(this.newImgList);
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (item.selected) {
          str += item.id + ',';
        }
      }
      str = str.substr(0, str.length - 1);
      this.$set(this.mergedAccountOptions, 'keepCardIdList', str);
    },
    // 图片列表数据获取回来后，对图片进行分组, 后续作为勾选时参考比对的依据
    imgListGrouping() {
      let t = this;
      let oldImgList = t.mergeCustomerAuthMap.authAttMapList;
      let newImgList = t.mainCustomerAuthMap.authAttMapList;
      let inAllTwo = [];
      let onlyInOld = [];
      let onlyInNew = [];
      for (let i = 0; i < oldImgList.length; i++) {
        let oldImg = oldImgList[i];
        let onlyInOldFlag = true;
        for (let j = 0; j < newImgList.length; j++) {
          const newImg = newImgList[j];
          if (oldImg.attType === newImg.attType &&
            oldImg.attPositionType === newImg.attPositionType) {
            onlyInOldFlag = false;
            inAllTwo.push({
              attType: oldImg.attType,
              attPositionType: oldImg.attPositionType
            });
            break;
          }
        }
        if (onlyInOldFlag) {
          onlyInOld.push(oldImg);
        }
      }
      for (let i = 0; i < newImgList.length; i++) {
        const newImg = newImgList[i];
        let onlyInNewFlag = true;
        for (let j = 0; j < oldImgList.length; j++) {
          const oldImg = oldImgList[j];
          if (oldImg.attType === newImg.attType &&
            oldImg.attPositionType === newImg.attPositionType) {
            onlyInNewFlag = false;
            break;
          }
        }
        if (onlyInNewFlag) {
          onlyInNew.push(newImg);
        }
      }
      this.imgListGroup = {
        onlyInOld,
        inAllTwo,
        onlyInNew
      };
    },
    // 设置初始化选择数据 默认先选中左边的老帐户图片，如果可能也选中新帐户中前面不存在的证件
    certImgListInit() {
      let t = this;
      let oldArr = [];
      let newArr = [];
      let oldImgList = t.mergeCustomerAuthMap.authAttMapList.concat();
      let newImgList = t.mainCustomerAuthMap.authAttMapList.concat();
      oldImgList.map(function(item, index) {
        item.selected = true;
        item.isOld = true;
        oldArr.push(item);
      });
      newImgList.map(function(item, index) {
        let found = false;
        for (let i = 0; i < t.imgListGroup.onlyInNew.length; i++) {
          const inNew = t.imgListGroup.onlyInNew[i];
          if (inNew.attType === item.attType && inNew.attPositionType === item.attPositionType) {
            item.selected = true;
            found = true;
            break;
          }
        }
        if (!found) {
          item.selected = false;
        }
        item.isOld = false;
        newArr.push(item);
      });
      t.oldImgList = oldArr;
      t.newImgList = newArr;
      t.newImgListBackup = JSON.parse(JSON.stringify(newArr)); // newArr.concat();
    },
    // 查看大图
    showBigImgOnClick(data) {
      if (data) {
        this.showBigData.visible = true;
        this.showBigData.url = data.attPath.replace(/(.*)_c/, '$1');
        // 判断是否为新老数据，新数据可编辑标题，老数据不可以
        this.showBigData.isReadOnly = !!data.isOld;
        this.showBigData.title = data.attCode;
        this.showBigActiveSwiper = data.swiperObj ? data.swiperObj : this.showBigActiveSwiper;
      }
    }, // 关闭查看大图
    closeShowBigHandle(data) {
      this.showBigData.visible = false;
      // 因为只有新账号可以修改编号，所以直接设置新账号编号即可
      if (!this.showBigData.isReadOnly) {
        this.newImgObj.attCode = data;
      }
    },

    // 查看大图时，上一张图片的处理事件
    switchPrevEventHandle() {
      this.showBigActiveSwiper.slidePrev();
      if (this.showBigData.isReadOnly) {
        this.showBigImgOnClick(this.oldImgList[this.showBigActiveSwiper.activeIndex]);
      }
      else {
        this.showBigImgOnClick(this.newImgList[this.showBigActiveSwiper.activeIndex]);
      }
    },
    // 查看大图时，下一张图片的处理事件
    switchNextEventHandle() {
      this.showBigActiveSwiper.slideNext();
      if (this.showBigData.isReadOnly) {
        this.showBigImgOnClick(this.oldImgList[this.showBigActiveSwiper.activeIndex]);
      }
      else {
        this.showBigImgOnClick(this.newImgList[this.showBigActiveSwiper.activeIndex]);
      }
    },
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '合并中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    closeLoading() {
      this.loading.close();
    },
    // 有修改改变状态
    stateChange(key) {
      if (this.isNewDataFlag) {
        this.isNewDataFlag = false;
      }
      else {
        if (this.mainCustomerAuthMapBackUp[key] !== this.mainCustomerAuthMap[key]) {
          !this.isChange && (this.isChange = true);
        }
      }
    },
    compare(x, y) {
      let p;
      if (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)) {
        return true;
      }
      if (x === y) {
        return true;
      }
      if (typeof x === 'function' && typeof y === 'function') {
        if ((x instanceof RegExp && y instanceof RegExp) ||
          (x instanceof String || y instanceof String) ||
          (x instanceof Number || y instanceof Number)) {
          return x.toString() === y.toString();
        }
        else {
          return false;
        }
      }
      if (x instanceof Date && y instanceof Date) {
        return x.getTime() === y.getTime();
      }
      if (!(x instanceof Object && y instanceof Object)) {
        return false;
      }
      if (x.prototype !== y.prototype) {
        return false;
      }
      if (x.constructor !== y.constructor) {
        return false;
      }
      for (p in y) {
        if (!x.hasOwnProperty(p)) {
          return false;
        }
      }
      for (p in x) {
        if (!y.hasOwnProperty(p)) {
          return false;
        }
        if (typeof y[p] !== typeof x[p]) {
          return false;
        }
        if (!this.compare(x[p], y[p])) {
          return false;
        }
      }
      return true;
    },
    // 检查证件号是否有修改
    checkAttCodeChanged() {
      // if(!this.compare(this.newImgList,this.newImgListBackup)){
      //   this.isChange = true;
      // }
      let changed = false;
      for (let i = 0; i < this.newImgList.length; i++) {
        const newImg = this.newImgList[i];
        for (let j = 0; j < this.newImgListBackup.length; j++) {
          const newImgBack = this.newImgListBackup[j];
          if (newImg.attPositionType === newImgBack.attPositionType && newImg.attType === newImgBack.attType) {
            if (newImg.attCode !== newImgBack.attCode) {
              changed = true;
            }
          }
        }
      }
      return changed;
    },
    // 获取角色名称
    getRoleByRoleId(roleId) {
      switch (roleId) {
        case '6':
          return '医生';
        case '12':
          return '护士';

        case '13':
          return '医助';
        default:
          return '医生';
      }
    },
    getMedicalTitleListByRole(roleId) {
      console.log('roleId');
      console.log(roleId);
      let medicalTitleList;
      let doctorMedicalTitleList = [
        {
          medicalTitle: '住院医师',
          id: '1'
        }, {
          medicalTitle: '主治医师',
          id: '2'
        }, {
          medicalTitle: '副主任医师',
          id: '3'
        }, {
          medicalTitle: '主任医师',
          id: '4'
        }, {
          medicalTitle: '医学生',
          id: '10'
        }
      ];
      let nurseMedicalTitleList = [
        {
          medicalTitle: '护士',
          id: '11'
        }, {
          medicalTitle: '护师',
          id: '12'
        }, {
          medicalTitle: '主管护师',
          id: '13'
        }, {
          medicalTitle: '副主任护师',
          id: '14'
        }, {
          medicalTitle: '主任护师',
          id: '15'
        }
      ];
      let doctorAssistMedicalTitleList = [{
        medicalTitle: '医助',
        id: '17'
      }];

      // let allMedicalTitleList = [
      //   ...doctorMedicalTitleList,
      //   ...nurseMedicalTitleList,
      //   ...doctorAssistMedicalTitleList
      // ];
      switch (roleId) {
        case '5':
        case '6': // 医生
        case '11': // 医生
          medicalTitleList = doctorMedicalTitleList;
          break;

        case '12': // 护士
          medicalTitleList = nurseMedicalTitleList;
          break;
        case '13': // 医助
          medicalTitleList = doctorAssistMedicalTitleList;
          break;
        default: // 医生
          medicalTitleList = doctorMedicalTitleList;
          break;
      }
      this.$set(this, 'medicalTitleItems', medicalTitleList);
      console.log(this.medicalTitleItems);
      return medicalTitleList;
    },
    // 获取本合并行相关的优惠券信息
    getMergeCoupon(mergeId) {
      let _this = this;
      let param = {
        id: mergeId
      };

      axios({
        method: api.getMergeCouponList.type,
        url: api.getMergeCouponList.url,
        params: param,
        responseType: 'json',
        before: function() {
          // common.loading.show();
        }
      })
        .then(function(res) {
          console.log(res);
          if (res && res.data && res.data.responseObject) {
            if (res.data.responseObject.responseData.mergeCouponList) {
              _this.mergeCouponList = res.data.responseObject.responseData.mergeCouponList;
            }
            else {
              _this.mergeCouponList = [];
            }
            if (res.data.responseObject.responseData.mainCouponList) {
              _this.mainCouponList = res.data.responseObject.responseData.mainCouponList;
            }
            else {
              _this.mainCouponList = [];
            }

            // 初始化默认选中的优惠券列表
            // 合并规则：默认选中所有老帐号优惠券，及新帐号中老帐号未包含的优惠券
            _this.mergedAccountOptions.keepMergeCouponIdList = _this.mergeCouponList.map(function(item, index) {
              return item.id;
            });

            for (let i = 0; i < _this.mainCouponList.length; i++) {
              const coupon = _this.mainCouponList[i];
              let existSameCoupon = false;
              for (let j = 0; j < _this.mergeCouponList.length; j++) {
                const mergeCoupon = _this.mergeCouponList[j];
                if (coupon.id === mergeCoupon.id) {
                  existSameCoupon = true;
                }
              }
              if (!existSameCoupon) { // 存在不同的优惠券的话。。
                _this.mergedAccountOptions.keepMainCouponIdList.push(coupon.id);
              }
            }
          }
        });
    },
    // 获取本合并行相关的课程信息
    getMergeCourse(mergeId) {
      let _this = this;
      let param = {
        id: mergeId // mergeId TODO：暂时这个号有数据，以后换成参数
      };

      axios({
        method: api.getMergeCourseList.type,
        url: api.getMergeCourseList.url,
        params: param,
        responseType: 'json',
        before: function() {
          // common.loading.show();
        }
      })
        .then(function(res) {
          if (res && res.data && res.data.responseObject) {
            if (res.data.responseObject.responseData.mergeCourseList) {
              _this.mergeCourseList = res.data.responseObject.responseData.mergeCourseList;
            }
            else {
              _this.mergeCouponList = [];
            }
            if (res.data.responseObject.responseData.mainCourseList) {
              _this.mainCourseList = res.data.responseObject.responseData.mainCourseList;
            }
            else {
              _this.mainCourseList = [];
            }
            // 初始化默认选中的课程列表
            // 合并规则：默认选中所有老帐号课程，及新帐号中老帐号未包含的课程
            _this.mergedAccountOptions.keepMergeCourseIdList = _this.mergeCourseList.map(function(item, index) {
              return item.courseId;
            });

            for (let i = 0; i < _this.mainCourseList.length; i++) {
              const course = _this.mainCourseList[i];
              let existSameCourse = false;
              for (let j = 0; j < _this.mergeCourseList.length; j++) {
                const mergeCourse = _this.mergeCourseList[j];
                if (course.courseId === mergeCourse.courseId) {
                  existSameCourse = true;
                }
              }
              if (!existSameCourse) { // 存在不同的课程的话。。
                _this.mergedAccountOptions.keepMainCourseIdList.push(course.courseId);
              }
            }
          }
        });
    },
    // 获取本合并行的新旧用户钱包信息
    getMergeWallet() {
      let _this = this;
      let param = {
        oldCustomerId: _this.oldCustomerId,
        newCustomerId: _this.newCustomerId
      };

      axios({
        method: api.getNewAndOldBalance.type,
        url: api.getNewAndOldBalance.url,
        params: param,
        responseType: 'json',
        before: function() {
          // common.loading.show();
        }
      })
        .then(function(res) {
          if (res && res.data && res.data.responseObject) {
            let temp = res.data.responseObject.responseData;
            if (temp.oldIosWallet !== undefined && JSON.stringify(temp.oldIosWallet) !== '{}') {
              _this.oldIosWallet = temp.oldIosWallet;
            }
            else {
              _this.oldIosWallet = null;
            }
            if (temp.newIosWallet !== undefined && JSON.stringify(temp.newIosWallet) !== '{}') {
              _this.newIosWallet = res.data.responseObject.responseData.newIosWallet;
            }
            else {
              _this.newIosWallet = null;
            }
            if (temp.oldAndroidWallet !== undefined && JSON.stringify(temp.oldAndroidWallet) !== '{}') {
              _this.oldAndroidWallet = res.data.responseObject.responseData.oldAndroidWallet;
            }
            else {
              _this.oldAndroidWallet = null;
            }
            if (temp.newAndroidWallet !== undefined && JSON.stringify(temp.newAndroidWallet) !== '{}') {
              _this.newAndroidWallet = res.data.responseObject.responseData.newAndroidWallet;
            }
            else {
              _this.newAndroidWallet = null;
            }

            // if (JSON.stringify(res.data.responseObject.responseData.oldIosWallet) !== '{}') {
            //   _this.oldIosWallet = res.data.responseObject.responseData.oldIosWallet;
            // }
            // else {
            //   _this.oldIosWallet = null;
            // }
            // if (JSON.stringify(res.data.responseObject.responseData.newIosWallet) !== '{}') {
            //   debugger;
            //   _this.newWallet = res.data.responseObject.responseData.newIosWallet;
            // }
            // else {
            //   _this.newIosWallet = null;
            // }
            // if (JSON.stringify(res.data.responseObject.responseData.oldAndroidWallet) !== '{}') {
            //   _this.oldAndroidWallet = res.data.responseObject.responseData.oldAndroidWallet;
            // }
            // else {
            //   _this.oldAndroidWallet = null;
            // }
            // if (JSON.stringify(res.data.responseObject.responseData.newAndroidWallet) !== '{}') {
            //   _this.newAndroidWallet = res.data.responseObject.responseData.newAndroidWallet;
            // }
            // else {
            //   _this.newAndroidWallet = null;
            // }

            // 初始化默认选中的课程列表
            // 合并规则：默认选中所有老帐号课程，及新帐号中老帐号未包含的课程
            _this.mergedAccountOptions.keepMergeCourseIdList = _this.mergeCourseList.map(function(item, index) {
              return item.courseId;
            });

            // 初始化默认选中的钱包ID
            // if (_this.oldWallet) {
            //   _this.mergedAccountOptions.keepWalletId = _this.oldWallet.walletId;
            // }
            // else if (_this.newWallet) {
            //   _this.mergedAccountOptions.keepWalletId = _this.newWallet.walletId;
            // }

            for (let i = 0; i < _this.mainCourseList.length; i++) {
              const course = _this.mainCourseList[i];
              let existSameCourse = false;
              for (let j = 0; j < _this.mergeCourseList.length; j++) {
                const mergeCourse = _this.mergeCourseList[j];
                if (course.courseId === mergeCourse.courseId) {
                  existSameCourse = true;
                }
              }
              if (!existSameCourse) { // 存在不同的课程的话。。
                _this.mergedAccountOptions.keepMainCourseIdList.push(course.courseId);
              }
            }
          }
        });
    },
    isSelectedCoupon(coupon, type) {
      let compareObject = this.mergedAccountOptions.keepMergeCouponIdList;
      if (type === 'main') {
        compareObject = this.mergedAccountOptions.keepMainCouponIdList;
      }
      for (let i = 0; i < compareObject.length; i++) {
        const couponElement = compareObject[i];
        if (couponElement === coupon.id) {
          return true;
        }
      }
      return false;
    },
    isSelectedCourse(course, type) {
      let compareObject = this.mergedAccountOptions.keepMergeCourseIdList;
      if (type === 'main') {
        compareObject = this.mergedAccountOptions.keepMainCourseIdList;
      }
      console.log('---', type, compareObject, course);
      for (let i = 0; i < compareObject.length; i++) {
        const courseElement = compareObject[i];
        if (courseElement === course.courseId) {
          return true;
        }
      }
      return false;
    },
    // selectWallet(type) {
    //   if (type === 'new') {
    //     this.newWallet.selected = true;
    //     this.oldWallet.selected = false;
    //   }
    //   else {
    //     this.newWallet.selected = false;
    //     this.oldWallet.selected = true;
    //   }
    // },
    selectMergeCourse(course) {
      let _this = this;
      // 若已选中，不操作
      if (_this.isSelectedCourse(course, 'merge')) {

      }
      else { // 否则 加入mergeList中，从main里查找踢除
        _this.mergedAccountOptions.keepMergeCourseIdList.push(course.courseId);
        let mainIndex = _this.mergedAccountOptions.keepMainCourseIdList.indexOf(course.courseId);
        if (mainIndex !== -1) {
          _this.mergedAccountOptions.keepMainCourseIdList.splice(mainIndex, 1);
        }
      }
    },
    selectMainCourse(course) {
      let _this = this;
      // 若已选中，不操作
      if (_this.isSelectedCourse(course, 'main')) {

      }
      else { // 否则 加入mainList中，从merge里查找踢除
        _this.mergedAccountOptions.keepMainCourseIdList.push(course.courseId);
        let mergeIndex = _this.mergedAccountOptions.keepMergeCourseIdList.indexOf(course.courseId);
        if (mergeIndex !== -1) {
          _this.mergedAccountOptions.keepMergeCourseIdList.splice(mergeIndex, 1);
        }
      }
    },
    selectMergeCoupon(coupon) {
      let _this = this;
      // 若已选中，不操作
      if (_this.isSelectedCoupon(coupon, 'merge')) {

      }
      else { // 否则 加入mergeList中，从main里查找踢除
        _this.mergedAccountOptions.keepMergeCouponIdList.push(coupon.id);
        let mainIndex = _this.mergedAccountOptions.keepMainCouponIdList.indexOf(coupon.id);
        if (mainIndex !== -1) {
          _this.mergedAccountOptions.keepMainCouponIdList.splice(mainIndex, 1);
        }
      }
    },
    selectMainCoupon(coupon) {
      let _this = this;
      // 若已选中，不操作
      if (_this.isSelectedCoupon(coupon, 'main')) {

      }
      else { // 否则 加入mainList中，从merge里查找踢除
        _this.mergedAccountOptions.keepMainCouponIdList.push(coupon.id);
        let mergeIndex = _this.mergedAccountOptions.keepMergeCouponIdList.indexOf(coupon.id);
        if (mergeIndex !== -1) {
          _this.mergedAccountOptions.keepMergeCouponIdList.splice(mergeIndex, 1);
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
.attCodeId {
  width: 180px;
  .el-input__inner {
    border: 0px;
    padding: 0;
    padding-top: 10px;
  }
  input {
    border: 0px;
    padding: 0;
    padding-top: 10px;
  }
}

.listEditStyle {
  b {
    margin: 0px !important;
    margin-left: 8px !important;
  }
}

.specB {
  b {
    margin: 0px !important;
    margin-left: 8px !important;
  }
  .active {
    border: 1px solid #4B67D6;
  }
}

.titleStyle {
  height: 36px;
  line-height: 36px;
}

.medicalTitle {
  span {
    width: 100px !important;
  }
}

.titleListStyle {
  border: 1px solid #E6E6E8;
  position: relative;
  background: #F7F9FC;
  border-radius: 4px;
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  color: #111111;
  width: 114px;
  display: inline-block;
  span {
    width: 80px !important;
  }
}

h3 {
  font-family: PingFangSC-Semibold;
  font-size: 20px;
  color: #2C343A;
  letter-spacing: 0;
  line-height: 20px;
  margin: 36px 0 25px;
  padding: 0 160px;
}

.dialog {
  h5 {
    text-align: center;
    font-size: 18px;
    font-weight: normal;
    color: #303133;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .wallet-box-wrap {
    .wallet-box {
      float: left;
      width: 50%;
      h6 {
        margin-left: 0;
      }
      .no-money {
        width: 60%;
        text-align: center;
        height: 24px;
        vertical-align: middle;
        margin: 10px 10px 10px 0px;
        padding: 10px 10px;
        color: #111111;
        line-height: 24px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #f7f7f7;
      }
      .money {
        width: 60%;
        text-align: center;
        height: 24px;
        vertical-align: middle;
        margin: 10px 10px 10px 0px;
        padding: 10px 10px;
        color: #111111;
        line-height: 24px;
        background: #F7F9FC;
        border-radius: 4px;
        border: 1px solid #797979;
        &.selected {
          border: 1px solid #4B67D6;
        }
      }
      span {
        text-align: center;
        line-height: 44px;
        height: 44px;
        display:block;
        clear:both;
      }
    }
  }
  section.course-box {
    &:after {
      content: '';
      display: table;
      clear: both;
    }
    .merge-course-box {
      float: left;
      width: 50%;
    }
    .main-course-box {
      float: left;
      width: 50%;
    }
    .course-button {
      width: 60%;
      text-align: center;
      height: 24px;
      vertical-align: middle;
      margin: 10px 10px 10px 0px;
      padding: 10px 10px;
      color: #111111;
      line-height: 24px;
      background: #F7F9FC;
      border-radius: 4px;
      border: 1px solid #ffffff;
      &.selected {
        border: 1px solid #4B67D6;
      }
    }
    .coupon-button {
      width: 80%;
      text-align: left;
      height: 70px;
      vertical-align: middle;
      margin: 10px auto;
      padding: 10px 10px;
      color: #111111;
      line-height: 24px;
      background: #F7F9FC;
      border-radius: 4px;
      border: 1px solid #ffffff;
      &.selected {
        border: 1px solid #4B67D6;
      }
      .coupon-type {
        font-size: 16px;
        span {
          font-size: 18px;
          color: red;
        }
      }
      .course-name {
        font-size: 14px;
      }
      .time {
        font-size: 12px;
      }
    }
  }
  .desc {
    font-size: 15px;
    color: #ff0000;
    line-height: 20px;
    margin-top: 20px;
    text-align: center;
  }
  .btn-box {
    display: flex;
    width: 381px;
    margin: 0 auto;
    justify-content: space-between;
  }
  .dialog-button {
    background: #F7F9FC;
    border-radius: 4px;
    width: 152px;
    height: 24px;
    line-height: 24px;
    margin: 10px 10px 10px 0px;
    padding: 10px 10px;
    text-align: center;
    color: #111111;
    cursor: pointer;
    border: 1px solid #ffffff;
    &.selected {
      border: 1px solid #4B67D6;
    }
  }
}

.info-box {
  margin: 7px auto 0;
  width: 1200px;
  justify-content: space-between;
  display: flex;
}

.user-box {
  width: 591px;

  h2 {
    font-weight: bold;
    font-size: 20px;
    color: #2C343A;
    letter-spacing: 0;
    line-height: 75px;
    height: 75px;
  }
  .info {
    background: #ffffff;
    box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);;
    border-radius: 4px;
    height: 882px;
    padding: 30px 24px 16px 30px;
    .text-form {
      width: 540px;

      .item {
        float: left;
        margin: 0 0 22px 0;
        font-size: 14px;
        color: #555555;
        span {
          display: inline-block;
          margin-right: 15px;
          width: 42px;
          text-align: justify;
          vertical-align: bottom;
          i {
            display: inline-block;
            /*padding-left: 100%;*/
            width: 100%;
          }
        }
        .radio {
          width: 22px;
          height: 22px;
          line-height: 36px;
          display: inline-block;
          /*margin:0;*/
          margin-bottom: 8px;
          margin-left: 8px;
          background: url(/static/images/icons/icon-tick-unselected.png) no-repeat center;
          &.selected {
            background: url(/static/images/icons/icon-tick-selected.png) no-repeat center;;
          }
        }
        .text {
          background: #F7F9FC;
          border-radius: 4px;
          height: 36px;
          line-height: 36px;
          padding: 0 12px;
          color: #111111;
          width: 114px;
          overflow: hidden;
          display: inline-block;
          border: 1px solid #E6E6E8;
          &.active {
            border: 1px solid #4B67D6;
          }
        }
        .company-input-wrap {
          height: 36px;
          line-height: 36px;
          width: 140px;
          overflow: hidden;
          display: inline-block;
          border: 1px solid #E6E6E8;
          background: #F7F9FC;
          border-radius: 4px;
          &.active {
            border: 1px solid #4B67D6;
          }
          input {
            background: none;
            border: none;
            border-radius: 0;
            height: 36px;
            padding: 0 12px;
            color: #111111;
            display: inline-block;
            width: 116px;
          }
        }
        input {
          background: #F7F9FC;
          border: 1px solid #E6E6E8;
          border-radius: 4px;
          height: 36px;
          padding: 0 12px;
          color: #111111;
          display: inline-block;
          margin-bottom: 1px;
          width: 116px;
          &.active {
            border: 1px solid #4B67D6;
          }
        }
        &.left {
          width: 285px;
        }
        &.right {
          width: 254px;
        }
        .email-send {
          float: right;
          margin-left: 12px;
          width: 35px;
          height: 35px;
        }
        .verify {
          width: 70px;
          height: 36px;
          color: #52CC64;
          background: #E9F7E9;
          text-align: center;
          line-height: 36px;
          border-radius: 4px;
          margin: 0;
        }
        .addCompany {
          width: 70px;
          height: 36px;
          color: #4B67D6;
          background: #EDF1FF;
          text-align: center;
          line-height: 36px;
          border-radius: 4px;
          margin: 0;
        }
      }
      .num {
        clear: both;
        font-size: 15px;
        color: #2C343A;
        input {
          border: none;
        }
      }
    }
  }
}

.control-box {
  width: 1200px;
  margin: 27px auto 25px;
  display: flex;
  justify-content: flex-end;
}

.cert-pic-box {
  clear: both;
  margin-top: 18px;
}

.divided {
  width: 600px;
  height: 1px;
  background: #ececec;
  margin: 0px auto;
  clear: both;
}

.reset-popup-box {
  width: 600px;
  margin: 0 auto;
}

</style>
