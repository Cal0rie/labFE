<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="168px">
      <el-form-item label="设备型号" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入设备型号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备借用人" prop="equipmentDept">
        <el-input
          v-model="queryParams.equipmentDept"
          placeholder="请输入设备借用人"
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

    <el-row :gutter="10" v-if="userType=='00'" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['bussiness:equipment:add']"
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
          v-hasPermi="['bussiness:equipment:edit']"
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
          v-hasPermi="['bussiness:equipment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bussiness:equipment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="equipmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备编号" align="center" prop="id"  width="50"/>
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="设备型号" align="center" prop="remark" width="80"/>
      <el-table-column label="所属储柜编号" align="center" prop="lockersCode"/>
      <el-table-column label="使用次数" align="center" prop="useTimes"/>
      <el-table-column label="借还状态" align="center" prop="equipmentStatus" :formatter="stateFormat"/>
      <el-table-column label="设备借用人" align="center" prop="equipmentDept" />
      <el-table-column label="生产日期" align="center" prop="productionTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.productionTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备图片" align="center" prop="equipmentPic" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.equipmentPic" :width="50" :height="50"/>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="userType=='10'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUse(scope.row)"
            v-hasPermi="['bussiness:equipment:edit']"
          >借用</el-button>

          <el-button
            v-if="userType=='10'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleBack(scope.row)"
            v-hasPermi="['bussiness:equipment:edit']"
          >归还</el-button>

          <el-button
            v-if="userType=='00'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bussiness:equipment:edit']"
          >修改</el-button>
          <el-button
            v-if="userType=='00'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bussiness:equipment:remove']"
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

    <!-- 添加或修改设备管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备状态" prop="equipmentStatus">
          <el-select v-model="form.equipmentStatus" placeholder="请选择设备状态">
             <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
             </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属储柜" prop="lockersCode">
          <el-select v-model="form.lockersCode" placeholder="请选择设备状态">
             <el-option
              v-for="item in lockerslist"
              :key="item.lockersCode"
              :label="item.lockersCode"
              :value="item.lockersCode">
             </el-option>
          </el-select>
        </el-form-item>




        <el-form-item label="设备采购时间" prop="supplierTime">
          <el-date-picker clearable size="small"
            v-model="form.supplierTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择设备采购时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备生产日期" prop="productionTime">
          <el-date-picker clearable size="small"
            v-model="form.productionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择设备生产日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备图片">
          <image-upload v-model="form.equipmentPic"/>
        </el-form-item>
        <el-form-item label="设备型号" prop="remark">
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
import { listEquipment, getEquipment, delEquipment, addEquipment, updateEquipment,useEquipment,backEquipment,LockersList } from "@/api/bussiness/equipment";
import { getInfo } from "@/api/login";

export default {
  name: "Equipment",
  data() {
    return {
      lockerslist: "",
      options: [{
          value: '0',
          label: '入库'
        }, {
          value: '1',
          label: '使用中'
        }, {
          value: '2',
          label: '维护中'
        }],
      //用户类型
      userType:" ",
      //当前用户名
      userName:"",
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
      // 设备管理表格数据
      equipmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        remark:null,
        pageNum: 1,
        pageSize: 10,
        equipmentName: null,
        equipmentStatus: null,
        equipmentDept: null,
        supplierTime: null,
        productionTime: null,
        equipmentPic: null,
        lockersCode: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        lockersCode: [
          { required: true, message: "所属储柜不能为空", trigger: "blur" }
        ],
        equipmentName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        equipmentNum: [
          { required: true, message: "设备数量不能为空", trigger: "blur" }
        ],
        equipmentStatus: [
          { required: true, message: "设备状态(0、入库 1、使用中 2、维护中)不能为空", trigger: "blur" }
        ],
        equipmentDept: [
          { required: true, message: "设备使用部门不能为空", trigger: "blur" }
        ],
        equipmentPic: [
          { required: true, message: "设备图片不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getUserInfo();
    this.getLockerslist();
  },
  methods: {
    getUserInfo(){
      getInfo().then(response=> {
        let type=response.user.userType;
        this.userType=type;
        this.userName=response.user.userName;
      });
    },
    getLockerslist(){
        LockersList().then(response => {
        this.lockerslist = response.lockerslist;
      });
    },
    /** 查询设备管理列表 */
    getList() {
      this.loading = true;
      listEquipment(this.queryParams).then(response => {
        this.equipmentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //设备状态(0、入库 1、使用中 2、维护中)
    stateFormat(row, column) {
      console.log(row.equipmentStatus)
      if (row.equipmentStatus === '0') {
        return '入库'
      } else if (row.equipmentStatus === '1') {
        return '使用中'
      } else if (row.equipmentStatus === '2') {
        return '维护中'
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
        equipmentName: null,
        
        equipmentStatus: "0",
        equipmentDept: null,
        supplierTime: null,
        productionTime: null,
        equipmentPic: null,
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
      this.title = "添加设备管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEquipment(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEquipment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEquipment(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除设备管理编号为"' + ids + '"的数据项？').then(function() {
        return delEquipment(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 借用按钮操作 */
    handleUse(row){

      let equipmentStatus=row.equipmentStatus
     
      if(equipmentStatus=='1'){
         this.$modal.msgError("当前设备已被借用，请耐性等候！");
         return;
      }else{
         const id = row.id || this.ids;
       this.$modal.confirm('是否确认借用设备编号为"' + id + '"的数据项？').then(function() {
        return useEquipment(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("借用成功");
      }).catch(() => {});
      }

      
    },

     /** 归还按钮操作 */
    handleBack(row){
      const id = row.id || this.ids;
      let useUser=row.equipmentDept;
      if(useUser!=this.userName){
        this.$modal.msgError("只能归还自己借用的设备！");
        this.$modal.msge
        return;
      }else{
           
       this.$modal.confirm('是否确认归还设备').then(function() {
        return backEquipment(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("归还成功");
      }).catch(() => {});
      }

    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('bussiness/equipment/export', {
        ...this.queryParams
      }, `equipment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
