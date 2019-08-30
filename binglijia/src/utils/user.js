/**
* 功能描述： 权限判断 (病历夹是登录认证权限)
*
* 功能简介：由于入口在唯医页面所以唯医总入口会做登录认证权限，
*       所以在病历夹项目中只做权限判断，
*       然后跳转到唯医首页然后自动触发唯医的权限判断。
*
* 方法使用：
*
*
* Created by lichunhui on 2018/7/10.
* */
import comm from "./comm.js";
import TempCache from "./tempcache.js";
const $ = require('jquery');
const privilegeRoleConst = {
    Visitor: 0,
    /* 系统 */
    System: 1,
    /*组织*/
    Organization: 2,
    /*厂商*/
    Manufacture: 3,
    /*患者*/
    Patient: 4,
    /*医师*/
    Doctor: 5,
    /*认证医师*/
    AuthedDoctor: 6,
    /*住陪学员*/
    LiveStudents:7,
    /*执业医师*/
    practitioner:11,
    //护士
    Nurse:12,
    /*医助*/
    assistantDoctor:13,
    /*新厂商未认证*/
    newManufacture:14,
    /*新厂商已认证*/
    newManufactureState:15,
};

/**
 * 执行权限判断的各种场景常量
 * */
const privilegeSceneConst = {
    /**
     *   发布(资源)
     */
    eSceneTypePublic: 0,
    /**
     *  评论
     */
    eSceneTypeReview: 1,
    /**
     *  转发
     */
    eSceneTypeTransmit: 2,
    /**
     *  收藏
     */
    eSceneTypeCollect: 3,
    /**
     *  分享（资源) 转发
     */
    eSceneTypeShareResourse: 4,
    /**
     *  分享（医师）
     */
    eSceneTypeSharePerson: 9,
    /**
     *  赞（资源+评论）
     */
    eSceneTypePraiseResourse: 5,
    /**
     *  赞（医师）
     */
    eSceneTypePraisePerson: 7,
    /**
     *  关注
     */
    eSceneTypeAttention: 10,
    /**
     *  下载
     */
    eSceneTypeDownload: 11,
    /**
     *  查看上下文
     */
    eSceneTypeQueryUpDown: 12,
    /**
     *  绑定CAOS
     */
    eSceneTypeBindCAOS: 13,
    /**
     *  视频播放>3分钟.
     */
    eSceneTypeVideoPlay: 14,
    /**
     *  订阅
     */
    eSceneTypeSubscribe: 15,
    /**
     *  病历终端页
     */
    eSceneTypeCaseDetail: 16,
    /**
     *  话题终端页
     */
    eSceneTypeTopicDetail: 17,
    /**
     *  文库终端页
     */
    eSceneTypeDocDetail: 18,
    /**
     *  医师定考
     */
    eSceneTypeDingKao: 19,
    /**
     *  自己的个人主页
     */
    eSceneTypeMyHome: 20,
    /**
     *  他人的个人主页
     */
    eSceneTypeOtherHome: 21,
    /**
     *  消息
     */
    eSceneTypeMessage: 22,
    /**
     *  设置
     */
    eSceneTypeSetting: 23,
    /**
     *  视频终端页
     */
    eSceneTypeVideoTerminal: 24,
    /**
     *  添加联系人
     */
    eSceneTypeAddContact: 25,
    /**
     *  屏蔽动态
     */
    eSceneTypeShieldTrend: 26,
    /**
     *  关注列表
     */
    eSceneTypeAttentionList: 27,
    /**
     *  粉丝列表
     */
    eSceneTypeFansList: 28,
    /**
     *  订阅列表
     */
    eSceneTypeSubscribeList: 29,
    /**
     *  点赞列表
     */
    eSceneTypePraiseList: 30,
    /**
     *  视频直播
     **/
    eSceneTypeLiveShow: 31,
    /**
     *  发布资源-视频PK(PC)
     **/
    eSceneTypeVideoPK: 32,
    /**
     *  认证-fellow频道页(PC)
     **/
    eSceneTypeFellow: 34,
    /**
     *  厂商无此权限(PC) 同发布权限
     **/
    eSceneTypeManufacture: 0,
    /**
     *  厂商有此权限(PC) 同赞列表权限
     **/
    eSceneTypeNeedManufacture: 30,
    /**
     *  登录厂商用户有此权限(PC)
     **/
    eSceneTypeNeedManufactureLogin: "manufactureLogin",
    /**
     * 只是认证
     * */
    eSceneTypeAuth: "auth",
    /**
     * 只是登录
     * */
    eSceneTypeLogin: "login",
    /**
     * 重新认证
     * */
    eSceneTypeReAuth: "reAuth"

};
const user={
    /*状态*/
    isLoginStatus: false,       // 是否已登录
    isRenZhengStatus: false,
    /*对象*/
    customerAuth: null,         // 认证对象
    customerRole: 0,            // 用户角色 默认为零
    path:{
        "out": "/call/customer/unite/logout/",//退出登录
        "checkUserStatus":  "/call/customer/unite/checkSession/",	// 获取用户session
        "getPrivData":  "/call/customer/role/priv/json_list/",   // 获取权限信息
        "getCustomerUnite":  "/call/customer/unite/getCustomerUnite/",     //获取当前登录用户信息
        "getCustomerAuthInfo": "/call/customer/auth/getAuthBycustomerId/",//获取认证信息
    },
    /**
     * 权限数据处理工具
     */
    privDataUtils : {
        /**
         * 获取权限列表
         * */
        getPrivData: function () {
            let t = this;
            const promise = new Promise(function(resolve, reject){
                if(TempCache.getItem("privData")){
                    t.privData = JSON.parse(TempCache.getItem("privData"));
                    resolve(t.privData);
                }else{
                    if (!t.privData) {
                        comm.ajax2({
                            url: user.path.getPrivData,
                            success: function (data) {
                                resolve();
                                if (data && data.responseObject && data.responseObject.responseData) {
                                    t.privData = data.responseObject.responseData;
                                    TempCache.setItem("privData",JSON.stringify(t.privData));
                                    resolve(t.privData);
                                } else {
                                    throw "no priv data";
                                }
                            }
                        });
                    }
                }
            })

            return promise;
        },

        /**
         * 获取可执行某方法的用户角色
         */
        getAvailableCustomerRole: function (scene) {
            let t = this;
            const promise = new Promise(function(resolve, reject) {
                t.getPrivData().then(() => {
                    if (!t.privData) {    // 无权限数据
                        resolve();
                        throw "no priv data";
                    } else {
                        let availableCustomerRoleArr = [];
                        t.getPrivData().then((data) => {
                            let role, privList;
                            for (role in data.customeRole) {
                                privList = data.customeRole[role];
                                if (privList.roleOps.charAt(privList.roleOps.indexOf(scene + "-") + scene.toString().length + 1) == "1") {
                                    availableCustomerRoleArr.push(parseInt(role));
                                }
                            }
                            if (availableCustomerRoleArr.length == 0) {
                                throw "no available role";
                            }
                            resolve(availableCustomerRoleArr);
                        });
                    }
                });
            })
            return promise;
        },

        /**
         * 对场景进行描述，拆分成细节
         * @param scene {Number}场景
         * @returns {{}} 权限细节
         */
        getPrivilegeDetailsOfThisScene: function (scene) {
            let t=this;
            const promise = new Promise(function(resolve, reject) {
                let privDetails = {
                    /*需要登录*/
                    NeedLogin: false,
                    /*需要认证*/
                    NeedAuth: false,
                    NeedSystem: false,
                    /*需要厂商角色*/
                    NeedManufacture: false,
                    /*无法操作*/
                    CannotOperate: false,
                    LoginIsEnough: false
                };

                t.getAvailableCustomerRole(scene).then((value)=>{
                    let availableRoleArr = value;
                    /*是否需要登录*/
                    privDetails.NeedLogin = availableRoleArr.indexOf(privilegeRoleConst.Visitor) <= -1;

                    /*是否需要认证*/
                    privDetails.NeedAuth = availableRoleArr.indexOf(privilegeRoleConst.Doctor) <= -1 && availableRoleArr.indexOf(privilegeRoleConst.AuthedDoctor) > -1;  // 无普通用户，且有认证用户

                    /* 仅需普通用户权限即可 */
                    privDetails.LoginIsEnough = availableRoleArr.indexOf(privilegeRoleConst.Doctor) > -1;  // 有普通用户

                    /*是否需要厂商角色*/
                    privDetails.NeedManufacture = availableRoleArr.indexOf(privilegeRoleConst.Manufacture) > -1;

                    /*是否需要系统角色*/
                    privDetails.NeedSystem = availableRoleArr.indexOf(privilegeRoleConst.System) > -1;

                    resolve(privDetails);
                });
            })
            return promise;
        }
    },
    login(params) {
        let t = this;
        t.getLoginStatus().then(function(){
            t.analyzePrivDetails(params).then((value)=>{
                t.privDetails = value;
                if (params) {
                    t.options = params;
                    if ((params.scene !== "" || params.operateType != "") && params.callback !== null) {
                        t.checkPriv();
                    }
                }
            });

        });
    },

    //==================================权限控制相关============================================
    /**获取登录状态*/
    getLoginStatus() {
        let t = this;
        const promise = new Promise(function(resolve, reject){
            comm.ajax2({
                url: t.path.checkUserStatus,
                dataType: "json",
                type: "post",
                success: function (result) {
                    resolve();
                    if (result.responseObject.responseStatus) {//已登录
                        t.isLoginStatus = true;
                    } else {
                        t.isLoginStatus = false;
                        comm.cookie.delete("userId");
                        TempCache.removeItem("authInfo");
                    }
                }
            });
        })
        return promise;
    },
    /**
     * 开始比较权限
     * */
    checkPriv() {
        let t = this;
        if (!t.privDetails.NeedLogin) { // 未登录用户可以执行
            t.privCheckSuccess();
        } else {  // 需要登录
            t.checkLoginStatus();       //判断登录状态
        }
    },
    /**
     * 获取当前登录用户信息
     * @returns {{}}   用户信息
     * 新版里 包含customerRole
     */
    getCustomerUnite() {
        let t=this;
        let unite = {};
        const promise = new Promise(function(resolve, reject){
            comm.ajax2({
                type: 'POST',
                url: t.path.getCustomerUnite,
                dataType: 'json',
                success: function (rep) {
                    if (rep && rep.responseObject) {
                        t.userInfo= unite = rep.responseObject;
                        if (unite != null && unite != undefined) {
                            TempCache.setItem("customerRole",unite.customerRole);
                            TempCache.setItem("userId",unite.customerId); //已使用cookie的方式添加了
                            if(unite.mobile){
                                TempCache.setItem("mobile",unite.mobile);
                            }
                            if(unite.email){
                                TempCache.setItem("email",unite.email);
                            }
                        }
                    }
                    resolve();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        })
        return promise;
    },
    /**
     *  权限较验成功后处理
     *  */
    privCheckSuccess() {
        let t = this;
        t.privCheckState = true;
        t.getCustomerUnite().then(()=>{
            if(t.userInfo.isValid==0){//TODO addBy lichunhui 2017.08.29无效的用户
                comm.ajax2({
                    type: 'POST',
                    url: t.path.out,
                    dataType: 'json',
                    success: function (rep) {
                        if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                            window.location.href="//www.allinmd.cn";
                            TempCache.clear();
                        }
                    }
                });
            }

            if (typeof t.options != "undefined" && typeof t.options.callback != "undefined") {//校验成功回调函数
                t.options.callback();
            }
        })
    },
    /**
     * 检测登录状态
     * */
    checkLoginStatus() {
        let t = this;
        if(t.isLoginStatus){//已登录
            t.loginSuccess();
        }else{              //未登录
            t.goBackIndex(); //回到唯医首页
        }
    },

    /**
     *  分析权限信息
     */
    analyzePrivDetails (options) {
        let t = this;
        const promise = new Promise(function(resolve, reject){
            /* 直接认证功能 */
            if (options.scene == privilegeSceneConst.eSceneTypeLogin) {
                t.privDetails = {
                    /*需要登录*/
                    NeedLogin: true,
                    /*需要认证*/
                    NeedAuth: false,
                    LoginIsEnough:true,
                    /*需要厂商角色*/
                    NeedManufacture: false,
                    /*无法操作*/
                    CannotOperate: false
                };
                resolve(t.privDetails);
            } else if (options.scene == privilegeSceneConst.eSceneTypeAuth || options.scene == privilegeSceneConst.eSceneTypeReAuth) {
                t.privDetails = {
                    /*需要登录*/
                    NeedLogin: true,
                    /*需要认证*/
                    NeedAuth: true,
                    LoginIsEnough:false,
                    /*需要厂商角色*/
                    NeedManufacture: false,
                    /*无法操作*/
                    CannotOperate: false
                };
                resolve(t.privDetails);
            } else if (options.scene == privilegeSceneConst.eSceneTypeNeedManufactureLogin){
                t.privDetails = {
                    /*需要登录*/
                    NeedLogin: true,
                    /*需要认证*/
                    NeedAuth: false,
                    LoginIsEnough:true,
                    /*需要厂商角色*/
                    NeedManufacture: true,
                    /*无法操作*/
                    CannotOperate: false
                };
                resolve(t.privDetails);
            } else {
                /**
                 * 考虑到之前很多场景下仍然使用的是 operateTpe
                 */
                if (typeof options.scene != "undefined") {    // 若是新版权限参数
                    t.privDataUtils.getPrivilegeDetailsOfThisScene(options.scene).then((value)=>{
                        t.privDetails = value;
                        resolve(t.privDetails);
                    });
                }
            }
        })
        return promise;
    },

    /**
     * 登录成功后
     * @param result
     */
    loginSuccess() {
        let t = this;
        t.isLoginStatus = true;

        t.getCustomerUnite().then(()=>{
            if (t.userInfo != null && t.userInfo != undefined) {     // 更新头部用户状态 修改样式，加载头像 设置隐藏域
                if(t.userInfo.isValid==0){//TODO addBy lichunhui 2017.08.31无效的用户
                    comm.ajax2({
                        type: 'POST',
                        url: t.path.out,
                        dataType: 'json',
                        success: function (rep) {
                            if (rep && rep.responseObject && rep.responseObject.responseStatus) {
                                comm.cookie.delete("userId");
                                TempCache.clear();
                                window.location.href="//www.allinmd.cn";
                            }
                        }
                    });
                }
            }
            t.getCustomerAuthInfo().then(()=>{
                /*角色处理*/
                t.handleCustomerRole();
            });
        });

    },
    /**
     * 获取是否已认证状态
     * */
    getCustomerAuthInfo() {
        let t = this;
        const promise = new Promise(function(resolve, reject) {
            comm.ajax2({
                url: t.path.getCustomerAuthInfo,
                dataType: "json",
                type: "post",
                success: function (result) {
                    //添加全局的获取的认证信息防止以后的重复请求
                    t.customerAuth=result;
                    if (result != null && result != "") {
                        TempCache.setItem("authInfo", JSON.stringify(result));
                        let customerAuth = result.responseObject;
                        let userName = customerAuth.lastName + customerAuth.firstName;
                        TempCache.setItem("userName", userName);
                        if (!comm.isEmptyObject(result)) {
                            if ((customerAuth.state === 2 || customerAuth.state === 7 || customerAuth.state === 8 || customerAuth.state === 9)) {//已登录
                                t.isRenZhengStatus = true;
                            }
                        }
                    } else {
                        t.isRenZhengStatus = false;
                    }
                    resolve();
                }
            });
        })
        return promise;
    },
    /**
     * 登录后处理角色问题
     * */
    handleCustomerRole() {
        let t = this;
        switch (t.userInfo.customerRole) {
            //  系统用户
            case privilegeRoleConst.System:
                if (t.privDetails.NeedSystem) {
                    t.privCheckSuccess();
                } else {

                }
                break;
            // 组织
            case privilegeRoleConst.Organization:
                break;

            // 厂商
            case privilegeRoleConst.Manufacture:
                if (t.privDetails.NeedManufacture) {  // 需厂商权限
                    t.privCheckSuccess();
                } else {//无此操作权限
                    t.goBackIndex();
                }
                break;
                // // /*新厂商未认证*/
                // newManufacture:14,
                //     /*新厂商已认证*/
                //     newManufactureState:15,
            case privilegeRoleConst.newManufacture:
            case privilegeRoleConst.newManufactureState:
                window.location.href="//www.allinmd.cn";
                break;
            // 患者
            case privilegeRoleConst.Patient:
                break;
            // 普通用户 医师
            case privilegeRoleConst.Doctor:
                if (t.privDetails.LoginIsEnough) {    // 仅需登录
                    t.privCheckSuccess();
                } else {
                    t.checkIfNeedAuth();
                }
                break;
            case privilegeRoleConst.AuthedDoctor:   // 认证用户
            case privilegeRoleConst.assistantDoctor:   // 认证用户
            case privilegeRoleConst.LiveStudents:   // 住陪学员
            case privilegeRoleConst.practitioner:   // 执业医师
            case privilegeRoleConst.Nurse:

                if (t.privDetails.LoginIsEnough) {    // 仅需登录
                    t.privCheckSuccess();
                }
                /**
                 * 检查当前用户状态
                 * 若状态正常，则执行第二步检测用户是否完善信息，
                 * 若已完善，则执行第三步，检查是否在直播页面，
                 * 若在直播页面，则检查用户直播信息是否已完善
                 * 不正常则显示提示信息。
                 */
                else {
                    t.checkAuthState();
                }
                break;
            default:
                console.log('暂无此角色判断！');
                break;
        }
    },
    /**
     * 判断是否需要认证用户权限
     */
    checkIfNeedAuth() {
        let t = this;
        if (t.privDetails.NeedAuth) {     // 需认证
            t.checkAuthState();
        }
    },
    //获取认证信息后执行
    checkAuthState(){
        let t=this;
        let data=t.customerAuth;
        if (data === null || data == "" || data.responseObject === undefined || comm.isEmptyObject(data.responseObject) || data.responseObject.state == -1) {	//未认证
            t.goBackIndex();
        } else {
            let customerId = t.customerAuth.responseObject.customerId;
            let state = t.customerAuth.responseObject.state;
            if(customerId<=0){//TODO 20180627 update by lichunhui 解决checksession返回true 但是 auth信息返回没有用户信息时去登录
                t.goBackIndex();
                return false;
            }
            // -    1-无认证信息、0-二次提交认证、1-认证待审核、2-运营确认、3-认证拒绝、4-执业医师申请中、5-执业医师通过、6-执业医师拒绝
            if (state === 3 || state === -1 || state === 0 || state === 1) {
                // 未申请  || 被拒绝
                //alert("您的认证申请正在审核中。无法进行相关操作");
                t.goBackIndex();
            } else if (state === 2 || state === 7 || state === 8 || state === 9) {
                if(comm.cookie.get("userId")==""||!comm.cookie.get("userId")){//已经登录但是没有检测到cookie 执行刷新
                    comm.cookie.set("userId",customerId,365*5);
                    location.reload();
                }
                //V1认证已经通过，此时不允许再次认证
                t.options.callback&&t.options.callback();
            }
        }

    },
    //回到唯医首页
    goBackIndex(){
        window.location.href="//www.allinmd.cn?from=emr";
    }
};
export default user;
