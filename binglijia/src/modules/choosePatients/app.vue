<template>
    <div class="alEmr-mainInner">
        <header-top-nav :crumbsTxt="crumbsTxt" :pageType="2"></header-top-nav>
        <section class="alEmr-mainIndex" style="padding-left: 0">
            <section class="alEmr-indexInner">
                <div class="patListCon">
                    <div class="selectCont">
                        <div class="selectItem">
                            <span class="docTitle">报到医生</span>
                            <div class="docSelect selectResult" @click.stop="changeDocFn(1)">
                                <input type="text" disabled v-bind:value="choseDoc">
                                <p>切换<i class="tabBtn"></i></p>
                                <ul class="docList selectList" style="display: none;" v-show="isShowDoc">
                                    <li v-for="(item,i) in docList" :key="i" @click.stop="docChoseFn(item)">{{item.customerName}}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="selectItem">
                            <span class="docTitle">报到类型</span>
                            <div class="docSelect selectResult" @click.stop="changeDocFn(2)">
                                <input type="text" disabled v-bind:value="choseType">
                                <p>切换<i class="tabBtn"></i></p>
                                <ul class="docList selectList" style="display: none;" v-show="isSowType">
                                    <li @click.stop="typeChoseFn('')">全部</li>
                                    <li @click.stop="typeChoseFn(1)">住院患者</li>
                                    <li @click.stop="typeChoseFn(2)">门诊患者</li>
                                </ul>
                            </div>
                        </div>
                        <span class="subBtn" @click.stop="submitBtnFn">筛选</span>
                        <div :class="{importBtn:true,noneP:noneP}" @click="importBtn">
                            <div class="impDef" v-show="impDef">
                                导入 <span class="patChoNum" v-text="patChoNum"></span>
                            </div>
                            <span class="patTip" v-show="tipError">请先选择一个患者</span>
                            <!--导入按钮...显示-->
                            <ul class="impPro" v-show="impPro"><li></li><li></li><li></li></ul>
                        </div>
                    </div>
                    <section class="patLists" v-for="(item,index) in patientLists">
                        <section class="calendar"><i></i><span>{{item.timeYMD|dateChange}}</span></section>
                        <ul>
                            <li :class="{patListItem:true,unchecked:sonItem.isSelected==1,active:indexItem.indexOf(i+'-'+sonItem.caseId)>-1}" v-for="(sonItem,i) in item.dataList">
                                <span class="patChooBtn" @click.stop="(sonItem.isSelected==0?true:false) && itemCli(i,sonItem.caseId,sonItem)"></span>
                                <span :class="{patType:true,typeTwo:sonItem.caseType!=14}" v-text="sonItem.caseType==14?'报到患者':'问诊患者'"></span>
                                <span class="patName" :title="sonItem.patientName">{{sonItem.patientName,4|titLen}}</span>
                                <span class="patSex">{{sonItem.patientSex|patientSex}}</span>
                                <span class="patAge">{{sonItem.patientAge}}</span>
                                <span class="patNum200" v-show="sonItem.caseType==14" :title="sonItem.cell2|titLen">{{sonItem.cell2,10|titLen}}</span>
                                <span class="patNum145" v-show="sonItem.caseType==14" :title="sonItem.cell3|titLen">{{sonItem.cell3,8|titLen}}</span>
                                <span class="patNum110" v-show="sonItem.caseType==14" :title="sonItem.customerName|titLen">{{sonItem.customerName,6|titLen}}</span>
                                <span class="patNum1" v-show="sonItem.caseType==14" :title="tagFn(sonItem.cell4)|titLen" >{{sonItem.cell4?(titLen(tagFn(sonItem.cell4),8)):''}}</span>
                                <span class="patNum1" v-show="sonItem.caseType==14" :title="sonItem.cell5|titLen" style="width: 126px">{{sonItem.cell5,8|titLen}}</span>
                                <span class="patNum" v-show="sonItem.caseType!=14" :title="sonItem.caseMain|titLen">{{sonItem.caseMain,43|titLen}}</span><!--问诊患者只展示主诉-->
                            </li>
                        </ul>
                    </section>
                </div>
                <div class="patPopupCont" v-show="importErr||importSuc">
                    <section class="importError" v-show="importErr">
                        <i class="impClose" @click.stop="popupCancle"></i>
                        <article class="impErrTop">
                            <i></i>
                            <p>导入失败，请检查你的的网络设置</p>
                        </article>
                        <article class="impErrBot">
                            <button class="impCancle" @click.stop="popupCancle">取消</button>
                            <button class="impAgain" @click="importBtn">重新上传</button>
                        </article>
                    </section>
                    <section class="importSuc importError" v-show="importSuc">
                        <i class="impClose" @click.stop="popupSucCancle"></i>
                        <article class="impErrTop">
                            <i></i>
                            <div>
                                <p>导入成功</p>
                                <p>
                                    已将选择的患者成功导入到病历中，可在全部病历中查看
                                </p>
                            </div>
                        </article>
                        <article class="impErrBot">
                            <button class="impAgain" @click.stop="Iknow">知道了</button>
                        </article>
                    </section>
                </div>
                <div class="NonePatients" v-show="noneP">
                    <img src="/static/images/pages/choosePatients/nonePatients.png">
                    <div>
                        暂无患者
                    </div>
                </div>
                <!--分页开始-->
                <pagination style="margin-top:35px" :pageIndex="pageIndex" :pageSize="pageSize" :total="total" @change="pageChange" v-if="showPager"></pagination>
                <!--分页结束-->
            </section>
        </section>
        <!--loading开始-->
        <loading v-show="showLoading" @showLoading="showLoading"></loading>
        <!--loading结束-->
    </div>
