<template>
    <section class="al-typeFilterMainMask" :class="{'active':popParam.topTabFlag&&popParam.indexPop==0}" data-role="filter">
        <section class="al-twoFloorFilter" data-alcode-mod='403'>
            <!--弹层一级筛选列表开始-->
            <section id="wrapper_first" data-alcode-sm="left">
                <section class="al-twoFloorFirstFilter EV-firstTemplateBox" data-alcode-item-selector="article">
                    <article :class="{'selected':key===popParam.nowFirIndex}"
                             v-for="(item,key) in popParam.popFirList"
                             @click="popFirListClick(key)" :key="key" class="al-twoFloorFirstFilterItem"
                             :refId="item.refId">
                        <span>{{item.refRename}}</span>
                    </article>
                </section>
            </section>
            <!--弹层一级筛选列表结束-->
            <!--弹层二级筛选列表开始-->
            <section id="wrapper_second" data-alcode-sm="right">
                <section class="al-twoFloorSecondFilter" data-alcode-item-selector="article">
                    <section class="al-twoFloorSecondFilterBox" :class="{'selected':popParam.topTabFlag}">
                        <article :class="{'active':(tagId&&parseInt(tagId)!==0)?parseInt(tagId)===parseInt(item.refId):key===item.nowSecIndex,
                        'al-choiceLine':item.addClass}" v-for="(item,key) in popParam.popSecList"
                                 @click="popSecListClick(key,item.refRename)"
                                 :key="key" class="al-twoFloorSecondFilterItem" :refId="item.refId">
                            <span>{{item.refRename}}</span>
                        </article>
                    </section>
                </section>
            </section>
            <!--弹层二级筛选列表结束-->
        </section>
    </section>
</template>
<script>
    /**
     * 功能描述： 按专业、按疾病、按类型、按术式 四种筛选的弹层
     * 使用方法: <组件名 :pop-param="popParam" @param-change="paramChange"></组件名>
     *           data(){
     *              return{
     *                  popParam: {
                            topTabFlag: false,//顶部切换tab,弹层是否显示
                            popFirList: [],//弹层筛选项一级菜单数据
                            popSecList: [],//弹层筛选项二级菜单数据
                            nowFirIndex: 0,//一级筛选菜单点击索引判断
                        },
     *              }
     *          }
     * 注意事件： :pop-param="popParam"在接口中处理数据，传递给popParam再传递给子组件，
     *
     *            @param-change="paramChange"，监听子组件中的操作，并返还给父组件的函数
     *
     * 引入来源：
     * 作用：
     * Created by HJ on 2017/11/30.
     */
    import comm from 'static/js/comm.js'
    export default {
        props:['popParam'],
        data(){
            return{
                tagId:comm.getpara().tId?comm.getpara().tId:0,
            }
        },
        methods:{
            //一级菜单点击事件，更改索引
            popFirListClick(index) {
                let t = this;
                if(parseInt(index)!==parseInt(t.popParam.nowFirIndex)){
                    t.popParam.nowFirIndex = index;
                    t.popParam.popSecList = t.popParam.popFirList[t.popParam.nowFirIndex].childrenList;
                }
            },
            //重置除了二级选中项意外的结构
            resetData() {
                let t = this;
                for (let i = 0; i < t.popParam.popFirList.length; i++) {
                    if(i!==t.popParam.nowFirIndex){
                        for (let j = 0; j < t.popParam.popFirList[i].childrenList.length; j++) {
                            t.popParam.popFirList[i].childrenList[j].nowSecIndex = -1;
                        }
                    }
                }
            },
            //二级菜单的点击事件
            popSecListClick(index,kv) {
                let t = this;
                t.resetData();
                for (let i = 0; i < t.popParam.popFirList[t.popParam.nowFirIndex].childrenList.length; i++) {
                    t.popParam.popFirList[t.popParam.nowFirIndex].childrenList[i].nowSecIndex = index;
                }
                t.tagId = t.popParam.popFirList[t.popParam.nowFirIndex].childrenList[index].refId;//重新点击筛选赋值
                t.popParam.topTabFlag = false;
                let param={
                    tagId:t.tagId,
                    topTabFlag:t.popParam.topTabFlag
                };
                t.$emit('param-change',param);
                comm.creatEvent({
                    triggerType:'按专业-筛选',
                    keyword:kv,
                    actionId:50
                });
            }
        }
    }
</script>
