<template>
    <header class="al-indexHeader" data-alcode-mod='387' data-alcode-item-selector="figure">
        <figure class="al-indexHeaderItem">

        </figure>
        <figure class="al-indexHeaderItem">
            <h1>唯医</h1>
        </figure>
        <figure class="al-indexHeaderItem" style="padding-top:0.1rem;box-sizing:border-box;">
            <a href="javascript:;" class="platformChange" @click="switchPlatform"><span class="platformIcon"></span><span class="platformName" :data-platformId="platformId">{{platformText}}</span></a>
            <section class="al-personalContributionSelector ev_switchPlatform al-personalSelectorOn" v-show="isSwitchPlatform">
                <ul>
                    <li class="al-personalContributionSelectorItem" data-platformId="1" :class="isSkeleton ? 'active':''" @click="changePlatId">骨科</li>
                    <li class="al-personalContributionSelectorItem" data-platformId="2" :class="isHand ? 'active':''" @click="changePlatId">手外科</li>
                </ul>
            </section>
        </figure>
    </header>
</template>

<script>
    import app from 'static/js/comm.app.js';
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    export default {
        name: "hearder-bar",
        data(){
            return {
                isSwitchPlatform:false,
                isSkeleton:false,
                isHand:false,
                platformId:'',
                platformText:''
            }
        },
        methods:{
            awakeApp(){
                app.appWakeUp('btn');
            },
            docClick:function () {
                let t=this;
                document.body.addEventListener('click',function (e) {
                    if(t.isSwitchPlatform){
                        if (e.target != document.getElementsByClassName('ev_switchPlatform')[0] && e.target != document.getElementsByClassName('platformChange')[0]&&e.target.parentNode != document.getElementsByClassName('platformChange')[0]) {
                            t.isSwitchPlatform=false;
                        }
                    }
                },true);
            },
            platform(){
                var _platformId = TempCache.getItem('department')||1;
                if (_platformId==1) {
                    this.platformId=1;
                    this.platformText='骨科';
                    this.isSkeleton=true;
                } else if(_platformId==2) {
                    this.platformId=2;
                    this.platformText='手外科';
                    this.isHand=true;
                }

            },
            changePlatId(e){
                let pId = e.target.getAttribute('data-platformId');
                comm.creatEvent({
                    triggerType:'骨科&手外科切换',
                    keyword:pId==1?"骨科&手外科切换(骨科按钮点击)":"骨科&手外科切换(手外科按钮点击)",
                    actionId:3
                });
                TempCache.setItem('department',pId);
                location.reload();
            },
            switchPlatform(){
                this.isSwitchPlatform=!this.isSwitchPlatform;
            }

        },
        mounted (){
            this.awakeApp();
            this.platform();
            this.docClick();
        }
    }
</script>

<style scoped>

</style>