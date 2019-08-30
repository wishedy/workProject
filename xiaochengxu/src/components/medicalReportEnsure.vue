<template>
  <div class="mre_main">
    <figure class="mre_content" :class="{fixationH:foldMoreText == '展开'}">
      <figcaption><span class="mre_patientName">{{medicalParams.medicalShow.patientName}}</span><span>{{medicalParams.medicalShow.sex == 1?"男":"女"}}</span><span>{{medicalParams.medicalShow.age}}岁</span></figcaption>
      <ul class="mre_infroLists">
        <li><span class="mre_infroItemLeft">服务医生</span><p class="mre_infroItemRight">{{doctorInfo}}</p></li>
        <li><span class="mre_infroItemLeft">病情描述</span><p class="mre_infroItemRight">{{illnessDescribe}}</p></li>
        <li v-if="medicalParams.medicalShow.treatment"><span class="mre_infroItemLeft">治疗情况</span><p class="mre_infroItemRight">{{cureCondition}}</p></li>
        <li v-if="medicalParams.medicalShow.illness"><span class="mre_infroItemLeft">病情补充</span><p class="mre_infroItemRight">{{medicalParams.medicalShow.illness}}</p></li>
        <li><span class="mre_infroItemLeft">寻求帮助</span><p class="mre_infroItemRight">{{medicalParams.medicalShow.docHelp}}</p></li>
        <!--<li class="mre_cutLine"></li>-->
        <li v-if="medicalParams.medicalShow.imageList.length > 0">
          <span class="mre_infroItemLeft">图片资料</span><p class="mre_infroItemRight">{{medicalParams.medicalShow.imageList.length}}张</p>
          <section class="mre_imgLists">
            <div class="mre_imgItem" v-for="(item,index) in imageListThree" :key="index">
              <img :src="item||item.blob" alt="" @click="showBigImg(item)">
              <div class="mre_imgMore" v-if="index == 2&&medicalParams.medicalShow.imageList.length>3" @click="showBigImg(item)">查看全部</div>
            </div>
          </section>
        </li>
      </ul>
    </figure>
    <section class="foldOrMore" v-show="foldOrMoreShow" @click="changeText">{{foldMoreText}}</section>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data(){
      return {
        imageListThree:[],
        illnessDescribe:"",
        cureCondition:"",
        foldMoreText:"",
        foldOrMoreShow:false
      }
    },
    onLoad(){
      this.imageListThree = [];
      this.illnessDescribe = "";
      this.cureCondition = "";
      this.groupData();
      if(this.medicalParams.medicalShow.imageList && this.medicalParams.medicalShow.imageList.length >3){
        this.medicalParams.medicalShow.imageList.forEach((element,index)=>{
          if(index < 3){
            this.imageListThree.push(element);
          }
        })
      }else{
        this.imageListThree = this.medicalParams.medicalShow.imageList;
      }
      setTimeout(()=>{
        let that =this;
        let query = wx.createSelectorQuery();
        query.select('.mre_content').boundingClientRect();
        query.exec(function(res){
          if(res[0].height > 300){
            that.foldOrMoreShow = true;
            that.foldMoreText = "展开";
          }
        })
      },500);
    },
    methods:{
      showBigImg(obj){
        let bigImgLists = [];
        this.medicalParams.medicalShow.imageList.forEach((element)=>{
          bigImgLists.push(element||element.blob);
        });
        wx.previewImage({
          current: obj.blob,
          urls: bigImgLists
        })
      },
      groupData(){
        let mainSymptom = this.medicalParams.medicalShow.mainSymptom;
        if(mainSymptom.includes("VAS评分")){
          this.illnessDescribe = `${this.medicalParams.medicalShow.partName}${mainSymptom.split("VAS评分")[0]},持续${this.medicalParams.medicalShow.continueTime},疼痛等级${mainSymptom.split("VAS评分")[1].split("分")[0]}分`;
        }else{
          this.illnessDescribe = `${this.medicalParams.medicalShow.partName}${mainSymptom},持续${this.medicalParams.medicalShow.continueTime}`;
        }

        let treatment = this.medicalParams.medicalShow.treatment;
        console.log(this.medicalParams.medicalShow.treatment);
        if(treatment.includes(",")){
          treatment.split(",").forEach((element)=>{
            if(element.includes("-")){
              this.cureCondition += `${element.split("-")[0]}(${element.split("-")[1]})，`;
            }else{
              if(element.includes("手术、")){
                this.cureCondition += `${element.split("、")[0]}(${element.split("、")[1]})，`
              }else{
                this.cureCondition += `${element}，`
              }
            }
          });
          this.cureCondition = this.cureCondition.substring(0,this.cureCondition.length-1);
        }else{
          if(treatment.includes("-")){
            this.cureCondition = `${treatment.split("-")[0]}(${treatment.split("-")[1]})`;
          }else{
            if(treatment.includes("手术、")){
              this.cureCondition = `${treatment.split("、")[0]}(${treatment.split("、")[1]})`
            }else{
              this.cureCondition = treatment;
            }
          }
        }
      },
      changeText(){
        this.foldMoreText == "展开"?this.foldMoreText="收起":this.foldMoreText="展开";
      }
    },
    props:{
      medicalParams:{
        type:Object,
//        default:()=>{
//          return {
//            medicalShow:{
//              patientName:"嘤嘤嘤",
//              sex:1,
//              age:26,
//              doctorInfo:"王岩，主任医师，中国人民解放军总医院",
//              mainSymptom:"腰部疼痛，持续3周，疼痛等级2分",
//              treatment:"我不想看病啊",
//              illness:"我不想看病啊",
//              docHelp:"我不想看病啊",
//              imageList:[{
//                blob:"https://m.allinmed.cn/static/image/img00/index/quick-consultation@2x.png"
//              },{
//                blob:"https://m.allinmed.cn/static/image/img00/index/doctor-consultation@2x.png"
//              },{
//                blob:"https://m.allinmed.cn/static/image/img00/index/doctor-consultation@2x.png"
//              },{
//                blob:"https://m.allinmed.cn/static/image/img00/index/doctor-consultation@2x.png"
//              }]
//            }
//          }
//        }
      },
      doctorInfo:{
        type:String
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .mre_main{
    background:#ffffff;
    box-shadow: 0 8px 20px 0 rgba(37,56,77,0.04);
    border-radius: 8px;
    .mre_content{
      background:url("https://m.allinmed.cn/static/image/mp/commonImage/bg_medicalShow.png") no-repeat bottom left;
      background-size: 100% 18px;
      &.fixationH{
        overflow: hidden;
        height:600px;
      }
    }
    .foldOrMore{
      width:100%;
      padding-bottom:40px;
      font-size: 32px;
      color: #2EA9FE;
      text-align:center;
    }
    figcaption{
      padding:48px 30px 36px;
      font-size: 40px;
      color: #000000;
      span{
        margin-right:28px;
      }
      .mre_patientName{
        font-weight: bold;
      }
    }
    .mre_infroLists{
      padding:0 30px;
      border-top:1px solid #E8E8E8;
      li{
        margin-top:48px;
        @include clearfix();
        &.mre_cutLine{
          width:650px;
          height:1px;
          background: #E8E8E8;
          margin-top:48px;
        }
        .mre_infroItemLeft{
          float:left;
          width:160px;
          font-size: 34px;
          color: #666666;
        }
        .mre_infroItemRight{
          overflow: hidden;
          font-size: 36px;
          line-height:52px;
          color: #222222;
        }
        .mre_imgLists{
          padding:48px 0;
          .mre_imgItem{
            position: relative;
            display: inline-block;
            width:180px;
            height:180px;
            margin-right:20px;
            .mre_imgMore{
              position: absolute;
              left:0;
              top:0;
              width:100%;
              height:100%;
              line-height:180px;
              background:rgba(0,0,0,0.5);
              font-size: 30px;
              color: #FFFFFF;
              text-align: center;
            }
            img{
              display: block;
              width:100%;
              height:100%;
            }
          }
        }
      }
    }
  }
</style>
