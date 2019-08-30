/**
 * 功能描述：
 * 使用方法：
 * 注意事项：
 * 引入来源：
 * 作用：
 * Create by YaoQiao on 2018/9/7
 */

'use strict';

const getters = {
  /**
   * 基本信息，登录后获得
   * */
  userLoginName: state => state.userLoginName,
  userName: state => state.userName,
  // 权限相关
  menuList: state => state.menuList

};

export default getters;
