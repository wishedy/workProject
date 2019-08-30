<template>
    <section :class="{show:showOnOff}" class="al-confirmModalMask">
        <section class="al-confirmModal">
            <article class="al-confirmModalContent">
                <h2>{{localConfirmOption.mTitle}}</h2>
                <article><p v-html="localConfirmOption.title"></p></article>
            </article>
            <footer class="al-confirmModalBtns">
                <button class="al-confirmModalEnsureBtn" style="width:100%" @click="ensure">{{localConfirmOption.ensureTitle}}</button>
            </footer>
        </section>

    </section>
</template>
<script>
    export default {
        data(){
            return {
                localConfirmOption:{},
                showOnOff:false
            }
        },
        props:["confirmOption"],
        mounted(){

        },
        methods:{
            ensure(){
                let t = this;
                t.$emit('ensureClickEvent');
                t.showOnOff = false;
            },
        },
        created(){

        },
        watch:{
            confirmOption:{
                handler(data){
                    let t = this;
                    if(data.mTitle){
                        t.localConfirmOption = data;
                        t.showOnOff = true;
                    }
                },
                deep:true
            }
        }
    }
</script>