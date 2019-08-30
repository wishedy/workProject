<template>
    <!--筛选条件开始-->
    <section class="alEmr-screeningItems active" v-if="(noCListFlag==2)||(noCListFlag==0&&scrItemsFlag)">
        <aside class="screeningTips" v-if="creatorLen">
            <p class="tipsName">创建者：</p>
            <ul ref="creator_list" class="scTipsUl showMore" :class="{'closeStatus':creatorHeight&&!createUpTrue}">
                <li class="scTipsLi" v-for="(val,i) in tagArr.create_List" :class="{active:val.active}" :text="val.id"
                    @click="screeningClick(i,7)"><span
                    :title="val.customerName|commStr">{{val.customerName|commCutStr}}</span></li>
            </ul>
            <p class="screeningMoreBtn" :class="{'active':createUpTrue}" v-if="creatorHeight" @click="upMoreClick(7)">
                <span>{{createUpTrue?'收起':'更多'}}</span><i></i></p>
        </aside>
        <aside class="screeningTips" v-if="competentDoctorLen">
            <p class="tipsName">主管医生：</p>
            <ul ref="competent_Doctor" class="scTipsUl showMore"
                :class="{'closeStatus':comDoctorHeight&&!doctorUpTrue}">
                <li class="scTipsLi" v-for="(val,i) in tagArr.doctor_List" :class="{active:val.active}" :text="val.id"
                    @click="screeningClick(i,8)"><span
                    :title="val.customerName|commStr">{{val.customerName|commCutStr}}</span></li>
            </ul>
            <p class="screeningMoreBtn" :class="{'active':doctorUpTrue}" v-if="comDoctorHeight" @click="upMoreClick(8)">
                <span>{{doctorUpTrue?'收起':'更多'}}</span><i></i></p>
        </aside>
        <aside class="screeningTips" v-if="diagnosisLen">
            <p class="tipsName">诊断：</p>
            <ul ref="pre_Dia" class="scTipsUl showMore" :class="{'closeStatus':preDiaHeight&&!upTrue}">
                <li class="scTipsLi" v-for="(val,i) in tagArr.preDia_list" :class="{active:val.active}" :text="val.id"
                    @click="screeningClick(i,1)"><span :title="val.preDia|commStr">{{val.preDia|commCutStr}}</span></li>
            </ul>
            <p class="screeningMoreBtn" :class="{'active':upTrue}" v-if="preDiaHeight" @click="upMoreClick(1)"><span>{{upTrue?'收起':'更多'}}</span><i></i>
            </p>
        </aside>
        <aside class="screeningTips" v-if="tagLen">
            <p class="tipsName">标签：</p>
            <ul ref="tag_height" class="scTipsUl showMore" :class="{'closeStatus':tagHeight&&!tagUpTrue}">
                <li class="scTipsLi" v-for="(val,i) in tagArr.tag_list" :class="{active:val.active}"
                    @click="screeningClick(i,2)"><span :title="val.tagName|commStr">{{val.tagName|commCutStr}}</span>
                </li>
            </ul>
            <p class="screeningMoreBtn" :class="{'active':tagUpTrue}" v-if="tagHeight" @click="upMoreClick(2)"><span>{{tagUpTrue?'收起':'更多'}}</span><i></i>
            </p>
        </aside>
        <aside class="screeningTips" v-if="belongLen">
            <p class="tipsName">归属：</p>
            <ul ref="team_Height" class="scTipsUl showMore" :class="{'closeStatus':teamHeight&&!teamUpTrue}">
                <li class="scTipsLi" v-for="(val,i) in tagArr.team_list" :class="{active:val.active}"
                    @click="screeningClick(i,4)"><span :title="val.teamName|commStr">{{val.teamName|commCutStr}}</span>
                </li>
            </ul>
            <p class="screeningMoreBtn" :class="{'active':teamUpTrue}" v-if="teamHeight" @click="upMoreClick(3)"><span>{{teamUpTrue?'收起':'更多'}}</span><i></i>
            </p>
        </aside>
        <aside class="screeningTips">
            <p class="tipsName">性别：</p>
            <ul class="scTipsUl">
                <li class="scTipsLi sexLi" v-for="(val,i) in tagArr.sex_list"
                    :class="{active:parseInt(sexIndex)==parseInt(i)}" :key="i" @click="screeningClick(i,5)"><span>{{val.sexName}}</span>
                </li>
            </ul>
        </aside>
        <aside class="screeningTips">
            <p class="tipsName ageLabel">年龄：</p>
            <div class="ageBox" :class="{disableInput:notAgeFlag}">
                <div class="commAge startAge">
                    <p class="forInBox" v-for="(item,i) in startArr" v-if="item.active">
                        <input type="text" ref="evStartAge" :value="item.val" :class="{error:item.err}"
                               v-if="item.active" @input="startAgeFn(i)">
                        <span v-if="item.active">{{item.text}}</span>
                    </p>
                </div>
                <p class="ageLine"></p>
                <div class="commAge endAge">
                    <p class="forInBox" v-for="(item,i) in endArr">
                        <input type="text" ref="evEndAge" :value="item.val" :class="{error:item.err}"
                               v-if="item.active" @input="endAgeFn(i)">
                        <span v-if="item.active">{{item.text}}</span>
                    </p>
                </div>
                <p class="ageSureBtn" v-if="!notAgeFlag" @click="ageSureFn">确定</p>
            </div>
        </aside>
        <!--筛选条件结束-->
    </section>
