<template>
    <section>
        <div class="row-two-team">
            <div class="team-title">
                <span class="line"></span>
                <span class="text">首期顾问团队</span>
                <span class="line"></span>
            </div>
            <!--<p class="team-remark">甄选业界 <span>100+</span> 顶级团队</p>-->
            <p class="team-remark">甄选业界顶级专家</p>
            <ul>
                <li :class="`team-pic${index+1}`" v-for="(item,index) in doctorTeamList"
                    @click="openPersonal(item)"
                    :key="index">
                    <!--<em :class="`ream-pic${index+1}-em`">{{item.doctorName}}</em>-->
                    <img :src="item.profile" alt="">
                </li>
                <!--<li class="team-pic2" @click="concatCustomer()">-->
                <!--<em class="team-pic2-em">王岩</em>-->
                <!--</li>-->
                <!--<li class="team-pic3" @click="concatCustomer()">-->
                <!--<em class="team-pic3-em">黄野</em>-->
                <!--</li>-->
                <!--<li @click="concatCustomer()">-->
                <!--<em>王岩</em>-->
                <!--</li>-->
                <!--<li class="team-pic2" @click="concatCustomer()">-->
                <!--<em class="team-pic2-em">禹宝庆</em>-->
                <!--</li>-->
            </ul>
        </div>
    </section>
</template>

<script>
    import axios from 'axios'
    import TempCache from "static/js/tempcache";
    import comm from 'static/js/comm.js';

    export default {
        name: "AboutCourseTeamList.vue",
        components: {},
        data() {
            return {
                doctorTeamList: [],
                appPort: false,
                cid: '',
                currentCustomerId:'' // 当前点击的用户ID，用于防抖
            }
        },
        mounted() {
            this.getDoctorTeamList();
            this.checkApp();
            this.cid = comm.getparaNew().cid;
        },
        methods: {
            getDoctorTeamList() {
                let t = this;
                axios({
                    method: 'get',
                    url: '/static/doctor.team.json',
                    dataType: "json",
                    crossDomain: true,
                    cache: false
                }).then(res => {
                    t.doctorTeamList = res.data.responseObject.responseData.dataList;
                    console.log('1313131', t.doctorTeamList);
                }).catch(error => {
                    console.log(error);
                })
            },
            checkApp() {
                let _this = this;
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    _this.appPort = true;
                } else {
                    _this.appPort = false;
                }
            },
            openPersonal(config) {//打开个人中心
                if (!this.appPort) {
                    comm.creatEvent({
                        triggerType: '关于学院',
                        triggerName: '讲师头像点击',
                        actionId: 11754,
                        browType: 414,

                    });
                }
                let _this = this;
                if (config.customerId && parseInt(config.customerId, 10) > 100 && config.customerId != _this.currentCustomerId) {
                    // _this.currentCustomerId =config.customerId;
                    if (_this.appPort) {
                        appjs && appjs.gotoPersonalCenter($.toJSON({
                            customerId: config.customerId
                        }));
                    } else {
                        if (parseInt(config.customerId, 10) === parseInt(_this.cid, 10)) {
                            _this.openUrl('/dist/personal/personal_index.html');
                        } else {
                            _this.openUrl('//m.allinmd.cn/dist/personal/others_index.html?cid=' + config.customerId);
                        }
                    }
                }
            },
            openUrl(url) {
                if (!comm.checkInvalid(url)) {
                    if (g_sps) {
                        g_sps.jump(null, url);
                    } else {
                        window.location.href = url;
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>