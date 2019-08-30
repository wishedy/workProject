<template>
    <article class="al-timelineContentItem">
        <figure class="al-timelineUserImg">
            <a :href="item.customerId|getHref">
                <img :src="item.logoUrl" alt="">
            </a>
        </figure>
        <article class="al-timelineContentTextBox">
            <header class="al-timelineContentAuthor">
                <a :href="item.customerId|getHref">
                    {{item.username|getUsername}}<i class="al-vipUser"></i>
                    <p class="al-timelineTime">{{item.publishTime|getTime}}</p>
                </a>
                <span>{{item.company}}</span>
            </header>
            <article class="al-timelineContentText">
                <a href="javascript:void(0)" style="float:left">{{item.configName=="discuss"?(item.parentUsername?"回复"+item.parentUsername+":&nbsp;":''):item.parentUsername}}</a><p v-html="item.content"></p>
                <figure class="al-commentContentVideo ev-video" :ref="'video'+item.reviewId" @click="videoPlay(item.reviewId)" :data-videoSrc="item.videoSrcUrl" style="width: 4.8rem;height: 3.2rem;" v-if="item.videoLogoUrl">
                    <img class="al-commentContentVideoImg" :src="item.videoLogoUrl" alt="视频缩略图" />
                    <i class="al-commentContentVideoBtn"><img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt=""></i>
                    <span class="al-commentContentVideoTime">{{item.playTime}}</span>
                </figure>
                <section class="al-timelineImgBox ev-picList" v-if="item.imgsListArr.length>0">
                    <figure class="al-timelineImg" v-for="(imgs,j) in item.imgsListArr" v-show="!(item.imgsListArr.length>6&&j>5)">
                        <img :src="imgs.attUrl" :attWidth="imgs.originalAttWidth" :attHeight="imgs.originalAttHeight" alt="">
                        <figure class="al-moreImgMask" v-if="item.imgsListArr.length>6&&j==5">
                            <p>还有<span>{{item.imgsListArr.length - 6}}</span>张<i class="icon-detailsArrow"></i></p>
                        </figure>
                    </figure>
                </section>
                <p class="al-commentContentQuote" v-if="item.quoteUrl">
                    引用{{item.quoteType|getQuoteType}}：<a :href="item.quoteUrl">《<span>{{item.refQuoteName}}</span>》</a>
                </p>
            </article>
        </article>
    </article>
</template>

<script type="text/ecmascript-6">
    import comm from "static/js/comm.js";
    import commdate from "static/js/comm.date.js";
    import Log from "static/js/log.js";
    export default{
      props:['item'],
      methods:{
        //图片宽度处理
        imgWidth(){
          let ulWidth = $('.al-timelineImgBox').width();
          let liWidth = parseInt((ulWidth - 18) / 3);
          $('.al-timelineImgBox').each(function (ind, elem) {
            $(elem).find('.al-timelineImg').each(function (index, element) {
              $(element).width(liWidth);
              $(element).height(liWidth);
              let marginWidth = Math.floor((ulWidth - liWidth * 3) / 2 - 1);
              if (index % 3 != 2) {
                $(element).css({marginRight: marginWidth});
              } else {
                $(element).css({marginRight: 0});
              }
            })
          });
        },
        //查看大图
        showBigImg(){
          bigPicShow.init({
            domIdList: [".al-timelineImgBox"],//指定多个class|| ID
            topSwiperOptions: {
              isInit: true,//是否需要初始化,
              onInit: function (sipwer) {
              },
              zoom: true
            },
            imgClickCallBack: function (index, ele) {
              if (comm.players.length) {
                for (var i = 0; i < comm.players.length; i++) {
                  comm.players[i] && comm.players[i].player.pause();
                }
              }
                setTimeout(function(){
                    g_sps.createBrowse({pageId:432});
                },2200);
              $('html').attr('sT', $(window).scrollTop());
              $('html,body').css({height: '100%', overflow: 'hidden'});
              $('.ev-topTitle').html($(ele).parents('.Ev-imgCtrl').attr('typeTitle'));
            },
            bottomSwiperOptions: {
              isInit: false,//是否需要初始化,
            },
            closeCallBack: function () {
              $('html,body').css({height: 'auto', overflow: 'auto'});
              $(window).scrollTop($('html').attr('sT') || 0);
              $('html').removeAttr('sT');
            },
            theme: 'dark',
            topTitle: {
              isInit: true,
              title: ""
            }
          });
          $(".al-moreImgMask").on("click", function () {
            $(this).siblings("img").click();
          });
        },
        videoPlay(reviewId){
          let that = this.$refs["video"+reviewId];
          if ($(that).find('video').length == 0) {
            let _w = $(that).find('img').eq(0).width();
            let _h = $(that).find('img').eq(0).height();
            let poster = $(that).find('img').eq(0).attr('src');
            let n = $('video').length + 2;
            let videoItem = ' <video id="CKa' + n + '" class="video-js vjs-default-skin vjs-no-flex vjs-big-play-centered">' +
              '  <source src="' + $(that).attr('data-videoSrc') + '">' +
              '  </video>';
            $(that).children().hide();//width:100% HEIGHT:312PX;
            $(that).append(videoItem);
            let players = [];
            players[n] = new AllinmdPlayer('CKa' + n, {
              width: _w,
              height: _h,
              poster: poster,  //播放之前需要放置的海报图片
              //设置播放权限时间，使用时需保证allow值为true
              limitPlayTime: {allow: false, value: 180},//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
              setMaxPlayTime: {allow: false, value: 0},
              isH5: true
            }, function () {
              let isIOS = comm.browser.versions.ios;
              let ua = navigator.userAgent.toLowerCase();
              let isAndroidChrome = /chrome\/[\d|.]+ mobile safari\/[\d|.]+$/g.test(ua);  //android手机chrome浏览器
              if (isIOS || isAndroidChrome) {  //ios放出全屏（版本10以下playsinline无效，暂无解决方法）
                $('.vjs-fullscreen-control').show().css('marginRight', '0');
                $('.allinmd-time-elements').css({
                  float: 'left',
                  margin: "2px 0 0 0"
                });
              }
            });
            players[n].player.play();
            comm.players.push(players[n]);
            let _player = players[n].player;
            $.each(comm.players, function (ix, plea) {
              if (_player != plea.player) {
                plea.player.pause();
              }
            });
            return false;
          }
        },
      },
      mounted(){
        this.imgWidth();
        this.showBigImg();
      },
      filters:{
        getTime(time){
          return commdate.diffDay_one(time,commdate.local_time())
        },
        getHref(cId){
          return cId?"/dist/personal/others_index.html?cid="+cId+"#/contribution":"javascript:;";
        },
        getUsername(name){
          return comm.cutstr(name,20,true);
        },
        getQuoteType(type){
          let word="";
          switch (type) {
            case 1:
              word = "视频";
              break;
            case 2:
              word = "文库";
              break;
            case 4:
              word = "话题";
              break;
            case 7:
              word = "病例";
              break;
            default:
              word = "评论";
          }
          return word;
        }
      }
    }
</script>