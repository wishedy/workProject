
- 新建病历组件细化

组件名称 |类型|属性| 属性|属性| 属性|属性| 属性|属性|属性|属性|属性|属性|属性|属性|属性
---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---
输入框 |0|labelName|isRequired|contentDes|placeholder|/|maxLen|/|/|testRule|/|/|/|unitName
下拉框| 1| labelName|isRequired|/|/|SelectList|/|index|/|/|/|/|
选择输入框 |2|labelName|isRequired|contentDes|placeholder|SelectInputList|/|index|/|/|/|
输入选择框 |3|labelName|isRequired|contentDes|placeholder|InputSelectList|/|index|/|/|/|
年龄输入框 |4|labelName|isRequired|/|/|/|/|/|||||contentYear|contentMonth|contentDay
日期选择器 |5| labelName|isRequired|/|/|/|/|/|||||yearSelect|monthSelect|daySelect
单选框 |6|labelName|isRequired|contentDes|placeholder|RadioList|/|index|row|/|needInput|
多选框 |7|labelName|isRequired|contentDes|placeholder|checkBoxList|/|/|row|/|needInput|/
文本域 |8| labelName|isRequired|contentDes|placeholder|/|maxLen|/|/|testRule||titleDes|/|/|title|
添加按钮 |9| labelName

- 下拉框

参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
isRequired |Nubmer |N |是否是必填项|不传非必填，传必填|<INPUT isRequired></INPUT>
labelName |String |N |表单label|不传不展示，传值必须有值|labelName='手机号'
SelectList |Strinng |Y |选项数据|必填项|SelectList = JSON.string([{'selectName':'1212'},{'selectName':'234'},{'selectName':'531'}])

- 单个INPUT输入框


参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
maxLen |Number |N |最大输入长度|不传代表无限制,传值必须有值|maxLen = '20'
contentDes |String |N |初始化输入框内容|无值传空或不传，有值传值|contentDes = '';contentDes = '文本内容';
testRule |String |N |输入过程中的正则校验|不传代表无校验，传值必须有值，正则列表见下文|testRule='testPhoneNum'
isRequired |Nubmer |N |是否是必填项|不传非必填，传必填|<INPUT isRequired></INPUT>
labelName |String |N |表单label|不传不展示，传值必须有值|labelName='手机号'
placeholder |String |N |同input的placeholder|不传不展示，传值必须有值|placeholder='请输入您的手机号'
unitName |String |N |输入框后的单位|不传不展示，传值必须有值|unitName='厘米'

- 单选项

参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
RadioList |Strinng |Y |选项数据|必填项|RadioList = JSON.string([{'radioName':'男'},{'radioName':'女'}])
index |String |N |默认选项|不传值默认都不选，传对应的index选对应的值|index = '20'
isRequired |Nubmer |N |是否是必填项|不传非必填，传必填|
labelName |String |N |表单label|不传值不显示|labelName='手机号'
row |Number |N |选项排列方式|不传横排，传竖排|
needInput | |N|选项中是否需要Input|传需要，不传不需要|
contentDes |String |N |初始化输入框内容|无值传空或不传，有值传值|contentDes = '';contentDes = '文本内容';
placeholder |String |Y |同input的placeholder||placeholder='请输入您的手机号'

- 多选项


参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
checkBoxList |Strinng |Y |选项数据|必填项|checkBoxList = JSON.string(JSON.stringify([{'checkboxName':'男','checkOnOff':true},{'checkboxName':'女','checkOnOff':true}]))
isRequired |Nubmer |N |是否是必填项|不传非必填，传必填|
labelName |String |N |表单label|不传值不显示|labelName='手机号'
row |Number |N |选项排列方式|不传横排，传竖排|
needInput | |N|选项中是否需要Input|传需要，不传不需要|
contentDes |String |N |初始化输入框内容|无值传空或不传，有值传值|contentDes = '';contentDes = '文本内容';
placeholder |String |Y |同input的placeholder||placeholder='请输入您的手机号'

- 选择输入/输入选择同理

参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
SelectInputList |String |Y | 选项数据|必填项|JSON.stringify([{'selectName':'1212'},{'selectName':'234'},{'selectName':'531'}])
index |String |N |默认选项|不传值默认都不选，传对应的index选对应的值|index = '20'
isRequired |Nubmer |N |是否是必填项|不传非必填，传必填|
labelName |String |N |表单label|不传值不显示|labelName='手机号'
contentDes |String |N |初始化输入框内容|无值传空或不传，有值传值|contentDes = '';contentDes = '文本内容';
placeholder |String |Y |同input的placeholder||placeholder='请输入您的手机号'

- 时间选择器

参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
labelName |String |N |表单label|不传值不显示|labelName='手机号'
isRequired |Nubmer |N |是否是必填项|不传非必填，传必填|
yearSelect |String|N|年默认值|不传值不显示|yearSelect="2018"
monthSelect |String|N|月默认值|不传值不显示|monthSelect="12"
daySelect |String|N|日默认值|不传值不显示|daySelect="2018"

- 年龄输入框

参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
labelName |String |N |表单label|不传值不显示|labelName='手机号'
isRequired |Nubmer |N |是否是必填项|不传非必填，传必填|
contentYear|String|N|年默认值|不传值不显示|contentYear="2018"
contentMonth|String|N|年默认值|不传值不显示|contentMonth="12"
contentDay|String|N|年默认值|不传值不显示|contentDay="12"

- 添加按钮

参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
labelName |String |N |表单label|不传值不显示|labelName='手机号'

- 标签添加

参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
maxLen |Number |N |最大输入长度|不传代表无限制,传值必须有值|maxLen = '20'
labelName |String |N |表单label|不传值不显示|labelName='手机号'
contentTagList|String|N|已选过的标签|不传值不显示|contentTagList = JSON.stringify([{'tagName':'标签名字'},{'tagName':'标签名字'},{'tagName':'标签名字'},{'tagName':'标签名字'},{tagName':'标签名字'}])

- 文本域

参数 | 类型 | 必传 |描述|选项|例子
---|--- |--- | ---|--- |---
maxLen |Number |N |最大输入长度|不传代表无限制,传值必须有值|maxLen = '20'
contentDes |String |N |初始化输入框内容|无值传空或不传，有值传值|contentDes = '';contentDes = '文本内容';
testRule |String |N |输入过程中的正则校验|不传代表无校验，传值必须有值，正则列表见下文|testRule='testPhoneNum'
labelName |String |N |表单label|不传不展示，传值必须有值|labelName='手机号'
placeholder |String |N |同input的placeholder|不传不展示，传值必须有值|placeholder='请输入您的手机号'
title |String |N |文本域title|不传不展示，传值必须有值|title='既往史'
titlDes |String |N |文本域title的描述,或者是副标题|不传不展示，传值必须有值|titleDes='包含不局限于：疾病名称、疾病的治疗情况。可填写多个疾病'





