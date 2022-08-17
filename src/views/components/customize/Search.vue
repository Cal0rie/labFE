<template>
  <div id="formSearch" @mouseleave="mouseleave" @mouseover="mouseover">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      :disabled="readOnly ? true : false"
    >
      <template v-for="(item, i) in formData">
        <template
          v-if="
            item.colName !== 'rowNum' && item.colName !== 'notExtensionFileName'
          "
        >
          <el-form-item
            v-if="item.isDisplay"
            :label="item.label"
            :prop="item.colName"
            :key="i"
          >
            <!-- <el-input v-model="queryParams[item.colName]" :placeholder="`请输入${item.label}`"  style="width: 160px" size="small"/> -->
            <!-- 常规、文本 -->
            <template
              v-if="item.inputType == 'input' || item.inputType == 'text'"
            >
              <el-input
                v-model="queryParams[item.colName]"
                :placeholder="`${item.label}`"
                clearable
                style="width: 160px"
                size="small"
              />
            </template>
            <!-- 数字 -->
            <template v-if="item.inputType == 'number'">
              <el-input
                v-model="queryParams[item.colName]"
                :placeholder="`${item.label}`"
                clearable
                style="width: 160px"
                size="small"
              />
              <!-- <el-input-number v-model="queryParams[item.colName]" :placeholder="`请输入${item.label}`" controls-position="right" :precision="0" :controls="false"  style="width: 160px" size="small" /> -->
            </template>
            <!-- 小数 -->
            <template v-if="item.inputType == 'double'">
              <el-input
                v-model="queryParams[item.colName]"
                :placeholder="`${item.label}`"
                clearable
                style="width: 160px"
                size="small"
              />
              <!-- <el-input-number v-model="queryParams[item.colName]" :placeholder="`请输入${item.label}`" controls-position="right" :precision="item.percentPrecision" :controls="false"  style="width: 160px" size="small" /> -->
            </template>
            <!-- 百分比 -->
            <template v-if="item.inputType == 'percent'">
              <el-input
                v-model="queryParams[item.colName]"
                :placeholder="`${item.label}`"
                clearable
                style="width: 160px"
                size="small"
              />
              <!-- 需要判断的是否存在小数 -->
              <!-- <div style="width: 160px">
                <el-input-number v-model="queryParams[item.colName]" :placeholder="`请输入${item.label}`" controls-position="right" :precision="item.percentPrecision ? item.percentPrecision : 0" :controls="false"/>
              </div> -->
            </template>
            <!-- 时间选择器 -->
            <template v-if="item.inputType == 'time'">
              <!-- <el-time-picker  clearable value-format="HH:mm:ss" v-model="queryParams[item.colName]" :placeholder="`请选择${item.label}`" style="width: 160px" size="small"></el-time-picker> -->
              <el-time-picker
                is-range
                clearable
                value-format="HH:mm:ss"
                v-model="queryParams[item.colName]"
                style="width: 240px"
                size="small"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-time-picker>
            </template>
            <!-- 日期选择器 -->
            <template v-if="item.inputType == 'date'">
              <!-- <el-date-picker type="date" clearable value-format="yyyy-MM-dd" v-model="queryParams[item.colName]" :placeholder="`请选择${item.label}`"  style="width: 160px" size="small"></el-date-picker> -->
              <el-date-picker
                v-model="queryParams[item.colName]"
                clearable
                size="small"
                style="width: 240px"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </template>
            <!-- 日期时间选择器 -->
            <template v-if="item.inputType == 'datetime'">
              <!-- <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" clearable v-model="queryParams[item.colName]" :placeholder="`请选择${item.label}`"  style="width: 160px" size="small"></el-date-picker> -->
              <el-date-picker
                v-model="queryParams[item.colName]"
                clearable
                style="width: 240px"
                size="small"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </template>
            <!-- 下拉框 -->
            <template v-if="item.inputType == 'combobox'">
              <el-select
                v-model="queryParams[item.colName]"
                :placeholder="`${item.label}`"
                filterable
                clearable
                style="width: 160px"
                size="small"
              >
                <template v-if="item.dictTable">
                  <el-option
                    v-for="(item, index) in $store.state.customize.totalDicts[
                      item.dictTable
                    ]"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictLabel"
                  ></el-option>
                </template>
                <!-- 所属社区 数据单独处理-->
                <template v-else-if="item.colName == 'deptName'">
                  <el-option
                    v-for="(item, index) in deptList"
                    :key="index"
                    :label="item.deptName"
                    :value="item.deptName"
                  ></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </template>
                <template v-else>
                  <el-option
                    v-for="item in item.dictValue && item.dictValue.split(',')"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </template>
              </el-select>
            </template>
            <i
              v-show="readOnly && closeShow"
              class="el-icon-error myCloseStyle"
              @click="closeItem(i, item)"
            ></i>
          </el-form-item>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Search",

  props: {
    // 下拉框区域数据渲染
    deptList: {
      type:Array,
      default:function() {
        return []
      }
    },
    // 数据渲染
    formData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /* 只读 */
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 表单参数
      queryParams: {},
      // 默认隐藏 删除按钮
      closeShow:false,
      dicts: ['user_document_type'],
    };
  },
  mounted () {
  },
  created() {},
  methods: {
    // 鼠标移除
    mouseleave() {
      this.closeShow = false; // 隐藏删除按钮
    },
    // 鼠标移入
    mouseover() {
      this.closeShow = true; // 展示删除按钮
    },
    // 删除 单项
		closeItem(index, data) {
      // this.formData.splice(index, 1); // 不做数据删除 更改字段值
      data.isDisplay = 0;
      this.$emit('SearchParams', this.formData); // 获取最终数据
		}
  },
  watch:{
    formData(newArray) {
      this.$addDicts(newArray.map(val => {if(val.dictTable) return val.dictTable}));
    }
  },
  computed: {}
};
</script>
<style lang="less" scoped>
#formSearch {
  .myCloseStyle {
    position: absolute;
    top: -8px;
    right: -10px;
    font-size: 18px;
    cursor: pointer;
    color: #a44747;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    background-color: #fff;
  }
  // 数字选择器 样式
  /deep/.el-input-number .el-input__inner {
    text-align: left;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  // 数字选择器 样式
  /deep/.el-input--suffix .el-input__inner {
    padding-right: 0px;
  }
  .inputNumber {
    width: calc(100% - 55px);
  }
  .append {
    background-color: #f5f7fa;
    color: #909399;
    vertical-align: middle;
    position: relative;
    border: 1px solid #dcdfe6;
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
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
