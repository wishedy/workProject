<template>
    <router-link class="al-elite-num" tag="section"  :to="{ name: 'member'}" >
        <span class="num" v-text="memberCount"></span>
        <span class="word">名精英已加入</span>
    </router-link>
</template>
<script>
    export default {
        name:'elite-num',
        props:{
            memberCount:{
                default:0
            }
        }
    }
</script>