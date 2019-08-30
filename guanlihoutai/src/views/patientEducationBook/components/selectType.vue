<template>
    <section class="selectBox">
      <section class="selectTypeCon">
        <i class="closeBtn"></i>
        <h3 class="title">选择类型</h3>
        <p class="tips">(确定后无法修改)</p>
        <aside class="selectBtn"><p class="active">分类</p><p>不分类</p></aside>
        <p class="sureBtn active">确认</p>
      </section>
    </section>
</template>

<script>
export default {
  name: 'selectType'
};
</script>

<style scoped>
  /*父层（可共用）*/
  .selectBox{
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    background-color: rgba(0,0,0,0.7);
  }
  /*内容区*/
  .selectTypeCon{
    width:380px;
    height:254px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
  }
  /*关闭按钮（可共用）*/
  .closeBtn{
    position: absolute;
    right: 14px;
    top: 14px;
    width: 20px;
    height: 20px;
    background: url("/static/images/icons/icon-close-gray.png") no-repeat;
    background-size:contain;
    cursor: pointer;
  }
  /*标题（可共用）*/
  h3.title{
    font-size:20px;
    font-weight:600;
    color:rgba(34,34,34,1);
    line-height:20px;
    margin-top: 35px;
    text-align: center;
  }
  /*标题下提示*/
  p.tips{
    font-size:15px;
    font-weight:400;
    color:rgba(85,85,85,1);
    line-height:15px;
    margin-top: 8px;
    text-align: center;
  }
  /*分类不分类按钮*/
  .selectBtn{
    margin-top: 35px;
    margin-left: 65px;
  }
  .selectBtn p{
    display: inline-block;
    vertical-align: middle;
    width:110px;
    height:34px;
    border-radius:4px;
    border:1px solid rgba(161,168,192,1);
    font-size:14px;
    font-weight:400;
    color:rgba(104,109,125,1);
    line-height:34px;
    text-align: center;
    box-sizing: border-box;
    margin-right: 30px;
    cursor: pointer;
  }
  .selectBtn p:active, .selectBtn p:hover,.selectBtn p.active{
    border:none;
    background:rgba(75,103,214,1);
    font-weight:500;
    color:rgba(255,255,255,1);
}
  /*确定按钮（可共用）*/
  .sureBtn{
    height: 49px;
    width:100%;
    background:rgba(236,238,242,1);
    font-size:17px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:49px;
    text-align: center;
    position: absolute;
    bottom: 0;
    cursor: pointer;
  }
  .sureBtn.active{
    background:rgba(75,103,214,1);
  }

</style>
