<template>
    <div class="stopPopupCont" v-show="edit||quit">
        <section class="importError" v-show="edit">
            <i class="impClose" @click.stop="popupCancle"></i>
            <article class="impErrTop">
                <i></i>
                <p :class="{isTwo:isTwoFlag}">{{editTxt?editTxt:'当前病历正在团队其他成员编辑中请稍后再试'}}</p>
                <p :class="{isTwo:isTwoFlag}">{{isTwoText}}</p>
            </article>
            <article class="impErrBot">
                <!--<button class="impCancle" @click.stop="popupCancle">知道了</button>-->
                <button class="impAgain" @click="popupCancle">知道了</button>
            </article>
        </section>
        <section class="importSuc importError" v-show="quit">
            <i class="impClose" @click.stop="popupCancle"></i>
            <article class="impErrTop">
                <i></i>
                <div>
                    <p>{{quitTxt?quitTxt:'检测异常退出，当前病历正在保护期请稍后再试'}}</p>
                </div>
            </article>
            <article class="impErrBot">
                <button class="impAgain" @click.stop="popupCancle">知道了</button>
            </article>
        </section>
    </div>
</template>
<style lang="scss">
    .stopPopupCont{
        background: rgba(#304364,0.8);
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        margin: 0 auto;
        z-index: 2;
        .importError{
            width: 500px;
            height: 218px;
            background: #FFFFFF;
            border-radius: 4px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
            -moz-transform:translate(-50%,-50%);
            -webkit-transform: translate(-50%,-50%);
            -o-transform:translate(-50%,-50%);
            .impClose{
                background: url("/static/images/pages/teamsetting/member_cancel.png") no-repeat center 50%;
                width: 13px;
                height: 13px;
                position: absolute;
                right: 20px;
                top: 20px;
                cursor: pointer;
            }
            .impErrTop{
                /*margin:58px 0 40px 70px;*/
                text-align: center;
                margin: 67px 0 47px;
                font-weight: 600;
                p{
                    font-size: 14px;
                    color: #333333;
                    display: inline-block;
                    vertical-align: super;
                    /*vertical-align: top;*/
                    width: 285px;
                    /*line-height: 24px;*/
                    text-align: left;
                    &:last-child{
                        font-weight: 100;
                        margin-left: 46px;
                        margin-top: -6px;
                    }
                    &.isTwo{
                        vertical-align:top
                    }
                }
                i{
                    background: url("/static/images/common/icon/errorIcon28x28.png") no-repeat center 50%;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                    margin-right: 10px;
                }
            }
            .impErrBot{
                text-align: center;
                line-height: 44px;
                font-size: 0;
                .impCancle{
                    width: 84px;
                    height: 44px;
                    color: #ffffff;
                    font-size: 16px;
                    background: #BBBBBB;
                    border-radius: 2px;
                    margin-right: 20px;
                    cursor: pointer;
                }
                .impAgain{
                    width: 94px;
                    height: 40px;
                    color: #ffffff;
                    font-size: 14px;
                    background: #2888FF;
                    border-radius: 2px;
                    cursor: pointer;
                }
            }
            &.importSuc{
                .impErrTop{
                    i{
                        background: url("/static/images/common/icon/errorIcon28x28.png") no-repeat center 50%;
                        width: 28px;
                        height: 28px;
                        display: inline-block;
                        margin-right: 10px;
                    }
                    div{
                        width: 300px;
                        display: inline-block;
                        p{
                            width: 300px;
                            margin-top: 0;
                            vertical-align: super;
                            &:nth-child(2){
                                font-size: 14px;
                                margin-top: 16px;
                            }
                        }
                    }
                }
                .impAgain{
                    cursor: pointer;
                }
            }
        }
    }
</style>
<script>
    const $ = require('jquery');
    export default {
        props:['editing','editQuit','editingTxt','editQuitTxt','isTwo','isTwoTxt'],
        data(){
            return{
                edit:this.editing,//正在编辑状态
                quit:this.editQuit,//异常退出状态
                editTxt:this.editingTxt,//正在编辑文字
                quitTxt:this.editQuitTxt,//异常退出文字
                isTwoFlag:this.isTwo,//带有两行文字的样式
                isTwoText:this.isTwoTxt,//两行文字中的文字
            }
        },
        watch:{
            editing(){
                this.edit = this.editing;
                if(this.editing){
                    $('body').css('position',"");
                    document.getElementsByTagName('body')[0].style.height='static';
                    document.getElementsByTagName('body')[0].style.overflow="hidden";
                }
            },
            editQuit(){
                this.quit = this.editQuit;
                if(this.editQuit){
                    document.getElementsByTagName('body')[0].style.height='static';
                    document.getElementsByTagName('body')[0].style.overflow="hidden";
                }
            },
            editingTxt(){
                this.editTxt = this.editingTxt;
            },
            editQuitTxt(){
                this.quitTxt = this.editQuitTxt;
            },
            isTwo(){
                this.isTwoFlag = this.isTwo;
            },
            isTwoTxt(){
                this.isTwoText = this.isTwoTxt;
            }
        },
        methods:{
            popupCancle(){
                let t=this;
                t.edit = false;
                t.quit = false;
                t.$emit('popupFn',false);
                document.getElementsByTagName('body')[0].style.position='static';
                document.getElementsByTagName('body')[0].style.overflow="scroll";
            }
        },
        mounted() {
            let t=this;

        },
    }
</script>

