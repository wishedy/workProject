<template>
    <!--筛选条件展示开始-->
    <section class="alEmr-screeningShow" v-if="scrShowFlag">
        <aside class="showTips"><span>{{total}}</span>条结果</aside>
        <ul class="activeTips">
            <li v-for="(items,i) in scrShowArr" @click="clickScrClick(i)" v-if="items.active">
                <span>{{items.kv}}</span><i></i></li>
        </ul>
    </section>
    <!--筛选条件展示结束-->
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: 'screItemsShow',
        computed: {
            ...mapGetters(['scrShowArr', 'scrShowFlag', 'total', 'loading'])
        },
        methods: {
            ...mapActions(['sIdListChange', 'tNameListChange', 'scrShowArrChange', 'belongTypeChange',
                'tIdListChange', 'sexIdChange', 'ageMinChange', 'ageMaxChange', 'notAgeFlagChange',
                'createIdListChange', 'doctorIdListChange']),
            //删除筛选标签的选中
            clickScrClick(index) {
                let t = this;
                if (t.loading) {
                    return;
                }
                //删除筛选id的列表
                if (t.scrShowArr.length) {
                    switch (parseInt(t.scrShowArr[index].from)) {
                        case 1://初步诊断
                            t.sIdListChange({
                                val: t.scrShowArr[index].kv,
                                flag: false
                            });
                            break;
                        case 2://标签
                            t.tNameListChange({
                                val: t.scrShowArr[index].id + '_' +
                                t.scrShowArr[index].kv, flag: false
                            });
                            break;
                        case 4://归属
                            if (t.scrShowArr[index].id == '00041') {//点击的是归属的个人按钮
                                t.belongTypeChange('');
                            } else {
                                t.tIdListChange({ val: t.scrShowArr[index].id, flag: false });
                            }
                            break;
                        case 5://性别
                            t.sexIdChange('');
                            break;
                        case 6://年龄
                            t.ageMinChange('');
                            t.ageMaxChange('');
                            t.notAgeFlagChange(false);
                            break;
                        case 7://创建者
                            t.createIdListChange({
                                val: t.scrShowArr[index].id,
                                flag: false
                            });
                            break;
                        case 8://主管医生
                            t.doctorIdListChange({
                                val: t.scrShowArr[index].id,
                                flag: false
                            });
                            break;
                    }

                }
                //删除下边选中的筛选项
                t.scrShowArrChange({
                    val: {
                        kv: t.scrShowArr[index].kv,
                        id: t.scrShowArr[index].id,
                        active: false,
                        from: t.scrShowArr[index].from
                    }, flag: false
                });
            }
        }
    };
</script>

<style scoped>

</style>
