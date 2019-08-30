<template>
  <section class="crm-patientsEvaluation-pager">
    <div class="block ev-pages">
      <el-pagination
        class="al-bs-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30,40]"
        :page-size="pageSize"
        align="center"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount" v-if="totalCount!=0">
      </el-pagination>
    </div>
  </section>
</template>
<script>
import axios from 'axios';
import comm from '@/assets/js/utils/comm';
import { createNamespacedHelpers } from 'vuex';
const xhrPath = '/mcall/tocure/patient/score/getMapList/';
const { mapGetters, mapActions } = createNamespacedHelpers('PatientsEvaluation');
export default {
  data() {
    return {
      totalCount: 0
    };
  },
  methods: {
    ...mapActions(['changePageIndex', 'changePageSize', 'saveDataList']),
    handleSizeChange(val) {
      let _this = this;
      _this.changePageSize(val);// 更改公共变量下的pageSize
      _this.getTableList();// 每次pageSize发生变化的时候需要重新获取列表
    },
    handleCurrentChange(val) {
      let _this = this;
      _this.changePageIndex(val);// 更改公共变量下的pageIndex
      _this.getTableList();// 每次pageIndex发生变化的时候需要重新获取列表
    },
    getTableList() {
      let _isthis = this;
      comm.openLoading('加载中...');
      axios({
        method: 'get',
        url: xhrPath,
        params: _isthis.getListForm
      }).then((res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.data_list && res.data.responseObject.responseData.data_list.length > 0) { // 请求到数据
          _isthis.saveDataList(res.data.responseObject.responseData.data_list);
        }
        else {
          // 没有请求到数据
          _isthis.saveDataList([]);
        }
        _isthis.totalCount = res.data.responseObject.responseData.total_count;
        comm.closeLoading();
      }).catch((e) => {
        comm.closeLoading();
        console.log('获取数据失败：', e);
      });
    }
  },
  computed: {
    ...mapGetters(['pageIndex', 'pageSize', 'triggerGetList', 'getListForm', 'sortType'])
  },
  watch: {
    sortType() {
      let _this = this;
      _this.getTableList();
    },
    triggerGetList() { // 触发state下的triggerGetList变量时主动请求列表数据
      let _this = this;
      _this.getTableList();
    }
  },
  mounted() {
    let _this = this;
    _this.getTableList();
  }
};
</script>
