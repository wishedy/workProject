<template>
    <section class="al-bottomSelectorListMask" :class="{on:state}">
        <section class="al-bottomSelectorListBox" data-alcode-mod="427" data-alcode-item-selector="a">
            <section class="al-bottomSelectorList">
                <figure class="al-bottomSelectorItem al-bottomSelectorTitle"><a href="javascript:void(0)">{{(followLayer&&followLayer.title)||'确定不再关注该栏目？'}}</a></figure>
                <figure class="al-bottomSelectorItem" @click="ensure"><a href="javascript:void(0)">确定</a></figure>
            </section>
            <section class="al-bottomSelectorList mgt">
                <figure class="al-bottomSelectorItem" @click="cancel"><a href="javascript:void(0)">取消</a></figure>
            </section>
        </section>
    </section>
</template>

<script>
    /**
     * @Desc：关注弹层[下收样式]
     * @Usage: store存入公共变量二条,第一监测是否显示组件,第二监测关注按钮状态
     * @Notify：请参考discover使用
     * @Depend：vuex
     *
     * Created by dinglindong on 17/11/23.
     *
     */
    import Vue from "vue";
    export default{
        data(){
            return {
                state:false
            }
        },
        props:[
        	'followLayer'
		],
        methods:{
            ensure(){
                this.state = false;
                this.$emit('ensureClickEvent');
            },
            cancel(){
                this.state = false;
                this.$emit("cancelClickEvent");
            }
        },
        watch:{
            "$store.state.confirmOption"(){
                this.state = this.$store.state.confirmOption;
            }
        }
    }
</script>