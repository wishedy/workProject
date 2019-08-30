/**
 * @Desc：页面字段信息
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by ZH on 2019/2/20.
 */

// reportFieldType 报道字段类型：0-疾病症状描述;1-就诊时间；2-是否检查(1是 2否);3-检查结果类型(1已拿到部分或全部检查结果 2没在身边，稍后补充);
// 4-检查结果状态(1拍照上传 2还没拿到);5-上传检查状态(1已上传 2没有上传)6-是否开药(1是 2否);7-记录药方方法(1拍照上传 2手写);
// 8-上传药照片结果(1已上传 2没有上传);
// 9-药名名称和用法用量;10-治疗建议类型(1观察、定期复查 2住院治疗 3保守治疗 4已好转 5已痊愈 6其他);
// 11-复查时间类型(1三天后复查 2一周后复查 3两周后复查 4两个月后复查 5三个月后复查 6半年后复查 7一年后复查);
// 12-住院状态(1犹豫中，还没有决定 2已决定住院，等待安排 3已住院 4已出院);13医生的建议(10-治疗建议类型(6其他));
// 14-记录床头卡或腕带方式(1拍照片2手写);15-上传床头卡结果(1已上传 2没有上传);16-住院号;17-是否住院(1是 2否);
// 18-是否手术(1是 2否);19-手术时间;20-出院时间;21-复诊时间类型(1三天后复查 2一周后复查 3两周后复查
// 4两个月后复查 5三个月后复查 6半年后复查 7一年后复查);22-完成度;23-是否带药(1是 2否);


