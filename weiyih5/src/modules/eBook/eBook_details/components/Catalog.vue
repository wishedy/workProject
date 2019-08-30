<template>
    <section class="al-eBookItemContent slide-content" data-role="catalog" style="width: 100%;">
        <section class="al-eBookCatalog" data-alcode-mod="440">
            <article class="al-eBookCatalogItem" v-for="item in catalog">
                <a :href="'/dist/eBook/eBook_chapter.html?articleBook='+item.bookId+'&articleCatalogue='+item.catalogueId+'&catalogueName='+item.catalogueName+'&catalogueNum='+item.catalogueSortId+'&bookName='+bookName+'&articleId='+item.bookId">
                    <span>{{item.catalogueName}}</span>
                    <i class="icon-arrowRight">{{item.sumNum}}</i>
                </a>
            </article>
        </section>
    </section>
</template>

<script>
    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading.vue";
    import {mapActions} from "vuex";
    const URL = '/mcall/cms/book/catalogue/getMapList/';
    export default {
        data() {
            return {
                ajaxing: false,
                noData: false,
                catalog: [],
                catalogParam: {
                    bookId: this.$store.state.bId,
                    pageSize: 10,
                    pageIndex:1
                },
                catalogList: false,
                articleBook:'',
                bookName:'',
				noChangeTab:true
            }
        },
		beforeDestroy(){
			this.noChangeTab =false;
		},
        mounted() {
            this.ajax();
        },
        methods: {
            getCatalog() {
                let t = this;
                let scrollTop = 0;
                window.addEventListener('scroll', function () {
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 50) {
                        if (!t.ajaxing && !t.noData && t.noChangeTab){
                            t.ajax();
                        }
                    }
                }, false);
            },
            ajax() {
                let t = this;
                t.ajaxing = true;
                t.trigger(true);
                comm.ajax2({
                    url: URL,
                    type: "post",
                    data: {paramJson: JSON.stringify(t.catalogParam)},
                    dataType: "json",
                    success: function (res) {
                        t.ajaxing = false;
                        t.trigger(false);

                        if(comm.hasResponseData(res)){
							t.$store.state.catlogNum = res.responseObject.responseData.total_count;
                            let dataList = res.responseObject.responseData.data_list;
                            t.catalogParam.pageIndex++;

                            t.catalog = t.catalog.concat(dataList);
                            t.getCatalog();
                            if(dataList.length<10){
                                t.noData = true;
                            }
                        }else{
                            t.noData = true;
                        }
                    }
                });
            },
            ...mapActions(["trigger"])
        },
        watch:{
            "$store.state.urlData"(){
                this.articleBook = this.$store.state.urlData.articleBook;
                this.bookName = this.$store.state.urlData.bookName;
            }
        }
    }
</script>