<template>
    <section class="al-cancelModal show" @click="closeMask">
        <figure class="al-cancelModalItem" :class="$store.state.isWholeLine?'':'interested'" :style="$store.state.setTop">
            <i></i>
            <span>不感兴趣后，将减少此类推荐</span><a class="btn-primary ev_cancelSure" @click="cancelItem">确定</a>
        </figure>
    </section>
</template>

<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    const DeleteByKey = '/mcall/customer/recommendResourceItem/deleteByKey/';
    export default {
        name: "display-action",
        methods:{
            cancelItem(){
                let  t=this,
                     vTarget=this.$store.state.target,
                     cid = TempCache.getItem('userId'),
                     itemId =vTarget.getAttribute('itemId'),
                     itemType=vTarget.getAttribute('itemType');
                if(cid!=undefined&&cid!=""){
                    t.$store.state.loading=true;
                   comm.ajax2({
                        url:DeleteByKey,
                        type:"post",
                        data:{paramJson:$.toJSON({
                                customerId:TempCache.getItem('userId')!=null?TempCache.getItem('userId'):0,
                                itemType:itemType,
                                itemId:itemId,
                                visiteSiteId:2,
                                sessionCustomerId:TempCache.getItem("userId") || "",
                                platformId:TempCache.getItem('department')||1
                            })},
                        dataType:'json',
                        success:function(data){
                            t.$store.state.loading=false;
                            if(data&&data.responseObject&&data.responseObject.responseStatus==true){
                                t.$store.state.contentDelete=false;
                                t.$store.state.el.parentNode.removeChild(t.$store.state.el);
                            }
                        },
                        error:function(){
                            t.$store.state.loading=false;
                            t.$store.state.contentDelete=false;

                        }

                    });
                }else{
                    this.$store.state.contentDelete=false;
                    this.$store.state.el.parentNode.removeChild(this.$store.state.el);
                }
                document.body.style.overflow='auto';
            },
            closeMask(e){
                if(e.target!=document.getElementsByClassName('al-cancelModalItem')[0]){
                    this.$store.state.contentDelete=false;
                    document.body.style.overflow='auto';
                }
            }
        }
    }
</script>

<style scoped>

</style>