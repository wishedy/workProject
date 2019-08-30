/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 2018/2/7.
 */
export default function getDotSize(dpr) {
  let result = "";
  switch (parseInt(dpr)) {
    case 3:
      result = 240;
      break;
    case 2:
      result = 160;
      break;
    case 1:
      result = 80;
      break;
  }
  return parseInt(result);
}
