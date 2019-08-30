<template>
  <div class="main">
    <div class="error-tip" v-if="!formValidState && tipShow">
      <div class="close-btn" @click="onTipClose"></div>
      {{errorInfo}}
    </div>
    <div class="head">
      <img src="https://m.allinmed.cn/static/image/mp/index/1.2.0/smile.png"
           alt="" class="smile">
      添加就诊人信息 ，<span>仅{{doctorName}}医生本人可见</span>
    </div>
    <section class="form-box">
      <div class="center">
        <div class="form-item row-1">
          <div class="item-name" :class="{'error-tip-color':errorTip=='name'}">
            姓名
          </div>
          <div class="form-input" >
            <input type="text" placeholder="请输入姓名"  v-model="patientName" @input="contentLimit">
          </div>
        </div>
        <div class="form-item">
          <div class="item-name" :class="{'error-tip-color':errorTip=='card'}">
            身份证号
          </div>
          <div class="form-input">
            <input type="text" placeholder="请输入身份证号" v-model="idCard"  @input="idCardLimit">
          </div>
        </div>
      </div>
    </section>
    <div class="id-tips">
      仅用于用户认证，会严格保护您的隐私信息
    </div>
    <div class="address">
      <province-city-picker
        @dataChange="provinceCityChang"
        :defaultProvince="province"
        :defaultCity="city"
        :cityErrorTip="errorTip"
        v-if="hackReset"
      ></province-city-picker>
    </div>

    <div class="next-box">
      <form action="" @submit="formSubmit" report-submit="true">
        <button class="next-btn" formType="submit" @click="validateForm">下一步</button>
      </form>
    </div>
    <logo-loading v-if="loading"></logo-loading>
  </div>
</template>

