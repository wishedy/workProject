<template>
    <div class="formRadio formCommon" v-if="parseInt(data.caseFolderTemplate.isValid)">
        <p class="articleText"><i v-if="data.isRequire">*</i>{{data.caseFolderTemplate.structureName}}</p>
        <div class="radiocontainer" :class="{'radioListcon':data.commDataField.fieldType==2||data.caseFolderTemplateScope&&data.caseFolderTemplateScope.length>2}">
            <div class='radioIconNormal' v-for="(item,index) in data.caseFolderTemplateScope" :class="{'radioList':data.commDataField.fieldType==2||data.caseFolderTemplateScope&&data.caseFolderTemplateScope.length>2}">
                <i></i>
                <span>{{item.dictionaryName}}</span>
                <!--<input placeholder="请输入"  type="text" class="otherTag" readonly="readonly" v-if="item.dictionaryName=='其他'&&(data.commDataField.fieldType==2||scope&&scope.length>2)"/>-->
                <input placeholder="请输入"  type="text" class="otherTag" readonly="readonly" v-if="item.dictionaryName=='其他'&&(data.commDataField.fieldType==2)"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "form-radio",
        props:['data'],
        data(){
            return{
                scope:this.data.caseFolderTemplateScope
            }
        }
    }
</script>

<style scoped lang="scss">
    .thickCase{
        .radiocontainer{
            display: inline-block;
            vertical-align: middle;
            max-width: 525px;
            &.radioListcon{
                vertical-align: top;
            }
        }
        .radioList{
            display: block;
            margin-bottom: 16px;
            &:last-child{
                margin-bottom: 0;
            }
        }
        .otherTag{
            width: 275px;
            height: 40px;
            border: 1px solid #C8C8C8;
            border-radius: 4px;
            font-size: 14px;
            color: #000000;
            padding: 0 12px;
            display: inline-block;
            vertical-align: top;
            /*background: rgba(216,216,216,0.10);*/
        }
        .formRadio div span{
            max-width: 465px;
        }
    }


</style>
