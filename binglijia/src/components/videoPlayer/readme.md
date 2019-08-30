### 关于公共组件视频播放的解释说明：
导入标签:

import videoPlayer from  '~components/videoPlayer/videoPlayer.vue'

 在<template>标签中写入如下组件：

    <videoPlayer :path="path" :beginPlay="beginPlay" @beginFn="beginFn"></videoPlayer>

注：需要在methods里面写入
beginFn(flag){
    this.beginPlay = flag;
}


#### path：视频地址。
#### beginPlay：是否是开始播放视频，只需在点击播放时置为true。
#### isPopup：是否是弹层上继续再弹出弹层进行播放视频。如果是则需再传“:isPopup="true"”
#### codeType:视频转码状态(2-转码成功，3-转码中，4-转码失败)
