<template>
    <nav class="al-personalNavbar" data-alcode-mod="488">
        <router-link class="al-personNavbarItem" tag="figure" to="/dynamic" active-class="active" replace>
            <figcaption>动态</figcaption>
        </router-link>

        <router-link class="al-personNavbarItem" tag="figure" to="/contribution" active-class="active" replace>
            <figcaption>贡献</figcaption>
        </router-link>

        <router-link class="al-personNavbarItem" tag="figure" to="/baseInfo" active-class="active" replace>
            <figcaption>简介</figcaption>
        </router-link>
    </nav>
</template>

<script>
    export default {}
</script>

<style>

</style>