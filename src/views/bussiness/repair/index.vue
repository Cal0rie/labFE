<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="168px">
      
      <el-form-item label="报修人" prop="applyUser">
        <el-input
          v-model="queryParams.applyUser"
          placeholder="请输入报修人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系号码" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入联系号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="处理结果" prop="handleResult">
        <el-input
          v-model="queryParams.handleResult"
          placeholder="请输入处理结果"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="验收结果" prop="checkResult">
        <el-input
          v-model="queryParams.checkResult"
          placeholder="请输入验收结果"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报修时间" prop="applyTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.applyTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择报修时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="执行时间" prop="executeTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.executeTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择执行时间">
        </el-date-picker>
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
          v-hasPermi="['bussiness:repair:add']"
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
          v-hasPermi="['bussiness:repair:edit']"
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
          v-hasPermi="['bussiness:repair:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bussiness:repair:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="repairList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id"  width="40"/>
      <el-table-column label="设备编号" align="center" prop="orderAllotuser" />
      <el-table-column label="设备名称" align="center" prop="applyDeptName" />
      <el-table-column label="报修人" align="center" prop="applyUser" />
      <el-table-column label="联系电话" align="center" prop="orderNum" />
    
      <el-table-column label="处理结果" align="center" prop="handleResult" />
      <el-table-column label="验收结果" align="center" prop="checkResult" />
      <el-table-column label="报修时间" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" prop="executeTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.executeTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bussiness:repair:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bussiness:repair:remove']"
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

    <!-- 添加或修改报修管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        
        <el-form-item label="设备名称" prop="applyUser">
          <el-select v-model="form.applyDeptName"  @change="changenewClass" placeholder="请选择报修设备">
             <el-option
              v-for="item in EquipmentOptions"
              :key="item.equipmentName"
              :label="item.equipmentName"
              :value="item.equipmentName">
             </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编号" prop="orderAllotuser">
          <el-input v-model="form.orderAllotuser" placeholder="请输入设备编号" readonly />
        </el-form-item>
        <el-form-item label="报修人" prop="applyUser">
          <el-input v-model="form.applyUser" placeholder="请输入报修人" />
        </el-form-item>
        <el-form-item label="联系号码" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入联系号码" />
        </el-form-item>
       
        <el-form-item label="处理结果" prop="handleResult">
          <el-input v-model="form.handleResult" placeholder="请输入处理结果" />
        </el-form-item>
        <el-form-item label="验收结果" prop="checkResult">
          <el-input v-model="form.checkResult" placeholder="请输入验收结果" />
        </el-form-item>
        <el-form-item label="报修时间" prop="applyTime">
          <el-date-picker clearable size="small"
            v-model="form.applyTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择报修时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行时间" prop="executeTime">
          <el-date-picker clearable size="small"
            v-model="form.executeTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择执行时间">
          </el-date-picker>
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
import { listRepair, getRepair, delRepair, addRepair, updateRepair,getEquipmentlist } from "@/api/bussiness/repair";

export default {
  name: "Repair",
  data() {
    return {
      readonly: true,
      EquipmentOptions: "",
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
      // 报修管理表格数据
      repairList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        applyDeptName: null,
        applyUser: null,
        orderNum: null,
        orderAllotuser: null,
        orderExecutor: null,
        handleResult: null,
        checkResult: null,
        applyTime: null,
        executeTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        applyDeptName: [
          { required: true, message: "报修部门不能为空", trigger: "blur" }
        ],
        applyUser: [
          { required: true, message: "报修人不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "工单编号不能为空", trigger: "blur" }
        ],
        orderAllotuser: [
          { required: true, message: "工单分配人不能为空", trigger: "blur" }
        ],
        orderExecutor: [
          { required: true, message: "工单执行人不能为空", trigger: "blur" }
        ],
        applyTime: [
          { required: true, message: "报修时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getEquipmentlistVent();
  },
  methods: {
    getEquipmentlistVent(){
      getEquipmentlist().then(response => {
        debugger
        this.EquipmentOptions = response.equipmentlist;
      });
    },

    /** 查询报修管理列表 */
    getList() {
      this.loading = true;
      listRepair(this.queryParams).then(response => {
        this.repairList = response.rows;
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
        id: null,
        applyDeptName: null,
        applyUser: null,
        orderNum: null,
        orderAllotuser: null,
        orderExecutor: null,
        handleResult: null,
        checkResult: null,
        applyTime: null,
        executeTime: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },

    /** 设备选中事件*/
    changenewClass(){
       let devCode=this.form.applyDeptName;
       let objlist=this.EquipmentOptions;
       for(var i=0;i<objlist.length;i++){
          debugger
          if(devCode== objlist[i].equipmentName){
             this.form.orderAllotuser= objlist[i].id;
             break;
          }
        
       }
       
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
      this.title = "添加报修管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRepair(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报修管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRepair(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRepair(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除报修管理编号为"' + ids + '"的数据项？').then(function() {
        return delRepair(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bussiness/repair/export', {
        ...this.queryParams
      }, `repair_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
