/**
 * @Desc：Vuex全局状态机
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/23.
 */

/*Init*/
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
/*Total Store*/
import state from "./states";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
/*Module Store*/
import consult from "./modules/consult/_consult";
import coupon from "./modules/coupon/_coupon";
import imScene from "./modules/imScene/_imScene";
import imSceneDoctor from "./modules/imSceneDoctor/_imSceneDoctor";
import findDoctor from "./modules/findDoctor/_findDoctor";
import doctorMain from "./modules/doctorMain/_doctorMain";
import questionDesc from "./modules/questionDesc/_questionDesc";
import journal from "./modules/journal/_journal";
import report from "./modules/report/_report";
import reportNew from "./modules/reportNew/_reportNew";
import meinian from "./modules/meinian/_meinian";
import patientNote from "./modules/patientNote/_patientNote";

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules:{
    consult,
    coupon,
    imScene,
    imSceneDoctor,
    findDoctor,
    doctorMain,
    questionDesc,
    journal,
    report,
    reportNew,
    meinian,
    patientNote
  }
})
