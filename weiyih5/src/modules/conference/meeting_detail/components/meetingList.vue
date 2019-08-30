<template>
	<ul data-alcode-mod='631' data-alcode-item-selector=".listName,.scheduleTitle">
		<con-li v-for="(value,key) in metlistData" :kv = 'value' :key="key"></con-li>
	</ul>
</template>

<script>
	/**
	 * 功能描述： 会议列表
	 * 使用方法:
	 * 注意事件：
	 * 引入来源：
	 * 作用：
	 * Created by zhanghonda on 2018/1/15.
	 */
	import conLi from './conLi.vue';
	export default {
		name: "meeting-list",
		props: ['metlistData'],
		components: {
			conLi
		},
	}
</script>

<style scoped>

</style>