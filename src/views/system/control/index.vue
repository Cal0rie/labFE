<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    	>
      <el-form-item label="管控规则名称" prop="ruleName">
        <el-input
          v-model="queryParams.ruleName"
          placeholder="请输入管控规则名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新人" prop="updateBy">
        <el-input
          v-model="queryParams.updateBy"
          placeholder="请输入更新人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
  		<el-form-item label="更新时间">
        <el-date-picker
					@keyup.enter.native="handleQuery"
          v-model="daterangeUpdateTime "
          size="small"
          style="width: 280px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
  	
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
        <el-date-picker
					@keyup.enter.native="handleQuery"
          v-model="daterangeCreateTime"
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
          v-hasPermi="['control:rule:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['control:rule:remove']"
          >删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      border
      max-height="551"
      v-loading="loading"
      :data="crowdList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      :default-sort="{ prop: 'createTime', order: 'descending' }"
    	>
      <el-table-column type="selection" width="60" align="center" fixed />
      <el-table-column label="序号" align="center" width="60" type="index" fixed />
      <el-table-column label="管控规则名称" width="150" show-overflow-tooltip align="center" prop="ruleName" sortable />
      <el-table-column label="更新人" width="170" show-overflow-tooltip align="center" prop="updateBy" sortable />
      <el-table-column label="更新时间" width="170"  show-overflow-tooltip align="center" prop="updateTime" sortable />
      <el-table-column label="创建者" width="170" show-overflow-tooltip align="center" prop="createBy" sortable/>
      <el-table-column label="创建时间" width="170" show-overflow-tooltip align="center" prop="createTime" sortable/>
      <el-table-column label="是否在用" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_normal_disable"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip width="160" align="center" prop="remark" sortable />
      <el-table-column
        label="操作"
        width="300"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleEnable(scope.row)"
            v-hasPermi="['control:rule:enable']"
            >启用</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-pause"
            @click="handleDisabled(scope.row)"
            v-hasPermi="['control:rule:disabled']"
            >禁用</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row, 'info')"
            v-hasPermi="['control:rule:info']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['control:rule:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['control:rule:remove']"
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

    <!-- 添加、修改-->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    	>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        class="shot-line"
        label-width="120px"
        :disabled="infoShow ? true : false"
      >
        <el-form-item label="管控规则名称" prop="ruleName">
					<el-input
						v-model="form.ruleName"
						placeholder="请输入管控规则名称"
						clearable
						size="small"
					
					/>
				</el-form-item>
        <el-form-item label="管控规则人群" prop="dataType">
					<el-select
						v-model="form.dataType"
						placeholder="请选择管控规则人群"
						clearable
						size="small"
					>
						<el-option
							v-for="dict in dict.type.control_data_type"
							:key="dict.value"
							:label="dict.label"
							:value="dict.value"
						/>
					</el-select>
				</el-form-item>
				<!-- 管控规则逻辑： -->
				<h4 class="title">管控规则逻辑：</h4>
        <template v-for="(item, i) in form.controlRuleDetailsList">
          <div :key="i">
            <el-form-item  :label="i == 0 ? '初始状态' : `第${num2TextFor(i+1)}状态`" :prop="form['controlRuleDetailsList'][i].controlType">
              <el-row :gutter="20">
                <el-col :span="18" style="padding-left:0;">
                  <el-select
                    v-model="form['controlRuleDetailsList'][i].controlType"
                    placeholder="请选择初始状态"
                    clearable
                    size="small"
                    >
                    <el-option
                      v-for="dict in dict.type.control_type"
                      v-if="dict.value != 15"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :label="i == 0 ? '隔离天数' : `第${num2TextFor(i+1)}状态隔离天数`" :prop="form['controlRuleDetailsList'][i].isolationDays">
              <el-row :gutter="20">
                <el-col :span="18" style="padding-left:0;">
                  <template> 
                    <!-- <el-input-number v-model="form['controlRuleDetailsList'][i].isolationDays" placeholder="请输入" controls-position="right" :min="1"  :controls="false" class="inputNumber" />
                    <span class="append">天</span> -->
                    <el-input type="number" v-model="form['controlRuleDetailsList'][i].isolationDays" min="1" placeholder="请输入" oninput="value=value.replace(/\D|^0/g,'')">
                      <template slot="append">天</template>
                    </el-input>
                  </template>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :label="i == 0 ? '核酸节点' : `第${num2TextFor(i+1)}状态核酸节点`" :prop="form['controlRuleDetailsList'][i].nucleicAcidNodeId">
              <el-row :gutter="20">
                <el-col :span="18" style="padding-left:0;">
                  <el-select
                    v-model="form['controlRuleDetailsList'][i].nucleicAcidNodeId"
                    placeholder="请选择核酸节点"
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="(dict, i) in controlRuleUseList"
                      :key="i"
                      :label="dict.nucleicAcidNodeName"
                      :value="dict.id.toString()"
                    />
                  </el-select>
                </el-col>
                <el-col v-if="i == form.controlRuleDetailsList.length -1 && !infoShow" :span="4">
                  <div class="action">
                    <i 
                      v-if="i > 1 "
                      title="删除"
                      class="el-icon-remove-outline remove"
                      @click="deleteFormLine(form.controlRuleDetailsList, i)"
                    ></i>
                    <i
                      title="增加"
                      class="el-icon-circle-plus-outline add"
                      @click="addFormLine(form.controlRuleDetailsList)"
                    ></i>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="!infoShow" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listControl,
  getControl,
  delConfig,
  addControl,
  updateControl,
  getControlRuleUseList,
  controlEnable,
  controlDisabled
} from "@/api/system/control";
import { getToken } from "@/utils/auth";
export default {
  name: "Crowd",
  dicts: ["sys_normal_disable", "control_data_type", 'control_type'],
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
      // 表格数据
      crowdList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 部门名称时间范围
      daterangeCreateTime: [],
      daterangeUpdateTime:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
				pageSize: 10,
				ruleName: null, 
				updateBy: null, 
				updateTime: null,
				status: null,
				createBy: null,	
        createTime: null
      },
      // 表单参数
      form: {
        controlRuleDetailsList: [
        {
          id: null, //详情主键
          controlType: null, //选中状态的值
          isolationDays: undefined, //隔离天数
          nucleicAcidNodeId: null, //选中的核酸节点id
        },
        {
          id: null, //详情主键
          controlType: null, //选中状态的值
          isolationDays: undefined, //隔离天数
          nucleicAcidNodeId: null, //选中的核酸节点id
        },
      ]
      },
      // 表单校验
      rules: {},
      controlRuleUseList:[],
      // 判断修改 详情
      infoShow: false
    };
  },
  created() {
    this.getList();
    this.init();
  },
  methods: {
    init() {
      // 核算节点 下拉数据
      getControlRuleUseList().then(res => {
        this.controlRuleUseList = res.data;
      })
    },
    // 启用
    handleEnable(row) {
       const id = row.id;
      controlEnable(id).then(response => {
        if (response.code == 200) {
           this.$modal.msgSuccess("启用成功");
           this.getList();
        }
      });
    },
    // 禁用
    handleDisabled(row) {
      const id = row.id;
      controlDisabled(id).then(response => {
        if (response.code == 200) {
          this.$modal.msgSuccess("已禁用");
          this.getList();
        }
      });
    },
    /** 查询后沙峪属地特殊人群台账列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      if (null != this.daterangeUpdateTime && '' != this.daterangeUpdateTime) {
        this.queryParams.params["beginUpdateTime"] = this.daterangeUpdateTime[0];
        this.queryParams.params["endUpdateTime"] = this.daterangeUpdateTime[1];
      }
      listControl(this.queryParams).then(response => {
        this.crowdList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.queryParams.isChinese = column.column.sortBy === "isChinese";
      this.handleQuery();
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
        controlRuleDetailsList: [
          {
            id: null, //详情主键
            controlType: null, //选中状态的值
            isolationDays: null, //隔离天数
            nucleicAcidNodeId: null, //选中的核酸节点id
          },
          {
            id: null, //详情主键
            controlType: null, //选中状态的值
            isolationDays: null, //隔离天数
            nucleicAcidNodeId: null, //选中的核酸节点id
          },
        ]
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
      this.daterangeCreateTime = [];
      this.daterangeUpdateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增管控规则";
    },
    /** 修改按钮操作 */
    handleUpdate(row, flag) {
      if (flag) { // 判断是否是查看详情
        this.infoShow = true;
      } else {
        this.infoShow = false;
      }
      // this.reset();
      const id = row.id || this.ids;
      getControl(id).then(response => {
        if (response.data && response.data.controlRuleDetailsList) {
          let parData = response.data;
          parData.controlRuleDetailsList.forEach(item => {
              item['isolationDays'] = item['isolationDays']&&item['isolationDays'].toString();
              item['nucleicAcidNodeId'] = item['nucleicAcidNodeId']&&item['nucleicAcidNodeId'].toString();
          })
          this.form = parData;
        }
        this.open = true;
        this.title = "修改管控规则";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateControl(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addControl(this.form).then(response => {
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
      this.$modal
        .confirm("是否确认删除？")
        .then(function() {
          return delConfig(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 点击添加form表单项
    addFormLine(obj) {
      let itemObj = {
        controlType: null, //选中状态的值
        isolationDays: null, //隔离天数
        nucleicAcidNodeId: null, //选中的核酸节点id
      }
      obj.push(itemObj);
    },
    // 点击删除form表单项
    deleteFormLine(obj,i) {
      obj.splice(i, 1);
    },
    // 数字转文字
    num2TextFor (num) {
        const texts = { 0: '零', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九' }
        const units = ['十', '百', '千', '万']
        let res = ''
        if (num < 10) {
            res = texts[num] || ''
        } else {
            let numSources = (num + '').split('').reverse()
            let _length = numSources.length
            let numTexts = []
            for (let i = 0; i < _length; i++) {
                const cur = Number(numSources[i])
                if (i >= 1 && cur !== 0) {
                    numTexts.unshift(units[i - 1])
                }
                if (i === 0 && cur === 0) {
                    continue
                }
                if (cur === 0 && Number(numSources[i - 1]) === 0) {
                    continue
                }
                if (i === 1 && num < 20) {
                    continue
                }
                numTexts.unshift(this.num2TextFor(cur))
            }
            res = numTexts.join('')
        }
        return res
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
.title {
	padding: 0px;
	margin-bottom: 5px;
	font-size: 17px;
	font-weight: bold;
  display: flex;
  align-items: center;
  color: #5a5757;
  font-size: 16px;
  font-weight: 600;
  &::before {
    margin-right: 6px;
    display: inline-block;
    content: '';
    height: 16px;
    width: 4px;
    background: #377bc8;
    border-radius: 2px;
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
// 详情 弹窗禁用颜色
/deep/.el-input.is-disabled .el-input__inner {
    background-color: #fff;
}
// 数字选择器 样式
/deep/.el-input-number .el-input__inner {
  text-align: left;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.inputNumber {
  width: calc(100% - 55px);
}
.append {
  background-color: #F5F7FA;
    color: #909399;
    vertical-align: middle;
    position: relative;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;
    display: inline-block;
    width: 55px;
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    height: 37px;
}
</style>
