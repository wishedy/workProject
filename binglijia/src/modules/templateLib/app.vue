<template>
    <!--<tp-comm typeName="newCase"></tp-comm>-->
    <tp-comm ></tp-comm>
</template>
<script>
    import tpComm from '~components/tpComm/tpComm'
export default {
    name: 'index-app',
    data() {
        return {

        }
    },
    components: {
        tpComm
    },
    async mounted() {
        // axios({
        //     method: 'post',
        //     url: '/call/ad/position/profile/getMapList/',
        //     data: {"firstResult":0,"maxResult":10,"visitSiteId":1,"channelId":68,"isIndex":1,"platformId":"1","customerId":"1399252409974"},
        //     transformRequest: [function (data) {
        //         return "paramJson=" + JSON.stringify(data);
        //     }],
        //     headers: {
        //         'X-Requested-With': 'XMLHttpRequest'
        //     },
        //     timeout: 30000
        // }).then(function (res) {
        //     console.log(res)
        // });

    },
    metaInfo: {
        title: '模板库'
    }
}
</script>
<style lang="scss">


</style>
