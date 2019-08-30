### 1:关于popupTip使用说明
①组件路径：

import popup from '~components/popupTip/popupTip.vue';

②组件内容：

    <popup :editing="editing" :editQuit="editQuit" :editingTxt="editingTxt" :editQuitTxt="editQuitTxt" @popupFn="popupFn"></popup>

③解释：

editing：正在编辑中。
editQuit：异常退出。
editingTxt：正在编辑话术。（可不传，不传为默认文字）
editQuitTxt：异常退出话术。（可不传，不传为默认文字）
isTwo：是否是两行文字。
isTwoTxt：两行文字中的内容。

④使用：

想显示相应内容则在有关的操作中将editing或editQuit置为true即可。

⑤在vue文件methods中加入此方法：

popupFn(flag){
     this.editing = flag;
     this.editQuit = flag;
 },
