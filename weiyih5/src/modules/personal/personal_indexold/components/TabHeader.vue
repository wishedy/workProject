<template>
    <nav class="al-personalNavbar" data-alcode-mod='463'>
        <router-link tag="figure" class="al-personNavbarItem" active-class="active" to="/index" replace>
            <img class="showOff" src="//img50.allinmd.cn/pages/personal/index_off.png" alt="">
            <img class="showOn" src="//img50.allinmd.cn/pages/personal/index_on.png" alt="">
            <figcaption>主页</figcaption>
        </router-link>
        <router-link tag="figure" class="al-personNavbarItem" active-class="active" to="/contribution" replace>
            <img class="showOff" src="//img50.allinmd.cn/pages/personal/contribution_off.png" alt="">
            <img class="showOn" src="//img50.allinmd.cn/pages/personal/contribution_on.png" alt="">
            <figcaption>贡献</figcaption>
        </router-link>
        <router-link tag="figure" class="al-personNavbarItem" active-class="active" to="/active" replace>
            <img class="showOff" src="//img50.allinmd.cn/pages/personal/active_off.png" alt="">
            <img class="showOn" src="//img50.allinmd.cn/pages/personal/active_on.png" alt="">
            <figcaption>动态</figcaption>
        </router-link>
        <router-link tag="figure" class="al-personNavbarItem" active-class="active" to="/info" replace>
            <img class="showOff" src="//img50.allinmd.cn/pages/personal/intro_off.png" alt="">
            <img class="showOn" src="//img50.allinmd.cn/pages/personal/intro_on.png" alt="">
            <figcaption>个人资料</figcaption>
        </router-link>
    </nav>
</template>

<script>
  export default {}
</script>