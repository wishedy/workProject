<template>
    <section class="al-help-contact" :class="{'noneTop':appOnOff}">
        <h1 class="title">唯医互联网骨科医院</h1>
        <p class="des lineHei">唯医互联网骨科医院是“唯医网”旗下骨科线上专业化执业平台。根据骨科医生的执业特点，和骨科患者的就医需求，打造贯穿骨科医生执业全场景的移动工作平台，提供面向骨科患者诊前、诊中和诊后完整需求的一站式医疗服务。为骨科医生量身打造集临床诊疗、学术科研、品牌建设、患者管理等多维度功能模块</p>
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
            t.changeTitle('关于我们');
        },
        computed:{
            ...mapGetters(['appOnOff'])
        }
    }
</script>
