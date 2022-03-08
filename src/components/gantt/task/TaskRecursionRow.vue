<template>
  <div>
    <template  v-for='(item, index) in tasks'>
      <template v-if='headers'>
        <div :key="index + '_task'" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
          <div class="row" v-bind:style="{ height: rowHeight + 'px' }" :key="index + '_row'">
            <template v-for='(header,headerIndex) in headers'>
              <div v-show="header.show" class="cell" :key= headerIndex v-bind:style="{ minWidth: header.width + 'px', maxWidth: header.width + 'px',height: rowHeight + 'px' }">{{ item[mapFields[header.property]]  }}</div>
            </template>
          </div>
        <div :key="index" style="width: 100%;border-top: 1px solid #cecece;margin:0px 0px -1px -1px;"></div>
      </template>
      <TaskRecursionRow :key="index + '_TaskRecursionRow'" :headers='headers' :rowHeight='rowHeight' :tasks='findChildNode(item,allTask)'></TaskRecursionRow>
    </template>
  </div>
</template>
<script>
import { store } from '@/components/gantt/store.js'
export default {
  name: 'TaskRecursionRow',
  props : {
    headers: {
      type: Array,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: 0
    },
    tasks: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    mapFields(){
      return store.mapFields
    },
    allTask() {
      return store.tasks
    }
  },
  methods: {
    findChildNode(item,tasks) {
      return tasks.filter(obj => obj[this.mapFields['parentId']] === item[this.mapFields['id']])
    }
  }
}
</script>
<style lang='less' scoped>
  .row {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;
    border-top: 1px solid #cecece;
    border-right: 0px solid #cecece;
    border-bottom: 1px solid #cecece;
    margin:0px 1px -1px -1px;
    width: fit-content;
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      border-top: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      margin:0px 0px 0px 1px;
    }
  }
</style>