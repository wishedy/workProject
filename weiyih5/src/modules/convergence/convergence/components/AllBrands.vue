<template>
    <section class="allBrandsContainer">
        <HeaderBar :headerConfig="headerConfig"></HeaderBar>
        <section>
            <ul class="zone-container">
                <li v-for="(opt, index) in allBrands" :key="index" @click.stop="toBrandPage(opt)">
                    <p class="zone-content">
                        <img :src="opt.brandImage">
                    </p>
                    <p class="zone-title">{{ opt.brandName }}</p>
                </li>
            </ul>
        </section>
        <div class="brands-content-box">
            <div :class="isFixedTitle ? 'fixed-title' : 'noneDiv'">{{ fixTitleName }}</div>
            <div class="contacts" ref="contacts">
                <div v-for="(item, index) in contactsFilter" :key="index" >
                    <div class="title fixTitle" :ref="`position-${item.key}`">{{item.key}}</div>
                    <div class="contact" v-for="(contact, key) in item.lists" :key="key" @click.stop="toBrandPage(contact)">
                        <img class="contact-logo" :src="contact.brandImage">
                        <span class="contact-name">{{ contact.brandName }}</span>
                        <img class="contact-hot" v-if="contact.cooperate" src="http://img50.allinmd.cn/v3/vipShop/hot.png">
                    </div>
                </div>
            </div>
            <!-- A-Z -->
            <div  :class="'quick-position' + (isPositionOnTouch ? ' active' : '')"
                    @touchstart.prevent="onPositionTouchstart"
                    @touchmove.prevent="onPositionTouchmove"
                    @touchend.prevent="onPositionTouchend"
                    ref="position">
                    <div class="shap">热</div>
                    <span v-for="(item, i) in contactsFilter" :key="i">{{item.key}}</span>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import comm from 'static/js/comm';
