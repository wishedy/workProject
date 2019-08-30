<template>
    <section class="alemr-toastTip" v-show="toastStatus">
        <i></i><span>{{text}}</span>
    </section>
</template>
<style lang="scss">
.alemr-toastTip{
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 7;
    transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -moz-transform:translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    -o-transform:translate(-50%,-50%);
    width: 340px;
    height: 46px;
    text-align: center;
    line-height: 46px;
    background: #fce3e3;
    border: 1px solid #feb5b5;
    border-radius: 2px;
    font-size: 16px;
    color: #333;
    padding: 0 30px;
    i {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(/static/images/pages/uploadColumn/caution.png) no-repeat;
        vertical-align: middle;
        margin-right: 6px;
    }
}
</style>
<script>
    export default {
        props:['text','showToast'],
        computed:{
            toastStatus(){
                if(this.showToast){
                    return this.showToast
                }else{
                    return false;
                }
            }
        }
    }
</script>

