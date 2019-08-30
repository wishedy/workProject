/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 2017/12/20.
 */
export function getList(num){
  let result = [];
  for (let i=1; i <= num; i++) {
    result.push({
      text: i,
      value: i
    })
  }
  return result;
}
export const dataDay = [{
  text: "0.5",
  value: "0.5"
}, {
  text: "1",
  value: "1"
}, {
  text: "2",
  value: "2"
}, {
  text: "3",
  value: "3"
}, {
  text: "4",
  value: "4"
}, {
  text: "5",
  value: "5"
}, {
  text: "6",
  value: "6"
}];

export const dataWeek = getList(4);

export const dataMonth = getList(12);

export const dataYear=getList(50);
