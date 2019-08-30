import comm from '~utils/comm.js';
import TempCache from '~utils/tempcache';

const xUrl = {
    getBelongList: '/call/caseFolder/baseinfo/getCaseBelongMapList/',//病历归属接口
    caseList: '/call/caseFolder/baseinfo/getAllCaseList/'//病历列表
};
const mutaions = {
    //病历列表初始化
    caseListInit(state, fla) {
        if (!state.teamSuccess) {
            mutaions.loadingChange(state, true);
        }
        comm.ajax2({
            url: xUrl.caseList,
            type: 'post',
            dataType: 'json',
            data: {
                paramJson: JSON.stringify({
                    customerId: comm.cookie.get('userId') ? comm.cookie.get('userId') : '',
                    searchParam: state.searchKey,//搜索
                    preoperativeDiagnosis: state.sIdList,//初步诊断
                    belongType: state.belongType,//归属类型0-个人，1-团队（pc），不限传空串
                    teamIdList: state.tIdList,//	团队Id拼接
                    tagNameList: state.tNameList,//标签参数，tagId1_tagName1,tagId2_tagName2
                    creatorIdList: state.createIdList,//创建者id列表
                    doctorIdList: state.doctorIdList,//主管医生id列表
                    patientSex: state.sexId,//性别 全部"" 0女 1男
                    patientAgeMin: state.ageMin,//起始年龄
                    patientAgeMax: state.ageMax,//结束年龄
                    /*  排序规则 0-更新时间倒叙，1-更新时间顺序，2-初步诊断升序，3-初步诊断降序，4-手术名称升序，5-手术名称降序，
                       6-标签升序，7-标签降序，8-完成度升序，9-完成度降序，10-年龄升序，11-年龄降序*/
                    sortType: state.orderType,
                    firstResult: (state.pageIndex ? state.pageIndex - 1 : state.pageIndex) * state.pageSize,//当前页第一条数据的index
                    maxResult: state.pageSize,//当前页的总条数
                    isValid: 1,//查询有效
                    customerRole: TempCache.getItem('customerRole')?TempCache.getItem('customerRole'):comm.cookie.get('customerRole')//用户角色
                })
            },
            success: function(res) {
                mutaions.loadingChange(state, false);
                if (comm.hasResponseData(res)) {
                    let items = res.responseObject.responseData.data_list;
                    if (items && items.length > 0) {
                        let _allFlag = true;//全部按钮是否激活
                        for (let i = 0; i < items.length; i++) {
                            let _flag = false;
                            if (state.belongList) {//如果病历列表选中状态存在
                                let _arr = state.belongList.split(',');
                                if (!_arr[_arr.length - 1]) {
                                    _arr.splice(_arr.length - 1, 1);
                                }
                                for (let j = 0; j < _arr.length; j++) {
                                    if (parseInt(_arr[j]) == items[i].caseId) {
                                        _flag = true;
                                    }
                                }
                            }
                            if (_flag) {
                                items[i].edit = true;
                            } else {
                                items[i].edit = false;
                                _allFlag = false;
                            }
                        }
                        if (state.belongList) {//如果病历列表选中状态存在
                            if (_allFlag) {//全选按钮应该激活
                                mutaions.allBtnFlagChange(state, true);
                            }
                        }
                        mutaions.itemsArrChange(state, items);
                        mutaions.noCListFlagChange(state, 0);
                        mutaions.totalChange(state, res.responseObject.responseData.total_count);
                    } else {
                        if (fla) {
                            mutaions.pageIndexChange(state, state.pageIndex - 1);
                            mutaions.caseListInit(state, true);
                        }

                    }
                } else {
                    if (state.sIdList || state.belongType
                        || state.tIdList || state.tNameList || (state.ageMin && state.ageMax)
                        || state.sexId || state.createIdList || state.doctorIdList) {//筛选id存在的时候
                        mutaions.noCListFlagChange(state, 2);
                    } else if (state.searchKey) {//搜过关键字在的时候
                        mutaions.noCListFlagChange(state, 3);
                    } else {//搜索和筛选都不存在，默认首页
                        mutaions.noCListFlagChange(state, 1);
                    }
                    mutaions.totalChange(state, 0);
                }
            }
        });
    },
    //归属操作取消按钮点击之后，设置编辑状态为空
    belongCancel(state) {
        mutaions.belongListChange(state, { caseId: '', flag: false });//取消操作的时候，默认取消所有要归属的病历id
        mutaions.belongBtnChange(state, false);//归属按钮状态变化
        mutaions.teamIdChange(state, '');//选择的团队id清空
        mutaions.sureConBtnChange(state, false);//选择的团队弹层确认按钮
        for (let i = 0; i < state.itemsArr.length; i++) {//选中列表选中状态取消
            let items = state.itemsArr[i];
            items.edit = false;
        }
        mutaions.allBtnFlagChange(state, false);
        //选择中的团队列表，选中置为空
        for (let i = 0; i < state.teamNameList.length; i++) {
            let items = state.teamNameList[i];
            items.active = false;
        }
    },
    //删除操作取消
    deCancel(state) {
        mutaions.deleteIdChange(state, '');//要删除的id清空
        mutaions.deleteBtnChange(state, false);//删除的弹层取消
        for (let i = 0; i < state.itemsArr.length; i++) {//选中列表选中状态取消
            let items = state.itemsArr[i];
            items.edit = false;
        }
        //不能删除,只有创建者才能删除
        mutaions.forbidDeleteChange(state, false);
        //病例锁定
        mutaions.caseEditChange(state, false);
        //病例删除通过
        mutaions.passDeleteChange(state, false);
    },
    //不显示后，保持删除编辑状态，取消选中
    deleteStatus(state) {
        mutaions.deleteIdChange(state, '');//要删除的id清空
        for (let i = 0; i < state.itemsArr.length; i++) {//选中列表选中状态取消
            let items = state.itemsArr[i];
            items.edit = false;
        }
        setTimeout(function() {
            //不能删除,只有创建者才能删除
            mutaions.forbidDeleteChange(state, false);
            //病例锁定
            mutaions.caseEditChange(state, false);
            //病例删除通过
            mutaions.passDeleteChange(state, false);
        }, 2000);
    },
    //筛选条件的总列表(初步诊断、标签、时间、归属)
    tagArrChange(state, data) {
        state.tagArr = data;
    },
    //处理后的病历列表
    itemsArrChange(state, data) {
        state.itemsArr = data;
    },
    //排序类型的变换
    orderTypeChange(state, data) {
        state.orderType = data;
    },
    //筛选选中的数组（要展示的筛选条件）
    scrShowArrChange(state, data) {
        if (data.flag) {//增加选中的数组
            state.scrShowArr.push(data.val);
        } else {//删除选中的数组
            if (data.val) {
                let _index;
                for (let i = 0; i < state.scrShowArr.length; i++) {
                    let index = state.scrShowArr[i];
                    if (parseInt(index.id) === parseInt(data.val.id)) {
                        _index = i;
                    }
                }
                state.scrShowArr.splice(_index, 1);
            } else {
                state.scrShowArr = [];
            }

        }
    },
    //初步诊断的汉字拼接（发送请求的参数）
    sIdListChange(state, data) {
        if (data.flag) {//增加筛选
            state.sIdList = state.sIdList + data.val + ',';
        } else {//删除筛选
            if (data.val) {
                let arr = state.sIdList.split(',');
                if (!arr[arr.length - 1]) {
                    arr.splice(arr.length - 1, 1);
                }
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf(data.val) > -1) {
                        arr.splice(i, 1);
                    }
                }
                if (arr.length > 0) {
                    state.sIdList = arr.join(',') + ',';
                } else {
                    state.sIdList = '';
                }
            } else {
                state.sIdList = '';
            }
        }
    },
    //创建者的id拼接（发送请求的参数）
    createIdListChange(state, data) {
        if (data.flag) {//增加筛选
            state.createIdList = state.createIdList + data.val + ',';
        } else {//删除筛选
            if (data.val) {
                let arr = state.createIdList.split(',');
                if (!arr[arr.length - 1]) {
                    arr.splice(arr.length - 1, 1);
                }
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf(data.val) > -1) {
                        arr.splice(i, 1);
                    }
                }
                if (arr.length > 0) {
                    state.createIdList = arr.join(',') + ',';
                } else {
                    state.createIdList = '';
                }
            } else {
                state.createIdList = '';
            }
        }
    },
    //主管医生的id拼接（发送请求的参数）
    doctorIdListChange(state, data) {
        if (data.flag) {//增加筛选
            state.doctorIdList = state.doctorIdList + data.val + ',';
        } else {//删除筛选
            if (data.val) {
                let arr = state.doctorIdList.split(',');
                if (!arr[arr.length - 1]) {
                    arr.splice(arr.length - 1, 1);
                }
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf(data.val) > -1) {
                        arr.splice(i, 1);
                    }
                }
                if (arr.length > 0) {
                    state.doctorIdList = arr.join(',') + ',';
                } else {
                    state.doctorIdList = '';
                }
            } else {
                state.doctorIdList = '';
            }
        }
    },
    //标签筛选列表改变（发送请求的参数）
    tNameListChange(state, data) {
        if (data.flag) {//增加筛选
            state.tNameList = state.tNameList + data.val + ',';
        } else {//删除筛选
            if (data.val) {
                let arr = state.tNameList.split(',');
                if (!arr[arr.length - 1]) {
                    arr.splice(arr.length - 1, 1);
                }
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf(data.val) > -1) {
                        arr.splice(i, 1);
                    }
                }
                if (arr.length > 0) {
                    state.tNameList = arr.join(',') + ',';
                } else {
                    state.tNameList = '';
                }
            } else {
                state.tNameList = '';
            }
        }
    },
    //归属筛选列表改变（发送请求的参数）
    tIdListChange(state, data) {
        if (data.flag) {//增加筛选
            state.tIdList = state.tIdList + data.val + ',';
        } else {//删除筛选
            if (data.val) {
                let arr = state.tIdList.split(',');
                if (!arr[arr.length - 1]) {
                    arr.splice(arr.length - 1, 1);
                }
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] == data.val) {
                        arr.splice(i, 1);
                    }
                }
                if (arr.length > 0) {
                    state.tIdList = arr.join(',') + ',';
                } else {
                    state.tIdList = '';
                }
            } else {
                state.tIdList = '';
            }

        }
    },
    //筛选选中条件的开关（展示筛选条件）
    scrShowFlagChange(state, data) {
        state.scrShowFlag = data;
    },
    //归属选中的筛选病历列表（发送请求的参数）
    belongListChange(state, data) {
        if (data.flag) {//选中的归属列表
            state.selectDoctorId=state.selectDoctorId+data.doctorId+',';//记录选中的主管医生
            state.belongList = state.belongList + data.caseId + ',';//记录病例id
        } else {//取消选中的归属
            if (data.caseId) {//正常的删减选中
                let arr = state.belongList.split(',');
                if (!arr[arr.length - 1]) {
                    arr.splice(arr.length - 1, 1);
                }
                let arr1 = state.selectDoctorId.split(',');
                if (!arr1[arr1.length - 1]) {
                    arr1.splice(arr1.length - 1, 1);
                }
                for (let i = 0; i < arr.length; i++) {
                    if (parseInt(arr[i]) === parseInt(data.caseId)) {
                        arr.splice(i, 1);
                        arr1.splice(i, 1);
                    }
                }
                if (arr.length > 0) {
                    state.belongList = arr.join(',') + ',';
                    state.selectDoctorId = arr1.join(',') + ',';
                } else {
                    state.belongList = '';
                    state.selectDoctorId = '';
                }
            } else {//取消按钮或者全部取消的情况
                state.belongList = '';
                state.selectDoctorId = '';
            }
        }
        console.log(state.selectDoctorId);
    },
    //归属按钮编辑状态显示隐藏
    belongBtnChange(state, data) {
        state.belongBtn = data;
    },
    //请选择一行病历的提示文字显示
    chooseTipsChange(state, data) {
        state.chooseTips = data;
    },
    //全选按钮选中标志
    allBtnFlagChange(state, data) {
        state.allBtnFlag = data;
    },
    //确定归属操作ajax请求
    belongAjax(state) {
        mutaions.loadingChange(state, true);
        comm.ajax2({
            url: xUrl.getBelongList,
            type: 'get',
            dataType: 'json',
            data: {
                paramJson: JSON.stringify({
                    'caseIdList': state.belongList,//'1532756363101,1531999302226,',
                    'teamId': state.teamId,
                    'customerId': comm.cookie.get('userId') ? comm.cookie.get('userId') : '',
                    'customerRole': TempCache.getItem('customerRole')?TempCache.getItem('customerRole'):comm.cookie.get('customerRole')//用户角色
                })
            },
            success: function(res) {
                mutaions.loadingChange(state, false);
                if (res.responseObject.responseStatus) {//可以归属的情况，团队转移成功
                    mutaions.sTeamFlagChange(state, false);//关闭选择团队筛选层
                    //团队转移归属成功
                    if (parseInt(res.responseObject.responseCode) === 1103) {
                        mutaions.alBelongFailChange(state, false);//关闭提示病历不能归属弹层
                        mutaions.teamSucInfoChange(state, res.responseObject.responseData.data_list);//给成功的信息传值
                        mutaions.teamSuccessChange(state, true);//显示成功层3秒消失
                        mutaions.caseListInit(state, true);//列表 重新获取
                        setTimeout(function() {
                            mutaions.teamSuccessChange(state, false);
                        }, 3000);
                        mutaions.belongCancel(state);//执行取消操作

                    }
                    //无法归属，包含其他团队病历，返回无法归属病历数、无法归属的病历集合
                    if (parseInt(res.responseObject.responseCode) === 1101) {
                        //先置空失败的列表信息
                        mutaions.infoListChange(state, '');
                        let item1 = res.responseObject.responseData.data_list;
                        mutaions.infoListChange(state, item1);
                        let _bList = state.belongList.split(',');
                        if (!_bList[_bList.length - 1]) {
                            _bList.splice(_bList.length - 1, 1);
                        }
                        /*不能归属的病历和选择的归属病历进行比较，
                                如果选择的病历都不能归属，归属按钮置灰*/
                        let _bBtnFlag = false;
                        if (_bList.length > item1[0].caseList.length) {
                            _bBtnFlag = true;
                        }
                        if (_bBtnFlag) {//继续归属按钮可以继续点击
                            mutaions.alBelongFailChange(state, true);//显示提示病历不能归属弹层
                            mutaions.bConBtnChange(state, true);
                        } else {
                            mutaions.bConBtnChange(state, false);
                            mutaions.editingChange(state, true);//显示提示层
                            mutaions.editingTxtChange(state, '您选择的病例无法归属到该团队');//显示提示层
                            mutaions.isTwoChange(state, true);//提示弹层
                            mutaions.isTwoTextChange(state, '您暂时没有权限改变此病历的归属');//提示弹层话术
                        }
                    }
                    //无法归属，当前用户 不是 所选择要归属的团队的所有者【这种情况理论上不存在】
                    if (parseInt(res.responseObject.responseCode) === 1102) {
                        mutaions.teamFailPersonChange(state, true);//显示成功层5秒消失
                        setTimeout(function() {
                            mutaions.teamFailPersonChange(state, false);
                        }, 5000);
                    }
                    //无法归属，所选病历正在被编辑
                    if (parseInt(res.responseObject.responseCode) === 1301 || parseInt(res.responseObject.responseCode) === 1303) {
                        let item1 = res.responseObject.responseData.data_list;
                        let _str = '';
                        for (let i = 0; i < item1[0].caseList.length; i++) {
                            let item2 = item1[0].caseList[i];
                            if (i == item1[0].caseList.length - 1) {
                                _str += item2.patientName;
                            } else {
                                _str += item2.patientName + '、';
                            }
                        }
                        mutaions.editingChange(state, true);//显示提示层
                        mutaions.editingTxtChange(state, _str + '的病历正在被其他成员编辑，暂无法变更归属');//显示提示层
                        mutaions.isTwoChange(state, false);//提示弹层
                        mutaions.isTwoTextChange(state, '');//提示弹层话术置空
                    }
                }
            }
        });
    },
    //获取到的团队名称列表
    teamNameListChange(state, data) {
        state.teamNameList = data;
    },
    //选中的团队id
    teamIdChange(state, data) {
        state.teamId = data;
    },
    //选择团队列表的弹层显示开关
    sTeamFlagChange(state, data) {
        state.sTeamFlag = data;
    },
    //团队转移成功提示显示开关
    teamSuccessChange(state, data) {
        state.teamSuccess = data;
    },
    //团队转移成功提示信息返回值
    teamSucInfoChange(state, data) {
        state.teamSucInfo = data;
    },
    //团队转移失败标志
    alBelongFailChange(state, data) {
        state.alBelongFail = data;
    },
    //团队归属失败病历弹层列表信息
    infoListChange(state, data) {
        state.infoList = data;
    },
    //自定义时间的选中标志
    isActiveChange(state, data) {
        state.isActive = data;
    },
    //列表无数据组件显示控制
    noCListFlagChange(state, data) {
        state.noCListFlag = data;
    },
    //筛选列表条件是否展示标志
    scrItemsFlagChange(state, data) {
        state.scrItemsFlag = data;
    },
    //筛选归属点击的个人类型改变
    belongTypeChange(state, data) {
        state.belongType = data;
    },
    //分页
    pageIndexChange(state, data) {
        state.pageIndex = data;
    },
    //分页条数
    pageSizeChange(state, data) {
        state.pageSize = data;
    },
    //总条数
    totalChange(state, data) {
        state.total = data;
    },
    //总条数
    loadingChange(state, data) {
        state.loading = data;
    },
    //搜索关键词
    searchKeyChange(state, data) {
        state.searchKey = data;
    },
    //当前归属者不是团队所有者
    teamFailPersonChange(state, data) {
        state.teamFailPerson = data;
    },
    //继续归属按钮是否可以继续归属
    bConBtnChange(state, data) {
        state.bConBtn = data;
    },
    //筛选条件的
    scrLoadingChange(state, data) {
        state.scrLoading = data;
    },
    //归属的病历正在被编辑
    editingChange(state, data) {
        state.editing = data;
    },
    //归属的病历正在被编辑的弹层提示内容
    editingTxtChange(state, data) {
        state.editingTxt = data;
    },
    //归属按钮的显示和隐藏
    noShowBelongChange(state, data) {
        state.noShowBelong = data;
    },
    //选择团队确认按钮状态
    sureConBtnChange(state, data) {
        state.sureConBtn = data;
    },
    //不能归属提示
    isTwoChange(state, data) {
        state.isTwo = data;
    },
    //不能归属提示话术
    isTwoTextChange(state, data) {
        state.isTwoText = data;
    },
    //性别id
    sexIdChange(state, data) {
        state.sexId = data;
    },
    //删除按钮状态
    deleteBtnChange(state, data) {
        state.deleteBtn = data;
    },
    //删除is记录
    deleteIdChange(state, data) {
        state.deleteId = data;
    },
    //不能删除,只有创建者才能删除
    forbidDeleteChange(state, data) {
        state.forbidDelete = data;
    },
    //病例锁定
    caseEditChange(state, data) {
        state.caseEdit = data;
    },
    //病例删除通过
    passDeleteChange(state, data) {
        state.passDelete = data;
    },
    //开始年龄
    ageMinChange(state, data) {
        state.ageMin = data;
    },
    //结束年龄
    ageMaxChange(state, data) {
        state.ageMax = data;
    },
    //禁止编辑年龄
    notAgeFlagChange(state, data) {
        state.notAgeFlag = data;
    },
};
export default mutaions;
