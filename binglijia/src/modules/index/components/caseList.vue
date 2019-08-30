<template>
    <!--病历列表开始-->
    <section class="alEmr-caseList" v-if="noCListFlag==0" :class="{screening:!scrShowFlag,noPage:total<=10}">
        <aside class="attrBtnBox">
            <aside>
                <p class="attrBtn" @click="belongClick" v-if="!belongBtn&&!deleteBtn&&noShowBelong">归属</p>
                <p class="attrBtn attrSureBtn" :class="{margin0:!noShowBelong}"
                   @click="deleteFn" v-if="!belongBtn&&!deleteBtn">删除</p><!--20181214去掉原有的取消，确定更改为删除-->
            </aside>

        </aside>
        <section class="caseItems" :class="{editStatus:belongBtn,deleteStatus:deleteBtn}">
            <!--病历列表标题开始-->
            <aside>
                <b class="allBtn" :class="{active:allBtnFlag}" @click="allBtnClick"></b>
                <p class="orderOne"><span>姓名</span></p>
                <p class="orderTwo"><span>性别</span></p>
                <p class="commOrder orderThree" :class="{orderOn:orderType==10,orderUn:orderType==11}"
                   @click="orderClick(1)"><span>年龄</span></p>
                <p class="commOrder orderFour" :class="{orderOn:orderType==2,orderUn:orderType==3}"
                   @click="orderClick(2)"><span>诊断</span></p>
                <p class="orderFive"><span>图像资料</span></p>
                <p class="commOrder orderSix" :class="{orderOn:orderType==6,orderUn:orderType==7}"
                   @click="orderClick(4)"><span>标签</span></p>
                <p class="orderNine"><span>创建者</span></p>
                <p class="orderTen"><span>主管医生</span></p>
                <p class="commOrder orderSeven" :class="{orderOn:orderType==1,orderUn:orderType==0}"
                   @click="orderClick(5)"><span>创建时间</span></p>
                <p class="commOrder orderEight" :class="{orderOn:orderType==8,orderUn:orderType==9}"
                   @click="orderClick(6)"><span>完整度</span></p>
            </aside>
            <!--病历列表标题结束-->
            <!--病历列表内容开始-->
            <ul>
                <li v-for="(val,i) in itemsArr">
                    <a :onclick="belongBtn?'return false':''"
                       :href="(belongBtn||deleteBtn)?'javascript:;':'../caseDetails/index.html?caseId='+val.caseId+'&templateId='+(val.templateId?val.templateId:0)"
                       target="_blank">
                        <b :class="{active:val.edit}" @click="multiBtn(i)"></b><!--编辑选中标志 {active:}-->
                        <span class="listOne" :title="val.patientName"><span>{{val.patientName}}</span><i
                            v-if="val.patientName" :class="{personal:val.belongType==0}"></i></span>
                        <span class="listTwo">{{val.patientSex}}</span>
                        <span class="listThree">{{val.patientAge|commAge}}</span>
                        <span class="listFour" :title="val.preoperativeDiagnosis|commStr">{{val.preoperativeDiagnosis|commCutStr10}}</span>
                        <span class="listFive" :title="val.attNum">{{val.attNum&&val.attNum!=0?val.attNum:''}}</span>
                        <span class="listSix"
                              :title="val.tagNameList|commStrTag">{{val.tagNameList|commCutStrTag}}</span>
                        <span class="listNine">{{commCutStrText(val.creatorName,12)}}</span><!--创建者-->
                        <span class="listTen">{{commCutStrText(val.doctorName,12)}}</span><!--主管医生-->
                        <span class="listSeven">{{val.createTime|commDateText}}</span>
                        <span class="listEight">{{val.completePercent}}</span>
                    </a>
                </li>
            </ul>
            <!--病历列表内容结束-->
        </section>
    </section>
    <!--病历列表结束-->
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import comm from '~utils/comm.js';
    import commdate from '~utils/commdate.js';

    const xUrl = {
        getMapListByCustomerId: '/call/caseFolder/team_baseinfo/getMapListByCustomerId/'
    };
    export default {
        name: 'caseList',
        data() {
            return {};
        },
        computed: {
            ...mapGetters(['itemsArr', 'scrShowFlag', 'belongList', 'belongBtn', 'chooseTips', 'allBtnFlag', 'noCListFlag',
                'orderType', 'total', 'teamNameList', 'loading', 'noShowBelong', 'deleteBtn'])
        },
        methods: {
            ...mapActions(['orderTypeChange', 'belongListChange', 'belongBtnChange', 'chooseTipsChange', 'allBtnFlagChange',
                'teamNameListChange', 'noShowBelongChange', 'deleteBtnChange', 'deleteIdChange']),
            //截取人名长度
            commCutStrText(str, len) {
                return comm.getStrLen(str, len);
            },
            //删除病例按钮
            deleteFn() {
                let t = this;
                if (t.loading) {
                    return;
                }
                t.deleteBtnChange(true);
            },
            //排序点击事件
            orderClick(index) {
                let t = this;
                if (t.loading) {
                    return;
                }
                /*  排序规则 0-更新时间倒叙，1-更新时间顺序，2-初步诊断升序，3-初步诊断降序，4-手术名称升序，5-手术名称降序，
                     6-标签升序，7-标签降序，8-完成度升序，9-完成度降序，10-年龄升序，11-年龄降序*/
                switch (parseInt(index)) {
                    case 1://年龄
                        if (t.orderType == 11) {
                            t.orderTypeChange('10');//由小到大
                        } else {
                            t.orderTypeChange('11');//年龄由大到小
                        }
                        break;
                    case 2://初步诊断
                        if (t.orderType == 2) {
                            t.orderTypeChange('3');
                        } else {
                            t.orderTypeChange('2');
                        }
                        break;
                    case 3://手术名称
                        if (t.orderType == 4) {
                            t.orderTypeChange('5');
                        } else {
                            t.orderTypeChange('4');
                        }
                        break;
                    case 4://标签
                        if (t.orderType == 6) {
                            t.orderTypeChange('7');
                        } else {
                            t.orderTypeChange('6');
                        }
                        break;
                    case 5://更新时间
                        if (t.orderType == 0) {
                            t.orderTypeChange('1');
                        } else {
                            t.orderTypeChange('0');
                        }
                        break;
                    case 6://完整度
                        if (t.orderType == 9) {
                            t.orderTypeChange('8');
                        } else {
                            t.orderTypeChange('9');
                        }
                        break;
                }
            },
            //归属按钮的点击
            belongClick() {
                let t = this;
                if (t.loading) {
                    return;
                }
                t.belongBtnChange(true);
            },
            //归属多选按钮点击操作
            multiBtn(index) {
                let t = this;
                if (t.loading) {
                    return;
                }
                if (!t.deleteBtn) {//归属多选
                    let _flag = false;//判断是否置灰全选按钮
                    for (let i = 0; i < t.itemsArr.length; i++) {
                        let _kv = t.itemsArr[i];
                        if (parseInt(i) === parseInt(index)) {
                            if (_kv.edit) {
                                _kv.edit = false;
                                t.belongListChange({ caseId: _kv.caseId, doctorId:_kv.doctorId,flag: false });
                            } else {
                                _kv.edit = true;
                                t.belongListChange({ caseId: _kv.caseId, doctorId:_kv.doctorId,flag: true });
                            }
                        }
                        if (_kv.edit == false) {
                            _flag = true;
                        }
                    }
                    if (_flag) {//松开全选按钮
                        t.allBtnFlagChange(false);
                    } else {//激活选中全选按钮
                        t.allBtnFlagChange(true);
                    }
                } else {//删除单选选择
                    for (let i = 0; i < t.itemsArr.length; i++) {
                        let _kv = t.itemsArr[i];
                        _kv.edit = false;
                        if (parseInt(i) === parseInt(index)) {
                            _kv.edit = true;
                            t.deleteIdChange(_kv.caseId);//记录删除病例
                        }
                    }
                }
            },
            //全选按钮点击事件
            allBtnClick() {
                let t = this;
                if (!t.deleteBtn) {
                    if (t.loading) {
                        return;
                    }
                    t.allBtnFlagChange(!t.allBtnFlag);
                    if (t.allBtnFlag) {//再循环按顺序选中
                        for (let i = 0; i < t.itemsArr.length; i++) {
                            let _kv = t.itemsArr[i];
                            if (_kv.edit) {
                                _kv.edit = false;
                            }
                            _kv.edit = true;
                            t.belongListChange({ caseId: _kv.caseId, doctorId:_kv.doctorId,flag: true });
                        }
                    } else {//全部取消操作
                        for (let i = 0; i < t.itemsArr.length; i++) {
                            let _kv = t.itemsArr[i];
                            _kv.edit = false;
                        }
                        t.belongListChange({ caseId: '', doctorId:"",flag: false });//默认先清空选中列表
                    }
                }
            }
        },
        mounted() {
            let t = this;
            comm.ajax2({
                url: xUrl.getMapListByCustomerId,
                type: 'get',
                data: {
                    paramJson: JSON.stringify({
                        customerId: comm.cookie.get('userId') ? comm.cookie.get('userId') : '',
                        visitSiteId: 1,
                        teamSelectType: 1,//	1-所有团队 2-为所有者的团队
                        isValid: 1
                    })
                },
                success(res) {
                    if (comm.hasResponseData(res) && res.responseObject.responseData.data_list
                        && res.responseObject.responseData.data_list.length > 0) {//有团队的话
                        let items = res.responseObject.responseData.data_list;
                        if (items.length) {
                            t.noShowBelongChange(true);
                        }else{
                            t.noShowBelongChange(false);
                        }
                    } else {//没有团队，不显示归属
                        t.noShowBelongChange(false);
                    }
                }
            });
        },
        filters: {
            commAge(txt) {//年龄
                if (txt) {
                    return txt.split(',')[0] ? txt.split(',')[0] : 0;
                } else {
                    return 0;
                }
            },
            commCutStr(txt) {//字段截取
                if (txt) {
                    let str = txt.split('|');
                    if (!str[str.length - 1]) {
                        str.splice(str.length - 1, 1);
                    }
                    let _kv = str.join('、');
                    return comm.getStrLen(_kv, 14);
                }
            },
            commCutStr10(txt) {//字段截取
                if (txt) {
                    let str = txt.split('|');
                    if (!str[str.length - 1]) {
                        str.splice(str.length - 1, 1);
                    }
                    let _kv = str.join('、');
                    return comm.getStrLen(_kv, 20);
                } else {
                    return '未填写';
                }
            },
            commStr(txt) {//完整字段名称,title显示
                if (txt) {
                    let str = txt.split('|');
                    if (!str[str.length - 1]) {
                        str.splice(str.length - 1, 1);
                    }
                    return str.join('、');
                }
            },
            commCutStrTag(txt) {//标签
                let str = '';
                let _arr = comm.cutLine(txt, '|', '_', '、').split('、');
                if (!_arr[_arr.length - 1]) {
                    _arr.splice(_arr.length - 1, 1);
                }
                for (let i = 0; i < _arr.length; i++) {
                    if (i == _arr.length - 1) {
                        str += '#' + _arr[i] + '#';
                    } else {
                        str += '#' + _arr[i] + '#' + '、';
                    }
                }
                return comm.getStrLen(str, 14);
            },
            commStrTag(txt) {//全部
                let str = '';
                let _arr = comm.cutLine(txt, '|', '_', '、').split('、');
                if (!_arr[_arr.length - 1]) {
                    _arr.splice(_arr.length - 1, 1);
                }
                for (let i = 0; i < _arr.length; i++) {
                    if (i == _arr.length - 1) {
                        str += '#' + _arr[i] + '#';
                    } else {
                        str += '#' + _arr[i] + '#' + '、';
                    }
                }
                return str;
            },
            commDateText(date) {//日期转换
                return commdate.diffDay_three(date, commdate.local_time());
            }
        }

    };
</script>

<style>

</style>
