<template>
    <div class="course-section-introduce">
        <section v-html="courseHtml" v-if="courseDescribeType===2"></section>
        <section  v-if="courseDescribeType===1">
            <img v-for="(item,index) in coursePicList" :src="item" alt="">
        </section>
    </div>
</template>
<script>
    import axios from 'axios'
    import TempCache from "static/js/tempcache";
    import comm from 'static/js/comm.js';
    const onlineUrl = '/mcall/college/course/getCourseDescribe/';
    export default {
        data() {
            return {
                coursePicList:[],
                courseHtml: '',
                courseDescribeType:-1,
                imgTest:'https://img05.allinmd.cn/public1/2019/05/13/JkczuNELdpjgcmcrHhJDJIFxoKdDmdvp.jpeg',
                test: `
                    <ul>
            <li>
                <h3>讲师</h3>
                <p>
                    王岩，主任医师、博士、硕士生导师，西安交通大学附属医院关节病医院膝关节外科主任，中国医师协会骨科医师分会青年工作委员会副主任委员，关节学组组长
                </p>
                <p>
                    王主任主刀和参加过2000例人工髋关节置换手术，尤其对难度较大的高度曲卵缩膝、强直膝、严重内外翻畸形的人工膝关节置换积累了丰富的经验
                </p>
            </li>
            <li>
                <h3>课程亮点</h3>
                <h4 class="course-introduce-bright">
                    内翻膝畸形的来源分析
                </h4>
                <p class="course-bright-list">
                    如何区分？
                </p>
                <p class="course-bright-list">
                    如何测量与评估？？
                </p>
                <p class="course-bright-list">
                    四步法分析内翻膝？
                </p>
            </li>
            <li>
                <h3>课程受益</h3>
                <h4 class="course-introduce-bright">
                    学完此课程你会
                </h4>
                <p class="course-bright-list">
                    对TKA的认识与一流专家达成共识？
                </p>
                <p class="course-bright-list">
                    对TKA的认知回归最底层基础逻辑？
                </p>
                <p class="course-bright-list">
                    看懂今天骨科发展的趋势和经验？
                </p>
            </li>
            <li>
                <h3>课程大纲</h3>
                <p class="course-outline-list">01 我眼中TKA的理想模样</p>
                <p class="course-outline-list">02 TKA在现实中的操作是怎样的？</p>
                <p class="course-outline-list">03 TKA的底层逻辑是什么？</p>
                <p class="course-outline-list">04 TKA的底层逻辑在现实操作中怎么理解？？</p>
            </li>
            <li>
                <h3>购买须知</h3>
                <p class="course-buy-notice">
                    <span>1.</span>
                    <span>《马建兵·TKA通识30讲》包含老师亲自录制的视频内容，每周更新。</span>
                </p>
                <p class="course-buy-notice">
                    <span>2.</span>
                    <span>《本产品为付费产品，共400唯金，购买成功后，即可永久使用产品所有内容</span>
                </p>
                <p class="course-buy-notice">
                    <span>3.</span>
                    <span>本产品为虚拟内容服务，一经购买成功，不支持退款，请您理解</span>
                </p>
                <p class="course-buy-notice">
                    <span>4.</span>
                    <span>本产品支持优惠券，详情参见优惠券使用规则</span>
                </p>
                <p class="course-buy-notice">
                    <span>5.</span>
                    <span>《在购买过程中如果遇到任何问题，您可以通过以下途径练习客服。</span>
                </p>
            </li>
            <li>
                <h3>课程受益</h3>
                <p class="course-team">出品人：刘峥嵘</p>
                <p class="course-team">监制：邢川、沈忠美</p>
                <p class="course-team">策划：沈忠美</p>
                <p class="course-team">制作人：安卫军、沈忠美</p>
                <p class="course-team">拍摄：安卫军</p>
                <p class="course-team">后期：XXX、XXX、XXX、XXX</p>
            </li>
        </ul>`
            }
        },
        props: {
            courseId: {
                default: '67',
                type: String
            }
        },
        mounted() {
            this.getCourseHtml(3);
        },
        methods: {
            getCourseHtml(courseId) {
                //console.log('qqqqqqq', courseId);
                let _this = this;
                _this.loading = true;
                axios.get(onlineUrl, {
                    params: {
                        paramJson: $.toJSON({
                            customerId: TempCache.getItem('userId') || '1557107399571',
                            courseId: (comm.getparaNew().courseId+'').match(/\d+/)[0],
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
        }

    }
</script>
