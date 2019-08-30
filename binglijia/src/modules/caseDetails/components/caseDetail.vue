<template>
    <div>
        <div class="detslideCon" :style="{height:navHeight+'px'}">
            <ul>
                <li :class="{detSliItem:true,active:listIndex==-1}" @click.stop="itemCli(-1)">基本信息</li>
                <li :class="{detSliItem:true,active:index == listIndex}" v-if="item.isHaveContent==1" :data-index="index" :data-index2="listIndex" v-for="(item,index) in detailItem" @click.stop="itemCli(index,item.structureId)" :data-id="item.structureId">{{item.structureName}}</li>
            </ul>
        </div>
        <section class="alEmr-mainIndex">
            <section class="alEmr-indexInner">
                <section class="caseDetailCon">
                    <!--用户基本信息-->
                    <section class="detInfo tagItem isNum detBasInfo">
                        <section class="detItem detMust">
                            <span class="detTitle">基本信息</span>
                            <article class="detDesc">
                                <p>{{baseInfoCon.patientName}}</p>
                                <p style="margin: 0 28px">{{baseInfoCon.patientSex==1?'男':'女'}}</p>
                                <p>{{baseInfoCon.patientAge,5|ymdFilter}}</p>
                            </article>
                        </section>
                        <!--<section class="detItem detMust">-->
                            <!--<span class="detTitle">性别</span>-->
                            <!--<article class="detDesc">-->
                                <!--<p>{{baseInfoCon.patientSex=='1'?'男':'女'}}</p>-->
                            <!--</article>-->
                        <!--</section>-->
                        <!--<section class="detItem detMust">-->
                            <!--<span class="detTitle">年龄</span>-->
                            <!--<article class="detDesc">-->
                                <!--<p>{{baseInfoCon.patientAge,5|ymdFilter}}</p>-->
                            <!--</article>-->
                        <!--</section>-->
                        <section class="detItem detPhone" v-if="baseInfoCon.patientMobile">
                            <span class="detTitle">电话</span>
                            <article class="detDesc">
                                <p>{{baseInfoCon.patientMobile}}</p>
                            </article>
                        </section>
                        <!--编号类别1-住院号2-床位号3-病历号4-身份证号5-军官号'-->
                        <section class="detItem" v-if="item.numberContent" v-for="(item,index) in numberContentList">
                            <span class="detTitle">{{item.numberType|numType}}</span>
                            <article class="detDesc">
                                <p>{{item.numberContent}}</p>
                            </article>
                        </section>
                        <section class="detItem" v-if="baseInfoCon.tagList!=''">
                            <span class="detTitle">标签</span>
                            <article class="detDesc">
                                <p>{{baseInfoCon.tagList|tagNameFil}}</p>
                            </article>
                        </section>
                        <section class="detItem" v-if="baseInfoCon.belongType==1"><!--0--个人，1--团队-->
                            <span class="detTitle">归属</span>
                            <article class="detDesc">
                                <p>{{baseInfoCon.belongType==0?'个人':baseInfoCon.teamName}}</p>
                            </article>
                        </section>
                        <section class="detItem" style="height: 1px">
                            <article class="detDesc"></article>
                        </section>
                    </section>
                    <!--1-单选-下拉列表
                        2-单选-下拉列表-其他
                        3-多选-下拉列表
                        4-多选-下拉列表-其他
                        5-时间控件（岁月天）
                        6-时间控件（年月日）
                        7-时间控件（月周天）
                        8-文本
                        9-数值
                        10-视频/图片'-->
                        <section class="tagItem" v-for="(dataItem,dataIndex) in detailItem" :data-id="dataItem.structureId">
                            <!--isCopy==0普通数据-->
                            <section :class="{detInfo:true,isNum:structureId(item.structureId,index,recursion,true)}" v-if="(item.index==dataIndex)" v-for="(item,index) in recursion" :data-parentId="structureId(item.structureId,index,recursion)">
                                <div class="itemCon" v-if="item.type!=10&&item.content">
                                    <section class="detItem"><!--单选下拉列表里的其他-->
                                        <span class="detTitle">{{item.structureName}}</span>
                                        <article class="detDesc">
                                            <p v-html="ymdFilterFn(item.content,item.type)"></p>
                                        </article>
                                    </section>
                                </div>
                                <div class="itemCon" v-if="(item.type==10)&&((item.attVideoList&&item.attVideoList.length)||(item.attPicList&&item.attPicList.length))">
                                    <section class="detItem">
                                        <span class="detTitle">{{item.structureName}}</span>
                                        <article class="detDesc">
                                            <article :class="{detImgs:true,borderNone:!item.attVideoList&&!item.attPicList&&!item.content}">
                                                <!--图片-->
                                                <ul class="detImgList" @click.stop="viewBigImg">
                                                    <li class="ev-bigImg" v-show="picInd<4" v-for="(picIte,picInd) in item.attPicList" :listId="picIte.id">
                                                        <div class="detViewImg">
                                                            <img :src="picIte.attUrl"/>
                                                        </div>
                                                        <div class="remarkMask"  ref="remarkMaskItem" :class="{'remarkMaskReady':!checkInvalid(picIte.remarks)}">
                                                            <div class="remarkMaskEditPanel" :remarkValue="picIte.remarks">
                                                                <div class="recordPanel" v-text="picIte.remarks"></div>
                                                            </div>
                                                        </div>
                                                        <p class="detImgMore" v-show="item.attPicList&&item.attPicList.length>4">还有<span v-text="(item.attPicList.length)-3"></span>张></p>
                                                    </li>
                                                </ul>
                                                <!--视频-->
                                                <ul class="detImgList">
                                                    <li v-for="(vidIte,vidInd) in item.attVideoList" @click.stop="(vidIte.qiniuStatus==2)&&videoCli(vidIte.attUrl)">
                                                        <div class="detViewImg detViewVideo">
                                                            <img v-bind:src="vidIte.qiniuStatus==2?vidIte.videoPicUrl:'//img10.allinmd.cn/default/qiniu196_196.jpg'"/>
                                                            <i class="detVideoBtn"><img src="/static/images/common/icon/PlayIcon.png" alt=""></i>
                                                        </div>
                                                        <div class="remarkMask"  ref="remarkMaskItem" :class="{'remarkMaskReady':!checkInvalid(vidIte.remarks)}">
                                                            <div class="remarkMaskEditPanel" :remarkValue="vidIte.remarks">
                                                                <div class="recordPanel" v-text="vidIte.remarks"></div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <p class="detRemarks" v-show="item.content">备注：<span>{{item.content}}</span></p>
                                            </article>
                                        </article>
                                    </section>
                                </div>
                            </section>
                            <!--isCopy==1数据-->
                            <section class="detInfo isNum" v-for="(item,index) in detailItem" :data-parentId="item.structureId" v-if="item.isCopy==1&&index==dataIndex">
                                <div class="itemCon" v-for="(it,ind) in item.sonList">
                                    <div style="margin-top: 6px" v-show="sonHasDate(it)">
                                        <section class="detItem" style="margin-bottom: 0">
                                            <span class="detTitle">{{ind==0?item.structureName:''}}</span>
                                            <article class="detDesc">
                                                <div class="detSurRight">
                                                    <div class="detSurNum" v-show="sonHasDate(it)"><span>{{item.sonList.length-ind}}</span></div>
                                                    <div v-for="(ite,inde) in it">
                                                        <div v-for="(copyItem,copyIndex) in testNew2(ite,it[inde+1])" v-if="copyItem.type!=10&&copyItem.content">
                                                            <p class="detSurRTil">{{copyItem.structureName}}</p>
                                                            <p style="margin-right: 0;width: 556px" v-html="ymdFilterFn(copyItem.content,copyItem.type)"></p>
                                                        </div>
                                                        <div v-for="(copyItem,copyIndex) in testNew2(ite,it[inde+1])" v-if="copyItem.type==10&&(copyItem.attPicList||copyItem.attVideoList||copyItem.content)">
                                                            <span class="detTitle" style="text-align: left;position: static">{{ite.caseFolderTemplate.structureName}}</span>
                                                            <article class="detDesc" style="margin-left: 0">
                                                                <article class="detImgs">
                                                                    <!--图片-->
                                                                    <ul class="detImgList" @click.stop="viewBigImg">
                                                                        <li class="ev-bigImg" v-for="(itemPic,indexPic) in copyItem.attPicList" v-show="indexPic<=3" :listId="itemPic.id">
                                                                            <div class="detViewImg">
                                                                                <img v-bind:src="itemPic.attUrl"/>
                                                                            </div>
                                                                            <div class="remarkMask"  ref="remarkMaskItem" :class="{'remarkMaskReady':!checkInvalid(itemPic.remarks)}">
                                                                                <div class="remarkMaskEditPanel" :remarkValue="itemPic.remarks">
                                                                                    <div class="recordPanel" v-text="itemPic.remarks"></div>
                                                                                </div>
                                                                            </div>
                                                                            <p class="detImgMore">还有<span v-if="itemPic">{{copyItem.attPicList|Surplus}}</span>张><!--&&itemPic.caseFolderDetail&&itemPic.caseFolderDetail.attPicList-->
                                                                            </p>
                                                                        </li>
                                                                    </ul>
                                                                    <!--视频-->
                                                                    <ul class="detImgList" v-if="copyItem.attVideoList&&copyItem.attVideoList.length">
                                                                        <li v-for="(itemVid,indexVid) in copyItem.attVideoList" @click.stop="itemVid.qiniuStatus==2&&videoCli(itemVid.attUrl.replace('http:',''))">
                                                                            <div class="detViewImg detViewVideo">
                                                                                <img v-bind:src="itemVid.qiniuStatus==2?itemVid.videoPicUrl:'//img10.allinmd.cn/default/qiniu196_196.jpg'"/>
                                                                                <i class="detVideoBtn" v-show="itemVid.videoPicUrl"><img src="/static/images/common/icon/PlayIcon.png" alt=""></i>
                                                                            </div>
                                                                            <div class="remarkMask"  ref="remarkMaskItem" :class="{'remarkMaskReady':!checkInvalid(itemVid.remarks)}">
                                                                                <div class="remarkMaskEditPanel" :remarkValue="itemVid.remarks">
                                                                                    <div class="recordPanel" v-text="itemVid.remarks"></div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                    <p class="detRemarks"
                                                                       v-show="copyItem.content!=''">备注：<span>{{copyItem.content}}</span>
                                                                    </p>
                                                                </article>
                                                            </article>
                                                        </div>
                                                    </div>
                                                    <div class="LastPoint" v-if="lastNum(ind,item.sonList)"><span></span></div>
                                                </div>
                                            </article>
                                        </section>
                                    </div>
                                </div>
                            </section>
                            <!--无用的注释-->
                        </section>
                </section>
                <!--如果选择了模板并且没有填写任何病历信息-->
                <section class="addCaseDetail" @click.stop="goAddCaseDet()" v-show="isHaveTemp&&isNoneTxt&&!(belongType==0&&assistantDoctor)">
                    <i></i>
                    添加病历详情
                </section>
            </section>
            <!--如果未选择模板没有填写任何病历信息-->
            <section class="supCase" v-show="!isHaveTemp&&isNoneTxt&&!(belongType==0&&assistantDoctor)">
                <article class="supCaseTitle">
                    您还没有填写病历信息，立即补充吧
                </article>
                <article class="supCaseBtn" @click.stop="goAddCaseDet()">
                    编辑病历
                </article>
            </section>
        </section>
        <popup :editing="editing" :editQuit="editQuit" :editingTxt="editingTxt" :editQuitTxt="editQuitTxt" @popupFn="popupFn"></popup>
        <!--视频开始-->
        <videoPlayer :path="path" :beginPlay="beginPlay" @beginFn="beginFn"></videoPlayer>
        <!--视频结束-->
    </div>
