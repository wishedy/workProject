<template>
    <section class="seat-content-wrap" v-if="!isEmptyObject(config)" >
        <section class="seat-content" :class="{'top':config.isTop===1}" @click.stop="openPersonal({
         cid:config.cid
        })" @mousedown.stop="trackAction({
        browseName:'组织成员',
                            actionName:'查看成员',
                            keyWord:'菁英会',
                            actionId:'11675',
                            refId:config.cid
        })">
            <section class="seat-doctor-logo" :style="{background: 'url('+config.imageUrl+') no-repeat center center/cover'}">
                <i class="dot"></i>
            </section>
            <section class="seat-doctor-info">
                <div class="seat-doctor-name">
                    <div class="doctor-name" v-text="config.doctorName"></div>
                    <div class="doctor-position" :class="'doctorPosition'+config.position.length" v-text="config.position" v-if="config.isTop===0"></div>
                    <div class="doctor-position  doctorPositionChairMan" v-text="config.position" v-if="config.isTop===1"></div>
                </div>
                <div class="seat-doctor-company" v-text="config.company"></div>
            </section>
        </section>
    </section>

</template>
<script>
    import comm from 'static/js/comm.js';
    import EliteSdk from '../untils/eliteCommSdk';
    export default {
        props:{
            config:{
                default(){
                    return {};
                }
            }
        },
        methods:{
            isEmptyObject(obj){

                return comm.isEmptyObject(obj);
            },
            openPersonal(config){
                EliteSdk.openPersonal({
                    cid:config.cid
                });
            },
            trackAction(config){
                console.log(JSON.stringify(config));
                EliteSdk.trackAction(config);
            }
        },
        mounted(){
            setTimeout(()=>{
                $(".seat-doctor-logo .dot").each(function(){
                    let isThisElement = $(this);
                    isThisElement.width(isThisElement.height());
                    isThisElement.css({"borderRadius":'50%'});
                });
            },300);
        }
    }
</script>