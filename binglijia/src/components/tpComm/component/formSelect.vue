<template>
   <section>
       <!--caseFolderTemplate.isBothSides  是否是左右侧都记类型0-不是1-是
            caseFolderTemplate.sideType  侧别类型1-左侧2-右侧-->
       <div v-if="parseInt(data.caseFolderTemplate.isBothSides)==0||!data.caseFolderTemplate.isBothSides.length">
           <div class="formSelect formCommon" v-if="data.caseFolderTemplateScope&&data.caseFolderTemplateScope.length>6&&parseInt(data.caseFolderTemplate.isValid)">
               <p class="articleText">{{data.caseFolderTemplate.structureName}}</p>
               <div class="selectCont">
                   <span v-text="'请选择'"></span>
               </div>
           </div>
           <div v-else>
               <form-radio v-if="data.commDataField.fieldType==1||data.commDataField.fieldType==2" :data="data"></form-radio>
               <form-check v-else :data="data"></form-check>
           </div>
       </div>
       <div v-else>
           <div class="formSelect formCommon">
               <p class="articleText" v-if="data.caseFolderTemplate.sideType==1">{{data.caseFolderTemplate.structureName}}</p>
               <div class="selectConiner">
                   <p v-text="data.caseFolderTemplate.sideType==1?'L':'R'" class="selectP"></p>
                   <div class="selectCont selectInline">
                       <span v-text="'请选择'"></span>
                   </div>
               </div>
           </div>
       </div>

   </section>
</template>

<script>
    import formRadio from './formRadio';//单选
    import formCheck from './formCheck';//多选
    export default {
        name: "form-select",
        props:['data'],
        data(){
          return{

          }
        },
        components:{
            formRadio,
            formCheck
        }
    }
</script>

<style scoped lang="scss">
    .newCases .formSelect {
        .selectCont{
            &.selectInline{
                width: 160px;
                padding-left: 12px;
                border-radius: 0 4px 4px 0;
                span{
                    color: #999999;
                }

            }
        }
        .selectConiner{
            display: inline-block;
            vertical-align: middle;
        }
        .selectP{
            display: inline-block;
            font-size: 14px;
            color: #333333;
            line-height: 14px;
            padding: 13px 20px;
            vertical-align: middle;
            border: 1px solid #C8C8C8;
            border-radius: 4px 0 0 4px;
            border-right:none ;
        }
    }
</style>
