<template>
	<article class="al-searchResultItem">
		<a :href="xhref">
			{{tag.name}}
			<i class="icon-arrowRight"></i>
		</a>
	</article>

</template>
<style>
	.al-searchResultItem{
		margin-left:0;
		padding-left:0.4rem;
	}
	.al-searchResultItem a{
		display:block;
	}
	.icon-arrowRight:after {
		content: "";
		display: inline-block;
		width: 0.18667rem;
		height: 0.34667rem;
		background: url("//img50.allinmd.cn/pages/personal/arrow_right.png") center center no-repeat;
		background-size: 100% 100%;
		vertical-align: middle;
		margin-left: 0.21333rem;
	}
</style>
<script>
	export default{
		data(){
			return {}
		},
		computed:{
			xhref(){
				return "/dist/discover/discover_tagSubject.html?tId="+this.tag.id;
			}
		},
		props:['tag']
	}
</script>