<template>
    <section class="al-medPlus-contactItem" v-if="!isEmptyObject(config)">
        <section class="al-medPlus-inner">
            <span class="phoneIcon"></span>
            <article class="phoneContent">
                <div class="content-info">
                    <span class="content-name" v-text="config.fullName"></span>
                    <span class="content-position" v-text="config.medicalTitle"></span>
                </div>
                <div class="content-num" v-text="config.mobile"></div>
            </article>
        </section>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    export default {
        props:{
            config:{
                default(){
                    return {};
                }
            }
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
        }
    }
</script>