<template>
    <section class="al-typeFilterMainMask" :class="{'active':popParam.topTabFlag&&popParam.indexPop==0}" data-role="filter">
        <section class="al-twoFloorFilter" data-alcode-mod='403'>
            <section class="al-twoFloorFirstFilter" data-alcode-sm="left" data-alcode-item-selector="article">
                <article :class="{'selected':key===popParam.nowFirIndex}" v-for="(item,key) in popParam.popFirList"
                         @click="popFirListClick(key)" :key="key" class="al-twoFloorFirstFilterItem" :refId="item.refId">
                            {{item.refRename}}
                </article>
            </section>
            <section class="al-twoFloorSecondFilter" data-alcode-sm="right" data-alcode-item-selector="article">
                <section class="al-twoFloorSecondFilterBox" v-for="(val,key) in popParam.popFirList"
                         :class="{'selected':key===popParam.nowFirIndex}" :key="key">
                    <p class="al-twoFloorSecondFilterItem" v-for="(item2,key) in val.childrenList"
                       :class="{'active':(tagId&&parseInt(tagId)!==0)?parseInt(tagId)===parseInt(item2.refSecondType):key===item2.nowSecIndex}" @click="popSecListClick(key)" :key="key">{{item2.refRename}}</p>
                </section>
            </section>
        </section>
    </section>
</template>
<script>
    /**
     * 功能描述：按类型筛选的弹层
     * 使用方法: <组件名 :pop-param="popParam" @param-change="paramChange"></组件名>
     *           data(){
     *              return{
     *                  popParam: {
                            indexPop: 0,
                            topTabFlag: false,//顶部切换tab,弹层是否显示
                            popFirList: [],//弹层筛选项一级菜单数据
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
     * Created by HJ on 2017/12/4.
     */
    export default {
        props:['popParam'],
        data(){
            return{
                tagId:comm.getpara().sType?comm.getpara().sType:0,
                refType:1,
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
            popSecListClick(index) {
                let t = this;
                t.resetData();
                for (let i = 0; i < t.popParam.popFirList[t.popParam.nowFirIndex].childrenList.length; i++) {
                    t.popParam.popFirList[t.popParam.nowFirIndex].childrenList[i].nowSecIndex = index;
                }
                t.tagId = t.popParam.popFirList[t.popParam.nowFirIndex].childrenList[index].refSecondType;//二级点击的类型
                t.refType = t.popParam.popFirList[t.popParam.nowFirIndex].childrenList[index].refType;//一级的类型
                t.popParam.topTabFlag = false;
                let param={
                    tagId:t.tagId,
                    topTabFlag:t.popParam.topTabFlag,
                    refType:t.refType,
                };
                t.$emit('param-change',param);
            }
        }
    }
</script>
