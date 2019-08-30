<template>
    <section>
        <section class="casePopup">
            <section class="casePopupCont">
                <slot></slot>
            </section>
        </section>
    </section>
</template>
<style lang="scss" scoped>
    @import "../../../assets/scss/components/casePopup.scss";
    .cancel{
        /*margin-right: 20px;*/
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
    import {mapGetters} from 'vuex';
    export default {
        methods:{

        }
    }
</script>
