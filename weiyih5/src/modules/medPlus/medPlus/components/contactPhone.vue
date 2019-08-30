<template>
    <section class="al-medPlus-contact">
        <h1 class="titleBar">
            <span>厂商工作人员</span>
            <span class="more" @click.stop="checkAllContact" v-show="isMore">更多</span>
        </h1>
        <section class="al-medPlus-contactList">
            <contactItem v-for="(item,index) in contactList" :key="index" :config="item" v-if="index<limitNum"></contactItem>
        </section>
    </section>
</template>
<script>
    import contactItem from './contactItem'
    export default {
        components:{
            contactItem
        },
        props:{
            contactList:{
                default(){
                    return []
                }
            },
            isMore:{
              default(){
                  return 0;
              }
            },
            limitNum:{
                default(){
                    return 3;
                }
            }
        },
        computed:{
            more(){
                let _this = this;
                console.log(_this.contactList.length);
                return  _this.contactList.length>_this.limitNum;
            }
        },
        methods:{
            checkAllContact(){
                let _this = this;
                _this.$emit('checkContact');
            }
        }
    }
</script>