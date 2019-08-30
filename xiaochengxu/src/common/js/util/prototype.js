/**
 * @Desc:基础原型扩展
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/9/22.
 */

export default function prototype() {

  //删除数组中某项
  Array.prototype.removeByValue = function (val) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] == val) {
        this.splice(i, 1);
        break;
      }
    }
  };


  if (!String.prototype.padStart)
    String.prototype.padStart = function (maxLength, fillString = ' ') {
      if (Object.prototype.toString.call(fillString) !== "[object String]") throw new TypeError('fillString must be String')
      let str = this
      // 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
      if (str.length >= maxLength) return String(str)

      let fillLength = maxLength - str.length,
        times = Math.ceil(fillLength / fillString.length)


      while (times >>= 1) {
        fillString += fillString
        if (times === 1) {
          fillString += fillString
        }
      }
      return fillString.slice(0, fillLength) + str
    }
};
