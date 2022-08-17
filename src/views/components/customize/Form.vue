<template>
  <div id="formDetail">
      <el-form
        class="shot-line"
        ref="form"
        :model="formModel"
        :rules="rules"
        label-width="120px"
      >
			<template v-for="(item, i) in newFormData">
				<div :key="i">
          <!-- 如果不是导入时间 和修改时间 -->
          <template v-if="item.colName !== 'updateTime' && item.colName !== 'createTime' && item.colName !== 'rowNum'"> 
					  <el-form-item v-if="item.isSelect" :label="item.label" :prop="item.colName">
              <!-- 常规、文本 -->
              <template v-if="item.inputType == 'input' || item.inputType == 'text'"> 
                <el-input v-model="formModel[item.colName]" :placeholder="`请输入${item.label}`" />
              </template>
              <!-- 数字 -->
              <template v-if="item.inputType == 'number'"> 
                <!-- <el-input type="number" v-model="formModel[item.key]" :placeholder="`请输入${item.label}`" /> -->
                <el-input-number v-model="formModel[item.colName]" :placeholder="`请输入${item.label}`" controls-position="right" :precision="0" :controls="false" style="width:100%;" />
              </template>
              <!-- 小数 -->
              <template v-if="item.inputType == 'double'"> 
                <el-input-number v-model="formModel[item.colName]" :placeholder="`请输入${item.label}`" controls-position="right" :precision="item.percentPrecision" :controls="false" style="width:100%;" />
              </template>
              <!-- 百分比 -->
              <template v-if="item.inputType == 'percent'"> 
                <!-- 如果存在小数 -->
                <!-- <div v-if="item.percentPrecision"> -->
                  <el-input-number v-model="formModel[item.colName]" :placeholder="`请输入${item.label}`" controls-position="right" :precision="item.percentPrecision ? item.percentPrecision : 0" :controls="false" class="inputNumber" />
                  <span class="append">%</span>
                <!-- </div> -->
                <!-- 不存在 -->
                <!-- <el-input v-else type="number" v-model="formModel[item.colName]" :placeholder="`请输入${item.label}`">
                  <template slot="append">%</template>
                </el-input> -->
              </template>
              <!-- 时间选择器 -->
              <template v-if="item.inputType == 'time'"> 
                <el-time-picker clearable value-format="HH:mm:ss" v-model="formModel[item.colName]" :placeholder="`请选择${item.label}`"></el-time-picker>
              </template>
              <!-- 日期选择器 -->
              <template v-if="item.inputType == 'date'"> 
              <el-date-picker type="date" clearable value-format="yyyy-MM-dd" v-model="formModel[item.colName]" :placeholder="`请选择${item.label}`"></el-date-picker>
              </template>
              <!-- 日期时间选择器 -->
              <template v-if="item.inputType == 'datetime'"> 
                <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" clearable v-model="formModel[item.colName]" :placeholder="`请选择${item.label}`"></el-date-picker>
              </template>
              <!-- 下拉框 -->
              <template v-if="item.inputType == 'combobox'"> 
                <el-select v-model="formModel[item.colName]" filterable clearable :placeholder="`请选择${item.label}`">
                  <template v-if="item.dictTable">
                    <el-option
                      v-for="(item, index) in $store.state.customize.totalDicts[item.dictTable]"
                      :key="index"
                      :label="item.dictLabel"
                      :value="item.dictLabel"
                    ></el-option>
                  </template>
                  <!-- 区域特殊处理 -->
                  <template v-else-if="item.colName == 'deptName'">
                    <el-option
                      v-for="(item, index) in deptList"
                      :key="index"
                      :label="item.deptName"
                      :value="item.deptName"
                    ></el-option>
                  </template>
                  <template v-else>
                    <el-option
                      v-for="item in item.dictValue&&item.dictValue.split(',')"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </template>
                </el-select>
              </template>
           
					  </el-form-item>
          </template>
				</div>
			</template>

      </el-form>

  </div>
</template>

<script>
export default {
  name: "Form",
  props:{
    // 下拉框区域数据渲染
    deptList: {
      type:Array,
      default:function() {
        return []
      }
    },
    // 自定义数据渲染
    formData: {
      type:Array,
      default:function() {
        return []
      }
    },
    // 表单数据字段
    formModel: {
      type: Object,
      default:function() {
        return {
          id: 10001,
          no:222,
        }
      }
    },
  },
  data() {
    var validateIdCode = (rule, value, callback) => {
     var {pass, tip} = this.isCardIDValid(value)
      if (value === '') {
        callback(new Error('身份证号不能为空'));
      } else if (!pass) {
        callback(new Error(tip));
      } else {
        callback();
      }
    };
    return {
      newFormData: [],
			// 表单参数
      form: {},
      // 表单校验
      rules: {
        // idCode: [ // 身份证号验证
        //   { required: true, validator: validateIdCode, trigger: "blur" },
        // ],
        idName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        // idType: [
        //   { required: true, message: "证件类型不能为空", trigger: "chcange" }
        // ],
        idCode: [// 身份证号验证
          { required: true, message: "证件号码不能为空", trigger: "blur" }
        ],
        // phone: [
        //   { required: true, message: "手机号码不能为空", trigger: "blur" }
        // ],
      },
    };
  },
  created() {},
  methods: {
    // 自定义验证身份证号 fun
    isCardIDValid(code) {
        const city = {
            11: '北京',
            12: '天津',
            13: '河北',
            14: '山西',
            15: '内蒙古',
            21: '辽宁',
            22: '吉林',
            23: '黑龙江 ',
            31: '上海',
            32: '江苏',
            33: '浙江',
            34: '安徽',
            35: '福建',
            36: '江西',
            37: '山东',
            41: '河南',
            42: '湖北 ',
            43: '湖南',
            44: '广东',
            45: '广西',
            46: '海南',
            50: '重庆',
            51: '四川',
            52: '贵州',
            53: '云南',
            54: '西藏 ',
            61: '陕西',
            62: '甘肃',
            63: '青海',
            64: '宁夏',
            65: '新疆',
            71: '台湾',
            81: '香港',
            82: '澳门',
            91: '国外 '
        };
        let tip = '';
        let pass = true;
        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            tip = '身份证号格式错误';
            pass = false;
        } else if (!city[code.substr(0, 2)]) {
            tip = '身份证地址编码错误';
            pass = false;
        } else {
            // 18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                // ∑(ai×Wi)(mod 11)
                // 加权因子
                let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                // 校验位
                let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                let sum = 0;
                let ai = 0;
                let wi = 0;
                for (let i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                if (parity[sum % 11] != code[17]) {
                    tip = '身份证校验位错误';
                    pass = false;
                }
            }
        }
        return { pass, tip };
    }
  },
  watch: {
     formData: {
      handler(newVal, oldVal) {
        this.newFormData = newVal;
         this.$addDicts(newVal.map(val => {if(val.dictTable) return val.dictTable}));
      
      },
      immediate:true
    }
  },
  computed: {},
};
</script>
<style lang="less" scoped>
.flex(@d: row, @j: flex-start, @a: center) {
  display: flex;
  flex-direction: @d;
  justify-content: @j;
  align-items: @a;
}
/deep/ .shot-line {
  .el-form-item__label {
    min-height: 36px;
    .flex(@j: flex-end);
    line-height: 1.2;
  }

  .el-select,
  .el-date-editor {
    width: 100%;
  }
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

