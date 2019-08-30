```
/** 功能描述：全局消息提示
 * 使用方法：  this.$tipMessage(true,'info', '审核通过后，修改信息将保存',0)
 * 注意事项： 
 * 引入来源：main.js 中引用即可
 * 作用：统一消息提示
 * Create by YaoQiao on 2018/9/11
 */
```

 * main.js
 ```
 import tipMessage from "./components/common/tipMessage/Message"
 //引入全局提示框
 Vue.use(tipMessage);
 ```
 
* 引用说明
```
  this.$tipMessage(visiable,type, message,duration)
  visiable:是否可见，通过设置 true/false 控制消息是否显示
  type：消息类型
  message：消息内容
  duration：自动隐藏时间，为0时表示不隐藏，
  
 //this.$tipMessage(true,'info', '审核通过后，修改信息将保存',0)
 
```
* 注意事项
```
 1.除非必要或统一需求，否则禁止修改已有消息类型对应的样式
 2.如果需要拓展，建议新加消息类型及样式
```
 
