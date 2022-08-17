<!-- 人口信息表单管理 -->
<template>
  <div class="wrap">
    <div class="form-left">
      <formComp
        @sendFormInfo="sendFormInfo"
        :list="list"
        :channelId="channelId"
      />
    </div>
    <div class="table-right">
      <tableComp :showTableInfo="showTableInfo" />
    </div>
  </div>
</template>

<script>

import { getCustomizelist } from "@/api/customize/customize";

import formComp from './formComp.vue'
import tableComp from './tableComp.vue'

export default {
  name: 'populationCustomize',
  components: {formComp , tableComp},
  data () {
    return {
      showTableInfo: [],
      list:[]
    };
  },
  created () {
    this.init();
  },
  mounted () {
  },
  methods: {
    init() {
      let index = this.$route.path.lastIndexOf('/') + 1;
      let channelId;
      if(index > 0){
        switch(this.$route.path.slice(index)){
          case 'populationCustomize':{
            channelId = 11;
            break;
          }
          case 'vaccinationCustomize':{
            channelId = 12;
            break;
          }
          case 'dispatchCustomize':{
            channelId = 13;
            break;
          }
          case 'contactCustomize':{
            channelId = 14;
            break;
          }
          case 'secondContactCustomize':{
            channelId = 15;
            break;
          }
        }
      }
      this.channelId = channelId;
      getCustomizelist({channelId}).then(response => { 
        this.list = response.rows;
        this.showTableInfo =JSON.parse(JSON.stringify(response.rows));
      });
    },
    sendFormInfo(formInfo) {
      this.showTableInfo = formInfo.map(val => val);
      this.$cache.local.setJSON('isDisabled', false);
    }
  },
  computed: {},
};

</script>

<style lang="less" scoped>
.flex(@d: row, @j: flex-start, @a: flex-start) {
  display: flex;
  flex-direction: @d;
  justify-content: @j;
  align-items: @a;
}
.wrap {
  padding: 10px;
  width: 100%;
  height: calc(100vh - 84px);
  @width: 400px;
  background: #f2f2f5;
  .flex;
  .form-left {
    width: @width;
    height: 100%;
    min-height: 400px;
    margin-right: 10px;
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .table-right {
    width: calc(100% - @width - 10px);
    height: 100%;
    background: #fff;
  }
}
</style>
