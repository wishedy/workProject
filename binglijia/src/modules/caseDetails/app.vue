<template>
    <div class="alEmr-mainInner">
        <section class="alEmr-mainIndex" style="padding-left: 0">
            <TopHeader v-show="isBlong"></TopHeader>
            <caseDetail v-show="isBlong"></caseDetail>
            <!--没有权限查看-->
            <section class="noAuthority" v-show="!isBlong&&isHasReady">
                <img src="/static/images/pages/caseDetail/noAuthority.png">
                <p>
                    <span>暂无查看权限，{{countDown}}S后自动</span>
                    <a href="/">返回首页</a>
                </p>
            </section>
            <!--没有权限查看-->
            <section class="detRecord" v-show="isBlong">
                <div class="repRecord" @click.stop="repRecordCli()" v-show="!repLogFlag">报到信息</div>
                <div class="InqRecord" @click.stop="InqRecordCli()" v-show="!inqLogFlag">问诊信息</div>
            </section>
            <!--无报道信息-->
            <section class="reportLogNone" v-show="reportLogNone">
                <article class="reportLogCont" :style="{'margin-top':marH+'px'}">
                    <div class="reportLogTop">
                        报到信息<i @click.stop="repInqQuit"></i>
                    </div>
                    <div class="noneReportImg">
                        <img src="/static/images/pages/caseDetail/reportNone.png" alt="">
                    </div>
                    <div class="noneReportTxt">
                        暂无报到信息
                    </div>
                </article>
            </section>
            <!--无问诊信息-->
            <section class="reportLogNone" v-show="inqLogNone">
                <article class="reportLogCont" :style="{'margin-top':marH+'px'}">
                    <div class="reportLogTop">
                        问诊信息<i @click.stop="repInqQuit"></i>
                    </div>
                    <div class="noneReportImg">
                        <img src="/static/images/pages/caseDetail/InquisitionNone.png" alt="">
                    </div>
                    <div class="noneReportTxt">
                        暂无问诊信息
                    </div>
                </article>
            </section>
            <!--报道信息-->
            <section class="reportLog" v-show="reportLog">
                <article class="reportLogCont">
                    <div class="reportLogTop">
                        报到信息<i @click.stop="repInqQuit"></i>
                    </div>
                    <div class="reportLogBot" :style="{height:ContH+'px'}">
                        <div v-for="(item,index) in repRight">
                            <div class="reportItemCont">
                                <div class="repItemDesc">
                                    <div class="repItem">
                                        <p class="repImteLeft">患者</p>
                                        <p class="repImteRight"><span>{{item.patientName}}&nbsp;&nbsp;&nbsp;{{item.sexName}}&nbsp;&nbsp;&nbsp;{{item.age}}岁</span><span class="outpatient" v-text="repTxt(item.reportType)">门诊患者</span></p>
                                    </div>
                                    <!--如果是门诊患者：reportType=1-->
                                    <div v-show="item.reportType==1">
                                        <div class="repItem">
                                            <p class="repImteLeft">就诊时间</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.visitDate)}">{{isNone(item.visitDate)?'未填写':(caseTimeFilter(item.visitDate,item.dateType))}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">医生诊断</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.doctorDiagnosis)}">{{isNone(item.doctorDiagnosis)?'未填写':item.doctorDiagnosis}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">治疗建议</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.doctorSuggest)}">{{isNone(item.doctorSuggest)?'未填写':item.doctorSuggest}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">报道目的</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.reportPurpose)}">{{isNone(item.reportPurpose)?'未填写':item.reportPurpose}}</p>
                                        </div>
                                    </div>
                                    <!--如果是住院患者：reportType=2-->
                                    <div v-show="item.reportType==2">
                                        <div class="repItem">
                                            <p class="repImteLeft">住院时间</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.visitDate)}">{{isNone(item.visitDate)?'未填写':(caseTimeFilter(item.visitDate,item.dateType))}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">医生诊断</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.doctorDiagnosis)}">{{isNone(item.doctorDiagnosis)?'未填写':item.doctorDiagnosis}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">是否手术</p>
                                            <p :class="{repImteRight:true,noneTxt:item.whetherOperation=='-1'}">{{item.whetherOperation=='-1'?'未填写':item.whetherOperation==0?'否':'是'}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">手术名称</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.operationName)}">{{isNone(item.operationName)?'未填写':item.operationName}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">手术时间</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.operationDate)}">{{isNone(item.operationDate)?'未填写':(caseTimeFilter(item.operationDate,item.dateType))}}</p>
                                        </div>
                                    </div>
                                    <!--如果是未就诊患者：reportType=3-->
                                    <div v-show="item.reportType==3">
                                        <div class="repItem">
                                            <p class="repImteLeft">来源渠道</p>
                                            <p :class="{repImteRight:true,noneTxt:dataRes(1,item.reportChannelId,item.reportChannel,item.reportChannelOther)}">{{dataRes(2,item.reportChannelId,item.reportChannel,item.reportChannelOther)}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">就诊目的</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.reportAssist)}">{{isNone(item.reportAssist)?'未填写':item.reportAssist}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">病情描述</p>
                                            <p :class="{repImteRight:true,noneTxt:isNone(item.reportPersonCondition)}">{{isNone(item.reportPersonCondition)?'未填写':item.reportPersonCondition}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="reportImgItemCont" v-show="!(isNone(item.caseAttList)&&isNone(item.videoAttList)&&isNone(item.fileAttList))">
                                <div class="repItemTitle">
                                    <span>影像资料({{item.caseAttList,item.videoAttList,item.fileAttList|imgNum}})</span>
                                </div>
                                <div class="repItemImgDesc">
                                    <div class="repImgItem" v-show="!isNone(item.caseAttSortList)">
                                        <div class="ImgItemTitle">图片资料</div>
                                        <div class="ImgItemDesc" v-for="(ite,ind) in item.caseAttSortList">
                                            <div class="ImgItemData">{{ite.dataList[0].createTime|dateFilter}}</div>
                                            <ul class="ImgItems">
                                                <li class="ev-bigImg" :listId="items.id" @click.stop="viewBigImg" v-for="(items,i) in ite.dataList" v-show="i<12">
                                                    <img v-bind:src="items.caseMinAttUrl" alt="">
                                                    <p class="repImgMore" v-show="ite.dataList.length>12">
                                                        还有<span>{{ite.dataList,12|imgMore}}</span>张><i></i>
                                                    </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="repImgItem" v-show="!(isNone(item.fileAttList)&&isNone(item.videoAttList))">
                                        <div class="ImgItemTitle">其他文件</div>
                                        <div class="ImgItemDesc">
                                            <ul>
                                                <!--其他文件中的pdf-->
                                                <li class="imgItemList" v-for="(itemOtherF,indexOtherF) in item.fileAttList" v-show="!isNone(item.fileAttList)">
                                                    <img src="/static/images/pages/caseDetail/pdfImg.png" alt="">
                                                    <div class="imgItemListDesc">
                                                        <p><a :href="itemOtherF.caseAttUrl" target="_blank">{{itemOtherF.caseAttName}}</a></p>
                                                        <p>
                                                            <span>{{itemOtherF.createTime,1|dateFilter}}</span>
                                                            <span>{{itemOtherF.caseAttSize?(itemOtherF.caseAttSize/1048576).toFixed(2)+'M':"0M"}}</span>
                                                        </p>
                                                    </div>
                                                </li>
                                                <!--其他文件中video-->
                                                <li class="imgItemList" v-for="(itemOther,indexOther) in item.videoAttList" v-show="!isNone(item.videoAttList)">
                                                    <img src="/static/images/pages/caseDetail/videoImg.png" alt="">
                                                    <div class="imgItemListDesc" @click.stop="videoCli(itemOther.caseAttUrl,itemOther.qiniuStatus)">
                                                        <!--<p>{{itemOther.caseAttName}}</p>-->
                                                        <p>视频</p>
                                                        <p>
                                                            <span>{{itemOther.createTime,1|dateFilter}}</span>
                                                            <span>{{itemOther.caseAttSize?(itemOther.caseAttSize/1048576).toFixed(2)+'M':"0M"}}</span>
                                                        </p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--<div class="repItemTitle">-->
                                <!--<span>专科检查</span>-->
                            <!--</div>-->
                            <!--<div class="repItemDesc">-->
                                <!--<div class="repItem">-->
                                    <!--<p class="repImteLeft">视诊</p>-->
                                    <!--<p class="repImteRight">{{isNone(item.specialtyMap.visualInspection)?'':item.specialtyMap.visualInspection}}</p>-->
                                <!--</div>-->
                                <!--<div class="repItem">-->
                                    <!--<p class="repImteLeft">活动</p>-->
                                    <!--<p class="repImteRight">{{isNone(item.specialtyMap.activityState)?'':item.specialtyMap.activityState}}</p>-->
                                <!--</div>-->
                                <!--<div class="repItem">-->
                                    <!--<p class="repImteLeft">病情描述</p>-->
                                    <!--<p class="repImteRight">{{isNone(item.specialtyMap.muscleStrength)?'':item.specialtyMap.muscleStrength}}</p>-->
                                <!--</div>-->
                            <!--</div>-->
                        </div>
                    </div>
                </article>
            </section>
            <!--问诊信息-->
            <section class="reportLog" v-show="inqLog">
                <article class="reportLogCont">
                    <div class="reportLogTop">
                        问诊信息<i @click.stop="repInqQuit"></i>
                    </div>
                    <div class="reportLogBot" :style="{height:ContH+'px'}">
                        <div>
                            <ul class="inqLeftNav" :style="{height:ContH+'px'}">
                                <li :class="{active:index==inqIndex}" @click.stop="inqItemCli(index,item.caseId)" v-for="(item,index) in inqLeft" :data-caseId="item.caseId">{{item.timeYMD}}</li>
                            </ul>
                            <div class="inqContent" v-for="(item,index) in inqRight">
                                <!--v-for="(item,index) in inqRight"-->
                                <div class="inqLogItemCont">
                                    <div class="repItemDesc">
                                        <div class="repItem">
                                            <p class="repImteLeft">患者</p>
                                            <p class="repImteRight">{{item.patientName}}&nbsp;&nbsp;&nbsp;{{item.sexName}}&nbsp;&nbsp;&nbsp;{{item.age}}岁</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">电话</p>
                                            <p :class="{repImteRight:true,noneTxt:item.mobile==''}">{{item.mobile==''?'未填写':item.mobile}}</p>
                                        </div>
                                        <div class="repItem">
                                            <p class="repImteLeft">民族</p>
                                            <p :class="{repImteRight:true,noneTxt:item.nation==''}">{{item.nation==''?'未填写':item.nation}}</p>
                                        </div>
                                        <div class="repItem" v-show="">
                                            <p class="repImteLeft">籍贯</p>
                                            <p :class="{repImteRight:true,noneTxt:(item.nativeProvince==''&&item.nativeCity==''&&item.nativeDistrict=='')}">{{(item.nativeProvince||item.nativeCity||item.nativeDistrict)?item.nativeProvince+'&nbsp;'+item.nativeCity+'&nbsp;'+item.nativeDistrict:'未填写'}}</p>
                                        </div>
                                        <div class="repItem" v-show="">
                                            <p class="repImteLeft">婚姻状况</p>
                                            <p :class="{repImteRight:true,noneTxt:item.isMarriage==-1}">{{item.isMarriage|isMarriage}}</p>
                                        </div>
                                        <div class="repItem" v-show="">
                                            <p class="repImteLeft">家庭地址</p>
                                            <p :class="{repImteRight:true,noneTxt:item.homeAddress==''}">{{item.homeAddress?item.homeAddress:'未填写'}}</p>
                                        </div>
                                        <div class="repItem" v-show="">
                                            <p class="repImteLeft">工作单位</p>
                                            <p :class="{repImteRight:true,noneTxt:item.workplace==''}">{{item.workplace?item.workplace:'未填写'}}</p>
                                        </div>
                                    </div>
                                    <div class="repItemTitle" v-show="!(isNone(item.caseMain)&&isNone(item.caseProperties)&&isNone(item.descriptionDisease)&&isNone(item.needHelp)&&isNone(item.treatmentList)&&isNone(item.takeMedicine)&&isNone(item.treatmentList))">
                                        <span>患者自诉</span>
                                    </div>
                                    <div class="repItemDesc">
                                        <div class="repItem" v-show="!isNone(item.caseMain)">
                                            <p class="repImteLeft">患者主诉</p>
                                            <p class="repImteRight">{{isNone(item.caseMain)?'':item.caseMain}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.caseProperties)">
                                            <p class="repImteLeft">疼痛说明</p>
                                            <p class="repImteRight">{{isNone(item.caseProperties)?'':item.caseProperties}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.descriptionDisease)">
                                            <p class="repImteLeft">病情描述</p>
                                            <p class="repImteRight">{{isNone(item.descriptionDisease)?'':item.descriptionDisease}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.needHelp)">
                                            <p class="repImteLeft">就诊目的</p>
                                            <p class="repImteRight">{{isNone(item.needHelp)?'':item.needHelp}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.treatmentList)">
                                            <p class="repImteLeft">治疗情况</p>
                                            <p class="repImteRight">{{item.treatmentList|commOption}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.takeMedicine)">
                                            <p class="repImteLeft">在用药物</p>
                                            <p class="repImteRight">{{isNone(item.takeMedicine)?'':item.takeMedicine}}</p>
                                        </div>
                                        <div class="repItem" v-for="(itemTre,indexTre) in item.treatmentList" v-show="itemTre!=''">
                                            <p class="repImteLeft">{{itemTre.commOptionDesc}}</p>
                                            <p class="repImteRight">{{itemTre.optionDesc}}</p>
                                        </div>
                                        <div class="repItem" v-for="(itemTre,indexTre) in item.treatmentList" v-if="itemTre.commOptionName=='手术'">
                                            <p class="repImteLeft">手术时间</p>
                                            <p class="repImteRight">{{itemTre.optionRemark|dateFilter}}</p>
                                        </div>
                                    </div>
                                    <div class="repItemTitle" v-show="!(isNone(item.caseAttList)&&isNone(item.videoAttList)&&isNone(item.fileAttList))">
                                        <span>影像资料({{item.caseAttList,item.videoAttList,item.fileAttList|imgNum}})</span>
                                    </div>
                                    <div class="repItemImgDesc">
                                        <div class="repImgItem" v-show="!isNone(item.caseAttSortList)">
                                            <div class="ImgItemTitle">图片资料</div>
                                            <div class="ImgItemDesc" v-for="(ite,ind) in item.caseAttSortList">
                                                <div class="ImgItemData">{{ite.dataList[0].createTime|dateFilter}}</div>
                                                <ul class="ImgItems">
                                                    <li class="ev-bigImg" :listId="items.id" @click.stop="viewBigImg" v-for="(items,i) in ite.dataList" v-show="i<12">
                                                        <img v-bind:src="items.caseMinAttUrl" alt="">
                                                        <p class="repImgMore" v-show="ite.dataList.length>12&&i==11">
                                                            还有<span>{{ite.dataList,12|imgMore}}</span>张><i></i>
                                                        </p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="repImgItem" v-show="!(isNone(item.fileAttList)&&isNone(item.videoAttList))">
                                            <div class="ImgItemTitle">其他文件</div>
                                            <div class="ImgItemDesc">
                                                <ul>
                                                    <!--其他文件中的pdf-->
                                                    <li class="imgItemList" v-for="(itemOtherF,indexOtherF) in item.fileAttList" v-show="!isNone(item.fileAttList)">
                                                        <img src="/static/images/pages/caseDetail/pdfImg.png" alt="">
                                                        <div class="imgItemListDesc">
                                                            <p><a :href="itemOtherF.caseAttUrl" target="_blank">{{itemOtherF.caseAttName}}</a></p>
                                                            <p>
                                                                <span>{{itemOtherF.createTime,1|dateFilter}}</span>
                                                                <span>{{itemOtherF.caseAttSize?(itemOtherF.caseAttSize/1048576).toFixed(2)+'M':"0M"}}</span>
                                                            </p>
                                                        </div>
                                                    </li>
                                                    <!--其他文件中video-->
                                                    <li class="imgItemList" v-for="(itemOther,indexOther) in item.videoAttList" v-show="!isNone(item.videoAttList)">
                                                        <img src="/static/images/pages/caseDetail/videoImg.png" alt="">
                                                        <div class="imgItemListDesc" @click.stop="videoCli(itemOther.caseAttUrl,itemOther.qiniuStatus)">
                                                            <!--<p>{{itemOther.caseAttName}}</p>-->
                                                            <p>视频</p>
                                                            <p>
                                                                <span>{{itemOther.createTime,1|dateFilter}}</span>
                                                                <span>{{itemOther.caseAttSize?(itemOther.caseAttSize/1048576).toFixed(2)+'M':"0M"}}</span>
                                                            </p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="repItemTitle" v-show="!isNone(item.triageMap.remarkList)">
                                        <span>分诊记录</span>
                                    </div>
                                    <div class="repItemDesc" v-show="!isNone(item.triageMap.remarkList)">
                                        <div class="repItem" v-for="(itemRem,indexRem) in item.triageMap.remarkList">
                                            <p class="repImteLeft" style="margin:0">记录{{indexRem+1}}：</p>
                                            <p class="repImteRight">{{itemRem.remarkContent}}</p>
                                        </div>
                                    </div>
                                    <div class="repItemTitle" v-show="!(isNone(item.specialtyMap.visualInspection)&&isNone(item.specialtyMap.activityState)&&isNone(item.specialtyMap.muscleStrength))">
                                        <span>专科检查</span>
                                    </div>
                                    <div class="repItemDesc" v-show="!(isNone(item.specialtyMap.visualInspection)&&isNone(item.specialtyMap.activityState)&&isNone(item.specialtyMap.muscleStrength))">
                                        <div class="repItem" v-show="!isNone(item.specialtyMap.visualInspection)">
                                            <p class="repImteLeft">视诊</p>
                                            <p class="repImteRight">{{isNone(item.specialtyMap.visualInspection)?'':item.specialtyMap.visualInspection}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.specialtyMap.activityState)">
                                            <p class="repImteLeft">活动</p>
                                            <p class="repImteRight">{{isNone(item.specialtyMap.activityState)?'':item.specialtyMap.activityState}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.specialtyMap.muscleStrength)">
                                            <p class="repImteLeft">肌力</p>
                                            <p class="repImteRight">{{isNone(item.specialtyMap.muscleStrength)?'':item.specialtyMap.muscleStrength}}</p>
                                        </div>
                                    </div>
                                    <div class="repItemTitle" v-show="!(isNone(item.presentHistory.produceContent)&&isNone(item.presentHistory.aggravateContent)&&isNone(item.presentHistory.otherContent))">
                                        <span>现病史</span>
                                    </div>
                                    <div class="repItemDesc" v-show="!(isNone(item.presentHistory.produceContent)&&isNone(item.presentHistory.aggravateContent)&&isNone(item.presentHistory.otherContent))">
                                        <div class="repItem" v-show="!isNone(item.presentHistory.produceContent)">
                                            <p class="repImteLeft">症状产生</p>
                                            <p class="repImteRight">{{item.presentHistory.produceContent?item.presentHistory.produceContent:''}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.presentHistory.aggravateContent)">
                                            <p class="repImteLeft">症状加重</p>
                                            <p class="repImteRight">{{item.presentHistory.aggravateContent?item.presentHistory.aggravateContent:''}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.presentHistory.otherContent)">
                                            <p class="repImteLeft">其他信息</p>
                                            <p class="repImteRight">{{item.presentHistory.otherContent?item.presentHistory.otherContent:''}}</p>
                                        </div>
                                    </div>
                                    <div class="repItemTitle" v-show="!(isNone(item.caseHistory.illness)&&isNone(item.caseHistory.operation)&&isNone(item.caseHistory.medicine)&&isNone(item.caseHistory.trauma)&&isNone(item.caseHistory.allergy)&&isNone(item.caseHistory.epidemic))">
                                        <span>既往史</span>
                                    </div>
                                    <div class="repItemDesc" v-show="!(isNone(item.caseHistory.illness)&&isNone(item.caseHistory.operation)&&isNone(item.caseHistory.medicine)&&isNone(item.caseHistory.trauma)&&isNone(item.caseHistory.allergy)&&isNone(item.caseHistory.epidemic))">
                                        <!--既往史：illness 疾病 operation手术 medicine 药物 trauma 外伤 allergy 过敏 epidemic 疫区接触-->
                                        <div class="repItem" v-show="!isNone(item.caseHistory.illness)">
                                            <p class="repImteLeft">疾病史</p>
                                            <p class="repImteRight">{{item.caseHistory.illness?item.caseHistory.illness+'。':''}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.caseHistory.operation)">
                                            <p class="repImteLeft">手术史</p>
                                            <p class="repImteRight">{{item.caseHistory.operation?item.caseHistory.operation:''}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.caseHistory.medicine)">
                                            <p class="repImteLeft">药物史</p>
                                            <p class="repImteRight">{{item.caseHistory.medicine?item.caseHistory.medicine:''}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.caseHistory.trauma)">
                                            <p class="repImteLeft">外伤史</p>
                                            <p class="repImteRight">{{item.caseHistory.trauma?item.caseHistory.trauma:''}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.caseHistory.allergy)">
                                            <p class="repImteLeft">过敏史</p>
                                            <p class="repImteRight">{{item.caseHistory.allergy?item.caseHistory.allergy:''}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.caseHistory.epidemic)">
                                            <p class="repImteLeft">疫区接触</p>
                                            <p class="repImteRight">{{item.caseHistory.epidemic?item.caseHistory.epidemic:''}}</p>
                                        </div>
                                    </div>
                                    <div class="repItemTitle" v-show="!(isNone(item.height)&&isNone(item.weight)&&isNone(item.bmi)&&isNone(item.physical.bloodPressureHigh)&&isNone(item.physical.Pulse)&&isNone(item.physical.breathing)&&isNone(item.physical.temperature)&&isNone(item.physical.bodySurfaceArea)&&isNone(item.physical.other))">
                                        <span>体格检查</span>
                                    </div>
                                    <div class="repItemDesc" v-show="!(isNone(item.height)&&isNone(item.weight)&&isNone(item.bmi)&&isNone(item.physical.bloodPressureHigh)&&isNone(item.physical.Pulse)&&isNone(item.physical.breathing)&&isNone(item.physical.temperature)&&isNone(item.physical.bodySurfaceArea)&&isNone(item.physical.other))">
                                        <div class="repItem" v-show="!isNone(item.height)">
                                            <p class="repImteLeft">身高</p>
                                            <p class="repImteRight">{{isNone(item.height)?'':item.height+'cm'}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.weight)">
                                            <p class="repImteLeft">体重</p>
                                            <p class="repImteRight">{{isNone(item.weight)?'':item.weight+'kg'}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.bmi)">
                                            <p class="repImteLeft">BMI</p>
                                            <p class="repImteRight">{{isNone(item.bmi)?'':item.bmi}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.physical.bloodPressureHigh)">
                                            <p class="repImteLeft">血压</p>
                                            <p class="repImteRight">{{isNone(item.physical.bloodPressureHigh)?'':item.physical.bloodPressureHigh+'mmHg/'+item.physical.bloodPressureLow+'mmHg'}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.physical.Pulse)">
                                            <p class="repImteLeft">脉搏</p>
                                            <p class="repImteRight">{{isNone(item.physical.Pulse)?'':item.physical.Pulse+'次/分'}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.physical.breathing)">
                                            <p class="repImteLeft">呼吸</p>
                                            <p class="repImteRight">{{isNone(item.physical.breathing)?'':item.physical.breathing+'次/分'}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.physical.temperature)">
                                            <p class="repImteLeft">体温</p>
                                            <p class="repImteRight">{{isNone(item.physical.temperature)?'':item.physical.temperature}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.physical.bodySurfaceArea)">
                                            <p class="repImteLeft">体表面积</p>
                                            <p class="repImteRight">{{isNone(item.physical.bodySurfaceArea)?'':item.physical.bodySurfaceArea}}</p>
                                        </div>
                                        <div class="repItem" v-show="!isNone(item.physical.other)">
                                            <p class="repImteLeft"></p>
                                            <p class="repImteRight">{{isNone(item.physical.other)?'':item.physical.other}}</p>
                                        </div>
                                    </div>
                                    <div class="repItemTitle" v-show="!isNone(item.personalHistory)">
                                        <span>个人史</span>
                                    </div>
                                    <div class="repItemDesc" v-show="!isNone(item.personalHistory)">
                                        <div class="repItem">
                                            <p class="repImteLeft">个人史</p>
                                            <p class="repImteRight">{{isNone(item.personalHistory)?'':item.personalHistory}}</p>
                                        </div>
                                    </div>
                                    <div class="repItemTitle" v-show="!isNone(item.familyHistory)">
                                        <span>家族史</span>
                                    </div>
                                    <div class="repItemDesc" v-show="!isNone(item.familyHistory)">
                                        <div class="repItem">
                                            <p class="repImteLeft">家族史</p>
                                            <p class="repImteRight">{{isNone(item.familyHistory)?'':item.familyHistory}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
            <!--视频开始-->
            <videoPlayer :path="path" :beginPlay="beginPlay" @beginFn="beginFn" :codeType="codeType"></videoPlayer>
            <!--视频结束-->
        </section>
        <loading v-show="showLoad"></loading>
    </div>
</template>
<script>
    import NavSideBar from '~components/common/NavSideBar.vue';
    import TopHeader from '~components/common/caseDetailHeaderTopNav.vue';
    import caseDetail from './components/caseDetail.vue';
    import videoPlayer from  '~components/videoPlayer/videoPlayer.vue'
    import loading from '~components/loading/loading.vue';
    import comm from "~utils/comm.js";
    import user from "~utils/user.js";
    const $ = require('jquery');
    import {mapActions,mapGetters} from 'vuex';
    import viewBigImgAll from '../../utils/view-big-img/module.view-big-img.js';
    const URL={
        inqLeft:'/call/patient/case/getInquisitionList/',//问诊信息左侧导航
        inqRight:'/call/patient/case/getMapByCaseIds/',//问诊信息右侧导航
        isBlong:'/call/caseFolder/baseinfo/checkIsBelongTeam/',//判断此会员是否属于该团队（即是否有权限看此病历）
    };
    export default {
        name: 'index-app',
        data() {
            return {
                cId:comm.cookie.get("userId"),
                caseId:comm.getpara().caseId,
                reportLogNone:false,//无报道信息
                reportLog:false,//有报道信息
                repLogFlag:true,//标识没有报道信息
                inqLogNone:false,//无问诊信息
                inqLog:false,//有问诊信息
                inqLogFlag:true,//标识没有问诊信息
                path:'',//视频地址
                beginPlay:false,//开始播放视频
                codeType:2,//视频转码状态
                inqLeft:[],//问诊信息左侧导航列表
                indexArr:[],//问诊信息存放所有已经请求过的Tab的索引
                inqIndex:0,//问诊信息左侧点击active标识
                inqRightArr:[],//所有问诊信息项
                inqRight:[],//问诊信息当前项
                repRight:[],//报道信息右侧显示项
                countDown:3,//回到首页倒计时
                ContH:0,//问诊信息，报道信息内容区高度
                marH:0,//问诊信息，报道信息内容为空时距离顶部的高度
                isHasReady:false,
                assistantDoctor:parseInt(comm.cookie.get("customerRole"))===13,
            }
        },
        components: {
            NavSideBar,
            TopHeader,
            caseDetail,
            loading,
            videoPlayer,
        },
        //参数集
        computed:{
            ...mapGetters(['showLoad','baseMustInfo','patientId','isBlong'])
        },
        methods:{
            //方法集
            ...mapActions(['showLoadi','baseMust','chaPatientId','chaIsBlong']),
            //判断会员是否是否是团队所属成员
            isBlongFn(){
                let t = this;
                t.showLoadi(true);
                comm.ajax2({
                    url:URL.isBlong,
                    type: "get",
                    data: {
                        paramJson:JSON.stringify({
                            customerId:t.cId,
                            caseId:t.caseId,
                            visitSiteId:1,
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.showLoadi(false);
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData&&res.responseObject.responseStatus){
                            t.isHasReady = true;
                            if(res.responseObject.responseData.isBelong==1){//表示是所属病历
                                t.chaIsBlong(true);//全局中判断是否隶属
                            }else{
                                t.chaIsBlong(false);//全局中判断是否隶属
                                t.countDownFn();//倒计数
                                // window.location.href = '/';//跳转到首页
                            }
                        }
                    },
                })
            },
            //报道信息
            repRecordCli(){
                let t = this;
                // document.getElementsByTagName('body')[0].className = 'bodyHidden';
                // $('body').addClass('bodyHidden');
                $('body').css('position',"");
                $('body').css('overflow',"hidden");
                if(t.repLogFlag){
                    // t.reportLogNone = true;
                }else{
                    //当报道信息为空则进行获取，并且不是没有数据情况
                    t.inqRightCon(2,0,t.caseId);//报道详情
                }
            },
            //问诊信息
            InqRecordCli(){
                let t = this;
                document.getElementsByTagName('body')[0].className = 'bodyHidden';
                // $('body').addClass('bodyHidden');
                $('body').css('position',"");
                $('body').css('overflow',"hidden");
                if(t.inqLogFlag){
                    // t.inqLogNone = true;
                }else{//当问诊信息为空则进行获取，并且不是没有数据情况
                    t.inqLeftBar();//问诊左侧导航信息
                }
            },
            repInqQuit(){
                let t = this;
                // $('body').removeClass('bodyHidden');
                t.showLoadi(false);
                // document.getElementsByTagName('body')[0].classList.remove("bodyHidden");
                $('body').css('position',"static");
                $('body').css('overflow',"scroll");
                t.reportLogNone=false;//无报道信息
                t.reportLog=false;//有报道信息
                t.inqLogNone=false;//无问诊信息
                t.inqLog=false;
                t.indexArr = [];
                t.inqLeft = [];
                t.inqRight = [];
                t.repRight = [];
                t.inqRightArr = [];
                t.inqIndex  = 0;
            },
            inqLeftBar(flag){//问诊记录左侧导航,flag:判断是否展示，而不是点击了问诊信息。
                let t = this;
                t.showLoadi(true);
                comm.ajax2({
                    url: URL.inqLeft,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            patientId:t.patientId,
                            customerId:t.cId,
                            // patientId:"1524022739020",
                            // customerId:"1428327147313"
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.showLoadi(false);
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.dataList){
                            if(res.responseObject.responseData.dataList.length>0){
                                if(flag){//只做判断是否存在用
                                    t.inqLogFlag = false;
                                }else{
                                    t.inqLeft = res.responseObject.responseData.dataList;
                                    t.inqRightCon(1,0,t.inqLeft[0].caseId);
                                }
                            }else{
                                t.inqLogFlag = true;
                            }
                        }else{
                            t.inqLogFlag = true;
                        }
                    },
                })
            },
            inqRightCon(type,index,caseId,flag){//右侧内容区域
                let t = this;
                let params = '';
                t.showLoadi(true);
                if(type==1){
                    params = {
                        caseIdList:caseId,
                        visitSiteId:1,
                        caseSocure:type,//1--问诊，2--报道
                        patientId:t.patientId,
                        customerId:t.cId,
                        attUseFlag:'9,12',
                    };
                }else{
                    params = {
                        visitSiteId:1,
                        caseSocure:type,//1--问诊，2--报道
                        patientId:t.patientId,
                        customerId:t.cId,
                        attUseFlag:'9,12',
                    };
                }
                comm.ajax2({
                    url:URL.inqRight,
                    type: "get",
                    data: {paramJson:JSON.stringify(params)},
                    timeout: 30000,
                    success:function(res){
                        t.showLoadi(false);
                        if(flag){
                            if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.dataList){
                                if(type==1){//问诊信息
                                    t.inqLog = false;
                                }else{//报道信息
                                    t.repLogFlag = false;
                                }
                            }else{
                                if(type==1){
                                    t.inqLogFlag = true;
                                }else{
                                    t.repLogFlag = true;
                                }
                            }
                        }else{
                            if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.dataList){
                                if(type==1){//问诊信息
                                    t.inqLog = true;
                                    t.inqRight = res.responseObject.responseData.dataList;
                                    t.inqRightArr.push(t.inqRight);
                                    t.indexArr.push(index);
                                }else{//报道信息
                                    t.reportLog = true;
                                    t.repRight = res.responseObject.responseData.dataList;
                                }
                            }else{
                                if(type==1){
                                    // t.inqLogNone = true;
                                    t.inqLogFlag = true;
                                }else{
                                    // t.reportLogNone = true;
                                    t.repLogFlag = true;
                                }
                            }
                        }
                    },
                })
            },
            inqItemCli(index,caseId){//问诊记录左侧导航点击事件
                let t = this;
                t.inqIndex = index;
                if(t.indexArr.indexOf(index)>=0){//如果已经请求过，则进行展示原有数据
                    t.inqRight = t.inqRightArr[index];
                }else{//否则进行请求数据
                    t.inqRightCon(1,index,caseId);
                }
            },
            viewBigImg(e){
                e.stopPropagation();
                e.preventDefault();
                var imgList=[],
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
                        srcSplit:true
                    });
                }
            },
            videoCli(path,state){
                if(state==2){
                    this.path = path.replace('http:','');
                }
                this.codeType = state;
                this.beginPlay = true;
            },
            beginFn(flag){
                this.beginPlay = flag;
            },
            repTxt(type){//报道信息区分患者类型
                switch (type){
                    case 1:
                        return '门诊患者';
                    case 2:
                        return '住院患者';
                    case 3:
                        return '未就诊患者';
                }
            },
            imgNum(num1,num2,num3){//获取影像资料显示总数如果总数为0则不显示
                return parseInt(num1.length)+parseInt(num2.length)+parseInt(num3.length);
            },
            countDownFn(){
                let t=this;
                if(!t.isBlong){
                    let timer = setInterval(function () {
                        if(t.countDown<=0){
                            clearInterval(timer);
                            window.location.href = '/';
                        }else{
                            t.countDown--;
                        }
                    },1000);
                }
            },
            gainHeight(){//获取高度,问诊信息报道信息高度
                let WH = window.innerHeight;
                this.ContH = WH - 150-80;//内容区域高度
                this.marH = (WH-600)/2;//报道信息问诊信息为空距离顶部高度
            },
            isNone(data){
                if(data==''||comm.isEmptyObject(data)){
                    return true;
                }else{
                    return false;
                }
            },
            caseTimeFilter(data,data2){//报道信息住院时间处理
                if(data){
                    let ymd = data.split(' ')[0];
                    let txt = '';
                    ymd = ymd.split('-')[0]+'年'+ymd.split('-')[1]+'月'+ymd.split('-')[2]+'日';
                    if(data2&&data2!=0){
                        switch (data2){
                            case 1:
                                txt = '上午';
                                break;
                            case 2:
                                txt = '下午';
                                break;
                            case 3:
                                txt = '晚上';
                                break;

                        }
                        return ymd+' '+txt;
                    }else{
                        return ymd;
                    }

                }
            },
            dataRes(typ,resType,data1,data2){
                if(typ==1){//表示判断是否是未填写
                    if(data1&&data1.length>0){
                        return false;
                    }else{
                        return true;
                    }
                }else{//表示
                    if(resType!=''){//如果没有返回id
                        switch (parseInt(resType)){
                            case 1://朋友推荐
                            case 2://医生
                                if(data2){
                                    if(data2.length>4){
                                        return data1+' - '+data2.substring(0,4)+'...';
                                    }else{
                                        return data1+' - '+data2;
                                    }
                                }else{
                                    return data1;
                                }
                                break;
                            case 0://其他
                                if(data1&&data1.length>0){
                                    if(data1.length>4){
                                        return data1.substring(0,4)+'...';
                                    }else{
                                        return data1;
                                    }
                                }else{
                                    return "未填写";
                                }
                                break;
                        }
                    }else{
                        return "未填写";
                    }
                }
            }
        },
        watch:{
            countDown(){},//当病历不隶属于当前登陆者进行倒计数跳转首页
            patientId(){//patientId是否已经请求成功
                this.inqRightCon(2,0,this.caseId,1);//报道详情
                this.inqLeftBar(1);//问诊左侧导航信息
            },
        },
        filters:{
            isMarriage(type){
                let t = this,txt='未婚';
                switch (parseInt(type)){//1-未婚2-已婚3-离异4-丧偶
                    case -1:
                        txt = '未填写';
                        break;
                    case 1:
                        txt = '未婚';
                        break;
                    case 2:
                        txt = '已婚';
                        break;
                    case 3:
                        txt = '离异';
                        break;
                    case 4:
                        txt = '丧偶';
                        break;
                }
                return txt;
            },
            imgNum(num1,num2,num3){//问诊信息中影像资料显示总数
                  return parseInt(num1.length)+parseInt(num2.length)+parseInt(num3.length);
            },
            dateFilter(txt,type){//年月日的格式修改
                if(type){
                    txt = txt.split(' ');
                    return txt[0];
                }else{
                    txt = txt.split(' ');
                    txt = txt[0].split('-');
                    txt = txt[0]+'年'+txt[1]+'月'+txt[2]+'日';
                    return txt;
                }

            },
            imgMore(txt,num){
                if(txt.length>num){
                    return parseInt(txt.length)-parseInt(num);
                }else{
                    return 0
                }
            },
            commOption(data){//将所有的字段进行截取拼接
                let txt = '';
                if(data!=''&&!comm.isEmptyObject(data)){
                    for(let i = 0;i<data.length;i++){
                        txt+=data[i].commOptionName+'，';
                    }
                    return txt.substring(0,txt.length-1);
                }else{
                    return ''
                }
            },
        },
        metaInfo: {
            title: '病历详情'
        },
        mounted() {
            let t=this;
            t.gainHeight();
            user.login({
                scene:0,
                callback(){
                    t.isBlongFn();
                }
            });
            // console.log(this.$store.state.showLoad)
        },
    }
</script>
<style lang="scss">
    @import "../../assets/scss/base.scss";
    @import "../../assets/scss/pages/caseDetail.scss";
    @import "../../utils/view-big-img/module.view-big-img.css";
</style>