// reportFieldName 报道字段英文名：0-疾病症状描述(illnessContent);1-就诊时间（visitDate）；2-是否检查(isChecked);3-检查结果类型(checkResultType);
// 4-检查结果状态(checkResultState);5-上传检查状态(uploadCheckResult);6-是否开药(isPrescribe);7-记录药方方法(recordPrescribeStyle);
// 8-上传药照片结果(uploadPrescribeResult);9-药名名称和用法用量(prescribeMethod);10-治疗建议类型(treatSuggest);11-复查时间类型(reviewTimeType);
// 12-住院状态(beinHospitalState);13医生的建议(doctorSuggest);14-记录床头卡或腕带方式(bedsideWordWristbandStyle);
// 15-上传床头卡结果(uploadBedwordResult);16-住院号(hospitalNum);17-是否住院(isBeinHospital);18-是否手术(isOperation);
// 19-手术时间(operationTime);20-出院时间(leaveHospital);21-复诊时间类型(returnVisitTime);22-完成度(completionDegree);
// 23-是否带药(isTakeMedicine);
const pageInfo=[
  {sortId:1,pageSort:'QA1',completionDegree:'10',reportType:4,path:'/packageD/reportNew/clinicOne', reportContentList:
      [{reportFieldType:"0",reportFieldName:"illnessContent"},{reportFieldType:"1",reportFieldName:"visitDate"}],},
  {sortId:2,pageSort:'QA2',completionDegree:'20',reportType:4,path:'/packageD/reportNew/clinicTwo', reportContentList:
      [{reportFieldType:"2",reportFieldName:"isChecked"}]},
  {sortId:3,pageSort:'QA2_1',completionDegree:'30',reportType:4,path:'/packageD/reportNew/clinicTwoA',reportContentList:
      [{reportFieldType:"3",reportFieldName:"checkResultType"}]},
  {sortId:4,pageSort:'QA2_2',completionDegree:'40',reportType:4,path:'/packageD/reportNew/clinicTwoB',reportContentList:
      [{reportFieldType:"4",reportFieldName:"checkResultState"}]},
  {sortId:5,pageSort:'QA2_3',completionDegree:'40',reportType:4,path:'/packageD/reportNew/clinicTwoB',reportContentList:
      [{reportFieldType:"5",reportFieldName:"uploadCheckResult"}]},
  {sortId:6,pageSort:'QA3',completionDegree:'50',reportType:4,path:'/packageD/reportNew/clinicThree',reportContentList:
      [{reportFieldType:"6",reportFieldName:"isPrescribe"}]},
  {sortId:7,pageSort:'QA3_1',completionDegree:'60',reportType:4,path:'/packageD/reportNew/clinicThreeA',reportContentList:
      [{reportFieldType:"7",reportFieldName:"recordPrescribeStyle"}]},
  {sortId:8,pageSort:'QA3_2',completionDegree:'70',reportType:4,path:'/packageD/reportNew/clinicThreeA',reportContentList:
      [{reportFieldType:"8",reportFieldName:"uploadPrescribeResult"}]},
  {sortId:9,pageSort:'QA3_3',completionDegree:'70',reportType:4,path:'/packageD/reportNew/clinicThreeB',reportContentList:
      [{reportFieldType:"9",reportFieldName:"prescribeMethod"}]},
  {sortId:10,pageSort:'QA4',completionDegree:'80',reportType:4,path:'/packageD/reportNew/clinicFour',reportContentList:
      [{reportFieldType:"10",reportFieldName:"treatSuggest"}]},
  {sortId:11,pageSort:'QA4_1',completionDegree:'90',reportType:4,path:'/packageD/reportNew/clinicFourA',reportContentList:
      [{reportFieldType:"11",reportFieldName:"reviewTimeType"}]},
  {sortId:12,pageSort:'QA4_2',completionDegree:'90',reportType:4,path:'/packageD/reportNew/clinicFourB',reportContentList:
      [{reportFieldType:"12",reportFieldName:"beinHospitalState"}]},
  {sortId:13,pageSort:'QA4_3',completionDegree:'90',reportType:4,path:'/packageD/reportNew/clinicFourC',reportContentList:
      [{reportFieldType:"13",reportFieldName:"doctorSuggest"}]},
  {sortId:14,pageSort:'QA5',completionDegree:'90',reportType:4,path:'/packageD/reportNew/clinicFive',reportContentList:
      [{reportFieldType:"14",reportFieldName:"bedsideWordWristbandStyle"}]},
  {sortId:15,pageSort:'QA5_1',completionDegree:'90',reportType:4,path:'/packageD/reportNew/clinicFive',reportContentList:
      [{reportFieldType:"15",reportFieldName:"uploadBedwordResult"}]},
  {sortId:16,pageSort:'QA5_2',completionDegree:'90',reportType:4,path:'/packageD/reportNew/clinicFiveA',reportContentList:
      [{reportFieldType:"16",reportFieldName:"hospitalNum"}]},
  {sortId:17,pageSort:'QB1',completionDegree:'10',reportType:5,path:'/packageD/reportNew/hospitalOne',reportContentList:
      [{reportFieldType:"0",reportFieldName:"illnessContent"},{reportFieldType:"1",reportFieldName:"visitDate"}]},
  {sortId:18,pageSort:'QB2',completionDegree:'20',reportType:5,path:'/packageD/reportNew/hospitalTwo',reportContentList:
      [{reportFieldType:"17",reportFieldName:"isBeinHospital"}]},
  {sortId:19,pageSort:'QB2_1',completionDegree:'60',reportType:5,path:'/packageD/reportNew/hospitalTwoA',reportContentList:
      [{reportFieldType:"14",reportFieldName:"bedsideWordWristbandStyle"}]},
  {sortId:20,pageSort:'QB2_2',completionDegree:'90',reportType:5,path:'/packageD/reportNew/hospitalTwoA',reportContentList:
      [{reportFieldType:"15",reportFieldName:"uploadBedwordResult"}]},
  {sortId:21,pageSort:'QB2_3',completionDegree:'90',reportType:5,path:'/packageD/reportNew/hospitalTwoB',reportContentList:
      [{reportFieldType:"16",reportFieldName:"hospitalNum"}]},
  {sortId:22,pageSort:'QB3',completionDegree:'40',reportType:5,path:'/packageD/reportNew/hospitalThree',reportContentList:
      [{reportFieldType:"18",reportFieldName:"isOperation"}]},
  {sortId:23,pageSort:'QB3_1',completionDegree:'60',reportType:5,path:'/packageD/reportNew/hospitalThreeA',reportContentList:
      [{reportFieldType:"19",reportFieldName:"operationTime"},{reportFieldType:"20",reportFieldName:"leaveHospital"},{reportFieldType:"21",reportFieldName:"returnVisitTime"}]},
  {sortId:24,pageSort:'QB3_2',completionDegree:'60',reportType:5,path:'/packageD/reportNew/hospitalThreeB',reportContentList:
      [{reportFieldType:"20",reportFieldName:"leaveHospital"},{reportFieldType:"21",reportFieldName:"returnVisitTime"}]},
  {sortId:25,pageSort:'QB4',completionDegree:'70',reportType:5,path:'/packageD/reportNew/hospitalFour',reportContentList:
      [{reportFieldType:"23",reportFieldName:"isTakeMedicine"}]},
  {sortId:26,pageSort:'QB4_1',completionDegree:'80',reportType:5,path:'/packageD/reportNew/hospitalFourA',reportContentList:
      [{reportFieldType:"7",reportFieldName:"recordPrescribeStyle"}]},
  {sortId:27,pageSort:'QB4_2',completionDegree:'90',reportType:5,path:'/packageD/reportNew/hospitalFourA',reportContentList:
      [{reportFieldType:"8",reportFieldName:"uploadPrescribeResult"}]},
  {sortId:28,pageSort:'QB4_3',completionDegree:'90',reportType:5,path:'/packageD/reportNew/hospitalFourB',reportContentList:
      [{reportFieldType:"9",reportFieldName:"prescribeMethod"}]},
];
export default JSON.stringify(pageInfo);
