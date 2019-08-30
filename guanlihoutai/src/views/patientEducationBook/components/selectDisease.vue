<template>
  <section class="selectBox">
    <section class="selectDiseaseCon">
      <i class="closeBtn"></i>
      <h3 class="title">选择疾病阶段</h3>
      <ul class="diseaseList">
        <li v-for="(item,i) in disArrList" v-bind:key="i">{{item.illnessStateName}}</li>
      </ul>
      <p class="sureBtn active">确认</p>
    </section>
  </section>
</template>

<script>
export default {
  name: 'selectMajor',
  data() {
    return {
      disArrList: [
        {
          'illnessState': '1',
          'illnessStateName': '疾病科普'
        },
        {
          'illnessState': '2',
          'illnessStateName': '疾病自查'
        },
        {
          'illnessState': '3',
          'illnessStateName': '保守治疗'
        },
        {
          'illnessState': '4',
          'illnessStateName': '手术前'
        },
        {
          'illnessState': '5',
          'illnessStateName': '手术中'
        },
        {
          'illnessState': '6',
          'illnessStateName': '手术后'
        },
        {
          'illnessState': '7',
          'illnessStateName': '疾病康复'
        }
      ]
    };
  }
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
  .selectDiseaseCon{
    width:445px;
    min-height:254px;
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
  /*疾病列表*/
  .diseaseList{
    padding:28px 0 59px 30px;
  }
  .diseaseList li {
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    width: 85px;
    height: 30px;
    box-sizing: border-box;
    border-radius: 3px;
    border: 1px solid rgba(161, 168, 192, 1);
    margin: 15px 15px 0 0;
    text-align: center;
    line-height: 30px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(104, 109, 125, 1);
  }
  .diseaseList li.active,.diseaseList li:hover,.diseaseList li:active{
    background:rgba(75,103,214,1);
    border: none;
    font-weight:500;
    color:rgba(255,255,255,1);
  }
</style>
