import util from "./util";

export default function showBigImg(param){
    wx.previewImage({
        current: param.imgArr[param.index] ||'', // 当前显示图片的http链接
        urls:param.imgArr // 需要预览的图片http链接列表
      });
}