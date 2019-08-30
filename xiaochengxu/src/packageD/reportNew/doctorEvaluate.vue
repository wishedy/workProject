<!--医生评价-->
<template>
  <div class="main">
    <div class="head">
      <div class="annoy" @click="annoyChange">
        <img :src="annoySrc" alt="" >匿名
      </div>
      <div class="comment-head" :class="{'service-red':serviceRed}">
        请对{{doctorName}}医生进行评价
      </div>
    </div>
    <div class="tip">点击星星评分</div>
    <section class="stars-con">
      <section class="patient-comment-stars">
        <figure class="patient-comment-stars-item" :class="{'active':item.selected,'first':index==0,'last':index==4}"
                v-for="(item,index) in triageStars" @click="selectStar(item,index,'triageStars')" :key="index"></figure>
      </section>
      <div class="star-title">{{triageStarsIndex>=0?'“' + triageStars[triageStarsIndex].title + '”':""}}</div>
    </section>
    <!--各星级标签--> <!--v-if="isSelectedStar"-->
    <section class="patient-comment-tag-list" v-if="isSelectedStar">
      <form @submit="formSubmit" report-submit="true">
        <button class="patient-comment-tag-item" :class="{'active':item.selected}" :key="index" formType="submit"
                 v-for="(item,index) in currentTagList" @click="selectTag(item,index,'lessTagList')"
                 >
          {{item.tagName}}
        </button>
      </form>
    </section>
    <section :class="{'comment-text':true,'focus':isFocus}" v-if="isSelectedStar">
      <textarea class="service-text" name=""
                @focus="onCommentTextFocus"
                @input="contentLimit"
                v-model="commentText"
                maxlength="-1"
                cursor-spacing=20
                :placeholder="commentTextPlaceholder"
                :placeholder-style="requireClass"
                ></textarea>
      <div class="count-num">{{commentTextCount}}</div>
    </section>
    <section class="line"></section>
    <section class="service-star">
      <div class="comment-head" :class="{'share-red':shareRed}">
        您愿意将{{doctorName}}医生推荐给病友吗？
      </div>
      <div class="tip">点击星星评分</div>
    </section>
    <section class="stars-con">
      <section class="patient-comment-stars">
        <figure class="patient-comment-stars-item" :class="{'active':item.selected,'first':index==0,'last':index==4}"
                v-for="(item,index) in serviceStars" @click="selectStar(item,index,'serviceStars')" :key="index"></figure>
      </section>
      <div class="star-title">{{serviceStarsIndex>=0?'“' + serviceStars[serviceStarsIndex].title + '”':""}}</div>
    </section>
    <section class="next-box">
      <form action="" @submit="formSubmit" report-submit="true">
        <button @click="submit" class="next-btn" :class="{'active':isValid}" formType="submit">提交</button>
      </form>
    </section>
    <logo-loading v-if="loading"></logo-loading>
    <BlackList></BlackList>
  </div>
