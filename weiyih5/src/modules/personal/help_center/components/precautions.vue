<template>
    <section class="al-help-contact al-help-produce">
        <h1 class="produce-title">
            <i class="icon">1</i>
            <i class="produce-subTitle">本人使用</i>
        </h1>
        <article class="produce-content">
            在线咨询需医生本人回复，个人的账号不得擅自转让或授权他人使用
        </article>
        <article class="produce-content">
            每一个咨询背后是一个真实的患者，医生患者回复后，患者有可能来找就诊。有的患者可能是慕名咨询医生，出于对患者的负责，需医生本人回复。回复内容对患者病情要有指导性建议。 如非本人回复，发现后将关闭在线咨询服务资格
        </article>
        <h1 class="produce-title">
            <i class="icon">2</i>
            <i class="produce-subTitle">严禁引导患者到不正规的医疗机构就诊</i>
        </h1>
        <article class="produce-content">
            回复内容应给与患者正确的引导，不可引导患者到不正规医疗机构就诊。发现后将删除回复信息，并取消接诊权限
        </article>
        <h1 class="produce-title">
            <i class="icon">3</i>
            <i class="produce-subTitle">隐私保护</i>
        </h1>
        <article class="produce-content">
            为了保护医生的隐私，回复过程中尽量避免留私人联系方式，防止患者持续打扰医生
        </article>
        <h1 class="produce-title">
            <i class="icon">4</i>
            <i class="produce-subTitle">回复权限</i>
        </h1>
        <article class="produce-content">
            遵守国家卫生健康委员会的《互联网医院管理办法》相关规定，在线咨询回复过程中不开具处方，且首诊患者不进行诊断疾病，可以针对疾病给患者相应的建议
        </article>
        <h1 class="produce-title">
            <i class="icon">5</i>
            <i class="produce-subTitle">严禁出现第三方</i>
        </h1>
        <article class="produce-content">
            回复内容中不能出现其他网站的二维码或者链接等，引导患者去其他网站咨询。发现后医生助理将给与提醒，超过三次将取消接诊权限
        </article>
        <h1 class="produce-title">
            <i class="icon">6</i>
            <i class="produce-subTitle">咨询回复</i>
        </h1>
        <article class="produce-content">
            要耐心详细解答患者问题，为患者提供有针对性的建议。不同的患者有针对性的回复，避免模板化回复。提示：如回复质量差的情况连续出现三次，将不再推荐患者
        </article>
        <h1 class="produce-title">
            <i class="icon">7</i>
            <i class="produce-subTitle">回复时间提醒</i>
        </h1>
        <article class="produce-content">
            在您时间允许的情况下，及时回复患者的问题，过期的咨询会失效，为了让患者尽快得到答复，让医生的回复更有意义，唯医骨科建立一套咨询过期机制：系统会自动处理，长时间未得到回复的提问将失效
        </article>
        <article class="produce-content">
            ① 患者等待医生回复的时间为2天，如2天内医生没有接诊，患者提交咨询将失效，医生助理会根据病情推荐其他医生
        </article>
        <article class="produce-content">
            ②为了避免患者占用医生过多精力，医生接受咨询后，患者和医生咨询时间期限为5天
        </article>
        <h1 class="produce-title">
            <i class="icon">8</i>
            <i class="produce-subTitle">回复选择</i>
        </h1>
        <article class="produce-content">
            患者的疾病不符合医生的专业方向或者医生设置的咨询范围可以拒绝回复咨询
        </article>
        <h1 class="produce-title">
            <i class="icon">9</i>
            <i class="produce-subTitle">付费患者介绍</i>
        </h1>
        <article class="produce-content">
            ① 患者付费咨询后，医生接受咨询后，将获得30次回复机会，咨询结束后，患者所付费用将转入医生APP内的个人账户内
        </article>
        <article class="produce-content">
            ②医生未接受咨询，2天后费用将退回给患者
        </article>
        <h1 class="produce-title">
            <i class="icon">10</i>
            <i class="produce-subTitle">解释权归唯医互联网骨科医院所有</i>
        </h1>
        <article class="produce-content">
            唯医互联网骨科医院对医患沟通内容的处理及有关条款有最终解释权
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
