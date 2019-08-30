<template>
    <!--caseFolderTemplate.isBothSides  是否是左右侧都记类型0-不是1-是
           caseFolderTemplate.sideType  侧别类型1-左侧2-右侧-->
    <div v-if="parseInt(data.caseFolderTemplate.isBothSides)==0||!data.caseFolderTemplate.isBothSides.length">
        <section v-if="parseInt(data.caseFolderTemplate.isValid)">
            <div class="formInput formCommon" v-if="data.commDataThreshold.thresholdValue&&data.commDataThreshold.thresholdValue.split(',')[1]<=50">
                <p class="articleText"><i v-if="data.isRequire">*</i>{{data.caseFolderTemplate.structureName}}</p>
                <div class="inputCont" :class="{'shortInput':data.commDataThreshold.thresholdValue&&data.commDataThreshold.thresholdValue.split(',')[1]<=20}">
                    <input type="text" placeholder="请输入" readonly="readonly"/>
                    <!--<i v-text="data.commDataThreshold.thresholdValue&&data.commDataThreshold.thresholdValue.split(',')[1]" v-if="data.commDataThreshold.thresholdValue&&data.commDataThreshold.thresholdValue.split(',')[1]<=20"></i>-->
                </div>
            </div>
            <now-medical v-else :data="data"></now-medical>
        </section>
    </div>
    <div v-else>
        <section v-if="parseInt(data.caseFolderTemplate.isValid)">
            <div class="formInput formCommon">
                <p class="articleText" v-if="data.caseFolderTemplate.sideType==1">{{data.caseFolderTemplate.structureName}}</p>
                <div class="shortContainer">
                    <p v-text="data.caseFolderTemplate.sideType==1?'L':'R'" class="selectP"></p>
                    <div class="inputCont shortInput">
                        <input type="text" placeholder="请输入" readonly="readonly"/>
                    </div>
                </div>

            </div>
        </section>
    </div>

</template>

<script>
    import nowMedical from './nowMedical';//5-文本域
    export default {
        name: "form-input",
        props:['data'],
        data(){
          return{
              thresholdValue:this.data.commDataThreshold.thresholdValue
            }
        },
        components:{
            nowMedical
        }
    }
</script>

<style scoped lang="scss">
    .newCases .formInput .inputCont.shortInput{
        width: 317px;
    }
    .newCases .formInput .inputCont input{
        padding: 0 0 0 12px;
    }
    .newCases .formInput {
        .shortContainer{
            display: inline-block;
            vertical-align: middle;
            .inputCont{
                border-radius: 0 4px 4px 0;
                width: 170px;
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

    }
</style>
