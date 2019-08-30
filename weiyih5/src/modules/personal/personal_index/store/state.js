/**
 * Created by lichunhui on 2018/1/4.
 */
import comm from 'static/js/comm.js';
import TempCache from "static/js/tempcache.js";
let customerRole = comm.checkInvalid(TempCache.getItem('customerRole'))?100:TempCache.getItem('customerRole');
const state={
  cId:'',
  showUploadImg:false,//显示头像上传dom
  uploadIng:false,//正在
  uploadSuccess:false,
  logoUrl:'',
  customerInfo:{},
  customerRole:customerRole,
  specialCount:{},
    eventList:[],
    isAjax:[],
    iscontentTab:false,
    isHeader:false
};
export default state;