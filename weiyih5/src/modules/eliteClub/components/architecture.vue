<template>
    <section class="al-router-view al-router-architecture">
        <!--<header class="al-indexHeader" data-alcode-mod='401' id="header">
            <figure class="al-indexHeaderItem">
                <a href="javascript:void(0)">
                    <img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt="">
                </a>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>中国骨科菁英会组织结构</h1>
            </figure>
            <figure class="al-indexHeaderItem">
                <h1>&nbsp;</h1>
            </figure>
        </header>-->
        <section class="al-banner architecture-banner">
            <h3 class="chairman-name">主席</h3>
            <article class="chairman-info">
                <figure class="chairman-logo">
                    <img :src="clubDataInfo.logo" alt="">
                </figure>
                <div class="chairman-detail">
                    <h3 class="title" v-text="clubDataInfo.chairman"></h3>
                    <p class="company" v-text="clubDataInfo.company"></p>
                </div>
            </article>
        </section>
        <section class="al-architecture-item" v-for="(item,index) in clubDataInfo.compositionList" :tag="index" @click.stop="toggle(index)">
            <article class="title" v-text="item.groupName"> </article>
            <i class="icon"></i>
            <ul class="office-position">

                <li v-for="(innerItem,innerIndex) in item.detailList" class="position-item" :class="{'list':innerItem.carriedOut.detailList.length>0}" :tag="innerIndex">
                    <p class="position-name">
                        <i class="line"></i>
                        {{innerItem.officePosition}}
                    </p>
                    <p class="name" v-text="innerItem.officeName" v-if="innerItem.carriedOut.detailList.length===0" @click.stop="openPersonal(innerItem)">

                    </p>
                    <p class="company" v-text="innerItem.officeCompany" v-if="innerItem.carriedOut.detailList.length===0" @click.stop="openPersonal(innerItem)">

                    </p>
                    <section class="handle-item" v-if="innerItem.carriedOut.detailList.length>0" v-for="(thirdItem,thirdIndex) in innerItem.carriedOut.detailList">
                        <p class="name" v-text="thirdItem.officeName" @click.stop="openPersonal(thirdItem)">

                        </p>
                        <p class="company" v-text="thirdItem.officeCompany" @click.stop="openPersonal(thirdItem)">

                        </p>
                    </section>
                </li>
                <!--<li class="position-item">
                    <p class="position-name">
                        <i class="line"></i>
                        副主席兼菁英会总干事
                    </p>
                    <p class="name">
                        柴伟
                    </p>
                    <p class="company">
                        中国人民解放军总医院
                    </p>
                </li>
                <li class="position-item">
                    <p class="position-name">
                        <i class="line"></i>
                        副主席
                    </p>
                    <p class="name">
                        张晓岗
                    </p>
                    <p class="company">
                        中国人民解放军总医院
                    </p>
                </li>
                <li class="position-item list">
                    <p class="position-name">
                        <i class="line"></i>
                        执委
                    </p>
                    <section class="handle-item">
                        <p class="name">
                            张晓岗
                        </p>
                        <p class="company">
                            中国人民解放军总医院
                        </p>
                    </section>
                    <section class="handle-item">
                        <p class="name">
                            张晓岗
                        </p>
                        <p class="company">
                            中国人民解放军总医院
                        </p>
                    </section>

                </li>-->
            </ul>
        </section>
        <!--<section class="al-architecture-item" @clicl.stop="toggle">
            <article class="title">脊柱组</article>
            <i class="icon"></i>
            <ul class="office-position">

                <li class="position-item">
                    <p class="position-name">
                        <i class="line"></i>
                        主席
                    </p>
                    <p class="name">
                        马建兵
                    </p>
                    <p class="company">
                        西安市红会医院
                    </p>
                </li>
                <li class="position-item">
                    <p class="position-name">
                        <i class="line"></i>
                        副主席兼菁英会总干事
                    </p>
                    <p class="name">
                        柴伟
                    </p>
                    <p class="company">
                        中国人民解放军总医院
                    </p>
                </li>
                <li class="position-item">
                    <p class="position-name">
                        <i class="line"></i>
                        副主席
                    </p>
                    <p class="name">
                        张晓岗
                    </p>
                    <p class="company">
                        中国人民解放军总医院
                    </p>
                </li>
                <li class="position-item list">
                    <p class="position-name">
                        <i class="line"></i>
                        执委
                    </p>
                    <section class="handle-item">
                        <p class="name">
                            张晓岗
                        </p>
                        <p class="company">
                            中国人民解放军总医院
                        </p>
                    </section>
                    <section class="handle-item">
                        <p class="name">
                            张晓岗
                        </p>
                        <p class="company">
                            中国人民解放军总医院
                        </p>
                    </section>

                </li>
            </ul>
        </section>
        <section class="al-architecture-item active">
            <article class="title">脊柱组</article>
            <i class="icon"></i>
            <ul class="office-position">
                <li class="position-item">
                    <p class="position-name">
                        <i class="line"></i>
                        主席
                    </p>
                    <p class="name">
                        马建兵
                    </p>
                    <p class="company">
                        西安市红会医院
                    </p>
                </li>
                <li class="position-item">
                    <p class="position-name">
                        <i class="line"></i>
                        副主席兼菁英会总干事
                    </p>
                    <p class="name">
                        柴伟
                    </p>
                    <p class="company">
                        中国人民解放军总医院中国人民解放军总医院
                    </p>
                </li>
                <li class="position-item">
                    <p class="position-name">
                        <i class="line"></i>
                        副主席
                    </p>
                    <p class="name">
                        张晓岗
                    </p>
                    <p class="company">
                        中国人民解放军总医院
                    </p>
                </li>
                <li class="position-item list">
                    <p class="position-name">
                        <i class="line"></i>
                        执委
                    </p>
                    <section class="handle-item">
                        <p class="name">
                            张晓岗
                        </p>
                        <p class="company">
                            中国人民解放军总医院
                        </p>
                    </section>
                    <section class="handle-item">
                        <p class="name">
                            张晓岗
                        </p>
                        <p class="company">
                            中国人民解放军总医院中国人民解放军总医院
                        </p>
                    </section>

                </li>
            </ul>
        </section>-->
    </section>
</template>
<style scoped lang="scss">
    @import "scss/pages/eliteClub/eliteClub";
</style>
<script>
    const  $ =  require('jquery');
    import clubData from '../clubData/clubData';
    export default {
        methods:{
            toggle(index){
                $(".al-architecture-item").eq(index).toggleClass('active');
            },
            openPersonal(item){
                let t = this;
                //console.log(item.officeCustomerId);
                if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
                    appjs&&appjs.gotoPersonalCenter($.toJSON({
                        customerId:item.officeCustomerId
                    }));
                }

            }
        },
        computed:{
            clubDataInfo(){
                return clubData.clubOnLineCompositionData();
            }
        },
        mounted(){
           /* if(!((typeof  appjs)==='undefined')){
                appjs.updateTitle('中国骨科菁英会组织结构');
            }
*/
            if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
                appjs&&appjs.updateTitle('中国骨科菁英会组织结构');
            }
        }
    }
</script>
