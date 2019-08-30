<template>
  <section class="crm-patientsEvaluation-batch">
    <div class="batch-btn" @click.stop="startBatchControl" v-if="!batchOnOff">
      批量操作

    </div>

    <div class="batch-btn shield"  v-if="batchOnOff" @click.stop="batchAudit({
    type:2
    })">
      批量屏蔽

    </div>
    <div class="batch-btn pass"  v-if="batchOnOff" @click.stop="batchAudit({
    type:1
    })">
      批量通过
    </div>
  </section>
</template>
<script>
import { createNamespacedHelpers } from 'vuex';
const { mapGetters, mapActions } = createNamespacedHelpers('PatientsEvaluation');
export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters(['batchOnOff'])
  },
  methods: {
    ...mapActions(['startBatchControl', 'batchAudit'])
  }
};
</script>
