<template>
    <section class="al-router-view" >
        <!--<header class="al-indexHeader" data-alcode-mod='401' id="header">
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)">
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>中国骨科菁英会</h1>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>&nbsp;</h1>
            </figure>
        </header>-->
        <section class="al-introduction eliteClub-article">
            <article class="al-introduction-item">
                <h3 class="small-title produce-title">中国骨科菁英会活动举办办法</h3>
                <div class="paragraph-content">
                <h1 class="chapter">活动申报原则</h1>
                    第一条	所申请活动需严格以学术为本，围绕骨科相关专业开展；<br/>
                    第二条	凡菁英会成员均有权申报成为学术活动主办人，并承担相应活动举办事宜；<br/>
                    第三条	各专业需要在执委会议中根据活动上报情况及本专业特点拟定下一年度计划草案，并在会员大会期间进行审核及公布；<br/>
                    第四条	菁英会秘书处需协助各专业进行年度计划的制定；<br/>
                    第五条	菁英会秘书处负责进行各专业学术活动的协调安排，保证各专业学术活动的顺利进行。<br/>
                    第六条	认同菁英会执行主席的工作职责。<br/>
                <h1 class="chapter">活动申报时间</h1>
                    活动申报：2月-8月，需提交申报资料至秘书处，由秘书处统一汇总致各专业；<br/>
                    申报审核：8月-11月，审核评估阶段，审核结果将在年终会员大会进行公示<br/>
                    审核评估将在各专业年度执委会中进行；<br/>
                    活动公示：12月，会员大会期间将对下一年度计划进行公示。<br/>

                </div>
            </article>
        </section>
    </section>
</template>
<style scoped lang="scss">
    .al-router-view{
        min-height: 100vh;
        height: auto;
    }
    @import "scss/pages/eliteClub/eliteClub";
</style>
<script>
    export default {
        mounted(){
         /*   if(!((typeof  appjs)==='undefined')){
                appjs.updateTitle('中国骨科菁英会活动举办办法');
            }*/
            if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
                appjs&&appjs.updateTitle('中国骨科菁英会活动举办办法');
            }
        }
    }
</script>
