<template>
  <div class="edit-modal">
    <el-dialog :title="titleText" :visible.sync="show" :width="width" center append-to-body :before-close="cancel" custom-class="zIndex">
			<slot></slot>
			<template #footer>
				<span class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
				</span>
			</template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "editModal",
  props: {
		// 显示
		show: {
			type: Boolean,
			default: false,
		},
		// 标题
		titleText: {
			type: String,
			default: '标题',
		},
		// 弹窗宽度
		width: {
			type: String,
			default: '500px',
		},
  },
  data() {
    return {
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: true,
      dialogTableVisible:true
    };
  },
  created() {},
  methods: {
		// 取消按钮
    cancel() {
     this.$emit('popUpClosed')
    },
    /** 提交按钮 */
    submitForm() {
     this.$emit('submitClick');
    },

  }
};
</script>
<style scoped>
	/* /deep/ .el-dialog.zIndex {
		z-index: 888 !important;
	} */
</style>
