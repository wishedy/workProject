+ version.md 记录版本得带信息，手写，每次上线钱编辑一次，对应修改main.js，第二七行window.version的版本对应修改
+ vue迭代的相应版本在static下的js下的comm.js
+ git release分支，jekins构建的即是该分支，提供单一分支快速上线使用。
### 在js逻辑中调用原生app授权，主要是针对登录和认证
```javascript
//当在app中需要登录或认证等授权时，需要调用app提供的权限方法
appjs&&appjs.joinAuthority(JSON.stringify(
                    {
                        callback:"回调函数名字",//函数名字,
                        operateId:'操作id',//1002
                    }
                ));
//其中operateId为操作相应的id,需要视每次业务场景，开发之间商定好，
//callback是函数在授权结束时候的回调函数该函数名可以根据需要自己定，回调会传入一个option参数
/*
* option:{cState":-1,"cRole":5,"type":0,"cid":"1558684602529"}
* 回调参数分别是用户的认证状态，用户角色，操作结果类型，用的的customerId
* */
                if(option.type==0){
                    //console.log("失败或者操作中途结束的时候调用，可以理解为失败后调用");
                }else if(option.type==1){
                   // console.log('只有授权成功的时候调用');
                }
```
### 在js逻辑中调用原生app，获取用户customerId的方法
appjs.getAuthorCustomerId();
### 活动专题页同步内嵌app主动调用登录方法
//在逻辑初始化，主动调用comm.loginApp();//同步执行，
//如果用户在app已经登录，通过该方法能保证H5也在登录场景下
### 骨架屏 骨架屏相关的引用
 - scss的引用已经在base代码中引用了改scss模块skeleton.scss因此每个页面不需要再引用样式文件，除非没有引入过base.css
 - jquery页面的引入
```html
<!--jquery页面骨架屏html内容-->
<script>
  /*jquery页面需要在页面初始化的时候加入以下元素，在最终逻辑不需要的时候执行一个*/
  common.skeleton.remove();
</script>
<!--jquery页面需要在页面初始化的时候加入以下元素，在最终逻辑不需要的时候执行一个common.skeleton.remove();即可-->
<section class="al-skeleton-container">
        <section class="al-skeleton-banner"></section>
        <section class="al-skeletonTab-list">
            <section class="al-skeletonTab-item"></section>
            <section class="al-skeletonTab-item"></section>
            <section class="al-skeletonTab-item"></section>
            <section class="al-skeletonTab-item"></section>
        </section>
        <section class="al-skeletonContent">
            <section class="al-skeletonContent-section">
                <section class="al-skeletonContent-title">
                    <div class="icon"></div>
                    <div class="title"></div>
                </section>
                <section class="al-skeletonContent-center">
                    <section class="des">
                        <div class="content-name">

                        </div>
                        <div class="author-info">
                            <div class="author">
                                <span class="author-name"></span>
                            </div>
                            <div class="author reviewNum">
                                <span class="author-name"></span>
                            </div>
                        </div>
                    </section>
                    <section class="al-skeletonContent-contentImgBox"></section>
                </section>
            </section>
            <section class="al-skeletonContent-section noImage">
                <section class="al-skeletonContent-center">
                    <section class="des word">
                        <div class="content-name">

                        </div>
                        <div class="content-word"></div>
                        <div class="author-info">
                            <div class="author">
                                <span class="author-name"></span>
                            </div>
                            <div class="author reviewNum">
                                <span class="author-name"></span>
                            </div>
                        </div>
                    </section>
                </section>
            </section>
            <section class="al-skeletonContent-section">
                <section class="al-skeletonContent-title">
                    <div class="icon"></div>
                    <div class="title"></div>
                </section>
                <section class="al-skeletonContent-center">
                    <section class="al-skeletonContent-contentImgBox"></section>
                    <section class="des">
                        <div class="content-name content-name-right">
                        </div>
                        <div class="content-word"></div>
                        <div class="author-info">
                            <div class="author">
                                <span class="author-name"></span>
                            </div>
                            <div class="author reviewNum">
                                <span class="author-name"></span>
                            </div>
                        </div>
                    </section>
                </section>
            </section>
        </section>
    </section>
```
 - vue页面的引入
```html
<!--只需要在页面初始化的时候引入Skeleton.vue组件即可-->
import Skeleton from "components/Skeleton/Skeleton.vue";
<!--初始化components后使用-->
<Skeleton></Skeleton>
<!--组件最终如果在逻辑上不需要刻意，根据vue逻辑执行v-show和v-if渲染-->
```
