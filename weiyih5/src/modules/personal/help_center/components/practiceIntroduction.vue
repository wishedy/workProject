<template>
    <section class="al-help-contact" :class="{'noneTop':appOnOff}">
        <h1 class="produce-title">
            <i class="icon">1</i>
            <i class="produce-subTitle">专为骨科医生设计专属工作平台</i>
        </h1>
        <article class="terms-list">
            <p class="terms-item">
                ① 在线咨询+门诊邀请
            </p>
            <p class="terms-item">
                ② 无边界多点执业
            </p>
            <p class="terms-item">
                ③ 电子病历+患者管理
            </p>
            <p class="terms-item">
                ④ 遵循医生诊疗习惯
            </p>
        </article>
        <h1 class="produce-title">
            <i class="icon">2</i>
            <i class="produce-subTitle">突出个人诊疗专长树立骨科医生品牌</i>
        </h1>
        <article class="terms-list">
            <p class="terms-item">
                ① 依据医生诊疗专长
            </p>
            <p class="terms-item">
                ② 推荐您的需求患者
            </p>
            <p class="terms-item">
                ③ 自定义接诊条件，随时随地接诊
            </p>
        </article>
        <h1 class="produce-title">
            <i class="icon">3</i>
            <i class="produce-subTitle">保护医患隐私，保障诊疗安全</i>
        </h1>
        <article class="terms-list">
            <p class="terms-item">
                ① 免费医责保险，保护线上执业
            </p>
            <p class="terms-item">
                ② 医患隐私严格保护，有效避免先关风险
            </p>
        </article>
    </section>
</template>
<script>
    import  {mapActions,mapGetters} from 'vuex';
    export default {
        methods:{
            ...mapActions(['changeTitle'])
        },
        mounted(){
            let t = this;
            t.changeTitle('在线执业服务介绍');
        },
        computed:{
            ...mapGetters(['appOnOff'])
        }
    }
</script>
