<template>
    <section class="al-help-contact al-help-produce">
        <article class="produce-content topSide specification-produce-content">
            <span class="normal-color">线上咨询服务的核心原则：</span>从医学角度给出患者指
            导性建议，解决患者的问题
        </article>
        <article class="produce-contents specification-produce-content">
            <span class="normal-color">目标：</span>让患者感觉态度好+专业
        </article>
        <h1 class="produce-title">
            <i class="icon">1</i>
            <i class="produce-subTitle">咨询回复的流程</i>
        </h1>
        <article class="produce-content">
            可参考：现病史、既往史、初步诊断、治疗建议、交代注意事项
        </article>
        <article class="produce-content">
            可参考：现病史、既往史、初步诊断、治疗建议、交代注意事项
        </article>
        <article class="produce-content">
           <span class="fontBold">① 现病史:了解患者病情基本情况,主要症状或体征及持续时间、内外因变化、用药等</span>
        </article>
        <article class="produce-content">
            <span class="fontBold">② 既往史：要了解患者过去健康状况、疾病史、药物过敏史等。</span>重点是了解本次问诊不适症状既往是否出现过，既往就医情况、用药、疗效等。（既往史及现病史，分诊医生问诊后会进行收集 整理，并保存到分诊记录中，医生可直接查看。如资料不全可根据患者的情况详细了解病史及既往史）
        </article>
        <article class="produce-content">
           <span class="fontBold">③ 初步建议： 根据病史、体症和化验，进行综合分析后给出建议</span>
        </article>
        <article class="produce-content" style="margin-bottom: 24px;">
            <span class="fontBold">参考情况：</span>
        </article>
        <article class="produce-content">* 患者以具体不适症状为问题上来咨询的，医生在咨询回复中需要对患者的病情有个总结性的判断
        </article>
        <article class="produce-content">* 病情复杂诊断需要化验结果支持建议到医院就诊的：发送原因说明为什么要去医院（检查结果不充足会导致误诊，反而耽误病情），要交代去医院那个科室，可能会涉及到什么辅助检查，检查后，可以回来继续咨询
        </article>
        <article class="produce-content">
           <span class="fontBold">④ 治疗参考建议：针对患者提供的病情及诊断，提供恰当的建议</span>
        </article>
        <article class="produce-content">
            交代：可从专业角度给出建设性的指导建议
        </article>
        <article class="produce-content" style="margin-bottom: 24px;">
            <span class="fontBold">参考情况：</span>
        </article>
        <article class="produce-content">
            * 可以从是疾病本身的知识，防治基本，用药注意，如何防止复发，疾病日常饮食注意，疾病日常护理，做检查前注意事项，术后注意事项，做检查的目的，指导的就医流程，调整生活作息，改正不良习惯，注意饮食调节或是增加运动等多个方面给出专业性的指导建议
        </article>
        <h1 class="produce-title">
            <i class="icon">2</i>
            <i class="produce-subTitle">咨询回复内容要求</i>
        </h1>
        <article class="produce-content maTop">
            <span class="fontBold">① 回复患者时使用礼貌用语</span>
        </article>
        <article class="produce-content">
            建议您使用”欢迎语”、“结束语”等礼貌用语，耐心详细的解答患者的疑惑
        </article>
        <article class="produce-content">
            例如，欢迎语“您好，我是xx医生，很高兴为您解答疑惑。”或者“您好，问题已经收到，首先感谢您对我的信任！ ” 结束语“后续有问题可以继续咨询我，祝您早日恢复健康”
        </article>
        <article class="produce-content">
            <span class="fontBold">② 耐心详细解答患者问题，为患者提指导建议。不同的患者有针对性的回复，避免模板化回
复。</span>
        </article>
        <article class="produce-content">
            参考建议：您好，根据您现在提供的症状描述来看，初步考虑可能是xx病/初步考虑是xx情况，确诊还需要相关化验结果支持，建议您去医院做一下xx检查，取得检查报告后再把您的检查资料发给我，我给你做二次咨询建议
        </article>
        <article class="produce-content">
            在遇到非本专业或不在治疗范围内的咨询，医生可以拒绝回答，但应该说明理由，指导建议患者咨询xx科室医生
        </article>
        <article class="produce-content">
            避免模版化回复：患者病情描述详细，检查齐全，咨询医生“是否需要手术”，回复模板化：“我是xx本人还是建议你：必要时，多去几家正规医院看看、多咨询咨询和比较”，未正面回答患者的问题
        </article>
    </section>
</template>
<script>
    import  {mapActions} from 'vuex';
    export default {
        methods:{
            ...mapActions(['changeTitle'])
        },
        mounted(){
            let t = this;
            t.changeTitle('在线咨询回复须知');
        }
    }
</script>
