<template>
    <div class="formSelect formCommon" v-if="parseInt(data.caseFolderTemplate.isValid)"><p class="articleText">{{data.caseFolderTemplate.structureName}}</p>
        <div class="inputSelect">
            <input type="text"/>
            <div class="SelectCont"><span>月</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "form-select-time",
        props:['data']
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/scss/modules/utilities/_utilities.scss";
    @import "../../../assets/scss/modules/compatibility/_compatibility.scss";
    .formCommon {
        .articleText{
            width: 72px;
            text-align: right;
            display: inline-block;
        }
        .inputSelect{
            display: inline-block;
            vertical-align: middle;
            @include clearfix();
            input{
                float: left;
                width: 50px;
                height: 40px;
                line-height: 40px;
                padding-left: 12px;
                //font-size: 18px;
                 //color: #000000;
                @include fontSize();
                border: 1px solid #C8C8C8;
                border-radius: 4px;
                margin-right: 20px;
                /*background: rgba(216,216,216,0.10);*/
            }
            .SelectCont{
                float: left;
                /*width: 70px;*/
                height: 40px;
                border: 1px solid #C8C8C8;
                border-radius: 4px;
                display: inline-block;
                vertical-align: middle;
                position: relative;
                //font-size: 18px;
                //color: #000000;
                @include fontSize(14px,#999);
                line-height: 40px;
                 /*padding-left: 20px;*/
                 padding: 0 35px 0 12px;
                /*background: rgba(216,216,216,0.10);*/
                &:after {
                     width: 0;
                     height: 0;
                     position: absolute;
                     content: "";
                     border-color: rgba(0, 0, 0, 0.5) transparent transparent;
                     border-style: solid;
                     border-width: 6px;
                     top: 18px;
                     right: 12px;
                 }
                .selectOption {
                    position: absolute;
                    top: 41px;
                    padding: 10px;
                    left: 0;
                    width: 60px;
                    //font-size: 18px;
                    //color: #333333;
                    @include fontSize(14px,#333);
                    line-height: 22px;
                    max-height: 271px;
                    background: #FFFFFF;
                    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
                    border-radius: 4px;

                    li{
                        padding-left: 6px;
                        cursor: pointer;
                        &:hover{
                             background: rgba(40,136,255,0.1);
                             border-radius: 2px;
                         }
                    }
                }
            }
        }
    }
</style>
