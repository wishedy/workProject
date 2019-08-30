<template>
    <section>
        <!--筛选弹层开始-->
        <section class="screenShadow" v-show="scrPopShow"></section>
        <section class="screenListNav" :class="{screenFixed:scrPopShow}">
            <ul>
                <section  v-for="(v,i) in authMajorList">
                    <li v-if="parseInt(v.tagType)===1" :class="{active:parseInt(subjectTeamId)===parseInt(v.tagId)}"
                        @click="authMajorClick(i)" :key="i">{{v.tagName}}
                    </li>
                    <li v-else :class="{active:parseInt(openTime)===parseInt(v.tagId)}"
                        @click="authMajorTimeClick(i)" :key="i">{{v.tagName}}
                    </li>
                </section>
                <li :class="{active:scrPopShow}" @click="scrBtnClick">筛选<i></i></li>
            </ul>
            <aside class="screenOption" v-show="scrPopShow">
                <aside class="screenOptionCont">
                    <article>
                        <p>专业</p>
                        <div class="screenOne">
                            <span :class="{active:sureSubjectTeamId===v.tagId}"
                                  v-for="(v,i) in majorList"
                                  :key="i" @click="majorClick(i)"> {{v.tagName}}</span>
                        </div>
                    </article>
                    <article>
                        <p>年份<span>(可多选)</span></p>
                        <div class="ev-yearMonth">
                            <div class="screenOne">
                                <span :class="{active:v.yearActive}" v-for="(v,i) in dateList"
                                      :key="i" @click="yearClick(i)">
                                    {{v.year}}
                                    <i v-if="v.yearMonthTag"></i>
                                </span>
                            </div>
                            <div class="screenTwo" v-if="yearMonthShow">
                                <ul>
                                    <li @click="monthClick(i)" :class="{active:v.monthActive}"
                                        v-for="(v,i) in dateList[yearClickIndex].monthList"
                                        :key="i">{{v.month}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </article>
                </aside>
                <aside class="screenBtn">
                    <div class="ev-resetBtn" @click="resetClick">重置</div>
                    <div class="ev-sureBtn active" @click="sureClick">确定</div>
                </aside>
            </aside>
        </section>
        <!--筛选弹层结束-->
    </section>
</template>

<script>
    import MainList from "components/ConferenceList/conferenceList.vue"
    import TempCache from "static/js/tempcache.js"
    import comm from "static/js/comm.js"
    import {mapActions, mapGetters} from "vuex"

    const xhlUrl = {
        scrBtnUrl: '/mcall/conference/index/getScreeningCondition/',//筛选项按钮的url
    };
    export default {
        data() {
            return {
                authMajorList: [],//首页推荐的筛选标签年份专业数组
                majorList: [],//筛选项的专业
                dateList: [],//日期数组
                yearMonthShow: false,//月份默认不展示
                majorIndex: '',//类别的筛选
                authMajorIndex: '',//顶部用户的个性推荐筛选
                sureSubjectTeamId: '',//弹层的专业筛选
                authTimeIndex:"",//顶部用户个性推荐筛选的时间
                sureOpenTime: '',//弹层筛选中的
                monthActive: false,//月份激活验证
                jsonData:{},
                yearClickIndex:"",//年份点击
            }
        },
        components: {
            MainList,//会议主列表
        },
        methods: {
            ...mapActions(['screeningPopChange','subjectTeamIdChange','openTimeChange']),
            //分享方法
            //缓存执行筛选
            beforeScrDomFun: function () {
                let t = this;
                //先加载本地缓存数据，请求结束后替换
                if (TempCache.getItem('meetFirstScreenData')) {
                    let _tempData = JSON.parse(TempCache.getItem('meetFirstScreenData'));
                    if(_tempData.authMajor){
                        let  data = _tempData.authMajor;
                        if (data) {
                            t.authMajorList = data.responseObject.responseData.authMajorList;
                            t.majorList = data.responseObject.responseData.majorList;
                        }
                    }
                }
                t.scrDomFun();
            },
            //筛选函数操作
            scrDomFun: function () {
                let t = this;
                comm.ajax2({
                    url: xhlUrl.scrBtnUrl,
                    type: "POST",
                    data: {
                        paramJson: JSON.stringify({
                            sessionCustomerId: TempCache.getItem('userId') || '',//1477017802796  1463455407178
                            platformId: TempCache.getItem('department') || 1
                        })
                    },
                    success: function (res) {
                        if (comm.hasResponseData(res)) {
                            if (TempCache.getItem('meetFirstScreenData')) {
                                t.jsonData = JSON.parse(TempCache.getItem('meetFirstScreenData'));
                            }
                            t.jsonData.authMajor = res;
                            TempCache.setItem('meetFirstScreenData', JSON.stringify(t.jsonData));
                            t.authMajorList = res.responseObject.responseData.authMajorList;
                            t.majorList = res.responseObject.responseData.majorList;
                        }
                    }
                });
            },
            //年份和月份操作
            dateRender: function () {
                let t = this;
                //年份 月份数组操作
                let _year = new Date().getFullYear();
                let _month = new Date().getMonth() + 1;
                let _monthArr = [];
                for (let i = _year; i >= 2013; i--) {
                    let yearJson = {
                        year: i,
                        yearActive: false,//年份激活
                        yearMonthTag: false,//年份展开月份的三角标
                    };
                    if (_year === i) {
                        _monthArr = [{month: "全部", monthActive: false}];
                        for (let j = 1; j <= _month; j++) {
                            let monthJson = {
                                month: j + '月',
                                monthActive: false,
                            };
                            _monthArr.push(monthJson);
                        }
                    } else {
                        _monthArr = [{month: "全部", monthActive: false}];
                        for (let j = 1; j <= 12; j++) {
                            let monthJson = {
                                month: j + '月',
                                monthActive: false,
                            };
                            _monthArr.push(monthJson);
                        }
                    }
                    yearJson.monthList = _monthArr;//月份赋值
                    t.dateList.push(yearJson);
                }
            },
            //年份的点击操作
            yearClick: function (index) {
                let t = this, actFlag = false, monFlag = false;
                t.dateList[index].yearActive = true;
                t.dateList[index].monthList[0].monthActive = true;
                for(let i=1; i<t.dateList[index].monthList.length; i++){//月份点击
                    if(t.dateList[index].monthList[i].monthActive){
                        t.dateList[index].monthList[0].monthActive = false;
                        break;
                    }
                }
                if (t.yearClickIndex === index) {//当前年的本身的再次点击
                    t.yearMonthShow = !t.yearMonthShow;
                    t.dateList[index].yearMonthTag = !t.dateList[index].yearMonthTag;
                } else {//点击展开月份
                    t.yearMonthShow = true;//月份
                    for (let i = 0; i < t.dateList.length; i++) {
                        let item = t.dateList[i];
                        i === index ? item.yearMonthTag = true : item.yearMonthTag = false;//年份的三角标
                        if (i !== index) {//排除当前年份的循坏，循环判断其他月份
                            for (let j = 0; j < item.monthList.length; j++) {//循环月份判断年份是否应该激活
                                let kv = item.monthList[j];
                                if (kv.monthActive) {//判断月份是否都未选中，都未选中当前年取消激活
                                    actFlag = true;
                                    break;
                                } else {
                                    actFlag = false;
                                }
                            }
                            if (!actFlag) {//去掉年份的激活
                                item.yearActive = false;
                            }
                        }
                    }
                }
                t.yearClickIndex = index;
            },
            //月份点击
            monthClick: function (index) {
                let t = this,
                    actFlag = false;
                t.dateList[t.yearClickIndex].monthList[index].monthActive = !t.dateList[t.yearClickIndex].monthList[index].monthActive;//class处理

                for (let i = 0; i < t.dateList[t.yearClickIndex].monthList.length; i++) {
                    let item = t.dateList[t.yearClickIndex].monthList[i];
                    if (index === 0) {//全部按钮点击
                        if (i !== 0) {
                            item.monthActive = false;
                        }
                    } else {//普通月份
                        t.dateList[t.yearClickIndex].monthList[0].monthActive = false;//取消全部按钮
                        if (i !== 0) {
                            if (item.monthActive) {//判断月份是否全部选中
                                actFlag = true;
                            } else {
                                actFlag = false;
                                return false;
                            }
                        }
                    }
                }
                if (actFlag) {//如果月份全选中了,激活全部，去掉月份选中
                    for (let i = 0; i < t.dateList[t.yearClickIndex].monthList.length; i++) {
                        let item = t.dateList[t.yearClickIndex].monthList[i];
                        i === 0 ? item.monthActive = true : item.monthActive = false;
                    }
                }
            },
            //弹层中的专业的筛选点击
            majorClick: function (index) {
                let t = this;
                if (t.majorIndex === index && t.sureSubjectTeamId!=="") {
                    t.sureSubjectTeamId = "";
                } else {
                    t.sureSubjectTeamId = t.majorList[index].tagId;
                }
                t.majorIndex = index;
            },
            //顶部用户的个人推荐筛选(专业的)
            authMajorClick: function (index) {
                let t = this;
                if (t.authMajorIndex === index && t.subjectTeamId!=="") {
                    t.subjectTeamIdChange("");
                } else {
                    t.subjectTeamIdChange(t.authMajorList[index].tagId);
                }
                //弹层里边的筛选
                for (let i=0;i<t.majorList.length;i++){
                    let kv=t.majorList[i];
                    if (kv.tagId===t.authMajorList[index].tagId){
                        t.majorIndex = i;//设置筛选弹层里的专业
                        break;
                    }else{
                        t.majorIndex = "";//设置筛选弹层里的专业点击清空
                    }
                }
                t.sureSubjectTeamId = t.subjectTeamId;//设置
                t.authMajorIndex = index;
                t.screeningPopChange(false);//顶部点击将弹层关闭
                //弹层里边的筛选时间置为空
            /*    t.timeReset();//时间项处理
                t.openTimeChange("");//时间置为空*/
            },
            //顶部用户的个人推荐筛选(年份的)
            authMajorTimeClick:function (index) {
                let t=this;
                if (t.authTimeIndex === index && t.openTime.indexOf(t.authMajorList[index].tagId)>-1) {
                    t.openTimeChange("");//时间置为空
                } else {
                    t.openTimeChange(t.authMajorList[index].tagId);
                }
                //弹层里的时间筛选 与顶部的联动
                for (let i=0;i<t.dateList.length;i++){//循环时间年
                    let item=t.dateList[i];
                    if(parseInt(item.year)===parseInt(t.authMajorList[index].tagId)){//点击的是年份
                        if(t.authTimeIndex === index && t.openTime===""){//再次点击的取消
                            item.yearActive=false;
                            item.monthList[0].monthActive=false;
                            t.sureOpenTime="";
                        }else{
                            item.yearActive=true;
                            item.monthList[0].monthActive=true;
                            t.sureOpenTime=item.year+"_";
                        }
                    }else{
                        item.yearActive=false;
                        item.yearMonthTag=false;
                        for (let j=0;j<item.monthList.length;j++){
                            item.monthList.monthActive=false;
                        }
                    }
                }
                t.authTimeIndex=index;
            },
            //确定筛选按钮点击
            sureClick: function () {
                let t = this;
                //初始化上一次的选中年份
                t.sureOpenTime="";
                t.yearMonthShow=false;
                for (let i=0;i<t.dateList.length;i++){//循环时间年
                    let item=t.dateList[i];
                    item.yearMonthTag=false;
                    if(item.yearActive){
                        let _yFlag=false;
                        for (let j=0;j<item.monthList.length;j++){//循环时间月份
                            let kv=item.monthList[j];
                            if(j===0&&kv.monthActive){//全部按钮
                                t.sureOpenTime+=item.year+"_";
                                _yFlag=true;
                                break;
                            }else if (j!==0&&kv.monthActive){//月份循环
                                let _m=parseInt(kv.month);
                                t.sureOpenTime+=item.year+"-"+(_m>9?_m:'0'+_m)+"_";
                                _yFlag=true;
                            }
                        }
                        if(!_yFlag){
                            item.yearActive=false;
                        }
                    }
                }
                if(t.sureOpenTime===""){
                    t.timeReset();
                }
                t.subjectTeamIdChange(t.sureSubjectTeamId);
                t.openTimeChange(t.sureOpenTime.substring(0,t.sureOpenTime.lastIndexOf("_")));
                t.scrBtnClick();//确定按钮的点击唤起筛选按钮的点击
            },
            //重置按钮的点击事件
            resetClick: function () {
                let t = this;
                t.majorIndex = '';//设置筛选弹层里的专业点击清空
                t.sureSubjectTeamId = "";//重置点击 去掉筛选弹层和顶部的选中
                t.timeReset();
            },
            //年份重置函数
            timeReset:function () {
                let t=this;
                for (let i=0;i<t.dateList.length;i++){//循环时间年
                    let item=t.dateList[i];
                    item.yearActive=false;
                    item.yearMonthTag=false;
                    for (let j=0;j<item.monthList.length;j++){//循环时间月份
                        let kv=item.monthList[j];
                        kv.monthActive=false;
                    }
                }
                t.yearClickIndex="";
                t.yearMonthShow=false;
            },
            //筛选按钮点击操作
            scrBtnClick: function () {
                let t = this;
                t.screeningPopChange(!t.scrPopShow);
                if (t.scrPopShow) {
                    comm.bodyScroll();
                    document.querySelectorAll('.screenListNav')[0].style.top
                        = document.querySelectorAll('.fixedHeader')[0].offsetHeight+'px';
                } else {
                    comm.bodyNoScroll();
                }
            },
        },
        computed: {
            ...mapGetters(['scrPopShow','subjectTeamId','openTime']),
        },
        mounted() {
            let t = this;
            t.beforeScrDomFun();//筛选结构的函数
            t.dateRender();//年份操作
        }
    }
</script>

<style scoped>

</style>