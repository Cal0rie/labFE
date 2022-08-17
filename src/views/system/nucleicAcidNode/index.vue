<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
    >
      <el-form-item label="核酸节点名称" prop="nucleicAcidNodeName">
        <el-input
          v-model="queryParams.nucleicAcidNodeName"
          placeholder="请输入核酸节点名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="核酸节点天数" prop="nucleicAcidNodeDays">
        <el-input
          v-model="queryParams.nucleicAcidNodeDays"
          placeholder="节点天数用“逗号”分割"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="创建者" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <!-- <el-date-picker
          clearable
          size="small"
          v-model="createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间"
        >
        </el-date-picker> -->
        <el-date-picker
					@keyup.enter.native="handleQuery"
          v-model="createTime"
          size="small"
          style="width: 280px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="是否在用" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb15" type="flex" justify="end">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
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
          v-hasPermi="['system:nucleicAcidNode:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:nucleicAcidNode:edit']"
          >修改</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:nucleicAcidNode:remove']"
          >删除</el-button
        >
      </el-col>
    </el-row>
    <el-table
      border
      v-loading="loading"
      :data="nucleicAcidNodeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        type="index"
        label="序号"
        fixed
        align="center"
        width="50"
      />
      <el-table-column
        label="核酸节点名称"
        align="center"
        prop="nucleicAcidNodeName"
      />
      <el-table-column
        label="核酸节点"
        align="center"
        prop="nucleicAcidNodeDays"
      />
      <el-table-column
        label="创建者"
        align="center"
        prop="createBy"
      />
      <el-table-column
        label="创建时间"
        width="160"
        align="center"
        prop="createTime"
      />
      <el-table-column
        label="备注"
        width="160"
        show-overflow-tooltip
        align="center"
        prop="remark"
      />
      <el-table-column label="是否在用"  width="100" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_normal_disable"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleEnable(scope.row)"
            v-hasPermi="['system:nucleicAcidNode:enabled']"
            >启用</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-pause"
            @click="handleDisabled(scope.row)"
            v-hasPermi="['system:nucleicAcidNode:disabled']"
            >禁用</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row, 'info')"
            v-hasPermi="['system:nucleicAcidNode:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:nucleicAcidNode:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:nucleicAcidNode:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改核酸节点管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" :disabled="infoShow ? true : false">
        <el-form-item label="核酸节点名称" prop="nucleicAcidNodeName">
          <el-input
            v-model="form.nucleicAcidNodeName"
            placeholder="请输入核酸节点名称"
          />
        </el-form-item>
        <el-form-item label="核酸节点天数" prop="nucleicAcidNodeDays">
          <template v-for="(item, i) in form.nucleicAcidNodeDays">
            <div :key="i" style="margin:0 0 10px 10px; ">
              <el-row :gutter="20">
                <el-col :span="18" style="padding-left:0;">
                  <el-input v-model="form.nucleicAcidNodeDays[i]" type="number" placeholder="核酸节点天数" oninput="value=value.replace(/\D|^0/g,'')"> 
                      <template slot="prepend">第</template>
                      <template slot="append">天</template>
                  </el-input>
                </el-col>
                <el-col v-if="i == form.nucleicAcidNodeDays.length -1 && !infoShow" :span="4">
                  <div class="action">
                    <i 
                      v-if="i > 0 "
                      title="删除"
                      class="el-icon-remove-outline remove"
                      @click="deleteFormLine(form.nucleicAcidNodeDays, i)"
                    ></i>
                    <i
                      title="增加"
                      class="el-icon-circle-plus-outline add"
                      @click="addFormLine(form.nucleicAcidNodeDays)"
                    ></i>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!infoShow"  type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  listNucleicAcidNode,
  getNucleicAcidNode,
  delNucleicAcidNode,
  addNucleicAcidNode,
  updateNucleicAcidNode,
  nucleicAcidNodeEnable,
  nucleicAcidNodeDisabled
} from "@/api/system/nucleicAcidNode";

export default {
  name: "NucleicAcidNode",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 核酸节点管理表格数据
      nucleicAcidNodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nucleicAcidNodeName: null,
        nucleicAcidNodeDays: null,
        status: null,
        createBy: null,
      },
      createTime: [],
      // 表单参数
      form: {
        id: null,
        nucleicAcidNodeName: null,
        nucleicAcidNodeDays:[1],
        remark:''
      },
      // 表单校验
      rules: {
        nucleicAcidNodeName: [
          { required: true, message: "核酸节点名称不能为空", trigger: "blur" }
        ],
        // nucleicAcidNodeDays: [
        //   { required: true, message: "核酸节点天数[逗号分割]不能为空", trigger: "blur" }
        // ],
      },
      // 判断修改 详情
      infoShow: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询核酸节点管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.createTime && "" != this.createTime) {
        this.queryParams.params["beginCreateTime"] = this.createTime[0];
        this.queryParams.params["endCreateTime"] = this.createTime[1];
      }
      listNucleicAcidNode(this.queryParams).then(response => {
        this.nucleicAcidNodeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 启用
    handleEnable(row) {
       const id = row.id;
      nucleicAcidNodeEnable(id).then(response => {
        if (response.code == 200) {
           this.$modal.msgSuccess("启用成功");
           this.getList();
        }
      });
    },
    // 禁用
    handleDisabled(row) {
      const id = row.id;
      nucleicAcidNodeDisabled(id).then(response => {
        if (response.code == 200) {
          this.$modal.msgSuccess("已禁用");
          this.getList();
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        nucleicAcidNodeDays:[1],
        nucleicAcidNodeName: null,
        remark: ''
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.createTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加核酸节点";
    },
    /** 修改按钮操作 */
    handleUpdate(row, flag) {
      if (flag) { // 判断是否是查看详情
        this.infoShow = true;
      } else {
        this.infoShow = false;
      }
      this.reset();
      const id = row.id || this.ids
      getNucleicAcidNode(id).then(response => {
        let newFormData = '';
        if (response.data && response.data.nucleicAcidNodeDays) {
            newFormData = Object.assign({},response.data);
            newFormData.nucleicAcidNodeDays = newFormData.nucleicAcidNodeDays.split(',');
        }
        this.form = newFormData;
        this.open = true;
        this.title = "修改核酸节点";
      });
    },
    // 点击添加form表单项
    addFormLine(obj) {
      obj.push('1');
    },
    // 点击删除form表单项
    deleteFormLine(obj,i) {
      obj.splice(i, 1);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let newForm = Object.assign({},this.form);
           newForm.nucleicAcidNodeDays = newForm.nucleicAcidNodeDays.toString();
          if (this.form.id != null) {
            updateNucleicAcidNode(newForm).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNucleicAcidNode(newForm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除？').then(function() {
        return delNucleicAcidNode(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/nucleicAcidNode/export', {
        ...this.queryParams
      }, `nucleicAcidNode_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="less" scoped>
.mb15 {
  margin-bottom: 15px;
}
.app-container {
  /deep/ .el-form-item {
    margin-bottom: 12px;
  }
}
/deep/ .shot-line {
  .el-form-item__label {
    min-height: 36px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1.2;
  }

  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
.action {
    i {
      // display: none;
      font-size: 16px;
      cursor: pointer;
      &.add {
        color: #47a473;
      }
      &.remove {
        color: #b26768;
        margin-right: 6px;
      }
    }
}
</style>