<script type="text/ecmascript-6">
     /**
           * 添加就诊人
           * @module src/packageD/reportNew/reportAddPatient.vue
           * @desc 从就诊人列表进来，添加新的就诊人，或更新已存在的就诊人，当此就诊人无身份证信息时
           * @author liuyutao
           * @date 2019/2/18
           */
  import api from "common/js/util/util";
  import storage from "localStorage";
  import logoLoading from 'components/LogoLoading';
  import provinceCityPicker from "components/provinceCityPicker/provinceCityPicker";
  import dataLog from "common/js/dataLog/dataLog";
  import sendFormId from "../../common/js/HttpRequest/sendFormId";
  import validatePlugins from "../../common/js/util/validate_plugins";
  import getReportList from "common/js/report/getReportList";//获取跳转路径
  import {createNamespacedHelpers} from 'vuex';
  const {mapState, mapMutations} = createNamespacedHelpers('reportNew');

  const XHRList = {
    createPatient: api.httpEnv() + '/mcall/customer/patient/baseinfo/v1/createPatient/',  // 创建就诊人
    validateIdCard: api.httpEnv() + '/mcall/customer/patient/baseinfo/v1/validateIdCard/',  // 较验身份证
    getDoctorTip:   api.httpEnv() + '/mcall/cms/patienteducation/v1/getDoctorTip/',// 获取医生名称
    getPath: api.httpEnv() + '/mcall/patient/report/content/v2/getReportList/',  // 跳转/获取报道信息页
  };
  export default {
    name: "reportAddPatient",
    computed:{
      ...mapState(['reportId','doctorCustomerId','patientId','caseId','doctorId'])
    },
    data() {
      let _this = this;
      return {
        errorTip:'',
        isBtnClick:false,
        patientName:'',
        doctorName:'',
        idCard:'',
        loading:0,
        customerId:"",
        provinceId:'',
        province:'',
        cityId:'',
        city:'',
        errorInfo:'',
        reportState:'', // 从就诊人列表点过来的就诊人的报到状态，1，未完成，2 未开始
        certificateCode:'',
        formValidState:true,
        tipShow:false,
        idcardStatus:'',
        hackReset:false   // 重置 picker 的hack 方式
      }
    },
    components:{
      provinceCityPicker,
      logoLoading
    },
    onLoad(options){
      this.options = options;
      this.hackReset = false;   // 重置 picker 的hack 方式
      this.$nextTick(() => {
        this.hackReset = true
      });
      this.resetData();
      this.getDoctorName();
      console.log("onLoad");
      this.customerId = storage.getItem("userId");
      this.doctorId = storage.getItem("doctorId");
      // 重置状态

      let _this = this;
      // from 我的就诊人列表页面 若就诊人无身份证，需在新建就诊人页面带出用户 其他信息，补充身份证信息
      console.log(this.patientId)
      if(this.patientId){   // 编辑

        console.log(options)
        if(options.patientName){
          this.patientName = options.patientName;
        }
        if(options.province){
          this.province = options.province;
        }
        if(options.city){
          this.city = options.city;
        }
      }else{    // 新增
        this.resetData();
      }

      if(options.reportState){ // 如果有报到状态参数
        _this.reportState = options.reportState;
      }
      wx.setNavigationBarTitle({
        title: "添加就诊人"
      });
      wx.setNavigationBarColor({
        frontColor:'#000000',
        backgroundColor: '#ffffff'
      });
      console.log(this.province,this.city)
    },
    onShow(){   //TODO: 此处需代码优化 虽管用，但不知为啥 liuyutao 与onLoad 也有重复
      console.log("onshow");
      let options = this.options;
      this.resetData();
      if(this.patientId){   // 编辑
        console.log(options)
        if(options.patientName){
          this.patientName = options.patientName;
        }
        if(options.province){
          this.province = options.province;
        }
        if(options.city){
          this.city = options.city;
        }
      }else{    // 新增
        this.resetData();
      }

      dataLog.enterBrowse()
    },
    onHide(){
      this.resetData();
      dataLog.leaveBrowse();
    },
    methods:{
      ...mapMutations(['setCaseId','setReportId','setPatientId']),
      formSubmit(e) {
        sendFormId(e.target.formId);
      },

      contentLimit() {
        let _this=this;
        if (_this.patientName&&api.getByteLen(_this.patientName) >= 20){
          _this.patientName=api.getStrByteLen(_this.patientName,20);
        }
      },
      resetData(){
        console.log("reset")
        this.errorTip = '';
        this.patientName = '';
        this.errorInfo = '';
        this.tipShow = false;
        this.provinceId = '';
        this.province = '';
        this.cityId = '';
        this.city = '';
        this.idCard = '';
        this.certificateCode = '';
      },
      // 去登录规则页
      goPageRule () {
        wx.navigateTo({
          url: "/pages/loginRule/loginRule"
        });
      },
      onTipClose(){
          this.tipShow = false;
          this.errorInfo='';
          this.errorTip= "";
      },
      provinceCityChang(data){
        console.log("change",data)
        this.province = data.province;
        this.provinceId = data.provinceId;
        this.cityId = data.cityId;
        this.city = data.city;
      },
      // 较验身份证号
      validateIdCard(){
        let _this = this;
        if(!_this.idCard) { // 身份证号为空
          _this.formValidState = false;
          _this.errorInfo = "请输入您的身份证号码";
          _this.errorTip= "card";
          _this.tipShow = true;
          _this.isBtnClick = false;
        }else{  // 身份证号非空

          // 前端较验身份证号格式
          if(!validatePlugins.identityCard(_this.idCard)){
            _this.formValidState = false;
            _this.errorInfo = "请输入正确的身份证号码";
            _this.errorTip= "card";
            _this.tipShow = true;
            _this.isBtnClick = false;
          }else{  // 后端较验
            let param = {
              name:_this.patientName, // 患教姓名
              idCard:_this.idCard,    // 身份证号
              customerId:_this.customerId,  //账号id
            };
            _this.loading++;
            api.ajax({
              url:XHRList.validateIdCard,
              method: 'post',
              data: param,
              timeout: 30000,
              done(response) {
                _this.loading--;
                console.log(response);
                if (response && response.responseObject) {
                  if (response.responseObject.responseStatus) {   // 后台较验接口正常
                    _this.idcardStatus = response.responseObject.responseData.cardStatus; // 身份证状态：1验证通过 0验证不通过 2请求超时，未验证 保存用户时的参数
                    let code = response.responseObject.responseData.code;
                    if (code == '0' || code == '102' || code == '202') {  //0 查询成功  102 查询成功，姓名与身份证不一致，但产品说可以允许，202 黑格超时，允许通过
                      _this.validateAddress();
                    } else {  // 非以上状态 阻止提交
                      if(code=="303"){
                        _this.errorInfo = "您今日请求次数过多";
                        _this.errorTip= "card";
                      }else{
                        // TODO:应该显示什么错误信息
                        _this.errorInfo = response.responseObject.responseData.msg;
                        _this.errorTip= "card";
                      }

                      _this.tipShow = true;
                      _this.formValidState = false;
                    }
                  } else {  // 较验异常 可能是数据库中有之前脏数据导致 直接提交 交予后台较验
                    _this.idcardStatus = 0;
                    _this.validateAddress();
                  }
                }
              },

            });
          }
        }
      },
      getDoctorName(){
        let _this=this;
        _this.loading++;
        api.ajax({
          url:XHRList.getDoctorTip,
          method: 'post',
          data: {
            doctorId:_this.doctorCustomerId,
            logoUseFlag:5
          },
          timeout: 30000,
          done(response) {
            _this.loading--;
            if (response.responseObject && response.responseObject.responseData) {
              const dataList = response.responseObject.responseData.dataList[0];
              _this.doctorName = dataList.doctorName;
            }
          }
        })
      },
      validateAddress(){
        if(this.province=="请选择" || this.province==""){
          this.errorInfo = "请选择省市";
          this.errorTip= "province";
          this.tipShow = true;
          this.formValidState = false;
          return;
        }else{
          this.submit();
        }
      },
      // 限制身份证号输入的长度
      idCardLimit(){
        if(this.idCard.length>18){
          this.idCard = this.idCard.substr(0,18);
        }
      },
      // 较验表单
      validateForm(){
        let _this = this;
        dataLog.createTrack({ // 新建就诊人页面 点击”下一步“-2
          actionId: 14225,
          browseType:147,
          pushMessageId:JSON.stringify({doctorId:_this.doctorId})
        });

        _this.formValidState = true;

        if(!_this.patientName){
          _this.formValidState = false;
          _this.patientNameInValidState = true;
          _this.errorInfo = "请输入姓名";
          _this.errorTip= "name";
          _this.tipShow = true;
          _this.isBtnClick = false;
          return;
        }else{
          // 不可包含数字、特殊字符、空格
          if(_this.patientName.match(/[0-9]|\s|[`~!@#$%^&*()_+<>?:"{},.\/;'\[\]|·！#￥（——）：；“”‘、，|《。》？、【】\\]/)){
            _this.errorInfo = "请输入正确的姓名";
            _this.errorTip= "name";
            _this.tipShow = true;
            _this.isBtnClick = false;
            _this.formValidState = false;
            return;
          }else{
            _this.patientNameInValidState = false;
            _this.errorInfo = "";
            _this.errorTip= "";
          }
        }
        _this.validateIdCard();

      },

      // 创建就诊人
      submit(){
        let _this = this;
        _this.loading++;
        let param = {
          patientName:_this.patientName,
          customerId:_this.customerId,
          provinceId:_this.provinceId,
          province:_this.province,
          cityId:_this.cityId,
          city:_this.city,
          certificateId:1,
          certificateCode:_this.idCard,
          idcardStatus:_this.idcardStatus  // 异常传0，正常，返什么传什么。
        };
        if(_this.reportState){  // 如果是未开始或未完成中的，无身份证状态，加patientId参数，表示更新身份证信息。
          param.patientId=_this.patientId;
        }
        if(!this.isBtnClick){ // TODO： 多次提交先禁掉。
          this.isBtnClick=true;
        }else{
          return;
        }
        // 更新或创建
        api.ajax({
          url:XHRList.createPatient,
          method: 'post',
          data: param,
          timeout: 30000,
          done(response) {
            _this.loading--;
            console.log(response);
            _this.isBtnClick = false;
            if (response.responseObject && response.responseObject.responseData && response.responseObject.responseStatus) {
              let patientId = response.responseObject.responsePk;
              // 更新操作
              _this.setPatientId(patientId);
              if(_this.reportState){    // 无身份证的就诊人，进行更新操作
                if(_this.reportState==2){  // 若是未完成状态的更新就诊人操作，则跳转到当时就诊人的进度
                  // 获取进度
                  let  paramData={
                    reportId:_this.reportId
                  };
                  getReportList(paramData).then((res)=>{
                    console.log(res);
                    if(res.miniPath){
                      wx.redirectTo({
                        url: '/'+res.miniPath
                      });
                    }
                  });
                }else if(_this.reportState==1){ // 未开始的就诊人
                  wx.redirectTo({
                    url: '/packageD/reportNew/patientInfo' // 此patientId是编辑的就诊人。
                  });
                }
              }else{    // 新创建的就诊人 则跳转就诊方式
                wx.redirectTo({
                  url: '/packageD/reportNew/patientInfo'
                });
              }
            }else{  // 现在我遇到的错误信息是，创建时使用已有身份证号，会报错。

              _this.formValidState = false;
              if(response.responseObject.responseCode=="9X0001"){
                _this.errorInfo = "该身份证号码已添加就诊人";
                _this.errorTip= "card";
              }else{
                _this.errorInfo = response.responseObject.responseMessage;
                _this.errorTip= "card";
              }

              _this.tipShow = true;
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .main{
    background: #F2F4F7;
    min-height: 100%;
  }
  .error-tip{
    background: #FFF4F3;
    height: 82px;
    padding:0 0 0 66px;
    line-height: 82px;
    color: #FC746A;
    font-size:30px;
    .close-btn{
      float: right;
      margin-right: 44px;
      margin-top: 18px;
      width:48px;
      height:48px;
      background: url("https://m.allinmed.cn/static/image/mp/index/1.2.0/btn_close@2x.png") no-repeat center;
      background-size:50%;
    }
  }
  .head{
    font-size:26px;
    color: #000;
    text-align: left;
    line-height: 50px;
    padding:10px 66px 10px 66px;
    .smile{
      width: 26px;
      height: 22px;
      margin-right: 3px;
      margin-bottom:6px;
      vertical-align: middle;
    }
    span{
      color: #FC746A;
    }
  }

  .form-box{
    background: #ffffff;
    .center {
      margin: 0 66px;
      .form-item {
        height: 114px;
        line-height: 114px;
        clear: both;
        display: flex;
        &.row-1{
          border-bottom:1px solid #D8D8D8;
        }
        .item-name {
          width: 196px;
          text-align: left;
          color: #666666;
          font-size: 34px;
          &.error-tip-color{
            color: #FC746A;
          }
        }
        .form-input {
          float: left;
          width: 428px;
          input {
            height: 114px;
            line-height: 114px;
            font-size: 34px;
          }
        }
      }
    }
  }
  .require {
    /* placeholder颜色  */
    color: #FC746A;
  }
  .next-box {
    margin-top: 476px;
    .next-btn {
      width: 520px;
      height: 96px;
      line-height: 96px;
      text-align: center;
      background: #00B9AD;
      color: #ffffff;
      border-radius: 8px;
      margin: 0 auto;
    }
  }
  .id-tips{
    height: 56px;
    line-height: 56px;
    padding: 0 66px;
    color: #AAAAAA;
    font-size:26px;
  }
  .address{
    background: #ffffff;
    height: 114px;
    line-height: 114px;
  }
</style>
