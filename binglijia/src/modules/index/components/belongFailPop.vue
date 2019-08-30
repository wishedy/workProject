<template>
    <!--归属者不是本团队的所有者开始-->
    <section class="alEmr-sucPop" v-if="teamFailPerson">
        <section class="sucText">
            <aside>
                <i class="failTips"></i>
                <p>
                    <span class="textBelong">您已不是“{{teamName}}”的所有者</span>
                </p>
            </aside>
        </section>
    </section>
    <!--归属者不是本团队的所有者结束-->
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    export default {
        name: 'belongFailPop',
        data(){
            return{
                teamName:'',//选中的团队名字
            }
        },
        computed:{
            ...mapGetters(['teamFailPerson','teamNameList']),
        },
        watch:{
            'teamNameList':{
                handler(v1,v2){
                    let t=this;
                    for (let i=0;i<t.teamNameList.length;i++){
                        let items=t.teamNameList[i];
                        if(items.active){//选中的团队名字
                            t.teamName=items.teamName;
                        }
                    }
                },
                deep:true
            }
        }
    }
</script>

<style scoped>

</style>
