<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="巡检人" prop="patrolUser">
        <el-input
          v-model="queryParams.patrolUser"
          placeholder="请输入巡检人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="巡检计划" prop="patrolPlan">
        <el-input
          v-model="queryParams.patrolPlan"
          placeholder="请输入巡检计划"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="巡检时间" prop="patrolTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.patrolTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择巡检时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="巡检结果" prop="patrolResult">
        <el-input
          v-model="queryParams.patrolResult"
          placeholder="请输入巡检结果"
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
          v-hasPermi="['bussiness:patrol:add']"
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
          v-hasPermi="['bussiness:patrol:edit']"
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
          v-hasPermi="['bussiness:patrol:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bussiness:patrol:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="patrolList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="巡检人" align="center" prop="patrolUser" />
      <el-table-column label="巡检计划" align="center" prop="patrolPlan" />
      <el-table-column label="巡检时间" align="center" prop="patrolTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.patrolTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检执行状态" align="center" prop="patrolStatus" :formatter="stateFormat" />
      <el-table-column label="巡检结果" align="center" prop="patrolResult" />
<!--      <el-table-column prop="patrolContent" label="巡检内容" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <div v-html="scope.row.patrolContent"></div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bussiness:patrol:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bussiness:patrol:remove']"
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

    <!-- 添加或修改巡检管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="巡检人" prop="patrolUser">
          <el-input v-model="form.patrolUser" placeholder="请输入巡检人" />
        </el-form-item>
        <el-form-item label="巡检计划" prop="patrolPlan">
          <el-input v-model="form.patrolPlan" placeholder="请输入巡检计划" />
        </el-form-item>
        <el-form-item label="巡检时间" prop="patrolTime">
          <el-date-picker clearable size="small"
            v-model="form.patrolTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择巡检时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="巡检结果" prop="patrolResult">
          <el-input v-model="form.patrolResult" placeholder="请输入巡检结果" />
        </el-form-item>
        <el-form-item label="巡检内容">
          <editor v-model="form.patrolContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listPatrol, getPatrol, delPatrol, addPatrol, updatePatrol } from "@/api/bussiness/patrol";

export default {
  name: "Patrol",
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
      // 巡检管理表格数据
      patrolList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patrolUser: null,
        patrolPlan: null,
        patrolTime: null,
        patrolStatus: null,
        patrolResult: null,
        patrolContent: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        patrolUser: [
          { required: true, message: "巡检人不能为空", trigger: "blur" }
        ],
        patrolPlan: [
          { required: true, message: "巡检计划不能为空", trigger: "blur" }
        ],
        patrolStatus: [
          { required: true, message: "巡检执行状态不能为空", trigger: "blur" }
        ],
        patrolResult: [
          { required: true, message: "巡检结果不能为空", trigger: "blur" }
        ],
        patrolContent: [
          { required: true, message: "巡检内容不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询巡检管理列表 */
    getList() {
      this.loading = true;
      listPatrol(this.queryParams).then(response => {
        this.patrolList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //巡检执行状态(0、未巡检 1、已巡检未异常 2、已巡检有异常)
    stateFormat(row, column) {
      console.log(row.patrolStatus)
      if (row.patrolStatus === '0') {
        return '未巡检'
      } else if (row.patrolStatus === '1') {
        return '已巡检未异常'
      } else if (row.patrolStatus === '2') {
        return '已巡检有异常'
      }
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
        patrolUser: null,
        patrolPlan: null,
        patrolTime: null,
        patrolStatus: "0",
        patrolResult: null,
        patrolContent: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
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
      this.title = "添加巡检管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPatrol(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改巡检管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePatrol(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPatrol(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除巡检管理编号为"' + ids + '"的数据项？').then(function() {
        return delPatrol(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bussiness/patrol/export', {
        ...this.queryParams
      }, `patrol_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
