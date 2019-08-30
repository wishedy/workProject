<template>
    <section class="al-elite-memberSubTitle" v-if="!isEmptyObject(config)">
        <span class="position" v-text="config.title"></span>
        <span class="memberNum" v-text="config.totalCount" v-if="parseInt(config.totalCount,10)"></span>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    export default {
        props:{
            config:{
                default(){
                    return {}
                }
            }
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            }
        }
    }
</script>