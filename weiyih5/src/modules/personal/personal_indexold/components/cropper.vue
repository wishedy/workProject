<template>
	<div class="wrapper">
		<div class="content">
			<div class="show-info">
				<div class="test">
					<vueCropper
						ref="cropper2"
						:img="example2.img"
						:outputSize="example2.size"
						:outputType="example2.outputType"
						:info="example2.info"
						:canScale="example2.canScale"
						:autoCrop="example2.autoCrop"
						:autoCropWidth="example2.autoCropWidth"
						:autoCropHeight="example2.autoCropHeight"
						:fixed="example2.fixed"
						:fixedNumber="example2.fixedNumber"
					></vueCropper>
				</div>
				<button  class="btn" @click="sureBtn">确定</button>
				<button  class="btn" @click="cancleBtn">取消</button>
			</div>
		</div>
	</div>
</template>

<script>
import vueCropper from 'vue-cropper'

export default {
  data: function () {
    return {
		example2: {
				img: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg',
				info: true,
				size: 1,
				outputType: 'jpeg',
				canScale: true,
				autoCrop: true,
				// 只有自动截图开启 宽度高度才生效
				autoCropWidth: 300,
				autoCropHeight: 250,
				fixed: true,
				fixedNumber: [4, 3]
			},
    }
  },
	components: {
		vueCropper,
	},
	methods:{
        sureBtn(){
          this.$store.state.showCropper=false;
	    },
        cancleBtn(){
            this.$store.state.showCropper=false;
		}
	}

}
</script>

<style lang="scss" rel="stylesheet/scss">
	@import 'scss/modules/utilities/_utilities.scss';
  * {
	  margin: 0;
		padding: 0;
	}
	.wrapper{
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 7;
		top:0;
		bottom: 0;
	}
	.content {
		margin: auto;
		max-width: 100%;
		margin-bottom: rem(100px);
		height: 100%;
		background: #fff;
	}

	.show-info {
		margin-bottom: rem(50px);
	}

	.show-info h2 {
		line-height: rem(50px);
	}

	.btn {
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		/*background: #fff;*/
		/*border: 1px solid #c0ccda;*/
		/*color: #1f2d3d;*/
		text-align: center;
		box-sizing: border-box;
		outline: none;
		margin:rem(40px) rem(20px) 0px 0px;
		padding: rem(18px) rem(30px);
		font-size: rem(28px);
		border-radius: rem(8px);
		color: #fff;
		background-color: #50bfff;
		border-color: #50bfff;
		transition: all .2s ease;
		text-decoration: none;
		user-select: none;
	}

	.test {
	  height: rem(1000px);
	}


	@keyframes slide {
    0%  {
      background-position: 0 0;
    }
    100% {
      background-position: -100% 0;
    }
  }

</style>
