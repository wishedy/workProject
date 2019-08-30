<template>
    <header class="reg-header">
        <figure class="reg-header-back">
            <a href="javascript:void(0)" @click="goBack">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAN1JREFUWAntmGsKwjAQhIOH8Bj1UQ/U4wrSk1j1CHUWHAgh9oeB2QWzsCyltPN1suTRlNrigsdn5BW5b3vV708bxAu5fnJClUcJcQeB3JEaxKC2YoRgPhzmhDvE4gXxhDAbMwzEAVDSOEOtdKJDWF9YT3Qn6MRR2pUQOyHzxnzg2gXChDlP/C8ETEi3wgkbInns5IobguaAe3+Qr8PQibKGmEsIVVtx5RPbFox80eswdOBbtZ17vhi67E0IFx5mIKm6hjhg8aNDwdTOv/JDOJ0pYSbe8KgGMyObf9S8ATFWhMFix94CAAAAAElFTkSuQmCC" alt="">
            </a>
        </figure>
        <figure class="reg-header-back">
            <h1>{{title}}</h1>
        </figure>
        <figure class="reg-header-back">
        </figure>
    </header>
</template>

<script>
    const Header = {
        props: {
            title: {
                type: String,
                required: false
            }
        },
        data() {
            return {
            }
        },
        methods: {
            goBack(){
                window.history.go(-1);
            }
        }
    }
    export default Header;

</script>

<style lang="scss" scoped rel="stylesheet/scss">
    header{
        font-family: PingFang SC,"\5FAE\8F6F\96C5\9ED1", Arial, Tahoma, "Hiragino Sans GB W3";
        border: 0;
        margin: 0;
        outline: 0;
        padding: 0;
        text-decoration: none;
    }
    figure{
        margin: 0;
    }
    .reg-header{
        position: relative;
        z-index: 3;
        background-color: #fff;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        -ms-flex-pack: justify;
        -webkit-box-pack: justify;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 0.4rem;
        height: 1.17333rem;
        overflow: hidden;
        .reg-header-back:nth-child(1) {
            text-align: left;
        }
        .reg-header-back {
            width: 3rem;
            height: 100%;
            line-height: 1.17333rem;
            white-space: nowrap;
            img{
                width: 0.45333rem;
                height: 0.45333rem;
                vertical-align: middle;
            }
        }
        .reg-header-back:nth-child(2) h1{
            font-size: 0.45333rem;
            font-weight: normal;
            text-align: center;
        }
        .reg-header-back:nth-last-child(1) {
            text-align: right;
        }
    }
</style>