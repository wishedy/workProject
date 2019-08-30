<template>
    <section class="selectBox">
      <section class="selectMajorCon">
        <i class="closeBtn"></i>
        <h3 class="title">选择专业</h3>
        <ul class="majorList">
          <li v-for="(item,i) in majorArrList" v-bind:key="i">{{item.labelName}}</li>
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
      majorArrList: [{
        'id': 1,
        'createTime': '2018-06-13 17:10:21.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': 'eqeq',
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524556',
        'labelName': '小儿骨科',
        'isValid': 1,
        'labelId': 1527645524556
      },
      {
        'id': 2,
        'createTime': '2018-06-13 17:28:04.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': 'xzsfasfasfaswfe',
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524557',
        'labelName': '脊柱',
        'isValid': 1,
        'labelId': 1527645524557
      },
      {
        'id': 3,
        'createTime': '2018-06-13 21:35:27.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': 'werwe',
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524558',
        'labelName': '骨肿瘤',
        'isValid': 1,
        'labelId': 1527645524558
      },
      {
        'id': 4,
        'createTime': '2018-06-13 21:35:33.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': 'werwet4t',
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524559',
        'labelName': '康复',
        'isValid': 1,
        'labelId': 1527645524559
      },
      {
        'id': 5,
        'createTime': '2018-06-13 21:35:38.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': '4t3t34',
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524560',
        'labelName': '中西药',
        'isValid': 1,
        'labelId': 1527645524560
      },
      {
        'id': 6,
        'createTime': '2018-06-13 21:35:42.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': '创伤',
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524561',
        'labelName': '创伤',
        'isValid': 1,
        'labelId': 1527645524561
      },
      {
        'id': 7,
        'createTime': '2018-06-13 21:35:46.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': '关节',
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524562',
        'labelName': '关节',
        'isValid': 1,
        'labelId': 1527645524562
      },
      {
        'id': 8,
        'createTime': '2018-06-14 10:17:26.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': {},
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524563',
        'labelName': '足踝',
        'isValid': 1,
        'labelId': 1527645524563
      },
      {
        'id': 9,
        'createTime': '2018-06-14 10:17:27.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': {},
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524564',
        'labelName': '手外',
        'isValid': 1,
        'labelId': 1527645524564
      },
      {
        'id': 10,
        'createTime': '2018-06-14 10:17:28.0',
        'parentId': 0,
        'treeLevel': 1,
        'labelDesc': {},
        'labelType': 0,
        'isLeaf': 0,
        'sortId': 0,
        'labelFullPath': '1527645524565',
        'labelName': '运动医学',
        'isValid': 1,
        'labelId': 1527645524565
      }]
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
  .selectMajorCon{
    width:455px;
    min-height:342px;
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
/*专业列表*/
  .majorList{
    padding:28px 0 59px 30px;
  }
  .majorList li {
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
  .majorList li.active,.majorList li:hover,.majorList li:active{
    background:rgba(75,103,214,1);
    border: none;
    font-weight:500;
    color:rgba(255,255,255,1);
  }
</style>
