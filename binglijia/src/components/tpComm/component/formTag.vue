<template>
    <div class="formTag">
        <p class="articleText articleTextTag" :class="{'articleTag':tagList.length>0}">标签</p>
        <div class="tagCont">
            <ul>
                <li v-for="(item,index) in tagList" :key="index">{{item.tagName}}</li>
                <!--<li class="active">住院</li>
                <li>住院</li>-->
                <!--<li class="addTag">住院</li>-->
                <!--<li>住院</li>-->
            </ul>
            <div class="tagInput">
                <div class="tagInputCont"> <input type="text" placeholder="输入新标签" readonly="readonly"/><i v-text="10"></i></div>
                <p>添加</p>
            </div>

        </div>
    </div>
</template>

<script>
    import comm from '../../../utils/comm.js';
    export default {
        name: "form-tag",
        props:['olderTag'],
        data(){
            return{
                tagList:[],
                olderList:[],
                userId:localStorage.getItem('userId')||"1463461611339"
            }
        },
        methods:{
            searchTagList(){
                let t=this;
                comm.ajax2({
                    url: '/call/comm/tag/searchTagList/',
                    type: "GET",
                    data: {
                        paramJson:JSON.stringify({"customerId":t.userId,tagType:1})
                    },
                    timeout: 30000,
                    success:function(res){
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.sysTagList){
                            t.tagList=res.responseObject.responseData.sysTagList;
                            t.olderList=t.tagList;
                            t.$emit('olderTag',t.olderList);
                        }

                    }
                })
            }
        },
        async mounted(){
            if(this.olderTag.length==0){
                this.searchTagList();
            }else {
                this.tagList=this.olderTag;
            }

        }

    }
</script>

<style scoped>
    .newCases .formTag .tagInput .tagInputCont{
        /*background: rgba(216,216,216,0.10);*/
    }
    .newCases .formTag .tagInput input{
        /*background: rgba(251, 251, 251,0.10);*/
     }
    .articleTag{
        vertical-align: top;
    }
    .articleTextTag{
        font-size: 14px;
        width: 145px;
    }
    .newCases p.articleTextTag{
        margin-right: 32px;
    }
</style>
