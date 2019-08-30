import ajax from "./ajax.js";
export default function getLocationGps(params) {
  return new Promise((resolve, reject) => {
    let baiduAK2 = 'RRkAmQiiYOGNCKgwFmgws34YBMTTABe3'; // 百度地图开放平台申请下的Key  web接口的  TODO:以后应换成公司注册的百度帐号。现为我自己的帐号创建的 liuyutao
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // console.log(res)
        const latitude = res.latitude; //经度
        const longitude = res.longitude; //纬度
        const speed = res.speed;
        const accuracy = res.accuracy;
        const location = {
          latitude: res ? res.latitude : "", //经度
          longitude: res ? res.longitude : "" //纬度
        };
        let location2 = res.latitude + ',' + res.longitude;
        ajax({
          url: 'https://api.map.baidu.com/geocoder/v2/?output=json&ak=' + baiduAK2 + '&location=' + location2,
          done(data) {
            if (data && data.status == 0) {
              if (data.result) {
                resolve({
                  provinceName: data.result.addressComponent.province, // 省
                  cityName: data.result.addressComponent.city, // 市
                  isfail: false, // 经纬度识别转换成功与否
                  isCover: params.name == data.result.addressComponent.province?true:false // 地区匹配成功与否
                })
              } else {
                // 接口返回无数据
                resolve({
                  provinceName: "", // 省
                  cityName: "", // 市
                  isfail:true,
                  isCover:false
                })
              }
            } else {
              // 接口异常
              resolve({
                provinceName: data.result.addressComponent.province, // 省
                cityName: data.result.addressComponent.city, // 市
                isfail: true,
                isCover: false
              })
            }
          },
          fail(err) {
            reject(err);
          }
        })
      },
      fail(err){
        // console.log(err)
        reject(err)
      }
    })
  })
}
