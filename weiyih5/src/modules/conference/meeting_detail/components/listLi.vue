<template>
	<div class="listLi">
		<div class="scheduleContDate" >
			<div class="scheduleTime"></div>
			<div class="scheduleTitle">{{obj.key}}</div>
		</div>
		<lecture v-for="(item,key) in obj.value" :item="item" :key="key"></lecture>
	</div>
</template>

<script>
	import lecture from './lecture.vue';
	export default {
		name: "list-li",
		data(){
			return{

			}
		},
		props:['obj'],
		components:{
			lecture
		}
	}
</script>

<style scoped>

</style>