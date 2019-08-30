<template>
    <section>
        <nav class="al-eBookContentChange slide-navbar" data-alcode-mod="437" data-alcode-item-selector="figure" data-alcode-mod-max-idx="3">
            <router-link class="al-eBookContentChangeItem slide-navbarItem" tag="figure" to="/article" active-class="active" replace>
                    <figcaption>文章{{article}}</figcaption>
            </router-link>
            <router-link class="al-eBookContentChangeItem slide-navbarItem" tag="figure" to="/video" active-class="active" replace>
                    <figcaption>视频{{video}}</figcaption>
            </router-link>
        </nav>
    </section>
</template>

<script>
    export default {
        props:[status],
        data(){
            return {
                article:'',
                video:''
            }
        },
        watch:{
            "$store.state.docCount"(){
                this.article = this.$store.state.docCount;
            },
            "$store.state.deoCount"(){
                this.video = this.$store.state.deoCount;
            }
        }
    }
</script>


