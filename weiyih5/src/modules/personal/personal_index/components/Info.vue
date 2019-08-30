<template>
    <section :class="{'headerInfoContaner':isHeader}">
        <!-- 头部信息 -->
        <header class="al-indexHeader infoFixedHeader">
            <figure class="al-indexHeaderItem">
                <a class="ev_backBtn" href="javascript:history.back(-1);">
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1 class="ev_backBtn myInfo" style="display: block">我的资料</h1>
            </figure>
            <figure class="al-indexHeaderItem ev-checkRule">

            </figure>
        </header>
        <section class="eventInfo baseEvent" v-if="eventList.length">
            <section class="eventTitle">
                <h2 class="infoBig">大事件</h2>
            </section>
            <ul class="eventContent">
                <li v-for="(item,index) in eventList" class="itemDetail" :class="item.event_type==1?'systemEvent':'userEvent'"><span class="itemDesc">{{item.event_name}}</span></li>
            </ul>
        </section>
        <!--认证信息-->
        <section class="authMsg" v-show="login">
            <aside class="title" v-show="hasAuth|review|firmHasAuth" data-alcode-mod="678">
                <span class="authTitle">认证信息</span>
                <p class="change" v-show="hasAuth&&!applyState" @click="goChangeAuth">
                    <a class='ev_reAuthTrack' href="javascript:;">申请变更</a>
                </p>
                <p class="changing" v-show="review|applyState">
                    审核中...
                </p>
            </aside>
            <!--未认证提示-->
            <aside class="authNone" v-show="noAuth">
                <img src="//img50.allinmd.cn/authentication/authNone.png">
            </aside>
            <!--未认证提示 end-->

            <!--重新认证提示-->
            <aside class="againAuth ev-againAuth" v-show="refuse">
                <img src="//img50.allinmd.cn/authentication/again.png">
            </aside>
            <aside class="againAuth ev-authProcessing" v-show="reAuth">
                <img style="width: auto;" src="//img50.allinmd.cn/authentication/authProcessing.png">
            </aside>
            <!--重新认证提示 end-->
            <!--已认证-->
            <aside class="authCont" v-show="hasAuth|review|firmHasAuth">
                <p class="authedMsg info" v-html="infoHtml"></p>
                <p class="authedMsg company">{{company}}</p>
                <p class="authedMsg medicalTitle">{{medicalTitle}}</p>
                <ul class="tagList">
                    <li v-for="(item,i) in areasExpertise" v-if="item && item.split('_')[1]">{{item.split("_")[1]}}</li>
                </ul>
            </aside>
            <aside class="certificatesMsg" data-alcode-mod="679" v-show="hasAuth|review|firmHasAuth|!firm">
                <a href="/pages/passport/auth/authInfo.html" style="display: inline-block;width:100%;" @click="commCreatEvent({id:11426,browType:354})">
                    <span>证件信息</span>
                    <p class="arrow"></p> </a>
            </aside>
            <!--已认证 end-->
        </section>
        <!--认证信息 END-->


        <!--其他个人信息-->
        <section v-show="hasAuth|refuse|noAuth|reAuth|review|firmHasAuth" data-alcode-mod="538">
            <other-msg></other-msg>
        </section>

        <!--其他个人信息 end-->


        <!-- 主内容区域 根据导航栏激活条目显示 -->
        <section class="al-noLoginTips ev-noLogin" v-show="!login">
            <figure>
                <img src="./../assets/no_login.png" alt="">
            </figure>
        </section>

    </section>
</template>