import HeaderBar from "components/HeaderBar/HeaderBar.vue";
const baseApi = {
    allBrandList: '/mcall/med/brand/getAllBrands/' // 全部品牌
}
export default {
    data() {
        return {
            isFixedTitle: false,
            isPositionOnTouch: false,
            fixTitleName: '',
            titlesOffset: [],
            newContacts: [],
            contacts: [],
            // contacts: [
            //     { key: "A", lists: ["阿良", "阿珂", "阿里"] },
            //     { key: "B", lists: ["阿良", "阿珂"] },
            //     { key: "C", lists: ["阿良"] },
            //     { key: "D", lists: ["阿良", "阿珂", "阿里"] },
            //     { key: "E", lists: ["阿良"] },
            //     { key: "F", lists: ["阿良", "阿珂"] },
            //     { key: "G", lists: ["阿良", "阿珂", "阿里"] },
            //     { key: "H", lists: ["阿良"] },
            //     { key: "I", lists: [] },
            //     { key: "J", lists: ["阿良", "阿珂", "阿里"] },
            //     { key: "K", lists: ["阿良", "阿珂"] },
            //     { key: "L", lists: ["阿良", "阿珂", "阿里", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂"] },
            //     { key: "M", lists: ["阿里"] },
            //     { key: "N", lists: ["阿珂"] },
            //     { key: "O", lists: [] },
            //     { key: "P", lists: ["阿良", "阿里"] },
            //     { key: "Q", lists: ["阿良", "阿珂", "阿里", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂"] },
            //     { key: "R", lists: ["阿良"] },
            //     { key: "S", lists: ["阿良", "阿珂", "阿里"] },
            //     { key: "T", lists: ["阿里"] },
            //     { key: "U", lists: ["阿良", "阿珂", "阿里", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂", "阿珂"] },
            //     { key: "V", lists: [] },
            //     { key: "W", lists: ["阿良", "阿里"] },
            //     { key: "X", lists: ["阿良", "阿珂", "阿里"] },
            //     { key: "Y", lists: ["阿良", "阿珂"] },
            //     { key: "Z", lists: ["阿良"] }
            // ],
            headerConfig: {
                title: "全部品牌",
                backOnOff: true,
                share: {
                    onOff: false
                },
                feedback: {
                    onOff: false
                },
                backFn: () => {
                    this.$router.push({ path: '/convergence' })
                }
            },
            allBrands: [],
            isAndroid: ''
        }
    },
    computed: {
		contactsFilter() {
			let filter = [];
			this.contacts.map(item => {
				if (item.lists.length != 0) {
					filter.push(item);
				}
			});
			return filter;
		}
    },
    mounted() {
        this.getAllBrandList()
        window.addEventListener('scroll', this.handleScroll);
        var device = navigator.userAgent;
        this.isAndroid = device.indexOf('Android') > -1 || device.indexOf('Adr') > -1;
    },
    beforeUpdate() {
        this.$nextTick(() => {
            var titles = document.getElementsByClassName('fixTitle');
            var newTitle = Array.from(titles)
            for (let i = 0; i < newTitle.length; i++) {
                this.titlesOffset.push(newTitle[i].offsetTop)
            }
        })
        this.handleScroll()
    },
    methods: {
        getAllBrandList() {
            axios({
                url: baseApi.allBrandList,
                method: "get",
                params: {
                    paramJson: {
                        columnType: 1,
                        firstResult: 0,
                        maxResult: 8
                    }
                }
            }).then((res) => {
                // console.log(res)
                if (res && res.data.responseObject && res.data.responseObject.responseData) {
                    this.allBrands = res.data.responseObject.responseData.brandCooperate
                    console.log(res.data.responseObject.responseData.brandList)
                    var BrandContent = Array.from(
                        res.data.responseObject.responseData.brandList.reduce((opt, item)=> {
                            if (opt.has(item.sortRefName)) {
                                opt.get(item.sortRefName).push({
                                    brandId: item.brandId,
                                    brandImage: item.brandImage,
                                    brandName: item.brandName,
                                    cooperate: item.cooperate
                                })
                            } else {
                                opt.set(item.sortRefName, [{
                                    brandId: item.brandId,
                                    brandImage: item.brandImage,
                                    brandName: item.brandName,
                                    cooperate: item.cooperate
                                }])
                            }
                            return opt
                        }, new Map())
                    )
                    // var kkk = [];
                    BrandContent.forEach((opt, index) => {
                        this.contacts.push({
                            key: opt[0],
                            lists: opt[1]
                        })
                    })
                    console.log(BrandContent)
                    console.log(this.contacts)
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        toBrandPage(opt) {
            comm.creatEvent({
                triggerType:'品牌点击',
                triggerName:'全部品牌-品牌点击',
                actionId:11853,
                browType:433,
            });
            if (opt.cooperate) {
                setTimeout(fn => {   
                    window.location.href = 'https://m.allinmd.cn/dist/branUpgrade/branUpgrade.html?#/brands?brandId=' + opt.brandId
                }, 300)
                sessionStorage.setItem('isFromConvergence', true)
            } else {
                setTimeout(fn => {   
                    window.location.href = "https://m.allinmd.cn/dist/medPlus/medPlus.html#/brandDetail?brandId=" + opt.brandId + "&brandName=" + opt.brandName
                }, 300)
            }
        },
        handleScroll() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (!!document.querySelector('.brands-content-box')) {
                var offsetTop = document.querySelector('.brands-content-box').offsetTop;
                if (Number(scrollTop) > Number(offsetTop)) {
                    this.searchBarFixed = true
                } else {
                    this.searchBarFixed = false
                }
            } 
            if (scrollTop > document.querySelector('.brands-content-box').offsetTop) {
                this.isFixedTitle = true
            } else {
                this.isFixedTitle = false
            }
            for(let i = 0; i < this.titlesOffset.length; i++) {
                if (scrollTop > this.titlesOffset[i] && scrollTop < this.titlesOffset[i+1]) {
                    if (this.contactsFilter[i]) {
                        this.fixTitleName = this.contactsFilter[i].key
                    }
                }
            }
        },
        backHome() {
            this.$router.push('/convergence');
        },
        onPositionTouchstart(event) {
			this.isPositionOnTouch = true;
            this.onSetPosition(event.changedTouches[0].clientY);
		},
		onPositionTouchmove(event) {
			this.onSetPosition(event.changedTouches[0].clientY);
		},
		onPositionTouchend() {
			this.isPositionOnTouch = false;
		},
		onSetPosition(y) {
			let index = Math.floor(
				// (y - 140) / (this.$refs["position"].clientHeight / this.contacts.length)
				(0.75*y) / (this.$refs["position"].clientHeight / this.contacts.length)
            );
			if (this.$refs["position-" + this.contacts[index].key]) {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                // Chrome pc
				document.documentElement.scrollTop = Math.ceil(
					this.$refs["position-" + this.contacts[index].key][0].offsetTop
                );
                // H5 ios android
                document.body.scrollTop = Math.ceil(
					this.$refs["position-" + this.contacts[index].key][0].offsetTop
                );
                // console.log(this.titlesOffset)
                for(let i = 0; i < this.titlesOffset.length; i++) {
                    if (scrollTop >= this.titlesOffset[i+1] && scrollTop < this.titlesOffset[i+2]) {
                        this.fixTitleName = this.contactsFilter[i].key
                    }
                }
			}
		}
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll)
    },
    components:{
        HeaderBar
    }
}
</script>

<style>
    
</style>
