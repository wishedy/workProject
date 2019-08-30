<template>
    <section class="al-elite-memberItem" v-if="!isEmptyObject(config)">
        <figure class="al-doctor-logo" :style="{background: 'url('+checkLogo(config.logoUrl)+') no-repeat center center',backgroundSize:'cover'}" @click.stop="openPersonal({
        cid:config.customerId
        })" @mousedown.stop="trackAction({
        browseName:'组织成员',
                            actionName:'查看成员',
                            keyWord:'菁英会',
                            actionId:'11675',
                            refId:config.customerId
        })"></figure>
        <div class="al-doctor-info">
            <div class="doctorName">
                <span class="name" v-text="config.organizationMemberName" @click.stop="openPersonal({
        cid:config.customerId
        })"></span>
                <i class="icon" :class="{'v1':(config.authState===2||config.authState===7||config.authState===9),'v2':(config.authState===8)}" v-if="(config.authState==2)||(config.authState==7)||(config.authState==9)||(config.authState==8)"></i>
                <span class="jobTitle" v-text="config.organizationMemberMedicalTitleShow"></span>
            </div>
            <div class="doctorCompany" v-text="config.organizationMemberCompany" v-if="!checkInvalid(config.organizationMemberCompany)">
            </div>
        </div>
        <div class="flowed" v-if="(relationship==2)&&((checkCustomerId(config.customerId)))"><i></i></div>
        <div class="flow" v-if="((relationship==1||relationship==3)&&((checkCustomerId(config.customerId))))"  @click.stop="follow(config)"><i></i><span>关注</span></div>
        <div class="crossFlow" v-if="((relationship==4)&&(checkCustomerId(config.customerId)))"><i></i><span>相互关注</span></div>
    </section>
</template>
<script>
    import EliteSdk from '../untils/eliteCommSdk';
    const xhrUrl = {
        followed:EliteSdk.followed
    };
    import commPopup from 'static/js/commPopup.js';
    import axios from 'axios';
    import comm from 'static/js/comm.js';
    import user from 'static/js/module.user.js';
    export default {
        props:{
          config:{
              default(){
                  return {};
              }
          }
        },
        data(){
          return {
              relationship:-1
          }
        },
        watch:{
            config:{
                handler(n){
                    let _this = this;
                    _this.relationship = n.relationship;
                },
                deep:true
            }
        },
        mounted(){
          let _this = this;
          _this.relationship = _this.config.relationship;
        },
        methods:{
            checkCustomerId(id){
                let _this = this;
                let checkId = id+'';
              if(_this.checkInvalid(checkId)){
                  return false;
              }else{
                  if(!isNaN(parseInt(checkId,10))){
                      if(parseInt(checkId,10)===0){
                          return false;
                      }else{
                          return true;
                      }
                  }else{
                      return false;
                  }
              }
            },
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            openPersonal(config){
                EliteSdk.openPersonal({
                    cid:config.cid
                });
            },
            checkInvalid(val){
              return comm.checkInvalid(val);
            },
            checkLogo(logoUrl){
                let _this = this;
                return _this.checkInvalid(logoUrl)?'//img00.allinmd.cn/default-user/new_default.jpg':logoUrl;
            },
            trackAction(config){
                console.log(JSON.stringify(config));
              EliteSdk.trackAction(config);
            },
            follow(item){
                let t = this;
                let id = item.customerId;
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true,
                    callback: function () {
                        t.ajaxing = true;
                        axios({
                            url:xhrUrl.followed,
                            method:"POST",
                            data:{
                                "dataFlag":2,
                                "refId":id
                            },
                            transformRequest: [data=>{
                                return "paramJson=" + JSON.stringify(data);
                            }],
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            timeout: 30000
                        }).then(res=>{

                            if(res.data.responseObject.responseStatus == true){
                                t.relationship = parseInt(res.data.responseObject.responseData.data_list[0].relationship,10);
                                comm.creatEvent({
                                    browType:364,
                                    triggerType: '组织-成员',
                                    triggerName: "关注组织粉丝",
                                    actionId: 11482,
                                    refId: id,
                                    refType: "组织"
                                });
                            }else {
                                commPopup.popup(res.data.responseObject.responseMessage)
                            }
                        })
                    }
                });
            },
        }
    }
</script>
