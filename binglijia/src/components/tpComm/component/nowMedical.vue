<template>
    <aside class="nowMedical caseWidth814" v-if="parseInt(data.caseFolderTemplate.isValid)">
        <h2 class="medicalTitle">{{data.caseFolderTemplate.structureName}}</h2>
        <aside class="caseHistoryMsg">
            <!--<article>{{data.limitTerm}}</article>-->
            <div class="textarea"><textarea readonly="readonly" placeholder="请输入"></textarea></div>
        </aside>

    </aside>
</template>

<script>
    export default {
        name: "now-medical",
        props:['data']
    }
</script>

<style scoped lang="scss">
.thickCase {
    .nowMedical{
        font-size: 0;
        .medicalTitle{
            width: 145px;
            text-align: right;
            display: inline-block;
            margin-right: 39px;
            vertical-align: top;
            font-size: 14px;
            color: #333;
            line-height: 25px;
            font-weight: normal;
        }
        .caseHistoryMsg{
            display: inline-block;
            .textarea{
                width: 475px;
                /*background: rgba(216,216,216,0.10);*/
                textarea{
                    /*background: rgba(245, 245, 245, 0.1);*/
                }
            }
        }
    }
}
</style>
