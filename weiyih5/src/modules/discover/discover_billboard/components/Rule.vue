<template>
    <section class="al-mainInner">
        <HeaderBar :header-config="headerConfig"></HeaderBar>
        <section class="rule">
            <section class="width">
                <aside class="title">明星榜单规则说明</aside>
                <article class="text margin">明星榜单是唯医全面医师排行的权威榜单，以真实数据为依据，通过专业的计分规则和多样的参与机制对医师进行综合排名，下设贡献榜、活跃榜和推荐榜三个维度。</article>
                <section class="tuleNum">
                    <aside class="title">1. 上榜人员原则</aside>
                    <aside class="littleTitle"><i></i>贡献榜、活跃榜</aside>
                    <article class="text marginOther">所有唯医认证医师、医学生、护士均有上榜资格</article>
                    <aside class="littleTitle"><i></i>推荐榜</aside>
                    <article class="text marginOther">自主申请上榜的用户经工作人员审核资格后可上榜</article>
                </section>
                <section class="tuleNum">
                    <aside class="title">2. 榜单周期</aside>
                    <aside class="littleTitle"><i></i>贡献榜、活跃榜</aside>
                    <article class="text marginOther">每周一的0:00开始累积数据，每周日24:00截止统计，然后进入下一周的计分周期。每周一4:00发布上周榜单</article>
                    <aside class="littleTitle"><i></i>推荐榜</aside>
                    <article class="text marginOther">每小时更新榜单排名；工作人员每月第一个工作日调整上榜名单</article>
                </section>
                <section class="tuleNum">
                    <aside class="title">3. 记分规则</aside>
                    <aside class="littleTitle"><i></i>贡献榜最终得分</aside>
                    <article class="text marginAnther">主要由贡献量计算，当贡献量相同时，通过被浏览计算</article>
                    <article class="text marginAnther"><span>贡献量：</span>指医师在平台发布并审核通过的视频、文库数量和医师在平台发布的病例、话题数量，其中视频和文库按照通过审核时间计算计分周期 </article>
                    <article class="text marginAnther"><span>被浏览量：</span>指医师在平台所有新贡献资源被浏览次数总和</article>
                    <aside class="littleTitle"><i></i>活跃榜最终得分</aside>
                    <article class="text marginAnther">由评论量、分享量和浏览量综合计算</article>
                    <article class="text marginAnther"><span>评论量：</span>指医师在平台发布评论的数量</article>
                    <article class="text marginAnther"><span>分享量：</span>指医师在平台分享资源的数量，分享到站内和站外都计入分享量</article>
                    <article class="text marginAnther"><span>浏览量：</span>指医师在平台浏览的资源数量，一个计分周期中多次浏览同一资源仅计一次分</article>
                    <aside class="littleTitle"><i></i>推荐榜最终得分</aside>
                    <article class="text marginAnther">由用户被顶次数计算</article>
                    <article class="text marginOther">每名用户每天仅能为推荐用户顶一次</article>
                </section>
                <section class="tuleNum">
                    <aside class="title">4. 计分方式</aside>
                    <aside class="littleTitle"><i></i>贡献榜</aside>
                    <article class="text marginAnther">每个贡献计1分。贡献量相同时，以当前计分周期内新贡献资源被浏览数量排序</article>
                    <aside class="littleTitle"><i></i>活跃榜</aside>
                    <article class="text marginAnther">活跃分值为评论量*3分+分享量*2分+浏览量*0.5分</article>
                    <article class="text marginAnther"><span>示例：</span>A用户贡献了3个视频，其中2个通过审核，贡献了2个病例。则这个用户贡献榜计4分。B用户浏览了114个资源，发出7条评论，分享8次，则这个用户活跃榜计114*0.5+7*3+8*2=94分</article>
                    <aside class="littleTitle"><i></i>推荐榜</aside>
                    <article class="text marginOther">每次被顶计1分</article>
                </section>

                <section class="tuleNum">
                    <aside class="title">5.特殊标识</aside>
                    <aside class="littleTitle"><i></i>新上榜</aside>
                    <article class="text marginAnther">新上榜：历史第一次上榜用户会展示新上榜标识</article>
                    <aside class="littleTitle"><i></i>连续n周</aside>
                    <article class="text marginAnther">连续n周：连续5周以上上榜用户会展示连续n周上榜标识</article>
                    <aside class="littleTitle"><i></i>奖牌</aside>
                    <article class="text marginOther">奖牌：排行榜冠亚季军排名旁对应展示红橙黄奖牌标志</article>
                </section>

                <section class="tuleNum">
                    <aside class="title">6. 扣分</aside>
                    <article class="text marginOther">用户删除贡献、评论，或被管理员屏蔽的贡献、评论会在被删除／屏蔽时间当前计分周期内扣除得分</article>
                </section>
            </section>
            <i class="line"></i>
            <section class="welfare">
                <section class="title"></section>
                <ul>
                    <li><i>1</i><span>周榜冠军将制作精美海报，获得独家封面曝光机会。</span></li>
                    <li><i>2</i><span>连续四周上榜用户可获得神秘礼品一份。（详情请咨询唯医微信官方客服小唯：allinmd2014）</span></li>
                    <li>更多精彩福利请随时关注唯医最新动态</li>
                </ul>
            </section>
        </section>
    </section>
</template>

<script>
    import HeaderBar from "components/HeaderBar/HeaderBar";
    export default {
        data(){
           return {
               headerConfig:{
                   title:"榜单规则",
                   backOnOff:true,
               },
           }
        },
        components:{
            HeaderBar
        }
    }
</script>

<style scoped>
    .rule .welfare .title {
        background: url('//img50.allinmd.cn/pages/discover/billboard/Title.png') no-repeat;
        width: 6.72rem;
        height: 0.66667rem;
        background-size: contain;
        margin: 0 auto 0.8rem;
    }
</style>