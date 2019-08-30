<template>
    <section class="college-info-webView">
        <div v-html="dataInfo.detail" v-if="Number(dataInfo.type) === 1" class="college-tab-info-md"></div>
        <div class="college-tab-imgBox" v-else>
            <img class="college-tab-info-bgImg" :src="opt" v-for="(opt, index) in imgsInfo" :key="index" />
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import TempCache from "static/js/tempcache";
const Api = {
    collegeDesc: '/allingateway/base-resource-platform/college/department/getDepartInfo/' // 学院介绍
}
export default {
    data () {
        return {
            dataInfo: {
                detail: '',
                type: 1 //1富文本，2图片地址
            },
            appPort: false,
            imgsInfo: []
        }
    },
    mounted () {
        this.getCollegeDesc();
    },
    methods: {
        getCollegeDesc () {
            axios.get(Api.collegeDesc, {
                params: {
                    departmentId: this.$route.query.departmentId,
                    opUsr: localStorage.getItem("userId")
                }
            }).then((res) => {
                if (res && res.data && res.data.responseData && res.data.responseData.info) {
                    this.dataInfo = res.data.responseData.info
                    this.imgsInfo = this.dataInfo.detail.split(',')
                }
            })
        }
    }
}
</script>


