<!--  -->
<template>
  <div class="form-wrap">
    <div class="f-t">
      <span>表单字段选择：</span>
      <el-button
        type="primary"
        icon="el-icon-document"
        size="small"
        @click="sendFormInfo"
        >生成表单</el-button
      >
    </div>
    <div class="c-p">
      <div class="intro">
        <span>字段名称</span>
        <span>数据格式</span>
        <span>操作</span>
      </div>
      <div class="c-p-l">
        <draggable :list="selectArray" v-bind="dragOptions" handle=".sort">
          <transition-group type="transition" name="flip-list">
            <div class="line" v-for="item in selectArray" :key="item.ordid">
              <!-- 选择框 -->
              <div class="sel-box">
                <el-checkbox
                  :disabled="item.isfixedSelect === 1"
                  :true-label="1"
                  :false-label="0"
                  v-model="item.isSelect"
                />
                <el-input
                  placeholder="请命名"
                  size="mini"
                  class="click-input"
                  v-model="item.label"
                  :readonly="item.isUdf === 0"
                ></el-input>
              </div>
              <!-- 下拉框 -->
              <div class="mini-select">
                <el-select
                  clearable
                  v-model="item.inputType"
                  size="mini"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(val, inx) in options"
                    :key="inx"
                    :label="val.label"
                    :value="val.value"
                  >
                  </el-option>
                </el-select>
                <div class="cover" @click="showCustomizeModal(item)"></div>
              </div>
              <!-- 操作按钮 -->
              <div>
                <i title="移动" class="el-icon-s-operation sort"></i>
                <i
                  title="删除"
                  v-show="item.isfixedSelect !== 1 && item.isUdf"
                  class="el-icon-remove-outline remove"
                  @click="deleteFormLine(selectArray, item.id)"
                ></i>
                <i
                  title="增加"
                  class="el-icon-circle-plus-outline add"
                  @click="addFormLine"
                ></i>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
    <el-dialog
      class="chose-data-dialog"
      title="选择数据格式"
      size="small"
      :visible.sync="dialogVisible"
      width="460px"
    >
      <div class="c-d-t">数据格式</div>
      <div class="c-d-m">
        <el-radio-group
          v-model="customizeData.inputType"
          @change="changeSelectInputType"
        >
          <el-radio
            v-for="(val, inx) in options"
            :key="inx"
            :label="val.value"
            >{{ val.label }}</el-radio
          >
        </el-radio-group>
        <div class="c-d-r">
          <div
            class="dialog-select"
            v-if="customizeData.inputType === 'combobox'"
          >
            <span>字典值：</span>
            <el-select
              style="width: 160px"
              clearable
              filterable
              v-model="customizeData.dictTable"
              @change="changeDictSelect"
              size="small"
              placeholder="请选择数据字典"
            >
              <el-option label="自定义" value="自定义"></el-option>
              <el-option
                v-for="(item, index) in dictsTypeList"
                :key="index"
                :label="item.dictName"
                :value="item.dictType"
              >
              </el-option>
            </el-select>
          </div>
          <div
            class="dialog-select"
            v-if="customizeData.dictTable === '自定义'"
          >
            <span>自定义：</span>
            <el-input
              size="small"
              placeholder="输入字典值，使用‘逗号’分隔"
              @blur="blurDictValue"
              v-model="customizeData.dictValue"
            />
          </div>
          <div class="dialog-exemplary">
            <div v-show="customizeData.inputType === 'input'">张三</div>
            <div v-show="customizeData.inputType === 'text'">
              <div>张三</div>
              <div>100</div>
            </div>
            <div v-show="customizeData.inputType === 'number'">100</div>
            <div v-show="customizeData.inputType === 'double'">
              <div>100.00</div>
              <div>100.0</div>
            </div>
            <div v-show="customizeData.inputType === 'percent'">
              <div>72%</div>
              <div>72.00%</div>
            </div>
            <div v-show="customizeData.inputType === 'date'">
              <div>2022年1月1日</div>
              <div>2022.1.1</div>
              <div>2022/1/1</div>
            </div>
            <div v-show="customizeData.inputType === 'time'">24:00:00</div>
            <div
              class="dialog-select"
              v-show="
                customizeData.tempDictLabel &&
                customizeData.inputType === 'combobox'
              "
            >
              <span>{{ customizeData.tempDictLabel }}：</span>
              <el-select
                style="width: 160px"
                clearable
                size="small"
                v-model="customizeData.tempDictTable"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in $store.state.customize.totalDicts[
                    customizeData.dictTable
                  ]"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="dialog-intro">
            <div v-show="customizeData.inputType === 'input'">
              说明：常规数据格式不包含任何特殊数字格式，输入什么显示什么。
            </div>
            <div v-show="customizeData.inputType === 'text'">
              说明：文本格式将数据作为文本处理，假如数据为数值，同样作为文本处理。
            </div>
            <div v-show="customizeData.inputType === 'number'">
              说明：整数数据一般应用于数字，不包含小数。
            </div>
            <div v-show="customizeData.inputType === 'double'">
              说明：小数数据一般应用于数字，包含小数点。
            </div>
            <div v-show="customizeData.inputType === 'percent'">
              说明：百分比数据一般应用于数字，表示百分比，显示时只显示%前数字。
            </div>
            <div v-show="customizeData.inputType === 'date'">
              说明：日期数据格式将日期和时间序列数值显示为日期值。
            </div>
            <div v-show="customizeData.inputType === 'time'">
              说明：日期数据格式将日期和时间序列数值显示为日期值。
            </div>
            <div v-show="customizeData.inputType === 'combobox'">
              说明：下拉框数据格式指数据在输入前提前定义字典，数据只能从字典中选择。
            </div>
            <div
              class="dialog-input"
              v-if="
                customizeData.inputType === 'double' ||
                customizeData.inputType === 'percent'
              "
            >
              <span>小数点位数：</span>
              <el-input
                size="mini"
                style="width: 80px"
                type="number"
                :max="4"
                v-model="customizeData.percentPrecision"
              >
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCustomizeFormInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listType } from "@/api/system/dict/type";

