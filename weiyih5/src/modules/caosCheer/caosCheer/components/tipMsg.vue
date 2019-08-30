<template>
    <div class="container-tips" v-show="showTip">{{message}}</div>
</template>

<script type="text/ecmascript-6">
    export default {
        data(){
            return {
                message: '',
                showTip: false
            }
        },
        mounted (){},
        methods: {
            showTips (txt) {
                this.message = txt;
                this.showTip = true;
                this.hideTip()
            },
            hideTip () {
                let that = this;
                setTimeout(function () {
                    that.showTip = false
                    that.message = ''
                },1500)
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>


