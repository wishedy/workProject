<template>
    <section class="al-view-content">
        <HeaderBar :headerConfig="headerConfig" class="al-medPlus-header"></HeaderBar>
        <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                          @infinite-scroll="infiniteScroll" :distance="distanceNum">
            <section class="al-product-list">
                <contactItem v-for="(item,index) in contactList" :key="index" :config="item"></contactItem>
            </section>
        </vue-data-loading>
        <loading v-show="loading"></loading>
    </section>
</template>
<script>

    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import VueDataLoading from 'components/scroll/vue-data-loading.vue';
    import loading from "components/Loading/Loading.vue";
    import productItem from './productItem';
    import comm from 'static/js/comm.js';
    import axios from "axios"
    import contactItem from './contactItem'
    export default  {
        data(){
            return {
                contactList:[],
                loading:false,
                completed:false,
                pageIndex:0,
                pageSize:20,
                distanceNum:100,
                brandList:[],
                headerConfig: {
                    title: "厂商工作人员",
                    backOnOff: true,
                    share: {
                        onOff: false,
                    },
                    feedback: {
                        onOff: false
                    }
                }
            }
        },
        components:{
            productItem,
            HeaderBar,
            VueDataLoading,
            loading,
            contactItem
        },
        computed:{
            brandId(){
                let t = this;
                return comm.getpara().brandId;
            }
        },
        mounted(){
            let t = this;
            document.title = '厂商工作人员';
            t.getFactoryList();
        },
        methods:{
            cutStr(str,len){
                return comm.getStrLen(str,len);
            },
            "infiniteScroll"(){
                let t = this;
                setTimeout(() => {
                    if(!t.completed){
                        t.getFactoryList();
                    }else{
                        return false;
                    }
                }, 300)
            },
            getFactoryList(){
                let t = this;
                if(!t.loading){
                    t.loading = true;
                    axios.get('/mcall/med/brand/getBrandCustomerList/', {
                        params: {
                            paramJson: {
                                searchType:1,//	Integer	是	0-默认1-更多	0
                                "brandId": t.brandId,
                                "firstResult":t.pageIndex*t.pageSize,
                                "maxResult":t.pageSize
                            }
                        }
                    })
                        .then(function (res) {
                            if(res&&res.data&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList&&res.data.responseObject.responseData.dataList.length>0){
                                t.contactList = t.contactList.concat(res.data.responseObject.responseData.dataList);
                                t.completed=(t.contactList.length<t.pageSize);
                                console.log(t.completed);
                                if(!t.completed){
                                    t.pageIndex++;
                                }
                                //console.log(res.data.responseObject.responseData.dataList);
                                //console.log('djdjdjdjdjj');
                            }else{
                                t.completed = true;
                            }
                            t.loading = false;
                        })
                        .catch(function (error) {
                            //console.log(error);
                        });
                }

            }
        }
    }
</script>