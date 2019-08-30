<template>
    <aside class="surgeryCure" v-if="parseInt(data.caseFolderTemplate.isValid)">
        <div class="formSelectS formCommon">
            <div class="articleText">{{data.caseFolderTemplate.structureName}}</div>
            <div class="cont">
                <div class="selectCont"><span>{{dataYear}}</span>
                </div>
                <b>年</b>
                <div class="selectCont width83"><span>{{dataMonth}}</span>
                </div>
                <b>月</b>
                <div class="selectCont width83"><span>{{dataDay}}</span>
                </div>
                <b>日</b>
            </div>
        </div>
    </aside>
</template>

<script>
    export default {
        name: "surgery-cure",
        props:['data'],
        data(){
            return{
                dataYear:'',
                dataMonth:'',
                dataDay:'',
            }
        },
        methods:{
            getNowDate() {
                let date = new Date(),
                    year = date.getFullYear(),
                    month = date.getMonth() + 1,
                    day = date.getDate();
                this.dataYear = year;
                if (month < 10) {
                    month = "0" + month;
                }
                this.dataMonth = month;
                if (day < 10) {
                    day = "0" + day;
                }
                this.dataDay = day;
            }
        },
        mounted(){
            this.getNowDate();
        }
    }
</script>

<style scoped>
    .newCases.thickCase .surgeryCure{
        padding-bottom: 0;
    }
</style>
