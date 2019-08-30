<template>
    <div class="videoPlayerBg" v-if="isBegin">
        <div id="ev-BgVideo">
            <div id="videoArea">
                <video id="ev-videoArea" v-show="codingType==2" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered"
                       oncontextmenu="return false">
                    <source :src="Inpath" type="video/mp4">
                </video>
                <div class="videoTranscoding" v-show="codingType!=2">
                    <a class="quitBtn" @click.stop="quit()" href="javascript:;"><img src="//img00.allinmd.cn/detail/close.png"/></a>
                    <span v-text="transcodingTxt"></span>
                </div>
            </div>
        </div>
        <div id="lightbox"></div>
    </div>
</template>
<style lang="scss">
    #ev-BgVideo {
        position: fixed;
        z-index: 10;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);    /* for Chrome || Safari */
        -moz-transform: translate(-50%, -50%);       /* for Firefox */
        -ms-transform: translate(-50%, -50%);        /* for IE */
        -o-transform: translate(-50%, -50%);         /* for Opera */
    }
    #videoArea {
        position: relative;
        z-index: 11;
    }
    #lightbox {
        left: 0;
        background: #000;
        top: 0;
        width: 100%;
        height: 100%;
        filter: alpha(opacity=70);
        -moz-opacity: 0.7;
        opacity: 0.7;
        zoom: 1;
        position: fixed;
        z-index: 9;
    }
    .bodyHidden {
        height: 100%;
        overflow: hidden;
    }
    .videoTranscoding{
        /*display: none;*/
        background: url("/static/images/pages/caseDetail/tianscoding.png");
        height: 340px;
        width: 511px;
        /*background: rgba(48,67,100,.8);*/
        text-align: center;
        span{
            font-size: 18px;
            color: #FFFFFF;
            line-height: 340px;
        }
    }
    .quitBtn{
        display:block;
        width:42px;
        height:42px;
        position:absolute;
        top:-10px;
        right:-25px;
        z-index:12;
    }
</style>
<script>
    import comm from '../../utils/comm.js';
    const $ = require('jquery');
    export default {
        props: ['path', 'beginPlay', 'isPopup','codeType'],
        data() {
            return {
                Inpath: this.path,
                isBegin: this.beginPlay,
                transcodingTxt:'转码中...',
                codingType:this.codeType?(this.codeType):2,
            }
        },
        watch: {
            codeType(){
                let t = this;
                t.codingType = this.codeType;
                if(t.codeType==3){
                    t.transcodingTxt = '转码中...';
                }else if(t.codeType==4){
                    t.transcodingTxt = '转码失败';
                }
            },
            beginPlay() {
                let t = this;
                if (t.beginPlay) {
                    t.isBegin = this.beginPlay;
                    if((t.codeType!=3&&t.codeType!=4)||t.codeType==2){//转码成功
                        t.Inpath = this.path;
                        setTimeout(function () {
                            $('source').attr('src', t.Inpath);
                            t.pluginCKplayerCode(t.Inpath, t.isPopup);
                        }, 10);
                    }
                }
            },
        },
        methods: {
            pluginCKplayerCode(path, isPopup) {
                let t = this;
                if (!isPopup) {
                    $('body').addClass('bodyHidden');
                }
                //视频初始化
                //$("#ev-videoArea source").attr("src",path);
                let player2 = new AllinmdPlayer('ev-videoArea', {
                    width: 600,
                    height: 400,
                    poster: "//img10.allinmd.cn/v3/terminal/defaultVideo.jpg",  //播放之前需要放置的海报图片
                    //IE8下使用的swf地址
                    flash: {
                        swf: '//paas.allinmd.cn/modules/allinmdplayer/allinmdplayer.swf'
                    },
                    //需要使用的插件，清晰度切换(videoJsResolutionSwitcher)，关键点显示(progress)
                    /*plugins: {
                     videoJsResolutionSwitcher:{"default": 'high', dynamicLabel: "true"}
                     },*/
                    //设置播放权限时间，使用时需保证allow值为true
                    limitPlayTime: {
                        allow: false,
                        value: 3
                    },//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
                    setMaxPlayTime: {
                        allow: false,
                        value: 0
                    }
                }, function () {
                    //console.log("videojs对象初始化后的回调函数");
                    if (player2 != undefined) {
                        player2.player.play();
                    } else {
                        this.play();
                    }
                });
                player2.player.on("play", function () {
                    if (comm.players) {
                        $.each(comm.players, function (i, val) {
                            val.player.pause();//暂停其他播放
                        });
                    }
                });
                player2.player.on("ended", function () {
                    setTimeout(function () {
                        if ($("#ev-BgVideo").length <= 0) {
                            return;
                        }
                        if (!isPopup) {
                            $('body').removeClass('bodyHidden');
                        }
                        t.isBegin = false;
                        t.$emit('beginFn', false);
                        $('.videoPlayerBg').hide();
                        $('#lightbox').hide();
                        player2.player.dispose();
                        $("#ev-BgVideo,#bg").remove();
                        if (comm.players) {
                            $.each(comm.players, function (i, val) {
                                val.player.play();//暂停其他播放
                            });
                        }
                    }, 1000);
                });
                $("#videoArea").append('<a class="ev-videoPopUpWindowClose" href="javascript:;" style="display:block;width:42px;height:42px;position:absolute;top:-10px;right:-25px;z-index:12;"><img src="//img00.allinmd.cn/detail/close.png"/></a>')
                    .find(".ev-videoPopUpWindowClose").on("click", function (e) {
                    if ($("#ev-BgVideo").length <= 0) {
                        return;
                    }
                    if (!isPopup) {
                        $('body').removeClass('bodyHidden');
                    }
                    t.isBegin = false;
                    t.$emit('beginFn', false);
                    $('.videoPlayerBg').hide();
                    player2.player.dispose();
                    $("#ev-BgVideo,#bg").remove();
                    if (comm.players) {
                        $.each(comm.players, function (i, val) {
                            val.player.play();//暂停其他播放
                        });
                    }
                });
            },
            quit(){
                this.isBegin = false;
                this.$emit('beginFn', false);
                $('.videoPlayerBg').hide();
                $("#ev-BgVideo,#bg").remove();
            }
        },
        mounted() {
            // this.Inpath=this.path
        }
    }
</script>
