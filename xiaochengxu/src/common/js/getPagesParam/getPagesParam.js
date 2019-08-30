/**
 * @Desc：判断将要跳转的页面是第几级
 * @Usage:name：将要跳转的页面的名字
 * @Notify：
 * @Depend：
 *
 * Created by
 */


class getPagesParam {
  constructor() {
  }

  getPageInfo(name) {
    let indexNum=0,pages=getCurrentPages(),pagesLen=pages.length;
    for (let i=0;i<pagesLen;i++){
      if(pages[i].route.split('/')[2] == name){
        return {
          hasName:true,
          param:pages[i].options,
          backNum:pagesLen-i-1
        }
        break;
      }else {
        indexNum++;
      }
    }
    if(indexNum==pages.length){
      return {
        hasName:false
      }
    }
  }



}

export default new getPagesParam();
