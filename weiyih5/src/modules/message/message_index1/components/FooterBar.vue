<template>
    <footer class="al-msgListDeleteBtns Ev-mesBottomSelectAllBtn" :class="{show:unfold}">
        <button class="al-msgListDeleteSelectAll Ev-mesSelectAllBtn" data-flag="1" @click="allBtn">{{allorNo?'取消全选':'全选'}}</button>
        <button class="al-msgListDelete Ev-mesDeleteBtn" :class="nums?'al-msgListDeleteHasItem':''" @click="deleteBtn">删除<span class="Ev-mesDelNum" v-show="nums">({{nums}})</span></button>
    </footer>
</template>

<script>
    import {mapActions} from "vuex";
    import axios from "axios";
    import comm from "static/js/comm";
    export default {
        computed:{
            nums(){
                return (this.$store.state.count>0)?(this.$store.state.count):''
            },
            deletelistId(){
                return this.$store.state.deleteListIdGather;
            },
            allorNo(){
                return this.$store.state.isCheckall;
            },
            unfold(){
                return this.$store.state.compileOrCancel;
            }
        },
        methods:{
            allBtn(){
                if(this.$store.state.isAllDelete){
                    this.setAllDelete(false);
                    this.setCheckall(false);    //设置[全选]或者[取消全选]状态，本页面computed使用，内容页面点击函数使用
                }else{
                    this.setAllDelete(true);
                    this.setCheckall(true);
                }
            },
            deleteBtn(){
                let t = this;
                if(this.nums>0){
                    comm.confirmBox({
                        title: '确定删除这'+this.nums+'条信息吗？',
                        cancel: '删除',
                        ensure: '取消',
                        ensureCallback(){

                        },
                        cancelCallback(){
                            t.setLoading(true);
                            axios({
                                url: "/mcall/customer/message/update3/",
                                method: "POST",
                                data: {
                                    opTypeRules:1,
                                    messageIdList:t.deletelistId,
                                    isValid:0
                                },
                                transformRequest: [function(data) {
                                    return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                timeout: 30000
                            }).then(function(res){
                                t.setLoading(false);
                                if (res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
                                    t.setDelete(true);    //传入删除状态，内容页面监听处理
                                }
                            });
                        }
                    });
                }

            },
            ...mapActions(["setAllDelete","setDelete","setLoading","setCheckall"])
        },
    }
</script>