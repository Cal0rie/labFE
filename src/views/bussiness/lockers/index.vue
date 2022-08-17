<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="168px">
      <el-form-item label="储物柜编号" prop="lockersCode">
        <el-input
          v-model="queryParams.lockersCode"
          placeholder="请输入储物柜编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    
     
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['bussiness:lockers:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['bussiness:lockers:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['bussiness:lockers:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bussiness:lockers:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="lockersList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="储物柜编号" align="center" prop="lockersCode" />
      <el-table-column label="柜体所在位置" align="center" prop="lockersArea" />
      <el-table-column label="柜内设备总数" align="center" prop="lockersCount" />
      <el-table-column label="柜内剩余总数" align="center" prop="lockersSurplus"/>
 
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bussiness:lockers:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bussiness:lockers:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改储物柜管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="储物柜编号" prop="lockersCode">
          <el-input v-model="form.lockersCode" placeholder="请输入储物柜编号" />
        </el-form-item>
        <el-form-item label="储物柜所在位置" prop="lockersArea">
          <el-input v-model="form.lockersArea" placeholder="请输入储物柜所在位置" />
        </el-form-item>
        <el-form-item label="柜内设备总数" prop="lockersCount">
          <el-input v-model="form.lockersCount" placeholder="请输入柜内设备总数" />
        </el-form-item>
        <el-form-item label="柜内剩余数量" prop="lockersSurplus">
          <el-input v-model="form.lockersSurplus" placeholder="请输入柜内剩余数量" />
        </el-form-item>
     
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLockers, getLockers, delLockers, addLockers, updateLockers } from "@/api/bussiness/lockers";

export default {
  name: "Lockers",
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 储物柜表格数据
      lockersList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lockersCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        lockersCode: [
          { required: true, message: "储物柜编号不能为空", trigger: "blur" }
        ],
        lockersArea: [
          { required: true, message: "储物柜位置不能为空", trigger: "blur" }
        ],
        lockersCount: [
          { required: true, message: "储物柜中总数量不能为空", trigger: "blur" }
        ],
        lockersSurplus: [
          { required: true, message: "储物柜中剩余数量不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询储物柜管理列表 */
    getList() {
      this.loading = true;
      listLockers(this.queryParams).then(response => {
        this.lockersList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        lockersCode: null,
        lockersArea: null,
        lockersCount:null,
        lockersSurplus: null
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
      this.title = "添加储物柜";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLockers(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改储物柜";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLockers(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLockers(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除编号为"' + ids + '"的储物柜？').then(function() {
        return delLockers(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bussiness/lockers/export', {
        ...this.queryParams
      }, `lockers_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
