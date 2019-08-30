/**
 * 功能描述：权限相关工具类
 * 使用方法：
 * 注意事项：
 * 引入来源：
 * 作用：
 * Create by YaoQiao on 2018/9/8
 */

'use strict';
import relationList from '../../../router/menuRelation';

/**
 * 用户角色码
 * @type {{ROLE_ADMIN: number, ROLE_USER: number}}
 */
export const ROLE_STATUS_CODE = {
  ROLE_ADMIN: 721, // 管理员
  ROLE_USER: 722 // 普通用户
};

/**
 * 处理可供主页使用的菜单栏
 * @param menuDataList
 * @returns {Array}
 */
export function formatMenuDataList(menuDataList) {
  let rst = [];
  // 筛选步骤一：筛选后端数据
  for (let i = 0; i < menuDataList.length; i++) {
    let oneTreeData = menuDataList[i];
    if (oneTreeData && oneTreeData.oneTree) {
      if (oneTreeData.childMap && oneTreeData.childMap.length > 0) {
        let oneTreeChildMap = oneTreeData.childMap;
        for (let j = 0; j < oneTreeChildMap.length; j++) {
          let menuObj = {};
          menuObj.title = oneTreeData.oneTree.systemName;
          let twoTreeData = oneTreeData.childMap[j];
          if (twoTreeData && twoTreeData.twoTree) {
            // 如果有三级菜单，则取三级菜单
            if (twoTreeData.childMap && twoTreeData.childMap.length > 0) {
              let twoTreeChildMap = twoTreeData.childMap;
              menuObj.title += '>';
              menuObj.title += twoTreeData.twoTree.menuName;
              menuObj.menuItemList = [];
              for (let m = 0; m < twoTreeChildMap.length; m++) {
                let threeTreeData = twoTreeChildMap[m];
                let menuItemObj = {};
                if (threeTreeData && threeTreeData.threeTree) {
                  menuItemObj.name = threeTreeData.threeTree.menuName;
                  menuItemObj.menuId = threeTreeData.threeTree.menuId;
                  // 获取 pageOperation，如果没有值，则不设置
                  let operationList = threeTreeData.threeTree.pageOperation.split(',');
                  menuItemObj.pageOperation = null;
                  let highOperation = null;

                  if (operationList.length > 0 && operationList[0]) {
                    for (let x = 0; x < operationList.length; x++) {
                      if (operationList[x]) {
                        menuItemObj.pageOperation = operationList[x];
                        if (menuItemObj.pageOperation === ROLE_STATUS_CODE.ROLE_ADMIN.toString()) {
                          highOperation = ROLE_STATUS_CODE.ROLE_ADMIN;
                        }
                      }
                    }
                    menuItemObj.pageOperation = !highOperation ? menuItemObj.pageOperation : highOperation;
                  }
                  menuObj.menuItemList.push(menuItemObj);
                }
              }
              // 目前仅处理有三级菜单的情况
              if (menuObj.menuItemList.length > 0) {
                rst.push(menuObj);
              }
            }// 否则取二级菜单
            else {

            }
          }
        }
      }
    }
  }
  // 筛选步骤二：配置路由
  for (let i = 0; i < rst.length; i++) {
    let menuItemList = rst[i].menuItemList;
    for (let j = 0; j < menuItemList.length; j++) {
      let menuItem = menuItemList[j];
      for (let m = 0; m < relationList.length; m++) {
        if (menuItem.menuId === relationList[m].menuId) {
          menuItem.router = relationList[m].router;
          menuItem.icon = '/static/images/icons/' + relationList[m].icon;
          break;
        }
        /*
        * 容错：避免后台接口中添加新菜单项，前端未进行新增匹配而产生的报错
        * */
        if (m === parseInt(relationList.length - 1)) {
          menuItem.router = '/';
          menuItem.icon = '/static/images/icons/icon-home-01.png';
        }
      }
    }
  }
  return rst;
}

/**
 * 获取当前菜单（路由）的权限码
 * @param router 当前菜单的router地址，可以使用this.$route.path得到
 * @returns {*} 如果为null，建议做对应的异常容错
 */
export function getPageOperation(router) {
  let menuList = JSON.parse(sessionStorage.getItem('menuList'));
  for (let i = 0; i < menuList.length; i++) {
    let list = menuList[i].menuItemList;
    for (let j = 0; j < list.length; j++) {
      if (router === list[j].router) {
        return list[j].pageOperation;
      }
    }
  }
  return null;
}
