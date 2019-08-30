<template>
    <div class="al-course-introduce">
        <section v-html="courseHtml" v-if="courseDescribeType===2"></section>
        <section  v-if="courseDescribeType===1">
            <img v-for="(item,index) in coursePicList" :src="item" alt="">
        </section>
    </div>
</template>
<script>
    import axios from 'axios';
    import comm from 'static/js/comm.js';
    import TempCache from "static/js/tempcache";
        const onlineUrl = '/mcall/college/course/getCourseDescribe/';
    export default {
        methods:{
            getCourseHtml() {
                let _this = this;
                _this.loading = true;
                axios.get(onlineUrl, {
                    params: {
                        paramJson: $.toJSON({
                            customerId: TempCache.getItem('userId') || '',
                            courseId: _this.courseId,
                            attType: 6
                        })
                    }
                })
                    .then(function (res) {
                        //console.log('wwwwwwwww', res);
                        let data = res.data;
                        if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.dataList) {
                            _this.courseHtml = data.responseObject.responseData.dataList[0].attHtmlContent;
                            _this.courseDescribeType = data.responseObject.responseData.dataList[0].courseDescribeType;
                            _this.coursePicList = data.responseObject.responseData.dataList[0].coursePicList;
                        }


                    })
                    .catch(function (error) {

                        //////console.log(error);
                    });

            },
            checkApp() {
                let _this = this;
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    _this.appPort = true;
                    _this.cid = appjs.getAuthorCustomerId();
                } else {
                    _this.appPort = false;
                }
            }
        },
        data(){
            let cid = TempCache.getItem('userId');
            let courseId = (comm.getparaNew().courseId+'').match(/\d+/)[0];
          return {
              coursePicList:[],
              courseHtml: '',
              courseDescribeType:-1,
              cid:cid,
              courseId:courseId
          }
        },
        mounted() {
            const _this = this;
            _this.checkApp();
            _this.getCourseHtml();
        }
    }
</script>
