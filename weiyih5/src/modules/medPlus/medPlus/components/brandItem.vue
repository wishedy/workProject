<template>
    <section class="brandItem">
        <div class="icon"></div>
        <div class="info" v-text="docName"></div>
    </section>
</template>
<script>
    export default {
        props:{
            docName:{
                default:'',
                type:String
            }
        },
        data(){
            return {

            }
        }
    }
</script>