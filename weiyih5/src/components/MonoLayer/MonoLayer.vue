<template>
    <section :class="{show:showOnOff}" class="al-confirmModalMask ">
        <section class="al-confirmModal">
            <article class="al-confirmModalContent">
                <article><p>{{localConfirmOption.title}}</p></article>
            </article>
            <footer class="al-confirmModalBtns">
                <button class="al-confirmModalCancelBtn" @click="cancel">取消</button>
                <button class="al-confirmModalEnsureBtn" @click="ensure">{{localConfirmOption.ensureTitle?localConfirmOption.ensureTitle:'确定'}}</button>
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
            let t = this;

        },
        methods:{
            ensure(){
                let t = this;
                t.$emit('ensureClickEvent');
                t.showOnOff = false;

            },
            cancel(){
                let t = this;
                t.$emit("cancelClickEvent");
                t.showOnOff = false;
            }
        },
        created(){

        },
        watch:{
            confirmOption(){
                let t = this;
                if(isNaN(parseInt(t.confirmOption))){
                    t.localConfirmOption = JSON.parse(t.confirmOption);
                    t.showOnOff = true;
//                    console.log(t.localConfirmOption)
                }else{
                    t.showOnOff = false;
                }

            }
        }
    }
</script>
