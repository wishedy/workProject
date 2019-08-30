<template>
    <div class="formRadio formCommon formCheck" v-if="parseInt(data.caseFolderTemplate.isValid)">
        <p class="articleText">{{data.caseFolderTemplate.structureName}}</p>
        <div class="radioRight">
            <div class='radioIconNormal' v-for="(item,index) in data.caseFolderTemplateScope">
                <i></i>
                <span>{{item.dictionaryName}}</span>
                <input type="text" placeholder="请输入" class="otherTag" readonly="readonly" v-if="item.dictionaryName=='其他'&&data.commDataField.fieldType==4"/>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "form-check",
        props:['data']
    }
</script>

<style scoped>
    .newCases.thickCase .formCheck .articleText{
        vertical-align: top;
    }
    .newCases.thickCase .formRadio.formCheck .radioRight .radioIconNormal i{
        /*background: rgba(216,216,216,0.10);*/
    }
    .newCases .formRadio.formCheck .radioRight div input.otherTag{
        width: 275px;
        /*background: rgba(216,216,216,0.10);*/
        height: 40px;
        line-height: 40px;
        font-size: 14px;
    }
</style>
