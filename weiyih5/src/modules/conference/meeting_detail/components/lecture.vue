<template>
	<div class="scheduleCont">
		<div class="scheduleTime">{{item.startTime?item.startTime.substring(item.startTime.indexOf(' '), item.startTime.length).substring(0, 6):""}}</div>
		<div class="scheduleTitle" @click.stop="jumpUrl(item.videoUrl)">
			<p :class="{gray:item.videoUrl==''}">{{item.conName}}
				<i :class="{active:true,noVideoShow:item.videoUrl==''}"></i>
			</p>
			<p>主讲人：{{item.lecturer}}</p>
		</div>
	</div>
</template>

<script>
	export default {
		props:['item'],
		methods:{
            jumpUrl:function (url) {
				if(url!=''){
                    g_sps.jump(null,'/html/m'+url);
				}
            }
		}
	}
</script>

<style scoped>

</style>