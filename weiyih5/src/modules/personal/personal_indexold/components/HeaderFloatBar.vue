<template>
    <!-- 滚动距离时——顶部信息 -->
    <header class="al-personalScrollHead al-personalHeadFixed" style="display: block">
        <h2>
            <span class="ev-name">{{name}}</span>
            <span class="al-personalShare icon-shareDeepBlue" v-show="hasAuth&&hasShare&&hasLogin">分享</span>
        </h2>
    </header>
</template>
<script type="text/ecmascript-6">
  import comm from 'static/js/comm.js';
  import TempCache from 'static/js/tempcache.js';
  import {mapActions,mapGetters} from  "vuex";

  export default{
    data(){
        return {
          name:'',
          hasAuth:false,
          hasShare:true,
          hasLogin:false,
          cId:TempCache.getItem('userId')
        }
    },
    computed:{
      ...mapGetters(["customerInfo"]),
    },
    methods:{
      getInit(){
        let t=this;
        let responseData={};
        if(TempCache.getItem('customerRole')==2||TempCache.getItem('customerRole')==3||TempCache.getItem('customerRole')==4){
          t.hasShare = false;
        }
        responseData=t.customerInfo;
        if(comm.isEmptyObject(responseData)){
          return;
        }
        let auth=responseData.customer_auth;
        let unit=responseData.customer_unite;
        if(auth.state!==2 && auth.state!=7 && auth.state!=8&& auth.state!=9){//未认证auth.state!==1 &&
          t.hasAuth=false;
          t.name = auth.lastName+auth.firstName;
          if(t.name ==="") t.name = comm.getRegisterName(unit.email,unit.mobile);
        }else {
          t.hasAuth=true;
          t.name=auth.lastName+auth.firstName;
        }
      },
    },
    mounted(){
      if(this.cId){
        this.hasLogin=true;
      }
      if(this.hasLogin){
        this.getInit();
      }
    },
    watch:{
      "$store.state.customerInfo"(){
        this.getInit();
      }
    }
  }
</script>