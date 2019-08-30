<template>
    <header class="al-eBookBaseMessage" data-alcode-mod="436">
        <section data-book="1483411367649">
            <figure class="al-eBookImg">
                <img :src="bookList.picUrl?bookList.picUrl:'//img50.allinmd.cn/v3/icon/book_img_default.png'" alt="已有图片有占位">
            </figure>
            <figcaption class="al-eBookBaseMessageContent">
                <article>
                    <h3>{{bookList.docName}}</h3>
                    <p><span>{{bookList.browseNum==''?0:bookList.browseNum}}</span>浏览</p>
                    <p class="transformerNum"><a :href="'/dist/eBook/eBook_transformerList.html?bookId='+bookList.bookId">书籍参与者</a></p>
                </article>
            </figcaption>
        </section>
        <article class="al-eBookIntroduce" v-show="unfoldBtn(bookList.docAbstract)">
            {{bookList.docAbstract | cut}}
            <p class="al-contentShow" @click="onOff" v-if="countStr(bookList.docAbstract)">展开</p>
        </article>
        <div class="al-eBookIntroduce contentFull" v-show="!unfold">
            {{bookList.docAbstract}}
            <p class="al-contentShow" style="bottom: 0.2rem;"  @click="onOff">收起</p>
        </div>
    </header>
</template>
<script>
    import comm from "static/js/comm";
    import {mapActions} from "vuex";
    const PATH = '/mcall/cms/doc/getMapByBookList/';
    export default {
        data(){
            return{
                BookBMParam:{
                    docId:this.$store.state.bId,
                    visitSiteID:"2",
                    pageIndex:"1",
                    pageSize:"6",
                    scene:14
                },
                bookList:[],
                unfold:true,
            }
        },
        mounted() {
            this.ajax()
        },
        methods: {
            ajax() {
                let t = this;
                t.trigger(true);
                comm.ajax2({
                    url: PATH,
                    type: "post",
                    data: {paramJson: JSON.stringify(t.BookBMParam)},
                    dataType: "json",
                    success: function (res) {
                        t.trigger(false);
                        let options = {
                            success(res) {
                                t.bookList = res.responseObject.responseData.data_list[0];
                                t.$store.state.reviewNum = t.bookList.reviewNum;
                                t.accept({
                                    hasBook:t.bookList.hasBook,
                                    hasArticle:t.bookList.hasArticle
                                });
                                t.urlstore({
                                    articleBook:t.bookList.bookId,
                                    bookName:t.bookList.docName,
                                });
                                t.change(t.bookList.docName);
                            },
                            failed() {
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                });
            },
            onOff(){
                this.unfold = !this.unfold;
            },
            unfoldBtn(v){
                if(v && this.unfold){
                    return true;
                }
            },
            countStr(v){
                if (v) {
                    if (comm.getByteLen(v) > 80) {
                        return true;
                    }else{
                        return false;
                    }
                }
            },
            ...mapActions(["trigger","change","accept","urlstore"])
        },
        filters:{
            cut:v=>comm.getStrLen(v, 72),
        }
    }
</script>