</template>
<script>
    import pagination from "~components/pagination/pagination.vue";
    import videoPlayer from  '~components/videoPlayer/videoPlayer.vue';
    import loading from '~components/loading/loading.vue';
    import comm from '../../utils/comm.js';

    import axios from 'axios';
    import HeaderTopNav from "../../components/common/headerTopNav";
    const xUrl={
        patientList:'/call/patient/case_baseinfo/getPatientCaseSelects/',//选择患者列表
        importCreat:'/call/caseFolder/baseinfo/batchCreate/',//导入病历
        getDoctorList:'/call/caseFolder/team_member/getDoctorListByCustomerId/',//获取医生列表
    };
    export default {
        name: 'index-app',
        provide(){
          return{
              reload:this.reload
          }
        },
        data() {
            return {
                // customerId:'1501482969554',
                customerId:comm.cookie.get("userId"),//获取用户Id
                customerRole:localStorage.getItem("customerRole"),//获取customerRole（3为医助）
                userName:localStorage.getItem('userName'),//获取医生姓名
                docCustomerId:'',//医生id（医助登录后）
                pageIndex:1,
                pageSize:10,
                total:0,
                crumbsTxt:'选择患者',
                showLoading:false,
                tipError:false,//错误提示，true为显示错误提示
                patientLists:'',//病历列表数据
                patChoNum:'',//已经选择的病历数
                isClicked:false,//用来标示已经点击过
                indexItem:[],//用来标示是否选中
                patientData:[],//用来存放所有传入的数据
                importSuc:false,//导入成功
                importErr:false,//导入失败
                showPager:false,//展示分页
                impDef:true,//导入按钮默认显示导入
                impPro:false,//点击导入过程中显示"···"
                belongType:0,//0--个人，1--团队
                noneP:false,//标识是否有病历信息
                docList:[],//报道医生列表
                choseDoc:'',//报道医生
                choseDocId:'',//报道医生id
                choseDocSub:'',//点击筛选之后保存报道医生
                choseType:'住院患者',//报道类型默认选择
                choseTypeId:'2,5',//报道类型默认选择
                choseTypeSub:'2,5',//点击筛选之后保存报道类型
                isShowDoc:false,//是否显示报道医生下拉列表
                isSowType:false,//是否显示报道类型
            }
        },
        components: {
            HeaderTopNav,//顶部fixed
            pagination,//分页
            videoPlayer,//视频播放器
            loading,//loading
        },
        mounted() {
            this.getDoctorList();//获取下拉医生列表
        },
        watch:{
            importErr(){//导入病历失败
                if(this.importErr){
                    document.getElementsByTagName('body')[0].className = 'bodyHidden';
                }else{
                    document.getElementsByTagName('body')[0].classList.remove("bodyHidden");
                }
            },
            importSuc(){//导入病历成功
                if(this.importSuc){
                    document.getElementsByTagName('body')[0].className = 'bodyHidden';
                }else{
                    document.getElementsByTagName('body')[0].classList.remove("bodyHidden");
                }
            },
        },
        methods:{
            pageChange(pageIndex){//切换页数，请求数据
                this.patientList(pageIndex);
            },
            importBtn(){//点击导入病历按钮
                let t = this;
                if(!t.noneP){
                    if(t.patChoNum<=0){//是否已经选择了病历
                        t.tipError = true;
                        let timer = setTimeout(function () {
                            t.tipError = false;
                            clearTimeout(timer);
                        },3000);
                    }else{
                        //    此时走入接口判断是否导入成功过
                        t.showLoading=true;
                        comm.ajax2({
                            url: xUrl.importCreat,
                            type:"post",
                            data:{
                                paramJson:JSON.stringify(t.patientData)
                            },
                            timeout: 30000,
                            success:function(res){
                                t.showLoading=false;
                                t.impDef = false;//导入按钮默认样式
                                t.impPro = true;//导入过程按钮...显示
                                if(res&&res.responseObject&&res.responseObject.responseStatus){//导入成功
                                    t.importSuc=true;//导入成功
                                    t.importErr=false;
                                    t.impDef = true;
                                    t.impPro = false;
                                }else{
                                    t.importSuc=false;
                                    t.importErr=true;//导入失败
                                    t.impDef = true;
                                    t.impPro = false;
                                }
                            },
                            fail:function () {
                                t.showLoading=false;
                                t.importSuc=false;
                                t.importErr=true;//导入失败
                                t.impDef = true;
                                t.impPro = false;
                            }
                        })
                    }
                }
            },
            itemCli(indexInner,caseId,info){//点击选择病历
                let t = this,index = '';
                t.isClicked = true;
                index=indexInner+'-'+caseId;
                if(t.indexItem.indexOf(index)>-1){
                    //移除元素
                    t.indexItem.splice(t.indexItem.indexOf(index), 1);
                    t.patientData.splice(t.patientData.indexOf(index),1);
                    t.patChoNum--;
                }else {
                    //选中元素
                    t.indexItem.push(index);
                    if(info.caseType==14){//如果是报道患者则不传证件号
                        t.patientData.push({
                            patientName:info.patientName,
                            patientAge:info.patientAgeDetail,
                            patientSex:info.patientSex==1?info.patientSex:'0',
                            patientMobile:info.mobile,
                            belongType:0,
                            customerId:info.reportCustomerId,
                            siteId:1,
                            patientId:info.patientId,
                            tagIdList:info.patientTagList,
                            doctorId:info.reportCustomerId,
                            creatorId:t.customerId,
                        });
                    }else{
                        t.patientData.push({
                            patientName:info.patientName,
                            patientAge:info.patientAgeDetail,
                            patientSex:info.patientSex==1?info.patientSex:'0',
                            patientMobile:info.mobile,
                            numberType:4,
                            numberContent:info.certificateCode,
                            belongType:0,
                            customerId:t.customerId,
                            siteId:1,
                            patientId:info.patientId,
                            doctorId:t.customerId,
                            creatorId:t.customerId,
                        });
                    }
                    t.patChoNum++;
                }
            },
            patientList(pageIndex){//病历列表
                let t=this;
                t.showLoading=true;
                comm.ajax2({
                    url: xUrl.patientList,
                    type:"get",
                    data:{
                        paramJson:JSON.stringify({
                            customerId:t.customerRole==13?t.choseDocSub:t.customerId,//医生id，如果登录的是医助并且报道医生选择某个医生，则传入某个医生的id
                            assCustomerId:t.customerRole==13&&!t.choseDocSub?t.customerId:'',//医助角色id，如果是医助并且报道医生选择了全部，则传此字段为当前登录的医助id
                            firstResult:(pageIndex?pageIndex-1:t.pageIndex-1)*t.pageSize,
                            maxResult:t.pageSize,
                            customerRole:this.customerRole==13?'13':0,
                            reportTypeList:this.choseTypeSub,
                            caseTypeIn:this.customerRole==13?'14':'',
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.showLoading=false;
                        if(res&&res.responseObject&&res.responseObject.items&&res.responseObject.items.length>0){
                            t.patientLists=res.responseObject.items;
                            t.pageSize = res.responseObject.pageSize;
                            t.total = res.responseObject.pageCount;
                            if(res.responseObject.pageCount>1){
                                t.showPager = true;
                            }
                            t.noneP = false;
                        }else{
                            t.noneP = true;//没有患者样式提示
                            t.patientLists = [];
                            t.total = 0;
                            t.pageSize = 10;
                            t.showPager = false;//不展示分页
                        }
                    },
                });
            },
            popupCancle(){//失败后点击取消或者关闭按钮
                this.importSuc=false;
                this.importErr=false;
                // t.reload();
            },
            popupSucCancle(){//导入成功后点击X重新刷新页面
                location.reload();
            },
            Iknow(){//点击我知道了 进入全部病历页
                window.location.href='/'
            },
            titLen:function (txt,len) {//判断title长度进行显示长内容
                if(len){
                    return comm.getStrLen(comm.cutLine(txt,",","_",","),len*2);
                }else{
                    return comm.cutLine(txt,",","_",",");
                }
            },
            tagFn(data){//将所有标签进行分割开
               if(data){
                   data = data.split(',');
                   let dataList = '';
                   for(let i = 0;i<data.length;i++){
                       if(i==0){
                           dataList = '#'+data[0]+'#';
                       }else{
                           dataList +=  '#'+data[i]+'#';
                       }
                   }
                   return dataList;
               }
            },
            //获取医生列表接口
            getDoctorList() {
                let _this = this;
                if(_this.customerRole==13){//如果是医助角色
                    comm.ajax2({
                        url: xUrl.getDoctorList,
                        type:"get",
                        data:{
                            paramJson:JSON.stringify({
                                customerId:_this.customerId,
                                firstResult:0,
                                maxResult:9999,
                                customerRole:3,
                                customerState:1,
                                isValid:1
                            })
                        },
                        timeout: 30000,
                        success:function(res){
                            _this.showLoading=false;
                            if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.dataList){
                                _this.docList = res.responseObject.responseData.dataList;
                                _this.docList.unshift({
                                    customerName:'全部',
                                    customerId:'',
                                });
                                //默认选择第一个医生
                                _this.choseDoc = _this.docList[1].customerName;//报道医生
                                _this.choseDocId = _this.docList[1].customerId;//报道医生id
                                _this.choseDocSub = _this.docList[1].customerId;//报道医生id
                                _this.patientList();//获取列表展示
                            }else{//如果是医助角色，并且没有分配医生则不进行获取患者列表，默认展示成没有患者的样式
                                _this.docList = [{
                                    customerName:'全部',
                                    customerId:'',
                                }];
                                _this.choseDoc = _this.docList[0].customerName;//报道医生
                                _this.choseDocId = _this.docList[0].customerId;//报道医生id
                                _this.choseDocSub = _this.docList[0].customerId;//报道医生id
                                _this.noneP = true;
                                _this.patientLists = [];
                                _this.total = 0;
                                _this.pageSize = 10
                            }
                        },
                    })
                }else{//如果不是医助的角色则不走入接口，并且将默认全部和自己的数据进行填充
                    if(_this.customerRole==12){//如果是护士角色则只展示全部
                        _this.docList = [{
                            customerName:'全部',
                            customerId:'',
                        }];
                        _this.choseDoc = _this.docList[0].customerName;//报道医生
                        _this.choseDocId = _this.docList[0].customerId;//报道医生id
                        _this.choseDocSub = _this.docList[0].customerId;//报道医生id
                        _this.noneP = true;
                        _this.patientLists = [];
                        _this.total = 0;
                        _this.pageSize = 10
                    }else{//如果是医生则将自己的id进行填充
                        _this.docList = [{
                            customerName:'全部',
                            customerId:'',
                        },{
                            customerName:_this.userName,
                            customerId:_this.customerId,
                        }];
                        //默认选择第一个医生
                        _this.choseDoc = _this.docList[1].customerName;//报道医生
                        _this.choseDocId = _this.docList[1].customerId;//报道医生id
                        _this.choseDocSub = _this.docList[1].customerId;//报道医生id
                        _this.patientList();//获取列表展示
                    }
                }
            },
            //报道医生列表项点击
            docChoseFn(item){
                this.isShowDoc = !this.isShowDoc;
                this.choseDoc = item.customerName;
                this.choseDocId = item.customerId;
            },
            //报道类型选择
            typeChoseFn(type){
                this.choseType = type==''?'全部':(type==1?'住院患者':'门诊患者');
                this.choseTypeId = type==''?'':(type==1?'2,5':'1,4');
                this.isSowType = !this.isSowType;
            },
            //点击切换医生/类型列表是否显示
            changeDocFn(type){
                if(type==1){//表示是切换医生
                    this.isShowDoc = !this.isShowDoc;
                    this.isSowType = false;
                }else{//表示是切换类型
                    this.isShowDoc = false;
                    this.isSowType = !this.isSowType;
                }
            },
            //点击筛选按钮
            submitBtnFn(){
                this.showPager = false;//在点击筛选按钮后要回到首页，用this.pageindex = 1。不好用则将分页组件进行移除再进行追加，则正常。
                this.choseDocSub = this.choseDocId;//将id进行存储，防止更改了筛选项未点击筛选按钮时进行分页造成数据传入参数错误。
                this.choseTypeSub = this.choseTypeId;//同上
                this.patientList();
                this.indexItem = [];//将已经选择的数据进行清空
                this.patChoNum = '';
                this.patientData = [];
            }
        },
        filters:{
            patientSex(sex){
                if(sex==1){
                    return '男'
                }else{
                    return '女'
                }
            },
            titLen:function (txt,len) {//判断title长度进行显示长内容
                if(len){
                    return comm.getStrLen(comm.cutLine(txt,",","_",","),len*2);
                }else{
                    return comm.cutLine(txt,",","_",",");
                }
            },
            dateChange:function (date) {
                if(date){
                    let newDate = date.split("-");
                    return newDate[1]+'月'+newDate[2]+'日';
                }
            }
        },
        metaInfo: {
            title: '选择患者'
        }
    }
</script>
<style lang="scss">
    @import "../../assets/scss/base.scss";
    @import "../../assets/scss/pages/chosePatient.scss";
</style>
