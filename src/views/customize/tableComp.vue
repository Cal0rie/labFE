<template>
  <div class="container" v-if="headerList.length > 0">
    <div class="scrollBox">
      <div class="scrollChild">
        <Table
        class="Table"
        :tableData="tableData"
        :headerList="headerList"
        :total="total"
        :permission="permission"
        :readOnly="isReadOnly"
        >
            <div slot="search">
                <Search ref="searchForm" @SearchParams="searchParams" :formData="headerList" :readOnly="isReadOnly"></Search>
            </div>
            <template v-slot:handle="{ row }">
              <el-button
              size="mini"
              type="text"
              icon="Edit"
              @click="handleUpdate(row)"
              v-hasPermi="[`basic:${permission}:edit`]"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              icon="Delete"
              @click="handleDelete(row)"
              v-hasPermi="[`basic:${permission}:remove`]"
            >删除</el-button>
          </template>
        </Table>
      </div>
    </div>
    <div class="applyBtn">
      <el-button
          type="primary"
          :disabled="isDisabled"
          @click="handleApply"
        >应用</el-button>
    </div>
  </div>
</template>

<script>
import Search from "@/views/components/customize/Search";
import Table from "@/views/components/customize/Table";
import { applyCustomizelist } from "@/api/customize/customize";
export default {
  name: "tableComp",
  components: {
    Table,
    Search
  },
    props: {
    // 接受数据
    showTableInfo: {
      type: Array,
      default: function() {
        return [];
      }
    },
  },
  data() {
    return {
      // 表格数据
      tableData: [
        {
          id: "0100"
        }
			],
			// 自定义参数
			headerList: [],
			// 权限 字段
      permission: "basepopulationinfo",
      // 遮罩层
      loading: false,
      // 只读状态
      isReadOnly: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 3
      },
      isDisabled: true
    };
  },
  created() {
    this.isDisabled = this.$cache.local.getJSON('isDisabled') || true;
  },
  methods: {
    // 调用应用接口
    handleApply() {
      applyCustomizelist(this.headerList).then(response => {
				if (response.code == 200) {
          this.$modal.msgSuccess("修改成功，文件中心生成模板");
          this.isDisabled = true;
          this.$cache.local.set('isDisabled', true);
				}
      });
    },
    // 删除 搜索项 更新数据
    searchParams(params) {
      this.headerList = params;
    },


  },
  watch:{
    showTableInfo(newArray) {
      this.headerList = newArray;
      if (this.$cache.local.getJSON('isDisabled') !== undefined) {
        this.isDisabled = this.$cache.local.getJSON('isDisabled');
      }
    }
  },
};
</script>
<style lang="less" scoped>
.container {
  /* width: 1500px; */
  height: 100%;
}
.scrollBox {
  overflow: auto;
  padding: 15px;
  height: calc(100% - 100px);
}
  /*修改滚动条样式*/
  div::-webkit-scrollbar{
    width:5px;
    height: 8px;
    /**/
  }
   div::-webkit-scrollbar-track{
    background: #f5f7fa;
    border-radius:2px;
  }
   div::-webkit-scrollbar-thumb{
    background: #d8eafa;
    border-radius:10px;
  }
   div::-webkit-scrollbar-thumb:hover{
    background: #3ca1ff;
  }
  div::-webkit-scrollbar-corner{
    background: #f5f7fa;
  }
.scrollChild {
  width: 1500px;
  // height: 520px;
  min-height: 520px;
  height: 100%;
}
.applyBtn {
  text-align: center;
  margin-top: 20px;
}
</style>

