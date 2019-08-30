<template>
  <section class="outpatient-order-inner">
    <header class="outpatient-order-header">
      <h2>请选择门诊时间</h2>
    </header>
    <section class="outpatient-order-calendar-content">
      <header class="outpatient-order-base">
        <figure class="outpatient-order-logo">
          <img :src="doctorLogo" alt="">
        </figure>
        <p class="outpatient-order-base-info">
          <span class="name">{{doctorInfo.nick}}</span>
          <span class="title" v-if="doctorInfo.title">{{doctorInfo.title}}</span>
        </p>
      </header>

      <section class="outpatient-order-calendar">
        <Calender
          ref="calendarData"
          :isAppStyle="calendarData.isApp"
          :lunar="calendarData.lunar"
          :value="calendarData.value"
          :begin="calendarData.begin"
          :end="calendarData.end"
          :enough="calendarData.enough"
          :hasCount="calendarData.hasCount"
          @select="calendarData.select"
          @selectHasCount="calendarData.selectHasCount"
        >
        </Calender>
      </section>
    </section>
    <BackIndex v-if="backIndexShow"></BackIndex>
  </section>
</template>

<script>
  /**
   * @Desc：门诊邀约选择
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/4/28.
   */
  import Calender from "components/calendar/calendar"; // 日历组件
  import BackIndex from "components/backIndex"; // 返回首页组件

  /**************************Axios Http Requests*************************/
  import getDoctorBaseMsg from "common/js/HttpRequest/getDoctorBaseMsg"; // 获取医生数据
  import getDoctorSchedule from "common/js/HttpRequest/getDoctorSchedule"; // 获取医生某段事件内排班（精简版）

  /**************************Common Methods*************************/
  import storage from "localStorage";
  import dataLog from "dataLog";

  export default {
    data() {
      return {
        calendarData: {
          isApp: false,
          value: [],
          enough: {},
          hasCount: {},
          lunar: true, //显示农历
          select(begin, end) {
          },
          selectHasCount(time) {
          }
        },
        toastTips: "", // toast框提示的内容
        toastShow: "", // toast框是否显示
        doctorInfo: {}, // 医生数据
        doctorCustomerId: 0, // 医生的customerId
        caseId: 0, // bingliId
        timeInfoList: [], // 排班日期列表
        backIndexShow: false, // 返回首页是否显示
      }
    },
    onShow(){
      dataLog.enterBrowse();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    methods: {
      //显示Toast提示
      showToast(text) {
        wx.showToast({
          title: text,
          icon: "none",
          duration: 2000
        })
      },
      // 去页面
      goOutpatientOrder() {
        this.$router.push({
          name: "outpatientOrder",
        });
      },

      getDoctorMsg() {
        return getDoctorBaseMsg({
          doctorCustomerId: this.doctorCustomerId,
          logoUseFlag: 5
        }).then(data => {
          if (data.responseObject && data.responseObject.responseData) {
            const dataList = data.responseObject.responseData.dataList[0];
            this.doctorInfo = {
              avatar: dataList.logoUrl,
              nick: dataList.customerName,
              title: dataList.medical,
              hospital: dataList.company
            }
          }
        });
      },
      // 获取日历信息
      getTimeInfo() {
        return getDoctorSchedule({
          doctorCustomerId: this.doctorCustomerId,
          caseId: this.caseId,
          deptcode: "",
        }).then(data => {
          console.log(data);
          if (data.responseObject && data.responseObject.responseData) {
            this.timeInfoList = data.responseObject.responseData.dataList;
            // 处理日历的数据
            this.setCalenderData();
          }
        })
      },
      // 设置日历的数据
      setCalenderData() {
        const that = this;
        let enough = {}, hasCount = {};
        this.timeInfoList.map(item => {
          console.log(item);
          if (item.scheduleflag == 1) {
            hasCount[item.outpdate.replace(/-0/g, "-")] = '有号';
            // console.log(hasCount);
          } else if (item.scheduleflag == -1) {
            enough[item.outpdate.replace(/-0/g, "-")] = '约满';
          }

        });
        this.calendarData = {
          isApp: false,
          value: [],
          enough,
          hasCount,
          lunar: true, //显示农历
          select(begin, end) {
          },
          selectHasCount(time) {
            that.selectTime(time);
          }
        }
      },
      // 点击预约日期
      selectTime(time) {
        let timeTemp = time.join('-');
        let obj = {
          year: time[0],
          month: time[1],
          day: time[2],
          weekDay: '',
          timeinterval: [],
          scheduleid: [],
        };
        this.timeInfoList.map(item => {
          if (item.outpdate == timeTemp) {
            obj.weekDay = item.week;
            item.data_list.map(itemTwo => {
              obj.timeinterval.push(itemTwo.timeinterval);
              obj.scheduleid.push(itemTwo.scheduleid)
            });
            return;
          }
        });

        storage.setItem('calenderParams', JSON.stringify(obj));

        wx.navigateTo({
          url: `/packageA/outpatientOrder/outpatientOrder?doctorCustomerId=${this.doctorCustomerId}&caseId=${this.caseId}&patientId=${this.patientId}`
        });
      },
      // 页面初始化
      mountedInit() {
        let that = this;

        that.getDoctorMsg();
        that.getTimeInfo();
      }

    },
    onLoad () {
      if (wx.getStorageSync("backIndex")) {
        this.backIndexShow = true;
      } else {
        this.backIndexShow = false;
      }
    },
    mounted() {
      const query=this.$root.$mp.query;

      this.doctorCustomerId=query.doctorCustomerId;
      this.caseId=query.caseId;
      this.patientId=query.patientId;

      wx.setNavigationBarTitle({
        title: '预约门诊'
      });
      this.mountedInit();

    },
    components: {
      Calender,
      BackIndex
    },
    computed: {
      doctorLogo() {
        if (this.doctorInfo.avatar) {
          return this.doctorInfo.avatar;
        } else {
          return "/src/common/image/imScene/default.png";
        }
      }
    }
  }
</script>

<style lang="scss">
  .outpatient-order-inner {
    background-color: #F2F4F7;
    width: 100%;
  }

  .outpatient-order-header {
    padding-top: 76px;
    padding-bottom: 102px;
    background-image: linear-gradient(0deg, #01D1C2 5%, #039D94 92%);
    padding-left: 48px;
    box-sizing: border-box;
    & > h2 {
      font-size: 48px;
      font-weight: normal;
      color: #FFFFFF;
    }
  }

  .outpatient-order-calendar-content {
    position: relative;
    margin: 0 20px;
    top: -62px;
    border-radius: 8px;
    background-color: #fff;
    padding: 28px;
    box-sizing: border-box;
  }

  .outpatient-order-base {
    font-size: 0;
    .outpatient-order-logo {
      width: 60px;
      height: 60px;
      display: inline-block;
      vertical-align: middle;
      & > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
        border-radius: 50%;
      }
    }
    .outpatient-order-base-info {
      display: inline-block;
      vertical-align: middle;
      .name {
        font-size: 34px;
        color: #222222;
        vertical-align: middle;
        margin-left: 20px;
        margin-right: 16px;
      }
      .title {
        font-size: 30px;
        color: #555555;
        vertical-align: middle;
      }
    }
  }

  .outpatient-order-calendar {
    border-top: 1px solid #f0f0f0;
    margin-top: 32px;
    padding-top: 32px;
  }
</style>
