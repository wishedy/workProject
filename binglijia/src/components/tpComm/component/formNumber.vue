<template>
    <!--caseFolderTemplate.isBothSides  是否是左右侧都记类型0-不是1-是
            caseFolderTemplate.sideType  侧别类型1-左侧2-右侧-->
    <div v-if="parseInt(data.caseFolderTemplate.isBothSides)==0||!data.caseFolderTemplate.isBothSides.length">
        <div class="formNumber formCommon" v-if="parseInt(data.caseFolderTemplate.isValid)">
            <p class="articleText">{{data.caseFolderTemplate.structureName}}</p>
            <div class="selectCont" v-if="data.caseFolderTemplateScope&&data.caseFolderTemplateScope.length>0"><span>身份证</span>
                <ul class="selectOption" v-show="false">
                    <!--<li v-for="(item,index) in admissionNumList" :key='index' v-text="item.admissionNum"></li>-->
                </ul>
            </div>
            <input class="inputCont" type="text" :placeholder="data.commDataThreshold&&data.commDataThreshold.thresholdUnit?'':'请输入'" readonly="readonly" :class="{'inputNumber':data.commDataThreshold&&data.commDataThreshold.thresholdUnit}"/>
            <span v-if="data.commDataThreshold&&data.commDataThreshold.thresholdUnit" class="thresholdUnit">{{data.commDataThreshold&&data.commDataThreshold.thresholdUnit}}</span>
        </div>
    </div>
    <div v-else>
        <div class="formNumber formCommon" v-if="parseInt(data.caseFolderTemplate.isValid)">
            <p class="articleText" v-if="data.caseFolderTemplate.sideType==1">{{data.caseFolderTemplate.structureName}}</p>
            <div class="selectCont" v-if="data.caseFolderTemplateScope&&data.caseFolderTemplateScope.length>0"><span>身份证</span>
                <ul class="selectOption" v-show="false">
                    <!--<li v-for="(item,index) in admissionNumList" :key='index' v-text="item.admissionNum"></li>-->
                </ul>
            </div>
            <div class="inputConiner">
                <p v-text="data.caseFolderTemplate.sideType==1?'L':'R'" class="selectP"></p>
                <input class="inputCont" type="text" :placeholder="data.commDataThreshold&&data.commDataThreshold.thresholdUnit?'':'请输入'" readonly="readonly" :class="{'inputNumber':data.commDataThreshold&&data.commDataThreshold.thresholdUnit}"/>
                <span v-if="data.commDataThreshold&&data.commDataThreshold.thresholdUnit" class="thresholdUnit">{{data.commDataThreshold&&data.commDataThreshold.thresholdUnit}}</span>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "form-number",
        props:['data'],
        data(){
            return{

            }
        }
    }
</script>

<style scoped lang="scss">
    .thickCase{
         .inputCont.inputNumber{
             width: 112px;
         }
        .thresholdUnit{
            display: inline-block;
            font-size: 14px;
            color: #333333;
            margin-left: 20px;
            vertical-align: middle;
        }
    }
    .newCases .formNumber {
        .inputConiner{
            .inputCont{
                border-radius: 0 4px 4px 0;
                width: 80px;
            }
        }

    }
    .inputConiner{
        display: inline-block;
        vertical-align: middle;
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
