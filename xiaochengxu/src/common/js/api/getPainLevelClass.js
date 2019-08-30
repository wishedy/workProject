/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 2018/2/7.
 */
export default function getPainLevel(level) {
  let className = "";
  switch (parseInt(level)) {
    case -1:
      className = "pain";
      break;
    case 0:
      className = "pain0";
      break;
    case 1:
    case 2:
      className = "pain1";
      break;
    case 3:
    case 4:
      className = "pain2";
      break;
    case 5:
    case 6:
      className = "pain3";
      break;
    case 7:
    case 8:
      className = "pain4";
      break;
    case 9:
    case 10:
      className = "pain5";
      break;
  }
  return className;
}