import draggable from 'vuedraggable';

export default {
  name: 'formComp',
  components: {	draggable },
  data () {
    return {
      dialogVisible: false,
      customizeData:{
        inputType: 'input', // 自定义表单类型
        temporaryCustomizeIndex: null, // 暂时存储操作的数据index
        percentPrecision: null,
        dictTable: null, // 选择下拉字典
        dictValue: null,
        tempDictTable: null, // 示例字典值
        tempDictLabel: null // 示例字典名称
      },
      dictsTypeList: null, // 所有字典列表
      queryParams: {
        pageNum: 1,
        pageSize: 1000,
        useType: 1
      },
      options: [{
        value: 'input',
        label: '常规'
      }, {
        value: 'text',
        label: '文本'
      }, {
        value: 'number',
        label: '整数'
      }, {
        value: 'double',
        label: '小数'
      }, {
        value: 'percent',
        label: '百分比'
      }, {
        value: 'date',
        label: '日期选择器'
      }, {
        value: 'time',
        label: '时间选择器'
      },
      //  {
      //   value: 'datetime',
      //   label: '日期时间选择器'
      // },
      {
        value: 'combobox',
        label: '下拉框'
      }],
      selectArray: []
    };
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    channelId: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.init();
  },
  watch:{
    list() {
      this.selectArray = this.list.map(val => val);
    }
  },
  methods: {
    // 查询字典类型列表
    init() {
      listType(this.queryParams).then(response => { this.dictsTypeList = response.rows; });
    },
    sort(array) {
      array = array.sort((a, b) => a.ordid - b.ordid);
    },
    // 增加自定义表单项
    addFormLine() {
      let time = new Date().getTime();
      let obj = {
        channelId: this.channelId,
        label: '',
        colName: '',
        id: time,
        isSelect: 1,
        isfixedSelect: 0,  // 是否固定不可修改
        isUdf: 1, // 是否预制 0是
        ordid: this.selectArray.length + 1,
        inputType: 'input',
        percentPrecision: null, // 小数点位数
        dictValue: null, // 用户自定义字典值
        dictTable: null
      }
      this.selectArray.push(obj);
    },
    // 删除自定义表单项
    deleteFormLine(array, id) {
      array.forEach((value, index) => value.id === id && this.$delete(array, index));
    },
    // 发送自定义表单项
    sendFormInfo() {
      let arr = JSON.parse(JSON.stringify(this.selectArray));
      // 所有字段默认设置，可以查询
      arr.forEach((val, inx) => { val.ordid = inx + 1; val.isDisplay = val.isSelect; });
      this.$emit('sendFormInfo', arr);
    },
     // 展示表单类型选择框
    showCustomizeModal(item) {
      if(item.isfixedSelect || item.isUdf === 0) { return false; }
      for(let key in this.customizeData) { this.customizeData[key] = null; }
      this.customizeData = Object.assign(this.customizeData, item);
      // 记录当前操作数据index
      this.selectArray.forEach((value, index) => {
        if(value.id === item.id) {this.customizeData.temporaryCustomizeIndex = index } 
      });
      // 如果当前类型为下拉框，加载下拉框数据
      this.$addDicts(item.dictTable);
      this.dialogVisible = true;
    },
    // 切换表单类型，清空数据
    changeSelectInputType() {
      this.customizeData.percentPrecision = null;
      this.customizeData.dictTable = null;
      this.customizeData.dictValue = null;
      this.customizeData.tempDictTable = null;
      this.customizeData.tempDictLabel = null;
    },
    // 选择字典类型
    changeDictSelect(value) {
      this.customizeData.tempDictTable = null;
      if(!value) { 
        this.customizeData.tempDictTable = null;
        return false;
      } else if (value === '自定义') {
        this.customizeData.tempDictLabel = '自定义';
        // 清空历史自定义下拉框数据
        this.$store.commit('customize/SET_DICTS_OPTION', { '自定义': [] });
        return false;
      }
      this.customizeData.tempDictLabel = this.dictsTypeList.filter(val => val.dictType === value)[0].dictName;
      this.$addDicts(value);
    },
    // 确定自定义数据
    getCustomizeFormInfo() {
      // 用index获取操作的数据源
      let operationItem = this.selectArray[this.customizeData.temporaryCustomizeIndex];
      operationItem = Object.assign(operationItem, this.customizeData);
      this.dialogVisible = false;
    },
    // 自定义下拉框，切割逗号
    blurDictValue() {
      let arr = this.customizeData.dictValue.replace(/，/g, ',').split(",");
      let dictList = arr.map(value => { return { 'dictLabel': value, 'dictValue': value } });
      this.$store.commit('customize/SET_DICTS_OPTION', { '自定义': dictList });
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  }
};

</script>
<style lang='less' scoped>
.flex(@d: row, @j: flex-start, @a: center) {
  display: flex;
  flex-direction: @d;
  justify-content: @j;
  align-items: @a;
}

.form-wrap {
  width: 100%;
  height: 100%;
  padding: 0 0 0 15px;
  .f-t {
    padding: 0 15px;
    color: #333333;
    height: 60px;
    .flex(@j: space-between);
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
  }
  .intro {
    .flex;
    padding-left: 23px;
    color: #409eff;
    height: 40px;
    font-size: 14px;
    span:nth-child(2) {
      margin: 0px 56px 0 119px;
    }
  }
  .line {
    .flex;
    font-size: 14px;
    height: 32px;
    .sel-box {
      padding-right: 8px;
      width: 195px;
      height: 32px;
      .flex(@j:space-between);
      /deep/ .click-input {
        margin-left: 5px;
        width: clac(100% - 15px - 5px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .el-input__inner {
          padding: 0 3px;
          font-size: 14px;
          border-color: transparent;
          &[readonly] {
            border: none;
          }
          &:hover {
            border-color: #c0c4cc;
          }
          &:focus {
            outline: none;
            border-color: #1890ff;
          }
        }
      }
      // /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      //   background-color: #1890ff;
      //   border-color: #1890ff;
      //   &::after {
      //     border-color: #fff;
      //   }
      // }
    }
    .mini-select {
      position: relative;
      width: 95px;
      height: 100%;
      margin-right: 8px;
      .cover {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        cursor: pointer;
        line-height: 28px;
      }
      &:hover {
        /deep/ .el-select .el-input__inner {
          border-color: #c0c4cc;
        }
      }
    }
    i {
      display: none;
      font-size: 16px;
      cursor: pointer;
      &.add {
        color: #47a473;
      }
      &.remove {
        color: #b26768;
        margin-right: 6px;
      }
      &.sort {
        margin-right: 6px;
        color: #409eff;
      }
    }
    &:hover {
      .remove {
        display: inline-block;
      }
      .sort {
        display: inline-block;
      }
    }
    &:last-child:hover {
      .add {
        display: inline-block;
      }
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
}

/deep/ .chose-data-dialog {
  font-size: 14px;
  .el-dialog__body {
    padding: 0 18px;
  }
  .c-d-t {
    color: #333333;
    font-size: 14px;
    line-height: 46px;
    border-top: 1px solid #f0f0f0;
  }
  .c-d-m {
    display: flex;
    .el-radio-group {
      padding: 10px;
      .flex(@d: column, @a: flex-start);
      width: 160px;
      border: 1px solid #dddddd;
      border-radius: 4px;
      .el-radio {
        line-height: 28px;
        .el-radio__input {
          display: none;
        }
      }
    }
    .c-d-r {
      margin-left: 7px;
      width: calc(100% - 160px - 7px);
      .dialog-exemplary {
        position: relative;
        padding: 18px;
        height: 100px;
        border: 1px solid #dddddd;
        border-radius: 4px;
        &::before {
          position: absolute;
          display: block;
          top: -10px;
          left: 8px;
          content: '示例：';
          height: 20px;
          width: 50px;
          background: #fff;
          text-align: center;
        }
        div {
          line-height: 20px;
        }
      }
      .dialog-intro {
        margin-top: 10px;
        color: #666666;
        line-height: 18px;
      }
      .dialog-input {
        margin-top: 10px;
        .flex;
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      }
      .dialog-select {
        margin-bottom: 15px;
        .flex;
        span {
          font-size: 14px;
        }
        .el-input,
        .el-select {
          flex: 1;
        }
      }
    }
  }
}
</style>
