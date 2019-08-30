<template>
    <section class="pagination pager" v-if="count>1">
        <ul class="pages pgTxCenter">
            <li class="pgNext pgpre" :class="{'pgEmpty':index==1}" @click.stop="prev"><i></i></li>
            <li class="page-number" v-for="value in pageList"
                :class="{
                    'page-number-omit':isNaN(parseInt(value)),
                    'pgCurrent':index==value
                }"
                @click.stop="go(value)"
            >{{value}}</li>
            <li class="pgNext pgAfter" :class="{'pgEmpty':index==count}" @click.stop="next"><i></i></li>
        </ul>
        <div class="pgJump" v-if="count>=14">
            <span>跳转到：</span>
            <input type="text" class="pgJumpNumber" v-model="pageNumber">
            <span class="pgText">页</span>
            <input type="button" value="确定" class="pgJumpSubmit" @click.stop="pageJump">
        </div>
    </section>
</template>

<script>
    import regularTest from "~utils/regularTest.js";
    export default {
        props:{
            //当前页码
            pageIndex:{
                type:Number,
                default:1
            },
            //每页数据条数
            pageSize:{
                type:Number,
                default:10
            },
            //总页数
            total : {
                type : Number,
                default : 1
            }
        },
        data(){
            return {
                index:this.pageIndex,//当前页码
                size:this.pageSize,//每页数据条数
                count:this.total,//总页数
                pageNumber:''
            }
        },
        methods:{
            //上一页
            prev(){
                if(this.index>1){
                    this.go(this.index-1);
                }
            },
            //下一页
            next(){
                if(this.index<this.count){
                    this.go(this.index+1);
                }
            },
            //跳转到
            pageJump(){
                let index = this.pageNumber;
                if(this.pageNumber>this.count){
                    index = this.count;
                }
                this.go(index);
            },
            //跳转页码
            go(index){
                if (this.index !== index && !isNaN(parseInt(index))) {
                    this.index = parseInt(index);
                    //父组件通过change方法来接受当前的页码
                    this.$emit('change', this.index);
                }
            }
        },
        computed:{//计算属性
            pageList(){
                if(this.count>1){
                    let arrPager = [];
                    for (let i = 0; i < this.count; i++) {
                        arrPager.push(i + 1);
                    }
                    if (this.count > 11) {
                        if (this.index < 6) {
                            let deleteLen = this.count - 10;
                            arrPager.splice(9, deleteLen, "...");
                        } else {
                            let leftBetweenLen = this.index - 1;
                            let rightBetweenLen = this.count - this.index - 2;
                            if (leftBetweenLen > 3 && rightBetweenLen > 3) {
                                let deleteLeftLen = leftBetweenLen - 3;
                                arrPager.splice(1, deleteLeftLen, "...");
                                let deleteRightLen = rightBetweenLen - 3;
                                arrPager.splice(this.index + 5 - deleteLeftLen, deleteRightLen, "...");
                            } else {
                                if (leftBetweenLen > 3) {
                                    let sdeleteLeftLen = this.index + 1 - (11 - (this.count - this.index));
                                    arrPager.splice(1, sdeleteLeftLen, "...");
                                }
                                if (rightBetweenLen > 3) {
                                    let prolong = this.count - 10;
                                    arrPager.splice(this.index + prolong, prolong, "...");
                                }
                            }
                        }
                    }
                    return arrPager;
                }
            }
        },
        mounted(){

        },
        watch : {
            pageNumber(){
                if (!regularTest.testNum(this.pageNumber)) {
                    this.pageNumber = '';
                }
            },
            pageIndex(){
                this.index=this.pageIndex;
            },
            pageSize(){
                this.size=this.pageSize;
            },
            total(){
                this.count = this.total;
            }
        }

    }
</script>

<style lang="scss">
@import "../../assets/scss/components/pagination.scss";
</style>