<script type="text/ecmascript-6">
  import comm from "static/js/comm";
  import TempCache from 'static/js/tempcache';
  import otherMsg from './otherMsg';
  import {mapGetters,mapActions} from "vuex";
  const path={
      reviseAuth:"/mcall/customer/revise/auth/getMapList/"
  };
  export default{
    data(){
      return {
        login:false,
        state:-1,//认证状态
        infoHtml:"",
        company:"",
        medicalTitle:"",
        areasExpertise:[],
        firm:false,//厂商用户
        hasAuth:false,//已认证
        refuse:false,//以拒绝
        noAuth:false,//未认证
        reAuth:false,//二次认证
        review:false,//审核中
        firmHasAuth:false,//厂商认证
        applyState:false,//申请状态
        cId:TempCache.getItem('userId')
      }
    },
      components:{
          otherMsg
      },
    computed:{
      ...mapGetters(['customerInfo','eventList','isHeader']),
    },
    methods:{
        ...mapActions(['getEvent','changeAjax',"commCreatEvent"]),
      getBase(){
        let responseData = this.customerInfo;
        if(comm.isEmptyObject(responseData)){
          return false;
        }
        let baseInfo=responseData.customer_baseinfo;
        let auth=responseData.customer_auth;
        this.state = auth.state;

        let name="";
        if(auth.lastName){
          name=comm.getStrLen((auth.lastName+auth.firstName),12)+" ";
        }
        let sex="";
        if (baseInfo.sexId == "1") {
          sex="男 ";
        }
        if (baseInfo.sexId == "2") {
          sex="女 ";
        }
        let birth="";
        let birthday=auth.birthYear||baseInfo.birthday;
        if(birthday&&!comm.isEmptyObject(birthday)){
          birth=birthday.substring(0,4)+"-"+birthday.substring(5,7)+"-"+birthday.substring(8,10);
        }
        this.infoHtml='<span>'+name+'</span><span>'+sex+'</span><span>'+birth+'</span>';

        //2.这是医生单位
        let company = "";
        if(auth.company){
          company = auth.company;
        }else if(auth.schoolName){
          company = auth.schoolName
        }
        this.company=company;
        //3.这是获取医生职称
        let medicalTitle = "";
        if(auth.medicalTitle){
          medicalTitle = comm.cutLine(auth.medicalTitle, "_", "、");
        }
        this.medicalTitle=medicalTitle;

        //4.这是显示标签，截取
        let area = auth.areasExpertise;
        this.areasExpertise = area.split(",");

        //5.这是判断用户是否认证，或者是二次认证显示或者隐藏对应模块！
        let _role = TempCache.getItem('customerRole');
        if(_role!=2&&_role!=3&&_role!=4&&_role!=13) {//非厂商用户 增加医助角色
          switch (parseInt(auth.state)) {
            case 2:  //已认证
            case 8:
            case 9:
              this.hasAuth = true;
              break;
            case 3://拒绝
              this.refuse = true;
              break;
            case -1: //未认证
              this.noAuth = true;
              break;
            case 0:   //二次认证
            case 1:
              this.reAuth = true;
              break;
            case 7:   //审核中
              this.review = true;
              break;
          }
        }else{
          switch (parseInt(auth.state)){
            case 2:
            case 9:
            case 8:
            case 7:
              this.firmHasAuth = true;
              break;
            case 3://拒绝
            case -1:
              /*$('.ev-name').hide();*/
              break;
            // case 1:break;
          }
          this.firm=true;
        }
      },
      //申请认证变更
      goChangeAuth(){
            this.commCreatEvent({id:11425,browType:354});
        if(this.state==8){
          comm.changeTipsV2({
            title: "认证审核需要1-3个工作日，<br/>在此期间您无法在线执业，是否继续变更？",
            ensure: '立即变更',
            ensureCallback:function(){
                //g_sps.jump(null,"/pages/passport/auth/auth.html?reAuth=reAuth");
                if(comm.isApp()){
                    comm.callAppAuth();
                }else{
                    if(g_sps){
                        g_sps.jump(null,"/pages/passport/auth/auth.html?reAuth=reAuth");
                    }else{
                        window.location.href = "/pages/passport/auth/auth.html?reAuth=reAuth";
                    }

                }
            },
            cancelCallback:function(){

            }
          });
        }else{
            //g_sps.jump(null,"/pages/passport/auth/auth.html?reAuth=reAuth");
            if(comm.isApp()){
                comm.callAppAuth();
            }else{
                if(g_sps){
                    g_sps.jump(null,"/pages/passport/auth/auth.html?reAuth=reAuth");
                }else{
                    window.location.href = "/pages/passport/auth/auth.html?reAuth=reAuth";
                }

            }
        }
      },
      //获取审核状态
      getAuthProcess:function(){
        let t=this;
          t.changeAjax(true);
        comm.ajax2({
          url:path.reviseAuth,
          type:"post",
          data:{paramJson:JSON.stringify({customerId:t.cId})},
          success:function(res){
              t.changeAjax(false);
            if(res&&res.responseObject&&res.responseObject.responseData&&!comm.isEmptyObject(res.responseObject.responseData)){
              t.applyState = true;
            }
          }
        })
      }
    },
    mounted(){
      if(this.cId){
        this.login=true;
      }
      this.getAuthProcess();
      this.getBase();
      this.getEvent({paramJson:JSON.stringify({customerId:this.cId})});
    },
    beforeMount(){
      if(!localStorage.getItem('userId')){
          this.$router.push({
              path:'Index'
          })
      }
    },
    watch:{
      "$store.state.customerInfo"() {
        this.getBase();
      }
    }
  }
</script>
<style lang="scss">
    @import 'scss/pages/authentication/personalNew';
</style>
