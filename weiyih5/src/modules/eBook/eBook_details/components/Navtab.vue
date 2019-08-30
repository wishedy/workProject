<template>
    <nav class="al-eBookContentChange slide-navbar" data-alcode-mod="437" data-alcode-item-selector="figure" data-alcode-mod-max-idx="3" v-show="!onlyComment">
        <router-link tag="figure" to="/article" class="al-eBookContentChangeItem" active-class="active" v-if="article" replace>
            文章<span>{{artNum}}</span>
        </router-link>
        <router-link tag="figure" to="/catalog" class="al-eBookContentChangeItem" active-class="active" v-if="catalog" replace>
            目录<span>{{catNum}}</span>
        </router-link>
        <router-link tag="figure" to="/comment" class="al-eBookContentChangeItem" :active-class="onlyComment?'':'active'" replace>
            评论<span>{{revNum}}</span>
        </router-link>
    </nav>
</template>
<style>
    .al-eBookContentChange.alignLeft{
        text-align:left;
    }
</style>
<script>
    export default{
        data(){
            return {
                article:true,
                catalog:true,
                comment:true,
                onlyComment:false /*只有评论*/
            }
        },
        computed:{
            artNum(){
            	return this.$store.state.articleNum
            },
            revNum(){
            	return this.$store.state.reviewNum
            },
            catNum(){
            	return this.$store.state.catlogNum
            }
        },
        watch:{
            "$store.state.bookstate"(){
                let hasBook = this.$store.state.bookstate.hasBook;
                let hasArticle = this.$store.state.bookstate.hasArticle;
                if(hasBook ==1 && hasArticle ==0){
                    this.article = false;
                    this.catalog = false;
					this.onlyComment = true;
					this.$store.state.onlyComment = true;
					this.$router.replace({
						name:'comment'
					});
                }
                if(hasBook ==0 && hasArticle ==0){

                    this.article = false;
                    this.catalog = false;
					this.onlyComment = true;
					this.$store.state.onlyComment = true;
					this.$router.replace({
						name:'comment'
					});
                }
            }
        }
    }
</script>

