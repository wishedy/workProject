<template>
    <div class="formInputAge formCommon" v-if="parseInt(data.caseFolderTemplate.isValid)">
        <p class="articleText"><i v-if="data.isRequire">*</i>{{data.caseFolderTemplate.structureName}}</p>
        <div class="ageInput">
            <input class="inputText"  type="text" readonly="readonly"/>
            <span>岁</span>
            <input class="inputText" type="text"  readonly="readonly"/>
            <span>月</span>
            <input class="inputText" type="text"  readonly="readonly"/>
            <span>天</span>
        </div>
    </div>
</template>

<script>
    export default {
        props:['data'],
        name: "form-input-age"
    }
</script>

<style >
.ageInput{
    display: inline-block;
    vertical-align: middle;
}
</style>
