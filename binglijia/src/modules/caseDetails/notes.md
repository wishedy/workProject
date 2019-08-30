## 关于病历详情页的相关说明：
### app.vue
###### 组件组成：

* 特殊头部组件。“src/components/common/caseDetailHeaderTopNav.vue”
* 右内容区包括左侧Tab组件。”src/modules/caseDetails/components/caseDetail.vue“
* 问诊信息内容。
* 报道信息内容。

注：使用的组件只有这两个，其余均为测试组件。

###### 使用vuex:

* showLoadi（参数：showLoad） 控制loading是否显示方法。
* baseMust（参数：baseMustInfo）存放患者必填信息--姓名、年龄、性别。
* chaPatientId（参数：patientId）病人Id。
