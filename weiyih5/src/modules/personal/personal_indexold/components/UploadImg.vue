<template>
    <section>
        <section class="al-mainInner ev-uploadInner">
            <!-- 头部信息 -->
            <header class="al-personalChangeImgHeader">
                <h2><a href="javascript:;" class="al-personalChangeImgBack ev-backMain" @click="back"><img src="//img50.allinmd.cn/pages/personal/arrow_back.png" alt=""></a>个人头像</h2>
            </header>
            <section class="al-personalChangeImgInner" v-if="isnew">
                <section class="al-personalImg">
                   <p class="ev-cropper cropperImg">
                       <img class="ev-bigLogo" :src="logoUrl" alt="" id="target">
                   </p>
                </section>
            </section>
            <figure class="al-personalChangeImgBtn" v-if="isnew">
                <button v-if="change">更换头像
                    <input type="file" name="file" class="al-personalChangeImg" id="ev-uploadBtn" @change="selectImg">
                </button>
                <div class="newState" v-show="!change">
                    <!--<label class="btn" for="upload2">取消</label>-->
                    <!--<input type="file" id="upload2" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/jpg" @change="selectImg">-->
                    <span @click="cancelBtn">取消</span>
                    <span @click="ensure">确认</span>
                </div>
            </figure>
        </section>
    </section>
</template>

