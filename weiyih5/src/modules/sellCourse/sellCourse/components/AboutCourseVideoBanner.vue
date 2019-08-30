<template>
    <section>
        <div class="row-tow-video-container">
            <div class="row-two-video1">
            <span class="video1-play"></span>
            </div>
        </div>
    </section>
</template>



<script>
    import axios from 'axios'
    import comm from 'static/js/comm.js';

    export default {
        name: "AboutCourseVideoBanner.vue",
        props: {},
        data() {
            return {
                RelatedContent: [],
                active: false,
                defaultCid: 0,
                playing: -1,
                initData: [],
                initIndex: 0,
                b: true,
                c: -1,
                appPort: false,
                test: ''
            }
        },
        mounted() {
            let t = this;
            t.checkApp();
            t.getRelatedContent();
        },
        completed: {},
        methods: {

            getStrLen(str, num) {
                return comm.getStrLen(str, num);
            },
            getRelatedContent() {
                let t = this;
                let videoJson = {
                    "videoTitle": "唯医学院创办的初心",
                    "imageUrls": "",
                    "imageUrl": "",
                    "customerId": 0,
                    "videoUrl": "https://vpro.allinmd.cn/huangye.mp4",
                    "videoProtagonist": "刘峥嵘 | 创始人&CEO",
                    "protagonistPosition": "唯医骨科"
                };
                t.RelatedContent = [
                    videoJson
                ];
                t.currentData = videoJson;
                t.defaultCid = videoJson.customerId;
                t.initData = t.RelatedContent[0];
                for (let i = 0; i < t.RelatedContent.length; i++) {
                    t.RelatedContent[i].videoTitle = t.getStrLen(t.RelatedContent[i].videoTitle, 30)
                }
                // t.currentVideo(t.RelatedContent);
                // t.showVideo(t.RelatedContent[0], 0);
                t.setDefaultVideo(t.initData, 0);
            },

            initVideo(initData, index) {
                t.currentVideo(initData, index);
            },
            showVideo(data, index) {
                let _this = this;
                $('.row-two-video1').html('\n' +
                    '                        ' + data.videoTitle + '\n' +
                    '                        <i class="column-line">|</i>\n' +
                    '                        ' + data.videoProtagonist + '');
                $('.row-two-video1').html('<video preload="auto"  x5-video-player-type="h5" id="collegeVideo" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered"\n' +
                    '                               oncontextmenu="return true">\n' +
                    '                            <source src="' + data.videoUrl + '" type="video/mp4">\n' +
                    '                        </video>');
                if (_this.player2) {
                    _this.player2.player.dispose();
                }
                _this.player2 = new AllinmdPlayer('collegeVideo', {
                    width: 395,
                    height: 395,
                    poster: data.imageUrl,  //播放之前需要放置的海报图片
                    //IE8下使用的swf地址
                    flash: {
                        swf: 'allinmdplayer.swf'
                    },//需要使用的插件，清晰度切换(videoJsResolutionSwitcher)，关键点显示(progress)
                    // 设置播放权限时间，使用时需保证allow值为true
                    limitPlayTime: {
                        allow: false,
                        value: 3
                    },//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
                    setMaxPlayTime: {
                        allow: false,
                        value: 0
                    },
                    isH5: true
                }, function () {
                    console.log(data.videoUrl);
                    console.log("videojs对象初始化后的回调函数qqqq",);
                    _this.player2.player.on('canplay', function () {
                        console.log('能播吗')
                    });
                    _this.player2.player.on('loadedmetadata', function () {
                        console.log('能播吗??')
                    });
                });

                _this.player2.player.on('ended', function () { //视频结束
                    _this.show_scrollTop(index);//视频结束滚动到下一个
                    $(".active" + index).closest('dl').next().trigger('click');//视频结束播放下一个
                    _this.playing = -1;
                    // _this.getStrLen(data.videoTitle,20)
                });
                _this.player2.player.on('play', function () { //视频结束
                    _this.playing = index;
                    data.videoTitle = _this.getStrLen(data.videoTitle, 20)

                });
                _this.player2.player.on('pause', function () { //视频结束
                    _this.playing = -1;

                });
                return _this;
            },
            checkApp() {
                let _this = this;
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    _this.appPort = true;
                    // _this.customerId = appjs.getAuthorCustomerId();
                    return
                } else {
                    _this.appPort = false;
                    // _this.customerId = TempCache.getItem('userId');
                    return
                }
            },

            /**
             * 点击视频播放
             * @param data 当前视频数据
             * @param index 当前看视频下标
             */
            setPlayerData(data, index) {
                this.playing = -1;
                if (!this.appPort) {
                    comm.creatEvent({
                        triggerType: '关于学院',
                        triggerName: '宣传视频',
                        actionId: 11753,
                        browType: 414,

                    });
                }
                this.active = true;
                data.videoTitle = this.getStrLen(data.videoTitle, 30)
                this.showVideo(data, index)
            },

            /**
             * 初始化页面设置视频
             */
            setDefaultVideo(data, index) {
                this.active = true;
                // this.test=this.getStrLen(data.videoTitle,20)
                this.showVideo(data, index)
            },

            /**
             * 页面载入定位播放的视频
             * @param data 需要播放视频的数据
             */
            currentVideo(data, index) {
                console.log(index);
                let _this = this;
                _this.playing = index;
                let cid = comm.getparaNew().cid || _this.defaultCid;
                console.log('cid', cid);
                _this.active = true;
                data.forEach(function (item, index) {
                    if (item.customerId === cid) {
                        _this.setPlayerData(item, index);
                    }
                })
            },

            /**
             * 滚动视频
             * @param index 当前视频的下标
             */
            show_scrollTop(index) {
                let li_width = $(".active" + index).outerWidth();//li的高度，包括border;
                if (index > 0) {//不在可视区，页面上从第8个开始就不再可视区
                    let left = (index) * li_width * 2;
                    console.log('left', left);
                    $('.video-container').scrollLeft(left);//设置overflow-y：scroll 这个元素的scrollTop()
                }
            },
        }
    }
</script>