</template>

<script>
    import comm from '~utils/comm.js';
    import { mapActions, mapGetters } from 'vuex';
    import TempCache from '../../../utils/tempcache';

    const $ = require('jquery');
    const xUrl = {
        screeningTag: '/call/caseFolder/baseinfo/getSearchParam/'//筛选条件列表
    };
    export default {
        name: 'screeningItems',
        data() {
            return {
                creatorLen: true,//创建者筛选条件是否存在
                competentDoctorLen: true,//主管医生筛选条件是否存在
                belongLen: true,//归属条件列表是否存在
                tagLen: true,//标签条件列表是否存在
                diagnosisLen: true,//初步诊断条件列表是否存在
                creatorLenFlag: 44,//创建者筛选是否有展开按钮，默认高度为一行44px
                comDoctorLenFlag: 44,//主管医生是否有展开按钮，默认高度为一行44px
                preDiaFlag: 44,//初步诊断是否有展开按钮，默认高度为一行44px
                tagFlag: 44,//标签是否有展开按钮，默认高度为一行44px
                teamFlag: 44,//归属是否有展开按钮，默认高度为一行44px
                createUpTrue: false,//创建者展开图标样式，默认收起的
                doctorUpTrue: false,//主管医生展开图标样式，默认收起的
                upTrue: false,//初步诊断展开图标样式，默认收起的
                tagUpTrue: false,//标签展开图标样式，默认收起的
                teamUpTrue: false,//归属展开图标样式，默认收起的
                sexIndex: '',//性别的点击index记录
                dataJson: {
                    preDia_list: [],
                    tag_list: [],
                    team_list: [],
                    sex_list: [],
                    doctor_List: [],
                    create_List: []
                },
                startArr: [
                    { text: '岁', err: false, active: true, val: '' },
                    { text: '月', err: false, active: false, val: '' },
                    { text: '天', err: false, active: false, val: '' }
                ],
                endArr: [
                    { text: '岁', err: false, active: true, val: '' },
                    { text: '月', err: false, active: false, val: '' },
                    { text: '天', err: false, active: false, val: '' }
                ]
            };
        },
        methods: {
            ...mapActions(['scrShowArrChange', 'sIdListChange', 'tIdListChange', 'createIdListChange', 'doctorIdListChange',
                'belongTypeChange', 'tNameListChange', 'scrShowFlagChange', 'tagArrChange', 'scrItemsFlagChange',
                'scrLoadingChange', 'sexIdChange', 'ageMinChange', 'ageMaxChange', 'notAgeFlagChange']),
            //开始年龄输入事件
            startAgeFn(index) {
                let t = this;
                //input激活的索引，input键入值，来自开始还是结束数组，另外一个需要兼容的数组
                t.ageMonDay(index, $(t.$refs.evStartAge), t.startArr, t.endArr);
            },
            //结束年龄输入事件
            endAgeFn(index) {
                let t = this;
                //点击的索引，input键入值，来自开始还是结束数组，另外一个需要兼容的数组
                t.ageMonDay(index, $(t.$refs.evEndAge), t.endArr, t.startArr);
            },
            //处理岁月天的判断公共方法
            ageMonDay(index, _kv, fArr, oArr) {//激活的索引，开始还是结束的input，数组来源，另一个关联的数组（开始或者结束）
                let kv = _kv.eq(index).val().replace(/[^\d]/g, '');//取值
                _kv.eq(index).val(kv);
                fArr[index].val = kv;
                fArr[index].err = false;
                if (index == 0) {//输入值是岁0-120
                    if (kv.trim().length !== 0 && parseInt(kv) >= 0 && parseInt(kv) <= 5) {//0到5岁  显示月天
                        fArr[1].active = true;
                        fArr[2].active = true;
                        if (parseInt(kv) > 0 && fArr[2].err) {//大于0岁时 天数不是必填可以去掉错误提示
                            fArr[2].err = false;
                        }
                    } else {
                        fArr[1].active = false;
                        fArr[2].active = false;
                        fArr[1].err = false;
                        fArr[2].err = false;
                        fArr[1].val = '';
                        fArr[2].val = '';
                        if (kv.trim().length !== 0 && !/^(?:[1-9][0-9]?|(0?[1-9])|1[01][0-9]|120)$/.test(kv)) {
                            fArr[0].err = true;
                        }
                    }
                    if (oArr[0].val && /^(?:[1-9][0-9]?|(0?[1-9])|1[01][0-9]|120)$/.test(oArr[0].val) && oArr[0].err) {//判断键入值连带着结束值错误恢复正常保证能确认点击
                        oArr[0].err = false;
                    }
                }
                if (index == 1) {//输入值是月 1-12
                    if (kv.trim().length !== 0 && !/^(0?[0-9]|1[0-2])$/.test(kv)) {
                        fArr[1].err = true;
                    }
                    if (oArr[1].val != 0 && /^(0?[0-9]|1[0-2])$/.test(oArr[1].val) && oArr[1].err) {//判断键入值连带着结束值错误恢复正常保证能确认点击
                        oArr[1].err = false;
                    }
                }
                if (index == 2) {//输入值是天1-31
                    if (kv.trim().length !== 0 && !/^((0?[1-9])|((1|2)[0-9])|30|31)$/.test(kv)) {
                        fArr[2].err = true;
                    }
                    if (oArr[2].val != 0 && /^((0?[1-9])|((1|2)[0-9])|30|31)$/.test(oArr[2].val) && oArr[2].err) {//判断键入值连带着结束值错误恢复正常保证能确认点击
                        oArr[2].err = false;
                    }
                    /*  if(fArr[0].val==0&&fArr[1].val==0&&kv==0){//如果前边都为0
                          fArr[2].err=true;
                      }*/
                }
            },
            //年龄筛选确认按钮点击
            ageSureFn() {
                let t = this;
                if (t.notAgeFlag) {//如果禁止编辑，确定点击无反应
                    return;
                }
                let _s1 = t.startArr[0],//开始年龄的数组
                    _s2 = t.startArr[1],
                    _s3 = t.startArr[2],
                    _e1 = t.endArr[0],//结束年龄的数组
                    _e2 = t.endArr[1],
                    _e3 = t.endArr[2];
                /*判断输入情况*/
                /*开始时间的判断开始*/
                if (_s1.val.trim().length !== 0 && _s1.val >= 0) {//岁>=0
                    if (_s1.val <= 5 && _s2.val.trim().length === 0) {//岁<=5岁，并且月份为“”
                        _s2.err = true;
                    }
                    if (parseInt(_s1.val) === 0 && _s3.val.trim().length === 0) {//0岁时 日必填
                        _s3.err = true;
                    }
                } else {
                    if (_s1.val.trim().length === 0) {//时间空
                        _s1.err = true;
                    }
                }
                /*开始时间的判断结束*/
                /*结束时间的判断开始*/
                if (_e1.val.trim().length !== 0 && _e1.val >= 0) {//岁>=0
                    if (parseInt(_e1.val) <= 5 && _e2.val.trim().length === 0) {//岁<=5岁，并且月份为“”
                        _e2.err = true;
                    }
                    if (parseInt(_e1.val) === 0 && _e3.val.trim().length === 0) {//0岁时 日必填
                        _e3.err = true;
                    }
                } else {
                    if (_e1.val.trim().length == 0) {//时间空
                        _e1.err = true;
                    }
                }
                /*结束时间的判断结束*/

                /*如果开始时间结束时间有必填项显示不允许筛选*/
                let _sureFlag = false;
                for (let i = 0; i < t.startArr.length; i++) {
                    if (t.startArr[i].err) {
                        _sureFlag = true;
                        break;
                    }
                }
                for (let i = 0; i < t.endArr.length; i++) {
                    if (t.endArr[i].err) {
                        _sureFlag = true;
                        break;
                    }
                }
                if (_sureFlag) {
                    return;
                }
                let _s1V = _s1.val != '' ? parseInt(_s1.val) : '',//开始岁月天的数值
                    _s2V = _s2.val != '' ? parseInt(_s2.val) : '',
                    _s3V = _s3.val != '' ? parseInt(_s3.val) : '',
                    _e1V = _e1.val != '' ? parseInt(_e1.val) : '',//结束岁月天的数值
                    _e2V = _e2.val != '' ? parseInt(_e2.val) : '',
                    _e3V = _e3.val != '' ? parseInt(_e3.val) : '';
                /*开始时间结束时间比较开始*/
                if (_s1.val.trim().length != 0 && _s1.val >= 0 && _e1.val.trim().length != 0 && _e1.val >= 0) {
                    if (_s1V > _e1V) {//开始岁大于结束岁 _e1<_s1
                        _s1.err = true;
                        _e1.err = true;
                    } else {//开始岁小于等于结束岁 _e1>=_s1
                        if (_s1V > 5 && _e1V > 5) {//开始岁和结束岁都大于5岁，判断结束的大或者等于开始都可以筛选
                            //如果相等，或者小于可以筛选
                            if (_s1V == _e1V) {// _e1==_s1
                                t.sureAgeCommFn(_s1, _s2, _s3, _e1, _e2, _e3, 1);
                            }
                            if (_s1V < _e1V) {// _e1>_s1
                                t.sureAgeCommFn(_s1, _s2, _s3, _e1, _e2, _e3);
                            }
                        } else {//开始结束岁有一个小于5岁或者都小于5岁
                            if (_s1V === _e1V) {//如果岁相等，比较月份  _e1==_s1
                                if (_s2V < _e2V) {//可以筛选
                                    t.sureAgeCommFn(_s1, _s2, _s3, _e1, _e2, _e3);
                                } else {//_s2>=_e2
                                    if (_s2V === _e2V) {//月份相等，比较天
                                        if (_s3V > _e3V) {//同岁同月  开始天大于结束天，不可以
                                            _s3.err = true;
                                            _e3.err = true;
                                        } else {//同年同月，同天或者小于都可以筛选_s3<=_e3
                                            //同岁同月同天的显示
                                            if (_s2V === _e2V && (_s3V === _e3V || !_s3V && !_e3V)) {
                                                if (_s1V === 0 && _s2V === 0 && _s3V === 0) {//开始都为0
                                                    _s3.err = true;
                                                }
                                                if (_e1V === 0 && _e2V === 0 && _e3V === 0) {//结束都为0
                                                    _e3.err = true;
                                                }
                                                if (!(_e1V === 0 && _e2V === 0 && _e3V === 0) && !(_s1V === 0 && _s2V === 0 && _s3V === 0)) {
                                                    t.sureAgeCommFn(_s1, _s2, _s3, _e1, _e2, _e3, 1);//因为同岁显示一个
                                                }
                                            } else {
                                                t.sureAgeCommFn(_s1, _s2, _s3, _e1, _e2, _e3);
                                            }
                                        }
                                    } else {//_s2>_e2
                                        _s2.err = true;
                                        _e2.err = true;
                                    }
                                }
                            } else {//如果开始小于结束，可以筛选  _e1>_s1
                                t.sureAgeCommFn(_s1, _s2, _s3, _e1, _e2, _e3);
                            }
                        }
                    }
                }
                /*开始时间结束时间比较结束*/
                t.scrShowFlag();
            },
            //确定点击按钮筛选年龄的公共方法提取
            sureAgeCommFn(_s1, _s2, _s3, _e1, _e2, _e3, showOne) {
                let t = this;
                t.ageMinChange(_s1.val + ',' + (_s2.val ? (parseInt(_s2.val) > 9 ? _s2.val : '0' + _s2.val) : '00')
                    + ',' + (_s3.val ? (parseInt(_s3.val) > 9 ? _s3.val : '0' + _s3.val) : '00'));
                t.ageMaxChange(_e1.val + ',' + (_e2.val ? (parseInt(_e2.val) > 9 ? _e2.val : '0' + _e2.val) : '00')
                    + ',' + (_e3.val ? (parseInt(_e3.val) > 9 ? _e3.val : '0' + _e3.val) : '00'));
                t.scrShowArrChange({
                    val: {
                        kv: _s1.val + '岁' + (_s2.val ? _s2.val + '月' : '') + (_s3.val ? _s3.val + '天' : '')
                        + (showOne ? '' : '-' + _e1.val + '岁' + (_e2.val ? _e2.val + '月' : '') + (_e3.val ? _e3.val + '天' : '')),
                        id: 10111,
                        active: true,
                        from: 6
                    }, flag: true
                });
                t.notAgeFlagChange(true);//已经选中年龄编辑，禁止再次编辑，只有删除选中才可以再进行编辑
            },
            //筛选条件请求,请求结果数组格式重组
            tagList() {
                let t = this;
                t.scrLoadingChange(true);
                comm.ajax2({
                    url: xUrl.screeningTag,
                    type: 'get',
                    dataType: 'json',
                    data: {
                        paramJson: JSON.stringify({
                            customerId: comm.cookie.get('userId') ? comm.cookie.get('userId') : '',
                            customerRole: TempCache.getItem('customerRole')?TempCache.getItem('customerRole'):comm.cookie.get('customerRole')
                        })
                    },
                    success: function(res) {
                        t.scrLoadingChange(false);
                        if (comm.hasResponseData(res)) {
                            let _tagArr = res.responseObject.responseData;
                            //20190316增加创建者和主管医生
                            //creatorList  （创建者）录入者列表
                            if (_tagArr.creatorList.length) {
                                for (let i = 0; i < _tagArr.creatorList.length; i++) {
                                    t.dataJson.create_List.push({
                                        // customerId:_tagArr.creatorList[i].customerId,
                                        customerName: _tagArr.creatorList[i].customerName,
                                        active: false,
                                        fromFlag: 7,
                                        id: _tagArr.creatorList[i].customerId
                                    });
                                }
                                t.creatorLen = true;
                            } else {
                                t.creatorLen = false;
                            }
                            //doctorList  主管医生列表
                            if (_tagArr.doctorList.length) {
                                for (let i = 0; i < _tagArr.doctorList.length; i++) {
                                    t.dataJson.doctor_List.push({
                                        // customerId:_tagArr.doctorList[i].customerId,
                                        customerName: _tagArr.doctorList[i].customerName,
                                        active: false,
                                        fromFlag: 8,
                                        id: _tagArr.doctorList[i].customerId
                                    });
                                }
                                t.competentDoctorLen = true;
                            } else {
                                t.competentDoctorLen = false;
                            }
                            //初步诊断
                            if (_tagArr.diagnosisList.length) {
                                for (let i = 0; i < _tagArr.diagnosisList.length; i++) {
                                    t.dataJson.preDia_list.push({
                                        preDia: _tagArr.diagnosisList[i],
                                        active: false,
                                        fromFlag: 1,
                                        id: '0001' + i
                                    });
                                }
                                t.diagnosisLen = true;
                            } else {
                                t.diagnosisLen = false;
                            }
                            //标签列表
                            if (_tagArr.tagList.length) {
                                for (let i = 0; i < _tagArr.tagList.length; i++) {
                                    t.dataJson.tag_list.push({
                                        tagName: _tagArr.tagList[i].tagName,
                                        active: false,
                                        fromFlag: 2,
                                        id: _tagArr.tagList[i].tagId
                                    });
                                }
                                t.tagLen = true;
                            } else {
                                t.tagLen = false;
                            }

                            //团队归属
                            t.dataJson.team_list = [
                                {
                                    teamName: '个人',
                                    id: '00041',
                                    active: false,
                                    fromFlag: 4
                                }];
                            if (_tagArr.belongTeamList.length) {//如果列表存在
                                // let _flag=false;//判断列表中有没有
                                let _arr = [];
                                let dayJson = {};
                                for (let i = 0; i < _tagArr.belongTeamList.length; i++) {
                                    let items = _tagArr.belongTeamList[i];
                                    t.dataJson.team_list.push({
                                        teamName: items.teamName,
                                        id: items.teamId,
                                        active: false,
                                        fromFlag: 4
                                    });
                                    dayJson = {
                                        teamName: items.teamName,
                                        active: false,
                                        teamId: items.teamId
                                    };
                                    _arr.push(dayJson);//处理是所有者的时候才能展示列表
                                }
                                t.belongLen = true;
                            } else {//没有团队，不显示归属
                                t.belongLen = false;
                            }

                            //性别重新定义赋值
                            t.dataJson.sex_list = [
                                { sexName: '男', id: '1', active: false, fromFlag: 5 },
                                { sexName: '女', id: '0', active: false, fromFlag: 5 }
                            ];
                            t.tagArrChange(t.dataJson);//数组赋值
                            t.scrItemsFlagChange(true);//有数据的时候筛选条件组件显示
                        } else {
                            t.scrItemsFlagChange(false);//无数据的时候筛选条件组件不显示
                        }
                    }
                });
            },
            //筛选条件的点击事件
            screeningClick(index, scrFlag) {
                let t = this;
                if (t.loading) {
                    return;
                }
                switch (parseInt(scrFlag)) {
                    case 1://初步诊断
                        for (let i = 0; i < t.tagArr.preDia_list.length; i++) {
                            let items = t.tagArr.preDia_list[i];
                            if (i === index) {
                                if (items.active) {
                                    items.active = false;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.preDia,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: false
                                    });
                                    t.sIdListChange({ val: items.preDia, flag: false });
                                } else {
                                    items.active = true;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.preDia,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: true
                                    });
                                    t.sIdListChange({ val: items.preDia, flag: true });
                                    t.closeComm(1);
                                }
                            }
                        }
                        break;
                    case 2://标签
                        for (let i = 0; i < t.tagArr.tag_list.length; i++) {
                            let items = t.tagArr.tag_list[i];
                            if (i === index) {
                                if (items.active) {
                                    items.active = false;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.tagName,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: false
                                    });
                                    t.tNameListChange({ val: items.id + '_' + items.tagName, flag: false });
                                } else {
                                    items.active = true;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.tagName,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: true
                                    });
                                    t.tNameListChange({ val: items.id + '_' + items.tagName, flag: true });
                                    t.closeComm(2);
                                }

                            }
                        }
                        break;
                    case 4://归属
                        for (let i = 0; i < t.tagArr.team_list.length; i++) {
                            let items = t.tagArr.team_list[i];
                            if (i === index) {
                                if (items.active) {
                                    items.active = false;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.teamName,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: false
                                    });
                                    if (index == 0) {//点击的个人归属
                                        t.belongTypeChange('');
                                    } else {
                                        t.tIdListChange({ val: items.id, flag: false });
                                    }
                                } else {
                                    items.active = true;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.teamName,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: true
                                    });
                                    if (index == 0) {//点击的个人归属
                                        t.belongTypeChange('0');
                                    } else {
                                        t.tIdListChange({ val: items.id, flag: true });
                                    }
                                    t.closeComm(3);
                                }
                            }
                        }
                        break;
                    case 5://性别筛选点击
                        if (parseInt(t.sexIndex) == parseInt(index)) {//如果点击了自己是取消选中
                            t.sexIndex = '';
                            t.tagArr.sex_list[index].active = false;
                            t.scrShowArrChange({
                                val: {
                                    kv: t.tagArr.sex_list[index].sexName,
                                    id: t.tagArr.sex_list[index].id,
                                    active: t.tagArr.sex_list[index].active,
                                    from: t.tagArr.sex_list[index].fromFlag
                                }, flag: false
                            });
                            t.sexIdChange('');//记录性别id
                        } else {//如果点击了一项，是添加选中同时去掉另一项选中
                            if (parseInt(t.sexIndex) === 0 || t.sexIndex) {//已经有选中的项目时
                                //删除之前选中的性别
                                t.tagArr.sex_list[t.sexIndex].active = false;//取消自己的选中设置active为false
                                t.scrShowArrChange({
                                    val: {
                                        kv: t.tagArr.sex_list[t.sexIndex].sexName,
                                        id: t.tagArr.sex_list[t.sexIndex].id,
                                        active: t.tagArr.sex_list[t.sexIndex].active,
                                        from: t.tagArr.sex_list[t.sexIndex].fromFlag
                                    }, flag: false
                                });
                                t.sexIdChange('');//记录性别id
                            }
                            //增加新选中的
                            t.sexIndex = index;
                            t.tagArr.sex_list[t.sexIndex].active = true;//取消自己的选中设置active为false
                            t.scrShowArrChange({
                                val: {
                                    kv: t.tagArr.sex_list[t.sexIndex].sexName,
                                    id: t.tagArr.sex_list[t.sexIndex].id,
                                    active: t.tagArr.sex_list[t.sexIndex].active,
                                    from: t.tagArr.sex_list[t.sexIndex].fromFlag
                                }, flag: true
                            });
                            t.sexIdChange(t.tagArr.sex_list[t.sexIndex].id);//记录性别id
                            t.closeComm(5);
                        }
                        break;
                    case 7://创建者
                        for (let i = 0; i < t.tagArr.create_List.length; i++) {
                            let items = t.tagArr.create_List[i];
                            if (i === index) {
                                if (items.active) {
                                    items.active = false;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.customerName,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: false
                                    });
                                    t.createIdListChange({ val: items.id, flag: false });
                                } else {
                                    items.active = true;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.customerName,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: true
                                    });
                                    t.createIdListChange({ val: items.id, flag: true });
                                    t.closeComm(7);
                                }
                            }
                        }
                        break;
                    case 8://主管医生
                        for (let i = 0; i < t.tagArr.doctor_List.length; i++) {
                            let items = t.tagArr.doctor_List[i];
                            if (i === index) {
                                if (items.active) {
                                    items.active = false;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.customerName,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: false
                                    });
                                    t.doctorIdListChange({ val: items.id, flag: false });
                                } else {
                                    items.active = true;
                                    t.scrShowArrChange({
                                        val: {
                                            kv: items.customerName,
                                            id: items.id,
                                            active: items.active,
                                            from: items.fromFlag
                                        }, flag: true
                                    });
                                    t.doctorIdListChange({ val: items.id, flag: true });
                                    t.closeComm(8);
                                }
                            }
                        }
                        break;
                }
                t.scrShowFlag();
            },
            //筛选条件展示开关
            scrShowFlag() {
                let t = this;
                let _s1 = false,//初步诊断
                    _s2 = false,//标签筛选
                    _s5 = false,//归属筛选
                    _s6 = false,//性别选中
                    _s7 = false,//年龄选中
                    _s8 = false,//创建者选中
                    _s9 = false;//主管医生选中
                //初步诊断标签是否有激活
                for (let i = 0; i < t.tagArr.preDia_list.length; i++) {
                    if (t.tagArr.preDia_list[i].active) {
                        _s1 = true;
                        break;
                    }
                }
                //标签筛选是否有激活
                for (let i = 0; i < t.tagArr.tag_list.length; i++) {
                    if (t.tagArr.tag_list[i].active) {
                        _s2 = true;
                        break;
                    }
                }
                //团队归属是否有激活
                for (let i = 0; i < t.tagArr.team_list.length; i++) {
                    if (t.tagArr.team_list[i].active) {
                        _s5 = true;
                        break;
                    }
                }
                //性别是否有选中
                for (let i = 0; i < t.tagArr.sex_list.length; i++) {
                    if (t.tagArr.sex_list[i].active) {
                        _s6 = true;
                        break;
                    }
                }
                if (t.ageMin && t.ageMax) {
                    _s7 = true;
                }
                //创建者标签是否有激活
                for (let i = 0; i < t.tagArr.create_List.length; i++) {
                    if (t.tagArr.create_List[i].active) {
                        _s8 = true;
                        break;
                    }
                }
                //主管医生标签是否有激活
                for (let i = 0; i < t.tagArr.doctor_List.length; i++) {
                    if (t.tagArr.doctor_List[i].active) {
                        _s9 = true;
                        break;
                    }
                }
                if (!(_s1 || _s2 || _s5 || _s6 || _s7 || _s8 || _s9)) {//各种筛选条件都没有激活状态
                    t.scrShowFlagChange(false);
                } else {//筛选有任一项激活状态
                    t.scrShowFlagChange(true);
                }
            },
            //展开收起操作
            upMoreClick(index) {
                let t = this;
                if (t.loading) {
                    return;
                }
                switch (parseInt(index)) {
                    case 1://初步诊断
                        t.closeComm(1);
                        t.upTrue = !t.upTrue;
                        break;
                    case 2://标签
                        t.closeComm(2);
                        t.tagUpTrue = !t.tagUpTrue;
                        break;
                    case 3://归属
                        t.closeComm(3);
                        t.teamUpTrue = !t.teamUpTrue;
                        break;
                    case 7://创建者
                        t.closeComm(7);
                        t.createUpTrue = !t.createUpTrue;
                        break;
                    case 8://主管医生
                        t.closeComm(8);
                        t.doctorUpTrue = !t.doctorUpTrue;
                        break;
                    default:

                        break;
                }
            },
            //收起弹层公共方法
            closeComm(index) {
                let t = this;
                $(t.$refs.pre_Dia).scrollTop(0);
                $(t.$refs.tag_height).scrollTop(0);
                $(t.$refs.team_Height).scrollTop(0);
                $(t.$refs.creator_list).scrollTop(0);
                $(t.$refs.competent_Doctor).scrollTop(0);
                switch (parseInt(index)) {
                    case 1://初步诊断
                        t.tagUpTrue = false;//标签
                        t.teamUpTrue = false;//归属
                        t.createUpTrue = false;//创建者
                        t.doctorUpTrue = false;//主管医生
                        break;
                    case 2://标签
                        t.upTrue = false;//初步诊断
                        t.teamUpTrue = false;//归属
                        t.createUpTrue = false;//创建者
                        t.doctorUpTrue = false;//主管医生
                        break;
                    case 3://归属
                        t.upTrue = false;//初步诊断
                        t.tagUpTrue = false;//标签
                        t.createUpTrue = false;//创建者
                        t.doctorUpTrue = false;//主管医生
                        break;
                    case 7://创建者
                        t.upTrue = false;//初步诊断
                        t.tagUpTrue = false;//标签
                        t.teamUpTrue = false;//归属
                        t.doctorUpTrue = false;//主管医生
                        break;
                    case 8://主管医生
                        t.upTrue = false;//初步诊断
                        t.tagUpTrue = false;//标签
                        t.teamUpTrue = false;//归属
                        t.createUpTrue = false;//创建者
                        break;
                    default:
                        t.upTrue = false;//初步诊断
                        t.tagUpTrue = false;//标签
                        t.teamUpTrue = false;//归属
                        t.createUpTrue = false;//创建者
                        t.doctorUpTrue = false;//主管医生
                        break;
                }
            }
        },
        computed: {
            ...mapGetters(['scrShowArr', 'sIdList', 'belongType', 'tIdList', 'tNameList', 'tagArr', 'scrItemsFlag',
                'noCListFlag', 'loading', 'ageMin', 'ageMax', 'notAgeFlag']),
            preDiaHeight() {
                let t = this;
                return t.preDiaFlag > 44;
            },
            tagHeight() {
                let t = this;
                return t.tagFlag > 44;
            },
            teamHeight() {
                let t = this;
                return t.teamFlag > 44;
            },
            creatorHeight() {//创建者筛选高度
                let t = this;
                return t.creatorLenFlag > 44;
            },
            comDoctorHeight() {//主管医生高度
                let t = this;
                return t.comDoctorLenFlag > 44;
            }

        },
        watch: {
            //判断选中项目的关联
            'scrShowArr': {
                handler(v1, v2) {
                    let t = this;
                    if (t.scrShowArr.length) {//还有选中的项目
                        //初步诊断
                        for (let j = 0; j < t.tagArr.preDia_list.length; j++) {
                            let _kv = t.tagArr.preDia_list[j];
                            let _thisData = false;
                            for (let i = 0; i < t.scrShowArr.length; i++) {
                                let items = t.scrShowArr[i];
                                if (parseInt(items.from) === 1) {
                                    if (_kv.id === items.id) {
                                        _thisData = true;
                                    }
                                }
                            }
                            if (_thisData) {
                                _kv.active = true;
                            } else {
                                _kv.active = false;
                            }
                        }
                        //标签
                        for (let j = 0; j < t.tagArr.tag_list.length; j++) {
                            let _kv = t.tagArr.tag_list[j];
                            let _thisData = false;
                            for (let i = 0; i < t.scrShowArr.length; i++) {
                                let items = t.scrShowArr[i];
                                if (parseInt(items.from) === 2) {
                                    if (_kv.id === items.id) {
                                        _thisData = true;
                                    }
                                }
                            }
                            if (_thisData) {
                                _kv.active = true;
                            } else {
                                _kv.active = false;
                            }
                        }
                        //归属
                        for (let j = 0; j < t.tagArr.team_list.length; j++) {
                            let _kv = t.tagArr.team_list[j];
                            let _thisData = false;
                            for (let i = 0; i < t.scrShowArr.length; i++) {
                                let items = t.scrShowArr[i];
                                if (parseInt(items.from) === 4) {
                                    if (_kv.id === items.id) {
                                        _thisData = true;
                                    }
                                }
                            }
                            if (_thisData) {
                                _kv.active = true;
                            } else {
                                _kv.active = false;
                            }
                        }
                        //性别
                        let _thisDataSex = false;
                        for (let j = 0; j < t.tagArr.sex_list.length; j++) {
                            let _kv = t.tagArr.sex_list[j];
                            let _thisData = false;
                            for (let i = 0; i < t.scrShowArr.length; i++) {
                                let items = t.scrShowArr[i];
                                if (parseInt(items.from) === 5) {
                                    if (_kv.id === items.id) {
                                        _thisData = true;
                                        _thisDataSex = true;
                                    }
                                }
                            }
                            if (_thisData) {
                                _kv.active = true;
                            } else {
                                _kv.active = false;
                            }
                        }
                        if (!_thisDataSex) {//如果选中列表中没有性别
                            t.sexIndex = '';
                        }

                        //创建者
                        for (let j = 0; j < t.tagArr.create_List.length; j++) {
                            let _kv = t.tagArr.create_List[j];
                            let _thisData = false;
                            for (let i = 0; i < t.scrShowArr.length; i++) {
                                let items = t.scrShowArr[i];
                                if (parseInt(items.from) === 7) {
                                    if (_kv.id === items.id) {
                                        _thisData = true;
                                    }
                                }
                            }
                            if (_thisData) {
                                _kv.active = true;
                            } else {
                                _kv.active = false;
                            }
                        }
                        //主管医生
                        for (let j = 0; j < t.tagArr.doctor_List.length; j++) {
                            let _kv = t.tagArr.doctor_List[j];
                            let _thisData = false;
                            for (let i = 0; i < t.scrShowArr.length; i++) {
                                let items = t.scrShowArr[i];
                                if (parseInt(items.from) === 8) {
                                    if (_kv.id === items.id) {
                                        _thisData = true;
                                    }
                                }
                            }
                            if (_thisData) {
                                _kv.active = true;
                            } else {
                                _kv.active = false;
                            }
                        }
                    } else {//已经没有选中的项目了
                        for (let j = 0; j < t.tagArr.preDia_list.length; j++) {//诊断
                            t.tagArr.preDia_list[j].active = false;
                        }
                        for (let j = 0; j < t.tagArr.tag_list.length; j++) {//标签
                            t.tagArr.tag_list[j].active = false;
                        }
                        for (let j = 0; j < t.tagArr.team_list.length; j++) {//归属
                            t.tagArr.team_list[j].active = false;
                        }
                        for (let j = 0; j < t.tagArr.sex_list.length; j++) {//性别
                            t.tagArr.sex_list[j].active = false;
                        }
                        t.sexIndex = '';
                        for (let j = 0; j < t.tagArr.create_List.length; j++) {//创建者
                            t.tagArr.create_List[j].active = false;
                        }
                        for (let j = 0; j < t.tagArr.doctor_List.length; j++) {//主管医生
                            t.tagArr.doctor_List[j].active = false;
                        }
                        t.scrShowFlagChange(false);
                    }
                },
                deep: true
            },
            //禁止编辑年龄检测
            notAgeFlag() {
                let t = this;
                if (t.notAgeFlag == false) {//可以编辑年龄
                    t.startArr = [
                        { text: '岁', err: false, active: true, val: '' },
                        { text: '月', err: false, active: false, val: '' },
                        { text: '天', err: false, active: false, val: '' }
                    ];
                    t.endArr = [
                        { text: '岁', err: false, active: true, val: '' },
                        { text: '月', err: false, active: false, val: '' },
                        { text: '天', err: false, active: false, val: '' }
                    ];
                    $(t.$refs.evStartAge).val('');//开始时间值置为空
                    $(t.$refs.evEndAge).val('');//结束时间值置为空
                }
            }
        },
        updated() {
            let t = this;
            //dom全部渲染完成后进行判断筛选列表高度，判断是否有“更多”展开按钮
            (t.preDiaFlag == 44) ? t.preDiaFlag = ($(t.$refs.pre_Dia).height() ? $(t.$refs.pre_Dia).height() : 44) : '';
            (t.tagFlag == 44) ? t.tagFlag = ($(t.$refs.tag_height).height() ? $(t.$refs.tag_height).height() : 44) : '';
            (t.teamFlag == 44) ? t.teamFlag = ($(t.$refs.team_Height).height() ? $(t.$refs.team_Height).height() : 44) : '';
            (t.creatorLenFlag == 44) ? t.creatorLenFlag = ($(t.$refs.creator_list).height() ? $(t.$refs.creator_list).height() : 44) : '';
            (t.comDoctorLenFlag == 44) ? t.comDoctorLenFlag = ($(t.$refs.competent_Doctor).height() ? $(t.$refs.competent_Doctor).height() : 44) : '';
        },
        mounted() {
            let t = this;
            t.tagList();
            document.addEventListener('click', () => {
                t.timeFree = false;//点击空白或者其他区域关闭自定义时间弹层
            });
        },
        filters: {
            commCutStr(txt) {//字段截取
                return comm.getStrLen(txt, 14);
            },
            commStr(txt) {//完整字段名称,title显示
                return txt;
            }
        }
    };
</script>

<style scoped>

</style>
