/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/4/8.
 */

class LocalStorage{
  constructor(){

  }

  setItem(key,value){
   wx.setStorageSync(key, value);
  }

  getItem(key){
    return wx.getStorageSync(key)
  }
  removeItem(key){
    wx.removeStorageSync(key);
  }
  
}

export default new LocalStorage();