<script type="text/ecmascript-6">
  import comm from 'static/js/comm.js';
  import commPopup from 'static/js/commPopup';
  import {mapActions,mapGetters} from  "vuex";

  const path={
    getBigLogo:"/mcall/comm/data/logourl/getMapById/",//获取头像
    logoUpload:"/mcall/comm/upload_attachment/upload/",//上传图片
    newLogoUpload:"/mcall/comm/upload_attachment/uploadLogo/",//新上传图片
  };
  export default{
    data(){
      return {
          config:{},
          logoUrl:"//img50.allinmd.cn/authentication/auth/head_portraits.png",
          cuId:localStorage.getItem('userId'),
          upSuccess:false,
          berforLogo:'',
          isnew:'',
          change:true,
          global_api:'',
          option:{
              img:'',
              size:'',
              outputType:''
          }
      }
    },
    computed:{
      ...mapGetters(["cId","uploadIng"]),
    },
    watch:{
        "$store.state.showUploadImg"(){
            this.isnew = this.$store.state.showUploadImg;
            this.logoUrl=this.$store.state.logoUrl||"//img50.allinmd.cn/pages/personal/no_head.png";
            this.berforLogo=this.$store.state.logoUrl||"//img50.allinmd.cn/pages/personal/no_head.png";
        }
    },
    methods:{
      ...mapActions(["showUpload","changeUpload","setLogoUrl","showUploadSuccess"]),
      back(){
        let t=this;
        comm.creatEvent({
          triggerType:'全站功能按钮点击',
          keyword:t.cuId,
          actionId:41
        });
        setTimeout(function(){
          t.showUpload(false);
            $('.cropper-container').remove();
            $('.al-personalChangeImgInner').removeClass('ChangeCropper');
            $('.ev-bigLogo').removeClass('cropper-hidden');
           // t.logoUrl=t.berforLogo;
            t.change = true;
        },500)
      },
      getBigLogo(){
        let t=this;
        let data={};
        data.refId=localStorage.getItem('userId');
        data.logoType=10;
        data.logoUseFlag=2;
        data.visitSiteId=2;
        comm.ajax2({
          type : "post",
          url : path.getBigLogo,
          data : {paramJson:JSON.stringify(data)},
          success : function(rep){
            if(rep&&rep.responseObject&&rep.responseObject.responseData&&rep.responseObject.responseData.data_list){
              let data=rep.responseObject.responseData.data_list[rep.responseObject.responseData.data_list.length-1];
              t.logoUrl=data.logoUrl;
              t.berforLogo=data.logoUrl;
            }
          },
          error:function(){}
        });
      },
        selectImg(event){
            let t=this;
            let uploadBtn = document.getElementById("ev-uploadBtn");
            if(!/\.((JPEG)|(jpeg)|(jpg)|(JPG)|(png)|(PNG))$/i.test(uploadBtn.value)&&uploadBtn.value){
                commPopup.popup('只允许上传.jpg .jpeg .png类型的图片文件');
                uploadBtn.value="";
                return false ;
            };
            if(comm.getFileSize(document.getElementById("ev-uploadBtn"))>1048576*10){
                commPopup.popup('图片不能大于10M');
                uploadBtn.value="";
                return false ;
            }
            /*读取照片*/
            $('.al-personalChangeImgHeader').hide();
            var file = event.target.files[0];
            var newUrl = URL.createObjectURL(file);
            t.logoUrl = newUrl;
            t.change = false;
            $('.al-personalChangeImgInner').addClass('ChangeCropper');
            /**
             * 2018/5/8
             * */
            var $image = $('.ev-cropper>img'),naturalHeight;
            $image.attr("src", t.logoUrl);
            $image.on("load", function() {
                $image.cropper({
                    aspectRatio: 1/1,
                    autoCropArea:0.8,
                    dragCrop:false,
                    resizable:false,
                    zoomable:false,
                    viewMode:1,
                    dragMode:'move',
                    // zoomable:true,
                    touchDragZoom:false,
                    // touchDragZoom:true,
                    // minContainerWidth:
                    crop: function(data) {
                        // console.log($('.ChangeCropper').height())
                        // console.log($('.cropper-container').height())
                        // console.log($('.cropper-canvas').width())
                        // console.log($('.cropper-container').width())

                        $('.cropper-container').css({
                            // 'width':$('.cropper-canvas').width()+'px',
                            // 'transform':'translateX(0px)',
                            'marginTop':($('.ChangeCropper').height()-$('.cropper-container').height())/2+'px'
                        });
                        // $('.cropper-canvas').css({
                        //     'transform':'translateX(0px)',
                        // })

                    }
                });
            });

            if($('.cropper-container').length>0){
                $image.cropper('replace',t.logoUrl );
            }
            // $('.cropperImg').css({
            //     'transform': 'translateX(-50%) translateY(-50%)'
            // })

        },
        ensure(){
          let t=this;
          $('.cropper-container').remove();
            $('.al-personalChangeImgInner').removeClass('ChangeCropper');
          $('.ev-bigLogo').removeClass('cropper-hidden');
            $('.al-personalChangeImgHeader').show();
            t.change = true;
            var photo = $('.ev-cropper>img').cropper('getCroppedCanvas', {
                width: 300,
                height: 300
            }).toDataURL('image/png');
            t.changeUpload(true);//修改上传状态
            t.showUpload(false);//上传组件隐藏
            $.ajax({
                type: "POST",
                url: path.newLogoUpload,
                data:{paramJson:JSON.stringify({
                        fileContent:photo.split('data:image/png;base64,')[1],
                        imageType:1,
                        extName:'png',
                        isValid:1
                    })},
                dataType:'json',
                success: function (data) {
                    t.upSuccess=true;
                    if (data&&data.responseObject&&data.responseObject.responseStatus){
                        t.logoUrl=data.responseObject.responseMessage.url;
                        t.berforLogo=data.responseObject.responseMessage.url;
                        t.setLogoUrl(t.logoUrl);
                        t.changeUpload(false);
                        t.showUploadSuccess(true);
                        setTimeout(function(){
                            t.showUploadSuccess(false);
                        },2000);
                    }else {
                        commPopup.popup("上传失败");
                        t.changeUpload(false);//修改上传状态//上传状态父层隐藏
                    }
                },
                error: function(data) {
                    setTimeout(function() {
                        if (!t.upSuccess) {
                            commPopup.popup("上传失败");
                            t.changeUpload(false);//上传状态父层隐藏
                        }
                    },2000);
                }
            });

        },
        cancelBtn(){
            $('.al-personalChangeImgHeader').show();
            $('.cropper-container').hide();
            $('.al-personalChangeImgInner').removeClass('ChangeCropper');
            $('.ev-bigLogo').removeClass('cropper-hidden');
            this.logoUrl=this.berforLogo;
            this.change = true;
        },
      upload(){
        let t=this;
        let uploadBtn=document.getElementById("ev-uploadBtn");
        if(!/\.((JPEG)|(jpeg)|(jpg)|(JPG)|(png)|(PNG))$/i.test(uploadBtn.value)){
          commPopup.popup('只允许上传.jpg .jpeg .png类型的图片文件');
          uploadBtn.value="";
          return false ;
        };
        if(comm.getFileSize(document.getElementById("ev-uploadBtn"))>1048576*10){
          commPopup.popup('图片不能大于10M');
          uploadBtn.value="";
          return false ;
        }
        t.changeUpload(true);//修改上传状态
        t.showUpload(false);//上传组件隐藏

        $.ajaxFileUpload({
          type: 'POST',
          url: path.logoUpload,
          data:{
              paramJson: '{imageType:1,fileContent:1,extName:}'
          },
            fileContent:'64留',
            extName:'后缀',
          secureuri: false,
          fileElementId: "ev-uploadBtn",//file控件id
          dataType: '',
          success: function (data, status) {
            uploadBtn.value="";
            let dataJSON = eval("(" + data.body.innerText + ")");
            if (dataJSON.responseObject.responseStatus) {
                t.upSuccess=true;
                t.setLogoUrl(dataJSON.responseObject.responseMessage.url);
                t.getBigLogo();
                t.changeUpload(false);//上传成功显示
                t.showUploadSuccess(true);
                setTimeout(function(){
                  t.changeUpload(true);
                  t.showUploadSuccess(false);
                },2000);
            } else {
              commPopup.popup("上传失败");
              t.changeUpload(false);//修改上传状态//上传状态父层隐藏
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              setTimeout(function() {
                  if (!t.upSuccess) {
                      commPopup.popup("上传失败");
                      t.changeUpload(false);//上传状态父层隐藏
                  }
              },2000);
          }
        });
      }
    },
    mounted(){
      this.getBigLogo();
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import 'scss/pages/personal/personal_changeImg.scss';
    .jcrop-light{
        /*width:100%;*/
        /*height:800px;*/
        border:1px solid #f00;
    }
    .newState{
        position: fixed;
        bottom:0.6933rem;
        width:100%;
        z-index: 2;
        span,.btn{
            /*color: #93a1aa;*/
            /*font-size:0.4533rem;*/
            color: #fff;
            font-size: rem(37px);
        }
        :first-child{
            float:left;
            margin-left:0.5333rem;
        }
        :last-child{
            float:right;
            margin-right:0.5333rem;
        }
    }
    .ChangeCropper{
        margin-top: 0;
        position: fixed;
        /*top:rem(88px);*/
        top:0;
        /*padding-top: rem(88px);*/
        bottom: 0;
        z-index: 1;
        height: 100%;
        background: #000;
        .al-personalImg{
            /*display: table;*/
            /*position: relative;*/
        }
        .cropperImg{
            /*<!--border: 1px solid #fff;-->*/
            /*<!--position: absolute;-->*/
            /*<!--top: 40%;-->*/
            /*<!--left: 50%;-->*/
            /*<!--transform: translateX(-50%)  translateY(-50%);-->*/
        }
        .cropperImg{
            /*display: table-cell;*/
            /*vertical-align: middle;*/
        }
    }
</style>