</template>
<script type="text/ecmascript-6">
  import api from "../../common/js/util/util";
  import logoLoading from 'components/LogoLoading';
  import dataLog from "common/js/dataLog/dataLog";
  import starTags from "../../common/js/doctorEvaluate/doctorEvaluateStarTags";
  import sendFormId from "../../common/js/HttpRequest/sendFormId";
  import getCommentInfo from "common/js/HttpRequest/getServiceCommentStatus";   // 获取评价内容
  import BlackList from "components/BlackList";
  const XHRList = {
    getDoctorDocs:  api.httpEnv() + '/mcall/customer/patient/relation/v1/create/',   // 获取医生文章
    getDoctorTip:   api.httpEnv() + '/mcall/cms/patienteducation/v1/getDoctorTip/', // 获取医生名称
    createComment:   api.httpEnv() + '/mcall/tocure/patient/score/create/',              // 提交评价内容
    updateComment: api.httpEnv()+'/mcall/tocure/patient/score/updateRecord/',   // 更新评价内容
  };

  export default {
    name: "doctorEvaluate",
    data() {
      return {
        loading:0,
        allTagsList:starTags,
        annoySrc:"https://m.allinmed.cn/static/image/mp/index/1.2.0/name_unselect.png",// 匿名radio 图片地址
        isAnonymous:false,  // 是否匿名
        doctorName:'',
        showingTags:[],         // 显示中的标签
        selectedTagIds:[],    // 选中的标签Id
        isFocus:false,             // 评价框是否被光标选中
        commentText:"",       // 评价内容
        commentTextPlaceholder:'写下其他想说的~',  // 默认提示
        isValid:false,          // 是否较验成功,可以提交  表单两项评分都点击过为较验合格
        recommendStar:5,       // 是否愿意推荐的评分
        patientId: null,              //患者ID
        doctorId: null,               //医生ID
        patientCustomerId:'',   //用户ID
        serviceStars: [],             //推荐星级标签
        serviceStarsIndex: -1,    //推荐星级
        triageStars: [],
        triageStarsIndex: -1,
        isSelectedStar:false,     // 是否已点击星星，选择后显示标签
        tagList:[],
        currentTagList:[],
        inputInterval:null,
        selectTagList: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: []
        },
        requireClass:"color:#999999",
        serviceRed:false,
        shareRed:false,
        isUpdate:false     // 是否需要更新
      }
    },
    onLoad(options){
      console.log(options);
      this.patientId=options.patientId;
      this.doctorId=options.doctorId;
      this.consultationId=options.consultationId;
      this.patientCustomerId = options.patientCustomerId;
      this.resetData();
      this.getCommentInfoData();  // 获取评价内容
      // if(options.isRequest&&options.isRequest==1){  // 如果有这个参数，就不用consultationId查
			//
      // }else{
      //   this.getCommentInfoData();  // 获取评价内容
      // }
      this.installDefaultStars();
      this.getDoctorName();
    },
    onShow(){
      dataLog.enterBrowse()
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    computed:{  // 评论字符数统计
      commentTextCount(){
        return 200-api.getByteLen(this.commentText)
      }
    },

    components:{
      logoLoading,
      BlackList
    },
    methods:{
      // 初始化数据，清空原来的
      resetData(){
        this.loading = 0;
        this.commentText = "";
        this.isAnonymous = false;
        this.annoySrc = "https://m.allinmed.cn/static/image/mp/index/1.2.0/name_unselect.png";
        this.serviceStarsIndex = -1;
        this.triageStarsIndex = -1;
        this.isFocus = false;
        this.tagList = [];
        this.currentTagList = [];
        this.selectedTagIds = [];
        this.isSelectedStar = false;
        this.requireClass = 'color:#999999';
        this.serviceRed=false;
        this.shareRed=false
      },
      // 根据consultationId 获取评价详情
      getCommentInfoData(){
        let _this = this;
        _this.loading++;
        getCommentInfo({
          consultationId:this.consultationId
        }).then(data => {
          _this.loading--;
          if (data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseStatus) {
            let _responseData = data.responseObject.responseData;
            let _responseMessage = data.responseObject.responseMessage;
            if(typeof _responseMessage=='string' && _responseMessage=="NO DATA"){ // 未评价过

            }else{
              // 0  待审核  1 已通过  2  已屏蔽
              if (_responseData&&_responseData.status!=2) {
                // 跳转到发布成功页面
                wx.redirectTo({
                  url:'/packageD/reportNew/doctorEvaluateEnd?consultationId=' + _this.consultationId
                })
              }else{
                _this.isUpdate = true;    //更新评价接口
              }
            }

            // 服务星级
            if (_responseData.serviceStar>0) {
              _this.triageStarsIndex = _responseData.serviceStar-1;  //星级
              _this.isSelectedStar = true;
              _this.commentText = _responseData.thoughts?_responseData.thoughts:'';  // 评价补充内容
              _this.triageStars.forEach((i,index)=>{
                if (index<=_this.triageStarsIndex) {
                  i.selected = true
                }
              })
            }
            // 推荐星级
            if (_responseData.recommendStar&&_responseData.recommendStar>0) {
              _this.serviceStarsIndex= _responseData.recommendStar-1;
              _this.serviceStars.forEach((i,index)=>{
                if (index<=_this.serviceStarsIndex) {
                  i.selected = true
                }
              })
            }
            // 标签
            if (_responseData.tagList&&_responseData.tagList.length>0) {
              _this.currentTagList = [];
              this.allTagsList[_responseData.serviceStar-1].forEach(function(item,i){
                let _select = false;
                _responseData.tagList.forEach((items,index)=>{
                  if (items.tagId==item[0]) {
                    _select = true;
                  }
                })
                if (_select) {
                  _this.currentTagList.push({id:item[0],tagName:item[1],selected:true});
                } else {
                  _this.currentTagList.push({id:item[0],tagName:item[1],selected:false});
                }
              });
            }
            _this.$forceUpdate();
          }
        }).catch(err => {
          console.log(err)
          _this.loading--;
        })
      },
      installTagList() {
          const dataList = this.allTagsList;
          this.tagList = [];
          dataList.forEach((element, index) => {
            element.selected = false;
            this.tagList.push(element);
          });
      },
      // 推荐医生星星点击
      onRecommendStarClick(){
        let star = 5;
        this.showingTags = this.allTagsList[star-1];
      },
      // 评价文本框获焦时
      onCommentTextFocus(){
        this.isFocus = true;
      },
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      selectTag(item, index, list) {
        const _this = this;
        _this.currentTagList[index].selected = !_this.currentTagList[index].selected;
        dataLog.createTrack({
          actionId: 14219,
          browseType:143,
          keyword:item.tagName,
          locationId:index
        });
        function _installTagId(type) {
          _this.selectTagList[type] = [];
          _this.currentTagList.forEach((element, index) => {
            if (element.selected) {
              _this.selectTagList[type].push(element.id);
            }
          });
        }
        _installTagId(_this.triageStarsIndex + 1);
        _this.$forceUpdate();
      },
      installDefaultStars() {
        this.serviceStars = [];
        this.triageStars = [];
        for (let i = 0; i < 5; i++) {
          let title = this.starsTitleInit(i);
          this.serviceStars.push({
            selected: false,
            level: 0,
            title: title.serviceStarsTitle
          });
          this.triageStars.push({
            selected: false,
            level: 0,
            title: title.triageStarsTitle
          });
        }
      },
      // 匿名状态点击
      annoyChange(){
        this.isAnonymous = !this.isAnonymous;
        if(this.isAnonymous){
          this.annoySrc = "https://m.allinmed.cn/static/image/mp/index/1.2.0/name_select.png";
        }else{
          this.annoySrc = "https://m.allinmed.cn/static/image/mp/index/1.2.0/name_unselect.png";
        }
      },
      getDoctorName(){
        let _this=this;
        _this.loading++;
        api.ajax({
          url:XHRList.getDoctorTip,
          method: 'post',
          data: {
            doctorId:_this.doctorId,
            logoUseFlag:5
          },
          timeout: 30000,
          done(response) {
            _this.loading--;
            if (response.responseObject && response.responseObject.responseData) {
              const dataList = response.responseObject.responseData.dataList[0];
              _this.doctorName = dataList.doctorName;
              wx.setNavigationBarTitle({
                title: `${_this.doctorName}医生评价`
              });
            }
          }
        })
      },
      contentLimit() {
        let _this=this;
        _this.requireClass = 'color:#999999';
        if (_this.commentText&&api.getByteLen(_this.commentText) >= 200){
          _this.commentText=api.getStrByteLen(_this.commentText,200);
        }
      },
      selectStar(item, index, list) {
        let _this = this;
        this[list + "Index"] = index;
        if(list==='triageStars'){
          this.isSelectedStar = true;
          this.currentTagList = [];
          this.allTagsList[index].forEach(function(item,i){
            _this.currentTagList.push({id:item[0],tagName:item[1],selected:false});
          });
          if(index<=2){
            this.commentTextPlaceholder = '请指出不足之处';
          }else{
            this.commentTextPlaceholder = '写下其他想说的~';
          }
        }

        this[list].forEach((e, i) => {
          if (i <= index) {
            e.selected = true;
          } else {
            e.selected = false;
          }
        });

        if(this.serviceStarsIndex>-1 && this.triageStarsIndex>-1){
          this.isValid = true;
        }
      },
      starsTitleInit(index) {
        let result = {
          serviceStarsTitle: "",
          triageStarsTitle: ""
        };
        switch (index) {
          case 0:
            result.serviceStarsTitle = "非常不愿意";
            result.triageStarsTitle = "非常不满意";
            break;
          case 1:
            result.serviceStarsTitle = "不愿意";
            result.triageStarsTitle = "不满意";
            break;
          case 2:
            result.serviceStarsTitle = "看情况";
            result.triageStarsTitle = "一般";
            break;
          case 3:
            result.serviceStarsTitle = "愿意";
            result.triageStarsTitle = "满意";
            break;
          case 4:
            result.serviceStarsTitle = "非常愿意";
            result.triageStarsTitle = "非常满意";
            break;
        }
        return result;
      },
      // 提交评价
      submit(){
        let _this = this;
        let NoTagSelect = true;
        _this.currentTagList.forEach(element => {
          if(element.selected){
            NoTagSelect = false;
          }
        });
        // 未选择星级第一题
        if (_this.triageStarsIndex==-1) {
          _this.serviceRed = true
        }else{
          _this.serviceRed = false
        }
        // 未选择星级第二题
        if (_this.serviceStarsIndex==-1) {
          _this.shareRed = true
        }else{
          _this.shareRed = false
        }
        if(!this.isValid){  // 表单尚未较验成功
          return false
        }else if (NoTagSelect&&_this.commentText.length==0&&_this.triageStarsIndex<3) {
          _this.requireClass = 'color:#FF0000';
          return false
        }
        let tagIds = [];
        tagIds = _this.selectTagList[_this.triageStarsIndex+1];
        let param = {
          patientId:_this.patientId,                    // todo:从前面传过来
          patientCustomerId:_this.patientCustomerId,
          doctorId:_this.doctorId,
          tagIds:tagIds.join(","),
          serviceStar:_this.triageStarsIndex+1,
          thoughts:_this.commentText,
          recommendStar:_this.serviceStarsIndex+1,
          isSecret:_this.isAnonymous?1:0,                                         //是否匿名 1-是 0-否
          consultationId:_this.consultationId
        };
        _this.loading++;
        dataLog.createTrack({   // 点击提交
          browseType:143,
          actionId: 14220,
          pushMessageId:JSON.stringify({consultationId:_this.consultationId})
        });

        api.ajax({
          url:_this.isUpdate?XHRList.updateComment:XHRList.createComment,
          method: 'post',
          data: param,
          timeout: 30000,
          done(response) {
            _this.loading--;
            // console.log(response);
            if (response.responseObject && response.responseObject.responseData) {
              _this.consultationId = response.responseObject.responseData.consultationId;
              // 跳转到发布成功页面
              wx.redirectTo({
                url:'/packageD/reportNew/doctorEvaluateEnd?consultationId=' + _this.consultationId
              })
            }
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .main{
    margin: 0 24px 0 24px;
  }
  .head{
    text-align: left;
    position:relative;
    span{
      position:absolute;
      top:0;
      right:50px;

    }
    .annoy{
      float: right;
      position: relative;
      padding-left: 48px;
      margin-top: 9px;
      img{
        width:38px;
        height: 38px;
        position: absolute;
        top: 50%;
        margin-top: -19px;
        left: 0;
      }
    }
  }


  .stars-con{
    @include clearfix();
    .patient-comment-stars {
      text-align: left;
      float: left;
      font-size: 0;
      margin-top: 40px;
      margin-bottom:40px;
      // clear:both;
      /*padding-bottom: 44px;*/
      .patient-comment-stars-item {
        background: url("https://m.allinmed.cn/static/image/mp/index/1.2.0/star_unselect.png") no-repeat center center;
        width: 76px;
        height: 76px;
        background-size: contain;
        display: inline-block;
        vertical-align: middle;
        margin: 0 8px;
        transition: all 0.2s linear;
        &.first{
          margin-left:0;
        }
        &.last{
          margin-right:0;
        }
        &.active {
          background: url("http://m.allinmed.cn/static/image/mp/index/1.2.0/star_select.png") no-repeat center center;
          background-size: contain;
        }

      }
      & > h3 {
        margin-top: 26px;
        margin-bottom: 28px;
        font-size: 28px;
        color: #aaaaaa;
        position: relative;
        display: inline-block;
        font-weight: normal;
        &:before, &:after {
          content: '' !important;
          width: 36px;
          height: 1px;
          background-color: #f2f2f2;
          position: absolute;
          top: 50%;
          margin-top: -0.5px;
        }
        &:before {
          left: -52px;
        }
        &:after {
          right: -52px;
        }
      }
    }
    .star-title{
      float:left;
      font-size:30px;
      width: 230px;
      color: #FFAF00;
      margin-top: 40px;
      margin-bottom:40px;
      line-height: 72px;
      text-align: center;
    }
  }



  .service-star{
    clear:both;
  }


  .patient-comment-tag-list {
    // margin-top: 48px;
    text-align: center;
    box-sizing: border-box;
    // clear:both;
    @include clearfix();
    .patient-comment-tag-plus {
      border-radius: 8px;
      background: #FFFFFF;
      border: 0.5px solid #aaaaaa;
      box-sizing: border-box;
      width: 68px;
      height: 68px;
      line-height: 68px;
      color: #808080;
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
      margin-bottom: 24px;
      &:before {
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
      & > img {
        width: 28px;
        height: 28px;
        vertical-align: middle;
      }
    }
    .patient-comment-tag-item {
      border-radius: 8px;
      background: #F2F5F5;
      border: none;
      box-sizing: border-box;
      padding: 0 24px;
      height: 58px;
      line-height: 58px;
      font-size: 30px;
      color: #666666;
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
      margin-bottom: 24px;
      float:left;
      &.active {
        font-weight: bold;
        background: #00B9AD;
        color: #FFFFFF;
      }
    }
  }

  .comment-text{
    clear:both;
    height: 90px;
    border-radius:6px;
    border:1px solid rgba(153,153,153,1);
    position:relative;
    padding:26px 20px;
    margin-top: 32px;
    .service-text{
      font-size:34px;
      color: #222222;
      width: 100%;
      &.need-tips{
        color: #FF0000
      }
    }
    &.focus{
      height:300px;
    }
    .count-num{
      position:absolute;
      bottom:10px;
      right:20px;
      color: #999999;
      font-size:26px;
    }
  }

  .line{
    height: 1px;
    width: auto;
    background: #D7D9DB;
    margin-top: 50px;
    margin-bottom: 68px;
    clear:both;
  }


  .comment-head{
    font-size:40px;
    margin-top: 38px;
    font-weight:bold;
    &.service-red{
      color: #FF0000
    }
    &.share-red{
      color: #FF0000
    }
  }
  .tip{
    font-size:28px;
    color: #999999;
    margin-top: 17px;
  }
  .submit{

    button{
      width: 560px;
      height: 96px;
      line-height: 96px;
      margin-top: 296px;
      margin-bottom: 92px;
    }
  }

  .next-box {
    margin-top: 40px;
    padding-bottom: 92px;
    .next-btn {
      width: 520px;
      height: 96px;
      line-height: 96px;
      text-align: center;
      background:rgba(204,204,204,1);
      color: #ffffff;
      border-radius: 8px;
      margin: 0 auto;
      &.active{
        background:rgba(0,185,173,1);
      }
    }
  }
</style>
