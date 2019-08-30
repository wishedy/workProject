<template>
    <div class="alEmr-mainInner">
        <NavSideBar :sideSetting="{index:3}" :pointerOnOff="pointerOnOff"></NavSideBar>
        <TopHeader></TopHeader>
        <router-view></router-view>
        <loading v-show="showLoading"></loading>
    </div>
</template>
<script>
import NavSideBar from '~components/common/NavSideBar.vue';
import TopHeader from '~components/common/TopHeader.vue';
import recommend from './components/recommend.vue';
import teamDescription from './components/teamDescription.vue';
import loading from "~components/loading/loading.vue";
import axios from 'axios';
import api from '~api';
import {mapGetters} from 'vuex';
export default {
    name: 'index-app',
    data() {
        return {
            establishText:'',
            errorText:'',
            btnText:'创建',
            checkOnOff:false,
            titleOnOFF:true,
            'patientNameError':false,
            'patientNameFocus':false
        }
    },
    components: {
        NavSideBar,
        TopHeader,
        recommend,
        teamDescription,
        loading
    },
    computed:{
      onOff(){
          // console.log(this.establishText.length===0)
          return (this.establishText.length===0&&this.checkOnOff)
      },
        ...mapGetters(['showLoading','pointerOnOff']),
    },
    watch:{
        patientNameFocus(){
            // console.log('触发')
        },
        establishText(newVal,oldVal){
            // console.log(this.checkOnOff)
            this.checkOnOff=false;
            if(this.establishText.length>20){
                this.checkOnOff=true;
                this.establishText=this.establishText.substr(0,20);
            }
        }
    },

    methods:{
        formInputCheck:function(){
            this.onOff=true
        },
        establishBtn:function () {
            this.checkOnOff=false;
            this.titleOnOFF = false;
            this.btnText='发送邀请';
            if(this.establishText.length<=0){
                this.checkOnOff=true;
                this.titleOnOFF = true;
                this.errorText='请添加团队名称'
                this.btnText='创建';
            }
        },

    },
    mounted() {
    },
    metaInfo: {
        title: '团队设置'
    }
}
</script>
<style lang="scss">
    @import "../../assets/scss/base.scss";
    @import '../../assets/scss/pages/teamSetting.scss';
    @import "../../assets/scss/components/casePopup.scss";
</style>
