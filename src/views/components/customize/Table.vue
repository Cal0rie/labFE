<template>
  <div id="detailsTable">
    <slot name="search"></slot>
    <slot></slot>
    <div>
      <el-row
        :gutter="10"
        class="mb15"
        type="flex"
        justify="end"
        :class="readOnly ? 'tableBox' : ''"
      >
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            v-hasPermi="[`basic:${permission}:query`]"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="[`basic:${permission}:add`]"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="[`basic:${permission}:remove`]"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            icon="el-icon-upload2"
            size="mini"
            @click="handleImport"
            v-hasPermi="[`basic:${permission}:importData`]"
            >导入</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="[`basic:${permission}:export`]"
            >导出</el-button
          >
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="newTableData"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'createTime', order: 'descending' }"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" fixed align="center" />
        <template v-for="(item, i) in headerList">
          <!-- 序号单独处理 -->
          <template v-if="item.colName == 'rowNum'">
            <el-table-column
              type="index"
              fixed
              :key="i"
              :label="item.label"
              :prop="item.colName"
              width="60"
              align="center"
            />
            <!-- <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span> -->
          </template>
          <template v-else>
            <el-table-column
              v-if="item.isSelect"
              :key="i"
              :label="
                item.inputType == 'percent' ? `${item.label}(%)` : item.label
              "
              :prop="item.colName"
              :width="labelLength(item.label)"
              sortable
              :show-overflow-tooltip="true"
              align="center"
            >
              <template #default="scope">
                <!-- 值存在 ？ 存在小数点参数 ？存在小数点 ？展示: 处理小数点展示 : 默认展示-->
                <!-- <div v-if="item.inputType == 'percent' || item.inputType == 'double'">
                    {{scope.row[item.colName] ? item.percentPrecision ? /[\.]/.test(scope.row[item.colName]) ? scope.row[item.colName]: scope.row[item.colName] + '.'.padEnd(item.percentPrecision+1, '0') : scope.row[item.colName] : scope.row[item.colName]}}
                  </div>
                  <div v-else>
                    {{scope.row[item.colName]}}
                  </div> -->
                <span
                  v-if="
                    item.inputType == 'percent' || item.inputType == 'double'
                  "
                >
                  {{
                    scope.row[item.colName]
                      ? scope.row[item.colName].toFixed(item.percentPrecision)
                      : scope.row[item.colName]
                  }}
                </span>
                <span v-else>
                  {{ scope.row[item.colName] }}
                </span>
              </template>
            </el-table-column>
          </template>
        </template>
        <el-table-column
          label="操作"
          :min-width="handleMinWitdh"
          align="center"
          fixed="right"
          class-name="small-padding fixed-width"
          :class="readOnly ? 'tableBox' : ''"
        >
          <template #default="scope">
            <slot name="handle" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        :class="readOnly ? 'tableBox' : ''"
      />
    </div>
    <!-- 文件导入弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :data="channelId ? uploadData : {}"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <div
          v-loading="loadWaiting"
          element-loading-text="数据处理中"
          element-loading-background="#fff"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip text-center" slot="tip">
            <span>仅允许导入xls、xlsx格式文件</span>
          </div>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  name: "Table",
  props:{
    // 数据渲染
    tableData: {
      type: Array,
      default:function() {
        return [{
          'id':'000'
        }]
      }
    },
    // 表头文字
    headerList: {
      type: Array,
      default:function() {
        return [{
          label: '编码',
          key: 'id'
        }]
      }
    },
    /* 数据总条数 */
    total: {
      type: Number,
      default: 0,
    },
    /* 数据导入Url */
    uploadUrl: {
      type: String,
      default: '',
    },
    /* 只读 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    // 权限字段
    permission: {
      type: String,
      default:''
    },
    // 按钮最小宽度
    handleMinWitdh: {
      type: Number,
      default: 130
    },
    // 渠道id 文件上传  13 14 15 派单 密接次密接使用
    channelId: {
      type: Number,
      default: null
    },

  },
  data() {
    return {
      uploadData: {
        channelId: this.channelId
      },
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 弹出层标题
      title: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      newTableData:[],
      // 导入
      loadWaiting: false,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + this.uploadUrl
      },
    };
  },
  created() {},
  methods: {
    // 计算表头 label宽度
    labelLength(l) {
      return (l.length+1) * 22 + 22;
    },
    /** 查询资产登记列表 */
    getList() {
      this.$emit('pageGetList', this.queryParams)
    },
    /** 搜索按钮操作 */
    handleQuery(index, row) {
       this.$emit('Search',row)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$emit('resetForm')
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
      this.$emit('selectionChange', this.ids)
    },

    /** 新增按钮操作 */
    handleAdd(row) {
     this.$emit('Add',row)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$emit('Edit',row)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
       this.$emit('Delete',row)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$emit('Export')
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      if (event.percent >= 99) {
        this.loadWaiting = true;
      }
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.loadWaiting = false;
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true, customClass: "upload-alert-style" }
      );
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "导入";
      this.loadWaiting = false;
      this.upload.open = true;
    },
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        this.newTableData = newVal;
      },
      immediate:true
    }
  },
  computed: {}
};
</script>
<style lang="less" scoped>
#detailsTable {
  .tableBox {
    pointer-events: none;
  }
  .mb15 {
    margin-bottom: 15px;
  }
}
</style>

