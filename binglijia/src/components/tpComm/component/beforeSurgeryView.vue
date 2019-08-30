<template>
    <section class="alEmr-surgeryIndex" v-if="parseInt(data.caseFolderTemplate.isValid)">
        <aside class="surgeryInfluence caseWidth1000">
            <div class="uploadColumnCont">
            <div class="formSelect formCommon"><p class="articleText">{{data.caseFolderTemplate.structureName}}</p>
                <ul class="uploadColumn uploadImg">
                    <li><i></i><p>添加图片</p></li>
                </ul>
            </div>
            <div class="formSelect formCommon"><p class="articleText"></p>
                <ul class="uploadColumn uploadVideo">
                    <li><i></i><p>添加视频</p></li>
                </ul>
            </div>
            <div class="formSelect formCommon"><p class="articleText mideoText">备注</p>
                <div class="textarea"><textarea readonly="readonly" placeholder="请输入"></textarea><i></i></div>
            </div>
            </div>
        </aside>
    </section>
</template>
<script>
    export default {
        props:['data']
    }
</script>
<style lang="scss">
    @import "../../../assets/scss/modules/common-modules";
    .alEmr-surgeryIndex{
        margin: 0 auto;
        width: 730px;
        .uploadColumnCont{
            /*&:after{*/
                /*content: '';*/
                /*display: block;*/
                /*width: 700px;*/
                /*height: 1px;*/
                /*background: #DFDFDF;*/
                /*margin-left: 184px;*/
            /*}*/
        }
        .formCommon{
            .articleText{
                /*vertical-align: top;*/
            }
        }
        .uploadImg{
            li:last-child{
                i{
                    @include iconImgI(inline-block,38px,31px);
                    background: url("/static/images/pages/newCases/camera.png") no-repeat;
                    margin: 45px 0 6px 0;
                }
            }
        }
        .uploadVideo{
            li:last-child{
                i{
                    @include iconImgI(inline-block,38px,31px);
                    background: url("/static/images/pages/newCases/video.png") no-repeat;
                    margin: 45px 0 6px 0;
                }
            }
        }
        .uploadColumn{
            display: inline-block;
            vertical-align: top;
            width: 545px;
            li{
                width: 140px;
                height: 140px;
                border-radius: 4px;
                display: inline-block;
                vertical-align: top;
                text-align: center;
                /*margin: 0 12px 12px 0;*/
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }
                &:last-child{
                    border: 1px dashed #C8C8C8;
                    border-radius: 4px;

                    p{
                        @include fontSize(14px,#aaa);
                    }
                }

            }


        }
    }
    .newCases.thickCase .alEmr-surgeryIndex .textarea{
        width: 500px;
        /*background: rgba(216,216,216,0.10);*/
        textarea{
            /*background: rgba(245, 245, 245, 0.1);*/
        }
    }
    .newCases.thickCase .formCommon .mideoText{
        vertical-align: top;
    }
</style>
