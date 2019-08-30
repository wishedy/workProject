- comm.ajax.js            :   ajax调用（同步、异步获取数据）

- comm.ajaxExistHtml.js   :   ajax请求html判断返回状态（唯医首页的title和not_found.html）

- comm.autoHeight.js      :   扩大文本域（文本域高度自适应）

- comm.checkAddress.js    :   判断是否为江浙沪地区用户

- comm.customer.js        :   获取用户的信息（个人信息）

- comm.cutArray.js        :   字符串的处理（裁剪医师，非医师）

- comm.dataAdapter.js     :   数据适配中心，针对后端返回的JSON数据进入对应的处理

- comm.date.js            :   时间处理（发布时间，当前时间，时间格式化）

- comm.equipment.js       :   设备检测（安卓，苹果，塞班,Windows Phone,iPod）

- comm.fastError.js       :   快速失败（fastError,检测是否漏掉参数）

- comm.file.js            :   文件操作（上传时返回文件的大小，fileSize）

- comm.func.js            :   方法集（setCenter（屏幕居中），
                                   browser（浏览器版本和移动终端浏览器版本信息），
                                   setImgSize（Img大小），
                                   getStrLen（将超出长度的字符串加... 参数意思,str:字符串 len:最大长度 汉字的长度*2），
                                   getStrByteLen（将超出长度的字符串加... 参数意思,str:字符串 len:最大长度 汉字的长度*2），
                                   revCutstr(反向截取字符串)
                                   getByteLen（获取字符串长度）
                                   shareLog（分享日志）
                                   stopBubble（取消冒泡事件），
                                   checkAccountType（检测用户的类型，手机、邮箱），
                                   getpara（获取导航参数以?分隔），
                                   isEmptyObject（判断空对象）），
                                   toInt（字符串转为int类型）
                                   toK（数字超过1000改为1K+）
                                   toW（数字超过10000改为1万+）
                                   getRegisterName(未认证用户 全站统一显示的邮箱或手机的截取格式)
                                   showSuccessPop（设置页的成功弹层）
                                   canSetLocalStorage（兼容不支持localStorage的情况,如safari隐身模式）
                                   TempCache（localStorage的一些操作方法）
                                   htmlToString（展示时把html标签转换成字符串显示）
                                   escapeReplace（特殊字符转义）
                                   numToChinese（创建class类）
                                   ）

- comm.getLogo.js         :   获取用户头像

- comm.getUrlParams.js    :   获取URL地址参数值

- comm.lightBox.js        :   遮罩层（z-index：9）

- comm.Log.js             :   记录日志（浏览记录）

- comm.scrollFloating.js  :   页面右侧的跟随屏幕（二维码、首页）

- comm.textChange.js      :   输入框输入文字及规则限制

- comm.track.js           :   数据埋点

- main.js                 :   站点类型配置存放（PC_CALL，base（基础），comm（公共方法），module（模块），plugin（插件），support（扩展支撑），scene（场景），document.domain，
                                            UseFlag（头像规格），AttUseFlag（非头像），ResouceType（资源类型），ResourseSortType（排序类型），SceneType（场景类型），
                                            CategoryType（分类类型））