</template>
<script>
    import viewBigImgAll from '../../../utils/view-big-img/module.view-big-img.js';
    import comm from '../../../utils/comm.js';
    import videoPlayer from  '~components/videoPlayer/videoPlayer.vue';
    import popup from '~components/popupTip/popupTip.vue';
    import {mapActions,mapGetters} from 'vuex';
    const $ = require('jquery');
    const URL={
        caseDetail:'/call/caseFolder/template_structure/getTemplateDataListV2/',//获取病历详情
        baseInfo:'/call/caseFolder/baseinfo/getBaseinfoById/',//获取用户基本信息
        caseState:'/call/caseFolder/baseinfo/update/',//获取病例状态
    };
    const json = {};
    export default {
        data(){
          return{
              listItem:[],
              listIndex:-1,
              caseId:comm.getpara().caseId,
              templateId:comm.getpara().templateId,
              path:'',
              beginPlay:false,
              detailItem:[],//病历详情data
              customerId:comm.cookie.get("userId"),
              isHaveTemp:false,//表示没有选择模板
              isNoneTxt:false,//表示没有填写任何信息
              baseInfoCon:[],//用户的基本信息
              numberContentList:[],//证件号list
              detailInfo:false,//标示基本信息是否请求玩成
              editing:false,//正在编辑提示
              editQuit:false,//异常退出
              editingTxt:'当前病历正在团队其他成员编辑中请稍后再试',
              editQuitTxt:'检测异常退出，当前病历正在保护期请稍后再试',
              recursionData:'',//isCopy==0除了type=10的数据
              isCopyData:'',//isCopy==1类似手术记录随访记录中的type=1,2,3,4的数据
              navHeight:0,//左侧导航高度获取
              recursionData2:'',//isCopy==1除了type=10的数据
              recursion:[],
              recursion2:[],
          }
        },
        components:{
            videoPlayer,
            popup
        },
        //值集
        computed:{
            ...mapGetters(['showLoad','baseMustInfo','patientId','isBlong','belongType','doctorId'])
        },
        methods:{
            //方法集
            ...mapActions(['showLoadi','baseMust','chaPatientId','chaBlongType','chaDoctorId']),
            checkInvalid(val){
                if(((typeof val =='string')&&(val.length==0))||(val==undefined)||(val=='undefined')||(val=='null')||(typeof val=='undefined')||(typeof val=='null')||(val==null)){
                    return true;
                }else{
                    return false;
                }
            },
            structureId(id,index,item,flag){
                for(let i=0;i<=index;i++){
                    if(item[i].structureId==id&&i==index){
                        if(flag){
                            return true
                        }else{
                            return item[i].structureId;
                        }
                    }else if(item[i].structureId==id&&i<index){
                        return false;
                    }
                }
            },
            itemCli(index,dataId){//左侧导航点击事件
                let t = this;
                if(index==-1){
                    $(window).scrollTop(0);
                    t.listIndex = -1;
                }else{
                    t.listIndex = index;
                    if($('.tagItem[data-id='+dataId+']').length>0){
                        let topH = $('.tagItem[data-id='+dataId+']').offset().top;
                        $(window).scrollTop(topH-90);
                    }
                }
            },
            goAddCaseDet(){//跳转病历页面
                let t = this;
                t.showLoadi(true);
                comm.ajax2({
                    url: URL.caseState,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({customerId:t.customerId,caseId:t.caseId,updateFlag:0})
                    },
                    timeout: 30000,
                    success:function(res){
                        t.showLoadi(false);
                        if(res&&res.responseObject&&res.responseObject.responseStatus){
                            switch (parseInt(res.responseObject.responseCode)) {
                                case 0://未锁定
                                    sessionStorage.removeItem('emrNewCaseCaseId');
                                    sessionStorage.setItem('newCasesSource',window.location.href);
                                    if(!t.templateId||t.templateId==0){
                                        window.location.href = '/newCases/index.html?caseId='+ t.caseId +'&edit=0&doctorId='+t.doctorId+'#/tplate';
                                    }else{
                                        window.location.href = '/newCases/index.html?caseId=' + t.caseId + '&edit=1&doctorId='+t.doctorId;
                                    }
                                    break;
                                case 1301://正在编辑
                                case 1303://正在编辑
                                    t.editing = true;//正在编辑
                                    t.editQuit = false;//异常退出
                                    document.getElementsByTagName('body')[0].className = 'bodyHidden';
                                    // $('body').addClass('bodyHidden');
                                    $('body').css('position',"");
                                    $('body').css('overflow',"hidden");
                                    break;
                                case 1302://异常退出
                                    t.editing = false;//正在编辑
                                    t.editQuit = true;//异常退出
                                    document.getElementsByTagName('body')[0].className = 'bodyHidden';
                                    // $('body').addClass('bodyHidden');
                                    $('body').css('position',"");
                                    $('body').css('overflow',"hidden");
                                    break;
                            }
                        }
                    }
                });
            },
            viewBigImg(e){
                e.stopPropagation();
                e.preventDefault();
                let imgList=[],
                    bigImg=$(e.target).parents('.ev-bigImg'),
                    id=bigImg.attr("listId"),
                    container=$(e.target).parents("ul");
                if(id){
                    $('.ev-bigImg',container).each(function(i,em){
                        imgList.push({id:$(em).attr("listid"),url:$(em).find("img").attr("src")});
                    });
                    viewBigImgAll({
                        container:container,
                        typeTitle: "",
                        imgListType:'caze',
                        id: id,
                        imgList:imgList,
                        srcSplit:true,
                    });
                }
            },
            videoCli(path){
                this.path = path.replace('http:','');
                this.beginPlay = true;
            },
            beginFn(flag){
                this.beginPlay = flag;
            },
            popupFn(flag){
                this.editing = flag;
                this.editQuit = flag;
            },
            caseDetail(){//获取病历详情数据
                let t  = this;
                t.showLoadi(true);
                comm.ajax2({
                    url:URL.caseDetail,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            templateId:t.templateId,
                            caseId:t.caseId,
                            visitSiteId:1
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.detailInfo = true;
                        if(t.detailInfo&&t.baseInfoCon!=''){//如果已经请求成功
                            t.showLoadi(false);
                        }
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData){
                            if(res.responseObject.responseData.data_list){
                                t.detailItem = res.responseObject.responseData.data_list;
                                t.testNew(res);
                            }
                            if(res.responseObject.responseData.isWrite==0){//表示没有填写内容
                                t.isNoneTxt = true;
                                t.showLoadi(false);
                            }else{
                                t.isNoneTxt = false;
                            }
                        }
                    }
                })
            },
            baseInfo(){//获取用户的基本信息
                let t = this;
                t.navHeight = document.documentElement.clientHeight-71;
                t.showLoadi(true);
                comm.ajax2({
                    url:URL.baseInfo,
                    type: "GET",
                    data: {
                        paramJson:JSON.stringify({
                            caseId:t.caseId,
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                            t.baseInfoCon = res.responseObject.responseData.data_list[0];
                            t.numberContentList = t.baseInfoCon.numberList;
                            let allAge = '';
                            if(t.baseInfoCon.patientAge){
                                let age = t.baseInfoCon.patientAge.split(',');
                                if(age[0]!=='00'&&age[0]!==''){
                                    allAge += age[0]+'岁'
                                }
                                if(age[1]!='00'&&age[1]!==''){
                                    allAge += age[1]+'月'
                                }
                                if(age[2]!='00'&&age[2]!==''){
                                    allAge += age[2]+'天'
                                }
                            }
                            t.baseMust([t.baseInfoCon.patientName,allAge,t.baseInfoCon.patientSex==1?"男":"女"]);
                            t.chaPatientId(t.baseInfoCon.patientId);//病人id
                            t.chaBlongType(t.baseInfoCon.belongType);//是否归属
                            t.chaDoctorId(t.baseInfoCon.doctorId);//编辑病例时doctorId
                            if(t.baseInfoCon.templateId!=''&&t.baseInfoCon.templateId!=0){//表示选择了模板
                                t.isHaveTemp = true;//表示有模板
                                t.caseDetail();//病历详情
                            }else{
                                t.isHaveTemp = false;//表示没有模板
                                t.isNoneTxt = true;
                                t.showLoadi(false);
                            }
                        }
                        if(t.detailInfo&&t.baseInfoCon!=''){//如果已经请求成功
                            t.showLoadi(false);
                        }
                    }
                })
            },
            lastNum(index,con){//判断子节点是不是父节点的最后一个（用于随访记录，手术记录中的小圆点标识）
                if((index+1)==con.length){
                    return true;
                }else{
                    return false;
                }
            },
            sonHasDate(data){//判断如果没有子节点则不显示随访或者手术记录前面的数字
                for(let i = 0;i<data.length;i++){
                    if(!comm.isEmptyObject(data[i].caseFolderDetail)){
                        return true
                    }
                }
            },
            sonHasCont(type,data){//判断如果子节点中没有要显示的内容则不进行显示
                switch (parseInt(type)){
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        if(data.formatContent){
                            return true
                        }else{
                            return false
                        }
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                        if(data.content){
                            return true
                        }else{
                            return false
                        }
                    case 10:
                        if(data.attPicList||data.attVideoList){
                            return true
                        }else{
                            return false
                        }
                }
                // for(let i = 0;i<data.length;i++){
                //     if(!comm.isEmptyObject(data[i].caseFolderDetail)){
                //         switch (parseInt(type)){
                //             case 1:
                //             case 2:
                //             case 3:
                //             case 4:
                //                 if(data[i].caseFolderDetail.formatContent){
                //                     console.log(data[i].caseFolderDetail.formatContent);
                //                     flag = true;
                //                     // return true
                //                 }else{
                //                     flag = false;
                //                     // return false
                //                 }
                //             case 6:
                //             case 7:
                //             case 8:
                //             case 9:
                //                 if(data[i].caseFolderDetail.content){
                //                     flag = true;
                //                     // return true
                //                 }else{
                //                     flag = false;
                //                     // return false
                //                 }
                //         }
                //     }
                //     return flag;
                // }
            },
            //isCopy==0中的数据重组，将dataList中的全部层级的数据进行提取到同一级中，进行平铺
            testNew(data){//最终版将数组进行重组
                let dataListArr=[];
                let t = this;
                let jsonList=data.responseObject.responseData.data_list;
                for (let i=0;i<jsonList.length;i++){
                    if(jsonList[i].sonList){
                        if(jsonList[i].isCopy==0){
                            if(jsonList[i].sonList[0]){
                                dataEach(jsonList[i].sonList[0],jsonList[i].structureId,i);
                            }
                        }
                    }
                }
                function dataEach(ele,firstId,index){
                    for(let i=0;i<ele.length;i++){
                        if(!comm.isEmptyObject(ele[i].caseFolderDetail)){
                            let type=parseInt(ele[i].caseFolderDetail.structureType);
                            if((type!=10&&(ele[i].caseFolderDetail.content||(!ele[i].caseFolderDetail.content&&ele[i].caseFolderTemplate.isBothSides==1)))||(type==10&&((ele[i].caseFolderDetail.attPicList?ele[i].caseFolderDetail.attPicList.length>0:false)||(ele[i].caseFolderDetail.attVideoList?ele[i].caseFolderDetail.attVideoList.length>0:false)||(ele[i].caseFolderDetail.content?ele[i].caseFolderDetail.content!='':false)||(!ele[i].caseFolderDetail.content&&ele[i].caseFolderTemplate.isBothSides==1)))){
                                let dataLi={};
                                if(firstId){
                                    dataLi.structureId = firstId;
                                }
                                dataLi.structureName = ele[i].caseFolderTemplate.structureName;
                                dataLi.isBothSides = ele[i].caseFolderTemplate.isBothSides;
                                dataLi.sideType = ele[i].caseFolderTemplate.sideType;
                                dataLi.index = index;
                                dataLi.type = ele[i].caseFolderDetail.structureType;
                                dataLi.isValid = ele[i].caseFolderDetail.isValid;
                                dataListArr.push(dataLi);
                                if(type==1||type==2||type==3||type==4){
                                    let list = {};
                                    if((!comm.isEmptyObject(ele[i].caseFolderTemplateScope))||(!comm.isEmptyObject(ele[i+1].caseFolderTemplateScope))){//2018-12-04此处多加了一个判断下一个如果存在
                                        let scope = ele[i].caseFolderTemplateScope;
                                        let contentId = ele[i].caseFolderDetail.content;
                                        if(dataLi.isBothSides==1){//表示是左右侧
                                            if(dataLi.sideType==1){//如果是左侧并且有效
                                                if(ele[i].caseFolderDetail.formatContent&&dataLi.isValid==1){//如果左侧有值
                                                    list = 'L-'+ele[i].caseFolderDetail.formatContent;
                                                }
                                                //如果是左右结构，则在左的下面则是右，成对出现，则将内容进行累加，并将i++进行循环下一个
                                                if(!comm.isEmptyObject(ele[i+1].caseFolderDetail)){
                                                    if(ele[i+1].caseFolderDetail.isValid==1&&ele[i+1].caseFolderDetail.formatContent){
                                                        if(ele[i].caseFolderDetail.formatContent){
                                                            list += '<span style="width: 35px;height: 5px;display: inline-block"></span>'+'R-'+ele[i+1].caseFolderDetail.formatContent;
                                                        }else{
                                                            list = 'R-'+ele[i+1].caseFolderDetail.formatContent;
                                                        }
                                                    }
                                                }
                                                i++;
                                            }
                                            //此段代码打开后，将左右分开，单独有一个与左侧相同title
                                            // else{
                                            //     list = 'R-'+ele[i].caseFolderDetail.formatContent;
                                            // }
                                        }else{
                                            list = ele[i].caseFolderDetail.formatContent;
                                        }
                                        /*此处为2018-12-04号之前的代码，即不需要判断左右字段是否有效并且有值。
                                       //------begin
                                        * if(dataLi.isBothSides==1){
                                            if(dataLi.sideType==1){
                                                list = 'L-'+ele[i].caseFolderDetail.formatContent;
                                                //如果是左右结构，则在左的下面则是右，成对出现，则将内容进行累加，并将i++进行循环下一个
                                                if(!comm.isEmptyObject(ele[i+1].caseFolderDetail)){
                                                    list += '<span style="width: 35px;height: 5px;display: inline-block"></span>'+'R-'+ele[i+1].caseFolderDetail.formatContent;
                                                }
                                                i++;
                                            }
                                            //此段代码打开后，将左右分开，单独有一个与左侧相同title
                                            // else{
                                            //     list = 'R-'+ele[i].caseFolderDetail.formatContent;
                                            // }
                                        }else{
                                            list = ele[i].caseFolderDetail.formatContent;
                                        }
                                        //------end
                                        * */


                                        // if(comm.isEmptyObject(list)){
                                        //     list = scope[j].dictionaryName+'，'
                                        // }else{
                                        //     list += scope[j].dictionaryName+'，';
                                        // }
                                        for(let j=0;j<scope.length;j++){
                                            for(let z= 0;z<contentId.split(',').length;z++){
                                                if(scope[j].dictionaryId==contentId.split(',')[z]){
                                                    if(scope[j].relationMap){
                                                        dataEach(scope[j].relationMap,firstId,index)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if(!comm.isEmptyObject(list)){
                                        dataLi.content = list;
                                    }
                                    // dataListArr.push(dataLi);
                                    dataLi={};
                                }else if(type==5||type==6||type==7||type==8||type==9){
                                    if(type==5||type==6||type==7){
                                        let newData = t.ymdFilterFn(ele[i].caseFolderDetail.content,type);
                                        if(newData!=''){
                                            dataLi.content = ele[i].caseFolderDetail.content;
                                        }
                                    }else{
                                        // if(ele[i].caseFolderDetail.content){
                                            if(dataLi.isBothSides==1){//表示是左右结构
                                                if(dataLi.sideType==1){//表示是左
                                                    if(ele[i].caseFolderDetail.content&&dataLi.isValid==1){
                                                        dataLi.content = 'L-'+ele[i].caseFolderDetail.content+(ele[i].commDataThreshold.thresholdUnit?ele[i].commDataThreshold.thresholdUnit:'');
                                                    }
                                                    if(!comm.isEmptyObject(ele[i+1].caseFolderDetail)){
                                                        if(ele[i+1].caseFolderDetail.content&&ele[i+1].caseFolderDetail.isValid){
                                                            if(ele[i].caseFolderDetail.content){
                                                                dataLi.content += '<span style="width: 35px;height: 5px;display: inline-block"></span>'+'R-'+ele[i+1].caseFolderDetail.content+(ele[i+1].commDataThreshold.thresholdUnit?ele[i+1].commDataThreshold.thresholdUnit:'');
                                                            }else{
                                                                dataLi.content = 'R-'+ele[i+1].caseFolderDetail.content+(ele[i+1].commDataThreshold.thresholdUnit?ele[i+1].commDataThreshold.thresholdUnit:'');
                                                            }
                                                        }
                                                    }
                                                    i++;
                                                }
                                                // else{
                                                //     dataLi.content = 'R-'+ele[i].caseFolderDetail.content+(ele[i].commDataThreshold.thresholdUnit?ele[i].commDataThreshold.thresholdUnit:'');
                                                // }
                                            }else{
                                                dataLi.content = ele[i].caseFolderDetail.content+(ele[i].commDataThreshold.thresholdUnit?ele[i].commDataThreshold.thresholdUnit:'');
                                            }

                                        // }
                                        /*此段代码为2018-12-04号之前的代码，
                                            //------begin
                                            * if(ele[i].caseFolderDetail.content){
                                                if(dataLi.isBothSides==1){//表示是左右结构
                                                if(dataLi.sideType==1){//表示是左
                                                    dataLi.content = 'L-'+ele[i].caseFolderDetail.content+(ele[i].commDataThreshold.thresholdUnit?ele[i].commDataThreshold.thresholdUnit:'');
                                                    if(!comm.isEmptyObject(ele[i+1].caseFolderDetail)){
                                                        dataLi.content += '<span style="width: 35px;height: 5px;display: inline-block"></span>'+'R-'+ele[i+1].caseFolderDetail.content+(ele[i+1].commDataThreshold.thresholdUnit?ele[i+1].commDataThreshold.thresholdUnit:'');
                                                    }
                                                    i++;
                                                }
                                                // else{
                                                //     dataLi.content = 'R-'+ele[i].caseFolderDetail.content+(ele[i].commDataThreshold.thresholdUnit?ele[i].commDataThreshold.thresholdUnit:'');
                                                // }
                                            }else{
                                                dataLi.content = ele[i].caseFolderDetail.content+(ele[i].commDataThreshold.thresholdUnit?ele[i].commDataThreshold.thresholdUnit:'');
                                            }
                                            }
                                            //---end
                                            * */
                                    }
                                    // dataLi.content = ele[i].caseFolderDetail.content+(ele[i].commDataThreshold.thresholdUnit?ele[i].commDataThreshold.thresholdUnit:'');
                                    // dataListArr.push(dataLi);
                                    dataLi={};
                                }else if(type==10){
                                    //图片
                                    if(ele[i].caseFolderDetail.attPicList){
                                        dataLi.attPicList = [];
                                        for(let k = 0;k<ele[i].caseFolderDetail.attPicList.length;k++){
                                            let attPicArr = {};
                                            attPicArr.attUrl = ele[i].caseFolderDetail.attPicList[k].attUrl;
                                            attPicArr.remarks = t.checkInvalid(ele[i].caseFolderDetail.attPicList[k].remarks)?"":ele[i].caseFolderDetail.attPicList[k].remarks;
                                            attPicArr.id = ele[i].caseFolderDetail.attPicList[k].id;
                                            dataLi.attPicList.push(attPicArr);
                                        }
                                    }
                                    //视频
                                    if(ele[i].caseFolderDetail.attVideoList){
                                        dataLi.attVideoList = [];
                                        for(let m = 0;m<ele[i].caseFolderDetail.attVideoList.length;m++){//格式：videoPicUrl%videoUrl#qiniuStatus,
                                            let attVideoArr = {};
                                            attVideoArr.videoPicUrl = ele[i].caseFolderDetail.attVideoList[m].videoPicUrl;
                                            attVideoArr.attUrl = ele[i].caseFolderDetail.attVideoList[m].attUrl;
                                            attVideoArr.remarks = t.checkInvalid(ele[i].caseFolderDetail.attVideoList[m].remarks)?"":ele[i].caseFolderDetail.attVideoList[m].remarks;
                                            attVideoArr.qiniuStatus = ele[i].caseFolderDetail.attVideoList[m].qiniuStatus;
                                            dataLi.attVideoList.push(attVideoArr);
                                        }
                                    }
                                    //备注
                                    if(ele[i].caseFolderDetail.content){
                                        dataLi.content = ele[i].caseFolderDetail.content;
                                    }
                                    // dataListArr.push(dataLi);
                                    // dataLi={};
                                }
                            }
                        }
                    }
                }
                this.recursion = dataListArr;
            },
            //isCopy==1中的数据重组，将dataList中sonList中的每一项中的子项的全部层级的数据进行提取到同一级中，进行平铺，即dataList[0].sonList[0][0]
            testNew2(data,data2){//最终版将数组进行重组
                let t = this;
                let resultArr = [];
                let oriData = JSON.parse(JSON.stringify(data));
                let oriaftData = data2;
                let dataListArr=[],dataJson={},jsonList=oriData;//传入所有的sonList
                    dataJson.structureName = oriData.caseFolderTemplate.structureName;
                dataJson.type = oriData.caseFolderDetail.structureType;
                dataJson.isBothSides = oriData.caseFolderTemplate.isBothSides;
                dataJson.sideType = oriData.caseFolderTemplate.sideType;
                dataJson.caseFolderTemplateScope = oriData.caseFolderTemplateScope;
                dataJson.isValid = oriData.caseFolderDetail.isValid;
                let type = oriData.caseFolderDetail.structureType;
                if(type==1||type==2||type==3||type==4){
                    if(dataJson.isBothSides==1){
                        if(dataJson.sideType==1){
                            if(oriData.caseFolderDetail.formatContent&&dataJson.isValid==1){
                                dataJson.content = 'L-'+oriData.caseFolderDetail.formatContent;
                            }
                            if(data2&&oriaftData.caseFolderDetail.formatContent&&oriaftData.caseFolderDetail.isValid==1){
                                if(oriData.caseFolderDetail.formatContent){
                                    dataJson.content += '<span style="width: 35px;height: 5px;display: inline-block"></span>'+'R-'+oriaftData.caseFolderDetail.formatContent;
                                }else{
                                    dataJson.content = 'R-'+oriaftData.caseFolderDetail.formatContent;
                                }
                            }
                        }
                    }else{
                        dataJson.content = oriData.caseFolderDetail.formatContent;
                    }
                    /*2018-12-04之前代码
                    //------begin
                    * if(dataJson.isBothSides==1){
                        if(dataJson.sideType==1){
                            dataJson.content = 'L-'+oriData.caseFolderDetail.formatContent;
                            if(data2){
                                dataJson.content += '<span style="width: 35px;height: 5px;display: inline-block"></span>'+'R-'+oriaftData.caseFolderDetail.formatContent;
                            }
                        }
                    }else{
                        dataJson.content = oriData.caseFolderDetail.formatContent;
                    }
                    //---end
                    * */
                }else if(type==5||type==6||type==7||type==8||type==9){
                    if(type==5||type==6||type==7){
                        let newData = t.ymdFilterFn(oriData.caseFolderDetail.content,type);
                        if(newData!=''){
                            dataJson.content = oriData.caseFolderDetail.content
                        }
                    }else{
                        //2018/12/04号修改：如果左右字段其中有一项无效（isValid=0）并且没有内容则不展示，否则其他内容都是展示。在之前已经订好了左右字段成对出现并且如果没有填写也可以展示R-或者L-文字。说话不算话大致如此。
                        // if(oriData.caseFolderDetail.content){
                            if(dataJson.isBothSides==1){
                                if(dataJson.sideType==1){
                                    if(oriData.caseFolderDetail.content&&dataJson.isValid==1){
                                        dataJson.content = 'L-'+oriData.caseFolderDetail.content+(oriData.commDataThreshold.thresholdUnit?oriData.commDataThreshold.thresholdUnit:'');
                                    }
                                    if(data2&&oriaftData.caseFolderDetail.content&&oriaftData.caseFolderDetail.isValid==1){
                                        if(oriData.caseFolderDetail.content){
                                            dataJson.content += '<span style="width: 35px;height: 5px;display: inline-block"></span>'+'R-'+oriaftData.caseFolderDetail.content+(oriaftData.commDataThreshold.thresholdUnit?oriaftData.commDataThreshold.thresholdUnit:'');
                                        }else{
                                            dataJson.content = 'R-'+oriaftData.caseFolderDetail.content+(oriaftData.commDataThreshold.thresholdUnit?oriaftData.commDataThreshold.thresholdUnit:'');
                                        }
                                    }
                                }
                            }else{
                                dataJson.content = oriData.caseFolderDetail.content+(oriData.commDataThreshold.thresholdUnit?oriData.commDataThreshold.thresholdUnit:'');
                            }
                            // dataJson.content = oriData.caseFolderDetail.content+(oriData.commDataThreshold.thresholdUnit?oriData.commDataThreshold.thresholdUnit:'');
                        // }
                        /*2018-12-04之前代码
                        //------begin
                        * if(oriData.caseFolderDetail.content){
                            if(dataJson.isBothSides==1){
                                if(dataJson.sideType==1){
                                    dataJson.content = 'L-'+oriData.caseFolderDetail.content+(oriData.commDataThreshold.thresholdUnit?oriData.commDataThreshold.thresholdUnit:'');
                                    if(data2){
                                        dataJson.content += '<span style="width: 35px;height: 5px;display: inline-block"></span>'+'R-'+oriaftData.caseFolderDetail.content+(oriaftData.commDataThreshold.thresholdUnit?oriaftData.commDataThreshold.thresholdUnit:'');
                                    }
                                }
                            }else{
                                dataJson.content = oriData.caseFolderDetail.content+(oriData.commDataThreshold.thresholdUnit?oriData.commDataThreshold.thresholdUnit:'');
                            }
                            // dataJson.content = oriData.caseFolderDetail.content+(oriData.commDataThreshold.thresholdUnit?oriData.commDataThreshold.thresholdUnit:'');
                        }
                        //----end
                        * */
                    }
                }else if(type==10){
                    let picArr = oriData.caseFolderDetail.attPicList;//图片信息
                    let videoArr = oriData.caseFolderDetail.attVideoList;//视频信息
                    //图片
                    if(picArr){
                        dataJson.attPicList = [];
                        for(let k = 0;k<picArr.length;k++){
                            let attPicArr = {};
                            attPicArr.attUrl = picArr[k].attUrl;
                            attPicArr.id = picArr[k].id;
                            attPicArr.remarks = t.checkInvalid(picArr[k].remarks)?"":picArr[k].remarks;
                            dataJson.attPicList.push(attPicArr);
                        }
                    }
                    if(videoArr){
                        dataJson.attVideoList = [];
                        for(let m = 0;m<videoArr.length;m++){
                            let attVideoArr = {};
                            attVideoArr.videoPicUrl = videoArr[m].videoPicUrl;
                            attVideoArr.attUrl = videoArr[m].attUrl;
                            attVideoArr.qiniuStatus = videoArr[m].qiniuStatus;
                            attVideoArr.remarks = t.checkInvalid(videoArr[m].remarks)?"":videoArr[m].remarks;
                            dataJson.attVideoList.push(attVideoArr);
                        }
                    }
                    dataJson.content = oriData.caseFolderDetail.content;//备注信息
                }
                resultArr.push(dataJson);
                    jsonList=oriData;//传入所有的sonList
                for (let i=0;i<jsonList.caseFolderTemplateScope.length;i++){
                    if(jsonList.caseFolderTemplateScope[i].relationMap){
                        dataEach(jsonList.caseFolderTemplateScope[i].relationMap);
                        resultArr=resultArr.concat(dataListArr);
                    }
                }
                function dataEach(ele){
                    for(let i=0;i<ele.length;i++){
                        if(!comm.isEmptyObject(ele[i].caseFolderDetail)){
                            let dataLi={};
                            dataLi.structureName = ele[i].caseFolderTemplate.structureName;
                            dataLi.type = ele[i].caseFolderDetail.structureType;
                            dataListArr.push(dataLi);
                            if(dataLi.type==1||dataLi.type==2||dataLi.type==3||dataLi.type==4){
                                let list = {};
                                if(ele[i].caseFolderTemplateScope.length){
                                    let scope=ele[i].caseFolderTemplateScope,contentId=ele[i].caseFolderDetail.content;
                                    list = ele[i].caseFolderDetail.formatContent;
                                    for(let j=0;j<scope.length;j++){
                                        for(let z= 0;z<contentId.split(',').length;z++){
                                            if(scope[j].dictionaryId==contentId.split(',')[z]){
                                                // if(comm.isEmptyObject(list)){
                                                //     list = scope[j].dictionaryName+'，';
                                                // }else{
                                                //     list += scope[j].dictionaryName+'，';
                                                // }
                                                if(scope[j].relationMap){//还有下一层
                                                    dataEach(scope[j].relationMap);
                                                }
                                            }
                                        }
                                    }
                                }
                                if(!comm.isEmptyObject(list)){
                                    dataLi.content = list.substring(0,dataLi.length-1);
                                }
                                // dataListArr.push(dataLi);
                                dataLi={};
                            }
                            else if(dataLi.type==5||dataLi.type==6||dataLi.type==7||dataLi.type==8||dataLi.type==9){
                                if(dataLi.type==5||dataLi.type==6||dataLi.type==7){
                                    let newData = t.ymdFilterFn(ele[i].caseFolderDetail.content,dataLi.type);
                                    if(newData!=''){
                                        dataLi.content = ele[i].caseFolderDetail.content;
                                    }
                                }else{
                                    if(ele[i].caseFolderDetail.content){
                                        dataLi.content = ele[i].caseFolderDetail.content+(ele[i].commDataThreshold.thresholdUnit?ele[i].commDataThreshold.thresholdUnit:'');
                                    }
                                }
                                // if(ele[i].caseFolderDetail.content){
                                //     dataLi.content = ele[i].caseFolderDetail.content+(ele[i].commDataThreshold.thresholdUnit?ele[i].commDataThreshold.thresholdUnit:'');
                                // }
                                // dataListArr.push(dataLi);
                                dataLi={};
                            }else if(dataLi.type==10){
                                //图片
                                if(ele[i].caseFolderDetail.attPicList){
                                    dataLi.attPicList = [];
                                    for(let k = 0;k<ele[i].caseFolderDetail.attPicList.length;k++){
                                        let attPicArr = {};
                                        attPicArr.attUrl = ele[i].caseFolderDetail.attPicList[k].attUrl;
                                        attPicArr.id = ele[i].caseFolderDetail.attPicList[k].id;
                                        dataLi.attPicList.push(attPicArr);
                                    }
                                }
                                //视频
                                if(ele[i].caseFolderDetail.attVideoList){
                                    dataLi.attVideoList = [];
                                    for(let m = 0;m<ele[i].caseFolderDetail.attVideoList.length;m++){//格式：videoPicUrl%videoUrl#qiniuStatus,
                                        let attVideoArr = {};
                                        attVideoArr.videoPicUrl = ele[i].caseFolderDetail.attVideoList[m].videoPicUrl;
                                        attVideoArr.attUrl = ele[i].caseFolderDetail.attVideoList[m].attUrl;
                                        attVideoArr.qiniuStatus = ele[i].caseFolderDetail.attVideoList[m].qiniuStatus;
                                        dataLi.attVideoList.push(attVideoArr);
                                    }
                                }
                                //备注
                                if(ele[i].caseFolderDetail.content){
                                    dataLi.content = ele[i].caseFolderDetail.content;
                                }
                                // dataListArr.push(dataLi);
                                dataLi={};
                            }
                        }
                    }
                }
                return resultArr;
            },
            ymdFilterFn(data,type){
                if(data){
                    if(type==5||type==7||type==6){
                        data = data.split(',');
                    }
                    switch (parseInt(type)){
                        case 5:
                            let newData = '';
                            if(data[0]!='0'&&data[0]!='00'&&data[0]!=''){
                                newData += data[0]+'岁';
                            }
                            if(data[1]!='00'&&data[1]!=''){
                                newData += data[1]+'月'
                            }
                            if(data[2]!='00'&&data[2]!=''){
                                newData += data[2]+'天'
                            }
                            return newData;
                        case 6:
                            return data[0]+'年'+data[1]+'月'+data[2]+'日';
                        case 7:
                            return data[0]+' '+data[1];
                        default:
                            return data;
                    }
                }
            },
            checkBigImage(){
                $('.alEmr-mainInner').on("mousedown",'.detViewImg,.detImgMore',function(){
                   setTimeout(()=>{
                       let originalBtn = $(".view_img_view_yt");
                       originalBtn.off("click mousedown mouseup").on("click",function(){
                           let originalImageUrl = $(".view_img_tp td[align='center'] img").attr("src");
                          window.open(originalImageUrl.replace(/\_c./ig,'.'));
                       });
                        $(".view_img_view_yt").css({"display":"inline-block",'right':'202px'})
                   },500);
                });
            }
        },
        watch:{
            isBlong(){
                let t = this;
                if(t.isBlong){
                    t.baseInfo();//用户基本信息
                    //滚动事件
                    $(window).off('scroll').on('scroll',function () {
                        let scrollTop = $(this).scrollTop();
                        let scrollHeight = $(document).height();
                        let windowHeight = $(this).height();
                        $.each($('.tagItem'),function (i, e) {
                            if($(e).offset().top-100<=$(window).scrollTop()&&$(e).offset().top+$(e).height()>=$(window).scrollTop()){
                                // console.log(windowHeight+scrollTop+'-----'+scrollHeight);
                                if(windowHeight+scrollTop<scrollHeight-100){//判断滚动到底部不进行赋值
                                    t.listIndex = i-1;
                                }
                            }
                        });
                    })
                }
            },
        },
        filters:{
            Surplus(num){//计算图片还有几张
                if(num.length){
                    return parseInt(num.length)-3;
                }else{
                    return 0;
                }
            },
            ymdFilter(data,type){
                if(data){
                    if(type==5||type==7||type==6){
                        data = data.split(',');
                    }
                    switch (parseInt(type)){
                        case 5:
                            let newData = '';
                            if(data[0]!='0'&&data[0]!='00'&&data[0]!=''){
                                newData += data[0]+'岁';
                            }
                            if(data[1]!='00'&&data[1]!=''){
                                newData += data[1]+'月'
                            }
                            if(data[2]!='00'&&data[2]!=''){
                                newData += data[2]+'天'
                            }
                            return newData;
                        case 6:
                            return data[0]+'年'+data[1]+'月'+data[2]+'日';
                        case 7:
                            return data[0]+' '+data[1];
                        default:
                            return data;
                    }
                }
            },
            numType(num){//判断证件类型
                // 编号类别1-住院号2-床位号3-病历号4-身份证号5-军官号
                switch (parseInt(num)){
                    case 1:
                        return '住院号';
                    case 2:
                        return '床位号';
                    case 3:
                        return '病历号';
                    case 4:
                        return '身份证号';
                    case 5:
                        return '军官号';
                }
            },
            tagNameFil(name){
                if(name&&name.length>0){
                    let names = '';
                    for(let i = 0;i<name.length;i++){
                        names +=  name[i].tagName+'；';
                    }
                    return names;
                }
            },
            linkageData(data,first){//联动数处理
                if(data.substring(data.indexOf("@=@")+3,data.length)){
                    if(first){
                        return data.substring(data.indexOf("%")+1,data.indexOf("@=@"));
                    }else{
                        return data.substring(data.indexOf("@=@")+3,data.length-1);
                    }
                }
            },
            dataDetail(data,first){//获取到数据将数据进行分类重组拆分
                let type = data.substring(0,data.indexOf('-'));//获取到类型
                if(first==1){//如果是截取出title
                    return data.substring(data.indexOf('-')+1,data.indexOf('$'))
                }else{//如果是内容区
                    if(data.substring(data.length-1,data.length)==','){
                        data = data.substring(data.indexOf("$")+1,data.length-1);
                    }else{
                        data = data.substring(data.indexOf("$")+1,data.length);
                    }
                    if(type==5||type==7||type==6){
                        data = data.split(',');
                        switch (parseInt(type)){
                            case 5:
                                let newData = '';
                                if(data[0]!='00'){
                                    newData += data[0]+'岁';
                                }
                                if(data[1]!='00'){
                                    newData += data[1]+'月'
                                }
                                if(data[2]!='00'){
                                    newData += data[2]+'天'
                                }
                                return newData;
                            case 6:
                                return data[0]+'年'+data[1]+'月'+data[2]+'日';
                            case 7:
                                return data[0]+' '+data[1];
                        }
                    }else{
                        return data
                    }
                }
            }
        },
        mounted(){
            let t = this;
            t.checkBigImage();
        }
    }
</script>
<style lang="scss">
    @import "../../../utils/view-big-img/module.view-big-img.css";
    .detImgList{
        li{
            overflow: hidden;
        }
    }
    .caseDetailCon .detInfo .detItem .detSurRight .remarkMask,.remarkMask{
        width:160px;
        height:34px;
        background:rgba(0,0,0,0.8);
        border-radius:0px 0px 4px 4px;
        position: absolute;
        bottom:-34px;
        left: 0;
        right:0;
        transition: all ease-in .5s;
        &.remarkMaskReady{
            height: 53px;
            bottom:0;
            .remarkMaskIcon{
                display: none;
            }
            .remarkMaskTitle{
                display: none;
            }
            .remarkMaskEditPanel{
                width: 160px;
                height: 53px;
                .recordPanel{
                    display: none;
                }
                .recordPanel,.editRemark{
                    background: none;
                    resize: none;
                    height: 39px;
                    width: 122px;
                    padding:7px 9px;
                    font-size:14px;
                    color:rgba(255,255,255,1);
                    outline: none;
                    border: none;
                    overflow: auto;
                    word-break: break-all; //解决兼容问题
                    text-align: left;
                }
            }
        }
        &.remarkMaskReady{
            bottom:0;
            height: auto;
            .remarkMaskEditPanel{
                height: auto;
                .editRemark{
                    display: none;
                }
                .recordPanel{
                    display: block;
                    height: auto;
                    line-height: 24px;
                }
            }

        }
    }
</style>
