<template>
    <section class="casePopup">
        <aside class="popupCont newCases">
            <div class="popupTitle"><i @click.stop="closeDialog"></i></div>
            <div class="popupContH">
                <slot></slot>
            </div>
            <div class="formBtn">
                <button @click.stop="ensureDialog">确定</button>
            </div>
        </aside>
    </section>
</template>
<style lang="scss" scoped>
    @import "../../../assets/scss/components/casePopup.scss";
    .cancel{
        margin-right: 20px;
    }
    .close{
        cursor: pointer;
    }
    .btn{
        a{
            cursor: pointer;
        }
    }
</style>
<script>
    export default {
        methods:{
            closeDialog(){
                let t = this;
                t.$emit('closeDialog');
            },
            ensureDialog(){
                let t = this;
                t.$emit('submitDialog');

            }
        }
    }
</script>
